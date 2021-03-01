import axios from '@/libs/api.request'
// 获取单位信息
export const getUnitList = (params) => {
  return axios.request({
    url: `/booking/unit/listByName`,
    method: 'post',
    data: params
  })
}
//  单位体检记录分页查询接口
export const getSerchUnitList = (pagination, params) => {
  return axios.request({
    url: `/booking/unitVisit/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
//  归档 撤档
export const updateStatus = (params) => {
  return axios.request({
    url: `booking/unitVisit/updateIsFileUp`,
    method: 'post',
    data: params
  })
}
//  体检状态
export const setStatus = (params) => {
  return axios.request({
    url: `/booking/unitVisit/updateIsComplete`,
    method: 'post',
    data: params
  })
}
// 单位团检报告查询接口 - 打印
//  /booking/unit/getUnitPort
export const getUnitReport = (params) => {
  return axios.request({
    url: `/booking/ballCheck/ballCheckPrinting`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
// 单位团检报告查询接口 - 分割PDF打印(废弃)
export const getMoreUnitReport = (params) => {
  return axios.request({
    url: `/booking/unit/getUnitPort1`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
