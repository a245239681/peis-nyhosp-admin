import axios from '@/libs/api.request'

// 发票查询接口接口
export const getInvoiceNo = (params) => {
  return axios.request({
    url: '/booking/settleMaster/getInvoiceNo',
    method: 'post',
    data: params
  })
}

// 打印工作量统计报表接口
// export const printWorkload = (dateRange, params) => {
//   return axios.request({
//     url: `/booking/printing/printWorkloadStatistics?startTime=${dateRange.startTime}&endTime=${dateRange.endTime}`,
//     method: 'post',
//     data: params
//   })
// }
