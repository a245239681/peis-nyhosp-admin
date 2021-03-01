import axios from '@/libs/api.request'

// 获取体检项目结果对照列表
export const resultContrastList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/resultContrast/listByPage?page=${pagination.page}&size=${pagination.size}`,
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
export const resultContrastSave = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const resultContrastStatus = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const resultContrastDelete = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/delete',
    method: 'post',
    data: params
  })
}

// 左侧树状结构数据
export const getDeptTreeData = (params) => {
  return axios.request({
    url: '/package/item/itemDeptStructure',
    method: 'post',
    data: params
  })
}
