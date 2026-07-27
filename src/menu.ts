export const menuList = [
  {
    id: 1,
    title: '系统管理',
    icon: '⚙️',
    children: [
      {
        id: 11,
        title: '用户管理',
        path: '/user'
      },
      {
        id: 12,
        title: '角色管理',
        path: '/role'
      }
    ]
  },
  {
    id: 2,
    title: '业务管理',
    icon: '📁',
    children: [
      {
        id: 21,
        title: '项目管理',
        path: '/project'
      },
      {
        id: 22,
        title: '任务管理',
        path: '/task'
      }
    ]
  },
  {
    id: 3,
    title: '数据中心',
    icon: '📊',
    children: [
      {
        id:31,
        title:'数据浏览',
        path:'/data'
      }
    ]
  }
]