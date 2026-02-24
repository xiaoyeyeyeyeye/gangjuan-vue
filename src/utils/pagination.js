/**
 * 统一分页参数
 * 全项目使用 pageNum、pageSize 作为分页字段名
 */
export const DEFAULT_PAGE_NUM = 1
export const DEFAULT_PAGE_SIZE = 10

export function createPaginationQuery(extra = {}) {
  return {
    pageNum: DEFAULT_PAGE_NUM,
    pageSize: DEFAULT_PAGE_SIZE,
    ...extra
  }
}
