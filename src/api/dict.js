import axios from '@/libs/api.request'

// 获取科室字典列表
export const roomDictList = (params) => {
  return axios.request({
    url: '/power/dictDept/list',
    method: 'post',
    data: params
  })
}
// 获取体检项目字典
export const getTjDict = (params) => {
  return axios.request({
    url: '/package/dictSpeciman/findSpeciman',
    method: 'post',
    data: params
  })
}

// 检查类型字典列表
export const examTypeList = (params) => {
  return axios.request({
    url: '/package/dictExamType/list',
    method: 'post',
    data: params
  })
}

// 标本字典列表
export const specimanList = (params) => {
  return axios.request({
    url: '/package/dictSpeciman/list',
    method: 'post',
    data: params
  })
}

// 临床类型字典列表
export const clinicalList = (params) => {
  return axios.request({
    url: '/package/peDictClinicalType/list',
    method: 'post',
    data: params
  })
}

// 单位类别字典列表
export const unitTypeList = (params) => {
  return axios.request({
    url: '/system-dict/sdDictUnitType/list',
    data: params,
    method: 'post'
  })
}

// 国籍字典列表
export const countryList = (params) => {
  return axios.request({
    url: '/system-dict/sdDictCountry/list',
    data: params,
    method: 'post'
  })
}

// 民族字典列表
export const nationList = (params) => {
  return axios.request({
    url: '/system-dict/sdDictNation/list',
    data: params,
    method: 'post'
  })
}

// 获取职业字典列表
export const occupationList = (params) => {
  return axios.request({
    url: '/system-dict/sdDictOccupation/list',
    data: params,
    method: 'post'
  })
}

// 获取职称字典列表
export const jobTitleList = (params) => {
  return axios.request({
    url: '/system-dict/dictJobTitle/list',
    data: params,
    method: 'post'
  })
}

// 工作人员类别字典列表
export const staffTypeList = (params) => {
  return axios.request({
    url: '/common-dict/dictStaffType/list',
    data: params,
    method: 'post'
  })
}

// 身份字典列表
export const identityList = (params) => {
  return axios.request({
    url: '/system-dict/sdDictIdentity/list',
    data: params,
    method: 'post'
  })
}

// 获取医院科室字典列表
export const dictHisDeptList = (params) => {
  return axios.request({
    url: '/common-dict/dictHisDept/list',
    data: params,
    method: 'post'
  })
}

// 获取工作人员字典列表
export const staffDictList = (params) => {
  return axios.request({
    url: '/power/staff/staffList',
    data: params,
    method: 'post'
  })
}

// ICD10字典列表
export const ICD10List = (params) => {
  return axios.request({
    url: `/common-dict/baseIcd10/list`,
    data: params,
    method: 'post'
  })
}

// 优先级字典列表
export const priorityList = (params) => {
  return axios.request({
    url: `/common-dict/dictPriority/list`,
    data: params,
    method: 'post'
  })
}

// 费别字典列表
export const chargeTypeList = (params) => {
  return axios.request({
    url: `/common-dict/dictChargeType/list`,
    data: params,
    method: 'post'
  })
}

// 组合分类字典列表
export const comboTypeList = (params) => {
  return axios.request({
    url: `/package/comboType/list`,
    data: params,
    method: 'post'
  })
}

// 检查子类字典列表
export const examSubTypeList = (params) => {
  return axios.request({
    url: `/package/dictExamSubType/list`,
    data: params,
    method: 'post'
  })
}

// 试管分类字典列表
export const testTubeList = (params) => {
  return axios.request({
    url: `/package/dictTestTube/list`,
    data: params,
    method: 'post'
  })
}

// his科室字典列表
export const hisImplementDeptList = (params) => {
  return axios.request({
    url: `/package/combo/fandHisDept`,
    data: params,
    method: 'post'
  })
}

// 检查医生列表
export const examDoctorList = (params) => {
  return axios.request({
    url: `/common-dict/resultContrast/doctorList`,
    data: params,
    method: 'post'
  })
}

// 费用类别字典列表
export const expenseTypeList = (params) => {
  return axios.request({
    url: `/package/peDictReceiptType/list`,
    data: params,
    method: 'post'
  })
}

// 人员来源字典列表
export const personSourceList = (params) => {
  return axios.request({
    url: `/common-dict/peDictSource/list`,
    data: params,
    method: 'post'
  })
}

// 医生列表
export const checkDoctorMaintenanceList = (params) => {
  return axios.request({
    url: `/power/checkDoctorMaintenance/doctorList`,
    data: params,
    method: 'post'
  })
}

// 机构字典列表
export const orgList = (params) => {
  return axios.request({
    url: `/system-dict/sdOrg/list`,
    data: params,
    method: 'post'
  })
}

// 医保字典列表
export const medicalInsuranceList = (params) => {
  return axios.request({
    url: `/package/peDictMedicalType/list`,
    data: params,
    method: 'post'
  })
}

// 功能科室字典列表
export const funcRoomList = (params) => {
  return axios.request({
    url: `/power/peDictFunctionDept/list`,
    data: params,
    method: 'post'
  })
}

// 总检结论字典列表
export const mainConclusionList = (params) => {
  return axios.request({
    url: `/system-dict/SdMedicalConclusion/list`,
    data: params,
    method: 'post'
  })
}
