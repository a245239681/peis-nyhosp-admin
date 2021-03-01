<template>
  <div class="workload-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">门诊收费员工作量统计</span>
      </div>
      <div class="body-top">
        <Form :label-width="80"
              ref="form"
              :model="formData"
              inline>
          <Row :gutter="16"
               type="flex">
            <!-- <FormItem prop="getMoneyTimeS"
                      label="日结时间"
                      style="margin-right:0">
              <DatePicker type="date"
                          style="max-width:180px;"
                          :editable="false"
                          @on-change="setDeadline"
                          placeholder="开始时间"
                          size="small"
                          v-model="formData.getMoneyTimeS"></DatePicker>
            </FormItem>
            <FormItem prop="getMoneyTimeE"
                      label="到"
                      :label-width="30">
              <DatePicker type="date"
                          style="max-width:180px;"
                          :editable="false"
                          size="small"
                          v-model="formData.getMoneyTimeE"
                          :options="bookingStartTime"
                          placeholder="截止时间"></DatePicker>
            </FormItem> -->
            <FormItem label="日结时间">
              <DatePicker type="daterange"
                          :value="daterangeValue"
                          size="small"
                          split-panels
                          placement="bottom-start"
                          placeholder="请选择日结时间范围"
                          @on-change="searchByDaterange"
                          style="width: 240px;"></DatePicker>
            </FormItem>
            <FormItem label="日结人"
                      prop="boSettleManID">
              <Select v-model="formData.boSettleManID"
                      :label-in-value="true"
                      @on-change="changePerson"
                      :disabled="!showAll"
                      filterable
                      size="small"
                      style="width:150px;">
                <Option value="all"
                        label="全部">全部</Option>
                <Option v-for="item in receiverList"
                        :value="item.doctorId"
                        :key="item.doctorId">{{item.doctorName}}</Option>
              </Select>
            </FormItem>
            <Button style="margin-left:30px;"
                    type="primary"
                    @click="search">筛选</Button>
            <Button style="margin-left:10px;"
                    @click="refSeachList">清除筛选条件</Button>
            <Button style="margin-left:20px;"
                    type="primary"
                    @click="print"
                    v-permission="['print']">打印</Button>

          </Row>
        </Form>
      </div>
      <!-- height="400" -->
      <div class="body-main page-body">
        <vxe-table class="mytable-footer"
                   ref="workloadTable"
                   border
                   stripe
                   :auto-resize="true"
                   highlight-hover-row
                   show-footer
                   :footer-method="footerMethod"
                   :data="tableData"
                   :loading="isLoading">
          <vxe-table-column field="name"
                            title="姓名"
                            width="200"></vxe-table-column>
          <vxe-table-column field="invoiceTotal"
                            title="发票张数"></vxe-table-column>
          <vxe-table-column field="cash"
                            title="现金金额"></vxe-table-column>
          <vxe-table-column field="unionPay"
                            title="银联金额"></vxe-table-column>
          <vxe-table-column field="aliPay"
                            title="支付宝金额"></vxe-table-column>
          <vxe-table-column field="weChat"
                            title="微信金额"></vxe-table-column>
          <vxe-table-column field="medicare"
                            title="医保金额"></vxe-table-column>
          <vxe-table-column field="totalMoney"
                            title="总计金额"></vxe-table-column>
        </vxe-table>
      </div>
    </Card>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import moment from "moment";
import { getWorkload, printWorkload } from "@/api/workload.js";
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'

export default {
  name: "financialWorkload",
  data () {
    return {
      formData: {
        // getMoneyTimeS: "",
        // getMoneyTimeE: "",
        boSettleManID: "all"
      },
      tableData: [],
      daterangeValue: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      getData: [],  //用于传给后台，无多余自动添加XID参数，避免接口报错
      // bookingStartTime: {},
      showAll: false,
      printLoading: false,
      isLoading: false,
    };
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
  created () {
    let curDate = moment().format('YYYY-MM-DD')
    // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
    // this.$set(this.formData, 'getMoneyTimeS', curDate)
    // this.$set(this.formData, 'getMoneyTimeE', curDate)
    let params = {
      deptName: '财务科',
      deptId: ''
    }
    this.$store.dispatch("getExamDoctorDict", { params, btn: true }).then(({ data }) => {
      if (JSON.stringify(data) !== '[]') {
        // 设置结算人id
        this.setClaimant()
        this.search()
      }
    })
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
        this.formData.boSettleManID = 'all'
        this.showAll = true
      }
    },
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['invoiceTotal', 'cash', 'unionPay', 'aliPay', 'weChat', 'medicare', 'totalMoney'].includes(column.property)) {
            return XEUtils.sum(data, column.property).toFixed(2)
          }
          return null
        }),
      ]
    },
    changePerson (e) {
      console.log(e)
      if (e) {
        this.formData.boSettleManID = e.value
        this.formData.boSettleMan = e.label
      }
    },
    search () {
      console.log(this.formData)
      if (this.isLoading) return false;
      this.isLoading = true;
      let params = {
        dailyId: this.formData.boSettleManID == 'all' ? '' : this.formData.boSettleManID,
        dailyTimeS: moment(this.formData.getMoneyTimeS).format('YYYY-MM-DD'),
        dailyTimeE: moment(this.formData.getMoneyTimeE).format('YYYY-MM-DD')
      }
      getWorkload(params).then(({ data }) => {
        console.log('拿到的data数据')
        console.log(data)
        // JSON 数据深拷贝，解决vxe-table自动加上_XID参数，后端不接收该参数
        if (data.code == 0) {
          let arr = []
          for (let x in data.data) {
            let json = data.data[x];
            arr.push(JSON.parse(JSON.stringify(json)));
          }
          this.getData = data.data;
          this.tableData = arr;
        } else {
          this.$Message.error(data.message);
        }
        this.isLoading = false;
        console.log('表格数据')
        console.log(this.tableData)
        console.log('临时数据')
        console.log(this.getData)
      }).catch(err => {
        console.log(err)
        this.tableData = [];
        this.isLoading = false;
        this.$Message.error("网络不稳定，请稍后重试");
      })
    },
    refSeachList () {
      // this.formData.getMoneyTimeS = moment().format('YYYY-MM-DD');
      // this.formData.getMoneyTimeE =moment().format('YYYY-MM-DD') moment().format('YYYY-MM-DD');
      this.setClaimant()
      // this.bookingStartTime.disabledDate = function () {
      //   return false;
      // };
      let curDate = moment().format('YYYY-MM-DD')
      this.daterangeValue = [curDate, curDate]
      this.tableData = []
      this.getData = []
    },
    // setDeadline (e) {
    //   this.formData.getMoneyTimeE = "";
    //   if (this.formData.getMoneyTimeS) {
    //     this.bookingStartTime.disabledDate = function (date) {
    //       return date && date.valueOf() < new Date(e) - 86400000;
    //     };
    //   } else {
    //     this.bookingStartTime.disabledDate = function (date) {
    //       return false;
    //     };
    //   }
    // },
    // 工作量打印
    print () {
      if (!printNotice()) return false
      if (JSON.stringify(this.getData) === '[]') {
        this.$Message.error('不可打印无数据的统计表');
        return false
      }
      if (this.printLoading) return false
      this.printLoading = true;
      let dateRange = {
        startTime: moment(this.formData.getMoneyTimeS).format('YYYY-MM-DD'),
        endTime: moment(this.formData.getMoneyTimeE).format('YYYY-MM-DD'),
      }
      printWorkload(dateRange, this.getData).then(({ data }) => {
        if (data.code == 0) {
          let printParams = {
            guideUrl: this.$url + data.data,
            selGroup: ['printGuide'],
            taskName: '工作量'
          }
          printMethods(printParams.guideUrl, printParams)
        } else {
          this.$Message.error(data.message);
        }
        this.printLoading = false;
      }).catch(err => {
        this.printLoading = false;
        this.$Message.error("网络不稳定，请稍后重试");
      })
    },
    searchByDaterange (daterange) {
      console.log(daterange)
      this.createDateS = daterange[0]
      this.createDateE = daterange[1]
      this.$set(this.formData, 'getMoneyTimeS', daterange[0])
      this.$set(this.formData, 'getMoneyTimeE', daterange[1])
    },
  }
};
</script>
<style lang="less">
.workload-wrapper {
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
    width: 100%;
    display: flex;
    padding-bottom: 15px;
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
