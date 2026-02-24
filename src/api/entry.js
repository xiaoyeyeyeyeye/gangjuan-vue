import request from '@/utils/request'

export function fetchEntryDetail(coilId) {
  return request({
    url: `/entry/detail/${coilId}`,
    method: 'get'
  })
}

export function fetchEntryPage() {
  return request({
    url: '/entry/index',
    method: 'get'
  })
}

export function fetchEntryList(data) {
  // 前端统一使用 pageNum/pageSize，入库接口需要 page/size
  const { pageNum, pageSize, ...rest } = data
  const requestData = {
    page: pageNum ?? 1,
    size: pageSize ?? 10,
    ...rest
  }
  return request({
    url: '/entry/query',
    method: 'post',
    data: requestData
  })
}

export function createEntry(data) {
  return request({
    url: '/entry/add',
    method: 'post',
    data
  })
}

export function updateEntry(coilId, data) {
  return request({
    url: `/entry/update/${coilId}`,
    method: 'put',
    data
  })
}

export function deleteEntry(coilId, operatorId) {
  return request({
    url: `/entry/delete/${coilId}`,
    method: 'delete',
    params: { operatorId }
  })
}
