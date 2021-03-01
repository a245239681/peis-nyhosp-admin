import axios from '@/libs/api.request'

// 获取工作人员列表
export const staffMaintenanceList = (pagination, params) => {
  return axios.request({
    url: `/power/pePersonnelMaintenance/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增医生
export const staffMaintenanceSave = (params) => {
  return axios.request({
    url: '/power/pePersonnelMaintenance/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 修改状态
export const staffMaintenanceStatus = (params) => {
  return axios.request({
    url: '/power/pePersonnelMaintenance/isStatus',
    method: 'post',
    data: params
  })
}

// 删除
export const staffMaintenanceDelete = (params) => {
  return axios.request({
    url: '/power/pePersonnelMaintenance/delete',
    method: 'post',
    data: params
  })
}

// 搜索医生
export const queryDoctorByName = (params) => {
  return axios.request({
    url: '/power/checkDoctorMaintenance/doctorList',
    method: 'post',
    data: params
  })
}
