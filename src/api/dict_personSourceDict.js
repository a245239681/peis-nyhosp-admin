import axios from '@/libs/api.request'

// 获取人员来源列表
export const peDictSourceList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/peDictSource/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const peDictSourceSave = (params) => {
  return axios.request({
    url: '/common-dict/peDictSource/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const peDictSourceStatus = (params) => {
  return axios.request({
    url: '/common-dict/peDictSource/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除类别
export const peDictSourceDelete = (params) => {
  return axios.request({
    url: '/common-dict/peDictSource/delete',
    method: 'post',
    data: params
  })
}
