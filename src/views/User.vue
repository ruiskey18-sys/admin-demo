<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {getUserList, deleteUserApi, createUserApi} from '../api/user'
import {ref, onMounted} from 'vue'


interface User{
    id:number
    username:string
    name:string
    role:string
    status:string
    createdAt:string
}

const createDefaultForm = ()=>({
    username: '',
    nickname: '',
    password: ''
})

// 清空方法
const resetForm = ()=>{
    form.value=createDefaultForm()
}

const form = ref(createDefaultForm())

const dialogVisible = ref(false)

const userList = ref<User[]>([])



async function loadUserList(){
    const res:any = await getUserList()
    userList.value=res.data
}


const submit = async()=>{
    // await createUser(form.value)
    
    const res = await createUserApi(form.value)
    console.log("新增结果", res)
    dialogVisible.value=false
    loadUserList()
    resetForm()
}

function openDialog(){
    dialogVisible.value=true
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

onMounted(()=>{
    loadUserList()
})
</script>

<template>
    <h1>用户管理页面</h1>
    <div>
        <el-button type="primary" @click="openDialog">新增用户</el-button>
        <el-table :data="userList" border stripe>
            <!-- <el-table-column prop="id" label="ID"/> -->
            <el-table-column prop="username" label="用户名"/>
            <el-table-column prop="nickname" label="姓名"/>
            <el-table-column prop="role" label="角色"/>
            <el-table-column prop="status" label="状态"/>
            <el-table-column prop="createdTime" label="创建时间"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary">编辑</el-button>
                    <el-button type="danger" @click="deleteUser(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :model="form">
        <el-form>
            <el-form-item label="账户">
                <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="form.nickname"/>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password"/>
            </el-form-item>
            <!-- <el-form-item label="角色">
                <el-input />
            </el-form-item>
            <el-form-item label="状态">
                <el-input />
            </el-form-item> -->
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