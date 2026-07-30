import { defineStore } from 'pinia';

export const useUserStore = defineStore(
    'user', {
        state(){
            return {
                username:'',
                token:''
            }
        },
        actions:{
            login(username:string){
                this.username = username
                this.token = 'token-demo'
            },
            logout(){
                this.username=''
                this.token=''
            }
        }
    }
)