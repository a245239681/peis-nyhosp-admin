import axios from '@/libs/api.request'

// 获取预约记录列表
export const registerList = (pagination, params) => {
  return axios.request({
    url: `/booking/register/findAllByText?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
