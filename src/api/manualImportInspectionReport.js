import axios from '@/libs/api.request'

// 获取检验报告
export const getReport = (pagination, params) => {
  return axios.request({
    url: `/booking/patientVisit/manualGetInspectionDataByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
// 导入检验数据
export const reportJY = (params) => {
  return axios.request({
    url: `api/lis/manualGetLisPatientTestReport`,
    method: 'post',
    data: params
  })
}
