<script setup lang="ts">
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Home from '../views/Home.vue';
</script>

<template>
    <div class="layout">
        <Sidebar />
        <div class="right">
            <Header />
            <Home />
        </div>
    </div>
</template>