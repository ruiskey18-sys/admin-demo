import router from './index'
import {generateRoutes} from './routes'

export function addDynamicRoutes(menuList:any[]){
    const routes = generateRoutes(menuList)
    routes.forEach(route=>{
        router.addRoute('Layout', route)
    })
}