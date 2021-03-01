import axios from '@/libs/api.request'

// 获取单位类别列表
export const clinicalListByPage = (pagination, params) => {
  return axios.request({
    url: `/package/peDictClinicalType/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改单位类别信息
export const clinicalSave = (params) => {
  return axios.request({
    url: '/package/peDictClinicalType/save',
    method: 'post',
    data: params
  })
}

// 删除单位类别
export const clinicalDelete = (params) => {
  return axios.request({
    url: '/package/peDictClinicalType/delete',
    method: 'post',
    data: params
  })
}
