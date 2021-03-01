<template>
  <div class="wechat-refund-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">小程序退费审核</span>
        <!-- <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 235px"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="费别名称、拼音码、五笔码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">添加</Button>
        </div> -->
      </div>
      <div class="page-body clearfix">
        <div class="scan-wrapper">
          <Form :model="scanForm"
                ref="scanForm"
                :label-width="80"
                label-position="right">
            <div class="flex-wrapper">
              <FormItem label="订单号"
                        :label-width="110"
                        prop="orderCode">
                <Input v-model="scanForm.orderCode"
                       clearable
                       size="small" />
              </FormItem>
              <FormItem label="体检人姓名"
                        :label-width="95"
                        prop="patientName">
                <Input v-model="scanForm.patientName"
                       clearable
                       size="small" />
              </FormItem>
              <FormItem label="支付时间"
                        :label-width="80"
                        prop="payDateStart">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="scanForm.payDateStart"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="payDateEnd">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="scanForm.payDateEnd"
                            size="small"></DatePicker>
              </FormItem>
            </div>
            <div class="flex-wrapper">
              <FormItem label="申请退费时间"
                        :label-width="110"
                        prop="refundDateStart">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="scanForm.refundDateStart"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="refundDateEnd">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="scanForm.refundDateEnd"
                            size="small"></DatePicker>
              </FormItem>
            </div>
          </Form>
          <div class="scan-handle-wrapper">
            <Button type="primary"
                    style="margin-left: 8px;"
                    @click="getList()">查询</Button>
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="resetHandle">重置</Button>
          </div>
        </div>
        <Tabs v-model="scanForm.status"
              @on-click="orderStatusChange">
          <TabPane label="全部订单"
                   name="4"></TabPane>
          <TabPane label="待审核"
                   name="0"></TabPane>
          <TabPane label="已退费"
                   name="1"></TabPane>
          <TabPane label="未通过"
                   name="3"></TabPane>
        </Tabs>
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading">
          <template slot="status"
                    slot-scope="{row}">
            <Tag color="orange"
                 v-if="row.status == 0">待审核</Tag>
            <Tag color="green"
                 v-else-if="row.status == 1">已退费</Tag>
            <Tag color="red"
                 v-else-if="row.status == 3">未通过</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit(row)"
                    size="small">查看详情</Button>
            <Button type="error"
                    @click="closeOrderHandle(row)"
                    v-if="row.status == 0"
                    style="margin-left: 8px;"
                    size="small">处理退款</Button>
          </template>
        </Table>
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
    <Modal v-model="dealOrderModal"
           :mask-closable="false"
           @on-cancel="dealOrderModal = false"
           title="提示"
           width="350">
      <div class="modal-body"
           style="font-size:14px;color:#252525;">
        是否同意退费？
      </div>
      <div slot="footer">
        <Button type="default"
                size="small"
                style="margin-right:8px;"
                :loading="refuseLoading"
                @click="refuseHandle">拒绝</Button>
        <Button type="primary"
                size="small"
                :loading="agreeLoading"
                @click="refundHandle">同意</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { wechatOrderRefundList, refundOrder, refuseRefundOrder } from '@/api/weChatRefund'
import Edit from './edit.vue'
import moment from 'moment'

export default {
  name: 'weChatRefund',
  components: {
    Edit
  },
  data () {
    return {
      scanForm: {
        status: '4'
      },
      columns: [
        {
          title: '订单号',
          key: 'orderCode',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '支付交易号',
          key: 'wxOrderId',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '支付时间',
          key: 'payDate',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'account',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '订单金额',
          key: 'refundPrice',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '申请退款时间',
          key: 'createDate',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '退费商户号',
          key: 'wxRefundMchId',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '体检人',
          key: 'patientName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '订单状态',
          slot: 'status',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 200,
          align: 'center'
        }
      ],
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      editModalVisible: false,
      dealOrderModal: false,
      isLoading: false,
      refuseLoading: false,
      agreeLoading: false,
      curOrderInfo: {} // 当前选中订单信息
    }
  },
  mounted () {
    this.getList()

  },
  methods: {
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 格式化时间
      this.scanForm.payDateStart = this.scanForm.payDateStart != '' ? moment(this.scanForm.payDateStart).format('YYYY-MM-DD') : ''
      this.scanForm.payDateEnd = this.scanForm.payDateEnd != '' ? moment(this.scanForm.payDateEnd).format('YYYY-MM-DD') : ''
      this.scanForm.refundDateStart = this.scanForm.refundDateStart != '' ? moment(this.scanForm.refundDateStart).format('YYYY-MM-DD') : ''
      this.scanForm.refundDateEnd = this.scanForm.refundDateEnd != '' ? moment(this.scanForm.refundDateEnd).format('YYYY-MM-DD') : ''

      let params = Object.assign({}, this.scanForm)
      if (params.status == '4') {
        params.status = ''
      }
      // 防重复提交
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      wechatOrderRefundList(pagination, params).then(({ data }) => {
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
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let _obj = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(_obj)
      })
    },

    // 处理退费订单操作
    closeOrderHandle (row) {
      this.curOrderInfo = Object.assign({}, row)
      this.dealOrderModal = true
    },
    // 同意退费
    refundHandle () {
      if (this.agreeLoading) return
      const { orderId, userId, id } = this.curOrderInfo
      let params = { orderId, userId, refundId: id }

      this.agreeLoading = true
      refundOrder(params).then(({ data }) => {
        this.agreeLoading = false
        this.dealOrderModal = false
        if (data.code == 0) {
          this.$Message.success(data.message)
          this.getList(this.pageIndex, this.pageSize)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },

    // 拒绝退费
    refuseHandle () {
      if (this.refuseLoading) return
      const params = {
        refundId: this.curOrderInfo.id
      }
      this.refuseLoading = true
      refuseRefundOrder(params).then(({ data }) => {
        this.refuseLoading = false
        this.dealOrderModal = false
        if (data.code == 0) {
          this.$Message.success(`操作成功`)
          this.getList(this.pageIndex, this.pageSize)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },

    // 重置操作
    resetHandle () {
      this.$refs.scanForm.resetFields()
      this.$set(this.scanForm, 'status', '4')
      this.getList()
    },

    // 切换订单状态
    orderStatusChange (name) {
      this.$set(this.scanForm, 'status', name)
      this.getList()
    },
    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    }
  }
}
</script>
<style lang="less">
.wechat-refund-wrapper {
  width: 100%;
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
  .scan-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
  }
  .flex-wrapper {
    display: flex;
    margin-bottom: 5px;
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
