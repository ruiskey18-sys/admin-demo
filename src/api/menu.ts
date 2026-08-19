import request from '../utils/request'

export function getMenu(){
    // return request.get('/menu/list')
    return request.get('/menu/listTree')
}