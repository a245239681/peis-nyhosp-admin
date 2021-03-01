<template>
  <div class="new-exam-refund-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <div class="title-left-wrapper">
          <Form :model="form"
                label-position="right"
                ref="form"
                inline
                style="flex:1"
                :label-width="60">
            <FormItem label="姓名"
                      :label-width="80">
              <Input v-model="form.name"
                     style="width:140px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
            <FormItem label="性别"
                      :label-width="60">
              <Input v-model="form.sex"
                     style="width:80px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
            <FormItem label="年龄"
                      :label-width="60">
              <Input v-model="form.age"
                     style="width:80px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
            <FormItem label="体检号"
                      :label-width="80">
              <Input v-model="form.peId"
                     style="width:140px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
          </Form>
        </div>
        <div class="title-right-tool">
          <span class="scan-label">扫码区域</span>
          <Input v-model="registerCode"
                 style="width:160px;font-size: 16px;font-weight:bold;margin-left:8px;"
                 ref="inputFocus"
                 @on-enter="getList"
                 clearable />
        </div>
      </div>
      <div class="page-body clearfix">
        <div class="table-wrapper"
             :style="'height:' + ((screenHeight - 360) <= 480 ? 480 : (screenHeight - 360)) + 'px;'">
          <Spin fix
                v-if="isLoading"></Spin>
          <div class="empty-data"
               v-if="listData.length == 0 && isLoading == false">暂无可退发票信息</div>
          <div class="bill-info-item-wrapper"
               :class="{'active' : index === curBillIdx}"
               v-for="(item,index) in listData"
               @click="chooseBill(item,index)"
               :key="index">
            <div class="bill-title-info">
              <div class="info">
                <span>发票号：{{item.invoiceNo}}</span>
                <span>发票状态：{{item.transactType}}</span>
                <span>支付方式：{{item.paymentType}}</span>
                <span>合计金额：¥{{item.paymentAmount}}</span>
              </div>
              <div class="date">
                结算时间：{{item.paymentDate}}
              </div>
            </div>
            <div class="table-header">
              <div class="sort">序号</div>
              <div style="flex:0.2">科室</div>
              <div style="flex:0.4">项目名称</div>
              <div style="flex:0.2">应收金额（元）</div>
              <div style="flex:0.2">实收金额（元）</div>
            </div>
            <div class="table-cont"
                 v-for="(subItem, subIdx) in item.comboList"
                 :key="subIdx">
              <div class="sort">{{subIdx + 1}}</div>
              <div style="flex:0.2">{{subItem.operationDept}}</div>
              <div style="flex:0.4">{{subItem.comboName}}</div>
              <div style="flex:0.2">¥{{subItem.amount}}</div>
              <div style="flex:0.2">¥{{subItem.realAmount}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-footer">
        <div class="total-amount-wrapper">
          <div class="total">总计金额：<span>¥{{curTotalAmount ?curTotalAmount : '0.00'}}</span></div>
          <div class="should-be">实际退费：<span>¥{{curRealTotalAmount ?curRealTotalAmount : '0.00'}}</span></div>
        </div>
        <div class="handle-wrapper">
          <div class="bill-wrapper">
            <!-- <div class="cont">
              <span>本次收费发票号：</span>
              <Input v-model="curBillNum"
                     style="width:140px"
                     clearable />
            </div> -->
            <!-- <Button type="primary"
                    style="margin-left: 8px;">修改当前发票</Button> -->
          </div>
          <div class="charge-wrapper">
            <Button type="primary"
                    @click="edit"
                    :disabled="isTransact"
                    style="min-width:100px;">确认退费</Button>
            <Button type="default"
                    @click="resetHandle"
                    style="min-width:100px;margin-left: 8px;">重置页面</Button>
          </div>
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
import moment from 'moment'
import { billList } from '@/api/newExamRefund'
import Edit from './edit'

export default {
  name: 'newExamRefund',
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
      listData: [],
      isLoading: false,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      emptyText: '暂无数据', // 无数据文案
      registerCode: '', //扫码区数据
      curBillIdx: '', // 当前选中发票序号
      curBillInfo: {}, // 当前选中发票信息
      curTotalAmount: '', // 当前选中发票应退总金额
      curRealTotalAmount: '', // 当前选中发票实际退费金额
      isTransact: true, // 当前选中发票是否作废
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
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
  },
  methods: {
    // 获取已开发票列表
    getList () {
      if (this.registerCode.trim() == '') {
        this.$Message.info('请输入登记流水号')
        this.registerCode = ''
        return false
      }
      this.registerCode = this.registerCode.trim()
      const params = {
        boRegisterCode: this.registerCode
      }

      this.isLoading = true
      billList(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.listData = data.data.invoiceList
          let { peId, sex, name, age } = data.data
          this.form = { peId, sex, name, age }
        } else {
          this.listData = []
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },
    edit () {
      this.editModalVisible = true
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemInfo(this.curBillInfo)
      })
    },

    // 选中发票
    chooseBill (item, index) {
      this.curBillIdx = index
      this.curBillInfo = item
      this.curTotalAmount = item.paymentAmount || '0.00'
      this.curRealTotalAmount = item.paymentAmount || '0.00'
      this.isTransact = (item.transactType == '作废' ? true : false)
    },

    // 重置
    resetHandle () {
      this.form = {}
      this.listData = []
      this.curBillIdx = ''
      this.curTotalAmount = ''
      this.curRealTotalAmount = ''
      this.registerCode = ''
      this.$nextTick(() => {
        this.$refs.inputFocus.focus()
      })
    },
  }
}
</script>
<style lang="less">
.new-exam-refund-wrapper {
  width: 100%;
  min-width: 1300px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
  }
  .title-right-tool {
    display: flex;
    align-items: center;
    border: 2px dotted #2d8cf0;
    border-radius: 5px;
    padding: 5px 10px;
    span {
      color: #2d8cf0;
      font-size: 16px;
      font-weight: bold;
    }
    .ivu-input {
      font-size: 16px;
      font-weight: bold;
      color: #252525;
    }
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
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .bill-info-item-wrapper {
      width: 100%;
      height: auto;
      border: 2px solid transparent;
      margin-bottom: 10px;
      .bill-title-info {
        font-size: 14px;
        color: #252525;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 40px;
        font-weight: bold;
        padding: 0 10px;
        span {
          margin-right: 10px;
        }
        span:last-child {
          margin-right: 0;
        }
      }
      .table-header {
        border-left: 1px solid #e6e6e6;
        background-color: #e8eaec;
        display: flex;
        align-items: center;
        height: 40px;
        div.sort {
          width: 60px;
          flex-shrink: 0;
        }
        div {
          border-right: 1px solid #fff;
          border-bottom: 1px solid #fff;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #252525;
          font-weight: bold;
        }
        div:last-child {
          border-right: 1px solid #e6e6e6;
        }
      }
      .table-cont {
        border-left: 1px solid #e6e6e6;
        display: flex;
        align-items: center;
        height: 40px;
        div.sort {
          width: 60px;
          flex-shrink: 0;
        }
        div {
          border-right: 1px solid #e6e6e6;
          border-bottom: 1px solid #e6e6e6;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #252525;
        }
      }
    }
    .bill-info-item-wrapper.active {
      border: 2px solid #2d8cf0;
      border-radius: 4px;
    }
    .bill-info-item-wrapper:last-child {
      margin-bottom: 0;
    }
    &::-webkit-scrollbar {
      width: 5px;
      background-color: #eee;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-corner {
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
    .empty-data {
      width: 100%;
      height: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #888;
      font-weight: bold;
    }
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
  .page-footer {
    display: block;
    height: auto;
    padding: 0 20px;
    position: relative;
    margin: 0;
    bottom: 0;
    .total-amount-wrapper {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 16px;
      padding: 20px 0;
      border-bottom: 1px solid #e5e5e5;
      span {
        color: #ed4014;
        font-weight: bold;
      }
      .total {
        margin-right: 10px;
      }
    }
    .handle-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
    }
    .bill-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      .ivu-input {
        font-size: 16px;
        font-weight: bold;
        color: #252525;
      }
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
