import axios from '@/libs/api.request'

// 获取档案列表
export const archivesList = (pagination, params) => {
  return axios.request({
    url: `/booking/masterIndex/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 后台新增数据字段
export const getField = () => {
  return axios.request({
    url: `/booking/masterIndex/getField`,
    method: 'get',
    data: {}
  })
}

// 新增、修改类别
export const archivesSave = (params) => {
  return axios.request({
    url: '/booking/masterIndex/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 删除类别
export const archivesDelete = (params) => {
  return axios.request({
    url: '/masterIndex/delete',
    method: 'post',
    data: params
  })
}

// 上传图片
export const uploadPhoto = (params) => {
  return axios.request({
    url: '/booking/patientVisitPic/uploadFile',
    method: 'post',
    data: params
  })
}

// 删除图片
export const deletePhoto = (params) => {
  return axios.request({
    url: '/booking/patientVisitPic/delete',
    method: 'post',
    data: params
  })
}
