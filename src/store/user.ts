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
            setToken(token:string){
                this.token=token
                localStorage.setItem('token', token)
            },

            setUser(username:string){
                this.username=username
                localStorage.setItem('username', username)
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