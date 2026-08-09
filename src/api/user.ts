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