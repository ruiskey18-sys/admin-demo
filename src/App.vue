<script setup lang="ts">
import { useMenuStore } from './store/menu';
import  menuList from './mock/menu'
import { addDynamicRoutes } from './router/permission';
import router from './router'
import { nextTick } from 'vue'

// const menuStore = useMenuStore()
// menuStore.setMenu(menuList)
// console.log('菜单:',menuStore.menuList)
// // 增加动态路由
// addDynamicRoutes(menuStore.menuList)
// console.log(
//     '当前路由:',
//     router.getRoutes()
// )
// nextTick(()=>{

//     router.push('/user')

// })
</script>

<template>
  <!-- <HelloWorld /> -->
   <!-- <Layout /> -->
    <router-view />
</template>
