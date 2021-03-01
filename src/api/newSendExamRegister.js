import axios from '@/libs/api.request'

// 送检查询
export const examRegisterList = (pagination, params) => {
  return axios.request({
    url: `/inspect/peBarcodeRegister/newListByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
// 送检登记扫码
export const registerByCode = (params) => {
  return axios.request({
    url: `/inspect/peBarcodeRegister/inspectRegister`,
    method: 'post',
    data: params
  })
}

// 送检打印
export const barcodeRegisterLeadOut = (params) => {
  return axios.request({
    url: `/workload-dict/workloadDownloadController/barcodeRegister/exportTable`,
    method: 'post',
    responseType: 'arraybuffer',
    data: params,
    timeout: 1000 * 60
  })
}