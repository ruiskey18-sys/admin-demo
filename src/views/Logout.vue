<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const router = useRouter()

    onMounted(()=>{
        userStore.logout()
        router.push('/login')
    })
</script>
<template>

</template>



