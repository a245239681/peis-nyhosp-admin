import axios from '@/libs/api.request'

// 获取批量送检列表
export const batchSendExamList = (pagination, params) => {
  return axios.request({
    url: `/inspect/peBarcodeRegister/getBatchBarcodeRegisterByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params,
    timeout: 1000 * 60
  })
}

// 送检
export const sendExamSave = (params) => {
  return axios.request({
    url: '/inspect/peBarcodeRegister/batchInspectRegister',
    method: 'post',
    data: params,
    timeout: 1000 * 60
  })
}
// 取消送检
export const sendExamCancel = (params) => {
  return axios.request({
    url: '/inspect/peBarcodeRegister/cancelInspectRegister',
    method: 'post',
    data: params,
    timeout: 1000 * 60
  })
}