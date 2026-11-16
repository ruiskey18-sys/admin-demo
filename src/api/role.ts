import request from '../utils/request'

export interface RolePageParams {
    pageNum: number
    pageSize: number
    roleName?: string
    roleCode?: string
}

export interface CreateRoleParams {
    roleCode: string
    roleName: string
    status: 0 | 1
}

export interface UpdateRoleParams extends CreateRoleParams {
    objectId: string
}

export function getRolePageList(data: RolePageParams) {
    return request.post('/role/pageList', data)
}

export function createRoleApi(data: CreateRoleParams) {
    return request.post('/role/add', data)
}

export function updateRoleApi(data: UpdateRoleParams) {
    return request.post('/role/update', data)
}

export function deleteRoleApi(objectId: string) {
    return request.get('/role/delete', {
        params: {
            objectId
        }
    })
}
