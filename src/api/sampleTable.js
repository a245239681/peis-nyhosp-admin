import axios from '@/libs/api.request'

// 检前采样查询
export const checkSample = (params) => {
  return axios.request({
    url: `/inspect/peBarcodeRegister/findSampling`,
    method: 'post',
    data: params
  })
}

// 获取病人相片
export const patientVisitPic = (params) => {
  return axios.request({
    url: '/booking/patientVisitPic/findPic',
    method: 'post',
    data: params
  })
}

// 登记
export const sampleRegister = (params) => {
  return axios.request({
    url: '/inspect/peBarcodeRegister/register',
    method: 'post',
    data: params
  })
}

// 作废
export const sampleInvalid = (params) => {
  return axios.request({
    url: '/inspect/peBarcodeRegister/isDelete',
    method: 'post',
    data: params
  })
}

// 根据流水号查询
export const searchByRegister = (params) => {
  return axios.request({
    url: '/inspect/peBarcodeRegister/registerCode',
    method: 'post',
    data: params
  })
}
