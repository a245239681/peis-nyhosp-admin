import axios from '@/libs/api.request'

// 微信团检申请表分页查询接口
export const findAllByPage = (pagination, params) => {
  return axios.request({
    url: `/booking/wxBallCheckApply/findAllByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 微信团检申请表更新接口
export const updateWxBallCheckApply = (params) => {
  return axios.request({
    url: `/booking/wxBallCheckApply/updateWxBallCheckApply`,
    method: 'post',
    data: params
  })
}
