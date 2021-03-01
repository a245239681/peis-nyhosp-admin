import axios from '@/libs/api.request'
// 全部项目
export const getSeachAll = (params, pagination) => {
  return axios.request({
    url: `/package/item/findItemByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
// his项目
export const getHisSeachAll = (params, pagination) => {
  return axios.request({
    url: `/package/item/findHisItemByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// lis项目
export const getLisSeachAll = (params, pagination) => {
  return axios.request({
    url: `/package/item/findLisItemByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 关联或取消关联
export const relationHis = (params) => {
  return axios.request({
    url: `/package/item/updateRelevance`,
    method: 'post',
    data: params
  })
}
// 接入his
export const getHis = (params) => {
  return axios.request({
    timeout: 1000 * 100,
    url: `/api/his/drugInfoSynchronous`,
    method: 'post',
    data: params
  })
}
