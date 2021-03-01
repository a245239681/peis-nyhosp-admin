import axios from '@/libs/api.request'

// 获取结算单列表
export const dailyList = (pagination, params) => {
  return axios.request({
    url: `/charge/daily/listDailyByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

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

// 收费日汇总报表接口
export const getDayCount = (params) => {
  return axios.request({
    url: '/charge/daily/dayCount',
    method: 'post',
    data: params
  })
}

// 打印门诊收款汇总日报表接口
export const printDailyChargeSummary = (params) => {
  return axios.request({
    url: '/charge/daily/printDayCount',
    method: 'post',
    data: params
  })
}

// 取消日结
export const cancelDaily = (params) => {
  return axios.request({
    url: '/charge/daily/unDaily',
    method: 'post',
    data: params
  })
}
