<template>
  <div class="exam-type-dict-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检类型字典管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 235px"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="类型名称、拼音码、五笔码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">添加分类</Button>
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
          <template slot="cdIsViewReport"
                    slot-scope="{row}">
            <span v-if="row.cdIsViewReport == '1'">关闭</span>
            <span v-if="row.cdIsViewReport == '0'">开启</span>
          </template>
          <template slot="cdGuidePrintStatus"
                    slot-scope="{row}">
            <span v-if="row.cdGuidePrintStatus == '0'">不打印指引单、附加表</span>
            <span v-else-if="row.cdGuidePrintStatus == '1'">只打印指引单</span>
            <span v-else-if="row.cdGuidePrintStatus == '2'">只打印附加表</span>
            <span v-else-if="row.cdGuidePrintStatus == '3'">同时打印指引单、附加表</span>
          </template>
          <template slot="cdStatus"
                    slot-scope="{row}">
            <Tag color="red"
                 v-if="row.cdStatus == '1'">停用</Tag>
            <Tag color="green"
                 v-if="row.cdStatus == '0'">启用</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button :type="row.cdStatus == 0 ? 'error' : 'default'"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.cdStatus == 0 ? '停用' : '启用'}}</Button>
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
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { dictCategoryList, dictCategorySave, dictCategoryStatus, dictCategoryDelete } from '@/api/dict_examTypeDict.js'

import Edit from './edit.vue'

export default {
  name: 'examTypeDict',
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
          title: '序号',
          key: 'cdSort',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '类型编号',
          key: 'cdCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '类型名称',
          key: 'cdName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '在线查看体检报告',
          slot: 'cdIsViewReport',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '附加表打印设置',
          slot: 'cdGuidePrintStatus',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '状态',
          slot: 'cdStatus',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 200,
          align: 'center'
        }
      ],
      tableData: [
        {
          sort: 1,
          number: '001',
          name: '青年体检',
          pyCode: 'qingniantijian',
          wbCode: 'fuck',
          remarks: '测试数据'
        }
      ],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
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
      dictCategoryList(pagination, params).then(({ data }) => {
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
    statusChange (row) {
      let status = 0
      let msg = ''
      if (row.cdStatus == 0) {
        status = 1
        msg = '停用'
      } else {
        status = 0
        msg = '启用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该体检类别？`,
        onOk: () => {
          let params = {
            cdStatus: status,
            cdId: row.cdId
          }
          dictCategoryStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}该体检类别`)
              this.$store.dispatch('getCategoryDict', true)
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
    deleteData (row) {
      // this.deleteModalVisible = true;
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          dictCategoryDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该体检类别数据`)
              this.$store.dispatch('getCategoryDict', true)

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
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
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
.exam-type-dict-wrapper {
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
}
</style>
