<template>
  <div class="wechat-bill-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">小程序订单发票管理</span>
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
              <FormItem label="下单时间"
                        :label-width="80"
                        prop="payTimeStart">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.payTimeStart"
                            format="yyyy-MM-dd"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="payTimeEnd">
                <DatePicker type="date"
                            style="width:140px"
                            format="yyyy-MM-dd"
                            v-model="form.payTimeEnd"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="姓名"
                        :label-width="80"
                        prop="patientName">
                <Input v-model="form.patientName"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="体检流水号"
                        :label-width="95"
                        prop="registerCode">
                <Input v-model="form.registerCode"
                       style="width:135px"
                       size="small"
                       clearable />
              </FormItem>

              <FormItem label="订单号"
                        :label-width="80"
                        prop="orderCode">
                <Input v-model="form.orderCode"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
            </Form>
            <div class="handle-wrapper">
              <div><Button style="margin-left: 8px;width: 126px;"
                        type="primary"
                        @click="getList()"
                        :loading="isLoading">查询订单</Button></div>
              <!-- <div>
                <Button style="margin-left: 8px;"
                        type="default"
                        @click="resetHandle">重置</Button>
                <Button style="margin-left: 8px;"
                        type="primary"
                        @click="getList"
                        :loading="isLoading">查询</Button>
              </div> -->

            </div>
          </div>
        </div>
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
                     :loading="isLoading">
            <vxe-table-column field="packageName"
                              title="体检套餐名称"
                              tree-node
                              min-width="200"></vxe-table-column>
            <vxe-table-column field="patientName"
                              title="体检人"
                              width="120"></vxe-table-column>
            <vxe-table-column field="orderCode"
                              title="订单号"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="orderPrice"
                              title="订单金额"
                              width="120"></vxe-table-column>
            <vxe-table-column field="invoiceNo"
                              title="发票号"
                              min-width="200">
              <template v-slot="{ row }">
                <span>{{row.invoiceNo ? row.invoiceNo : '未开发票'}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="orderStatus"
                              title="订单状态"
                              width="120">
              <template v-slot="{ row }">
                <Tag color="red"
                     v-if="row.orderStatus == 1">待付款</Tag>
                <Tag color="blue"
                     v-else-if="row.orderStatus == 2">待服务</Tag>
                <Tag color="green"
                     v-else-if="row.orderStatus == 3">已完成</Tag>
                <Tag color="orange"
                     v-else-if="row.orderStatus == 4">已退款</Tag>
                <Tag color="gray"
                     v-else-if="row.orderStatus == 5">已关闭</Tag>
                <Tag color="yellow"
                     v-else-if="row.orderStatus == 6">退款中</Tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="action"
                              width="140"
                              title="操作">
              <template v-slot="{ row }">
                <Button type="primary"
                        style="margin-left: 8px;"
                        v-if="row.invoiceStatus == 0"
                        @click="edit(row)"
                        size="small">开具发票</Button>
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
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import { billList } from '@/api/weChatBillManage'
import moment from 'moment'
import Edit from './edit'

export default {
  name: 'weChatBillManage',
  components: {
    Edit
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {},
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      tableData: [],
      isLoading: false,
      modalTitle: 0, // 弹出框title，0为补开发票，1为查看发票
      editModalVisible: false,
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
    this.$set(this.form, 'payTimeStart', curDate)
    this.$set(this.form, 'payTimeEnd', curDate)
    this.getList()
  },
  methods: {
    // 获取发票订单列表
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 格式化时间
      let _payTimeStart = this.form.payTimeStart != '' ? moment(this.form.payTimeStart).format('YYYY-MM-DD') : ''
      let _payTimeEnd = this.form.payTimeEnd != '' ? moment(this.form.payTimeEnd).format('YYYY-MM-DD') : ''
      const params = Object.assign({}, this.form)
      params.payTimeStart = _payTimeStart
      params.payTimeEnd = _payTimeEnd
      this.isLoading = true
      billList(pagination, params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          let res = data.data
          this.totalSize = res.total
          this.tableData = res.records
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },
    edit (row) {
      this.editModalVisible = true
      this.modalTitle = 0
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getInfo(params)
      })
    },
    // 重置
    resetHandle () {
      this.form = {}
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate)
      this.$set(this.form, 'endDate', curDate)
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

    // 合并单元格操作
    // colspanMethod ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, data }) {
    //   console.log(row)
    //   console.log(rowIndex)
    //   console.log($rowIndex)
    //   console.log(column)
    //   console.log(columnIndex)
    //   console.log($columnIndex)
    //   console.log(data)
    //   // 当行被展开时将行合并
    //   let xTree = this.$refs.xTree
    //   if (row.comboList && row.comboList.length && xTree && xTree.isTreeExpandByRow(row)) {
    //     if (column.treeNode) {
    //       return {
    //         rowspan: 1,
    //         colspan: 6
    //       }
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       }
    //     }
    //   }
    // },
  }
}
</script>
<style lang="less">
.wechat-bill-manage-wrapper {
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
