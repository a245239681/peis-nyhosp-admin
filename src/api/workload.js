import axios from '@/libs/api.request'

// 工作人员工作量报表接口
export const getWorkload = (params) => {
  return axios.request({
    url: '/booking/settleMaster/staffGetMoneyCount',
    method: 'post',
    data: params
  })
}

// 打印工作量统计报表接口
export const printWorkload = (dateRange, params) => {
  return axios.request({
    url: `/booking/printing/printWorkloadStatistics?startTime=${dateRange.startTime}&endTime=${dateRange.endTime}`,
    method: 'post',
    data: params
  })
}

// 项目开单工作量统计
export const billingList = (params) => {
  return axios.request({
    url: '/workload-dict/comboRegister/queryRegisterResult',
    method: 'post',
    data: params
  })
}

// 项目开单工作量导出
export const billingLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/comboRegister/exportTableComboRegister',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 科室工作量统计
export const deptWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/deptWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 科室工作量导出
export const deptLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/deptWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 根据单位查询该单位体检次数及对应分组
export const unitGroupInfo = (params) => {
  return axios.request({
    url: '/booking/dictUnitGrouping/unitInfoByUnitId',
    method: 'post',
    data: params
  })
}

// 总检医生工作量统计
export const finalDoctorWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/alwaysCheckDoctorWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 总检医生工作量导出
export const finalDoctorLeadOut = (params) => {
  return axios.request({
    url: '/workload-dict/alwaysCheckDoctorWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 主检医生工作量统计
export const mainDoctorWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/mainCheckDoctorWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 主检医生工作量导出
export const mainDoctorLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/mainCheckDoctorWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 指引单回收工作量统计
export const guideSheetWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/guideRecyclerWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 指引单回收工作量导出
export const guideSheetLeadOut = (params) => {
  return axios.request({
    url: '/workload-dict/guideRecyclerWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 体检表发放工作量统计
export const healthTableWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/medicalTableIssueWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 体检表发放工作量导出
export const healthTableLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/medicalTableIssueWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 报告装订工作量统计
export const bindingReportWorkloadList = (params) => {
  return axios.request({
    url: `/workload-dict/medicalTableIssueWorkload/findBindingReport`,
    method: 'post',
    data: params
  })
}

// 报告装订工作量导出
export const bindingReportLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/workloadDownloadController/bindingReport/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 报告领取工作量统计
export const receiveReportWorkloadList = (params) => {
  return axios.request({
    url: `/workload-dict/medicalTableIssueWorkload/findRecipientReport`,
    method: 'post',
    data: params
  })
}

// 报告领取工作量导出
export const receiveReportLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/workloadDownloadController/recipientReport/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 前台登记员工作量统计
export const receptionWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/registerWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 前台登记员工作量导出
export const receptionLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/registerWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 诊台医生工作量统计
export const diagnosticWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/checkDoctorWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 诊台医生工作量导出
export const diagnosticLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/checkDoctorWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 操作员工作量统计
export const operatorWorkloadList = (params) => {
  return axios.request({
    url: '/workload-dict/operatorWorkload/findAll',
    method: 'post',
    data: params
  })
}

// 操作员工作量导出
export const operatorLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/operatorWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 体检名单工作量统计
export const medicalWorkloadList = (pagination, params) => {
  return axios.request({
    url: `/workload-dict/medicalWorkload/findAllPage?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 体检名单工作量导出
export const medicalLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/medicalWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 分检体检名单查询
export const sortExamList = (pagination, params) => {
  return axios.request({
    url: `/workload-dict/checkDoctorWorkload/findAllPerson?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 分检名单导出
export const sortExamLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/checkDoctorWorkload/personExportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 主检体检名单查询
export const mainExamList = (pagination, params) => {
  return axios.request({
    url: `/workload-dict/mainCheckDoctorWorkload/findAllPerson?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 主检名单导出
export const mainExamLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/mainCheckDoctorWorkload/personExportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 总检体检名单查询
export const totalExamList = (pagination, params) => {
  return axios.request({
    url: `/workload-dict/alwaysCheckDoctorWorkload/findAllPerson?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 总检名单导出
export const totalExamLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/alwaysCheckDoctorWorkload/personExportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 总检综述建议名单查询
export const finalDetialList = (pagination, params) => {
  return axios.request({
    url: `workload-dict/alwaysCheckDoctorWorkload/findFinalResult?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 总检综述建议名单导出
export const finalDetialLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/alwaysCheckDoctorWorkload/exportTableFinalResult',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 阳性结果汇总列表
export const abnormalResultList = (pagination, params) => {
  return axios.request({
    url: `workload-dict/sunSexStatistics/findAllSunSexPerson?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 阳性结果导出
export const abnormalResultLeadout = (params) => {
  return axios.request({
    url: `workload-dict/sunSexStatistics/sunSexExportTable`,
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 异常结果统计查询
export const abnormalAnalysisList = (pagination, params) => {
  return axios.request({
    url: `workload-dict/abnormalResultStatistics/abnormalResult?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 异常结果导出
export const abnormalAnalysisLeadout = (params) => {
  return axios.request({
    url: `workload-dict/abnormalResultStatistics/exportTableAbnormalResult`,
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 已检项目汇总查询
export const checkedItemList = (pagination, params) => {
  return axios.request({
    url: `workload-dict/checkedItemsWorkload/findCheckedItems?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 已检项目导出
export const checkedItemLeadout = (params) => {
  return axios.request({
    url: `workload-dict/checkedItemsWorkload/checkedItemsExportTable`,
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 项目结果汇总查询
export const itemResultList = (pagination, params) => {
  return axios.request({
    url: `workload-dict/projectBriefSummary/itemSummary?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 项目结果汇总导出
export const itemResultLeadout = (params) => {
  return axios.request({
    url: `workload-dict/projectBriefSummary/exportTableItemSummary`,
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 项目组合小结查询
export const itemSummaryList = (pagination, params) => {
  return axios.request({
    url: `workload-dict/projectBriefSummary/comboSummary?page=${pagination.page}&size=${pagination.size}`,
    method: 'post',
    data: params
  })
}

// 项目组合小结统计导出
export const itemSummaryLeadout = (params) => {
  return axios.request({
    url: `workload-dict/projectBriefSummary/exportTableComboSummary`,
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 单位体检人员统计
export const examinerStatisticsList = (params) => {
  return axios.request({
    url: '/workload-dict/unitWorkload/findUnitPersonnelAll',
    method: 'post',
    data: params
  })
}

// 单位体检人员工作量导出
export const examinerLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/unitWorkload/exportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 单位加项统计
export const extraItemStatisticsList = (params) => {
  return axios.request({
    url: '/workload-dict/unitWorkload/findUnitAddItemAll',
    method: 'post',
    data: params
  })
}

// 单位加项工作量导出
export const extraItemLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/unitWorkload/AddUnitexportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}

// 单位应收费用统计
export const unitReceivableList = (params) => {
  return axios.request({
    url: '/workload-dict/unitWorkload/findUnitCostAll',
    method: 'post',
    data: params
  })
}

// 单位应收费用工作量导出
export const unitReceivableLeadout = (params) => {
  return axios.request({
    url: '/workload-dict/unitWorkload/shouldMoneyExportTable',
    method: 'post',
    responseType: 'arraybuffer',
    data: params
  })
}