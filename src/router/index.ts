import path from 'path'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component:()=>import('../layout/Layout.vue'),

        children: [
            {
                path: '',
                redirect: '/home'
            },
            {
                path: 'home',
                component:()=>import('../views/Home.vue'),
            },
            {
                path: 'user',
                component:()=>import('../views/User.vue'),
            },
            {
                path: 'project',
                component:()=>import('../views/Project.vue'),
            }
        ]
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router