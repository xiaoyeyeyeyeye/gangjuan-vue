import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/api/auth/routes', // /////////
    method: 'get'
  })
}

export function login() {
  return request({
    url: '/api/auth/login',
    method: 'post'
  })
}

export function addUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function getUser(user_id) {
  return request({
    url: '/api/user/' + user_id,
    method: 'get'
  })
}

export function updatePassword() {
  return request({
    url: '/api/user/password',
    method: 'put'
  })
}

export function resetPassword(user_id) {
  return request({
    url: `/api/user/${user_id}/password`,
    method: 'put'
  })
}

// 解绑手机 、、、、、、、、、、、、、、、、、
export function unbindUserPhone(userId) {
  return request({
    url: `/api/user/${userId}/phone`,
    method: 'delete'
  })
}

export function getUsers() {
  return request({
    url: '/api/user',
    method: 'get'
  })
}

export function deleteUser(user_id) {
  return request({
    url: '/api/user/' + user_id,
    method: 'delete'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

export function getRoles() {
  return request({
    // url: '/api/user/roles',
    url: '/api/user/query',
    method: 'get'
  })
}
