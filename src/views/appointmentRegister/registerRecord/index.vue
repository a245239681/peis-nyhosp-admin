<template>
  <div class="register-record-wrapper">
    <Card style="width:100%">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检预约记录</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 size="small"
                 v-model="keyword"
                 @on-search="getList()"
                 style="width: 200px"
                 placeholder="搜索" />
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="registerCols"
               :data="tableData"
               :loading="isLoading"
               @on-row-click="clickRecord">
        </Table>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40,100]"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
    <Edit :visible="editModalVisible"
          @close="editModalVisible = false"></Edit>
  </div>
</template>

<script>
import { registerList } from '@/api/registerRecord.js'

import Edit from './edit.vue'

export default {
  name: 'registerRecord',
  components: {
    Edit
  },
  data () {
    return {
      registerCols: [
        {
          title: '姓名',
          key: 'patientName',
          align: 'center'
        },
        {
          title: '来源',
          key: 'source',
          align: 'center'
        },
        {
          title: '体检次数',
          key: 'visitSn',
          align: 'center'
        },
        {
          title: '是否单位体检',
          key: 'isUnit',
          align: 'center'
        },
        {
          title: '单位名称',
          key: 'unitName',
          align: 'center'
        },
        {
          title: '优先级',
          key: 'priority',
          align: 'center'
        },
        {
          title: '费别',
          key: 'chargeType',
          align: 'center'
        },
        {
          title: '登记时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '指引单打印时间',
          key: 'printTime',
          align: 'center'
        },
        {
          title: '预约状态',
          key: 'status',
          align: 'center'
        },
        {
          title: '使用状态',
          key: 'useStatus',
          align: 'center'
        },
        {
          title: '操作人',
          key: 'operator',
          align: 'center'
        }
      ],
      tableData: [],
      totalSize: 100,
      pageIndex: 1,
      pageSize: 20,
      editModalVisible: false,
      isLoading: false,
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
      registerList(pagination, params).then(({ data }) => {
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
    clickRecord (data, index) {
      // console.log(data);
      // console.log(index);
      this.editModalVisible = true;
      this.curRecord = data;
      console.log(this.curRecord);
    }
  }
}
</script>

<style lang="less">
.register-record-wrapper {
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
}
</style>


