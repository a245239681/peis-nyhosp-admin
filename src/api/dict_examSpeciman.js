import axios from '@/libs/api.request'

// 获取单位类别列表
export const specimanList = (pagination, params) => {
  return axios.request({
    url: `/package/dictSpeciman/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改单位类别信息
export const specimanSave = (params) => {
  return axios.request({
    url: '/package/dictSpeciman/save',
    method: 'post',
    data: params
  })
}
// 修改状态
export const dictSpecimanStatus = (params) => {
  return axios.request({
    url: '/package/dictSpeciman/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除单位类别
export const specimanDelete = (params) => {
  return axios.request({
    url: '/package/dictSpeciman/delete',
    method: 'post',
    data: params
  })
}
