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
                // 本地功能入口与后端菜单合并，供侧栏和动态路由共同使用。
                const aiMenu = {
                    objectId: 'local-ai-application',
                    name: 'AiApplication',
                    title: 'AI应用',
                    path: '/system/ai',
                    component: 'Chat'
                }
                let foundSystem = false
                this.menuList = menu.map(item => {
                    if (item.title !== '系统管理') return item
                    foundSystem = true
                    const children = item.children ?? []
                    return {
                        ...item,
                        children: children.some((child: any) => child.name === aiMenu.name)
                            ? children
                            : [...children, aiMenu]
                    }
                })
                const journalMenu = {
                    objectId: 'local-daily-journal', name: 'DailyJournal',
                    title: '每日随笔', path: '/life/journal', component: 'Journal'
                }
                const lifeMenu = this.menuList.find(item => item.title === '生活记录')
                if (lifeMenu) {
                    const children = lifeMenu.children ?? []
                    if (!children.some((child: any) => child.name === journalMenu.name)) {
                        lifeMenu.children = [...children, journalMenu]
                    }
                } else {
                    this.menuList.push({
                        objectId: 'local-life', name: 'LifeRecords', title: '生活记录',
                        path: '/life', children: [journalMenu]
                    })
                }
                if (!foundSystem) {
                    this.menuList.push({
                        objectId: 'local-system-management',
                        name: 'LocalSystemManagement',
                        title: '系统管理',
                        path: '/system',
                        children: [aiMenu]
                    })
                }
            }
        }
    }
)