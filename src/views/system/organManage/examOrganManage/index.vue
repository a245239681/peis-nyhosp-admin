<template>
  <div class="exam-organ-wrapper">
    <div class="exam-organ-content-wrapper">
      <Card style="width:100%;">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">体检机构管理</span>
          <div class="title-right-tool">
            <Input search
                   enter-button
                   style="width: 200px"
                   v-model="keyword"
                   @on-search="getList()"
                   placeholder="体检中心名称" />
            <Button type="primary"
                    style="margin-left: 8px;"
                    @click="add">添加</Button>
            <!-- <Button type="error"
                    style="margin-left: 8px;"
                    @click="deleteAllHandle"
                    :disabled="selections.length == 0">批量删除</Button> -->
          </div>
        </div>
        <div class="page-body clearfix">
          <Table :columns="columns"
                 :data="tableData"
                 :loading="isLoading"
                 @on-selection-change="selectChange">
            <template slot="action"
                      slot-scope="{row}">
              <!-- <Button :type="row.paStatus == 0 ? 'error' : 'default'"
                      v-permission="['edit']"
                      @click="statusChange(row)"
                      size="small">{{row.paStatus == 0 ? '停用' : '启用'}}</Button> -->
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
    </div>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { getOrganList, deleteOrgan } from '@/api/system_examOrganManage.js'
import Edit from './edit.vue'

export default {
  name: 'examOrganManage',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        // {
        //   width: 55,
        //   type: 'selection',
        //   align: 'center'
        // },
        {
          type: 'index',
          title: '序号',
          key: 'paSort',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '体检中心名称',
          key: 'sdName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '英文名',
          key: 'sdEngName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '通讯地址',
          key: 'sdAddress',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '邮政编码',
          key: 'sdPostCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '联系人',
          key: 'sdContactPerson',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '联系电话',
          key: 'sdTel',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '联系邮箱',
          key: 'sdEmail',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '中心代码',
          key: 'sdRelateCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 150,
          align: 'center'
        }
      ],
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格选中项
      keyword: '',
      isLoading: false
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
        searchField: this.keyword.trim()
      }
      // 防重复提交
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      getOrganList(pagination, params).then(({ data }) => {
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
      this.editModalVisible = true
      this.modalTitle = 0
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
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
    deleteData (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.sdId
          }
          deleteOrgan(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该体检机构`)
              // this.$store.dispatch('getExamType', true)

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
    // statusChange (row) {
    //   let status = 0
    //   let msg = ''
    //   if (row.paStatus == 0) {
    //     status = 1
    //     msg = '停用'
    //   } else {
    //     status = 0
    //     msg = '启用'
    //   }

    //   this.$Modal.confirm({
    //     title: '提示',
    //     content: `是否${msg}该检查类别？`,
    //     onOk: () => {
    //       let params = {
    //         status: status,
    //         id: row.paId
    //       }
    //       dictExamTypeStatus(params).then(({ data }) => {
    //         if (data.code == 0) {
    //           this.$Message.success(`已${msg}该检查类别`)
    //           this.$store.dispatch('getExamType', true)
    //           this.getList(this.pageIndex, this.pageSize)
    //         } else {
    //           this.$Message.error(data.message)
    //         }
    //       }).catch(err => {
    //         this.$Message.error('网络不稳定，请稍后重试')
    //       })
    //     },
    //     onCancel: () => {

    //     }
    //   })
    // },
    selectChange (val) {
      this.selections = val
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    }
    // deleteAllHandle () {
    //   this.$Modal.confirm({
    //     title: '提示',
    //     content: '是否删除所选数据？',
    //     onOk: () => {

    //     },
    //     onCancel: () => {

    //     }
    //   })
    // }
  }
}
</script>
<style lang="less">
.exam-organ-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  padding-right: 20px;
  .tree-search-wrapper {
    width: 100%;
    padding: 0 20px 0 15px;
    margin-bottom: 20px;
    padding-top: 10px;
  }
  .tree-wrapper {
    min-width: 250px;
  }
  .exam-organ-content-wrapper {
    width: 100%;
    height: inherit;
    min-height: calc(~'100% - 80px');
    display: flex;
  }
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
  .halo-tree {
    font-size: 12px;
    .node-title:hover {
      background-color: #2d8cf0;
      color: #fff;
      border-radius: 0;
    }
    .tree-node-el {
      background-color: transparent;
    }
    .node-selected {
      color: #2d8cf0;
      background-color: transparent;
      border: none;
    }
    .tree-expand {
      border: 1px solid #2d8cf0;
      color: #2d8cf0;
    }
    li:before {
      border-left: 1px dashed #2d8cf0;
    }
    li:after {
      border-top: 1px dashed #2d8cf0;
    }
    li.only-node:after {
      border-top: none;
    }
    li.leaf::after {
      border-top: 1px dashed #2d8cf0;
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
}
</style>
