import axios from '@/libs/api.request'

// 获取分科小结列表
export const dictDeptConclusiontList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDeptConclusion/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictDeptConclusionSave = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptConclusion/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDeptConclusionStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptConclusion/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictDeptConclusionDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptConclusion/delete',
    method: 'post',
    data: params
  })
}
