<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../store/user'
import { getJournalPage, getJournalSummary, saveJournal, deleteJournal, exportJournals, importJournals, type JournalSummary } from '../api/journal'

type Entry = { id: string; content: string; tags: string[]; date: string; createdAt: string; updatedAt: string; images: string[] }
const user = useUserStore()
const storageKey = `admin-demo:journal:v1:${user.username || 'local'}`
const entries = ref<Entry[]>([])
const storageError = ref('')
const loaded = ref(false)
function validEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false
  const e = value as Entry
  return typeof e.id === 'string' && !!e.id && typeof e.content === 'string' && e.content.trim().length > 0 &&
    typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && !Number.isNaN(Date.parse(e.date)) &&
    typeof e.createdAt === 'string' && !Number.isNaN(Date.parse(e.createdAt)) &&
    typeof e.updatedAt === 'string' && !Number.isNaN(Date.parse(e.updatedAt)) &&
    Array.isArray(e.tags) && e.tags.every(t => typeof t === 'string') &&
    Array.isArray(e.images) && e.images.length <= 3 && e.images.every(i => typeof i === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(i))
}
const fetching = ref(false)
const saving = ref(false)
const importing = ref(false)
const exporting = ref(false)
const currentPage = ref(1)
const pageSize = 10
const total = ref(0)
const summary = ref<JournalSummary>({ total: 0, writtenDays: 0, days: {}, tags: [] })
const localBackup = ref('')
try { localBackup.value = localStorage.getItem(storageKey) ?? '' } catch { /* Local backups may be unavailable. */ }
function errorMessage(error: unknown) {
  const e = error as { response?: { data?: { message?: string } }; message?: string }
  return e.response?.data?.message || e.message || '请求失败，请检查后端服务'
}
let requestVersion = 0
async function loadEntries() {
  const version = ++requestVersion
  fetching.value = true
  try {
    const [page, stats] = await Promise.all([
      getJournalPage({ pageNum: currentPage.value, pageSize, keyword: search.value.trim() || undefined, tag: selectedTag.value || undefined, date: selectedDate.value || undefined }),
      getJournalSummary()
    ])
    if (version !== requestVersion) return
    entries.value = page.records; total.value = page.total; summary.value = stats
    storageError.value = ''; loaded.value = true
  } catch (error) {
    if (version === requestVersion) storageError.value = errorMessage(error)
  } finally { if (version === requestVersion) fetching.value = false }
}
function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const form = reactive({ content: '', tags: '', date: localDate(), images: [] as string[] })
const editingId = ref('')
const search = ref('')
const selectedTag = ref('')
const selectedDate = ref('')
const month = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const uploading = ref(false)
const importInput = ref<HTMLInputElement>()
const editor = ref<HTMLTextAreaElement>()
const allTags = computed(() => summary.value.tags)
const writtenDays = computed(() => new Set(Object.keys(summary.value.days)))
const visibleEntries = computed(() => entries.value)
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch([search, selectedTag, selectedDate], () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { currentPage.value = 1; void loadEntries() }, 250)
})
onMounted(loadEntries)
onUnmounted(() => { clearTimeout(searchTimer); requestVersion++ })
const groups = computed(() => {
  const result: { date: string; entries: Entry[] }[] = []
  for (const entry of visibleEntries.value) {
    const last = result[result.length - 1]
    if (last?.date === entry.date) last.entries.push(entry)
    else result.push({ date: entry.date, entries: [entry] })
  }
  return result
})
const calendar = computed(() => {
  const year = month.value.getFullYear(), m = month.value.getMonth()
  const start = (new Date(year, m, 1).getDay() + 6) % 7
  const count = new Date(year, m + 1, 0).getDate()
  return Array.from({ length: Math.ceil((start + count) / 7) * 7 }, (_, i) => {
    const day = i - start + 1
    return day > 0 && day <= count ? { day, date: localDate(new Date(year, m, day)) } : null
  })
})
function changeMonth(step: number) { month.value = new Date(month.value.getFullYear(), month.value.getMonth() + step, 1) }
function resetForm() { editingId.value = ''; Object.assign(form, { content: '', tags: '', date: localDate(), images: [] }) }
async function save() {
  if (saving.value || uploading.value) return
  if (!form.content.trim()) { ElMessage.warning('先写一点内容吧'); return }
  if (!form.date) { ElMessage.warning('请选择记录日期'); return }
  saving.value = true
  const editing = !!editingId.value
  try {
    await saveJournal({ id: editingId.value, content: form.content.trim(), date: form.date,
      tags: [...new Set(form.tags.split(/[,，\s]+/).map(t => t.replace(/^#/, '')).filter(Boolean))], images: [...form.images]
    }, editing)
    resetForm(); clearFilters(); currentPage.value = 1
    await loadEntries()
    ElMessage.success(editing ? '随笔已更新到数据库' : '随笔已保存到数据库')
  } catch (error) { ElMessage.error(errorMessage(error)) }
  finally { saving.value = false }
}
async function edit(entry: Entry) {
  if (saving.value || uploading.value) return
  if (form.content.trim() || form.images.length) {
    try { await ElMessageBox.confirm('切换编辑会替换编辑框中尚未保存的内容，是否继续？', '切换编辑', { type: 'warning' }) } catch { return }
  }
  editingId.value = entry.id
  Object.assign(form, { content: entry.content, tags: entry.tags.join(' '), date: entry.date, images: [...entry.images] })
  editor.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }); editor.value?.focus()
}
async function remove(entry: Entry) {
  try { await ElMessageBox.confirm('确定删除这条随笔吗？删除后将不再显示在列表中。', '删除随笔', { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' }) } catch { return }
  try {
    await deleteJournal(entry.id)
    if (editingId.value === entry.id) resetForm()
    if (entries.value.length === 1 && currentPage.value > 1) currentPage.value--
    await loadEntries(); ElMessage.success('随笔已删除')
  } catch (error) { ElMessage.error(errorMessage(error)) }
}

async function addImages(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  uploading.value = true
  try {
    for (const file of files) {
      if (form.images.length >= 3) { ElMessage.warning('每条随笔最多添加 3 张图片'); break }
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
        ElMessage.warning('请选择不超过 1MB 的 PNG、JPG 或 WebP 图片'); continue
      }
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file)
      })
      form.images.push(data)
    }
  } catch { ElMessage.error('图片读取失败，请重试') }
  finally { uploading.value = false; input.value = '' }
}
async function downloadBackup() {
  exporting.value = true
  try {
    const data = await exportJournals()
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = `每日随笔-${localDate()}.json`; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (error) { ElMessage.error(errorMessage(error)) }
  finally { exporting.value = false }
}
async function importData(data: unknown) {
  const imported = Array.isArray(data) ? data : (data as { entries?: unknown })?.entries
  if (!Array.isArray(imported) || !imported.every(validEntry)) throw new Error('备份格式不正确，请选择本页面导出的 JSON 文件')
  if (imported.length > 200) throw new Error('单次最多导入200条，请分批导入')
  const result = await importJournals(imported)
  clearFilters(); currentPage.value = 1; await loadEntries()
  ElMessage.success(`已导入 ${result.imported} 条，跳过 ${result.skipped} 条重复记录`)
}
async function importBackup(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]; input.value = ''
  if (!file) return
  importing.value = true
  try {
    if (file.size > 10 * 1024 * 1024) throw new Error('单次备份文件不能超过 10MB，请分批导入')
    await importData(JSON.parse(await file.text()))
  } catch (error) { ElMessage.error(errorMessage(error)) }
  finally { importing.value = false }
}
async function migrateLocal() {
  try { await ElMessageBox.confirm('将此浏览器的旧随笔导入当前后端用户，原始本地记录仍会保留。是否继续？', '导入旧记录', { confirmButtonText: '导入', cancelButtonText: '取消' }) } catch { return }
  importing.value = true
  try { await importData(JSON.parse(localBackup.value)) }
  catch (error) { ElMessage.error(errorMessage(error)) }
  finally { importing.value = false }
}
function clearFilters() { search.value = ''; selectedTag.value = ''; selectedDate.value = '' }
function dateLabel(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }) }
function timeLabel(date: string) { return new Date(date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }
</script>

<template>
  <div class="journal-page">
    <header class="journal-heading">
      <div><div class="journal-eyebrow">把日子写成自己的故事</div><h1>每日随笔<span>记录微小，也记录重要</span></h1></div>
      <div class="backup-actions"><el-button :loading="exporting" @click="downloadBackup">导出备份</el-button><el-button :disabled="!loaded || saving" :loading="importing" @click="importInput?.click()">导入</el-button><input ref="importInput" type="file" accept=".json,application/json" hidden @change="importBackup" /></div>
    </header>
    <el-alert v-if="storageError" :title="storageError" type="error" :closable="false" show-icon class="storage-alert" />
    <el-alert v-if="localBackup && localBackup !== '[]'" type="info" :closable="false" class="storage-alert"><template #title>检测到当前浏览器的旧随笔，可导入数据库。原记录会保留。 <el-button link type="primary" :disabled="!loaded || saving" :loading="importing" @click="migrateLocal">导入旧记录</el-button></template></el-alert>
    <el-button v-if="storageError" class="storage-alert" @click="loadEntries">重新加载</el-button>
    <div class="journal-layout">
      <section v-loading="fetching" class="journal-feed">
        <form class="journal-composer journal-panel" @submit.prevent="save">
          <div class="composer-title"><span class="journal-avatar">✎</span><div><h2>{{ editingId ? '编辑这条随笔' : '今天，想记点什么？' }}</h2><p>灵感、心情，或一件值得记住的小事。</p></div></div>
          <textarea ref="editor" :disabled="saving" v-model="form.content" aria-label="随笔内容" placeholder="从此刻的一个念头开始…" maxlength="20000" />
          <div v-if="form.images.length" class="composer-images"><div v-for="(src, index) in form.images" :key="src"><img :src="src" alt="待保存的随笔配图" /><button type="button" aria-label="移除配图" :disabled="saving || uploading" @click="form.images.splice(index, 1)">×</button></div></div>
          <div class="composer-meta"><el-input :disabled="saving" v-model="form.tags" aria-label="标签" placeholder="# 标签，用空格或逗号分隔" /><el-date-picker :disabled="saving" v-model="form.date" type="date" value-format="YYYY-MM-DD" :clearable="false" aria-label="记录日期" /></div>
          <div class="composer-footer"><label class="photo-picker">＋ 添加图片<input type="file" accept="image/png,image/jpeg,image/webp" multiple :disabled="uploading || saving" @change="addImages" /></label><div><el-button v-if="editingId" :disabled="uploading || saving" @click="resetForm">取消编辑</el-button><el-button type="primary" native-type="submit" :loading="saving" :disabled="!loaded || uploading || importing || !form.content.trim()">{{ editingId ? '保存修改' : '记录此刻' }}</el-button></div></div>
        </form>
        <div class="feed-toolbar"><h2>时光记录 <span>{{ total }}</span></h2><el-input v-model="search" clearable placeholder="搜索内容或标签" aria-label="搜索随笔" /></div>
        <div v-if="selectedDate || selectedTag" class="active-filters"><el-tag v-if="selectedDate" closable @close="selectedDate = ''">{{ selectedDate }}</el-tag><el-tag v-if="selectedTag" closable @close="selectedTag = ''"># {{ selectedTag }}</el-tag><button @click="clearFilters">清除筛选</button></div>
        <div v-if="!groups.length && !fetching && !storageError" class="journal-panel empty-journal"><span>✎</span><h3>{{ summary.total ? '暂时没有匹配的随笔' : '你的故事，从这里开始' }}</h3><p>{{ summary.total ? '换一个关键词、日期或标签试试。' : '写下今天的第一条随笔，给未来的自己留一点回忆。' }}</p><el-button v-if="summary.total" @click="clearFilters">查看全部</el-button></div>
        <section v-for="group in groups" :key="group.date" class="day-group">
          <div class="day-heading"><span class="timeline-dot"></span><h3>{{ dateLabel(group.date) }}</h3><span v-if="group.date === localDate()" class="today-label">今天</span><span class="year-label">{{ group.date.slice(0, 4) }}</span></div>
          <article v-for="entry in group.entries" :key="entry.id" class="journal-panel entry-card">
            <header><div class="entry-time">{{ timeLabel(entry.createdAt) }}<span v-if="entry.updatedAt !== entry.createdAt"> · 已编辑</span></div><el-dropdown trigger="click"><button class="entry-more" aria-label="随笔操作">•••</button><template #dropdown><el-dropdown-menu><el-dropdown-item @click="edit(entry)">编辑</el-dropdown-item><el-dropdown-item @click="remove(entry)">删除</el-dropdown-item></el-dropdown-menu></template></el-dropdown></header>
            <p class="entry-content">{{ entry.content }}</p>
            <div v-if="entry.images.length" class="entry-images"><el-image v-for="(src, index) in entry.images" :key="src" :src="src" :preview-src-list="entry.images" :initial-index="index" preview-teleported fit="cover" alt="随笔配图" /></div>
            <footer v-if="entry.tags.length"><button v-for="tag in entry.tags" :key="tag" class="entry-tag" @click="selectedTag = tag"># {{ tag }}</button></footer>
          </article>
        </section>
        <el-pagination v-if="total > pageSize" v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="prev, pager, next" background @current-change="loadEntries" />
      </section>
      <aside class="journal-aside">
        <section class="journal-panel journal-summary"><div><strong>{{ summary.total }}</strong><span>篇随笔</span></div><div><strong>{{ writtenDays.size }}</strong><span>个记录日</span></div></section>
        <section class="journal-panel calendar-panel"><div class="calendar-title"><h2>{{ month.getFullYear() }}年 {{ month.getMonth() + 1 }}月</h2><div><button aria-label="上个月" @click="changeMonth(-1)">‹</button><button aria-label="下个月" @click="changeMonth(1)">›</button></div></div><div class="calendar-grid"><span v-for="day in ['一', '二', '三', '四', '五', '六', '日']" :key="day" class="weekday">{{ day }}</span><template v-for="(day, index) in calendar" :key="index"><button v-if="day" :class="{ selected: selectedDate === day.date, today: day.date === localDate(), recorded: writtenDays.has(day.date) }" :aria-label="`${day.date}${writtenDays.has(day.date) ? '，有随笔' : ''}`" :aria-pressed="selectedDate === day.date" @click="selectedDate = selectedDate === day.date ? '' : day.date">{{ day.day }}</button><span v-else /></template></div><p class="calendar-hint">蓝点表示当天有记录 · 点击日期筛选</p></section>
        <section class="journal-panel tags-panel"><h2>我的标签</h2><div v-if="allTags.length" class="tag-cloud"><button v-for="tag in allTags" :key="tag" :class="{ chosen: selectedTag === tag }" @click="selectedTag = selectedTag === tag ? '' : tag"># {{ tag }}</button></div><p v-else>添加标签，让回忆更容易找到。</p></section>
        <p class="local-note">记录已接入后端数据库，图片保存在后端文件目录。当前为本机单用户联调模式，仍可导出完整备份。</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.journal-page { max-width: 1180px; margin: 0 auto; padding: 12px 8px 40px; color: #344054; }
.journal-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 28px; }
.journal-eyebrow { color: #8793a5; font-size: 12px; letter-spacing: 2px; margin-bottom: 8px; }
h1 { font-size: 26px; color: #253349; letter-spacing: 1px; } h1 span { font-size: 13px; font-weight: normal; color: #929bac; margin-left: 16px; letter-spacing: 0; }
.journal-layout { display: grid; grid-template-columns: minmax(0, 1fr) 284px; gap: 24px; align-items: start; }
.journal-panel { border: 1px solid #e9edf3; background: #fff; border-radius: 14px; box-shadow: 0 3px 16px #22304c03; }
.journal-composer { padding: 24px; } .composer-title { display: flex; gap: 12px; align-items: center; }
.journal-avatar { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; color: #409eff; background: #edf6ff; font-size: 25px; }
h2 { font-size: 15px; font-weight: 600; } .composer-title p { font-size: 12px; color: #98a1af; margin-top: 6px; }
textarea { display: block; width: 100%; min-height: 150px; resize: vertical; border: 0; outline: none; font: inherit; font-size: 15px; line-height: 1.9; color: #344054; padding: 22px 0; background: transparent; }
textarea::placeholder { color: #a6aebb; } textarea:focus-visible { box-shadow: inset 0 -2px #b6d9ff; }
.composer-meta { display: flex; gap: 12px; margin: 8px 0 18px; } .composer-meta > .el-input { flex: 1; } .composer-meta :deep(.el-date-editor) { width: 150px; flex: 0 0 150px; }
.composer-footer { border-top: 1px solid #f0f2f5; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.photo-picker { color: #8491a5; font-size: 13px; cursor: pointer; position: relative; } .photo-picker input { position: absolute; inset: 0; opacity: 0; width: 100%; cursor: pointer; }
.composer-images, .entry-images { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; } .composer-images > div { position: relative; } .composer-images img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; } .composer-images button { position: absolute; right: -5px; top: -5px; border: 0; border-radius: 50%; width: 20px; height: 20px; color: white; background: #63718b; cursor: pointer; }
.feed-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 28px 0 20px; } .feed-toolbar h2 { white-space: nowrap; } .feed-toolbar h2 span { margin-left: 6px; color: #a0a9b7; font-weight: normal; } .feed-toolbar .el-input { max-width: 250px; }
.active-filters { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; } .active-filters button { border: none; background: none; color: #409eff; cursor: pointer; }
.day-heading { display: flex; align-items: center; gap: 10px; margin: 24px 0 14px; } .day-heading h3 { font-size: 13px; font-weight: 500; } .timeline-dot { width: 7px; height: 7px; border-radius: 50%; background: #78b7fa; } .today-label { font-size: 11px; color: #409eff; background: #eaf4ff; border-radius: 4px; padding: 2px 6px; } .year-label { font-size: 12px; color: #a4adba; margin-left: auto; }
.entry-card { padding: 20px 24px; margin-bottom: 14px; } .entry-card header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; } .entry-time { font-size: 12px; color: #97a1b1; } .entry-more { border: none; background: none; color: #98a2b3; cursor: pointer; padding: 4px 8px; letter-spacing: 2px; } .entry-content { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.95; font-size: 15px; } .entry-card footer { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; } .entry-tag { border: none; background: #f0f6fc; color: #6c94bc; border-radius: 5px; padding: 4px 8px; font-size: 12px; cursor: pointer; } .entry-images { margin-top: 16px; margin-bottom: 0; } .entry-images .el-image { width: 132px; height: 110px; border-radius: 8px; }
.journal-aside { display: grid; gap: 18px; } .journal-summary { display: flex; padding: 22px 14px; } .journal-summary > div { width: 50%; display: grid; gap: 8px; text-align: center; } .journal-summary > div + div { border-left: 1px solid #edf0f5; } .journal-summary strong { font-size: 26px; font-weight: 500; color: #405775; } .journal-summary span { font-size: 12px; color: #929eaf; }
.calendar-panel, .tags-panel { padding: 20px; } .calendar-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; } .calendar-title h2 { font-size: 14px; } .calendar-title button { border: 0; background: none; padding: 0 8px; font-size: 22px; color: #8b98ac; cursor: pointer; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; } .weekday { font-size: 11px; padding-bottom: 8px; color: #a2aab6; } .calendar-grid button { position: relative; height: 30px; border: 0; border-radius: 7px; color: #627087; background: transparent; cursor: pointer; font-size: 12px; } .calendar-grid button:hover { background: #edf5ff; } .calendar-grid .today { font-weight: bold; color: #409eff; } .calendar-grid .recorded::after { content: ''; position: absolute; width: 3px; height: 3px; background: #409eff; bottom: 2px; left: calc(50% - 1.5px); border-radius: 50%; } .calendar-grid .selected { background: #409eff; color: #fff; } .calendar-grid .selected::after { background: white; } .calendar-hint { font-size: 10px; color: #a4adba; margin-top: 16px; }
.tag-cloud { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; } .tag-cloud button { border: 1px solid #eaf0f6; border-radius: 6px; background: #f8fafc; color: #7a8ba3; padding: 6px 9px; cursor: pointer; } .tag-cloud .chosen { color: #409eff; border-color: #b4d8ff; background: #edf6ff; } .tags-panel p, .local-note { font-size: 12px; color: #a0aaba; line-height: 1.8; } .tags-panel p { margin-top: 12px; } .local-note { padding: 0 8px; }
.empty-journal { padding: 48px 20px; text-align: center; } .empty-journal > span { color: #aac9e8; font-size: 34px; } .empty-journal h3 { margin-top: 14px; font-size: 16px; font-weight: 500; } .empty-journal p { color: #9ba5b5; font-size: 13px; margin: 12px 0 18px; line-height: 1.8; } .storage-alert { margin-bottom: 20px; }
@media (max-width: 1100px) { .journal-layout { grid-template-columns: minmax(0, 1fr); } .journal-aside { grid-template-columns: repeat(2, minmax(0, 1fr)); } h1 span { display: none; } }
@media (max-width: 650px) { .journal-heading { align-items: flex-start; flex-direction: column; } .journal-composer, .entry-card { padding: 16px; } .journal-aside { grid-template-columns: 1fr; } .composer-meta { flex-direction: column; } .composer-meta :deep(.el-date-editor) { flex-basis: auto; width: 100%; } .feed-toolbar { flex-wrap: wrap; } .journal-page { padding: 0; } }
</style>
