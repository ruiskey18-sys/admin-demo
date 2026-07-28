<script setup lang="ts">
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

</script>

<template>
    <div class="layout">
        <Sidebar />
        <div class="right">
            <Header />
            <main>
                <router-view />
            </main>
        </div>
    </div>
</template>