
import type { RouteRecordRaw } from 'vue-router'
import { RouterView } from "vue-router"
// 它是为了实现自动import加载 也就是下面的效果
// import User from '../views/User.vue'
// import Project from '../views/Project.vue'
// import Home from '../views/Home.vue'
// 让 Vite 帮你扫描一个目录，然后自动生成 import 关系。
const modules = import.meta.glob('../views/**/*.vue')

interface MenuItem {
    path: string
    name: string
    title: string
    component?: string | null
    children?: MenuItem[]
}

export function generateRoutes(menuList:MenuItem[]): RouteRecordRaw[] {

    // 这是typescript的写法 :后面定义这个变量里面的类型，这里的any是任意类型的意思
    // const routes:any[]=[]
    // menuList.forEach(menu=>{
    //     menu.children.forEach(item=>{
    //         routes.push({
    //             path:item.path,
    //             component:
    //                 modules[
    //                   `../views/${item.component}.vue`
    //                 ]
    //         })
    //     })
    // })
    // return routes
    return menuList.map(item=>{
        const hasChildren = Boolean(item.children && item.children.length > 0)
        if(hasChildren) {
            const children = item.children!
            const firstChild = children[0]!

            return {
                path: item.path,
                name: item.name,
                component: RouterView,
                meta: {
                    title: item.title
                },
                children: generateRoutes(children),

                // 访问 /system 时跳转到第一个子页面
                redirect: {
                    name: firstChild.name
                }
            }
        }
        // if(!componentPath){
        //     throw new Error(
        //         `组件不存在:${item.component}`
        //     )
        // }

        // 没有子菜单：当前节点是具体页面
        return {
            path: item.path,
            name: item.name,
            component: resolveComponent(item.component),
            meta: {
                title: item.title
            }
        }
    })
}

function resolveComponent(componentName?: string | null) {
    if (!componentName) {
        throw new Error('页面节点缺少 component')
    }

    const componentPath = Object.keys(modules).find(path =>
        path.endsWith(`/${componentName}.vue`)
    )

    if (!componentPath) {
        throw new Error(`组件不存在: ${componentName}`)
    }

    return modules[componentPath]
}