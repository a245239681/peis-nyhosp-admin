<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :width="1200"
           title="预览日结报表"
           class="daily-balance-edit-wrapper">
      <div class="modal-body">
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
      <div slot="footer">
        <div class="flex-wrapper">
          <div>
            <Button type="error"
                    :loading="cencelDailyLoading"
                    v-if="userInfo.userId === curDailyInfo.dailyId"
                    @click="cancelDailyHandle">取消结账</Button>
          </div>
          <div>
            <Button type="primary"
                    style="margin-right:8px"
                    @click="getStatementDetail">查看结算单明细</Button>
            <Button type="primary"
                    style="margin-right:8px"
                    :loading="printLoading"
                    @click="print">打印报表</Button>
            <Button @click="closeModal"
                    type="default">关闭</Button>

          </div>
        </div>

      </div>
    </Modal>
    <Detail :visible="detailVisible"
            ref="detailWrapper"
            @close="detailVisible = false"></Detail>
  </div>
</template>
<script>
import { getDayCount } from '@/api/dailyBalance'
import { cancelDaily, printDailyChargeSummary } from '@/api/dailyManage'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import Detail from './detail'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  components: {
    Detail
  },
  data () {
    return {
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
      cencelDailyLoading: false,
      list: {}, // 存放日报表所有数据
      printLoading: false,
      detailVisible: false,
      curDailyInfo: {} // 当前时间点信息

    }
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  methods: {
    closeModal () {
      this.refundTableData = []
      this.tableData = []
      this.detailTableData = []
      this.list = {}
      this.curDailyInfo = {}
      this.$emit('close')
    },
    getDailyReport (obj) {
      this.curDailyInfo = obj
      this.isLoading = true
      let params = {
        dailyId: this.curDailyInfo.dailyId,
        boDailyCode: this.curDailyInfo.dailyCode
      }
      getDayCount(params).then(({ data }) => {
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
        this.isLoading = false
        this.$Message.error(err.message);
      })
    },

    // 查看结算单明细
    getStatementDetail () {
      this.detailVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, this.curDailyInfo)
      this.$nextTick(() => {
        this.$refs.detailWrapper.init(params)
      })
    },

    // 打印日结报表
    print () {
      if (!printNotice()) return false

      let params = {
        boDailyCode: this.curDailyInfo.dailyCode,
        dailyId: this.curDailyInfo.dailyId
      }
      if (this.printLoading) return false
      this.printLoading = true;
      printDailyChargeSummary(params).then(({ data }) => {
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
        this.$Message.error(err.message);
      });
    },

    // 取消日结
    cancelDailyHandle () {
      if (this.cencelDailyLoading) return false
      let params = {
        dailyCode: this.curDailyInfo.dailyCode
      }
      this.cencelDailyLoading = true
      cancelDaily(params).then(({ data }) => {
        this.cencelDailyLoading = false
        if (data.code === 0) {
          this.$Message.success(data.message)
          this.$emit('updateList')
          this.closeModal()
        } else {
          this.$Message.error(data.message);
        }
      }).catch(err => {
        console.log(err)
        this.cencelDailyLoading = false;
        this.$Message.error(err.message);
      });
    }

  }
}
</script>
<style lang="less">
.daily-balance-edit-wrapper {
  .flex-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
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
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
}
</style>