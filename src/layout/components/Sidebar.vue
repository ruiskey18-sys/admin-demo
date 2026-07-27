<script setup lang="ts">
import { menuList } from '../../menu';

</script>

<template>
    <aside class="aside">
        <div class="logo">Ruiskey's Home</div>
        <div v-for="menu in menuList" :key="menu.id">
            <!-- 一级菜单 -->
            <div class="menu-title">
                <span>{{ menu.icon }}</span>
                {{  menu.title }}
            </div>
            
            <!-- 二级菜单 -->
            <div v-for="value in menu.children" class="menu-item">
                {{  value.title }}
            </div>
        </div>
        
    </aside>
</template>