<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
defineProps<{ collapsed: boolean }>()
defineEmits<{ toggleSidebar: [] }>()
const route = useRoute()
const breadcrumbs = computed(() => route.matched.filter(item => item.meta.title))
</script>
<template>
  <header class="header">
    <div class="header-navigation">
      <button class="sidebar-toggle" type="button" :aria-label="collapsed ? '展开侧栏' : '折叠侧栏'"
        :title="collapsed ? '展开侧栏' : '折叠侧栏'" :aria-expanded="!collapsed" aria-controls="app-sidebar"
        @click="$emit('toggleSidebar')">
        <svg viewBox="0 0 24 24" :class="{ flipped: collapsed }" aria-hidden="true"><path d="M4 5h16M10 12h10M4 19h16m2-10-3 3 3 3" /></svg>
      </button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-if="!breadcrumbs.length">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-user"><span class="user-avatar">A</span><span>Admin</span></div>
  </header>
</template>
