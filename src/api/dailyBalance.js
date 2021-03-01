import axios from '@/libs/api.request'

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
    url: '/booking/printing/printDailyChargeSummary',
    method: 'post',
    data: params
  })
}
