import { defineStore } from 'pinia';

export const useUserStore = defineStore(
    'user', {
        state(){
            return {
                username:localStorage.getItem('username') || '',
                token:localStorage.getItem('token') || ''
            }
        },
        actions:{
            login(username:string){
                this.username = username
                this.token = 'token-demo'
                localStorage.setItem(
                    'username',
                    username
                )
                localStorage.setItem(
                    'token',
                    this.token
                )
            },
            logout(){
                this.username=''
                this.token=''
                localStorage.removeItem('username')
                localStorage.removeItem('token')
            }
        }
    }
)