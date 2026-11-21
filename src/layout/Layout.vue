<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

const sidebarCollapsed = ref(false)
</script>

<template>
    <div class="layout">
        <Sidebar :collapsed="sidebarCollapsed" />
        <div class="right">
            <Header :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
            <main class="main">
                <router-view />
            </main>
        </div>
    </div>
</template>
