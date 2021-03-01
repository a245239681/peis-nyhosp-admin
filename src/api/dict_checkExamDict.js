import axios from '@/libs/api.request'

// 获取检查类别列表
export const dictExamTypeList = (pagination, params) => {
  return axios.request({
    url: `/package/dictExamType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictExamTypeSave = (params) => {
  return axios.request({
    url: '/package/dictExamType/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictExamTypeStatus = (params) => {
  return axios.request({
    url: '/package/dictExamType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除类别
export const dictExamTypeDelete = (params) => {
  return axios.request({
    url: '/package/dictExamType/delete',
    method: 'post',
    data: params
  })
}
