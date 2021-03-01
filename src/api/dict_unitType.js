import axios from '@/libs/api.request'

// 获取单位类别列表
export const unitTypeList = (pagination, params) => {
  return axios.request({
    url: `/system-dict/sdDictUnitType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改单位类别信息
export const unitTypeSave = (params) => {
  return axios.request({
    url: '/system-dict/sdDictUnitType/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const unitTypeStatus = (params) => {
  return axios.request({
    url: '/system-dict/sdDictUnitType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除单位类别
export const unitTypeDelete = (params) => {
  return axios.request({
    url: '/system-dict/sdDictUnitType/delete',
    method: 'post',
    data: params
  })
}
