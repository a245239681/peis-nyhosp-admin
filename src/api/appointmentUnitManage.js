import axios from '@/libs/api.request'

// 获取单位信息管理列表
export const UnitInfoList = (pagination, params) => {
  return axios.request({
    url: `/booking/unit/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取单位当前信息树列表
export const UnitInfoTreeData = (params) => {
  return axios.request({
    url: `/booking/unit/findUnitName`,
    method: 'post',
    data: params
  })
}

// 获取单位所有信息树列表
export const UnitAllInfoTreeData = (params) => {
  return axios.request({
    url: `/booking/unit/findHistoryUnitName`,
    method: 'post',
    data: params
  })
}

// 新增、修改单位
export const UnitSave = (params) => {
  return axios.request({
    url: '/booking/unit/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 新增体检、转档
export const addExam = (params) => {
  return axios.request({
    url: 'booking/unit/shift',
    method: 'post',
    data: params
  })
}

// 单位完成体检
export const finishExam = (params) => {
  return axios.request({
    url: 'booking/unit/updateComplete',
    method: 'post',
    data: params
  })
}

// 检查单位是否存在
export const unitRepeat = (params) => {
  return axios.request({
    url: 'booking/unit/findUnitByName',
    method: 'post',
    data: params
  })
}
