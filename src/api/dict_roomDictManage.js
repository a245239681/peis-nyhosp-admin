import axios from '@/libs/api.request'

// 获取科室列表
export const dictDeptList = (pagination, params) => {
  return axios.request({
    url: `/power/dictDept/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增体检科室
export const dictDeptSave = (params) => {
  return axios.request({
    url: '/power/dictDept/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDeptUpdateStatus = (params) => {
  return axios.request({
    url: '/power/dictDept/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除科室
export const dictDeptDelete = (params) => {
  return axios.request({
    url: '/power/dictDept/delete',
    method: 'post',
    data: params
  })
}

// 导入his科室
export const departmentDataSynchronous = (params) => {
  return axios.request({
    timeout: 1000 * 100,
    url: '/api/his/departmentDataSynchronous',
    method: 'post',
    data: params
  })
}
