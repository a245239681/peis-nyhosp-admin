
import axios from '@/libs/api.request'

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

// 查单位体检分组分组与项目对照
export const searchGroupProjects = (params) => {
  return axios.request({
    url: '/booking/groupingDetailDict/list',
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

// 获取档案信息
export const archivesInfo = (params) => {
  return axios.request({
    url: `/booking/masterIndex/findOne`,
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

// 获取项目组合
export const getItemByPage = (pagination, params) => {
  return axios.request({
    url: `/package/combo/findComboAndItemByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取病人所选组合信息
export const selectComboInfo = (params) => {
  return axios.request({
    url: 'package/combo/findComboInfo',
    method: 'post',
    data: params
  })
}

// 获取病人预约单信息
export const bookingList = (params, pagination) => {
  return axios.request({
    url: `booking/booking/findBookingInfo?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取病人档案信息列表
export const profileList = (params, pagination) => {
  return axios.request({
    url: `booking/booking/findMasterIndexInfo?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}


// 根据单位id获取最新单位体检次数下的部门
export const newUnitDept = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/findDeptSon',
    method: 'post',
    data: params
  })
}

// 根据单位查询该单位体检次数及对应分组
export const unitGroupInfo = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/unitInfoByUnitId',
    method: 'post',
    data: params
  })
}

// 打印价格明细
export const printDetail = (params) => {
  return axios.request({
    url: '/booking/printing/priceDetails',
    method: 'post',
    data: params
  })
}

// 病人体检登记
export const saveRegister = (params) => {
  return axios.request({
    url: '/booking/register/saveRegister',
    method: 'post',
    data: params
  })
}

// 打印条码
export const printBarcode = (params) => {
  return axios.request({
    url: 'booking/register/getBarCodePdf',
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}

// 打印指引单
export const printGuide = (params) => {
  return axios.request({
    url: 'booking/register/finPrinting',
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
