import axios from '@/libs/api.request'

// 获取体检费别列表
export const dictChargeList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictChargeType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictChargeSave = (params) => {
  return axios.request({
    url: '/common-dict/dictChargeType/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictChargeStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictChargeType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除类别
export const dictChargeDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictChargeType/delete',
    method: 'post',
    data: params
  })
}
