<script setup lang="ts">
// import { menuList } from '../../menu';
import {useMenuStore} from '../../store/menu'


const menuStore = useMenuStore()
</script>

<template>
    <aside class="aside">
        <div class="logo">Ruiskey's Home</div>
        <div v-for="menu in menuStore.menuList" :key="menu.id">
            <!-- 一级菜单 -->
            <div class="menu-title">
                <span>{{ menu.icon }}</span>
                {{  menu.title }}
            </div>
            
            <!-- 二级菜单 -->
            <router-link v-for="value in menu.children" class="menu-item" :key="value.id" :to="value.path">
                {{  value.title }}
            </router-link>
        </div>
        
    </aside>

</template>

