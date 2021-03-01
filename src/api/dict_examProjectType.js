import axios from '@/libs/api.request'

// 获取项目组合分类列表
export const comboTypeList = (pagination, params) => {
  return axios.request({
    url: `/package/comboType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const comboTypeSave = (params) => {
  return axios.request({
    url: '/package/comboType/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const comboTypeStatus = (params) => {
  return axios.request({
    url: '/package/comboType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除类别
export const comboTypeDelete = (params) => {
  return axios.request({
    url: '/package/comboType/delete',
    method: 'post',
    data: params
  })
}
