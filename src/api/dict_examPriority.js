import axios from '@/libs/api.request'

// 获取体检优先级列表
export const dictPriorityList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictPriority/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictPrioritySave = (params) => {
  return axios.request({
    url: '/common-dict/dictPriority/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictPriorityStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictPriority/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除优先级
export const dictPriorityDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictPriority/delete',
    method: 'post',
    data: params
  })
}
