import axios from '@/libs/api.request'
// 分页搜索,分页列表,科室搜索
export const searchList = (params, params1) => {
  return axios.request({
    url: `/package/dictPackage/listByPage?page=${params.page}&size=${params.size}`,
    method: 'post',
    data: params1
  })
}
// 保存或修改
export const save = (params) => {
  return axios.request({
    url: `/package/dictPackage/savePackage`,
    method: 'post',
    data: params
  })
}
// 体检套餐项目组合
export const getList = (params) => {
  return axios.request({
    url: `/package/combo/findAll`,
    method: 'post',
    data: params
  })
}
// 停用或者启用
export const startOrStop = (params) => {
  return axios.request({
    url: `/package/dictPackage/updateStatus`,
    method: 'post',
    data: params
  })
}
// 套餐类别
export const mealTypeDict = (params) => {
  return axios.request({
    url: `/common-dict/dictCategory/list`,
    method: 'post',
    data: params
  })
}
// 查询套餐对应的项目
export const comboList = (params) => {
  return axios.request({
    url: `/package/combo/findComboById`,
    method: 'post',
    data: params
  })
}

// 上传套餐图片
export const uploadPackagePic = (params) => {
  return axios.request({
    url: `/booking/patientVisitPic/uploadPackageImg`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params,
    timeout: 1000 * 600
  })
}
