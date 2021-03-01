import axios from '@/libs/api.request'

// 组合对应的单个项目
export const getSingleItem = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/findByComboId',
    method: 'post',
    data: params
  })
}

// 分检结果录入页面，项目信息查询
export const getCombo = (params) => {
  return axios.request({
    url: '/booking/booking/findCombo',
    method: 'post',
    data: params
  })
}

//  分检结果录入页面的信息查询
export const searchPatient = (pagination, params) => {
  return axios.request({
    url: `/booking/masterIndex/selectInformation?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 分检结果录入页面，项目结果判定
export const resultContrast = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/findResult',
    method: 'post',
    data: params
  })
}

// 分检结果录入页面，分科病史
export const medicalHistory = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDeptMedicalHistory/selectMedical?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 分检结果录入页面，分科小结
export const conclusion = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDeptConclusion/selectConclusion?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 分检结果录入页面，分科建议
export const suggest = (pagination, params) => {
  return axios.request({
    url: `/common-dict/dictDeptSuggest/selectSuggestion?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 分检结果录入页面，获取病人相片
export const patientVisitPic = (params) => {
  return axios.request({
    url: '/booking/patientVisitPic/findPic',
    method: 'post',
    data: params
  })
}

// 分检结果录入页面，保存结果
export const resultSave = (params) => {
  return axios.request({
    url: '/inspect/deptResult/save',
    method: 'post',
    data: params
  })
}

// 身高体重BMI计算
export const BMICaculate = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/selectBMI',
    method: 'post',
    data: params
  })
}

// 腰臀比计算
export const WHRCaculate = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/getWHR',
    method: 'post',
    data: params
  })
}

// 获取病人套餐
export const getSelectPackage = (params) => {
  return axios.request({
    url: '/booking/masterIndex/selectPackage',
    method: 'post',
    data: params
  })
}

// 体检获取已录入结果
export const recordSummary = (params) => {
  return axios.request({
    url: '/common-dict/resultContrast/findSummary',
    method: 'post',
    data: params
  })
}

// 根据登记流水号查病人
export const PatientMsgByRegisterCode = (params) => {
  return axios.request({
    url: '/booking/masterIndex/selectByRegisterCode',
    method: 'post',
    data: params
  })
}

// 病人拒检组合
export const refuseExam = (params) => {
  return axios.request({
    url: '/booking/personalItem/update',
    method: 'post',
    data: params
  })
}
// 删除分检结果
export const delExamResult = (params) => {
  return axios.request({
    url: 'booking/personalItem/delResult',
    method: 'post',
    data: params
  })
}
// 非标报告查询
export const checkReport = (params) => {
  return axios.request({
    url: '/inspect/chiefDiagnosis/getPicPortForCombo',
    method: 'post',
    data: params
  })
}
// 删除非标报告
export const deleteReport = (params) => {
  return axios.request({
    url: '/inspect/chiefDiagnosis/delPicPortForCombo',
    method: 'post',
    data: params
  })
}

// 上传非标报告
export const uploadPdf = (config, params) => {
  return axios.request({
    url: `/booking/patientVisitPic/uploadFile?peId=${config.peId}&visitSn=${config.visitSn}&comboId=${config.comboId}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params,
    timeout: 1000 * 600
  })
}
