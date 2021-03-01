import axios from '@/libs/api.request'


// 获取病人发票列表
export const billList = (params) => {
  return axios.request({
    url: '/charge/settleMaster/listInvoiceByRegisterCode',
    method: 'post',
    data: params
  })
}

// 退费操作
export const refund = (params) => {
  return axios.request({
    url: '/charge/settleMaster/refundForInvoice',
    method: 'post',
    data: params
  })
}
