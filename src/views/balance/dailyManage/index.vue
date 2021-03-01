<template>
  <div class="daily-manage-page-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">日结报表管理</span>
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
              <FormItem label="日结时间"
                        :label-width="80"
                        prop="startDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.startDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="endDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.endDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="日结类型"
                        prop="type"
                        :label-width="80">
                <Select v-model="form.type"
                        size="small"
                        style="min-width:140px"
                        @on-change="dailyTypeChange"
                        clearable>
                  <Option :value="0">全部</Option>
                  <Option :value="1">当面付</Option>
                  <Option :value="2">医保支付</Option>
                </Select>
              </FormItem>
              <!-- <FormItem label="日结人员"
                        :label-width="80"
                        prop="name">
                <Input v-model="userInfo.poName"
                       style="width:135px"
                       size="small"
                       disabled />
              </FormItem> -->
              <FormItem label="日结人员"
                        :label-width="80">
                <Select v-model="form.userId"
                        size="small"
                        style="width:140px"
                        clearable>
                  <Option v-for="item in receiverList"
                          :value="item.doctorId"
                          :key="item.doctorId">{{item.doctorName}}</Option>
                </Select>
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
                     align="center"
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :height="(screenHeight - 320) <= 500 ? 500 : (screenHeight - 320)"
                     :data="tableData"
                     :seq-config="{startIndex: 0}"
                     :loading="isLoading">
            <vxe-table-column type="seq"
                              title="序号"
                              width="55"></vxe-table-column>
            <vxe-table-column field="isYb"
                              title="日结类型"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.isYb === '0'? '当面付' : '医保支付'}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="paymentAmount"
                              title="交易金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.paymentAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="paymentCount"
                              title="交易笔数"
                              width="120"></vxe-table-column>
            <vxe-table-column field="refundAmount"
                              title="退款金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.refundAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="refundCount"
                              title="退款笔数"
                              width="120"></vxe-table-column>
            <vxe-table-column field="dailyName"
                              title="日结人员"
                              width="120"></vxe-table-column>
            <vxe-table-column field="dailyTime"
                              title="日结时间"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="action"
                              title="操作"
                              fixed="right"
                              width="140">
              <template v-slot="{row}">
                <Button style="margin-left: 8px;"
                        size="small"
                        type="default"
                        @click="reviewDailyReport(row)">预览报表</Button>
              </template>
            </vxe-table-column>
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
    <DailyBalance :visible="dailyBalanceVisible"
                  ref="dailyBalanceWrapper"
                  @updateList="getList(pageIndex, pageSize)"
                  @close="dailyBalanceVisible = false"></DailyBalance>
  </div>
</template>
<script>
import { dailyList, dailyDetailList } from '@/api/dailyManage'
import DailyBalance from './dailyBalance'
import moment from 'moment'

export default {
  name: 'dailyManage',
  components: {
    DailyBalance
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        type: 0,
        isYB: ''
      },
      tableData: [],
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      dailyBalanceVisible: false

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
    receiverList: {
      get: function () {
        return this.$store.getters.getExamDoctorDict
      },
      set: function () { }
    }
  },
  mounted () {
    // 获取财务科人员列表
    let params = {
      deptName: '财务科',
      deptId: ''
    }
    this.$store.dispatch("getExamDoctorDict", { params, btn: true }).then(res => {

      // 查询结算单列表
      this.getList()
    })

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
      // 非财务科人员登录，不进行日结操作
      // let btn = this.isClaimant()
      // if (!btn) return false

      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }

      // 格式化时间
      this.form.startDate = this.form.startDate != '' ? moment(this.form.startDate).format('YYYY-MM-DD') : ''
      this.form.endDate = this.form.endDate != '' ? moment(this.form.endDate).format('YYYY-MM-DD') : ''
      let params = Object.assign({}, this.form)
      delete params.type
      this.isLoading = true
      dailyList(pagination, params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          let result = data.data
          this.tableData = result.records
          this.totalSize = result.total
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

    // 修改日结类型
    dailyTypeChange (val) {
      if (val === 0) {
        this.form.isYB = ''
      } else if (val === 1) {
        this.form.isYB = false
      } else {
        this.form.isYB = true
      }
    },

    reviewDailyReport (row) {
      this.dailyBalanceVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.dailyBalanceWrapper.getDailyReport(params)
      })
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

    // 重置
    resetHandle () {
      this.form = {
        type: 0,
        isYB: ''
      }
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate)
      this.$set(this.form, 'endDate', curDate)
      this.totalSize = 0
      this.tableData = []
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
.daily-manage-page-wrapper {
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
