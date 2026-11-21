<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ title: string }>()
const path = computed(() => {
  if (/生活记录|每日随笔/.test(props.title)) return 'M5 3h14v18H5zM9 7h6M9 11h6M9 15h4'
  if (/AI应用/.test(props.title)) return 'M5 7h14v13H5zM12 3v4M9 12h.01M15 12h.01M9 16h6M2 11v5M22 11v5'
  if (/用户/.test(props.title)) return 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-2a8 8 0 0 1 16 0v2'
  if (/角色|权限/.test(props.title)) return 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6'
  if (/首页/.test(props.title)) return 'm3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9'
  if (/菜单/.test(props.title)) return 'M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1'
  if (/项目|业务/.test(props.title)) return 'M3 6h7l2 3h9v11H3z'
  return 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'
})
</script>
<template>
  <el-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="path" /></svg></el-icon>
</template>
