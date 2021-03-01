import axios from '@/libs/api.request'
// 体检综合进度表接口
export const searchList = (pagination, params) => {
  return axios.request({
    url: `/booking/patientVisit/scheduleListByPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}
// 打印条码
export const printBarCode = (params) => {
  return axios.request({
    url: `/booking/patientVisit/getBarCodePdf`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
// 打印指引单
export const guideSheetPrint = (params) => {
  return axios.request({
    url: `/booking/register/printingGuide`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
// 打印体检报告
export const reportPrint = (params) => {
  return axios.request({
    url: `/inspect/chiefDiagnosis/createReportPdf`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
// 打印分检报告
export const sortReportPrint = (params) => {
  return axios.request({
    url: `/inspect/chiefDiagnosis/createUncompletedReport`,
    method: 'post',
    data: params,
    timeout: 1000 * 600
  })
}
// 获取照片
export const getPicture = (params) => {
  return axios.request({
    url: `/booking/patientVisitPic/findPic`,
    method: 'post',
    data: params
  })
}
// 体检组合明细
export const getComboAndItem = (params) => {
  return axios.request({
    url: `/package/combo/getPatientComboAndItem`,
    method: 'post',
    data: params
  })
}
// 取消登记 （未检状态下）
export const cancelRegister = (params) => {
  return axios.request({
    url: `/booking/register/cancelRegister`,
    method: 'post',
    data: params
  })
}

// 获取体检操作记录
export const handleLogList = (params) => {
  return axios.request({
    url: `/inspect/deptResult/queryMedicalSchedule`,
    method: 'post',
    data: params
  })
}

// 根据条码获取要装订的报告
export const bingdingReport = (params) => {
  return axios.request({
    url: `/booking/patientVisit/findBindingReportInfo`,
    method: 'post',
    data: params
  })
}

// 保存要装订的报告
export const bingdingReportSave = (params) => {
  return axios.request({
    url: `/booking/patientVisit/saveBindingReportInfo`,
    method: 'post',
    data: params
  })
}

// 根据条码获取要领取的报告
export const drawReport = (params) => {
  return axios.request({
    url: `/booking/patientVisit/findReceiveReportInfo`,
    method: 'post',
    data: params
  })
}

// 保存要装订的报告
export const drawReportSave = (params) => {
  return axios.request({
    url: `/booking/patientVisit/saveReceiveReportInfo`,
    method: 'post',
    data: params
  })
}

// 根据条码获取要打印的报告
export const batchReport = (params) => {
  return axios.request({
    url: `/booking/patientVisit/findMedicalInfo`,
    method: 'post',
    data: params
  })
}

// 批量总检
export const batchSaveInspection = (params) => {
  return axios.request({
    url: `/inspect/chiefDiagnosis/batchSaveInspection`,
    method: 'post',
    data: params
  })
}