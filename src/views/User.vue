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

const dialogVisible = ref(false)

const userList = ref<User[]>([])



async function loadUserList(){
    const res:any = await getUserList()
    userList.value=res.data
}

async function submit(){
    // await createUser(form.value)
    dialogVisible.value=false
    loadUserList()
}

function openDialog(){
    dialogVisible.value=true
}

onMounted(()=>{
    loadUserList()
})
</script>

<template>
    <h1>用户管理页面</h1>
    <div>
        <el-button type="primary" @click="openDialog">新增用户</el-button>
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

    <el-dialog v-model="dialogVisible">
        <el-form>
            <el-form-item label="用户名">
                <el-input />
            </el-form-item>
            <el-form-item label="姓名">
                <el-input />
            </el-form-item>
            <el-form-item label="角色">
                <el-input />
            </el-form-item>
            <el-form-item label="状态">
                <el-input />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </template>
    </el-dialog>
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