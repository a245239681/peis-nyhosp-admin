import axios from '@/libs/api.request'

// 指引单回收页面查询接口
export const findGuideSheetRecoverList = (pagination, params) => {
  return axios.request({
    url: `/booking/patientVisit/findGuideRecycle?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 指引单回收及恢复接口
export const guideSheetUpdate = (params) => {
  return axios.request({
    url: `/booking/patientVisit/saveGuideRecycle`,
    method: 'post',
    data: params
  })
}

// 指引单回收报表导出
export const guideSheetRecoverLeadout = (params) => {
  return axios.request({
    url: `workload-dict/guideRecycleStatistics/exportTableGuideRecycleResult`,
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}
