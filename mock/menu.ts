export default [
    {
        url:'/api/menu',
        method:'get',
        response:()=>{
            return {
                code:200,
                data:[
                    {
                        path:'/user',
                        name:'User',
                        component:'User',
                        title:'用户管理'
                    },
                    {
                        path:'/project',
                        name:'Project',
                        component:'Project',
                        title:'项目管理'
                    }
                ]
            }
        }
    }
]