import axios from 'axios'
import { useUserStore } from '../store/user'

const service = axios.create({
    // 后端地址
    baseURL: '/api',
    // 超时时间
    timeout:5000
})

// 增加请求拦截器
service.interceptors.request.use(
    (config)=>{
        const userStore = useUserStore()
        if(userStore.token){
            config.headers.Authorization = `Bearer ${userStore.token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)


// 增加响应拦截器
service.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (error)=>{
        console.log('请求错误',error)
        return Promise.reject(error)
    }
)
export default service