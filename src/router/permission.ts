import router from './index'
import {generateRoutes} from './routes'

export function addDynamicRoutes(menuList:any[]){
    const routes = generateRoutes(menuList)
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