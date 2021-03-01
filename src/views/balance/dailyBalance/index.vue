<template>
  <div class="daily-balance-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">收款汇总日报表</span>
      </div>
      <div class="body-top screen-info-wrapper">
        <div class="screen-form">
          <Form :label-width="80"
                ref="form"
                :model="formData"
                style="flex:1"
                inline>
            <FormItem label="日结人"
                      prop="boSettleManID">
              <Select v-model="formData.boSettleManID"
                      :label-in-value="true"
                      @on-change="changePerson"
                      filterable
                      size="small"
                      style="width:150px;"
                      :disabled="!showAll">
                <!-- <Option value="all"
                        label="全部">全部</Option> -->
                <Option v-for="item in receiverList"
                        :value="item.doctorId"
                        :key="item.doctorId">{{item.doctorName}}</Option>
              </Select>
            </FormItem>
            <FormItem label="报表类型"
                      prop="isYB">
              <Select v-model="formData.isYB"
                      size="small"
                      @on-change="changeExcelType"
                      style="width:200px;">
                <Option :value="0">当面付</Option>
                <Option :value="1">医保支付</Option>
              </Select>
            </FormItem>
            <FormItem prop="getMoneyTime"
                      label="日结时间">
              <DatePicker type="date"
                          style="max-width:180px;"
                          placeholder="日结时间"
                          size="small"
                          @on-change="changeCountDay"
                          v-model="formData.getMoneyTime"></DatePicker>
            </FormItem>
            <FormItem label="日结时间点"
                      prop="timing"
                      :label-width="100">
              <Select v-model="formData.timing"
                      size="small"
                      style="width:200px;">
                <Option v-for="(item,index) in timingList"
                        :value="item.dailyTime"
                        @click.native="dailyTimeChange(item)"
                        :key="index">{{item.dailyTime}}</Option>
              </Select>
            </FormItem>

            <!-- <Button style="margin-left:30px;"
                    type="primary"
                    @click="search">筛选</Button>
            <Button style="margin-left:10px;"
                    @click="refSeachList">清除筛选条件</Button>
            <Button style="margin-left:20px;"
                    type="primary"
                    @click="print"
                    v-permission="['print']">打印</Button> -->
          </Form>
          <div class="handle-wrapper">
            <div><Button style="margin-left: 8px;width: 126px;"
                      @click="refSeachList">清除筛选条件</Button></div>
            <div>
              <Button style="margin-left: 8px;"
                      type="primary"
                      @click="search">筛选</Button>
              <Button style="margin-left: 8px;"
                      type="primary"
                      @click="print"
                      v-permission="['print']">打印</Button>
            </div>

          </div>
        </div>

      </div>

      <div class="body-main page-body">
        <div class="top-date">
          <span v-if="list.receiptTimeS">收据时间：{{list.receiptTimeS}} ~ {{list.receiptTimeE}}</span>
          <span v-else>收据时间：</span>
          <span style="margin-left: 20px;">结账时间：{{list.dailyTime}}</span>
          <span style="margin-left: 20px;">交款确认序号：</span>
        </div>
        <vxe-grid border
                  size="small"
                  align="center"
                  :auto-resize="true"
                  :columns="tableColumn"
                  :data="tableData"
                  :loading="isLoading"></vxe-grid>
        <Row class="detail-table-header">
          <Col span="4"
               class="detail-table-cell">项目名称</Col>
          <Col span="4"
               class="detail-table-cell">金额</Col>
          <Col span="4"
               class="detail-table-cell">项目名称</Col>
          <Col span="4"
               class="detail-table-cell">金额</Col>
          <Col span="4"
               class="detail-table-cell">项目名称</Col>
          <Col span="4"
               class="detail-table-cell">金额</Col>
        </Row>
        <Row class="detail-table-body">
          <Col span="24"
               class="detail-table-cell"
               v-if="!detailTableData.length">暂无数据</Col>
          <Col span="8"
               v-for="(item, index) in detailTableData"
               :key="index">
          <Row>
            <Col span="12"
                 class="detail-table-cell">{{item.name}}</Col>
            <Col span="12"
                 class="detail-table-cell">{{item.money}}</Col>
          </Row>
          </Col>
        </Row>
        <Row class="detail-table-footer">
          <Col span="4"
               class="detail-table-cell">合计</Col>
          <Col span="4"
               class="detail-table-cell">{{list.feeDetailTotal? '￥' + list.feeDetailTotal : '&nbsp;'}}</Col>
          <Col span="4"
               class="detail-table-cell">大写</Col>
          <Col span="12"
               class="detail-table-cell">{{list.feeDetailTotalCN? list.feeDetailTotalCN : '&nbsp;'}}</Col>
        </Row>
        <Row style="font-weight:bold; margin-top:10px;">
          <Col span="4">总金额：</Col>
          <Col span="4">&nbsp;{{list.allFeeTotal}}</Col>
          <Col span="4">实收金额：</Col>
          <Col span="4">&nbsp;{{list.realFee}}</Col>
          <Col span="4">实收现金</Col>
          <Col span="4">&nbsp;{{list.realCash}}</Col>
        </Row>
        <Row>
          <Col span="4">微信支付：</Col>
          <Col span="4">&nbsp;{{list.wxPayTotal}}</Col>
          <Col span="4">其他医疗：</Col>
          <Col span="4">&nbsp;{{list.otherPayTotal}}</Col>
          <Col span="4">货币误差:</Col>
          <Col span="4">&nbsp;{{list.errPayTotal}}</Col>
        </Row>
        <Row>
          <Col span="4">支付宝支付：</Col>
          <Col span="4">&nbsp;{{list.zfbPayTotal}}</Col>
          <Col span="4">银联金额：</Col>
          <Col span="4">&nbsp;{{list.unionPayTotal}}</Col>
          <Col span="4">支票金额：</Col>
          <Col span="4">&nbsp;{{list.checkPayTotal}}</Col>
        </Row>
        <Row style="border-bottom: 2px dashed #eee;">
          <Col span="4">区医保支付：</Col>
          <Col span="4">&nbsp;{{list.qybPayTotal}}</Col>
          <Col span="4">市医保支付：</Col>
          <Col span="4">&nbsp;{{list.sybPayTotal}}</Col>
        </Row>
        <Row style="margin-top:10px;">
          <Col span="4"
               style="font-weight:bold;">市医保接口相关：</Col>
          <Col span="4">&nbsp;</Col>
          <Col span="4">市医保统筹支付：</Col>
          <Col span="4">&nbsp;</Col>
          <Col span="4">大病互助支付：</Col>
          <Col span="4">&nbsp;</Col>
        </Row>
        <Row>
          <Col span="4">残疾军人补助支付：</Col>
          <Col span="4">&nbsp;</Col>
          <Col span="4">公务员补助支付：</Col>
          <Col span="4">&nbsp;</Col>
          <Col span="4">医疗救助支付:</Col>
          <Col span="4">&nbsp;</Col>
        </Row>
        <Row style="border-bottom: 2px dashed #eee;">
          <Col span="4">市医保账户支付：</Col>
          <Col span="4">&nbsp;</Col>
          <Col span="4">市医保代支支付：</Col>
          <Col span="4">&nbsp;</Col>
          <Col span="4">再报销支付：</Col>
          <Col span="4">&nbsp;</Col>
        </Row>
        <Row style="border-bottom: 2px dashed #eee; margin-top:10px;">
          <Col span="3">会计：</Col>
          <Col span="3">&nbsp;</Col>
          <Col span="3">出纳：</Col>
          <Col span="3">&nbsp;</Col>
          <Col span="3">复核：</Col>
          <Col span="3">&nbsp;</Col>
          <Col span="3">缴款人：</Col>
          <Col span="3">{{list.dailyMan}}</Col>
        </Row>
        <Row style="margin-top:10px;">
          <Col span="3">退费发票：</Col>
          <Col span="3">{{list.backTotal}} 张</Col>
          <Col span="3">金额：</Col>
          <Col span="3">{{list.backPayTotal}}</Col>
        </Row>
        <vxe-table style="margin-top:10px;"
                   ref="refundTable"
                   align="center"
                   size="small"
                   :auto-resize="true"
                   highlight-hover-row
                   :data="refundTableData"
                   :loading="isLoading">
          <vxe-table-column field="invoiceNo"
                            title="发票号码"></vxe-table-column>
          <vxe-table-column field="createTime"
                            title="收费时间"></vxe-table-column>
          <vxe-table-column field="backFeeMan"
                            title="退费人"></vxe-table-column>
          <vxe-table-column field="backFee"
                            title="退费金额"></vxe-table-column>
          <vxe-table-column field="backTime"
                            title="退费时间"></vxe-table-column>
          <vxe-table-column field="name"
                            title="病人姓名"></vxe-table-column>
        </vxe-table>
      </div>
    </Card>
  </div>
</template>
<script>
import moment from "moment";
import { getDayCount, printDailyChargeSummary } from "@/api/dailyBalance.js";
import { getDailyCount } from '@/api/balance_feeDayBalance.js'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'

export default {
  name: "dailyBalance",
  data () {
    return {
      formData: {
        boSettleManID: null,
        getMoneyTime: null,
        timing: null,
        isYB: 0
      },
      list: {}, // 存放日报表所有数据
      timingList: [], // 日结时间点列表
      tableColumn: [
        {
          title: '使用票据',
          children: [
            {
              field: 'invoiceNoS',
              title: '起',
            },
            {
              field: 'invoiceNoE',
              title: '止',
            },
          ]
        },
        {
          title: '张数',
          children: [
            {
              field: 'total',
              title: '总单据',
            },
            {
              field: 'useTotal',
              title: '有效',
            },
            {
              field: 'noUseTotal',
              title: '作废',
            },
            {
              field: 'backTotal',
              title: '退费',
            },
          ]
        },
        { field: 'printDate', title: '打印日期', showOverflow: true }
      ],
      tableData: [],  //页面中第一个表格
      detailTableData: [], //页面中第二个表格
      refundTableData: [], //页面中第三个表格
      isLoading: false,
      isDetailLoading: false,
      isRefundLoading: false,
      showAll: false,
      printLoading: false,
      curDailyTimeInfo: {} // 当前时间点信息
    };
  },
  created () {
    // 当天时间
    let curDate = moment().format('YYYY-MM-DD')
    // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
    this.$set(this.formData, 'getMoneyTime', curDate)
    let params = {
      deptName: '财务科',
      deptId: ''
    }
    this.$store.dispatch("getExamDoctorDict", { params, btn: true }).then(({ data }) => {
      if (JSON.stringify(data) !== '[]') {
        // 设置结算人id
        this.setClaimant()
        this.changeCountDay(curDate)
      }
    })
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
    receiverList: {
      get: function () {
        return this.$store.getters.getExamDoctorDict
      },
      set: function () { }
    }
  },
  methods: {
    // 判断登录账号是否为财务科中的人
    setClaimant () {
      let result = this.receiverList.some(item => {
        console.log(item.doctorId)
        return item.doctorId == this.userInfo.userId
      })
      // console.log(result)
      if (result) {
        this.formData.boSettleManID = this.userInfo.userId
        this.formData.boSettleMan = this.userInfo.poName
        this.showAll = false
      } else {
        this.formData.boSettleManID = this.receiverList[0].doctorId
        this.formData.boSettleMan = this.receiverList[0].doctorName
        this.showAll = true
      }
    },
    // 修改日结人
    changePerson (e) {
      console.log(e)
      if (e != undefined) {
        this.formData.boSettleManID = e.value
        this.formData.boSettleMan = e.label

        this.formData.timing = null
        this.timingList = []

        let params = {
          boSettleManID: e.value,
          date: moment(this.formData.getMoneyTime).format('YYYY-MM-DD'),
          isYB: (this.formData.isYB === 1 ? true : false)
        }
        getDailyCount(params).then(({ data }) => {
          console.log(data)
          if (data.code === 0) {
            if (JSON.stringify(data.data) != '[]') {
              this.timingList = data.data
              this.timingList.forEach(item => {
                item.dailyTime = moment(item.dailyTime).format('YYYY-MM-DD HH:mm:ss')
              })
              this.$set(this.formData, 'timing', this.timingList[0].dailyTime)
              this.curDailyTimeInfo = this.timingList[0]
            }
          } else {
            this.$Message.error(data.message);
          }
        }).catch(err => {
          console.log(err)
          this.$Message.error("网络不稳定，请稍后重试");
        })
      }
    },

    // 修改报表类型
    changeExcelType (e) {
      console.log(e)
      if (e != undefined) {
        this.formData.timing = null
        this.timingList = []

        let params = {
          boSettleManID: this.formData.boSettleManID,
          date: moment(this.formData.getMoneyTime).format('YYYY-MM-DD'),
          isYB: (this.formData.isYB === 1 ? true : false)
        }
        getDailyCount(params).then(({ data }) => {
          console.log(data)
          if (data.code === 0) {
            if (JSON.stringify(data.data) != '[]') {
              this.timingList = data.data
              this.timingList.forEach(item => {
                item.dailyTime = moment(item.dailyTime).format('YYYY-MM-DD HH:mm:ss')
              })
              this.$set(this.formData, 'timing', this.timingList[0].dailyTime)
              this.curDailyTimeInfo = this.timingList[0]
            }
          } else {
            this.$Message.error(data.message);
          }
        }).catch(err => {
          console.log(err)
          this.$Message.error("网络不稳定，请稍后重试");
        })
      }
    },

    // 修改日结时间
    changeCountDay (e) {
      console.log(e)
      // 清空日结时间点
      this.formData.timing = null
      this.timingList = []

      let params = {
        boSettleManID: this.formData.boSettleManID,
        date: e,
        isYB: (this.formData.isYB === 1 ? true : false)
      }
      getDailyCount(params).then(({ data }) => {
        console.log(data)
        if (data.code === 0) {
          if (JSON.stringify(data.data) != '[]') {
            this.timingList = data.data
            this.timingList.forEach(item => {
              item.dailyTime = moment(item.dailyTime).format('YYYY-MM-DD HH:mm:ss')
            })
            this.$set(this.formData, 'timing', this.timingList[0].dailyTime)
            this.curDailyTimeInfo = this.timingList[0]
          }
        } else {
          this.$Message.error(data.message);
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error("网络不稳定，请稍后重试");
      })
    },

    // 更改时间点
    dailyTimeChange (item) {
      this.curDailyTimeInfo = item
    },

    refSeachList () {
      this.setClaimant()
      this.formData.getMoneyTime = moment().format('YYYY-MM-DD')
      this.formData.timing = null
      this.formData.isYB = 0
      this.list = []
      this.tableData = []
      this.detailTableData = []
      this.refundTableData = []
    },
    search () {
      // 清空日报表数据
      this.tableData = []
      this.list = []
      this.refundTableData = []
      this.detailTableData = []
      if (!this.formData.timing) return false
      if (this.isLoading) return false
      this.isLoading = true
      let params = {
        dailyId: this.formData.boSettleManID,
        boDailyCode: this.curDailyTimeInfo.dailyCode
      }
      getDayCount(params).then(({ data }) => {
        console.log(data)
        this.isLoading = false
        if (data.code === 0) {
          this.list = data.data
          this.tableData.push(data.data)
          this.detailTableData = data.data.feeDetailList
          this.refundTableData = data.data.backDetailList
        } else {
          this.$Message.error(data.message);
        }
      }).catch(err => {
        console.log(err)
        this.isLoading = false
        this.$Message.error("网络不稳定，请稍后重试");
      })
    },
    // 日报表打印
    print () {
      if (!printNotice()) return false
      if (JSON.stringify(this.list) === '{}') {
        this.$Message.error('不可打印无数据的日报表');
        return false
      }
      if (this.printLoading) return false
      this.printLoading = true;
      printDailyChargeSummary(this.list).then(({ data }) => {
        if (data.code == 0) {
          let printParams = {
            guideUrl: this.$url + data.data,
            selGroup: ['printGuide'],
            taskName: '日报表'
          }
          printMethods(printParams.guideUrl, printParams)
        } else {
          this.$Message.error(data.message);
        }
        this.printLoading = false;
      }).catch(err => {
        console.log(err)
        this.printLoading = false;
        this.$Message.error("网络不稳定，请稍后重试");
      });
    }
  }
};
</script>
<style lang="less">
.daily-balance-wrapper {
  width: 100%;
  min-width: 800px;
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
    margin-bottom: 0px !important;
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
  .body-top {
    display: flex;
    padding-bottom: 15px;
  }
  .screen-info-wrapper {
    padding-bottom: 15px;
    .code-search-input {
      display: flex;
      align-items: center;
      min-width: 180px;
      flex-shrink: 0;
    }
    .screen-form {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ivu-form-item {
        margin-bottom: 0px !important;
      }
    }
    .handle-wrapper {
      width: 200px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      flex-direction: column;
      > div {
        display: flex;
        margin-top: 10px;
        justify-content: center;
      }
    }
  }
  .body-main {
    .pd10 {
      padding: 10px;
    }
    .top-date {
      padding: 8px;
      font-size: 14px;
    }
    .detail-table-footer,
    .detail-table-header,
    .detail-table-body {
      text-align: center;
      font-size: 13.5px;
    }
    .detail-table-header {
      font-weight: bold;
      background-color: #f8f8f9;
    }
    .detail-table-cell {
      border: 1px solid #eee;
      padding: 10px 0;
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
