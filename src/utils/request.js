import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 开发环境url及超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 根据后端要求设置token，常见的有Authorization、X-Token等
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 根据后端返回格式调整
service.interceptors.response.use(
  response => {
    const res = response.data

    // 根据后端返回格式调整判断条件
    // 常见格式1: { code: 200, data: ..., message: 'success' }
    // 常见格式2: { success: true, data: ..., message: 'success' }

    if (res.code === 200 || res.success) {
      return res
    } else {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 根据后端定义的错误码处理
      if (res.code === 400) {
        // 请求参数错误
        MessageBox.confirm('请求参数错误', {
          cancelButtonText: '确认',
          type: 'warning'
        })
      } else if (res.code === 401) {
        // 重新登录
        MessageBox.confirm('登录状态已过期，请重新登录', '确认退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (res.code === 403) {
        // 无访问权限
        MessageBox.confirm('无访问权限', {
          cancelButtonText: '确认',
          type: 'warning'
        })
      } else if (res.code === 404) {
        // 请求的资源不存在
        MessageBox.confirm('请求的资源不存在', {
          cancelButtonText: '确认',
          type: 'warning'
        })
      } else if (res.code === 409) {
        // 请求与服务器当前状态冲突
        MessageBox.confirm('请求与服务器当前状态冲突', {
          cancelButtonText: '确认',
          type: 'warning'
        })
      } else if (res.code === 500) {
        // 服务器内部错误
        MessageBox.confirm('服务器内部错误', {
          cancelButtonText: '确认',
          type: 'warning'
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
