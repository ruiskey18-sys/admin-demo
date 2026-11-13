import request from '../utils/request'

export interface RolePageParams {
    pageNum: number
    pageSize: number
}

export function getRolePageList(data: RolePageParams) {
    return request.post('/role/pageList', data)
}
