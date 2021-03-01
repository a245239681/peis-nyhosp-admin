import axios from '@/libs/api.request'

// 获取主检生活指导列表
export const dictChiefRecommedationList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictChiefRecommedation/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改类别
export const dictChiefRecommedationSave = (params) => {
  return axios.request({
    url: '/common-dict/dictChiefRecommedation/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictChiefRecommedationStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictChiefRecommedation/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictChiefRecommedationDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictChiefRecommedation/delete',
    method: 'post',
    data: params
  })
}
