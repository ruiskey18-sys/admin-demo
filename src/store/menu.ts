import {defineStore} from 'pinia'

export const useMenuStore = defineStore(
    'menu',
    {
        state(){
            return {
                menuList:[] as any[]
            }
        },
        actions: {
            setMenu(menu:any[]){
                this.menuList = menu
            }
        }
    }
)