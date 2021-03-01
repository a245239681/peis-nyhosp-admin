<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="结算单明细"
           :width="1200"
           class="daily-detail-wrapper">
      <div class="modal-body">
        <vxe-table class="mytable-footer"
                   ref="workloadTable"
                   border
                   align="center"
                   show-footer
                   :auto-resize="true"
                   highlight-hover-row
                   row-class-name="table-row"
                   :height="500"
                   :data="tableData"
                   :seq-config="{startIndex: 0}"
                   :loading="isLoading">
          <vxe-table-column type="seq"
                            title="序号"
                            width="55"></vxe-table-column>
          <vxe-table-column field="peId"
                            title="体检号"
                            width="140"></vxe-table-column>
          <vxe-table-column field="invoiceNo"
                            title="发票号"
                            width="140"></vxe-table-column>
          <vxe-table-column field="name"
                            title="姓名"
                            width="120"></vxe-table-column>
          <vxe-table-column field="category"
                            title="体检类型"
                            width="120"></vxe-table-column>
          <vxe-table-column field="paymentType"
                            title="支付方式"
                            width="120"></vxe-table-column>
          <vxe-table-column field="paymentAmount"
                            title="实收金额（元）"
                            width="120">
            <template v-slot="{row}">
              <span>{{row.paymentAmount.toFixed(2)}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="dailyName"
                            title="收费员"
                            min-width="160"></vxe-table-column>
          <vxe-table-column field="dailyTime"
                            title="日结时间"
                            min-width="160"></vxe-table-column>
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
      <div slot="footer">
        <Button @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  dailyDetailList
} from '@/api/balance_feeDayBalance'
import {
  dailyYbDetailList
} from '@/api/MIFeeDayBalance'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      tableData: [],
      curDailyInfo: {} // 当前结算单信息
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },

    init (row) {
      if (Object.keys(row).length == 0) {


      } else {
        this.curDailyInfo = row
        this.getList()
      }
    },

    // 获取结算单明细
    getList (page = 1, size = 20) {

      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      this.isLoading = true

      let params = {
        keyword: '',
        boDailyStatus: '1',
        boDailyCode: this.curDailyInfo.dailyCode,
        isYb: (this.curDailyInfo.isYb === '1' ? true : false)
      }

      if (this.curDailyInfo.isYb === '1') {
        dailyYbDetailList(pagination, params)
          .then(({ data }) => {
            // console.log(data)
            this.isLoading = false
            if (data.code == 0) {
              let res = data.data
              this.totalSize = res.total
              this.tableData = res.records
            } else {
              this.$Message.error(data.message)
            }
          })
          .catch(err => {
            this.isLoading = false
            this.$Message.error(err.message)
          })
      } else {
        dailyDetailList(pagination, params)
          .then(({ data }) => {
            // console.log(data)
            this.isLoading = false
            if (data.code == 0) {
              let res = data.data
              this.totalSize = res.total
              this.tableData = res.records
            } else {
              this.$Message.error(data.message)
            }
          })
          .catch(err => {
            this.isLoading = false
            this.$Message.error(err.message)
          })
      }
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
.daily-detail-wrapper {
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
}
</style>
