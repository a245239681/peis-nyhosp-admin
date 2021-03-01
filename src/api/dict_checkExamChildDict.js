import axios from '@/libs/api.request'

// 获取检查子类别列表
export const dictExamChildTypeList = (pagination, params) => {
  return axios.request({
    url: `/package/dictExamSubType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictExamChildTypeSave = (params) => {
  return axios.request({
    url: '/package/dictExamSubType/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictExamSubTypeStatus = (params) => {
  return axios.request({
    url: '/package/dictExamSubType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除类别
export const dictExamChildTypeDelete = (params) => {
  return axios.request({
    url: '/package/dictExamSubType/delete',
    method: 'post',
    data: params
  })
}
