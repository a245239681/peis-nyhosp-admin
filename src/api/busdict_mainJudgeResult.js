import axios from '@/libs/api.request'

// 获取主检判定结果列表
export const dictDiterminationList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDitermination/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictDiterminationSave = (params) => {
  return axios.request({
    url: '/common-dict/dictDitermination/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDiterminationStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictDitermination/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictDiterminationDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictDitermination/delete',
    method: 'post',
    data: params
  })
}
