import axios from '@/libs/api.request'

// 获取线下支付记录列表
export const offlinePayRecord = (pagination, params) => {
  return axios.request({
    url: `/booking/financeRecord/offlinePaymentRecordByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}


// 线下支付记录导出
export const payRecordLeadout = (params) => {
  return axios.request({
    url: '/booking/financeRecord/offlinePaymentRecord/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}