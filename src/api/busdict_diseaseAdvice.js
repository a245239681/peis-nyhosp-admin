import axios from '@/libs/api.request'

// 获取体检疾病建议列表
export const dictSuggestList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictSuggestion/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictSuggestionSave = (params) => {
  return axios.request({
    url: '/common-dict/dictSuggestion/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDeptSuggestStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictSuggestion/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictSuggestionDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictSuggestion/delete',
    method: 'post',
    data: params
  })
}
