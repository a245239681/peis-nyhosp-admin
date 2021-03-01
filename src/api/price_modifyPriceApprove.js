import axios from '@/libs/api.request'

// 获取体检费别列表
export const modifyMoneyList = (pagination, params) => {
  return axios.request({
    url: `/booking/modifyMoney/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 同意和拒绝申请
export const modifyStatus = (params) => {
  return axios.request({
    url: `/booking/modifyMoney/updateStatus`,
    method: 'post',
    data: params
  })
}
