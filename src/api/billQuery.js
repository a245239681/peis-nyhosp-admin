import axios from '@/libs/api.request'

// 发票查询
export const billList = (params) => {
  return axios.request({
    url: '/booking/wxOrder/queryInvoice',
    method: 'post',
    data: params
  })
}

// 发票详情
export const billInfo = (params) => {
  return axios.request({
    url: '/booking/wxOrder/invoiceInfo',
    method: 'post',
    data: params
  })
}

// 发票重打
export const billReprint = (params) => {
  return axios.request({
    url: '/booking/wxOrder/invoiceWhack',
    method: 'post',
    data: params
  })
}

// 新号重打
export const newBillPrint = (params) => {
  return axios.request({
    url: '/booking/wxOrder/newInvoiceWhack',
    method: 'post',
    data: params
  })
}