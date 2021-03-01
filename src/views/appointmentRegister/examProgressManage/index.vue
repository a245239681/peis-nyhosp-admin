<template>
  <div class="exam-Progress-Mange">
    <Spin size="large"
          fix
          v-if="applyLoading || guideLoading"></Spin>
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检综合进度管理</span>
      </div>
      <div class="body-top"
           style="display:flex">
        <Form :label-width="80"
              ref="form"
              :model="formData"
              :rules="ruleCustom"
              inline>
          <FormItem label="姓名"
                    prop="medicalName"
                    :label-width="80">
            <Input v-model="formData.medicalName"
                   placeholder="输入姓名"
                   style="width:127px;"
                   @on-enter="keyup()"
                   size="small"></Input>
          </FormItem>
          <FormItem label="体检编号"
                    prop="boPeIdStart">
            <Input style='width:150px'
                   placeholder="输入数字编号"
                   size="small"
                   v-model="formData.boPeIdStart"></Input>
          </FormItem>
          <FormItem label="到"
                    prop="boPeIdEnd"
                    :label-width="20">
            <Input placeholder="输入数字编号"
                   style='width:150px'
                   size="small"
                   v-model="formData.boPeIdEnd"></Input>
          </FormItem>
          <FormItem prop="boRegisterDateStart"
                    label="登记日期"
                    style="margin-right:0">
            <DatePicker type="date"
                        :editable="false"
                        @on-change="setDeadline"
                        placeholder="开始时间"
                        size="small"
                        v-model="formData.boRegisterDateStart"></DatePicker>
          </FormItem>
          <FormItem prop="boRegisterDateEnd"
                    label="到"
                    :label-width="30">
            <DatePicker type="date"
                        :editable="false"
                        size="small"
                        v-model="formData.boRegisterDateEnd"
                        :options="bookingStartTime"
                        placeholder="截止时间"></DatePicker>
          </FormItem>
          <FormItem label=""
                    :label-width="10"
                    prop="unitOrPersonal">
            <RadioGroup @on-change="changeUnit"
                        v-model="formData.unitOrPersonal">
              <Radio label="1">
                全部
              </Radio>
              <Radio label="2">
                个人
              </Radio>
              <Radio label="3">
                单位
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-show="unitGroupShow"
                    label="体检单位"
                    prop="unitId">
            <Select v-model="formData.unitId"
                    filterable
                    remote
                    clearable
                    size="small"
                    ref='select'
                    placeholder="单位名称搜索"
                    :label-in-value="true"
                    @on-clear="clearUnit"
                    @on-change="selectUnit"
                    :remote-method="getUnits">
              <Option v-for="item in unitsList"
                      :value="item.boUnitId"
                      :key="item.boUnitId">{{ item.boUnitName }}</Option>
            </Select>
          </FormItem>
          <FormItem v-show="unitGroupShow"
                    label="单位体检次数"
                    :label-width="100"
                    prop="boUnitVisitSn">
            <Select v-model="formData.boUnitVisitSn"
                    size="small"
                    style="min-width:102px"
                    @on-change="changeUnitVisitSn"
                    clearable
                    :label-in-value="true">
              <Option v-for="item in unitVisitSnList"
                      :value="item.unitVisitSn"
                      :key="item.unitVisitSn">{{item.unitVisitSn}}</Option>
            </Select>
          </FormItem>
          <FormItem v-show="unitGroupShow"
                    label="体检分组"
                    prop="boUnitGroupId">
            <Select v-model="formData.boUnitGroupId"
                    clearable
                    @on-change="changeUnitGroup"
                    size="small">
              <Option v-for="item in groupingResultList"
                      :value="item.groupingId"
                      :key="item.groupingId">{{ item.groupingName }}</Option>
            </Select>
          </FormItem>
          <FormItem v-show="unitGroupShow"
                    label="部门"
                    :label-width="60">
            <Cascader :data="deptList"
                      v-model="selectDeptArr"
                      change-on-select
                      size="small"
                      style="width:140px"
                      @on-change="deptChange"></Cascader>
          </FormItem>
          <FormItem label="收费类型"
                    prop="boChargeTypeId">
            <Select v-model="formData.boChargeTypeId"
                    clearable
                    size="small"
                    style="width:127px;">
              <Option v-for="(item,index) of ChargeTypeName"
                      :value="item.cdId"
                      :key="index">{{item.cdName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="登记流水号"
                    :label-width="100"
                    prop="boRegisterCode">
            <Input @on-enter="keyup()"
                   placeholder="输入数字编号"
                   size="small"
                   v-model="formData.boRegisterCode"></Input>
          </FormItem>
          <!-- <FormItem label="到"
                    prop="serialNumberEnd"
                    :label-width="20">
            <Input @keyup.enter.native="keyup"
                   placeholder="输入数字编号"
                   size="small"
                   v-model="formData.serialNumberEnd"></Input>
          </FormItem> -->
          <FormItem label="体检类型"
                    prop="boCategoryId"
                    :label-width="80">
            <Select v-model="formData.boCategoryId"
                    style="width:127px;"
                    size="small">
              <Option v-for="item in categoryList"
                      :value="item.cdId"
                      :key="item.cdId">{{item.cdName}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="boExamTimeStart"
                    label="体检时间"
                    style="margin-right:0">
            <DatePicker type="date"
                        :editable="false"
                        @on-change="setExamTimeLine"
                        placeholder="开始时间"
                        size="small"
                        v-model="formData.boExamTimeStart"></DatePicker>
          </FormItem>
          <FormItem prop="boExamTimeEnd"
                    label="到"
                    :label-width="30">
            <DatePicker type="date"
                        :editable="false"
                        size="small"
                        v-model="formData.boExamTimeEnd"
                        :options="examStartTime"
                        placeholder="截止时间"></DatePicker>
          </FormItem>
          <FormItem label="人员来源"
                    prop="boSourceName"
                    :label-width="80">
            <Select v-model="formData.boSourceName"
                    size="small"
                    style="width:127px;"
                    clearable>
              <Option v-for="item in sourceList"
                      :value="item.cdName"
                      :key="item.cdId">{{item.cdName}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="body-top-left"
             style="text-align:right">
          <Button style="height:30px;width:100%"
                  @click="searchList(1,20,'search')"
                  :loading="btnLoading"
                  type="primary">筛选</Button>
          <Button style="height:30px;width:100%;margin-top:10px"
                  @click="refSeachList">清除筛选条件</Button>
        </div>
      </div>
      <div class="body-middle">
        <Button @click="codePrint()"
                :loading="codeLoading"
                type="primary"
                v-permission="['print']">打印条码</Button>
        <Button @click="guidePrint()"
                :loading="guideLoading"
                type="primary"
                v-permission="['print']">打印指引单</Button>
        <!-- <Button @click="applyPrint()"
        v-permission="['print']">打印申请单</Button>-->
        <!-- <Button @click="applyPrint()"
                :loading="applyLoading"
                type="primary"
                v-permission="['print']">打印体检报告</Button> -->
        <Dropdown v-permission="['print']">
          <Button @click="applyPrint()"
                  :loading="applyLoading"
                  type="primary">
            打印体检报告
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list"
                        v-show="!applyLoading">
            <DropdownItem style="font-size: 14px !important; color: #2d8cf0;"
                          @click.native="sortExamPrint()">打印分检报告</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button @click="downloadReportZip()"
                v-permission="['print']"
                type="primary"
                :loading="downloadLoading">下载体检报告</Button>
        <Button @click="reportBingding()"
                type="primary">装订报告</Button>
        <Button @click="drawReport()"
                type="primary">报告领取</Button>
        <Button @click="batchReportPrint()"
                v-permission="['print']"
                type="primary">批量打印报告</Button>
        <Button @click="batchMainExam()"
                v-permission="['edit']"
                type="primary">批量总检</Button>
        <Button @click="cancelRegisterHandle()"
                :loading="cancelLoading"
                type="error">取消登记</Button>
        <Button @click="open"
                style="float:right;margin-top:10px;">
          <span v-if="show">收起</span>
          <span v-if="!show">展开</span>
          <Icon v-if="show"
                type="ios-arrow-up" />
          <Icon v-if="!show"
                type="ios-arrow-down" />
        </Button>
      </div>

      <div class="body-main page-body">
        <Tabs :value="name"
              :animated="false"
              @on-click="seach">
          <TabPane label="全部"
                   name="name1"></TabPane>
          <TabPane label="未检"
                   name="name2"></TabPane>
          <TabPane label="在检"
                   name="name3"></TabPane>
          <TabPane label="待主检"
                   name="name7"></TabPane>
          <TabPane label="待总检"
                   name="name4"></TabPane>
          <TabPane label="已总检"
                   name="name5"></TabPane>
          <TabPane label="已打印报告"
                   name="name6"></TabPane>
          <TabPane label="已装订"
                   name="name8"></TabPane>
          <TabPane label="已领取"
                   name="name9"></TabPane>
        </Tabs>
        <TableList :columns="columns"
                   @tabSelectChange="tabSelect"
                   @showInfo="showInfo"
                   :loading="isLoading"
                   :tabelData="tabelData"></TableList>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40,100]"
              @on-change="pageIndexChange"
              @on-page-size-change="pageSizeChange"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
    <Edit :visible="editModalVisible"
          ref='editwrapper'
          :singleData="singleData"
          @close="close"></Edit>
    <!-- 装订报告 start -->
    <ReportBingding ref="reportBingdingWrapper"
                    :visible="reportBingdingVisible"
                    @updateList="searchList()"
                    @close="reportBingdingVisible = false"></ReportBingding>
    <!-- 装订报告 end -->
    <!-- 装订报告 start -->
    <DrawReport ref="drawReportWrapper"
                :visible="drawReportVisible"
                @updateList="searchList()"
                @close="drawReportVisible = false"></DrawReport>
    <!-- 装订报告 end -->
    <!-- 流水号批量打印报告 start -->
    <BatchReport ref="batchReportWrapper"
                 :visible="batchReportVisible"
                 @updateList="searchList()"
                 @close="batchReportVisible = false"></BatchReport>
    <!-- 流水号批量打印报告 end -->
    <!-- 批量总检 start -->
    <BatchMainExam ref="batchMainExamWrapper"
                   :visible="batchMainExamVisible"
                   @updateList="searchList()"
                   @close="batchMainExamVisible = false"></BatchMainExam>
    <!-- 批量总检 end -->
  </div>
</template>
<script>
import { listAllByUnitId, listByName } from '@/api/personal_register.js'
import { unitGroupInfo } from '@/api/workload'
import {
  searchList,
  printBarCode,
  guideSheetPrint,
  reportPrint,
  getPicture,
  getComboAndItem,
  cancelRegister,
  sortReportPrint
} from '@/api/examProgressManage.js'
import {
  getDeptInfoByUnit
} from "@/api/unitManage_unitPersonManage.js";
import Edit from './edit.vue'
import ReportBingding from './reportBingding'
import DrawReport from './drawReport'
import BatchReport from './batchReportPrint'
import BatchMainExam from './batchMainExam'
import moment from 'moment'
import TableList from './components/table'
import { debuglog } from 'util'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import {
  getPrinterConfigFromLocalstorage
} from '@/libs/util'

export default {
  name: 'examProgressMange',
  components: {
    TableList,
    Edit,
    ReportBingding,
    DrawReport,
    BatchReport,
    BatchMainExam
  },
  data () {
    const validatePass = (rule, value, callback) => {
      var reg = /^[0-9]*$/
      if (!reg.test(value)) {
        this.trigger = false
        callback(new Error('请输入数字格式'));
      } else {
        this.trigger = true
      }
      callback()
    };
    return {
      ruleCustom: {
        boPeIdStart: [
          { validator: validatePass, trigger: 'change' }
        ],
        boPeIdEnd: [
          { validator: validatePass, trigger: 'change' }
        ],
        boRegisterCode: [
          { validator: validatePass, trigger: 'change' }
        ]

      },
      trigger: true,
      btnLoading: false,
      codeLoading: false,
      guideLoading: false,
      applyLoading: false,
      cancelLoading: false,
      showSearchResult: false,
      editModalVisible: false,
      batchReportVisible: false, // 批量打印报告弹窗开关
      batchMainExamVisible: false, // 批量总检弹窗开关
      unitsList: [],
      tijian: [],
      columns: [
        { type: 'selection', align: 'center', width: 30 },
        { title: '体检号', key: 'boPeId', align: 'center', width: 110 },
        {
          slot: 'status',
          title: '体检状态',
          key: 'boResultStatus',
          align: 'center',
          width: 110
        },
        {
          title: '登记流水号',
          key: 'boRegisterCode',
          align: 'center',
          width: 170
        },
        { title: '姓名', key: 'medicalName', align: 'center', width: 100 },
        { title: '性别', key: 'sex', align: 'center', width: 65 },
        { title: '年龄', key: 'boAge', align: 'center', width: 65 },
        { title: '身份证', key: 'idNo', align: 'center', width: 180 },
        { title: '手机号', key: 'mobile', align: 'center', width: 140 },
        { title: '体检类型', key: 'boCategory', align: 'center', width: 150 },
        { title: '单位', key: 'unitName', align: 'center', width: 200 },
        { title: '分组', key: 'groupingName', align: 'center', width: 150 },
        { title: '部门', key: 'boDepartmentName', align: 'center', width: 150 },
        { title: '子部门', key: 'boSubDepartmentName', align: 'center', width: 150 },
        { title: '套餐', key: 'boPackageName', align: 'center', width: 200 },
        { title: '体检次数', key: 'boVisitSn', align: 'center', width: 100 },
        {
          title: '登记时间',
          slot: 'boRegisterDate',
          align: 'center',
          width: 110
        },
        { title: '体检时间', slot: 'boExamTime', align: 'center', width: 110 },
        { title: '打印时间', slot: 'boPrintDate', align: 'center', width: 110 },
        { title: '预约来源', key: 'boSource', align: 'center', width: 110 }
      ],
      pdfUrl: '',
      boIds: { labelNum: 1 },
      printData: {},
      printGuideDate: [],
      reportDate: [],
      vShow: '',
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      singleData: {},
      formData: {
        medicalName: '',
        boPeIdStart: '',
        boPeIdEnd: '',
        boRegisterDateStart: '',
        boRegisterDateEnd: '',
        unitName: '',
        boUnitGroupId: '',
        boChargeTypeId: '',
        boResultStatus: '',
        unitOrPersonal: '1',
        boRegisterCode: '',
        registerCode: '',
        serialNumberEnd: ''
      },
      unitGroupShow: false,
      tabFormData: {},
      name: 'name1',
      tabelData: [],
      show: true,
      tabNumber: '',
      bookingStartTime: {},
      examStartTime: {},
      selections: [], // 表格选中项
      unitVisitSnList: [], // 单位次数列表
      groupingResultList: [], // 单位分组列表
      unitSearchLoading: false,
      unitTimer: null,
      deptList: [], // 单位部门数据
      selectDeptArr: [], // 选择的部门数据
      reportBingdingVisible: false, // 装订报告弹窗btn
      drawReportVisible: false, // 报告领取弹窗btn
      downloadLoading: false, // 下载报告loading

    }
  },
  created () {
    // this.getGroups();
    this.searchList()
    // 获取体检类型
    this.$store.dispatch('getCategoryDict')
    // 获取收费类型
    this.$store.dispatch('getChargeTypeDict')
    // 获取人员来源
    this.$store.dispatch('getPersonSourceDict')

  },
  mounted () {

  },
  activated () {
    console.log('activated')
  },
  computed: {
    ChargeTypeName: {
      get: function () {
        return this.$store.getters.getChargeTypeDict
      },
      set: function () { }
    },
    categoryList: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
    },
    // 人员来源字典
    sourceList: {
      get: function () {
        return this.$store.getters.getPersonSourceDict
      },
      set: function () { }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
  },
  methods: {
    keyup () {
      if (this.trigger) {
        this.searchList(this.pageIndex || 1, 20, 'search')
      }

    },
    close (e) {
      this.editModalVisible = false
      this.singleData = {}
    },
    //双击显示病人详情
    showInfo (row) {
      this.singleData = row
      this.$refs.editwrapper.getCombo(row)
      console.log(this.singleData)
      this.editModalVisible = true
    },
    changeUnit (e) {
      this.formData.unitOrPersonal = e
      if (e == '3') {
        this.unitGroupShow = true
      } else {
        this.unitGroupShow = false
        // this.formData.unitName = ''
        // this.formData.boUnitGroupId = ''
        this.clearUnit()
      }
    },
    // 清除单位
    clearUnit () {
      this.$set(this.formData, 'unitId', '')
      this.$set(this.formData, 'unitName', '')
      this.$set(this.formData, 'boUnitVisitSn', '')
      this.$set(this.formData, 'boUnitGroupId', '')
      this.$set(this.formData, 'boDepartmentId', '')
      this.$set(this.formData, 'boSubDepartmentId', '')
      this.$set(this.formData, 'boSubDepartmentName', '')
      this.$set(this.formData, 'boDepartment', '')
      this.groupingResultList = []
      this.unitVisitSnList = []
      this.deptList = []
      this.selectDeptArr = []
    },
    // 修改单位
    selectUnit (obj) {
      if (obj) {
        this.$set(this.formData, 'unitId', obj.value)
        this.$set(this.formData, 'unitName', obj.label)
        this.$set(this.formData, 'boUnitVisitSn', '')
        this.$set(this.formData, 'boUnitGroupId', '')
        this.$set(this.formData, 'boDepartmentId', '')
        this.$set(this.formData, 'boSubDepartmentId', '')
        this.$set(this.formData, 'boSubDepartmentName', '')
        this.$set(this.formData, 'boDepartment', '')
        this.deptList = []
        this.selectDeptArr = []
        this.getGroups()
      }
    },
    // 修改单位体检分组
    changeUnitGroup (val) {
      val ? this.$set(this.formData, 'boUnitGroupId', val) : this.$set(this.formData, 'boUnitGroupId', '')
    },
    // 查询单位分组信息
    getGroups () {
      let params = {
        boUnitId: this.formData.unitId
      }
      unitGroupInfo(params).then(({ data }) => {
        if (data.code === 0) {
          console.log(data.data)
          this.unitVisitSnList = data.data.unitVisitSnList
        } else {
          this.$Message.error(result.Message)
        }
      })
    },

    // 更改单位体检次数
    changeUnitVisitSn (e) {
      this.selectDeptArr = []
      this.deptList = []
      this.groupingResultList = []
      if (e) {
        this.$set(this.formData, 'boUnitGroupId', '')
        const arr = this.unitVisitSnList.filter(item => {
          return item.unitVisitSn == e.value
        })
        if (arr.length > 0) {
          this.groupingResultList = arr[0].groupingResultList
          this.getDeptList()
        }
      } else {
        this.$set(this.formData, 'boUnitGroupId', '')
        this.$set(this.formData, 'boUnitVisitSn', '')
      }
    },

    // 获取单位列表
    getUnits (query = '') {
      this.unitSearchLoading = true
      this.unitTimer && clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: query
        }
        listByName(params).then(({ data }) => {
          if (data.code === 0) {
            this.unitsList = data.data
          } else {
            this.$Message.error(result.message)
          }
          this.unitSearchLoading = false
        }).catch(err => {
          console.log(err)
          this.unitSearchLoading = false
          this.$Message.error(err.message)
        })
      }, 300)
    },

    // 获取单位部门
    getDeptList () {
      const params = {
        boUnitId: this.formData.unitId,
        boUnitVisitSn: this.formData.boUnitVisitSn
      }
      getDeptInfoByUnit(params).then(({ data }) => {
        if (data.code == 0) {
          this.deptList = data.data
          this.transCascaderData(this.deptList)
          console.log(this.deptList)
        } else {
          this.$Message.error(data.message)
        }
      })
    },

    // 处理级联数据
    transCascaderData (arr) {
      arr.forEach(item => {
        item.value = item.deptId
        item.label = item.name
        if (item.children) {
          item.children.forEach(v => {
            v.value = v.deptId
            v.label = v.deptName
          })
        }
      })
      return arr
    },

    // 选择部门
    deptChange (value, selectedData) {
      if (selectedData.length == 2) {
        // 即选择了父级部门，又选择了子级部门
        this.formData.boSubDepartmentName = selectedData[1].deptName
        this.formData.boSubDepartmentId = selectedData[1].deptId
        this.formData.boDepartmentId = selectedData[1].parentId
        this.formData.boDepartment = selectedData[1].parentName
        // console.log(this.formData)
      } else if (selectedData.length == 1) {
        // 只选择了父级
        this.formData.boSubDepartmentName = ''
        this.formData.boSubDepartmentId = ''
        this.formData.boDepartmentId = selectedData[0].deptId
        this.formData.boDepartment = selectedData[0].name
      } else {
        // 什么都没有选
        this.formData.boSubDepartmentName = ''
        this.formData.boSubDepartmentId = ''
        this.formData.boDepartmentId = ''
        this.formData.boDepartment = ''

      }
    },

    refSeachList () {
      let arr = Object.values(this.formData)
      let newArr = arr.filter(res => {
        if (res != '1') {
          return res.toString().length
        }
      })
      if (newArr.length > 0) {
        this.$refs.form.resetFields()
        this.formData.boUnitId = ''
        this.unitGroupShow = false
        this.clearUnit()
        this.bookingStartTime.disabledDate = function () {
          return false
        }
        this.examStartTime.disabledDate = function () {
          return false
        }
        this.searchList()
      }
    },

    // 批量总检
    batchMainExam () {
      let params = {
        deptName: '总检医生',
        deptId: ''
      }
      this.$store
        .dispatch('getExamDoctorDict', { params, btn: true })
        .then(res => {
          if (res.code === 0) {
            let result = res.data.filter(item => {
              // console.log(item)
              return item.doctorId == this.userInfo.userId
            })
            if (result.length > 0) {
              if (this.selections.length === 0) {
                this.$Message.info('请选择数据后操作')
                return false
              }
              let flag = this.selections.some(item => {
                return ['0', '9', '10', '11', '12'].indexOf(item.boPatientVisitStatus) > -1
              })
              if (flag) {
                this.$Message.warning('批量总检操作仅适用于在检、待主检、已总检状态的数据，请检查后重试')
                return false
              }
              this.batchMainExamVisible = true

              this.$nextTick(() => {
                this.$refs.batchMainExamWrapper.init(this.selections, result[0])
              })
            } else {
              this.$Message.warning('该账号无总检权限！')
            }
          }
        })
    },

    // 体检综合进度表
    searchList (page = 1, size = 20, type) {
      if (this.isLoading) return false

      let arr = []
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // this.formData.boRegisterDateStart = new Date(this.formData.boRegisterDateStart)
      if (this.formData.boRegisterDateStart) {
        this.formData.boRegisterDateStart = moment(
          this.formData.boRegisterDateStart
        ).format('YYYY-MM-DD')
      } else {
        this.formData.boRegisterDateStart = ''
      }
      if (this.formData.boRegisterDateEnd) {
        this.formData.boRegisterDateEnd = moment(
          this.formData.boRegisterDateEnd
        ).format('YYYY-MM-DD')
      } else {
        this.formData.boRegisterDateEnd = ''
      }
      if (this.formData.boExamTimeStart) {
        this.formData.boExamTimeStart = moment(
          this.formData.boExamTimeStart
        ).format('YYYY-MM-DD')
      } else {
        this.formData.boExamTimeStart = ''
      }
      if (this.formData.boExamTimeEnd) {
        this.formData.boExamTimeEnd = moment(
          this.formData.boExamTimeEnd
        ).format('YYYY-MM-DD')
      } else {
        this.formData.boExamTimeEnd = ''
      }
      // 深拷贝
      this.tabFormData = Object.assign({}, this.formData)

      if (this.name == 'name1') this.tabFormData.boResultStatus = ''
      if (this.name == 'name2') this.tabFormData.boResultStatus = '0'
      if (this.name == 'name3') this.tabFormData.boResultStatus = '1'
      if (this.name == 'name4') this.tabFormData.boResultStatus = '[2,7]'
      if (this.name == 'name5') this.tabFormData.boResultStatus = '9'
      if (this.name == 'name6') this.tabFormData.boPrintStatus = '1'
      if (this.name == 'name7') this.tabFormData.boResultStatus = '3'
      if (this.name == 'name8') this.tabFormData.boScheduleStatus = '1'
      if (this.name == 'name9') this.tabFormData.boScheduleStatus = '2'

      // this.tabFormData = JSON.parse(JSON.stringify(this.formData))
      if (type) {
        this.btnLoading = true
      }

      this.isLoading = true
      searchList(pagination, this.tabFormData)
        .then(res => {
          this.isLoading = false
          this.btnLoading = false
          if (res.data.code == 0) {
            this.tabelData = res.data.data.records
            this.totalSize = res.data.data.total
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.btnLoading = false
          this.isLoading = false
          this.tabelData = []
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // tab分页
    seach (name, page = 1, size = 20) {
      // this.formData = {}

      this.name = name || this.name

      this.tabFormData.boPrintStatus = ''
      this.tabFormData.boResultStatus = ''
      this.tabFormData.boScheduleStatus = ''
      if (name == 'name1') this.tabFormData.boResultStatus = ''
      if (name == 'name2') this.tabFormData.boResultStatus = '0'
      if (name == 'name3') this.tabFormData.boResultStatus = '1'
      if (name == 'name4') this.tabFormData.boResultStatus = '[2,7]'
      if (name == 'name5') this.tabFormData.boResultStatus = '9'
      if (name == 'name6') this.tabFormData.boPrintStatus = '1'
      if (name == 'name7') this.tabFormData.boResultStatus = '3'
      if (name == 'name8') this.tabFormData.boScheduleStatus = '1'
      if (name == 'name9') this.tabFormData.boScheduleStatus = '2'

      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      if (this.tabFormData.boRegisterDateStart) {
        this.tabFormData.boRegisterDateStart = moment(
          this.tabFormData.boRegisterDateStart
        ).format('YYYY-MM-DD')
      } else {
        this.tabFormData.boRegisterDateStart = ''
      }
      if (this.tabFormData.boRegisterDateEnd) {
        this.tabFormData.boRegisterDateEnd = moment(
          this.tabFormData.boRegisterDateEnd
        ).format('YYYY-MM-DD')
      } else {
        this.tabFormData.boRegisterDateEnd = ''
      }

      searchList(pagination, this.tabFormData)
        .then(res => {
          this.isLoading = false

          if (res.data.code == 0) {
            this.tabelData = res.data.data.records
            this.totalSize = res.data.data.total
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.tabelData = []
          this.isLoading = false
          this.$Message.error(err.message)
        })
    },
    // 勾选打印数据
    tabSelect (row) {
      this.selections = row
      let reportPrint = {}
      this.boIds.boIds = []
      this.printGuideDate = []
      this.reportDate = []
      row.forEach(res => {
        this.boIds.boIds.push(res.boId)
      })
      for (let i = 0; i < row.length; i++) {
        this.printData.name = row[i].medicalName
        this.printData.peId = row[i].boPeId
        this.printData.visitSn = row[i].boVisitSn.toString()
        reportPrint.inPeId = row[i].boPeId
        reportPrint.inVisitSn = row[i].boVisitSn.toString()
        reportPrint.inRegisterCode = row[i].boRegisterCode
        let obj = Object.assign({}, this.printData)
        let objData = Object.assign({}, reportPrint)
        this.printGuideDate.push(obj)
        this.reportDate.push(objData)
      }
    },
    setExamTimeLine (e) {
      this.formData.boExamTimeEnd = ''
      if (this.formData.boExamTimeStart) {
        this.examStartTime.disabledDate = function (date) {
          return date && date.valueOf() < new Date(e) - 86400000
        }
      } else {
        this.examStartTime.disabledDate = function (date) {
          return false
        }
      }
    },
    setDeadline (e) {
      this.formData.boRegisterDateEnd = ''
      if (this.formData.boRegisterDateStart) {
        this.bookingStartTime.disabledDate = function (date) {
          return date && date.valueOf() < new Date(e) - 86400000
        }
      } else {
        this.bookingStartTime.disabledDate = function (date) {
          return false
        }
      }
    },
    open () {
      this.show == true ? (this.show = false) : (this.show = true)
      let element = document.querySelector('.body-top')
      if (this.show) {
        element.style.display = 'flex'
      } else {
        element.style.display = 'none'
      }
    },
    // 切换页码
    pageIndexChange (val) {
      console.log(val)
      this.pageIndex = val
      this.seach(this.name, this.pageIndex, this.pageSize)
    },
    // 切换每页条数
    pageSizeChange (val) {
      this.pageSize = val
      this.seach(this.name, 1, this.pageSize)
    },

    // 装订报告
    reportBingding () {
      this.reportBingdingVisible = true
      this.$refs.reportBingdingWrapper.getItemList()
    },

    // 报告领取
    drawReport () {
      this.drawReportVisible = true
    },

    // 扫码批量打印报告
    batchReportPrint () {
      this.batchReportVisible = true
      this.$refs.batchReportWrapper.getItemList()
    },

    // 条码打印
    codePrint () {
      if (!this.boIds.boIds || this.boIds.boIds.length == 0) {
        this.$Message.error('请选择需要打印的用户')
        return false
      }
      // if (this.boIds.boIds.length > 10) {
      //   this.$Message.error("每次最多打印10条");
      //   return false;
      // }
      if (!printNotice()) return false
      this.codeLoading = true
      printBarCode(this.boIds)
        .then(({ data }) => {
          this.codeLoading = false
          if (data.code == 0) {
            let printParams = {
              barcodeUrl: this.$url + data.data,
              selGroup: ['printSampleCode']
            }
            printMethods(printParams.barcodeUrl, printParams)
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.codeLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // 指引单打印
    guidePrint () {
      if (this.printGuideDate.length == 0) {
        this.$Message.error('请选择需要打印的用户')
        return false
      }

      if (!printNotice()) return false
      let printConfig = getPrinterConfigFromLocalstorage();
      let params;

      if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
        params = {
          zip: false,
          merge: false,
          duplex: false,
          data: this.printGuideDate
        }
      } else {
        params = {
          zip: false,
          merge: true,
          duplex: false,
          data: this.printGuideDate
        }
      }

      this.guideLoading = true
      guideSheetPrint(params)
        .then(({ data }) => {
          this.guideLoading = false
          if (data.code == 0) {
            if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
              let resData = []
              data.data.originalFileList.forEach(item => {
                let _str = this.$url + item
                resData.push(_str)
              });
              let printParams = {
                guideUrl: resData,
                selGroup: ['printGuide'],
                taskName: '指引单'
              }
              printMethods(printParams.guideUrl, printParams)
            } else {
              let resData = []
              data.data.mergeFileList.forEach(item => {
                let _str = this.$url + item
                resData.push(_str)
              });
              let printParams = {
                guideUrl: resData,
                selGroup: ['printGuide'],
                taskName: '指引单'
              }
              printMethods(printParams.guideUrl, printParams)
            }
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.guideLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // 体检报告打印
    applyPrint () {
      if (this.reportDate.length == 0) {
        this.$Message.error("请选择需要打印的用户");
        return false
      }
      if (!printNotice()) return false
      for (let i = 0; i < this.selections.length; i++) {
        if (this.selections[i].boResultStatus !== "9" && this.selections[i].boPrintStatus !== '1') {
          this.$Message.warning(
            `体检号：${this.selections[i].boPeId} 体检次数：${this.selections[i].boVisitSn}未完成总检，不能打印体检报告`
          );
          return false;
        }
      }
      if (this.selections.length == 1 && this.selections[0].boPrintDate) {
        this.$Modal.confirm({
          title: '提示',
          content: `该病人已于${moment(this.selections[0].boPrintDate).format('YYYY-MM-DD HH:mm:ss')}打印报告，是否再次打印？`,
          onOk: () => {
            let printConfig = getPrinterConfigFromLocalstorage();
            let params;

            if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
              params = {
                zip: false,
                merge: false,
                duplex: false,
                mainExam: true,
                data: this.reportDate
              }
            } else {
              params = {
                zip: false,
                merge: true,
                duplex: false,
                mainExam: true,
                data: this.reportDate
              }
            }
            this.applyLoading = true;
            reportPrint(params)
              .then(({ data }) => {
                this.applyLoading = false;
                if (data.code == 0) {
                  this.searchList(this.pageIndex, this.pageSize)
                  if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
                    let resData = []
                    data.data.originalFileList.forEach(item => {
                      let _str = this.$url + item
                      resData.push(_str)
                    });
                    let printParams = {
                      guideUrl: resData,
                      selGroup: ['printGuide'],
                      taskName: '体检报告'
                    }
                    printMethods(printParams.guideUrl, printParams)
                  } else {
                    let resData = []
                    data.data.mergeFileList.forEach(item => {
                      let _str = this.$url + item
                      resData.push(_str)
                    });
                    let printParams = {
                      guideUrl: resData,
                      selGroup: ['printGuide'],
                      taskName: '体检报告'
                    }
                    printMethods(printParams.guideUrl, printParams)
                  }
                } else {
                  this.$Message.error(data.message);
                }
              })
              .catch(err => {
                this.applyLoading = false;
                this.$Message.error(err.message);
              });
          },
          onCancel: () => { }
        })
      } else {
        let printConfig = getPrinterConfigFromLocalstorage();
        let params;

        if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
          params = {
            zip: false,
            merge: false,
            duplex: false,
            mainExam: true,
            data: this.reportDate
          }
        } else {
          params = {
            zip: false,
            merge: true,
            duplex: false,
            mainExam: true,
            data: this.reportDate
          }
        }
        this.applyLoading = true;
        reportPrint(params)
          .then(({ data }) => {
            this.applyLoading = false;
            if (data.code == 0) {
              if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
                let resData = []
                data.data.originalFileList.forEach(item => {
                  let _str = this.$url + item
                  resData.push(_str)
                });
                let printParams = {
                  guideUrl: resData,
                  selGroup: ['printGuide'],
                  taskName: '体检报告'
                }
                printMethods(printParams.guideUrl, printParams)
              } else {
                let resData = []
                data.data.mergeFileList.forEach(item => {
                  let _str = this.$url + item
                  resData.push(_str)
                });
                let printParams = {
                  guideUrl: resData,
                  selGroup: ['printGuide'],
                  taskName: '体检报告'
                }
                printMethods(printParams.guideUrl, printParams)
              }
              this.searchList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message);
            }
          })
          .catch(err => {
            this.applyLoading = false;
            this.$Message.error(err.message);
          });
      }

    },
    // 下载报告zip
    downloadReportZip () {
      if (this.reportDate.length == 0) {
        this.$Message.warning("请选择需要下载的报告数据");
        return false
      }
      for (let i = 0; i < this.selections.length; i++) {
        if (this.selections[i].boResultStatus !== "9" && this.selections[i].boPrintStatus !== '1') {
          this.$Message.warning(
            `体检号：${this.selections[i].boPeId} 体检次数：${this.selections[i].boVisitSn}未完成总检，不能下载体检报告`
          );
          return false;
        }
      }

      let params = {
        zip: true,
        merge: false,
        duplex: false,
        mainExam: true,
        data: this.reportDate
      }
      this.downloadLoading = true;
      reportPrint(params)
        .then(({ data }) => {
          this.downloadLoading = false;
          if (data.code == 0) {
            let link = document.createElement("a");
            link.href = this.$url + data.data.zip;
            link.download = "体检报告.zip";
            link.click();
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {
          this.downloadLoading = false;
          this.$Message.error(err.message);
        });
    },
    // 分检报告打印
    sortExamPrint () {
      if (this.reportDate.length == 0) {
        this.$Message.error("请选择需要打印的用户");
        return false
      }
      if (!printNotice()) return false
      for (let i = 0; i < this.selections.length; i++) {
        if (this.selections[i].boResultStatus == "0") {
          this.$Message.warning(
            `体检号：${this.selections[i].boPeId} 体检次数：${this.selections[i].boVisitSn}未检，不能打印分检报告`
          );
          return false;
        }
      }

      let printConfig = getPrinterConfigFromLocalstorage();
      let params;

      if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
        params = {
          zip: false,
          merge: false,
          duplex: false,
          mainExam: false,
          data: this.reportDate
        }
      } else {
        params = {
          zip: false,
          merge: true,
          duplex: false,
          mainExam: false,
          data: this.reportDate
        }
      }
      this.applyLoading = true;
      reportPrint(params)
        .then(({ data }) => {
          this.applyLoading = false;
          if (data.code == 0) {
            this.searchList(this.pageIndex, this.pageSize)
            if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
              let resData = []
              data.data.originalFileList.forEach(item => {
                let _str = this.$url + item
                resData.push(_str)
              });
              let printParams = {
                guideUrl: resData,
                selGroup: ['printGuide'],
                taskName: '分检报告'
              }
              printMethods(printParams.guideUrl, printParams)
            } else {
              let resData = []
              data.data.mergeFileList.forEach(item => {
                let _str = this.$url + item
                resData.push(_str)
              });
              let printParams = {
                guideUrl: resData,
                selGroup: ['printGuide'],
                taskName: '分检报告'
              }
              printMethods(printParams.guideUrl, printParams)
            }
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {
          this.applyLoading = false;
          this.$Message.error(err.message);
        });
    },
    // 取消登记（未检状态下应用）
    cancelRegisterHandle () {
      console.log(this.selections)
      let params = []
      let msg = ''
      this.selections.forEach(item => {
        // if (item.boResultStatus != '未检') {
        //   this.$Message.error("存在非未检状态的数据，请取消勾选该数据后重试")
        //   btn = true
        //   return false
        // } else {
        //   params.push(item.boRegisterCode);
        // }
        let obj = {
          'registerCode': item.boRegisterCode,
          'name': item.medicalName
        }
        params.push(obj)
      })

      let names = this.selections.map(item => {
        return item.medicalName
      })
      if (names.length > 3) {
        msg = `是否对<strong style="color:red;">${names.slice(0, 3).join('，')}等${names.length}人</strong>取消登记？`
      } else {
        msg = `是否对病人：<strong style="color:red;">${names.join('，')}</strong>取消登记？`
      }
      this.cancelLoading = true
      this.$Modal.confirm({
        title: '提示',
        content: msg,
        onOk: () => {
          cancelRegister(params).then(({ data }) => {
            this.cancelLoading = false
            if (data.code == 0) {
              this.$Message.success(data.message)
              this.searchList()
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.cancelLoading = false
            this.$Message.error(err.message);
          });
        },
        onCancel: () => {
          this.cancelLoading = false
        }
      });

    }
  }
}
</script>
<style lang="less">
.exam-Progress-Mange {
  width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-form-item {
    margin-bottom: 15px;
  }
  .ivu-spin-fix {
    z-index: 999 !important;
  }
  .serch-unit-result {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 30px;
    left: 0;
    z-index: 10;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    margin: 5px 0;
    overflow: auto;
    li {
      // color: #c5c8ce;
      padding: 0 10px;
      &:hover {
        background-color: #d6eaff;
      }
    }
  }
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-guide {
      top: 0;
    }
  }
  .title-right-tool {
    display: flex;
    align-items: center;
  }
  .title {
    padding-left: 8px;
    position: relative;
    font-weight: bold;
    &::after {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .body-middle {
    height: 50px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    line-height: 50px;
    button {
      margin-right: 10px;
    }
  }
  .ivu-cascader {
    line-height: 32px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-btn-error[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>
