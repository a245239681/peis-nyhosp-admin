<template>
  <div class="medical-insurance-fee-day-balance-wrapper">
    <div class="fee-day-closure-wrapper">
      <Card style="width:100%;">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">医保待日结-统计</span>
          <div class="title-right-tool">
            <span>收费员：</span>
            <Input style="width: 200px"
                   v-model="userInfo.poName"
                   disabled
                   placeholder="收费员姓名" />
            <Button type="primary"
                    style="margin-left: 8px;"
                    @click="balance"
                    :loading="balanceLoading">预览日结</Button>
          </div>
        </div>

        <div class="table">
          <Table :columns="totalColumns"
                 :data="totalTableData"
                 :loading="closure_isLoading">
          </Table>
        </div>
      </Card>
    </div>
    <div class="statements-wrapper">
      <Card style="width:100%;height:100%;">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">医保待日结-结算单明细</span>
          <Input search
                 enter-button
                 style="width: 200px"
                 size="small"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="搜索" />
        </div>

        <!-- <Tabs value="statements">
          <TabPane label="结算单"
                   name="statements"> -->
        <Table :columns="statementsColumns"
               :data="statementsTableData"
               height="500"
               :loading="statements_isLoading">
          <template slot="settleDate"
                    slot-scope="{row}">
            {{ row.settleDate | dateformat}}
          </template>

          <template slot="paymentAmount"
                    slot-scope="{row}">
            <span :class="row.paymentAmount<0 ? 'red' : ''">{{row.paymentAmount}}</span>
          </template>
          <template slot="dailyTime"
                    slot-scope="{row}">
            <span v-if="row.dailyTime">{{ row.dailyTime | dateformat}}</span>
            <span v-else>未日结</span>
          </template>
        </Table>
        <div class="page">
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
        <!-- </TabPane>
          <TabPane label="退费单"
                   name="refund">
            <Table :columns="statementsColumns"
                   :data="statementsTableData"
                   :loading="refund_isLoading">
              <template slot="boCheckInDate"
                        slot-scope="{row}">
                {{ row.boCheckInDate | dateformat}}
              </template>
            </Table>
            <div class="page">
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
          </TabPane>
        </Tabs> -->

      </Card>
    </div>
  </div>
</template>

<script>
import {
  dailyYbDetailList,
  dailyBalance
} from '@/api/MIFeeDayBalance.js'

export default {
  name: 'MIFeeDayBalance',
  data () {
    return {
      // settlementPerson: '',
      settlementTime: '',
      closure_loading: false,
      totalColumns: [
        {
          title: '支付渠道',
          key: 'name',
          align: 'center'
        },
        {
          title: '合计金额（元）',
          key: 'total',
          align: 'center'
        },
        {
          title: '市医保',
          key: 'syb',
          align: 'center'
        },
        {
          title: '区医保',
          key: 'qyb',
          align: 'center'
        }
      ],
      totalTableData: [],
      statementsColumns: [
        {
          title: '序号',
          type: 'index',
          width: 65,
          align: 'center'
        },

        // {
        //   title: '结算编号',
        //   key: 'num',
        //   align: 'center'
        // },
        {
          title: '体检号',
          key: 'peId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '发票号',
          key: 'invoiceNo',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 120,
          align: 'center'
        },
        // {
        //   title: '日结状态',
        //   key: 'boCategory',
        //   minWidth: 80,
        //   align: 'center'
        // },
        {
          title: '日结时间',
          key: 'dailyTime',
          slot: 'dailyTime',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '体检类型',
          key: 'category',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '支付方式',
          key: 'paymentType',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '收款人',
          key: 'operatorName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作时间',
          key: 'settleDate',
          slot: 'settleDate',
          align: 'center',
          minWidth: 170
        },
        {
          title: '日结人',
          key: 'dailyName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '代收金额（元）',
          key: 'dai',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '实收金额（元）',
          key: 'paymentAmount',
          slot: 'paymentAmount',
          minWidth: 120,
          align: 'center'
        }
        // {
        //   title: '作废状态',
        //   key: 'status',
        //   align: 'center'
        // },
      ],
      statementsTableData: [],
      statements_isLoading: false,
      refund_isLoading: false,
      closure_isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      keyword: '',
      balanceLoading: false,
      boDailyDate: '',
    }
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
  mounted () {
    let params = {
      deptName: '财务科',
      deptId: ''
    }
    this.$store.dispatch("getExamDoctorDict", { params, btn: true }).then(res => {

      // 查询结算单列表
      this.getList()
    })
  },
  methods: {
    getList (page = 1, size = 20) {
      // 非财务科人员登录，不进行日结操作
      let btn = this.isClaimant()
      if (!btn) return false

      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      this.statements_isLoading = true
      let params = {
        keyword: this.keyword.trim(),
        boDailyStatus: '0',
        boDailyCode: '',
        isYB: true
      }

      dailyYbDetailList(pagination, params)
        .then(({ data }) => {
          // console.log(data)
          this.statements_isLoading = false
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.statementsTableData = res.records
            let {
              totalCount,
              totalFee,
              sybPayTotalCount,
              sybPayTotal,
              qybPayTotalCount,
              qybPayTotal
            } = res.statistics

            let _col1 = { name: '收款金额（元）', total: totalFee, syb: sybPayTotal, qyb: qybPayTotal }
            let _col2 = { name: '费用笔数（笔）', total: totalCount, syb: sybPayTotalCount, qyb: qybPayTotalCount }
            let arr = []
            arr.push(_col1)
            arr.push(_col2)
            this.totalTableData = arr
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.statements_isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },

    // 判断登录账号是否为财务科中的人
    isClaimant () {
      let result = this.receiverList.some(item => {
        return item.doctorId == this.userInfo.userId
      })
      if (!result) {
        this.$Message.info('登录的账号没有日结权限，请联系财务科人员操作！')
      }
      return result
    },

    // 点击日结
    balance () {
      // 非财务科人员登录，不进行日结操作
      let btn = this.isClaimant()
      if (!btn) return false

      this.balanceLoading = true
      this.$Modal.confirm({
        title: '提示',
        content: '是否确认日结？',
        onOk: () => {
          const params = {
            boSettleManID: this.userInfo.userId
          }
          dailyBalance(params)
            .then(({ data }) => {
              this.balanceLoading = false
              // console.log(data)
              if (data.code == 0) {
                this.$Message.success(data.message)
                this.getList(this.pageIndex, this.pageSize)
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.balanceLoading = false
              this.$Message.error('网络不稳定，请稍后重试')
            })
        },
        onCancel: () => {
          this.balanceLoading = false
        }
      })

    }
  }
}
</script>

<style lang="less">
.medical-insurance-fee-day-balance-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  // justify-content: space-between;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-form-item {
      margin-bottom: 0px !important;
    }
  }
  .form {
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
  .fee-day-closure-wrapper {
    position: relative;
    margin-bottom: 10px;
    .ivu-card-head {
      padding: 10px 16px;
    }
    .ivu-card-body {
      padding: 10px 17px;
      height: calc(~'100% - 55px');
    }
  }
  .statements-wrapper {
    // height: 86%;
    position: relative;
  }

  .ivu-card-extra {
    top: 10px;
    right: 20px;
    // min-width: 800px;
  }
  .ivu-tabs-tabpane {
    display: flex;
    flex-direction: column;
  }
  .footer {
    margin-top: 10px;
    margin-right: 10px;
    display: flex;
    justify-content: flex-end;
    span {
      height: 100%;
    }
  }
  .page {
    height: 60px;
    margin-top: 20px;
    text-align: center;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
  .red {
    color: red;
  }
}
</style>
