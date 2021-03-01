import axios from '@/libs/api.request'

// 获取科室病史列表
export const dictDeptMedicalHistorytList = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDeptMedicalHistory/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 新增、修改病史
export const dictDeptMedicalHistorySave = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptMedicalHistory/save',
    method: 'post',
    data: params
  })
}

// 修改状态
export const dictDeptMedicalHistoryStatus = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptMedicalHistory/updateStatus',
    method: 'post',
    data: params
  })
}

// 删除建议
export const dictDeptMedicalHistoryDelete = (params) => {
  return axios.request({
    url: '/common-dict/dictDeptMedicalHistory/delete',
    method: 'post',
    data: params
  })
}
