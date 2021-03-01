import axios from '@/libs/api.request'

// 获取分科建议列表
export const dictDeptSuggestList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDeptSuggest/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictDeptSuggestSave = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptSuggest/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDeptSuggestStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptSuggest/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictDeptSuggestDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptSuggest/delete',
    method: 'post',
    data: params
  })
}
