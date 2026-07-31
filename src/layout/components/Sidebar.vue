<script setup lang="ts">
import {useMenuStore} from '../../store/menu'


const menuStore = useMenuStore()
</script>

<template>
    <aside class="aside">
        <div class="logo">Ruiskey's Home</div>
            <!-- 一级菜单 -->
            <router-link class="menu-item" v-for="menu in menuStore.menuList" :key="menu.path" :to="menu.path">
                <span>{{ menu.icon }}</span>
                {{  menu.title }}
            </router-link>      
    </aside>

</template>

