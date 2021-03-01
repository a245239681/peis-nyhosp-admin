import axios from '@/libs/api.request'

// 获取功能科室列表
export const funcDeptList = (pagination, params) => {
  return axios.request({
    url: `/power/peDictFunctionDept/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增功能科室
export const funcDeptSave = (params) => {
  return axios.request({
    url: '/power/peDictFunctionDept/saveOrUpdate',
    method: 'post',
    data: params
  })
}

// 修改状态
export const funcDeptUpdateStatus = (params) => {
  return axios.request({
    url: '/power/peDictFunctionDept/isStatus',
    method: 'post',
    data: params
  })
}

// 删除科室
export const funcDeptDelete = (params) => {
  return axios.request({
    url: '/power/peDictFunctionDept/delete',
    method: 'post',
    data: params
  })
}
