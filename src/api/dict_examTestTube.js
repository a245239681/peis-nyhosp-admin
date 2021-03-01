import axios from '@/libs/api.request'

// 获取检验项目试管列表
export const testTubeList = (pagination, params) => {
  return axios.request({
    url: `/package/dictTestTube/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改
export const testTubeSave = (params) => {
  return axios.request({
    url: '/package/dictTestTube/save',
    method: 'post',
    data: params
  })
}
// 修改状态
export const dictTestTubeStatus = (params) => {
  return axios.request({
    url: '/package/dictTestTube/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除
export const testTubeDelete = (params) => {
  return axios.request({
    url: '/package/dictTestTube/delete',
    method: 'post',
    data: params
  })
}

// 获取试管项目组合列表
export const comboList = (params) => {
  return axios.request({
    url: '/package/dictTestTube/getComeoListByDeptId',
    method: 'post',
    data: params
  })
}
