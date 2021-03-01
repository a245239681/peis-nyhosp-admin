import axios from '@/libs/api.request'

// 分页搜索,分页列表,科室搜索
export const searchList = (params, params1) => {
  return axios.request({
    url: `/package/item/findAllByText?page=${params.page}&size=${params.size}`,
    method: 'post',
    data: params1
  })
}
// 启用或停用
export const startOrStop = (params) => {
  return axios.request({
    url: `/package/item/updateStatus`,
    method: 'post',
    data: params
  })
}
// 保存或修改
export const save = (params) => {
  return axios.request({
    url: `/package/item/saveItem`,
    method: 'post',
    data: params
  })
}
// 删除
export const del = (params) => {
  return axios.request({
    url: `/package/item/delete`,
    method: 'post',
    data: params
  })
}
// 序号排序

export const sortByDeptId = (params) => {
  return axios.request({
    url: `/package/item/sortByDeptId`,
    method: 'post',
    data: params
  })
}
