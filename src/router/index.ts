import { createRouter, createWebHistory } from 'vue-router'
import {generateRoutes} from './routes'

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