import axios from '@/libs/api.request'

// 获取用户列表
export const roleList = (pagination, params) => {
  return axios.request({
    url: `/power/role/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
// 新增、修改类别
export const roleSave = (params) => {
  return axios.request({
    url: '/power/role/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const roleStatus = (params) => {
  return axios.request({
    url: '/power/role/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除优先级
export const roleDelete = (params) => {
  return axios.request({
    url: '/power/role/delete',
    method: 'post',
    data: params
  })
}
