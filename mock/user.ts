export default [

    {
        url:'/api/user/list',
        method:'get',

        response(){

            return {

                code:200,

                data:[

                    {
                        id:1,
                        username:'admin',
                        name:'管理员',
                        role:'超级管理员',
                        status:'启用',
                        createdAt:'2026-08-01'
                    },

                    {
                        id:2,
                        username:'test',
                        name:'测试用户',
                        role:'普通用户',
                        status:'禁用',
                        createdAt:'2026-08-02'
                    }

                ]

            }

        }

    }

]