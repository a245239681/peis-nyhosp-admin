import axios from '@/libs/api.request'

// 送检查询
export const examRegisterList = (pagination, params) => {
  return axios.request({
    url: `/inspect/peBarcodeRegister/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
// 送检登记扫码
export const barCodeRegister = (params) => {
  return axios.request({
    url: `/inspect/peBarcodeRegister/barCode`,
    method: 'post',
    data: params
  })
}

// 送检打印
export const printBarcodeRegister = (params) => {
  return axios.request({
    url: `/inspect/peBarcodeRegister/printBarcodeRegister`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
