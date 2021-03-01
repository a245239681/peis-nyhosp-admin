import axios from '@/libs/api.request'

// 获取菜单列表
export const getBookingList = (pagination, params) => {
  return axios.request({
    url: `/booking/booking/listHistroryAll?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取个人预约套餐记录
export const getBookingPackage = (pagination, params) => {
  return axios.request({
    url: `/package/dictPackage/listTree?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取套餐对应项目组合记录
export const getComboByPackage = (params) => {
  return axios.request({
    url: '/package/combo/getComboByPackage',
    method: 'post',
    data: params
  })
}

// 保存预约单
export const save = (params) => {
  return axios.request({
    url: '/booking/booking/save',
    method: 'post',
    data: params
  })
}

// 民族list，国家list，身份list，职业list
export const getAllDict = (params) => {
  return axios.request({
    url: '/system-dict/sdDictCountry/listAlldict',
    method: 'post',
    data: params
  })
}

// 查单位体检分组
export const listAllByUnitId = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/listAllByUnitId',
    method: 'post',
    data: params
  })
}

// 根据单位名称模糊查询单位
export const listByName = (params) => {
  return axios.request({
    url: 'booking/unit/listByName',
    method: 'post',
    data: params
  })
}

// 获取人员zhangbiao
export const getMasterIndexByNameAndIdNo = (params) => {
  return axios.request({
    url: '/booking/masterIndex/listByName',
    method: 'post',
    data: params
  })
}
