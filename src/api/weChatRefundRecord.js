import axios from '@/libs/api.request'

// 获取小程序退费记录列表
export const wechatRefundRecord = (pagination, params) => {
  return axios.request({
    url: `/booking/financeRecord/appletRefundRecordByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 小程序退费记录导出
export const refundRecordLeadout = (params) => {
  return axios.request({
    url: '/booking/financeRecord/appletRefundRecord/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}