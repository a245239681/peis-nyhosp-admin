import axios from '@/libs/api.request'

// lis数据查询
export const lisData = (params) => {
  return axios.request({
    url: `/api/lis/getBarcodeData`,
    method: 'post',
    data: params
  })
}

// 删除日志列表
export const staffLogList = (pagination, params) => {
  return axios.request({
    url: `/booking/staffOperationLog/findDeletePersonalItemLogByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 删除日志详情
export const delLogInfo = (params) => {
  return axios.request({
    url: `/booking/staffOperationLog/findDeletePersonalItemLogInfo`,
    method: 'post',
    data: params
  })
}

// 生成插入sql
export const sqlSentence = (params) => {
  return axios.request({
    url: `/booking/staffOperationLog/recoverDeletePersonalItemById`,
    method: 'post',
    data: params
  })
}