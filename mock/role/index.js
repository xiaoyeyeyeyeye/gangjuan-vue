// const Mock = require('mockjs')
// const { deepClone } = require('../utils')
// const { asyncRoutes, constantRoutes } = require('./routes.js')

// const routes = deepClone([...constantRoutes, ...asyncRoutes])

// const roles = [
//   {
//     key: 'admin',
//     number: '010001',
//     phone: '151xxxxxxxx',
//     name: '李xx',
//     mima: 'xxxxxx',
//     description: '可以修改他人基本信息，并重置手机号和密码。',
//     routes: routes
//   },
//   {
//     key: 'worker',
//     number: '010010',
//     phone: '151xxxxxxxx',
//     name: '王xx',
//     mima: 'xxxxxx',
//     description: '仅能修改个人信息，可以正常操作。',
//     routes: routes
//   },
//   {
//     key: 'worker',
//     number: '010011',
//     phone: '151xxxxxxxx',
//     name: '罗xx',
//     mima: 'xxxxxx',
//     description: '仅能修改个人信息，可以正常操作。',
//     routes: routes
//   }
// ]

// module.exports = [
//   // mock get all routes form server
//   {
//     url: '/vue-element-admin/routes',
//     type: 'get',
//     response: _ => {
//       return {
//         code: 20000,
//         data: routes
//       }
//     }
//   },

//   // mock get all roles form server
//   {
//     url: '/vue-element-admin/roles',
//     type: 'get',
//     response: _ => {
//       return {
//         code: 20000,
//         data: roles
//       }
//     }
//   },

//   // add role
//   {
//     url: '/vue-element-admin/role',
//     type: 'post',
//     response: {
//       code: 20000,
//       data: {
//         key: Mock.mock('@integer(300, 5000)')
//       }
//     }
//   },

//   // update role
//   {
//     url: '/vue-element-admin/role/[A-Za-z0-9]',
//     type: 'put',
//     response: {
//       code: 20000,
//       data: {
//         status: 'success'
//       }
//     }
//   },

//   // delete role
//   {
//     url: '/vue-element-admin/role/[A-Za-z0-9]',
//     type: 'delete',
//     response: {
//       code: 20000,
//       data: {
//         status: 'success'
//       }
//     }
//   }
// ]
