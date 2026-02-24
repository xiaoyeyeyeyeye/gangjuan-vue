import request from '@/utils/request'

// 分页查询
export function fetchOverviewList(params) {
  return request({
    url: '/api/overview/index',
    method: 'get',
    params
  })
}

// 详情
export function fetchOverviewDetail(coilId) {
  return request({
    url: `/api/overview/${coilId}/detail`,
    method: 'get'
  })
}

// 新增
export function createOverview(data) {
  return request({
    url: '/api/overview',
    method: 'post',
    data
  })
}

// 更新
export function updateOverview(coilId, data) {
  return request({
    url: `/api/overview/${coilId}`,
    method: 'put',
    data
  })
}

// 生成二维码
export function generateQrCode(coilId) {
  return request({
    url: `/api/overview/${coilId}/qrcode`,
    method: 'get',
    responseType: 'blob'
  })
}

// 快速搜索
export function fetchOverviewSearch(keyword, pageNum = 1, pageSize = 10) {
  return request({
    url: '/api/overview/search',
    method: 'get',
    params: { keyword, pageNum, pageSize }
  })
}

// 二维码补打
export function reprintQrCode(coilId, reason) {
  return request({
    url: `/api/overview/${coilId}/print-qrcode`,
    method: 'post',
    params: { reason }
  })
}
