import axios from '@/libs/api.request'
// 分页搜索,分页列表,科室搜索
// export const searchList = (params, params1) => {
//   return axios.request({
//     url: `/package/dictPackage/listByPage?page=${params.page}&size=${params.size}`,
//     method: 'post',
//     data: params1,
//   })
// }
// 保存或修改
export const save = (params) => {
  return axios.request({
    url: `/package/combo/saveCombo`,
    method: 'post',
    data: params
  })
}
// 项目组合分页或查询
export const searchList = (params, params1) => {
  return axios.request({
    url: `/package/combo/listByPage?page=${params.page}&size=${params.size}`,
    method: 'post',
    data: params1
  })
}
// 停用或者启用
export const startOrStop = (params) => {
  return axios.request({
    url: `/package/combo/updateStatus`,
    method: 'post',
    data: params
  })
}
// 删除
export const del = (params) => {
  return axios.request({
    url: `/package/combo/delete`,
    method: 'post',
    data: params
  })
}

// 根据科室查单项
export const roomItemList = (params) => {
  return axios.request({
    url: `/package/item/findAll`,
    method: 'post',
    data: params
  })
}

// 根据组合id查单项内容
export const comboItemList = (params) => {
  return axios.request({
    url: `/package/combo/findByComboId`,
    method: 'post',
    data: params
  })
}

// 序号
export const sortByDeptId = (params) => {
  return axios.request({
    url: `/package/combo/sortByDeptId`,
    method: 'post',
    data: params
  })
}
