import axios from '@/libs/api.request'

// 获取小程序支付记录列表
export const wechatPayRecord = (pagination, params) => {
  return axios.request({
    url: `/booking/financeRecord/appletPaymentRecordByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}


// 小程序支付记录导出
export const payRecordLeadout = (params) => {
  return axios.request({
    url: '/booking/financeRecord/appletPaymentRecord/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}