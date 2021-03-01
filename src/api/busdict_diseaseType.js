import axios from '@/libs/api.request'

// 获取疾病分类列表(分页)
export const diseaseTypeList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/diseaseType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取疾病分类列表
export const diseaseTypeAllList = (params) => {
  return axios.request({
    url: `/common-dict/diseaseType/list`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const diseaseTypeSave = (params) => {
  return axios.request({
    url: '/common-dict/diseaseType/save',
    method: 'post',
    data: params
  })
}

// // 修改状态
export const diseaseTypeStatus = (params) => {
  return axios.request({
    url: '/common-dict/diseaseType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除疾病分类
export const diseaseTypeDelete = (params) => {
  return axios.request({
    url: '/common-dict/diseaseType/delete',
    method: 'post',
    data: params
  })
}
