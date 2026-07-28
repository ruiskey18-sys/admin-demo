import { createRouter, createWebHistory } from 'vue-router'
import {generateRoutes} from './routes'

const routes = [
    {
        path: '/',
        component:()=>import('../layout/Layout.vue'),

        children: [
            {
                path: '',
                redirect: '/user'
            },
            ...generateRoutes()
        ]
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router