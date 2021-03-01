<template>
  <div class="modify-price-approve-wrapper">
    <Card>
      <Tabs value="noContact"
            v-model="name"
            :animated="false"
            @on-click="getList">
        <div slot="extra"
             class="search-title-wrapper">
          <span class="title">微信团检记录</span>
          <div class="title-right-tool">
            <!-- <Input search
                   enter-button
                   v-model="keyword"
                   style="width: 200px"
                   @on-search="getList()"
                   placeholder="搜索体检号或姓名" /> -->
            <DatePicker type="daterange" 
                        split-panels
                        placement="bottom-end" 
                        placeholder="请选择体检时间范围" 
                        @on-change="searchByDaterange"
                        style="width: 200px;margin-right: 12px;"></DatePicker>
          </div>
        </div>
        <TabPane :label="item.label"
                 :name="item.name"
                 v-for="(item, index) in tabsList"
                 :key="index">
          <div class="page-body clearfix">
            <Table :columns="columns"
                   :data="tableData"
                   :loading="loading"
                   :highlight-row="true"
                   height="700"
                   max-heigt="700">
              <template slot="boMedicalDate"
                        slot-scope="{row}">
                {{ row.boMedicalDate | dateformat }}
              </template>
              <template slot="boApplyStatus"
                        slot-scope="{row}">
                <Tag color="magenta"
                    v-if="row.boApplyStatus == 1">未联系</Tag>
                <Tag color="orange"
                    v-else-if="row.boApplyStatus == 2">已联系</Tag>
                <Tag color="green"
                    v-else-if="row.boApplyStatus == 3">已预约</Tag>
              </template>
              <template slot="action"
                        slot-scope="{row}">
                  <Button type="primary"
                          size="small"
                          v-permission="['edit']"
                          style="margin-right:10px;"
                          :disabled="row.boApplyStatus == 2 || row.boApplyStatus == 3"
                          @click="turnToContacted(row)" ghost>已联系</Button>
                  <Button type="primary"
                          size="small"
                          v-permission="['edit']"
                          :disabled="row.boApplyStatus == 3"
                          @click="turnToBooked(row)" ghost>已预约</Button>
              </template>
            </Table>
          </div>
        </TabPane>
      </Tabs>
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
    <!-- <Edit :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList"
          @close="closeEditModal"></Edit> -->
  </div>
</template>

<script>
import moment from 'moment'
// import Edit from './edit';
import { findAllByPage, updateWxBallCheckApply } from '@/api/unitManage_wxBallCheckApply.js'

export default {
  name: 'wxBallCheckApply',
  data () {
    return {
      columns: [
        {
          title: '联系人',
          key: 'boContact',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '联系方式',
          key: 'boPhone',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '团检人数',
          key: 'boPersonnelNum',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '预付（元）',
          key: 'boBudget',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '体检时间',
          key: 'boMedicalDate',
          minWidth: 100,
          slot: 'boMedicalDate',
          align: 'center',
        },
        {
          title: '申请状态',
          slot: 'boApplyStatus',
          key: 'boApplyStatus',
          minWidth: 100,
          align: 'center',
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          slot: 'action',
          fixed: 'right',
          align: 'center',
        }
      ],
      // 1: 未联系 2：已联系 3：已预约
      tabsList: [
        {
          name: 'all',
          label: '全部'
        },
        {
          name: 'noContact',
          label: '未联系'
        },
        {
          name: 'contacted',
          label: '已联系'
        },
        {
          name: 'booked',
          label: '已预约'
        }
      ],            
      tableData: [],
      loading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      // editModalVisible: false,
      name: 'all',
      // boApplyStatus: '1', //  申请状态
      medicalDateStart: '',
      medicalDateEnd: '',
    }
  },
  // components: {
  //   Edit
  // },
  mounted () {
    this.getList()
  },
  methods: {
    getList (page = 1, size = 20) {
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = null
      if (this.name == 'all') {
        params = {
          boApplyStatus: '',
          medicalDateStart: this.medicalDateStart || '',
          medicalDateEnd: this.medicalDateEnd || ''
        }
      } else if (this.name == 'noContact') {
        params = {
          boApplyStatus: '1',
          medicalDateStart: this.medicalDateStart || '',
          medicalDateEnd: this.medicalDateEnd || ''
        }
      } else if (this.name == 'contacted') {
        params = {
          boApplyStatus: '2',
          medicalDateStart: this.medicalDateStart || '',
          medicalDateEnd: this.medicalDateEnd || ''
        }
      } else if (this.name == 'booked') {
        params = {
          boApplyStatus: '3',
          medicalDateStart: this.medicalDateStart || '',
          medicalDateEnd: this.medicalDateEnd || ''
        }
      }
      if (this.loading) {
        return fasle
      }
      this.loading = true
      findAllByPage(pagination, params).then(({ data }) => {
        console.log(data)
        this.loading = false
        if (data.code == 0) {
          this.totalSize = data.data.total
          this.tableData = data.data.records
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    // 转为已联系状态
    turnToContacted (row) {
      this.$Modal.confirm({
        title: '同意',
        content: '是否同意该条转为已联系状态',
        onOk: async () => {
          console.log(row)
          let params = {
            boId: row.boId,
            boApplyStatus: '2'
          }
          const { data } = await updateWxBallCheckApply(params)
          console.log(data)
          if (data.code == 0) {
            this.$Message.info('修改申请状态成功');
            this.getList()
          } else {
            this.$Message.error(data.message)
          }

        },
        onCancel: () => {

        }
      });
    },
    // 转为已预约状态
    turnToBooked (row) {
      this.$Modal.confirm({
        title: '同意',
        content: '是否同意该条转为已预约状态',
        onOk: async () => {
          console.log(row)
          let params = {
            boId: row.boId,
            boApplyStatus: '3'
          }
          const { data } = await updateWxBallCheckApply(params)
          console.log(data)
          if (data.code == 0) {
            this.$Message.info('修改申请状态成功');
            this.getList()
          } else {
            this.$Message.error(data.message)
          }

        },
        onCancel: () => {

        }
      });
    },
    // // 拒绝
    // refuse (row) {
    //   this.editModalVisible = true
    //   let params = Object.assign({}, row)
    //   this.$nextTick(() => {
    //     this.$refs.editwrapper.getItemList(params)
    //   })
    // },

    // closeEditModal () {
    //   this.editModalVisible = false;
    // },

    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },
    // 按体检时间范围查询
    searchByDaterange(daterange) {
      console.log(daterange)
      this.medicalDateStart = daterange[0]
      this.medicalDateEnd = daterange[1]
      this.getList()
    },
  }
}
</script>

<style lang="less">
.modify-price-approve-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
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
    position: absolute;
    left: 15px;
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
  .ivu-tabs-nav-container {
    left: 100px;
  }
  .ivu-tabs {
    position: static;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>


