<script lang="ts" setup>
import {ref} from 'vue'
import { ElMessage} from 'element-plus'
import {getUserList, createUserApi, getUserDetailApi, updateUserApi} from '../../../api/user'

const createDefaultForm = ()=>({
    userName: '',
    nickName: '',
    password: ''
})
// 清空方法
const resetForm = ()=>{
    form.value=createDefaultForm()
}

const form = ref(createDefaultForm())

const mode = ref<'add' | 'edit'>('add')

const dialogVisible = ref(false)

const open = (
    type: 'add'|'edit',
    data?:any
)=>{
    mode.value = type
    if(type==='edit'){
        console.log('编辑：', data)
        form.value={
            ...data
        }
    }else{
        resetForm()
    }
    dialogVisible.value=true
}

const submit = async()=>{
    if(mode.value==='add'){
        await createUserApi(form.value)
    }else{
        await updateUserApi(form.value)
    }
    dialogVisible.value=false
    // loadUserList()
    ElMessage.success('操作成功')
    // 通知父组件刷新
    emit('success')
    resetForm()
}

// 暴露给父组件
defineExpose({
    open
})

const emit = defineEmits([
    'success'
])

</script>

<template>
    <el-dialog :title="mode==='add'?'新增用户':'编辑用户'" v-model="dialogVisible" :model="form">
        <el-form>
            <el-form-item label="账户">
                <el-input v-model="form.userName" />
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="form.nickName"/>
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