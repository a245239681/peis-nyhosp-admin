import axios from '@/libs/api.request'

// 获取菜单列表
export const getBookingList = (params) => {
  return axios.request({
    url: '/booking/booking/list',
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

// 获取项目组合树
export const getItemTreeByComboId = (params) => {
  return axios.request({
    url: '/package/combo/findComboTree',
    method: 'post',
    data: params
  })
}

// 保存预约单
export const save = (params) => {
  return axios.request({
    url: '/booking/register/save',
    method: 'post',
    data: params,
    timeout: 1000 * 60
  })
}

// 获取档案列表
export const archivesList = (pagination, params) => {
  return axios.request({
    url: `/booking/masterIndex/listByPage?page=${pagination.page}&size=${pagination.size}`,
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

// 根据单位名称模糊查询单位
export const listByName = (params) => {
  return axios.request({
    url: 'booking/unit/listByName',
    method: 'post',
    data: params
  })
}

// 获取人员已有的预约单
export const getMasterIndexByNameAndIdNo = (pagination, params) => {
  return axios.request({
    url: `booking/booking/listByStatus?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取项目
export const getItemByPage = (pagination, params) => {
  return axios.request({
    url: `/package/combo/findComboAndItemByPage?page=${pagination.page}&size=${pagination.size}`,
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

// 打印条码 - 单位批量分割多个PDF
export const printBarcodeMore = (params) => {
  return axios.request({
    url: 'booking/register/getUnitBarCodePdf',
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

// 打印指引单 - 单位批量分割多个PDF
export const printGuideMore = (params) => {
  return axios.request({
    url: 'booking/register/printGuideList',
    method: 'post',
    data: params,
    timeout: 1000 * 600
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


// 根据单位id获取最新单位体检次数下的部门
export const newUnitDept = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/findDeptSon',
    method: 'post',
    data: params
  })
}