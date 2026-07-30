import { useMenuStore } from '../store/menu'
import { useUserStore } from '../store/user'
import router from './index'
import {generateRoutes} from './routes'
import menuList from '../mock/menu'

let hasAddRoutes = false

export function addDynamicRoutes(menuList:any[]){
    const routes = generateRoutes(menuList)
    console.log('动态生成路由:', routes)

    routes.forEach(route=>{
        // 所以所有业务页面：
        // User.vue
        // Project.vue
        // Order.vue
        // 都应该成为 Layout 的 children
        // 把动态生成的业务页面路由，注册到后台布局 Layout 下面，让它们共享 Header、Sidebar，只替换 Layout 内部的 router-view。
        router.addRoute('Layout', route)
    })
}

// 增加路由守卫
router.beforeEach((to, from, next)=>{
    console.log('进入路由守卫',to.path)
    const userStore = useUserStore()
    // 有token
    if(userStore.token){
        // 动态路由只添加一次
        if(!hasAddRoutes){
            const menuStore = useMenuStore()
            menuStore.setMenu(menuList)
            console.log('守卫获取菜单:', menuStore.menuList)
            addDynamicRoutes(menuStore.menuList)
            hasAddRoutes = true
            next({
                // ...to,
                path: '/user',
                replace:true
            })
            return
        }
        next()
    } else {
        // 没登录
        if(to.path === '/login'){
            next()
        }else{
            next('/login')
        }
    }
})