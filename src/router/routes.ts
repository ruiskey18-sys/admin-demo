
import { menuList } from "../menu"
// 它是为了实现自动import加载 也就是下面的效果
// import User from '../views/User.vue'
// import Project from '../views/Project.vue'
// import Home from '../views/Home.vue'
// 让 Vite 帮你扫描一个目录，然后自动生成 import 关系。
const modules = import.meta.glob('../views/*.vue')

export function generateRoutes(){

    // 这是typescript的写法 :后面定义这个变量里面的类型，这里的any是任意类型的意思
    const routes:any[]=[]

    menuList.forEach(menu=>{

        menu.children.forEach(item=>{

            routes.push({

                path:item.path,

                component:
                    modules[
                      `../views/${item.component}.vue`
                    ]
            })

        })

    })

    return routes

}