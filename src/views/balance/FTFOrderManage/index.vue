<template>
  <div class="face-to-face-order-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">当面付订单管理</span>
      </div>
      <div class="page-body clearfix">
        <div class="screen-info-wrapper">
          <div class="screen-form">
            <Form :model="form"
                  label-position="right"
                  ref="form"
                  inline
                  style="flex:1;max-width: 1300px;"
                  :label-width="60">
              <FormItem label="订单状态"
                        prop="orderStatus"
                        :label-width="80">
                <Select v-model="form.orderStatus"
                        @on-change="orderStatusChange"
                        style="min-width: 140px;"
                        clearable
                        size="small">
                  <Option value="">全部</Option>
                  <Option value="3">支付中</Option>
                  <Option value="1">已完成</Option>
                  <Option value="2">已退费</Option>
                </Select>
              </FormItem>
              <FormItem label="发票状态"
                        prop="invoiceStatus"
                        :label-width="80">
                <Select v-model="form.invoiceStatus"
                        @on-change="invoiceStatusChange"
                        clearable
                        style="min-width: 140px;"
                        size="small">
                  <Option value="">全部</Option>
                  <Option value="1">已开票</Option>
                  <Option value="0">未开票</Option>
                </Select>
              </FormItem>
              <FormItem label="支付方式"
                        prop="payType"
                        :label-width="80">
                <Select v-model="form.payType"
                        style="min-width: 140px;"
                        @on-change="payTypeChange"
                        clearable
                        size="small">
                  <Option value="">全部</Option>
                  <Option value="微信支付">微信支付</Option>
                  <Option value="支付宝支付">支付宝支付</Option>
                  <Option value="现金支付">现金支付</Option>
                  <Option value="银联支付">银联支付</Option>
                  <Option value="市医保支付">市医保支付</Option>
                  <Option value="区医保支付">区医保支付</Option>
                </Select>
              </FormItem>
              <FormItem label="交易时间"
                        :label-width="80"
                        prop="startDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.startDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="至"
                        :label-width="36"
                        prop="endDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.endDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="体检者姓名"
                        :label-width="90"
                        prop="peName">
                <Input v-model="form.peName"
                       style="width:130px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="收费员"
                        :label-width="80"
                        prop="name">
                <Input v-model="userInfo.poName"
                       style="width:140px"
                       size="small"
                       disabled />
              </FormItem>

            </Form>
            <div class="handle-wrapper">
              <div>
                <Button style="margin-left: 8px;"
                        type="default"
                        @click="resetHandle">重置</Button>
                <Button style="margin-left: 8px;"
                        type="primary"
                        @click="getList()"
                        :loading="isLoading">查询</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <vxe-table class="mytable-footer"
                     ref="workloadTable"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     align="center"
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :height="(screenHeight - 360) <= 350 ? 350 : (screenHeight - 360)"
                     :data="tableData"
                     :seq-config="{startIndex: 0}"
                     :loading="isLoading">
            <vxe-table-column type="seq"
                              title="序号"
                              width="55"></vxe-table-column>
            <vxe-table-column field="orderNo"
                              title="订单号"
                              min-width="140"></vxe-table-column>
            <vxe-table-column field="orderStatus"
                              title="订单状态"
                              min-width="120">
              <template v-slot="{row}">
                <span v-if="row.orderStatus == 1">已完成</span>
                <span v-else-if="row.orderStatus == 2">已退费</span>
                <span v-else-if="row.orderStatus == 3">支付中</span>
                <span v-else></span>
              </template>

            </vxe-table-column>
            <vxe-table-column field="payType"
                              title="支付方式"
                              width="120"></vxe-table-column>
            <vxe-table-column field="tradeNo"
                              title="交易号"
                              show-overflow="title"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="peName"
                              title="体检者姓名"
                              show-overflow="title"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="paymentAmount"
                              title="交易金额（元）"
                              show-overflow="title"
                              min-width="120">
              <template v-slot="{row}">
                <span>{{row.paymentAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="invoiceNo"
                              title="发票号"
                              show-overflow="title"
                              min-width="140"></vxe-table-column>
            <vxe-table-column field="userName"
                              title="收费员"
                              show-overflow="title"
                              min-width="100"></vxe-table-column>
            <vxe-table-column field="createDate"
                              title="交易时间"
                              width="160"
                              :formatter="formatTime"></vxe-table-column>
          </vxe-table>
          <div class="pagination-wrapper">
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
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { faceTofaceOrderList } from '@/api/FTFOrderManage'
import XEUtils from 'xe-utils'
import moment from 'moment'

export default {
  name: 'FTFOrderManage',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        orderStatus: '',
        invoiceStatus: '',
        payType: ''
      },
      tableData: [],
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20
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
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
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

    this.$set(this.form, 'startDate', curDate)
    this.$set(this.form, 'endDate', curDate)
  },
  methods: {
    // 获取总检医生工作量统计列表
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 格式化时间
      this.form.startDate = this.form.startDate != '' ? moment(this.form.startDate).format('YYYY-MM-DD') : ''
      this.form.endDate = this.form.endDate != '' ? moment(this.form.endDate).format('YYYY-MM-DD') : ''
      this.isLoading = true

      let params = Object.assign({}, this.form)
      params.userId = this.userInfo.userId

      faceTofaceOrderList(pagination, params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalSize = data.data.total
        } else {
          this.tableData = []
          this.totalSize = 0
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 更改订单状态
    orderStatusChange (val) {
      if (val !== undefined && val != '') {
        this.form.orderStatus = val
      } else {
        this.form.orderStatus = ''
      }
    },

    // 更改发票状态
    invoiceStatusChange (val) {
      if (val !== undefined && val != '') {
        this.form.invoiceStatus = val
      } else {
        this.form.invoiceStatus = ''
      }
    },


    // 重置
    resetHandle () {
      this.form = {
        orderStatus: '',
        invoiceStatus: '',
        payType: ''
      }
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate)
      this.$set(this.form, 'endDate', curDate)
      this.totalSize = 0
      this.tableData = []
    },

    // 修改支付状态
    payTypeChange (val) {
      if (val !== undefined && val != '') {
        this.form.payType = val
      } else {
        this.form.payType = ''
      }
    },

    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    },
    formatTime ({ cellValue, row, column }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}
</script>
<style lang="less">
.face-to-face-order-manage-wrapper {
  width: 100%;
  min-width: 1300px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-group {
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
  .screen-info-wrapper {
    padding-bottom: 15px;
    .code-search-input {
      display: flex;
      align-items: center;
      min-width: 180px;
      flex-shrink: 0;
    }
    .screen-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ivu-form-item {
        margin-bottom: 0px !important;
      }
    }
  }
  .table-wrapper {
    .search-info {
      line-height: 1.8;
      font-weight: bold;
      color: #252525;
      margin-bottom: 10px;
      span {
        color: #40a9ff;
      }
    }
  }
  .handle-wrapper {
    width: 200px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    > div {
      display: flex;
      margin-top: 10px;
      justify-content: center;
    }
  }
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
  }
  .table-row {
    color: #252525;
  }
  .page-body {
    padding-bottom: 0px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-cascader {
    line-height: 32px;
  }
  .ivu-input[disabled] {
    background-color: #f3f3f3 !important;
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
}
</style>
