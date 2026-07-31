import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path:'/login',
        component:()=>import('../views/Login.vue')
    },
    {
        path: '/',
        name: 'Layout',
        component:()=>import('../layout/Layout.vue'),

        children: [
        ]
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router