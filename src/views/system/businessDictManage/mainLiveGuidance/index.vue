<template>
  <div class="main-live-guidance-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">主检生活指导</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="搜索指导分类名称" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新增</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               @on-selection-change="selectChange">
          <template slot="cdStatus"
                    slot-scope="{row}">
            <!-- {{row.cdStatus == '0' ? '停用' : '启用'}} -->
            <Tag color="green"
                 v-if="row.cdStatus == 1">启用</Tag>
            <Tag color="orange"
                 v-else>停用</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button :type="row.cdStatus == 0 ? 'default' : 'error'"
                    style="margin-left: 8px;"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.cdStatus == 0 ? '启用' : '停用'}}</Button>
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit(row)"
                    v-permission="['edit']"
                    size="small">修改</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    v-permission="['del']"
                    @click="deleteData(row)"
                    size="small">删除</Button>
          </template>
        </Table>
        <div class="page-footer">
          <Page :total="totalSize"
                :page-size="pageSize"
                :current="pageIndex"
                :page-size-opts="[10,20,40,50]"
                @on-change="pageIndexChange"
                @on-page-size-change="pageSizeChange"
                size="small"
                show-sizer
                show-elevator
                show-total />
        </div>
      </div>

    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref='editwrapper'
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>

<script>
import { dictChiefRecommedationList, dictChiefRecommedationStatus, dictChiefRecommedationDelete } from '@/api/busdict_mainLiveGuidance.js'
import Edit from './edit'

export default {
  name: 'mainLiveGuidance',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          key: 'cdSort',
          width: 90,
          align: 'center'
        },
        {
          title: '指导分类',
          key: 'cdType',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '指导内容',
          key: 'cdRecommedation',
          align: 'center'
        },
        {
          title: '状态',
          minWidth: 120,
          slot: 'cdStatus',
          key: 'cdStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData: [],
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      keyword: '',
      itemName: ''
    }
  },
  async created () {
    this.userInfo = this.$store.getters.getUserInfo
    console.log(this.userInfo.poOrgId)
  },
  mounted () {
    this.getList()
  },
  // watch: {
  //   keyword (newkeyword, oldkeyword) {
  //     if (newkeyword == '') {
  //       this.getList()
  //     }
  //   }
  // },
  methods: {
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        searchField: this.keyword.trim()
      }
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      dictChiefRecommedationList(pagination, params).then(({ data }) => {
        console.log(data)
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
    add () {
      this.modalTitle = 0
      this.editModalVisible = true
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    statusChange (row) {
      let status = '0'
      let msg = ''
      if (row.cdStatus == 0) {
        status = '1'
        msg = '启用'
      } else {
        status = '0'
        msg = '停用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}？`,
        onOk: () => {
          let params = {
            cdStatus: status,
            cdId: row.cdId
          }
          dictChiefRecommedationStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}`)
              this.getList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },
    edit (row) {
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    // 切换页码
    pageIndexChange (val) { // 页码
      this.getSearchList(val, this.pageSize || 20, this.itemName)
    },

    // 改变每页显示数
    pageSizeChange (val) { // page-size
      this.pageSize = val
      this.getSearchList(1, val, this.itemName)
    },
    deleteData (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          dictChiefRecommedationDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该生活指导`)

              let len = this.tableData.length - 1
              if (len > 0) {
                this.getList(this.pageIndex, this.pageSize)
              } else if (this.pageIndex != 1) {
                this.pageIndex = --this.pageIndex
                this.getList(this.pageIndex, this.pageSize)
              } else {
                this.getList(this.pageIndex, this.pageSize)
              }
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },
    selectChange (val) {
      this.selections = val
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },
    deleteAllHandle () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除所选数据？',
        onOk: () => {

        },
        onCancel: () => {

        }
      })
    }
  }
}
</script>

<style lang="less">
.main-live-guidance-wrapper {
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
  .ivu-card-body {
    height: calc(~'100% - 60px');
    padding-bottom: 0;
    .page-body {
      height: 100%;
      padding-bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .ivu-table-wrapper {
        position: relative;
      }
      .page-footer {
        position: relative;
        bottom: 0;
      }
    }
  }
}
</style>
