<template>
  <div class="bill-query-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">发票查询</span>
        <!-- <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 240px"
                 v-model="keyword"
                 @on-search="getItemList()"
                 placeholder="请搜索姓名或证件号码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新建档案</Button>
        </div> -->
      </div>
      <div class="page-body clearfix">
        <div class="screen-info-wrapper">
          <div class="screen-form">
            <Form :model="form"
                  label-position="right"
                  ref="formElement"
                  inline
                  style="flex:1"
                  :label-width="60">
              <FormItem label="发票号码"
                        :label-width="80">
                <Input v-model="form.invoiceNoStart"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="至"
                        :label-width="36">
                <Input v-model="form.invoiceNoEnd"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="姓名"
                        :label-width="80">
                <Input v-model="form.patientName"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="支付方式"
                        :label-width="80">
                <Select v-model="form.paymentType"
                        size="small"
                        style="width:140px"
                        clearable>
                  <Option :value="item.boName"
                          v-for="item in payMethodsList"
                          :key="item.boId">{{ item.boName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="收费时间"
                        :label-width="80">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.chargeTimeStart"
                            format="yyyy-MM-dd"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="至"
                        :label-width="36">
                <DatePicker type="date"
                            style="width:140px"
                            format="yyyy-MM-dd"
                            v-model="form.chargeTimeEnd"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="收款人"
                        :label-width="80">
                <Input v-model="form.operatorName"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="发票状态"
                        :label-width="80"
                        prop="orderCode">
                <Select v-model="form.transactType"
                        size="small"
                        style="width:140px"
                        clearable>
                  <Option value="结算">结算</Option>
                  <Option value="退费">退费</Option>
                  <Option value="作废">作废</Option>
                </Select>
              </FormItem>
            </Form>
            <div class="handle-wrapper">
              <div><Button style="margin-left: 8px;width: 126px;"
                        type="primary"
                        @click="getList()"
                        :loading="isLoading">查询</Button></div>
              <div>
                <Button style="margin-left: 8px;width: 126px;"
                        type="default">重置</Button>
              </div>

            </div>
          </div>
        </div>
        <Tabs v-model="form.invoiceType"
              @on-click="billTypeChange">
          <TabPane label="全部"
                   name="0"></TabPane>
          <TabPane label="线下发票"
                   name="1"></TabPane>
          <TabPane label="线上小程序"
                   name="3"></TabPane>
          <TabPane label="单位发票"
                   name="2"></TabPane>

        </Tabs>
        <div class="table-wrapper">
          <vxe-table class="mytable-footer"
                     ref="xTree"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :height="(screenHeight - 360) <= 350 ? 350 : (screenHeight - 360)"
                     :data="tableData"
                     align="center"
                     :seq-config="{startIndex: 0}"
                     :loading="isLoading">
            <vxe-table-column type="seq"
                              title="序号"
                              width="55"></vxe-table-column>
            <vxe-table-column field="invoiceNo"
                              title="发票号码"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="patientName"
                              title="姓名"
                              width="120"></vxe-table-column>
            <vxe-table-column field="settleDate"
                              title="收费日期"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="paymentType"
                              title="支付方式"
                              width="140"></vxe-table-column>
            <vxe-table-column field="amount"
                              title="收费金额"
                              width="140"></vxe-table-column>
            <vxe-table-column field="operatorName"
                              title="收款员"
                              width="120"></vxe-table-column>
            <vxe-table-column field="invalidStatus"
                              title="作废"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.invalidDate ? '已作废' : '--'}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="invalidDate"
                              title="作废日期"
                              min-width="160">
              <template v-slot="{row}">
                <span>{{row.invalidDate ? row.invalidDate : '--'}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="invalidName"
                              title="作废人"
                              width="120">
              <template v-slot="{ row }">
                <span>{{row.invalidName ? row.invalidName : '--'}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="action"
                              width="200"
                              fixed="right"
                              title="操作">
              <template v-slot="{ row }">
                <Button type="primary"
                        @click="newInvoiceHandle(row)"
                        v-if="!row.invalidDate"
                        size="small">新号重打</Button>
                <Button type="primary"
                        @click="invoiceHandle(row)"
                        v-if="!row.invalidDate"
                        style="margin-left: 8px;"
                        size="small">重打发票</Button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList()"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { billList } from '@/api/billQuery'
import { payMethods } from '@/api/personBalace'
import moment from 'moment'
import Edit from './edit'

export default {
  name: 'billQuery',
  components: {
    Edit
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        invoiceType: '0'
      },
      tableData: [],
      isLoading: false,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      payMethodsList: [], // 支付方式列表
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
    this.$set(this.form, 'chargeTimeStart', curDate)
    this.$set(this.form, 'chargeTimeEnd', curDate)
    this.getPayMethodsList()
    this.getList()
  },
  methods: {
    // 获取支付方式列表
    getPayMethodsList () {
      payMethods().then(({ data }) => {
        if (data.code == 0) {
          this.payMethodsList = data.data
        } else {
          this.payMethodsList = []
          this.$Message.error(data.message)
        }
      })
    },

    // 切换发票类型
    billTypeChange (name) {
      this.$set(this.form, 'invoiceType', name)
      this.getList()
    },

    // 获取发票订单列表
    getList () {
      // 格式化时间
      let _chargeTimeStart = this.form.chargeTimeStart != '' ? moment(this.form.chargeTimeStart).format('YYYY-MM-DD') : ''
      let _chargeTimeEnd = this.form.chargeTimeEnd != '' ? moment(this.form.chargeTimeEnd).format('YYYY-MM-DD') : ''
      const params = Object.assign({}, this.form)
      params.chargeTimeStart = _chargeTimeStart
      params.chargeTimeEnd = _chargeTimeEnd
      this.isLoading = true
      billList(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 新号重打
    newInvoiceHandle (row) {
      this.editModalVisible = true
      this.modalTitle = 0
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响

      let params = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.editwrapper.getInfo(params)

      })
    },

    // 重打发票
    invoiceHandle (row) {
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响

      let params = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.editwrapper.getInfo(params)

      })
    },

    // 重置
    resetHandle () {
      this.form = {
        invoiceType: '0'
      }
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'chargeTimeStart', curDate)
      this.$set(this.form, 'chargeTimeEnd', curDate)
      this.tableData = []
    }
  }
}
</script>
<style lang="less">
.bill-query-wrapper {
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
  .table-row {
    color: #252525;
  }
  .table-footer-row {
    font-weight: bold;
    color: #252525;
  }
  .page-body {
    padding-bottom: 0px;
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
}
</style>
