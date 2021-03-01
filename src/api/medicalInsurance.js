import axios from '@/libs/api.request'

// 获取医保字典分页列表
export const medicalList = (pagination, params) => {
  return axios.request({
    url: `/package/peDictMedicalType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改医保
export const medicalSave = (params) => {
  return axios.request({
    url: '/package/peDictMedicalType/saveAndUpdate',
    method: 'post',
    data: params
  })
}

// 修改状态
export const medicalStatus = (params) => {
  return axios.request({
    url: '/package/peDictMedicalType/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除医保
export const medicalDelete = (params) => {
  return axios.request({
    url: '/package/peDictMedicalType/delete',
    method: 'post',
    data: params
  })
}
