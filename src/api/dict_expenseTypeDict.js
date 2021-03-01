import axios from '@/libs/api.request'

// 获取体检类别列表
export const peDictReceiptTypeList = (pagination, params) => {
  return axios.request({
    url: `/package/peDictReceiptType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const peDictReceiptTypeSave = (params) => {
  return axios.request({
    url: '/package/peDictReceiptType/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const peDictReceiptTypeStatus = (params) => {
  return axios.request({
    url: '/package/peDictReceiptType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除类别
export const peDictReceiptTypeDelete = (params) => {
  return axios.request({
    url: '/package/peDictReceiptType/delete',
    method: 'post',
    data: params
  })
}
