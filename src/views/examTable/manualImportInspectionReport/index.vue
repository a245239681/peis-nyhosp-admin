<template>
  <div class="manual-import-inspection-report">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">手动导入检验报告</span>
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
                   size="small"></Input>
          </FormItem>
          <FormItem label="体检编号"
                    prop="boPeIdStart">
            <Input placeholder="输入数字编号"
                   style="max-width:180px;"
                   size="small"
                   v-model="formData.boPeIdStart"></Input>
          </FormItem>
          <FormItem label="到"
                    prop="boPeIdEnd"
                    :label-width="20">
            <Input placeholder="输入数字编号"
                   style="max-width:180px;"
                   size="small"
                   v-model="formData.boPeIdEnd"></Input>
          </FormItem>
          <FormItem label="体检分类"
                    prop="unitOrPersonal">
            <Select size="small"
                    v-model="formData.unitOrPersonal"
                    @on-change="changeUnit">
              <Option value="1">全部</Option>
              <Option value="2">个人</Option>
              <Option value="3">单位</Option>
            </Select>
          </FormItem>
          <Row :gutter="16"
               style="display:inline-block">
            <FormItem prop="boRegisterDateStart"
                      label="登记日期"
                      style="margin-right:0">
              <DatePicker type="date"
                          style="max-width:180px;"
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
                          style="max-width:180px;"
                          :editable="false"
                          size="small"
                          v-model="formData.boRegisterDateEnd"
                          :options="bookingStartTime"
                          placeholder="截止时间"></DatePicker>
            </FormItem>
          </Row>
          <!-- <FormItem label="到"
                      prop="serialNumberEnd"
                      :label-width="20">
              <Input
                     style="max-width:140px;"
                     placeholder="输入数字编号"
                     size="small"
                     v-model="formData.serialNumberEnd"></Input>
            </FormItem> -->

          <!-- <FormItem v-show="unitGroupShow"
                    label="体检单位"
                    :label-width="80"
                    prop="unitName">
            <Select v-model="formData.unitName"
                    filterable
                    remote
                    clearable
                    size="small"
                    ref='select'
                    placeholder="单位名称搜索"
                    style="width:250px;"
                    @on-clear="clearGroup"
                    :remote-method="searchUnit">
              <Option v-for="(option, index) in tijian"
                      :value="option.value"
                      :key="index">{{option.value}}</Option>
            </Select>
          </FormItem> -->
          <FormItem label="体检单位"
                    prop="unitName"
                    v-show="unitGroupShow"
                    :label-width="80">
            <Select v-model="formData.unitName"
                    style="width:250px;"
                    ref="select"
                    clearable
                    filterable
                    remote
                    size="small"
                    :label-in-value="true"
                    placeholder=" "
                    @on-clear="clearGroup"
                    :remote-method="getUnits">
              <Option v-for="item in unitsList"
                      :value="item.boUnitName"
                      :key="item.boUnitId">{{ item.boUnitName }}</Option>
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
          <FormItem label="登记流水号"
                    :label-width="90"
                    prop="boRegisterCode">
            <Input style="max-width:140px;"
                   placeholder="输入数字编号"
                   size="small"
                   @on-enter="getReport(1,20,'search')"
                   v-model="formData.boRegisterCode"></Input>
          </FormItem>
        </Form>
        <div class="body-top-left"
             style="text-align:right">
          <Button style="height:30px;width:100%"
                  @click="getReport(1,20,'search')"
                  :loading="btnLoading"
                  type="primary">筛选</Button>
          <Button style="height:30px;width:100%;margin-top:10px"
                  @click="refSeachList">清除筛选条件</Button>
        </div>
      </div>
      <div class="body-middle">
        <Button @click="reportJY()"
                :loading="codeLoading"
                type="primary"
                v-permission="['edit']">导入检验数据</Button>
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
                   name="name1">
            <TableList :columns="columns"
                       @tabSelectChange="tabSelect"
                       :loading="isLoading"
                       :tabelData="tabelData"></TableList>
          </TabPane>
          <TabPane label="已导入"
                   name="name2">
            <TableList :columns="columns"
                       @tabSelectChange="tabSelect"
                       :loading="isLoading"
                       :tabelData="tabelData"></TableList>
          </TabPane>
          <TabPane label="未导入"
                   name="name3">
            <TableList :columns="columns"
                       @tabSelectChange="tabSelect"
                       :loading="isLoading"
                       :tabelData="tabelData"></TableList>
          </TabPane>
          <TabPane label="导入中"
                   name="name4">
            <TableList :columns="columns"
                       @tabSelectChange="tabSelect"
                       :loading="isLoading"
                       :tabelData="tabelData"></TableList>
          </TabPane>
        </Tabs>
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
  </div>
</template>
<script>
import { listAllByUnitId, listByName } from '@/api/personal_register.js'
import { getReport, reportJY } from '@/api/manualImportInspectionReport.js'
import { printFunc } from '@/libs/printOrder.js'
// import { directPrintFunc } from '@/libs/directPrint.js'
import moment from 'moment'
import TableList from './components/table'
import { debuglog, log } from 'util'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
  name: 'examProgressMange',
  components: {
    TableList
  },
  data () {
    const validatePass = (rule, value, callback) => {
      var reg = /^[0-9]*$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字格式'))
      } else {
      }
      callback()
    }
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
      btnLoading: false,
      codeLoading: false,
      guideLoading: false,
      applyLoading: false,
      showSearchResult: false,
      unitsList: [],
      tijian: [],
      columns: [
        { type: 'selection', align: 'center', width: 30 },
        { title: '体检号', key: 'boPeId', align: 'center', width: 120 },
        {
          slot: 'status',
          title: '体检状态',
          key: 'boResultStatus',
          align: 'center',
          width: 110
        },
        {
          title: '导入状态',
          slot: 'importStatus',
          align: 'center',
          width: 110
        },
        {
          title: '登记流水号',
          key: 'boRegisterCode',
          align: 'center',
          width: 140
        },
        { title: '姓名', key: 'medicalName', align: 'center', width: 120 },
        { title: '性别', key: 'sex', align: 'center', width: 65 },
        { title: '年龄', key: 'boAge', align: 'center', width: 65 },
        { title: '身份证', key: 'idNo', align: 'center', width: 180 },
        { title: '手机号', key: 'mobile', align: 'center', width: 150 },
        { title: '单位', key: 'unitName', align: 'center', width: 200 },
        { title: '套餐', key: 'boPackageName', align: 'center', width: 200 },
        { title: '体检次数', key: 'boVisitSn', align: 'center', width: 110 },
        {
          title: '登记时间',
          key: 'boRegisterDate',
          align: 'center',
          width: 110
        },
        { title: '体检时间', key: 'boExamTime', align: 'center', width: 110 },
        { title: '预约来源', key: 'boSource', align: 'center', width: 110 }
      ],
      pdfUrl: '',
      boIds: {},
      printData: {},
      printGuideDate: [],
      reportDate: [],
      vShow: '',
      isLoading: false,
      totalSize: 100,
      pageIndex: 1,
      pageSize: 20,
      formData: {
        medicalName: '',
        boPeIdStart: '',
        boPeIdEnd: '',
        boRegisterDateStart: moment(Date.now()).format('YYYY-MM-DD').valueOf(),
        boRegisterDateEnd: '',
        unitName: '',
        boRegisterCode: '',
        serialNumberEnd: '',
        unitOrPersonal: '1',
        resultStatus: ''
      },
      unitGroupShow: false,
      tabFormData: {},
      name: 'name1',
      tabelData: [],
      show: true,
      tabNumber: '',
      groupsList: [],
      bookingStartTime: {},
      examStartTime: {},
      selections: [] // 表格选中项
    }
  },
  created () {
    let curDate = moment().format('YYYY-MM-DD')
    // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
    this.$set(this.formData, 'boRegisterDateStart', curDate)
    this.$set(this.formData, 'boRegisterDateEnd', curDate)
    // this.getGroups();
    this.getReport()
    this.$store.dispatch('getChargeTypeDict')
  },
  mounted () { },
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
    GroupsList () {
      return this.groupsList
    }
  },
  methods: {
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
            console.log(this.unitsList)
          } else {
            this.$Message.error(result.message)
          }
          this.unitSearchLoading = false
        }).catch(err => {
          console.log(err)
          this.unitSearchLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }, 300)
    },
    changeUnit (e) {
      this.formData.unitOrPersonal = e
      if (e == '3') {
        this.unitGroupShow = true
      } else {
        this.unitGroupShow = false
        this.formData.unitName = ''
        this.formData.boUnitGroupId = ''
      }
      console.log(this.formData.unitOrPersonal)
    },
    changeReultStatus (e) {
      this.formData.resultStatus = e
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
    refSeachList () {
      let arr = Object.values(this.formData)
      let newArr = arr.filter(res => {
        if (res != '1') {
          return res
        }
      })
      if (newArr.length > 0) {
        this.$refs.form.resetFields()
        this.formData.boUnitId = ''
        this.unitGroupShow = false
        this.groupsList = []
        this.bookingStartTime.disabledDate = function () {
          return false
        }
        this.examStartTime.disabledDate = function () {
          return false
        }
        this.getReport()
      }
    },

    searchUnit (query) {
      console.log(query)
      if (query !== '') {
        console.log(this.unitsList)
        this.tijian = this.unitsList.map(res => {
          return {
            value: res.boUnitName,
            lable: res.boUnitId
          }
        })
        this.tijian.forEach(res => {
          if (query.toLowerCase().indexOf(res.value) > -1) {
            this.formData.boUnitId = res.lable
            this.getGroups()
          } else {
            this.formData.boUnitName = ''
          }
        })
      } else {
        this.tijian = []
      }
    },
    // 选中单位后
    // selectUnitName (option) {
    //   console.log(option)
    //   this.formData.boUnitId = option.lable
    //   this.getGroups()
    // },
    // 清空单位
    clearGroup () {
      this.groupsList = []
      this.formData.boUnitGroupId = ''
    },
    // 体检综合进度表
    getReport (page = 1, size = 20, type) {
      let arr = []
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 深拷贝 解决时间格式字符串自动转换为时间对象的问题
      this.tabFormData = Object.assign({}, this.formData)
      this.tabFormData.boRegisterDateEnd = this.tabFormData.boRegisterDateEnd ? moment(this.tabFormData.boRegisterDateEnd).format('YYYY-MM-DD') : ''
      this.tabFormData.boRegisterDateStart = this.tabFormData.boRegisterDateStart ? moment(this.tabFormData.boRegisterDateStart).format('YYYY-MM-DD') : ''
      this.tabFormData.boExamTimeEnd = this.tabFormData.boExamTimeEnd ? moment(this.tabFormData.boExamTimeEnd).format('YYYY-MM-DD') : ''
      this.tabFormData.boExamTimeStart = this.tabFormData.boExamTimeStart ? moment(this.tabFormData.boExamTimeStart).format('YYYY-MM-DD') : ''
      // this.tabFormData = JSON.parse(JSON.stringify(this.formData))
      this.name = 'name1'
      if (type) {
        this.btnLoading = true
      }
      this.isLoading = true
      getReport(pagination, this.tabFormData)
        .then(res => {
          this.isLoading = false
          this.btnLoading = false
          if (res.data.code == 0) {
            this.tabelData = res.data.data.records
            if (JSON.stringify(res.data.data.records) != '[]') {
              this.tabelData.map(item => {
                if (item.boRegisterDate) {
                  item.boRegisterDate = moment(item.boRegisterDate).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                }
                if (item.boExamTime) {
                  item.boExamTime = moment(item.boExamTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                }
                if (item.boResultStatus) {
                  if (item.boResultStatus == 0) item.boResultStatus = '未检'
                  if (item.boResultStatus == 1) item.boResultStatus = '在检'
                  if (item.boResultStatus == 3) item.boResultStatus = '待主检'
                  if (item.boResultStatus == 2) item.boResultStatus = '待总检'
                  if (item.boResultStatus == 7) item.boResultStatus = '待总检'
                  if (item.boResultStatus == 9) item.boResultStatus = '已总检'
                  if (item.boPrintStatus == 1) item.boResultStatus = '已打印'
                }
                if (item.importStatus) {
                  if (item.importStatus == 0) item.importStatus = '未导入'
                  if (item.importStatus == 1) item.importStatus = '已导入'
                  if (item.importStatus == 2) item.importStatus = '导入中'
                }
              })
            }

            this.totalSize = res.data.data.total
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.btnLoading = false
          this.isLoading = false
          this.tabelData = {}
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // tab分页
    seach (name, page = 1, size = 20) {
      // this.formData = {}
      this.name = name
      this.tabFormData.boPrintStatus = ''
      this.tabFormData.boResultStatus = ''
      if (name == 'name1') this.tabFormData.resultStatus = ''
      if (name == 'name2') this.tabFormData.resultStatus = '1'
      if (name == 'name3') this.tabFormData.resultStatus = '0'
      if (name == 'name4') this.tabFormData.resultStatus = '2'
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
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
      if (this.tabFormData.boExamTimeStart) {
        this.tabFormData.boExamTimeStart = moment(
          this.tabFormData.boExamTimeStart
        ).format('YYYY-MM-DD')
      } else {
        this.tabFormData.boExamTimeStart = ''
      }
      if (this.tabFormData.boExamTimeEnd) {
        this.tabFormData.boExamTimeEnd = moment(
          this.tabFormData.boExamTimeEnd
        ).format('YYYY-MM-DD')
      } else {
        this.tabFormData.boExamTimeEnd = ''
      }
      getReport(pagination, this.tabFormData)
        .then(res => {
          this.isLoading = false
          if (res.data.code == 0) {
            this.tabelData = res.data.data.records
            this.tabelData.forEach(item => {
              if (item.boRegisterDate) {
                item.boRegisterDate = moment(item.boRegisterDate).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              }
              if (item.boExamTime) {
                item.boExamTime = moment(item.boExamTime).format(
                  'YYYY-MM-DD HH:mm:ss'
                )
              }
              if (item.boResultStatus) {
                if (item.boResultStatus == 0) item.boResultStatus = '未检'
                if (item.boResultStatus == 1) item.boResultStatus = '在检'
                if (item.boResultStatus == 3) item.boResultStatus = '待主检'
                if (item.boResultStatus == 2) item.boResultStatus = '待总检'
                if (item.boResultStatus == 7) item.boResultStatus = '待总检'
                if (item.boResultStatus == 9) item.boResultStatus = '已总检'
                if (item.boPrintStatus == 1) item.boResultStatus = '已打印'
              }
              if (item.importStatus) {
                if (item.importStatus == 0) item.importStatus = '未导入'
                if (item.importStatus == 1) item.importStatus = '已导入'
                if (item.importStatus == 2) item.importStatus = '导入中'
              }
            })
            this.totalSize = res.data.data.total
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.tabelData = {}
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // 勾选打印数据
    tabSelect (row) {
      this.selections = row
      let reportPrint = {}
      this.boIds.patientVisitIds = []
      this.printGuideDate = []
      this.reportDate = []
      row.forEach(res => {
        this.boIds.patientVisitIds.push(res.boId)
      })
      // for (let i = 0; i < row.length; i++) {
      //   this.printData.name = row[i].medicalName;
      //   this.printData.peId = row[i].boPeId;
      //   this.printData.visitSn = row[i].boVisitSn.toString();
      //   reportPrint.inPeId = row[i].boPeId;
      //   reportPrint.inVisitSn = row[i].boVisitSn.toString();
      //   let obj = Object.assign({}, this.printData);
      //   let objData = Object.assign({}, reportPrint);
      //   this.printGuideDate.push(obj);
      //   this.reportDate.push(objData);
      // }
      console.log(this.boIds)
    },
    // 导入检验数据
    reportJY (id) {
      if (!this.boIds.patientVisitIds || JSON.stringify(this.boIds.patientVisitIds) == '[]') {
        this.$Message.error('请在表格中勾选要导入的数据')
        return false
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否导入已勾选的数据？`,
        onOk: () => {
          let params = {
            patientVisitIds: this.boIds.patientVisitIds
          }
          this.codeLoading = true
          reportJY(params).then(({ data }) => {
            this.codeLoading = false
            if (data.code == 0) {
              this.$Message.success(data.message)
              this.seach(this.name, this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.codeLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },
    // 查询体检分组
    getGroups () {
      let groupParam = {
        boUnitId: this.formData.boUnitId,
        boSex: ''
      }
      listAllByUnitId(groupParam)
        .then(res => {
          let result = res.data
          if (result.code === 0) {
            this.groupsList = result.data
          } else {
            this.groupsList = []
            this.formData.boUnitGroupId = ''
            this.$Message.error(result.Message)
          }
        })
        .catch(err => {
          this.groupsList = []
          this.formData.boUnitGroupId = ''
          this.$Message.error('网络不稳定，请稍后重试')
        })
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
      this.pageIndex = val
      this.seach(this.name, this.pageIndex, this.pageSize)
    },
    // 切换显示数量
    pageSizeChange (val) {
      this.pageSize = val
      this.seach(this.name, this.pageIndex, this.pageSize)
    }
  }
}
</script>
<style lang="less">
.manual-import-inspection-report {
  width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
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
  .ivu-form-item {
    margin-bottom: 15px !important;
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
