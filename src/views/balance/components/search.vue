<template>
  <div class="info-wrapper"
       :class="{show : showFlag, hide: hideFlag}">
    <div class="toggle-btn"
         @click="showInfo">
      <i class="icon-toggle"
         :class="{show : showFlag, hide: hideFlag}"></i>
    </div>
    <div class="info-title">搜索</div>
    <div class="info-container">
      <div class="formBox"
           style="margin-bottom: 30px;">
        <Form ref='form'
              :model="formData"
              label-position="right"
              :label-width="80">
          <Row type="flex">
            <FormItem label="体检号"
                      prop="boPeId">
              <Input class="inputclass"
                     v-model="formData.boPeId"
                     size="small"
                     @keyup.enter.native="handleSearch()" />
            </FormItem>
            <FormItem label="姓名"
                      :label-width="60"
                      prop="boName">
              <Input class="inputclass"
                     v-model="formData.boName"
                     size="small" />
            </FormItem>
            <FormItem label="体检单位"
                      prop="boUnitName">
              <Select class="inputclass"
                      style="min-width:220px;"
                      v-model="formData.boUnitName"
                      filterable
                      remote
                      clearable
                      size="small"
                      :remote-method="getUnits"
                      :loading="unitNameLoading"
                      @on-change="changeUnitName"
                      placeholder="单位名称搜索">
                <Option v-for="item in unitsList"
                        :value="item.boUnitName"
                        :key="item.boUnitId">{{ item.boUnitName }}</Option>
              </Select>
            </FormItem>
          </Row>
          <Row type="flex">
            <FormItem label="流水号"
                      prop="boRegisterCode">
              <Input class="inputclass"
                     v-model="formData.boRegisterCode"
                     size="small" />
            </FormItem>
            <FormItem label="性别"
                      :label-width="60"
                      style="max-width:140px;"
                      prop="boSex">
              <Input class="inputclass"
                     v-model="formData.boSex"
                     size="small" />
            </FormItem>
            <FormItem label="单位体检次数"
                      prop="boUnitVisitSn"
                      :label-width="100">
              <Input class="inputclass"
                     style="max-width:80px;"
                     v-model="formData.boUnitVisitSn"
                     size="small" />
            </FormItem>
            <FormItem label="体检状态"
                      prop="resultStatus">
              <Select class="inputclass"
                      style="min-width:147px;"
                      v-model="formData.resultStatus"
                      size="small"
                      clearable>
                <Option value="0">未检</Option>
                <Option value="1">在检</Option>
                <!-- <Option value="2">待审核</Option> -->
                <Option value="7">待总检</Option>
                <Option value="9">已总检</Option>
              </Select>
            </FormItem>

          </Row>
          <Row type="flex"
               justify="space-between">
            <div style="display: flex; align-items: center;">
              <FormItem label="登记日期"
                        prop="regStartDate">
                <DatePicker type="date"
                            v-model="formData.regStartDate"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            size="small"
                            :options="startTimeOptions"
                            @on-change="startTimeChange"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="20"
                        style="margin-left: 5px;"
                        prop="regEndDate">
                <DatePicker type="date"
                            v-model="formData.regEndDate"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            size="small"
                            :options="endTimeOptions"
                            @on-change="endTimeChange"></DatePicker>
              </FormItem>
            </div>
            <div>
              <Button type="primary"
                      size="small"
                      style="margin-top:4px;"
                      :btnLoading="btnLoading"
                      @click="handleSearch()">搜索</Button>
              <Button type="error"
                      size="small"
                      style="margin-top:4px;margin-left:8px;margin-right:45px"
                      :btnLoading="btnLoading"
                      @click="clearForm()">清空</Button>
            </div>
          </Row>
        </Form>
      </div>
      <div class="color"
           style="height:21px">
        <div class="block-color">
          <div class="block-item">
            未结算:
            <span style="background-color: #fee9c5;"></span>
          </div>
          <div class="block-item">
            已结算:
            <span style="background-color: #cacaca;"></span>
          </div>
          <div class="block-item">
            部分结算:
            <span style="background-color: #ffb7ad;"></span>
          </div>
          <div class="block-item">已退费:<span style="background-color: #cffef4;"></span></div>
          <!-- <div class="block-item">已最终审核:<span style="background-color: #fee9c5;"></span></div> -->
        </div>
      </div>
      <div class="table-wrapper">
        <Table :columns="patientColumns"
               :data="patientTable"
               :loading="isLoading"
               :row-class-name="rowClassName"
               :height="screenHeight - 280"
               @on-row-dblclick="handleDbclick">
          <template slot="boActualRegisterDate"
                    slot-scope="{row}">{{row.boActualRegisterDate | dateTime}}</template>
        </Table>
      </div>
      <div class="footer">
        <Page :total="totalSize"
              :current="pageIndex"
              :page-size='pageSize'
              @on-change="pageIndexChange"
              size="small"
              show-elevator
              show-total
              class="page" />
      </div>
    </div>
  </div>
</template>
<script>
import { listByName } from '@/api/personal_appointment.js'
import {
  mainExamBasicInfoList,
  deptResultDetailsList
} from '@/api/mainExam.js'
import {
  getPatientList
} from '@/api/personBalace.js'
import moment from 'moment'

export default {
  name: 'info',
  props: {
    // info: Object
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      search: '',
      isShowInfo: false,
      showFlag: false,
      hideFlag: true,
      formData: {        boActualRegisterDateE: "",
        boActualRegisterDateS: "",
        boName: "",
        boPeId: "",
        boRegisterCode: "",
        boResultStatus: "",
        boSex: "",
        boUnitName: "",
        boUnitVisitSn: ""      },
      unitList: [],
      patientColumns: [
        {
          title: '序号',
          key: 'rowId',
          width: 70,
          align: 'center'
        },
        {
          title: '体检号',
          key: 'boPeId',
          width: 160,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'boName',
          width: 100,
          align: 'center'
        },
        {
          title: '性别',
          width: 70,
          key: 'boSex',
          align: 'center'
        },
        {
          title: '年龄',
          width: 80,
          key: 'boAge',
          align: 'center'
        },
        {
          title: '身份证',
          width: 180,
          key: 'boIdNo',
          align: 'center'
        },
        {
          title: '体检次数',
          width: 100,
          key: 'boVisitSn',
          align: 'center'
        },
        {
          title: '体检类别',
          width: 100,
          key: 'boCategory',
          align: 'center'
        },
        {
          title: '体检日期',
          slot: 'boActualRegisterDate',
          width: 165,
          key: 'boActualRegisterDate',
          align: 'center'
        },
        {
          title: '体检单位',
          key: 'boUnitName',
          width: 120,
          align: 'center'
        },
        {
          title: '体检套餐',
          key: 'boPackageName',
          width: 120,
          align: 'center'
        }
      ],
      patientTable: [],
      pageIndex: 1,
      pageSize: 20,
      totalSize: 100,
      unitNameLoading: false,
      unitsList: [],
      startTimeOptions: {}, // 开始日期设置
      endTimeOptions: {}, // 结束日期设置
      isLoading: false,
      btnLoading: false,
      otherInfo: {}, // 其他信息
      diagnosticRecords: [] // 诊断记录数据
    }
  },
  watch: {
    screenHeight (val) {
      if (!this.timer) {
        this.screenHeight = val
        this.timer = true
        let that = this
        setTimeout(() => {
          that.timer = false
        }, 300);
      }
    }
  },
  mounted () {
    // 动态计算可视窗口高度
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }

    let curDate = moment().format('YYYY-MM-DD')
    // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
    this.$set(this.formData, 'regStartDate', curDate)
    this.$set(this.formData, 'regEndDate', curDate)
  },
  filters: {
    dateTime: function (value, formatString) {
      formatString = formatString || 'YYYY-MM-DD HH:mm'
      return moment(value).format(formatString)
    }
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
  },
  methods: {
    clearForm () {
      // this.formData = {}
      // let curDate = moment().format('YYYY-MM-DD')
      // this.$set(this.formData, 'regStartDate', curDate)
      // let yesDate = moment()
      //   .add(1, 'days')
      //   .format('YYYY-MM-DD')
      // this.$set(this.formData, 'regEndDate', yesDate)
      // debugger
      console.log(this.$refs.form)
      // this.formData={}
      this.$refs.form.resetFields()
      // this.formData.boUnitName = ''
      // console.log(this.formData)
    },
    showInfo (baseform) {
      // this.isShowInfo = !this.isShowInfo;
      this.showFlag = !this.showFlag
      this.hideFlag = !this.hideFlag
      // console.log(baseform)
      this.formatDate = {}
      // let curDate = moment().format('YYYY-MM-DD')
      // this.$set(this.formData, 'regStartDate', curDate)
      // let yesDate = moment()
      //   .add(1, 'days')
      //   .format('YYYY-MM-DD')
      // this.$set(this.formData, 'regEndDate', curDate)
      if (baseform !== {}) {
        Object.assign(this.formData, baseform)
      }
      // console.log(this.formData)
      this.handleSearch()
    },
    // 搜索病人基本信息
    handleSearch (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size
      // console.log(this.pageIndex)
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }

      // 格式化时间
      let startDate = this.formData.regStartDate != '' ? moment(this.formData.regStartDate).format('YYYY-MM-DD') : ''
      let endDate = this.formData.regEndDate != '' ? moment(this.formData.regEndDate).format('YYYY-MM-DD') : ''

      let params = {
        boPeId: this.formData.boPeId || '',
        boName: this.formData.boName || '',
        boUnitName: this.formData.boUnitName || '',
        boActualRegisterDateS: startDate,
        boActualRegisterDateE: endDate,
        boResultStatus: this.formData.resultStatus || '',
        boRegisterCode: this.formData.boRegisterCode || '',
        boSex: this.formData.boSex || '',
        boUnitVisitSn: this.formData.boUnitVisitSn || ''
      }
      // console.log(params)
      this.isLoading = true
      this.btnLoading = true
      mainExamBasicInfoList(pagination, params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.isLoading = false
            this.btnLoading = false
            let res = data.data
            // console.log(patientTable)
            this.patientTable = res.records
            this.totalSize = res.total
          } else {
            this.isLoading = true
            this.btnLoading = true
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    getUnits () { },
    changeUnitName (val) { },
    // 设置开始和结束时间选择范围
    startTimeChange: function (e) {
      // 设置开始时间
      // console.log(e)
      this.formData.regStartDate = e
      this.endTimeOptions = {
        disabledDate: date => {
          let startTime = this.formData.regStartDate
            ? new Date(this.formData.regStartDate).valueOf()
            : ''
          return date && date.valueOf() < startTime
        }
      }
    },
    endTimeChange: function (e) {
      // 设置结束时间
      this.formData.regEndtDate = e
      let endTime = this.formData.regEndtDate
        ? new Date(this.formData.regEndtDate).valueOf() -
        1 * 24 * 60 * 60 * 1000
        : ''
      this.startTimeOptions = {
        disabledDate (date) {
          return date && date.valueOf() > endTime
        }
      }
    },
    // 查询单位
    getUnits (query) {
      // console.log(query)
      if (query !== '') {
        this.unitNameLoading = true
        let unitParam = {
          boUnitName: query
        }
        listByName(unitParam).then(res => {
          // console.log(res)
          let result = res.data
          if (result.code === 0) {
            this.unitNameLoading = false
            this.unitsList = result.data
          } else {
            this.$Message.error(result.message)
          }
        })
      }
    },
    // 双击事件
    async handleDbclick (row, index) {
      // this.$emit('func', row)
      // console.log(row)
      // console.log(this.userInfo)
      // let params = {
      //   boPeId: row.boPeId,
      //   boVisitSn: row.boVisitSn,
      //   boName: row.boName
      // }
      // await deptResultDetailsList(params)
      //   .then(({ data }) => {
      //     // console.log(data)
      //     if (data.code == 0) {
      //       let result = data.data
      //       // 诊断记录数据
      //       let arr = result.data(item => {
      //         return item.inId != -2
      //       })
      //       let len = result.length
      //       this.otherInfo = { ...result[len - 1] }
      //       // this.review= otherInfo.inContent
      //       // this.suggest= otherInfo.inGuideContent
      //       // this.uncheckedItems = otherInfo.inIsInChiefReport
      //       this.diagnosticRecords = [...arr]
      //       // console.log(this.otherInfo)
      //       // console.log(arr)
      //       this.showInfo()
      //       this.patientTable = []
      //     } else {
      //       this.tableData = []
      //       this.showInfo()
      //     }
      //   })
      // .catch(err => {
      //   this.$Message.error('网络不稳定，请稍后重试')
      // })
      this.showFlag = !this.showFlag
      this.hideFlag = !this.hideFlag
      let obj = {
        basicInfo: row,
        // diagnosticRecords: this.diagnosticRecords,
        otherInfo: this.otherInfo,
        disabled: true,
      }
      this.$emit('func', obj)
    },
    rowClassName (row, index) {
      // console.log(row)
      if (row.boSettleStatus == '0' || row.boSettleStatus === null) {
        return 'table-success-row'
      } else if (row.boSettleStatus == '1') {
        return 'table-info-row'
      } else if (row.boSettleStatus == '2') {
        return 'table-green-row'
      } else if (row.boSettleStatus == '3') {
        return 'table-cyan-row'
      }
    },
    // 切换页码
    pageIndexChange (val) {
      // console.log(val)
      this.handleSearch(val, 20)
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      var second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
  }
}
</script>
<style lang="less">
.info-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  max-width: 1000px;
  background-color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  transform: translateX(100%);
  box-shadow: -1px -1px 15px #dcdee2;
  // overflow-y: auto;

  .info-container {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
  }
  .ivu-form-item {
    margin-bottom: 0px !important;
  }
  .table-wrapper {
    width: 100%;
    height: calc(~'100% - 138px');
  }
  .footer {
    height: 60px;
  }
  &.show {
    animation: hideToshow 0.5s;
    transform: translateX(0);
  }
  &.hide {
    animation: showTohide 0.5s;
    transform: translateX(100%);
  }
  .toggle-btn {
    position: absolute;
    top: 50%;
    left: -25px;
    width: 25px;
    margin-top: -30px;
    height: 60px;
    background-color: #1a94e6;
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-toggle {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    background-position: center;
    background-size: 16px 16px;
    transform: rotateY(0);
    &.show {
      animation: rotateIcon 0.5s;
      transform: rotateY(180deg);
    }
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA+klEQVRYR8XX6w3CMAwE4LsN2ARGgE3oZJQN2ABG6CgwgVGktlJfaeLGTn+7uU+RItvEwU9ETgCuJF8pR4lIqP0MtUz5aaumD38DuABoSLax80TkDuABoCXZhFo1YBb+62+hi2CH8FAyYlWAUuGqGygZng0oHZ4FsAhPBliFJwEsw3cB1uFRgEf4JsArfBXgGb4AeIdPADXCR0Ct8Dkg9OgzgC+AG8nszqZp7WM37G/BHTFpxzUQi3nAG7E6kHgiNiciL0R0JPNA7M6E1ohdQHjblogkgCUiGWCFyAJYILIBpREqQEmEGrCCyFlOnyTDrqhfTofWe3Q9/wN1T1gwYP16pAAAAABJRU5ErkJggg==');
    background-repeat: no-repeat;
  }
  .info-title {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    padding: 10px 10px;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
    margin-bottom: 20px;
    &:before {
      position: absolute;
      top: 10px;
      left: 0;
      content: '';
      display: inline-block;
      width: 4px;
      height: 100%;
      background-color: #2d8cf0;
    }
  }
  .page {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

.block-color {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 5px;
  .block-item {
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  span {
    display: inline-block;
    width: 15px;
    height: 15px;
    background: pink;
    margin-left: 5px;
  }
}

.ivu-table .table-info-row td {
  background-color: #cacaca;
  // background: rgba(45, 183, 245, 1);
  color: #333;
}
.ivu-table .table-warning-row td {
  background-color: #e0eefd;
  // background: rgba(255, 153, 0, 0.8);
  color: #333;
}
.ivu-table .table-green-row td {
  background-color: #ffb7ad;
  // background: rgba(0, 128, 0, 0.8);
  color: #333;
}
.ivu-table .table-cyan-row td {
  background-color: #cffef4;
  // background: rgba(0, 255, 255, 0.8);
  color: #333;
}
.ivu-table .table-success-row td {
  background-color: #fee9c5;
  // background: rgba(25, 190, 107, 0.8);
  color: #333;
}
.inputclass {
  width: 80%;
}

// CSS3 animation
@keyframes rotateIcon {
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(180deg);
  }
}
@keyframes hideToshow {
  from {
    transform: translateX(100%);
  }
  to {
    transform: rotateY(0);
  }
}

// @keyframes showTohide {
//   from {
//     transform: translateX(0);
//   }
//   to {
//     transform: rotateY(0);
//     transform: translateX(100%);
//   }
// }
</style>
