import axios from '@/libs/api.request'

// 获取身份列表
export const identifyList = (pagination, params) => {
  return axios.request({
    url: `/system-dict/sdDictIdentity/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改身份信息
export const identifySave = (params) => {
  return axios.request({
    url: '/system-dict/sdDictIdentity/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const identifyStatus = (params) => {
  return axios.request({
    url: '/system-dict/sdDictIdentity/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除身份
export const identifyDelete = (params) => {
  return axios.request({
    url: '/system-dict/sdDictIdentity/delete',
    method: 'post',
    data: params
  })
}
