import axios from '@/libs/api.request'
// 项目以及明细
export const getSeachAll = (params, pagination) => {
  return axios.request({
    url: `/package/combo/getComboListByPage?page=${pagination.page}&size=${
      pagination.size
      }`,
    method: 'post',
    data: params
  })
}
// lis项目及明细
export const getLisSeachAll = (params, pagination) => {
  return axios.request({
    url: `/package/combo/getLisComboListByPage?page=${pagination.page}&size=${
      pagination.size
      }`,
    method: 'post',
    data: params
  })
}
// 取消及关联
export const relationLis = params => {
  return axios.request({
    url: `/package/combo/updateRelevance`,
    method: 'post',
    data: params
  })
}
// 导入Lis
export const importLis = params => {
  return axios.request({
    timeout: 1000 * 100,
    url: `/api/lis/getLisComboAndItem`,
    method: 'post',
    data: params
  })
}

// 导入Lis(智方)
export const newImportLis = params => {
  return axios.request({
    timeout: 1000 * 100,
    url: `/api/lis/getZfLisComboAndItem`,
    method: 'post',
    data: params
  })
}