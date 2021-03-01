<template>
  <div class="mainExam-info-wrapper"
       :class="{show : isShowInfo}">
    <div class="toggle-btn"
         @click="showInfo">
      <i class="icon-toggle"
         :class="{show : isShowInfo}"></i>
    </div>
    <div class="info-title">搜索</div>
    <div class="info-container">
      <div class="formBox">
        <Form :model="formData"
              label-position="right"
              :label-width="80">
          <Row>
            <Col span="6">
            <FormItem label="体检号"
                      prop="peId">
              <Input v-model="formData.peId"
                     size="small"
                     @keyup.enter.native="handleSearch()" />
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="姓名"
                      :label-width="45"
                      prop="name">
              <Input v-model="formData.name"
                     size="small" />
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="体检单位">
              <Select v-model="formData.boUnitName"
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
            </Col>
            <Col span="6">
            <FormItem label="体检状态"
                      prop="resultStatus">
              <Select v-model="formData.resultStatus"
                      size="small">
                <Option value="all">全部</Option>
                <Option value="0">未检</Option>
                <Option value="1">在检</Option>
                <Option value="3">待主检</Option>
                <Option value="7">待总检</Option>
                <Option value="9">已总检</Option>
                <Option value="8">已打印报告</Option>

              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="登记日期"
                      prop="regStartDate">
              <DatePicker type="date"
                          v-model="formData.regStartDate"
                          size="small"></DatePicker>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="到"
                      :label-width="45"
                      prop="regEndDate">
              <DatePicker type="date"
                          v-model="formData.regEndDate"
                          size="small"></DatePicker>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="体检日期"
                      prop="boExamTimeDateS">
              <DatePicker type="date"
                          v-model="formData.boExamTimeDateS"
                          size="small"></DatePicker>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="到"
                      :label-width="45"
                      prop="boExamTimeDateE">
              <DatePicker type="date"
                          v-model="formData.boExamTimeDateE"
                          size="small"></DatePicker>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="到"
                      :label-width="45"
                      prop="boExamTimeDateE">
              <DatePicker type="date"
                          v-model="formData.boExamTimeDateE"
                          size="small"></DatePicker>
            </FormItem>
            </Col>
          </Row>
          <Row type="flex"
               justify="end"
               align="middle">
            <Button type="primary"
                    size="small"
                    style="margin-top:4px;margin-left:5px;"
                    :btnLoading="btnLoading"
                    @click="handleSearch()">搜索</Button>
            <Button type="primary"
                    size="small"
                    ghost
                    style="margin-top:4px;margin-left:5px;"
                    @click="reset">清空</Button>
          </Row>
        </Form>
      </div>
      <div class="color">
        <div class="block-color">
          <div class="block-item">未检:<span style="background-color: #FFF;border:1px solid #ccc"></span></div>
          <div class="block-item">在检:<span style="background-color: #C8E6C9;"></span></div>
          <div class="block-item">待主检:<span style="background-color: #F9EFC0;"></span></div>
          <div class="block-item">待总检:<span style="background-color: #ce93d8;"></span></div>
          <div class="block-item">已总检:<span style="background-color: #FF8A80;"></span></div>
          <div class="block-item">已打印报告:<span style="background-color: #E0E0E0;"></span></div>
        </div>
      </div>
      <div class="main">
        <div class="table-wrapper">
          <Table :columns="patientColumns"
                 :data="patientTable"
                 :loading="isLoading"
                 :highlight-row="true"
                 :height="screenHeight - 320"
                 :row-class-name="rowClassName"
                 @on-row-dblclick="handleDbclick"
                 size="small">
            <template slot="boUnitName"
                      slot-scope="{row}">
              {{row.boUnitName ? row.boUnitName : '无'}}
            </template>
            <template slot="boPackageName"
                      slot-scope="{row}">
              {{row.boPackageName ? row.boPackageName : '无'}}
            </template>
            <template slot="boActualRegisterDate"
                      slot-scope="{row}">
              <span v-show="row.boActualRegisterDate">{{row.boActualRegisterDate | dateformat}}</span>
            </template>
            <template slot="boExamTime"
                      slot-scope="{row}">
              <span v-show="row.boExamTime">{{row.boExamTime | dateformat}}</span>
            </template>
          </Table>

        </div>

      </div>
      <div class="footer">
        <Page :total="totalSize"
              :current="pageIndex"
              :page-size="pageSize"
              @on-change="pageIndexChange"
              size="small"
              show-total
              show-elevator
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
      formData: {
        regStartDate: '',
        regEndDate: ''
      },
      unitList: [],
      patientColumns: [
        {
          title: '体检号',
          key: 'boPeId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'boName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '性别',
          minWidth: 70,
          key: 'boSex',
          align: 'center'
        },
        {
          title: '年龄',
          minWidth: 80,
          key: 'boAge',
          align: 'center'
        },
        {
          title: '体检次数',
          minWidth: 100,
          key: 'boVisitSn',
          align: 'center'
        },
        {
          title: '体检类别',
          minWidth: 100,
          key: 'boCategory',
          align: 'center'
        },
        {
          title: '体检单位',
          key: 'boUnitName',
          slot: 'boUnitName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '体检套餐',
          slot: 'boPackageName',
          key: 'boPackageName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '登记日期',
          slot: 'boActualRegisterDate',
          minWidth: 165,
          key: 'boActualRegisterDate',
          align: 'center'
        },
        {
          title: '体检日期',
          slot: 'boExamTime',
          minWidth: 165,
          key: 'boExamTime',
          align: 'center'
        },
      ],
      patientTable: [],
      pageIndex: 1,
      pageSize: 20,
      totalSize: 0,
      unitNameLoading: false,
      unitsList: [],
      startTimeOptions: {}, // 开始日期设置
      endTimeOptions: {}, // 结束日期设置
      isLoading: false,
      btnLoading: false,
      otherInfo: {}, // 其他信息
      diagnosticRecords: [], // 诊断明细数据
      historyRecords: [] // 诊断历史数据
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
        }, 300)
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
    this.$set(this.formData, 'boExamTimeDateS', curDate)
    this.$set(this.formData, 'boExamTimeDateE', curDate)
    this.handleSearch()
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  methods: {
    showInfo () {
      this.isShowInfo = !this.isShowInfo
      if (this.isShowInfo) {
        let that = this;
        document.onkeydown = function (event) {
          const e = event || window.event || arguments.callee.caller.arguments[0];
          // 键盘enter
          if (e && e.keyCode == 13) {
            that.handleSearch()
          }
        }
      } else {
        document.onkeydown = null
      }
    },
    // 搜索病人基本信息
    handleSearch (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }

      // 格式化时间
      let startDate =
        this.formData.regStartDate != ''
          ? moment(this.formData.regStartDate).format('YYYY-MM-DD')
          : ''
      let endDate =
        this.formData.regEndDate != ''
          ? moment(this.formData.regEndDate).format('YYYY-MM-DD')
          : ''
      let _startDate =
        this.formData.boExamTimeDateS != ''
          ? moment(this.formData.boExamTimeDateS).format('YYYY-MM-DD')
          : ''
      let _endDate =
        this.formData.boExamTimeDateE != ''
          ? moment(this.formData.boExamTimeDateE).format('YYYY-MM-DD')
          : ''

      let params = {
        boPeId: this.formData.peId || '',
        boName: this.formData.name || '',
        boUnitName: this.formData.boUnitName || '',
        boActualRegisterDateS: startDate,
        boActualRegisterDateE: endDate,
        boExamTimeDateS: _startDate,
        boExamTimeDateE: _endDate,
        boResultStatus:
          (this.formData.resultStatus == 8 || this.formData.resultStatus == 'all' ? '' : this.formData.resultStatus) || '',
        boPrintStatus: (this.formData.resultStatus == 8 ? '1' : '')
      }
      // Object.keys(params).forEach(item => {
      //   if(!params[item]) {
      //     delete params[item]
      //   }
      // })
      this.btnLoading = true
      this.isLoading = true
      console.log(params)
      mainExamBasicInfoList(pagination, params)
        .then(({ data }) => {
          console.log(data)
          this.isLoading = false
          this.btnLoading = false
          if (data.code == 0) {
            let res = data.data
            this.patientTable = res.records
            this.totalSize = res.total
            // console.log(this.patientTable)
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.btnLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    changeUnitName (val) { },

    // 查询单位
    getUnits (query) {
      console.log(query)
      if (query !== '') {
        this.unitNameLoading = true
        let unitParam = {
          boUnitName: query
        }
        listByName(unitParam).then(res => {
          // console.log(res);
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
    handleDbclick (row, index) {
      console.log(row)
      this.$emit('handleReset')
      this.$emit('getPatientInfo', this.patientTable[index])
      this.showInfo()
    },

    rowClassName (row, index) {
      if (row.boResultStatus == '9' && row.printStatus == '1') {
        return 'table-cyan-row'
      } else if (row.boResultStatus == '7') {
        return 'table-green-row'
      } else if (row.boResultStatus == '3') {
        return 'table-yellow-row'
      } else if (row.boResultStatus == '9') {
        return 'table-success-row'
      } else if (row.boResultStatus == '1') {
        return 'table-warning-row'
      } else if (row.boResultStatus == '0') {
        return 'table-info-row'
      }
    },

    // 切换页码
    pageIndexChange (val) {
      console.log(val)
      this.pageIndex = val
      this.handleSearch(val, 20)
      console.log(this.pageIndex)
    },
    // 清空
    reset () {
      this.formData = {
        peId: '',
        name: '',
        boUnitName: '',
        regStartDate: '',
        regEndDate: '',
        resultStatus: '',
        boExamTimeDateE: '',
        boExamTimeDateS: ''
      }
    }
  }
}
</script>
<style lang="less">
.mainExam-info-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  width: 1000px;
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
  }
  .ivu-form-item {
    margin-bottom: 8px;
  }
  .table-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    td {
      height: 40px;
    }
  }
  .footer {
    margin-top: 20px;
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
    margin-top: 30px;
  }

  // 未检-白色: #FFFFFF
  // 在检-浅绿色：#C8E6C9
  // 待总检-浅紫色：#ce93d8
  // 已总检-红色：#FF8A80
  // 已打印报告-浅灰：#E0E0E0
  // boResultStatus = 0
  .ivu-table .table-info-row td {
    // background-color: #cacaca;
    background-color: #ffffff;
    color: #333;
  }
  // boResultStatus = 1
  .ivu-table .table-warning-row td {
    // background-color: #e0eefd;
    background-color: #c8e6c9;
    color: #333;
  }
  // boResultStatus = 1
  .ivu-table .table-yellow-row td {
    // background-color: #e0eefd;
    background-color: #f9efc0;
    color: #333;
  }
  // boResultStatus = 7
  .ivu-table .table-green-row td {
    // background-color: #381511;
    background-color: #ce93d8;
    color: #333;
  }
  // printStatus = 1 && boResultStatus = 9
  .ivu-table .table-cyan-row td {
    // background-color: #cffef4;
    background-color: #e0e0e0;
    color: #333;
  }

  // boResultStatus = 9
  .ivu-table .table-success-row td {
    // background-color: #fee9c5;
    background-color: #ff8a80;
    color: #333;
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
