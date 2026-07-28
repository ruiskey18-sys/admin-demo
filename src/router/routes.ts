
import { menuList } from "../menu"
const modules = import.meta.glob('../views/*.vue')

export function generateRoutes(){

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