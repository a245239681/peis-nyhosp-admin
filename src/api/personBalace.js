import axios from '@/libs/api.request'

// 结算页面查询接口
export const getBalaceList = (pagination, params) => {
  return axios.request({
    url: `/booking/personalItem/listByPeId?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 结算页面确认缴费接口
export const makeBalace = (params) => {
  return axios.request({
    url: `/booking/settleMaster/saveOrUpdate`,
    method: 'post',
    timeout: 60000,
    data: params
  })
}

// /dictPaymentType/list
// 结算页面支付方式
export const payMethods = () => {
  return axios.request({
    url: `/booking/dictPaymentType/list`,
    method: 'post'
  })
}

// 结算页面收据号发票号接口
export const invoiceAndReceipt = (params) => {
  return axios.request({
    url: `/charge/invoiceReceipt/getNextInvoiceNo`,
    method: 'post',
    data: params
  })
}

// 结算搜索病人查询接口
export const getPatientList = (pagination, params) => {
  return axios.request({
    url: `/inspect/deptResultDetails/findInfoByPeId1?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
// 打印缴费发票
export const print = (params) => {
  return axios.request({
    url: `/booking/settleMaster/printInvoice`,
    method: 'post',
    data: params
  })
}
