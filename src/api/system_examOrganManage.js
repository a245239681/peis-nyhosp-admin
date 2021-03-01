import axios from '@/libs/api.request'

// 获取所有体检机构列表
export const getOrganList = (pagination, params) => {
  return axios.request({
    url: `/system-dict/sdOrg/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增机构
export const saveOrgan = (params) => {
  return axios.request({
    url: '/system-dict/sdOrg/save',
    method: 'post',
    data: params
  })
}

// 删除机构
export const deleteOrgan = (params) => {
  return axios.request({
    url: '/system-dict/sdOrg/delete',
    method: 'post',
    data: params
  })
}
