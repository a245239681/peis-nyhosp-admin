import axios from '@/libs/api.request'

// 获取检查医生列表
export const checkDoctorMaintenanceList = (pagination, params) => {
  return axios.request({
    url: `/power/checkDoctorMaintenance/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增医生
export const checkDoctorMaintenanceSave = (params) => {
  return axios.request({
    url: '/power/checkDoctorMaintenance/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 修改状态
export const checkDoctorMaintenanceStatus = (params) => {
  return axios.request({
    url: '/power/checkDoctorMaintenance/isStatus',
    method: 'post',
    data: params
  })
}

// 删除
export const checkDoctorMaintenanceDelete = (params) => {
  return axios.request({
    url: '/power/checkDoctorMaintenance/isDelete',
    method: 'post',
    data: params
  })
}

// 新增医生
export const queryDoctorByName = (params) => {
  return axios.request({
    url: '/power/checkDoctorMaintenance/doctorList',
    method: 'post',
    data: params
  })
}
