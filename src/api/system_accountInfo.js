import axios from '@/libs/api.request'

// 获取用户列表
export const getAccountList = (pagination, params) => {
  return axios.request({
    url: `/power/dictUser/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取工作人员字典列表
export const getStaffList = (pagination, params) => {
  return axios.request({
    url: `/power/staff/findStaffAllByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改工作人员
export const editStaff = (params) => {
  return axios.request({
    url: '/power/staff/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 新增、修改用户
export const editAccount = (params) => {
  return axios.request({
    url: '/power/dictUser/save',
    method: 'post',
    data: params
  })
}

// 删除用户
export const accountDelete = (params) => {
  return axios.request({
    url: '/power/dictUser/delete',
    method: 'post',
    data: params
  })
}

// 删除工作人员
export const staffDelete = (params) => {
  return axios.request({
    url: '/power/staff/delete',
    method: 'post',
    data: params
  })
}

// 修改工作人员状态
export const staffStatus = (params) => {
  return axios.request({
    url: '/power/staff/updateStatus',
    method: 'post',
    data: params
  })
}

// 修改工作人员状态
export const accountStatus = (params) => {
  return axios.request({
    url: '/power/dictUser/updateStatus',
    method: 'post',
    data: params
  })
}

// 获取用户权限列表
export const getLimitMenuList = (params) => {
  return axios.request({
    url: '/power/menuAuthorityFunction/list',
    method: 'post',
    data: params
  })
}

// 修改用户权限
export const editAccountLimit = (params) => {
  return axios.request({
    url: '/power/menuAuthorityFunction/save',
    method: 'post',
    data: params
  })
}

// 导入his人员
export const doctorDataSynchronous = (params) => {
  return axios.request({
    timeout: 1000 * 100,
    url: '/api/his/doctorDataSynchronous',
    method: 'post',
    data: params
  })
}
