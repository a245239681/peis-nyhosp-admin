import axios from '@/libs/api.request'

// 获取结算单列表
export const faceTofaceOrderList = (pagination, params) => {
  return axios.request({
    url: `/charge/settleMaster/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
