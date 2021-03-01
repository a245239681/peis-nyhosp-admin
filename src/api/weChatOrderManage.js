import axios from '@/libs/api.request'

// 获取小程序订单列表
export const wechatOrderList = (pagination, params) => {
  return axios.request({
    url: `/booking/wxOrder/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 取消订单
export const refundOrder = (params) => {
  return axios.request({
    url: `/booking/wxOrder/refundOrder`,
    method: 'post',
    data: params
  })
}

// 关闭订单
export const closeOrder = (params) => {
  return axios.request({
    url: `/booking/wxOrder/shutDownWxOrder`,
    method: 'post',
    data: params
  })
}

// 查询订单详情
export const orderDetail = (params) => {
  return axios.request({
    url: `/booking/wxOrder/findWxOrderInfo`,
    method: 'post',
    data: params
  })
}