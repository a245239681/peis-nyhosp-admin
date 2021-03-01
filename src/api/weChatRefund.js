import axios from '@/libs/api.request'

// 获取小程序退费订单列表
export const wechatOrderRefundList = (pagination, params) => {
  return axios.request({
    url: `/booking/wxOrder/refundOrderListByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 同意退款
export const refundOrder = (params) => {
  return axios.request({
    url: `/booking/wxOrder/refundOrder`,
    method: 'post',
    data: params
  })
}

// 拒绝退款
export const refuseRefundOrder = (params) => {
  return axios.request({
    url: `/booking/wxOrder/refundOrderRefuse`,
    method: 'post',
    data: params
  })
}

// 查询退费单详情
export const RefundOrderDetail = (params) => {
  return axios.request({
    url: `/booking/wxOrder/findWxRefundOrderInfo`,
    method: 'post',
    data: params
  })
}