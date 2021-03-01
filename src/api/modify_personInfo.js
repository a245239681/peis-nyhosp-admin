import axios from '@/libs/api.request'

// 查找已登记的人员信息
export const findLastRegisterInfo = (pagination, params) => {
  return axios.request({
    url: `/booking/booking/findLastRegisterInfo?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

export const save = (params) => {
  return axios.request({
    url: `booking/booking/savePersonalItem`,
    method: 'post',
    data: params
  })
}
