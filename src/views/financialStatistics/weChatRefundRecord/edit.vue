<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           width="900"
           :closable="false"
           class="wechat-order-edit-wrapper">
      <div slot="header">
        <div class="header-wrapper">
          <div class="title">订单详情</div>
          <div class="tool-wrapper">
            <Button type="default"
                    @click="getOrderInfo"
                    :loading="isLoading">刷新</Button>
            <Button type="primary"
                    style="margin-left: 8px;"
                    @click="closeModal">返回</Button>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="step-wrapper">
          <Steps :current="curStepStatus">
            <Step title="提交退款申请"></Step>
            <template v-if="orderInfo.refundOrderStatus == 3">
              <Step title="审核不通过"></Step>
              <Step title="拒绝退款"></Step>
            </template>
            <template v-else>
              <Step title="待审核"></Step>
              <Step title="退款完成"></Step>
            </template>
          </Steps>
        </div>
        <div class="main-wrapper">
          <div class="status-wrapper">
            <div class="status">当前订单状态：
              <Tag color="orange"
                   v-if="orderInfo.refundOrderStatus == 0">待审核</Tag>
              <Tag color="red"
                   v-else-if="orderInfo.refundOrderStatus == 3">未通过</Tag>
              <Tag color="green"
                   v-else-if="orderInfo.refundOrderStatus == 1">已退费</Tag>
            </div>
            <div class="tools-wrapper">
              <!-- <Button type="primary"
                      @click="refundHandle()"
                      v-if="orderInfo.refundOrderStatus == 0"
                      style="margin-left: 8px;"
                      size="small">同意退款</Button>
              <Button type="error"
                      @click="refuseHandle()"
                      v-if="orderInfo.refundOrderStatus == 0"
                      style="margin-left: 8px;"
                      size="small">拒绝退款</Button> -->
            </div>
          </div>
          <!-- 基本信息 start -->
          <div class="main-item-wrapper">
            <div class="title">
              <Icon type="md-bookmark"
                    size="20"
                    color="#2d8cf0" />
              <span>基本信息</span>
            </div>
            <Table :columns="columns1"
                   :data="tableData"
                   :loading="isLoading">
              <template slot="payType"
                        slot-scope="{row}">
                <span v-if="row.payType == 1">微信</span>
                <span v-else-if="row.payType == 2">支付宝</span>
              </template>
            </Table>
          </div>
          <!-- 基本信息 end -->
          <!-- 体检人信息 start -->
          <div class="main-item-wrapper">
            <div class="title">
              <Icon type="md-bookmark"
                    size="20"
                    color="#2d8cf0" />
              <span>体检人信息</span>
            </div>
            <Table :columns="columns2"
                   :data="tableData[0].patientList"
                   :loading="isLoading">
            </Table>
          </div>
          <!-- 体检人信息 end -->
          <!-- 商品信息 start -->
          <div class="main-item-wrapper">
            <div class="title">
              <Icon type="md-bookmark"
                    size="20"
                    color="#2d8cf0" />
              <span>商品信息</span>
            </div>
            <vxe-table border
                       show-footer
                       :auto-resize="true"
                       highlight-hover-row
                       align="center"
                       row-class-name="table-row"
                       header-row-class-name="table-row"
                       :data="tableData[0].wxPackageList"
                       :footer-method="footerMethod"
                       footer-row-class-name="table-footer-row"
                       :loading="isLoading">
              <vxe-table-column field="packagePic"
                                title="商品图片"
                                min-width="140">
                <template v-slot="{ row }">
                  <div class="pic-wrapper">
                    <img class="pic"
                         v-if="!row.packagePic"
                         src="../../../assets/images/package_pic.jpg"
                         alt="商品图片">
                    <img class="pic"
                         v-else
                         :src="$url + row.packagePic"
                         alt="商品图片">
                  </div>
                </template>
              </vxe-table-column>
              <vxe-table-column field="packageName"
                                title="商品名称"></vxe-table-column>
              <vxe-table-column field="packageNum"
                                title="商品数量"
                                width="100"></vxe-table-column>
              <vxe-table-column field="packagePrice"
                                title="商品价格"
                                width="140"></vxe-table-column>
            </vxe-table>
          </div>
          <!-- 商品信息 end -->
          <!-- 费用信息 start -->
          <div class="main-item-wrapper">
            <div class="title">
              <Icon type="md-bookmark"
                    size="20"
                    color="#2d8cf0" />
              <span>费用信息</span>
            </div>
            <vxe-table border
                       show-footer
                       :auto-resize="true"
                       highlight-hover-row
                       align="center"
                       row-class-name="table-row"
                       header-row-class-name="table-row"
                       :data="tableData"
                       :loading="isLoading">
              <vxe-table-column field="packageTotalPrice"
                                title="商品合计"></vxe-table-column>
              <vxe-table-column field="orderPrice"
                                title="订单总金额"></vxe-table-column>
              <vxe-table-column field="paymentPrice"
                                title="应付总金额"></vxe-table-column>
            </vxe-table>
          </div>
          <!-- 费用信息 end -->
          <!-- 操作信息 start -->
          <div class="main-item-wrapper">
            <div class="title">
              <Icon type="md-bookmark"
                    size="20"
                    color="#2d8cf0" />
              <span>操作信息</span>
            </div>
            <vxe-table border
                       show-footer
                       :auto-resize="true"
                       highlight-hover-row
                       align="center"
                       row-class-name="table-row"
                       header-row-class-name="table-row"
                       :data="tableData[0].wxOrderOperateInfoList"
                       :loading="isLoading">
              <vxe-table-column field="operateName"
                                title="操作者"
                                min-width="100"></vxe-table-column>
              <vxe-table-column field="createDate"
                                title="操作时间"
                                min-width="160"></vxe-table-column>
              <vxe-table-column field="orderStatus"
                                min-width="120"
                                title="订单状态">
                <template v-slot="{row}">
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
                       v-else-if="row.orderStatus == 6">退费中</Tag>

                </template>
              </vxe-table-column>
              <vxe-table-column field="payStatus"
                                min-width="120"
                                title="付款状态">
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
              <vxe-table-column field="remark"
                                min-width="160"
                                title="备注"></vxe-table-column>
            </vxe-table>
          </div>
          <!-- 操作信息 end -->
        </div>
      </div>
      <div slot="footer">
        <!-- <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">保存</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import { RefundOrderDetail, refundOrder, refuseRefundOrder } from '@/api/weChatRefund'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      isLoading: false,
      orderInfo: {},
      refundOrderInfo: {}, // 父组件退费单信息
      columns1: [
        {
          title: '订单编号',
          key: 'orderCode',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'account',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '支付方式',
          slot: 'payType',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '订单来源',
          key: 'source',
          minWidth: 140,
          align: 'center'
        }
      ],
      columns2: [
        {
          title: '姓名',
          key: 'patientName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'credentialsId',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '手机号',
          key: 'phone',
          minWidth: 140,
          align: 'center'
        }
      ],
      tableData: [{
        patientList: [],
        wxPackageList: [],
        wxOrderOperateInfoList: []
      }],
      curStepStatus: -1,
      refuseLoading: false,
      agreeLoading: false,
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增' : '编辑')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  mounted () {

  },
  methods: {
    // 关闭弹窗
    closeModal () {
      this.orderInfo = {}
      this.$emit('close')
    },

    getItemList (row) {
      this.refundOrderInfo = row
      this.getOrderInfo()
    },

    // 获取订单详情
    getOrderInfo () {
      const params = {
        orderId: this.refundOrderInfo.orderId,
        refundId: this.refundOrderInfo.refundId
      }
      this.isLoading = true
      RefundOrderDetail(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          const result = data.data
          this.orderInfo = result
          if (result.refundOrderStatus == 0) {
            this.curStepStatus = 1
          } else if (result.refundOrderStatus == 1 || result.refundOrderStatus == 3) {
            this.curStepStatus = 2
          }
          this.$set(this.tableData, '0', result)
        } else {
          this.orderInfo = {}
          this.tableData = [{
            patientList: [],
            wxPackageList: [],
            wxOrderOperateInfoList: []
          }]
          this.$Message.error(data.message)
        }
      })
    },

    // 同意退费
    refundHandle () {
      if (this.agreeLoading) return
      const { orderId, userId, id } = this.refundOrderInfo
      let params = { orderId, userId, refundId: id }
      this.agreeLoading = true
      refundOrder(params).then(({ data }) => {
        this.agreeLoading = false
        this.dealOrderModal = false
        if (data.code == 0) {
          this.$Message.success(data.message)
          this.$emit('updateList')
          this.closeModal()
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
        refundId: this.refundOrderInfo.id
      }
      this.refuseLoading = true
      refuseRefundOrder(params).then(({ data }) => {
        this.refuseLoading = false
        this.dealOrderModal = false
        if (data.code == 0) {
          this.$Message.success(`操作成功`)
          this.$emit('updateList')
          this.closeModal()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },

    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return `合计：`
          }
          switch (column.property) {
            case 'packagePrice':
              return `¥${Math.round(XEUtils.sum(data, 'packagePrice') * 100) / 100}`
          }
          return '-'
        })
      ]
    }

  }
}
</script>
<style lang="less">
.wechat-order-edit-wrapper {
  .header-wrapper {
    display: flex;
    justify-content: space-between;
    align-content: center;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #252525;
      display: flex;
      align-items: center;
    }
  }
  .modal-body {
    width: 100%;
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .step-wrapper {
    width: 100%;
    padding: 10px 20px;
    .ivu-steps {
      display: flex;
      .ivu-steps-item {
        flex: 1;
        width: auto !important;
      }
      .ivu-steps-item:last-child {
        flex: none;
      }
    }
  }
  .main-wrapper {
    padding: 0 20px;
    .status-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #252525;
      border-bottom: 1px solid #e6e6e6;
      padding: 10px 0;
    }
    .main-item-wrapper {
      width: 100%;
      padding: 10px 0;
      .title {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        color: #252525;
        margin-bottom: 10px;
        .ivu-icon {
          margin-top: -3px;
        }
        span {
          margin-left: 5px;
        }
      }
      .pic-wrapper {
        padding: 5px 0;
      }
      .pic {
        width: 116px;
        height: 76px;
        border-radius: 4px;
      }
      .table-row {
        color: #252525;
      }
      .table-footer-row {
        font-weight: bold;
        color: #252525;
      }
    }
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
}
</style>
