import request from '@/utils/request'

// ========== 用户管理接口 ==========

export function getUsers(params) {
  return request({
    url: '/api/user',
    method: 'get',
    params
  })
}

export function queryUsers(data) {
  return request({
    url: '/api/user/query',
    method: 'post',
    data
  })
}

export function getUser(userId) {
  return request({
    url: `/api/user/${userId}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  })
}

export function updateUser(userId, data) {
  return request({
    url: `/api/user/${userId}`,
    method: 'put',
    data
  })
}

export function deleteUser(userId) {
  return request({
    url: `/api/user/${userId}`,
    method: 'delete'
  })
}

export function updateUserStatus(userId, enabled) {
  return request({
    url: `/api/user/${userId}/status`,
    method: 'put',
    params: { enabled }
  })
}

export function resetPassword(userId) {
  return request({
    url: `/api/user/${userId}/reset-password`,
    method: 'put'
  })
}

// ========== 角色管理接口 ==========

export function getAllRoles() {
  return request({
    url: '/api/role',
    method: 'get'
  })
}

export function getRoleList(params) {
  return request({
    url: '/api/role/list',
    method: 'get',
    params
  })
}

export function getRole(roleId) {
  return request({
    url: `/api/role/${roleId}`,
    method: 'get'
  })
}
