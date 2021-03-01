<template>
  <div class="appointment-record-wrapper">
    <Card style="width:100%">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检预约记录</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="搜索" />
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="appointmentCols"
               :data="tableData"
               :loading="isLoading"
               @on-row-click="checkRecord">
          <template slot="bookingDate"
                    slot-scope="{row}">
            <span>{{row.bookingDate | dateformat}}</span>
          </template>
          <template slot="bookingExpireDate"
                    slot-scope="{row}">
            <span>{{row.bookingExpireDate | dateformat}}</span>
          </template>
          <template slot="settleStatus"
                    slot-scope="{row}">
            <Tag color="green"
                 v-if="row.settleStatus == 0">未结算</Tag>
            <Tag color="red"
                 v-else-if="row.settleStatus == 1">已结算</Tag>
            <Tag color="orange"
                 v-else>部分结算</Tag>
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

    <!-- 预约记录弹出查看框 -->
    <Edit :visible="editModalVisible"
          ref="editwrapper"
          @close="editModalVisible = false"></Edit>
  </div>
</template>

<script>
import { bookingList } from '@/api/appointmentRecord.js'
import Edit from './edit.vue'
export default {
  name: 'appointmentRecord',
  components: {
    Edit
  },
  data () {
    return {
      appointmentCols: [
        // {
        //   title: '序号',
        //   key: 'id',
        //   minWidth: 80,
        //   align: 'center'
        // },
        {
          title: '预约人',
          key: 'patientName',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '优先级',
          key: 'priority',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '单位名称',
          key: 'unitName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '部门',
          key: 'department',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '预约套餐',
          key: 'packageName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '折扣',
          key: 'discount',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '费别',
          key: 'chargeType',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '预约时间',
          slot: 'bookingDate',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '截止日期',
          slot: 'bookingExpireDate',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '结算状态',
          key: 'settleStatus',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '预约来源',
          key: 'source',
          minWidth: 120,
          align: 'center'
        },
      ],
      tableData: [
        {
          id: 1,
          name: 'nisa',
          type: '单位体检',
          piority: 'VIP',
          company: '啊哈哈有限公司',
          dept: '财务部',
          package: '精英套餐A',
          discount: '折扣',
          feeType: '公费',
          time: '2019-09-09 19:00:00',
          deadline: '2019-09-09 20:00:00',
          isSettlement: '已结算',
          source: '网络预约'
        }
      ],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      editModalVisible: false,
      keyword: ''
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
      let params = {
        text: this.keyword.trim()
      }
      this.isLoading = true
      bookingList(pagination, params).then(({ data }) => {
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
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    checkRecord (row) {
      // this.showRecord = true;
      // this.appointmentForm.name = this.appointmentTableData[0].name;
      // this.appointmentForm.company = this.appointmentTableData[0].company;
      this.editModalVisible = true
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    },
  }
}
</script>

<style lang="less">
.appointment-record-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  position: relative;
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
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
  .record-modal-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 10;
    .ivu-input {
      color: #000;
    }
  }
}
</style>


