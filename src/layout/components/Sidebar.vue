<script setup lang="ts">
import {useMenuStore} from '../../store/menu'
import { useRouter } from 'vue-router'


const menuStore = useMenuStore()
const router = useRouter()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

function handleSelect(name: string){
    router.push({name})
}
</script>

<template>
    <aside class="aside">
        <div class="logo">Ruiskey's Home</div>
        <el-menu
            default-active="2"
            class="sidebar-menu"
            @select="handleSelect"
            @open="handleOpen"
            @close="handleClose"
        >
            <el-sub-menu
                v-for="menu in menuStore.menuList" :key="menu.objectId" :index="menu.name">
                <!-- 具名插槽 -->
                <template v-slot:title>
                    <span>{{ menu.title }}</span>
                </template>
                <!-- 二级菜单 -->
                 <el-menu-item v-for="child in menu.children || []" :key="child.objectId" :index="child.name">
                    {{ child.title }}
                 </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </aside>
</template>

