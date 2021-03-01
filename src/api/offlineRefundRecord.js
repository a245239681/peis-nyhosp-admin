import axios from '@/libs/api.request'

// 获取线下退费记录列表
export const offlineRefundRecord = (pagination, params) => {
  return axios.request({
    url: `/booking/financeRecord/offlineRefundRecordByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}


// 线下支付记录导出
export const refundRecordLeadout = (params) => {
  return axios.request({
    url: '/booking/financeRecord/offlineRefundRecord/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}