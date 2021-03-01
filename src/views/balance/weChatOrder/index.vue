<template>
  <div class="exam-payoff-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">小程序订单管理</span>
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
                        :label-width="80"
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
        <Tabs v-model="scanForm.orderStatus"
              @on-click="orderStatusChange">
          <TabPane label="全部订单"
                   name="0"></TabPane>
          <TabPane label="待付款"
                   name="1"></TabPane>
          <TabPane label="待服务"
                   name="2"></TabPane>
          <TabPane label="已完成"
                   name="3"></TabPane>
          <TabPane label="退款中"
                   name="6"></TabPane>
          <TabPane label="已退款"
                   name="4"></TabPane>
          <TabPane label="已关闭"
                   name="5"></TabPane>

        </Tabs>
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading">
          <template slot="orderStatus"
                    slot-scope="{row}">
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
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit(row.orderId)"
                    size="small">查看详情</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    v-if="row.orderStatus == 2 || row.orderStatus == 3"
                    @click="refundOrderHandle(row)"
                    size="small">取消订单</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    v-if="row.orderStatus == 1"
                    @click="closeOrderHandle(row)"
                    size="small">关闭订单</Button>
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
    <DeleteModal :visible="deleteModalVisible"
                 ref="deleteModal"
                 @updateList="getList(pageIndex, pageSize)"
                 @close="deleteModalVisible = false"></DeleteModal>
  </div>
</template>
<script>
import { wechatOrderList, closeOrder } from '@/api/weChatOrderManage.js'
import Edit from './edit.vue'
import DeleteModal from './delete'

export default {
  name: 'weChatOrderManage',
  components: {
    Edit,
    DeleteModal
  },
  data () {
    return {
      scanForm: {
        orderStatus: '0'
      },
      columns: [
        {
          title: '订单号',
          key: 'orderCode',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '提交时间',
          key: 'createDate',
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
          key: 'orderPrice',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '预约日期',
          key: 'medicalDate',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '体检人',
          key: 'patientName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '身份证',
          key: 'credentialsId',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '订单状态',
          slot: 'orderStatus',
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
      deleteModalVisible: false,
      isLoading: false
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

      let params = Object.assign({}, this.scanForm)
      if (params.orderStatus == '0') {
        params.orderStatus = ''
      }
      // 防重复提交
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      wechatOrderList(pagination, params).then(({ data }) => {
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
    edit (id) {
      this.editModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(id)
      })
    },

    // 取消订单操作
    refundOrderHandle (row) {
      this.deleteModalVisible = true
      let params = Object.assign({}, row)

      this.$nextTick(() => {
        this.$refs.deleteModal.getItemList(params)
      })
    },

    // 关闭订单操作
    closeOrderHandle (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否关闭该订单？',
        onOk: () => {
          let params = {
            orderId: row.orderId
          }
          closeOrder(params).then(({ data }) => {
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
        onCancel: () => {

        }
      })
    },

    // 重置操作
    resetHandle () {
      this.$refs.scanForm.resetFields()
      this.$set(this.scanForm, 'orderStatus', '0')
      this.getList()
    },

    // 切换订单状态
    orderStatusChange (name) {
      this.$set(this.scanForm, 'orderStatus', name)
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
.exam-payoff-wrapper {
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
