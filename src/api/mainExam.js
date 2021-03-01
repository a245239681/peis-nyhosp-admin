import axios from '@/libs/api.request'

// 获取主检基本信息
export const mainExamBasicInfoList = (pagination, params) => {
  return axios.request({
    url: `/inspect/deptResultDetails/findInfoByPeId?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 获取诊断记录
export const deptResultDetailsList = (params) => {
  return axios.request({
    url: `/inspect/deptResultDetails/findAllByPeId`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}

// 保存总检
export const chiefDiagnosisSave = (params, type) => {
  return axios.request({
    url: `/inspect/chiefDiagnosis/saveOrUpdate?type=${type}`,
    method: 'post',
    data: params
  })
}

// 取消总检
export const cancelMainExam = (params) => {
  return axios.request({
    url: `/booking/patientVisit/update1`,
    method: 'post',
    data: params
  })
}

// 取消总检
export const cancelMainInspection = (params) => {
  return axios.request({
    url: `/booking/patientVisit/cancelMainExam`,
    method: 'post',
    data: params
  })
}

// 影像报告
export const getPicPort = (params) => {
  return axios.request({
    url: `/inspect/chiefDiagnosis/getPicPort`,
    method: 'post',
    data: params
  })
}

// 历次综述
export const historyReviewList = (params) => {
  return axios.request({
    url: `/inspect/deptResultDetails/historyReview`,
    method: 'post',
    data: params
  })
}

// 打印体检报告
export const reportPrint = (params) => {
  return axios.request({
    url: `/inspect/chiefDiagnosis/createPePdf`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}