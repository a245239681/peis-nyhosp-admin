<template>
  <div class="modify-price-approve-wrapper">
    <Card>
      <Tabs value="all"
            v-model="name"
            :animated="false"
            @on-click="getList">
        <div slot="extra"
             class="search-title-wrapper">
          <span class="title">价格审批</span>
          <div class="title-right-tool">
            <Input search
                   enter-button
                   v-model="keyword"
                   style="width: 200px"
                   @on-search="getList()"
                   placeholder="搜索体检号或姓名" />
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
              <template slot="boApplyDate"
                        slot-scope="{row}">
                {{ row.boApplyDate | dateformat }}
              </template>
              <template slot="boAuditStatus"
                        slot-scope="{row}">
                {{ row.boAuditStatus == 1 ? '已审核' : '待审核'}}
              </template>
              <template slot="boStatus"
                        slot-scope="{row}">
                <!-- {{ row.boStatus == 1 ? '通过' : row.boStatus == 0 ?  '不通过' : ''}} -->
                <Tag color="success"
                     v-if="row.boStatus == 1">通过</Tag>
                <Tag color="error"
                     v-else-if="row.boStatus == 0">不通过</Tag>
                <span v-else></span>
              </template>
              <!-- <template slot="boRefuseReason"
                          slot-scope="{row}">
                  {{ row.boRefuseReason ? row.boRefuseReason : '无' }}
                </template> -->
              <template slot="action"
                        slot-scope="{row}">
                <div v-if="row.boAuditStatus == 1">
                  <Button type="primary"
                          size="small"
                          disabled
                          v-permission="['edit']"
                          style="margin-right:10px;"
                          @click="agree(row)">同意</Button>
                  <Button type="error"
                          size="small"
                          disabled
                          v-permission="['edit']"
                          @click="refuse(row)">拒绝</Button>
                </div>
                <div v-else>
                  <Button type="primary"
                          ghost
                          size="small"
                          v-permission="['edit']"
                          style="margin-right:10px;"
                          @click="agree(row)">同意</Button>
                  <Button type="error"
                          ghost
                          size="small"
                          v-permission="['edit']"
                          @click="refuse(row)">拒绝</Button>
                </div>
              </template>
            </Table>
          </div>

        </TabPane>
        <!-- <TabPane label="待审核" name="pending">
          <Table :columns="columns"
                  :data="tableData"
                  :loading="loading"
                  :highlight-row="true"
                  height="700"
                  max-heigt="700">
              <template slot="action"
                        slot-scope="{row}">
                <Button type="primary"
                        ghost
                        size="small"
                        v-permission="['edit']"
                        style="margin-right:10px;"
                        @click="agree(row)">同意</Button>
                <Button type="error"
                        ghost
                        size="small"
                        v-permission="['edit']"
                        @click="refuse(row)">拒绝</Button>
              </template>
           </Table>
        </TabPane>
        <TabPane label="已审核" name="checked">
          <Table :columns="columns"
                  :data="tableData"
                  :loading="loading"
                  :highlight-row="true"
                  height="700"
                  max-heigt="700">
              <template slot="action"
                        slot-scope="{row}">
                <Button type="primary"
                        ghost
                        size="small"
                        v-permission="['edit']"
                        style="margin-right:10px;"
                        @click="agree(row)">同意</Button>
                <Button type="error"
                        ghost
                        size="small"
                        v-permission="['edit']"
                        @click="refuse(row)">拒绝</Button>
              </template>
           </Table>
        </TabPane> -->
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
    <Edit :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="closeEditModal"></Edit>
  </div>
</template>

<script>
import Edit from './edit'
import { modifyMoneyList, modifyStatus } from '@/api/price_modifyPriceApprove.js'
export default {
  name: 'modifyPriceApprove',
  data () {
    return {
      keyword: '',
      columns: [
        {
          title: '体检号',
          key: 'boPeId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '患者姓名',
          key: 'patientName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '原价格',
          key: 'boOldPrice',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '申请价格',
          key: 'boNewPrice',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '申请人',
          key: 'boApplyManName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '申请时间',
          key: 'boApplyDate',
          slot: 'boApplyDate',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '审批人',
          key: 'boAuditManName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '审批状态',
          key: 'boAuditStatus',
          minWidth: 100,
          slot: 'boAuditStatus',
          align: 'center'
        },
        {
          title: '审批结果',
          slot: 'boStatus',
          key: 'boStatus',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '备注',
          key: 'boRemark',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '拒绝原因',
          tooltip: true,
          key: 'boRefuseReason',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          slot: 'action',
          fixed: 'right',
          align: 'center'
        }
      ],
      tabsList: [
        {
          name: 'all',
          label: '全部'
        },
        {
          name: 'pending',
          label: '待审核'
        },
        {
          name: 'checked',
          label: '已审核'
        }
      ],
      tableData: [],
      loading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      editModalVisible: false,
      name: 'all',
      boAuditStatus: '' //  审批状态
    }
  },
  components: {
    Edit
  },
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
          boAuditStatus: '',
          searchField: this.keyword.trim()
        }
      } else if (this.name == 'pending') {
        params = {
          boAuditStatus: '0',
          searchField: this.keyword.trim()
        }
      } else if (this.name == 'checked') {
        params = {
          boAuditStatus: '1',
          searchField: this.keyword.trim()
        }
      }
      if (this.loading) {
        return fasle
      }
      this.loading = true
      modifyMoneyList(pagination, params).then(({ data }) => {
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
    // 同意
    agree (row) {
      this.$Modal.confirm({
        title: '同意',
        content: '是否同意该条申请',
        onOk: async () => {
          console.log(row)
          let params = {
            boId: row.boId,
            boRefuseReason: row.boRefuseReason ? row.boRefuseReason : '',
            boStatus: '1'
          }
          const { data } = await modifyStatus(params)
          console.log(data)
          if (data.code == 0) {
            this.$Message.info('已审核，保存成功')
            this.getList(this.pageIndex, this.pageSize)
          } else {
            this.$Message.error(data.message)
          }
        },
        onCancel: () => {

        }
      })
    },

    // 拒绝
    refuse (row) {
      this.editModalVisible = true
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },

    closeEditModal () {
      this.editModalVisible = false
    },

    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    }
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
  // .ivu-table-wrapper {
  //   padding: 0 1px;
  // }
}
</style>
