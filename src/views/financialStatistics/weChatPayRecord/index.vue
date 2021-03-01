<template>
  <div class="wechat-pay-record-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">小程序支付记录</span>
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
                  ref="form"
                  inline
                  style="flex:1"
                  :label-width="60">
              <FormItem label="支付日期"
                        :label-width="80">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.wxSuccessTimeStart"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.wxSuccessTimeEnd"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="支付交易号"
                        :label-width="95">
                <Input v-model="form.wxOrderId"
                       style="width:135px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="姓名"
                        :label-width="50">
                <Input v-model="form.contactsName"
                       style="width:135px"
                       size="small"
                       clearable />
              </FormItem>
            </Form>
            <div class="handle-wrapper">
              <div><Button style="margin-left: 8px;width: 126px;"
                        type="primary"
                        v-permission="['leadingOut']"
                        :loading="leadoutLoading"
                        @click="leadoutExcelHandle">导出为表格</Button></div>
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
          <div class="search-info">费用笔数：<span>{{totalNum}}</span>，
            合计金额：<span>{{totalPrice}}</span></div>
          <vxe-table class="mytable-footer"
                     ref="workloadTable"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :height="(screenHeight - 400) <= 350 ? 350 : (screenHeight - 400)"
                     :data="tableData"
                     align="center"
                     :loading="isLoading">
            <vxe-table-column field="orderCode"
                              title="订单号"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="wxOrderId"
                              min-width="140"
                              title="交易单号"></vxe-table-column>
            <vxe-table-column field="payPriceStr"
                              width="120"
                              title="支付金额（元）"></vxe-table-column>
            <vxe-table-column field="payType"
                              title="支付方式"
                              width="120">
              <template v-slot="{row}">
                <span v-if="row.payType == 1">微信</span>
                <span v-else-if="row.payType == 2">支付宝</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="wxSuccessTime"
                              title="支付时间"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="contactsName"
                              title="体检人"
                              width="100"></vxe-table-column>
            <vxe-table-column field="payStatus"
                              title="支付状态"
                              width="120">
              <template v-slot="{row}">
                <Tag color="red"
                     v-if="row.payStatus == 1">未缴费</Tag>
                <Tag color="blue"
                     v-else-if="row.payStatus == 2">已缴费</Tag>
                <Tag color="orange"
                     v-else-if="row.payStatus == 3">退费中</Tag>
                <Tag color="green"
                     v-else-if="row.payStatus == 4">已退费</Tag>
                <Tag color="gray"
                     v-else-if="row.payStatus == 5">已关闭</Tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="actions"
                              title="操作"
                              fixed="right"
                              width="140">
              <template v-slot="{row}">
                <Button type="default"
                        style="margin-left: 8px;"
                        @click="edit(row.orderId)"
                        size="small">查看详情</Button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
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
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import Edit from './edit.vue'
import { wechatPayRecord, payRecordLeadout } from '@/api/weChatPayRecord'
import moment from 'moment'

export default {
  name: 'weChatPayRecord',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {},
      tableData: [],
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      totalPrice: 0, // 合计金额
      totalNum: 0, // 费用笔数
      leadoutLoading: false,
      editModalVisible: false,

    }
  },
  components: {
    Edit
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
    // 体检类型列表
    categoryList: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
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
    this.$store.dispatch('getCategoryDict')
    let curDate = moment().format('YYYY-MM-DD')

    this.$set(this.form, 'wxSuccessTimeStart', curDate)
    this.$set(this.form, 'wxSuccessTimeEnd', curDate)
    this.getList()
  },
  methods: {
    // 获取支付记录列表
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 格式化时间
      let _wxSuccessTimeStart = this.form.wxSuccessTimeStart != '' ? moment(this.form.wxSuccessTimeStart).format('YYYY-MM-DD') : ''
      let _wxSuccessTimeEnd = this.form.wxSuccessTimeEnd != '' ? moment(this.form.wxSuccessTimeEnd).format('YYYY-MM-DD') : ''
      const params = Object.assign({}, this.form)
      params.wxSuccessTimeStart = _wxSuccessTimeStart
      params.wxSuccessTimeEnd = _wxSuccessTimeEnd
      this.isLoading = true
      wechatPayRecord(pagination, params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalPrice = data.totalPrice
          this.totalNum = data.totalNum
          this.totalSize = data.data.total
        } else {
          this.tableData = []
          this.totalPrice = 0
          this.totalNum = 0
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    edit (id) {
      this.editModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(id)
      })
    },

    // 导出为Excel表格
    async leadoutExcelHandle () {
      if (this.leadoutLoading) return
      if (this.tableData.length <= 0) {
        this.$Message.warning('没有需要导出的数据')
        return false
      }

      // 格式化时间
      let _wxSuccessTimeStart = this.form.wxSuccessTimeStart != '' ? moment(this.form.wxSuccessTimeStart).format('YYYY-MM-DD') : ''
      let _wxSuccessTimeEnd = this.form.wxSuccessTimeEnd != '' ? moment(this.form.wxSuccessTimeEnd).format('YYYY-MM-DD') : ''
      const params = Object.assign({}, this.form)
      params.wxSuccessTimeStart = _wxSuccessTimeStart
      params.wxSuccessTimeEnd = _wxSuccessTimeEnd

      this.leadoutLoading = true
      try {
        const { data } = await payRecordLeadout(params)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: "application/vnd.ms-excel" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "小程序支付记录统计.xls";
        link.click();
        this.$Message.success('操作成功')
      } catch (err) {
        this.leadoutLoading = false
        this.$Message.error(err.message)
      } finally {
      }
    },

    // 重置
    resetHandle () {
      this.form = {}
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'wxSuccessTimeStart', curDate)
      this.$set(this.form, 'wxSuccessTimeEnd', curDate)
      this.tableData = []
    },

    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    },

    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod ({ row, $rowIndex, column, data }) {
      const fields = ['doctorId', 'checkDoctorName', 'countPrice']
      const cellValue = XEUtils.get(row, column.property)
      console.log(cellValue)
      if (cellValue && fields.includes(column.property)) {
        const prevRow = data[$rowIndex - 1]
        let nextRow = data[$rowIndex + 1]
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
            nextRow = data[++countRowspan + $rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    }
  }
}
</script>
<style lang="less">
.wechat-pay-record-wrapper {
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
