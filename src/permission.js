import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    console.log('进入permission的hasToken', to.path)
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes) // 保留，确保动态路由生效
          // 直接跳转到 redirect 或 dashboard
          next({ path: to.query.redirect || '/dashboard', replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

// router.beforeEach(async(to, from, next) => {
//   // NProgress.start()
//   // document.title = getPageTitle(to.meta.title)
//   const hasToken = getToken()
//   if (hasToken) {
//     console.log('进入permission的hasToken')
//     console.log(to.path)
//     if (to.path === '/login') {
//       next({ path: '/' })
//       // NProgress.done()
//     } else {
//       const hasRoles = store.getters.roles && store.getters.roles.length > 0
//       if (hasRoles) {
//         next()
//       } else {
//         try {
//           const { roles } = await store.dispatch('user/getInfo')
//           const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
//           router.addRoutes(accessRoutes)
//           next({ ...to, replace: true })
//         } catch (error) {
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           // NProgress.done()
//         }
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next(`/login?redirect=${to.path}`)
//       // NProgress.done()
//     }
//   }
// })

router.afterEach(() => {
  NProgress.done()
})
