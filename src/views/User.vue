<script lang="ts" setup>
import {getUserList} from '../api/user'
import {ref, onMounted} from 'vue'


interface User{

    id:number

    username:string

    name:string

    role:string

    status:string

    createdAt:string

}

const userList = ref<User[]>([])



async function loadUserList(){

    const res:any = await getUserList()

    userList.value=res.data.data

}

onMounted(()=>{
    loadUserList()
})
</script>

<template>
    <h1>用户管理页面</h1>
    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>用户名</th>
                    <th>姓名</th>
                    <th>角色</th>
                    <th>状态</th>
                    <th>创建时间</th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="user in userList"
                :key="user.id"
                >
                    <td>{{user.id}}</td>
                    <td>{{user.username}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.role}}</td>
                    <td>{{user.status}}</td>
                    <td>{{user.createdAt}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>

table{

width:100%;

border-collapse:collapse;

}


th,td{

border:1px solid #ddd;

padding:10px;

}


</style>