import axios from '@/libs/api.request'

// 指引单回收页面查询接口
export const healthTableList = (pagination, params) => {
  return axios.request({
    url: `/booking/patientVisit/findMedicalTableIssueByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 指引单回收及恢复接口
export const healthTableUpdate = (params) => {
  return axios.request({
    url: `/booking/patientVisit/saveMedicalTableIssue`,
    method: 'post',
    data: params
  })
}
