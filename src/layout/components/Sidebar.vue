<script setup lang="ts">
import { computed } from 'vue'
import { useMenuStore } from '../../store/menu'
import { useRoute, useRouter } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
defineProps<{ collapsed: boolean }>()
const menuStore = useMenuStore()
const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => String(route.name ?? ''))
const openedMenus = computed(() => route.matched.filter(item => item.name && item.name !== 'Layout').map(item => String(item.name)))
function handleSelect(name: string) {
  if (router.hasRoute(name)) router.push({ name })
}
</script>
<template>
  <aside id="app-sidebar" class="aside" :class="{ 'is-collapsed': collapsed }">
    <div class="logo" :title="collapsed ? `Ruiskey's Home` : undefined">
      <span class="logo-mark" aria-hidden="true">R</span><span v-if="!collapsed">Ruiskey's Home</span>
    </div>
    <nav class="sidebar-scroll" aria-label="主菜单">
      <el-menu :default-active="activeMenu" :default-openeds="openedMenus" :collapse="collapsed"
        :collapse-transition="false" class="sidebar-menu" background-color="#304156"
        text-color="#bfcbd9" active-text-color="#409eff" @select="handleSelect">
        <SidebarItem v-for="menu in menuStore.menuList" :key="menu.name" :item="menu" />
      </el-menu>
    </nav>
  </aside>
</template>
