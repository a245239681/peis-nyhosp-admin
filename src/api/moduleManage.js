import axios from '@/libs/api.request'

// 模板设置列表
export const moduleList = (pagination, params) => {
  return axios.request({
    url: `/system-dict/dictTemplate/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

export const moduleSave = (params) => {
  return axios.request({
    url: `/system-dict/dictTemplate/save`,
    method: 'post',
    data: params
  })
}

// 模板类型
export const moduleType = (params) => {
  return axios.request({
    url: `/system-dict/dictTemplate/listType`,
    method: 'post',
    data: params
  })
}

// 修改模板状态
export const moduleStatus = (params) => {
  return axios.request({
    url: `/system-dict/dictTemplate/updateStatus`,
    method: 'post',
    data: params
  })
}

// 上传模板
export const uploadModule = (params) => {
  return axios.request({
    url: `/system-dict/dictTemplate/uploadFile`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params,
    timeout: 1000 * 60
  })
}