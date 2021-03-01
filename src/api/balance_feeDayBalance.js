import axios from '@/libs/api.request'

// 获取结算单列表
export const dailyDetailList = (pagination, params) => {
  return axios.request({
    url: `/charge/daily/listByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 点击日结按钮
export const dailyBalance = (params) => {
  return axios.request({
    url: `/charge/daily/daily`,
    method: 'post',
    data: params
  })
}

// 日期变化
export const getDailyCount = (params) => {
  return axios.request({
    url: `/charge/daily/getDailyCount`,
    method: 'post',
    data: params
  })
}
