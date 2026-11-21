<script setup lang="ts">
import MenuIcon from './MenuIcon.vue'
defineProps<{ item: { name: string; title: string; children?: any[] } }>()
</script>
<template>
  <el-sub-menu v-if="item.children?.length" :index="item.name" popper-class="sidebar-popper">
    <template #title><MenuIcon :title="item.title" /><span>{{ item.title }}</span></template>
    <SidebarItem v-for="child in item.children" :key="child.name" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.name">
    <MenuIcon :title="item.title" /><template #title>{{ item.title }}</template>
  </el-menu-item>
</template>
