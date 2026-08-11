<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {getUserList, deleteUserApi, createUserApi, getUserDetailApi} from '../../api/user'
import {ref, onMounted} from 'vue'
import UserDialog from './components/UserDialog.vue'


interface User{
    id:number
    username:string
    name:string
    role:string
    status:string
    createdAt:string
}

const dialogRef = ref()

const userList = ref<User[]>([])


async function loadUserList(){
    const res:any = await getUserList()
    userList.value=res.data
}


const deleteUser = async(row:any)=>{
    try {
        await ElMessageBox.confirm(`确定删除${row.username}?`, '提示')
        await deleteUserApi(row.objectId)
        ElMessage.success('删除成功')
        // 删除成功重新加载列表
        loadUserList()
    } catch (e){

    }
}

const editUser = async(row:any)=>{
    const res = await getUserDetailApi(row.objectId)
    dialogRef.value.open('edit', res.data)
}

const addUser = ()=>{
    dialogRef.value.open('add')
}

onMounted(()=>{
    loadUserList()
})
</script>

<template>
    <h1>用户管理页面</h1>
    <div>
        <el-button type="primary" @click="addUser()">新增用户</el-button>
        <el-table :data="userList" border stripe>
            <!-- <el-table-column prop="id" label="ID"/> -->
            <el-table-column prop="username" label="用户名"/>
            <el-table-column prop="nickname" label="姓名"/>
            <el-table-column prop="role" label="角色"/>
            <el-table-column prop="status" label="状态"/>
            <el-table-column prop="createdTime" label="创建时间"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="deleteUser(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- success监听子组件发送的事件 -->
    <user-dialog ref="dialogRef" @success="loadUserList"/>
</template>

<style scoped>
</style>