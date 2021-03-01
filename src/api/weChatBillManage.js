import axios from '@/libs/api.request'

// 获取小程序订单补打发票列表
export const billList = (pagination, params) => {
  return axios.request({
    url: `/booking/wxOrder/listInvoiceByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取发票预览信息
export const billPreViewInfo = (params) => {
  return axios.request({
    url: `/booking/wxOrder/invoicePreview`,
    method: 'post',
    data: params
  })
}

// 打印发票
export const printBill = (params) => {
  return axios.request({
    url: `/booking/wxOrder/createInvoice`,
    method: 'post',
    data: params
  })
}
