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

    userList.value=res.data
    console.log(res)

}

onMounted(()=>{
    loadUserList()
})
</script>

<template>
    <h1>用户管理页面</h1>
    <div>
        <el-table :data="userList" border stripe>
            <el-table-column prop="id" label="ID"/>
            <el-table-column prop="username" label="用户名"/>
            <el-table-column prop="name" label="姓名"/>
            <el-table-column prop="role" label="角色"/>
            <el-table-column prop="status" label="状态"/>
            <el-table-column prop="createdAt" label="创建时间"/>
        </el-table>
        <!-- <table>
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
        </table> -->
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