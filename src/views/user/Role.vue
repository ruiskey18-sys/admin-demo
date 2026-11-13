<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, ElTree, type FormInstance, type FormRules } from 'element-plus'
import { getRolePageList } from '../../api/role'

interface Role {
    id: string
    name: string
    key: string
    status: boolean
    permiss: Array<string | number>
    createdTime: string
    updatedTime: string
}

interface PermissionNode {
    id: number
    label: string
    children?: PermissionNode[]
}

const permissionTree: PermissionNode[] = [
    {
        id: 1,
        label: '系统管理',
        children: [
            { id: 11, label: '用户管理' },
            { id: 12, label: '角色管理' },
            { id: 13, label: '菜单管理' }
        ]
    },
    {
        id: 2,
        label: '项目管理',
        children: [
            { id: 21, label: '项目列表' },
            { id: 22, label: '新增项目' }
        ]
    }
]

const roles = ref<Role[]>([])
const total = ref(0)
const loading = ref(false)

const query = reactive({ name: '' })
const currentPage = ref(1)
const pageSize = ref(10)

const loadRoleList = async () => {
    loading.value = true
    try {
        const res: any = await getRolePageList({
            pageNum: currentPage.value,
            pageSize: pageSize.value
        })
        roles.value = res.data?.records ?? []
        total.value = Number(res.data?.total ?? 0)
    } catch {
        roles.value = []
        total.value = 0
        ElMessage.error('角色列表加载失败')
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    // 当前分页接口只接收 pageNum 和 pageSize；暂时在当前页中筛选。
    const keyword = query.name.trim().toLowerCase()
    if (keyword) {
        roles.value = roles.value.filter(role =>
            role.name.toLowerCase().includes(keyword) || role.key.toLowerCase().includes(keyword)
        )
        return
    }
    currentPage.value = 1
    loadRoleList()
}

const handleReset = () => {
    query.name = ''
    currentPage.value = 1
    loadRoleList()
}

const handleCurrentChange = (page: number) => {
    currentPage.value = page
    loadRoleList()
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    loadRoleList()
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const roleFormRef = ref<FormInstance>()
const roleForm = reactive({ id: '', name: '', key: '', status: true })
const roleRules: FormRules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    key: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
}

const resetRoleForm = () => {
    Object.assign(roleForm, { id: '', name: '', key: '', status: true })
    roleFormRef.value?.clearValidate()
}

const openAddDialog = () => {
    dialogMode.value = 'add'
    resetRoleForm()
    dialogVisible.value = true
}

const openEditDialog = (row: Role) => {
    dialogMode.value = 'edit'
    Object.assign(roleForm, row)
    dialogVisible.value = true
}

const submitRole = async () => {
    const valid = await roleFormRef.value?.validate().catch(() => false)
    if (!valid) return

    if (dialogMode.value === 'add') {
        roles.value.unshift({
            id: `local-${Date.now()}`,
            name: roleForm.name,
            key: roleForm.key,
            status: roleForm.status,
            permiss: [],
            createdTime: new Date().toISOString(),
            updatedTime: new Date().toISOString()
        })
        ElMessage.success('新增角色成功')
    } else {
        const target = roles.value.find(role => role.id === roleForm.id)
        if (target) Object.assign(target, roleForm)
        ElMessage.success('编辑角色成功')
    }
    dialogVisible.value = false
}

const deleteRole = async (row: Role) => {
    try {
        await ElMessageBox.confirm(`确定删除角色“${row.name}”吗？`, '提示', { type: 'warning' })
        roles.value = roles.value.filter(role => role.id !== row.id)
        ElMessage.success('删除成功')
    } catch {
        // 用户取消删除时无需提示。
    }
}

const permissionVisible = ref(false)
const currentRole = ref<Role>()
const checkedPermissions = ref<Array<string | number>>([])
const permissionTreeRef = ref<InstanceType<typeof ElTree>>()

const openPermissionDialog = (row: Role) => {
    currentRole.value = row
    checkedPermissions.value = [...(row.permiss ?? [])]
    permissionVisible.value = true
}

const savePermissions = () => {
    const checkedKeys = permissionTreeRef.value?.getCheckedKeys(false) ?? []
    const halfCheckedKeys = permissionTreeRef.value?.getHalfCheckedKeys() ?? []
    if (currentRole.value) {
        currentRole.value.permiss = [...checkedKeys, ...halfCheckedKeys] as Array<string | number>
    }
    permissionVisible.value = false
    ElMessage.success('权限保存成功')
}

onMounted(loadRoleList)
</script>

<template>
    <div class="role-page">
        <el-card class="search-card" shadow="never">
            <el-form :model="query" inline @submit.prevent="handleSearch">
                <el-form-item label="角色名称：">
                    <el-input
                        v-model="query.name"
                        clearable
                        placeholder="请输入角色名称或角色标识"
                        @keyup.enter="handleSearch"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="table-card" shadow="never">
            <div class="toolbar">
                <el-button type="warning" @click="openAddDialog">新增</el-button>
            </div>

            <el-table v-loading="loading" :data="roles" border stripe>
                <el-table-column type="index" label="序号" width="70" align="center" />
                <el-table-column prop="name" label="角色名称" min-width="140" />
                <el-table-column prop="key" label="角色标识" min-width="140" />
                <el-table-column label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'">
                            {{ row.status ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="权限管理" width="120" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" plain @click="openPermissionDialog(row)">
                            管理
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间" min-width="180" />
                <el-table-column label="操作" width="170" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
                        <el-button type="danger" link @click="deleteRole(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-box">
                <el-pagination
                    v-model:current-page="currentPage"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50]"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>

        <el-dialog
            v-model="dialogVisible"
            :title="dialogMode === 'add' ? '新增角色' : '编辑角色'"
            width="560px"
            destroy-on-close
            :close-on-click-modal="false"
        >
            <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色标识" prop="key">
                    <el-input v-model="roleForm.key" placeholder="请输入角色标识" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="roleForm.status" active-text="启用" inactive-text="禁用" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitRole">确定</el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="permissionVisible"
            :title="`权限管理${currentRole ? ` - ${currentRole.name}` : ''}`"
            width="500px"
            destroy-on-close
        >
            <el-tree
                ref="permissionTreeRef"
                :data="permissionTree"
                node-key="id"
                show-checkbox
                default-expand-all
                :default-checked-keys="checkedPermissions"
            />
            <template #footer>
                <el-button @click="permissionVisible = false">取消</el-button>
                <el-button type="primary" @click="savePermissions">保存权限</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.role-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.search-card :deep(.el-card__body) {
    padding-bottom: 2px;
}

.table-card {
    min-height: 420px;
}

.toolbar {
    margin-bottom: 16px;
}

.pagination-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

@media (max-width: 768px) {
    .pagination-box {
        justify-content: flex-start;
        overflow-x: auto;
    }
}
</style>
