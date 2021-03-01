import axios from '@/libs/api.request'

// 获取职业列表
export const occupationList = (pagination, params) => {
  return axios.request({
    url: `/system-dict/sdDictOccupation/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改
export const occupationSave = (params) => {
  return axios.request({
    url: '/system-dict/sdDictOccupation/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const occupationStatus = (params) => {
  return axios.request({
    url: '/system-dict/sdDictOccupation/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除身份
export const occupationDelete = (params) => {
  return axios.request({
    url: '/system-dict/sdDictOccupation/delete',
    method: 'post',
    data: params
  })
}
