import request from '../utils/request'
export interface JournalEntry {
  id: string; content: string; date: string; tags: string[]
  createdAt: string; updatedAt: string; images: string[]
}
export interface JournalSummary { total: number; writtenDays: number; days: Record<string, number>; tags: string[] }
interface Envelope<T> { code: number; message: string; data: T }
async function call<T>(url: string, method: 'get' | 'post', data?: unknown): Promise<T> {
  const res = await request.request<unknown, Envelope<T>>({ url: `/journal/${url}`, method, data, timeout: 60000 })
  if (res.code !== 200) throw new Error(res.message || '随笔请求失败')
  return res.data
}
export const getJournalPage = (data: { pageNum: number; pageSize: number; keyword?: string; tag?: string; date?: string }) => call<{ records: JournalEntry[]; total: number }>('pageList', 'post', data)
export const getJournalSummary = () => call<JournalSummary>('summary', 'get')
export const saveJournal = (data: Omit<JournalEntry, 'createdAt' | 'updatedAt'>, editing: boolean) => call<JournalEntry>(editing ? 'update' : 'add', 'post', data)
export const deleteJournal = (id: string) => call<void>('delete', 'post', { id })
export const exportJournals = () => call<{ version: number; entries: JournalEntry[] }>('export', 'get')
export const importJournals = (entries: JournalEntry[]) => call<{ imported: number; skipped: number }>('import', 'post', { entries })
