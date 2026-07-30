<script setup lang="ts">
import  menuList  from '../mock/menu';
import { addDynamicRoutes } from '../router/permission';
import { useMenuStore } from '../store/menu';
import { useUserStore } from '../store/user';
import router from '../router/index'

const userStore = useUserStore()
const menuStore = useMenuStore()
function login() {
    // 模拟登录
    userStore.login('admin')
    // // 模拟后端返回菜单
    // menuStore.setMenu(menuList)
    // // 动态注册路由
    // addDynamicRoutes(
    //     menuStore.menuList
    // )
    // 进入后台
    router.push('/')
}
</script>

<template>
    <div>
        <h2>登录页面</h2>
        <button @click="login">登录</button>
    </div>
</template>