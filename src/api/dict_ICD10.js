import axios from '@/libs/api.request'

// 获取列表
export const baseIcdList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/baseIcd10/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取列表(参数不同)
export const baseIcd10List = (pagination, params) => {
  return axios.request({
    url: `/common-dict/baseIcd10/page?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const baseIcdSave = (params) => {
  return axios.request({
    url: '/common-dict/baseIcd10/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const baseIcdStatus = (params) => {
  return axios.request({
    url: '/common-dict/baseIcd10/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除优先级
export const baseIcdDelete = (params) => {
  return axios.request({
    url: '/common-dict/baseIcd10/delete',
    method: 'post',
    data: params
  })
}
