import axios from '@/libs/api.request'


// 获取缴费项目列表
export const balanceList = (params) => {
  return axios.request({
    url: '/charge/settleMaster/listByRegisterCode',
    method: 'post',
    data: params
  })
}

// 报价
export const budgetCost = (params) => {
  return axios.request({
    url: '/charge/settleMaster/budgetCost',
    method: 'post',
    data: params
  })
}

// 支付创建订单并发起支付 
export const payment = (params) => {
  return axios.request({
    url: '/charge/settleMaster/payment',
    method: 'post',
    data: params
  })
}

//支付结果查询&打印发票 
export const orderQuery = (params) => {
  return axios.request({
    url: '/charge/settleMaster/orderQuery',
    method: 'post',
    data: params
  })
}
