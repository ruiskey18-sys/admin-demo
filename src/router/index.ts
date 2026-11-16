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
            {
                path: 'chat',
                name: 'Chat',
                component: () => import('../views/Chat.vue'),
                meta: {
                    title: '聊天室'
                }
            }
        ]
    },
    {
        path:'/logout',
        component:()=>import('../views/Logout.vue')
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router
