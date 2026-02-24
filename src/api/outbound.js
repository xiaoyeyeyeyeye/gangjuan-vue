import request from '@/utils/request'

// 页面初始化
export function fetchOutboundPage() {
  return request({
    url: '/outbound/index',
    method: 'get'
  })
}

// 分页查询出库记录
export function fetchOutboundList(data) {
  const { pageNum, pageSize, startTime, endTime, ...rest } = data
  const requestData = {
    page: pageNum ?? 1,
    size: pageSize ?? 10,
    ...rest
  }
  if (startTime != null) {
    requestData.startTime = typeof startTime === 'number' ? new Date(startTime).toISOString() : startTime
  }
  if (endTime != null) {
    requestData.endTime = typeof endTime === 'number' ? new Date(endTime).toISOString() : endTime
  }
  return request({
    url: '/outbound/query',
    method: 'post',
    data: requestData
  })
}

// 获取钢卷出库详情
export function fetchOutboundCoilDetail(coilId) {
  return request({
    url: `/outbound/coil/${coilId}`,
    method: 'get'
  })
}

// 执行出库
export function executeOutbound(data) {
  return request({
    url: '/outbound/execute',
    method: 'post',
    data
  })
}

// 批量出库
export function batchExecuteOutbound(data) {
  return request({
    url: '/outbound/batch-execute',
    method: 'post',
    data
  })
}

// 撤销出库
export function cancelOutbound(operationId, operatorId) {
  return request({
    url: `/outbound/cancel/${operationId}`,
    method: 'delete',
    params: { operatorId }
  })
}

// 出库校验
export function checkOutbound(coilId) {
  return request({
    url: `/outbound/check/${coilId}`,
    method: 'get'
  })
}
