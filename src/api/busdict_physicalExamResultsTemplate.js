import axios from '@/libs/api.request'

// 获取录入模板列表
export const templateItemResultList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/templateItemResult/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取体检项目结果录入模板列表
export const itemResultsList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/templateItemResult/getItem?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const templateItemResultSave = (params) => {
  return axios.request({
    url: '/common-dict/templateItemResult/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const templateItemResultStatus = (params) => {
  return axios.request({
    url: '/common-dict/templateItemResult/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const templateItemResultDelete = (params) => {
  return axios.request({
    url: '/common-dict/templateItemResult/delete',
    method: 'post',
    data: params
  })
}
