import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '3d工厂', icon: 'dashboard', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/scan',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/scan-code'),
        name: 'Scan',
        meta: { title: '扫码出入库', icon: 'el-icon-full-screen', noCache: true }
      }
    ]
  },
  {
    path: '/overview',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/overview-inventory'),
        name: 'Overview',
        meta: { title: '库存总览', icon: 'el-icon-s-cooperation', noCache: true }
      }
    ]
  },
  {
    path: '/entry',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/entry-management'),
        name: 'Entry',
        meta: { title: '入库管理', icon: 'el-icon-finished', noCache: true }
      }
    ]
  },
  {
    path: '/outbound',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/outbound-management'),
        name: 'Outbound',
        meta: { title: '出库管理', icon: 'el-icon-upload2', noCache: true }
      }
    ]
  },
  {
    path: '/history',
    component: Layout,
    redirect: '/history/list',
    name: 'History',
    meta: {
      title: '历史记录',
      icon: 'edit'
    },
    children: [
      {
        path: 'operation',
        component: () => import('@/views/operation-log'),
        name: 'Operation',
        meta: { title: '操作日志', noCache: true }
      },
      {
        path: 'alarm',
        component: () => import('@/views/alarm'),
        name: 'Alarm',
        meta: { title: '告警通知', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '用户中心',
      icon: 'peoples',
      roles: [1, 2] // 1=admin, 2=editor，支持的角色 ID 列表
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '权限分配',
          roles: [1], // 仅 admin(roleId=1)
          noCache: true
        }
      },
      {
        path: 'user',
        component: () => import('@/views/permission/directive'),
        name: 'User',
        meta: {
          title: '个人账户',
          noCache: true
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
