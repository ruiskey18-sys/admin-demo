<script setup lang="ts">
import { useUserStore } from '../store/user';
import router from '../router/index'
import {ref} from 'vue'
import request from '../utils/request'

const userStore = useUserStore()

const username = ref('admin')
const password = ref('123456')


const login = async()=>{
    const res:any = await request.post(
        '/login',
        {
            username:username.value,
            password:password.value
        }
    )
    console.log('登录接口返回:', res)

    userStore.setToken(
        res.data.token
    )

    userStore.setUser(
        res.data.username
    )

    router.push('/')
}
</script>

<template>
    <div>
        <h2>登录页面</h2>
        <button @click="login">登录</button>
    </div>
</template>