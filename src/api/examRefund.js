import axios from '@/libs/api.request'

// 获取退费人员信息
export const backFeeMsg = (params) => {
  return axios.request({
    url: `/booking/settleMaster/getBackFee`,
    method: 'post',
    data: params
  })
}
// 退费
export const backFeeSave = (params) => {
  return axios.request({
    url: `/booking/settleMaster/backFee`,
    method: 'post',
    data: params
  })
}
