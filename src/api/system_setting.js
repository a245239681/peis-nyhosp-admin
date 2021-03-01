import axios from '@/libs/api.request'

// 获取列表
export const settingList = (pagination, params) => {
  return axios.request({
    url: `/system-dict/peSystemConfig/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改
export const settingSave = (params) => {
  return axios.request({
    url: '/system-dict/peSystemConfig/save',
    method: 'post',
    data: params
  })
}

// 删除
export const settingDelete = (id) => {
  return axios.request({
    url: '/system-dict/peSystemConfig?id=' + id,
    method: 'get'
  })
}
