import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
// 动态路由菜单
export const mainRouters = {
  // 预约登记
  archivesManage: () => import('@/views/appointmentRegister/archivesManage/index.vue'),
  personalAppointment: () => import('@/views/appointmentRegister/personalAppointment/index.vue'),
  networkRegister: () => import('@/views/appointmentRegister/networkRegister/index.vue'),
  personalRegister: () => import('@/views/appointmentRegister/personalRegister/index.vue'),
  newPersonRegister: () => import('@/views/appointmentRegister/newPersonRegister/index.vue'),
  modifyPersonInfo: () => import('@/views/appointmentRegister/modifyPersonInfo/index.vue'),
  guideSheetManage: () => import('@/views/appointmentRegister/guideSheetManage/index.vue'),
  barcodeManage: () => import('@/views/appointmentRegister/barcodeManage/index.vue'),
  // appointmentRecord: resolve => require(['@/views/appointmentRegister/appointmentRecord/index.vue'], resolve),
  // registerRecord: resolve => require(['@/views/appointmentRegister/registerRecord/index.vue'], resolve),
  infoManage: () => import('@/views/appointmentRegister/unitManage/infoManage/index.vue'),
  groupManage: () => import('@/views/appointmentRegister/unitManage/groupManage/index.vue'),
  unitDeptManage: () => import('@/views/appointmentRegister/unitManage/unitDeptManage/index.vue'),
  examProgressManage: () => import('@/views/appointmentRegister/examProgressManage/index.vue'),
  // staffImport: resolve => require(['@/views/appointmentRegister/unitManage/staffImport/index.vue'], resolve),
  unitExamFlieManage: () => import('@/views/appointmentRegister/unitManage/unitExamFlieManage/index.vue'),
  unitRegister: () => import('@/views/appointmentRegister/unitManage/unitRegister/index.vue'),
  unitPersonManage: () => import('@/views/appointmentRegister/unitManage/unitPersonManage/index.vue'),
  checkAppointManage: () => import('@/views/appointmentRegister/checkAppointManager/index.vue'),
  unitTransfer: () => import('@/views/appointmentRegister/unitManage/unitTransfer/index.vue'),
  wxBallCheckApply: () => import('@/views/appointmentRegister/unitManage/wxBallCheckApply/index.vue'),
  guideSheetRecover: () => import('@/views/appointmentRegister/guideSheetRecover/index.vue'),
  healthTable: () => import('@/views/appointmentRegister/healthTable/index.vue'),
  registerSign: () => import('@/views/appointmentRegister/registerSign/index.vue'),

  // 体检项目管理
  physicalExamMealManage: () => import('@/views/system/physicalExamProjectManage/physicalExamMealManage/index.vue'),
  // physicalExamDepartManage: resolve => require(['@/views/system/physicalExamProjectManage/physicalExamDepartManage/index.vue'], resolve),
  singleItemMannage: () => import('@/views/system/physicalExamProjectManage/singleItemMannage/index.vue'),
  itemGroupManage: () => import('@/views/system/physicalExamProjectManage/itemGroupManage/index.vue'),
  projectMaintain: () => import('@/views/system/physicalExamProjectManage/projectMaintain/index.vue'),
  projectTeamMaintain: () => import('@/views/system/physicalExamProjectManage/projectTeamMaintain/index.vue'),
  lisDetailContrastManage: () => import('@/views/system/physicalExamProjectManage/lisDetailContrastManage/index.vue'),
  newLisComboContrast: () => import('@/views/system/physicalExamProjectManage/newLisComboContrast/index.vue'),
  newLisDetailManage: () => import('@/views/system/physicalExamProjectManage/newLisDetailManage/index.vue'),
  staffManage: () => import('@/views/system/organManage/staffManage/index.vue'),
  // 菜单管理
  menuListManage: () => import('@/views/system/menuManage/menuListManage/index.vue'),
  deptManage: () => import('@/views/system/menuManage/deptManage/index.vue'),
  // 字典管理
  roomDictManage: () => import('@/views/system/dictManage/roomDictManage/index.vue'),
  examTypeDict: () => import('@/views/system/dictManage/examTypeDict/index.vue'),
  checkExamDict: () => import('@/views/system/dictManage/checkExamDict/index.vue'),
  checkExamChildDict: () => import('@/views/system/dictManage/checkExamChildDict/index.vue'),
  examProjectType: () => import('@/views/system/dictManage/examProjectType/index.vue'),
  identityDict: () => import('@/views/system/dictManage/identityDict/index.vue'),
  staffDict: () => import('@/views/system/dictManage/staffDict/index.vue'),
  examPriority: () => import('@/views/system/dictManage/examPriority/index.vue'),
  unitTypeDict: () => import('@/views/system/dictManage/unitTypeDict/index.vue'),
  professionDict: () => import('@/views/system/dictManage/professionDict/index.vue'),
  examPayoff: () => import('@/views/system/dictManage/examPayoff/index.vue'),
  examSpecimen: () => import('@/views/system/dictManage/examSpecimen/index.vue'),
  clinicalType: () => import('@/views/system/dictManage/clinicalType/index.vue'),
  examTestTube: () => import('@/views/system/dictManage/examTestTube/index.vue'),
  guideSheetGroup: () => import('@/views/system/dictManage/guideSheetGroup/index.vue'),
  ICDDict: () => import('@/views/system/dictManage/ICDDict/index.vue'),
  expenseTypeDict: () => import('@/views/system/dictManage/expenseTypeDict/index.vue'),
  personSourceDict: () => import('@/views/system/dictManage/personSourceDict/index.vue'),
  medicalInsurance: () => import('@/views/system/dictManage/medicalInsurance/index.vue'),
  functionRoomManage: () => import('@/views/system/dictManage/functionRoomManage/index.vue'),

  // 机构管理
  examCenter: () => import('@/views/system/organManage/examCenter/index.vue'),
  examOrganManage: () => import('@/views/system/organManage/examOrganManage/index.vue'),
  accountInfo: () => import('@/views/system/organManage/accountInfo/index.vue'),
  roleManage: () => import('@/views/system/organManage/roleManage/index.vue'),
  examDoctorManage: () => import('@/views/system/organManage/examDoctorManage/index.vue'),
  systemSetting: () => import('@/views/system/organManage/systemSetting/index.vue'),

  // 业务字典管理
  diseaseTypeDict: () => import('@/views/system/businessDictManage/diseaseTypeDict/index.vue'),
  diseaseInfo: () => import('@/views/system/businessDictManage/diseaseInfo/index.vue'),
  diseaseScience: () => import('@/views/system/businessDictManage/diseaseScience/index.vue'),
  diseaseAdvice: () => import('@/views/system/businessDictManage/diseaseAdvice/index.vue'),
  deptMedicalHistory: () => import('@/views/system/businessDictManage/deptMedicalHistory/index.vue'),
  branchAdvice: () => import('@/views/system/businessDictManage/branchAdvice/index.vue'),
  branchSummary: () => import('@/views/system/businessDictManage/branchSummary/index.vue'),
  mainLiveGuidance: () => import('@/views/system/businessDictManage/mainLiveGuidance/index.vue'),
  physicalExamResultsDiagnosis: () => import('@/views/system/businessDictManage/physicalExamResultsDiagnosis/index.vue'),
  physicalExamResultsTemplate: () => import('@/views/system/businessDictManage/physicalExamResultsTemplate/index.vue'),
  physicalExamResultsContrast: () => import('@/views/system/businessDictManage/physicalExamResultsContrast/index.vue'),
  mainJudgeResult: () => import('@/views/system/businessDictManage/mainJudgeResult/index.vue'),
  // 体检工作台
  sampleTable: () => import('@/views/examTable/sampleTable/index.vue'),
  sampleQuery: () => import('@/views/examTable/sampleQuery/index.vue'),
  inspectResult: () => import('@/views/examTable/inspectResult/index.vue'),
  recordResult: () => import('@/views/examTable/recordResult/index.vue'),
  examQuery: () => import('@/views/examTable/examQuery/index.vue'),
  manualImportInspectionReport: () => import('@/views/examTable/manualImportInspectionReport/index.vue'),
  sendExamRegister: () => import('@/views/examTable/sendExamRegister/index.vue'),
  newSendExamRegister: () => import('@/views/examTable/newSendExamRegister/index.vue'),
  batchSendExam: () => import('@/views/examTable/batchSendExam/index.vue'),

  // 主检工作台
  mainExam: () => import('@/views/mainExamTable/mainExam/index.vue'),
  mainInspection: () => import('@/views/mainExamTable/mainInspection/index.vue'),

  // 财务统计
  weChatPayRecord: () => import('@/views/financialStatistics/weChatPayRecord/index.vue'),
  weChatRefundRecord: () => import('@/views/financialStatistics/weChatRefundRecord/index.vue'),
  offlinePayRecord: () => import('@/views/financialStatistics/offlinePayRecord/index.vue'),
  offlineRefundRecord: () => import('@/views/financialStatistics/offlineRefundRecord/index.vue'),
  YBPayRecord: () => import('@/views/financialStatistics/YBPayRecord/index.vue'),
  YBRefundRecord: () => import('@/views/financialStatistics/YBRefundRecord/index.vue'),

  // 体检缴费
  personBalance: () => import('@/views/balance/personBalance/index.vue'),
  feeDayBalance: () => import('@/views/balance/feeDayBalance/index.vue'),
  invoiceCodeManage: () => import('@/views/balance/invoiceCodeManage/index.vue'),
  examRefund: () => import('@/views/balance/examRefund/index.vue'),
  financialWorkload: () => import('@/views/balance/workload/index.vue'),
  dailyBalance: () => import('@/views/balance/dailyBalance/index.vue'),
  invoiceSearch: () => import('@/views/balance/invoiceSearch/index.vue'),
  weChatOrderManage: () => import('@/views/balance/weChatOrder/index.vue'),
  weChatRefund: () => import('@/views/balance/weChatRefund/index.vue'),
  wechatSourceManage: () => import('@/views/balance/weChatSourceManage/index.vue'),
  weChatBillManage: () => import('@/views/balance/weChatBillManage/index.vue'),
  newPersonBalance: () => import('@/views/balance/newPersonBalance/index.vue'),
  billQuery: () => import('@/views/balance/billQuery/index.vue'),
  newExamRefund: () => import('@/views/balance/newExamRefund/index.vue'),
  // MIFeeDayBalance: () => import('@/views/balance/MIFeeDayBalance/index.vue'),
  dailyManage: () => import('@/views/balance/dailyManage/index.vue'),
  FTFOrderManage: () => import('@/views/balance/FTFOrderManage/index.vue'),
  // 价格审批
  modifyPriceApprove: () => import('@/views/priceApprove/modifyPriceApprove/index.vue'),
  // 统计模块
  abnormalResult: () => import('@/views/statistics/disease/abnormalResult/index.vue'),
  abnormalAnalysis: () => import('@/views/statistics/disease/abnormalAnalysis/index.vue'),
  itemResultSearch: () => import('@/views/statistics/checkList/itemResultSearch/index.vue'),
  itemSummarySearch: () => import('@/views/statistics/checkList/itemSummarySearch/index.vue'),
  checkedItemSearch: () => import('@/views/statistics/checkList/itemSearch/index.vue'),
  checkListSearch: () => import('@/views/statistics/checkList/listSearch/index.vue'),
  sortListSearch: () => import('@/views/statistics/checkList/sortListSearch/index.vue'),
  mainListSearch: () => import('@/views/statistics/checkList/mainListSearch/index.vue'),
  totalListSearch: () => import('@/views/statistics/checkList/totalListSearch/index.vue'),
  finalDetailSearch: () => import('@/views/statistics/checkList/finalDetailSearch/index.vue'),
  operatorWorkload: () => import('@/views/statistics/workload/operator/index.vue'),
  diagnosticTable: () => import('@/views/statistics/workload/diagnosticTable/index.vue'),
  deptWorkload: () => import('@/views/statistics/workload/dept/index.vue'),
  finalDoctorWorkload: () => import('@/views/statistics/workload/finalDoctor/index.vue'),
  mainDoctorWorkload: () => import('@/views/statistics/workload/mainDoctor/index.vue'),
  guideSheetWorkload: () => import('@/views/statistics/workload/guideSheet/index.vue'),
  receptionWorkload: () => import('@/views/statistics/workload/reception/index.vue'),
  healthTableWorkload: () => import('@/views/statistics/workload/healthTable/index.vue'),
  examinerStatistics: () => import('@/views/statistics/unit/examiner/index.vue'),
  extraItemStatistics: () => import('@/views/statistics/unit/extraItem/index.vue'),
  unitReceivable: () => import('@/views/statistics/unit/receivable/index.vue'),
  billingStatistics: () => import('@/views/statistics/workload/billing/index.vue'),
  bindingReportWorkload: () => import('@/views/statistics/workload/bindingReport/index.vue'),
  receiveReportWorkload: () => import('@/views/statistics/workload/receiveReport/index.vue'),

  // 系统维护
  lisDataSearch: () => import('@/views/setting/lisDataSearch/index.vue'),
  staffLog: () => import('@/views/setting/staffLog/index.vue'),
  moduleManage: () => import('@/views/setting/moduleManage/index.vue'),
  msgManage: () => import('@/views/setting/msgManage/index.vue'),
}

export const globalRouters = [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: resolve => require(['@/views/login/login.vue'], resolve)

},
{
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      hideInMenu: true,
      title: '首页',
      notCache: true,
      icon: 'md-home'
    },
    component: resolve => require(['@/views/home/home'], resolve)
  }]
},
{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: resolve => require(['@/views/errorPage/401.vue'], resolve)
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  mponent: resolve => require(['@/views/errorPage/500.vue'], resolve)

}
]
