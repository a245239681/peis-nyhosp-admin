import axios from '@/libs/api.request'

// 获取体检类别列表
export const dictCategoryList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictCategory/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictCategorySave = (params) => {
  return axios.request({
    url: '/common-dict/dictCategory/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictCategoryStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictCategory/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除类别
export const dictCategoryDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictCategory/delete',
    method: 'post',
    data: params
  })
}

// 附加表列表
export const additionList = (params) => {
  return axios.request({
    url: '/system-dict/dictTemplate/listAllEnableAddition',
    method: 'post',
    data: params
  })
}