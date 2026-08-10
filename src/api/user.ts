import request from '../utils/request'

export function getUserList(){
    return request.get('/user/list')
}

export function deleteUserApi(objectId:string){
    return request.get('/user/delete', {
        params: {
            objectId:objectId
        }
    })
}

export function createUserApi(data:any){
    return request.post('/user/add', data)
}

export function getUserDetailApi(objectId:string){
    return request.get('/user/detail', {
        params: {
            objectId:objectId
        }
    })
}