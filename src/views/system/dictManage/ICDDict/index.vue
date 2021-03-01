<template>
  <div class="icd-dict-wrapper">
    <Card style="width: 100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">ICD字典</span>
        <div class="title-right-tool">
          <Input search
                 v-model="keyword"
                 enter-button
                 @on-search="getList()"
                 style="width: 235px"
                 placeholder="诊断名称、拼音码、五笔码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新增</Button>
        </div>
      </div>
      <div class="page-body">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading">
          <template slot="action"
                    slot-scope="{row}">
            <Button :type="row.cdStatus == 0 ? 'error' : 'default'"
                    style="margin-left: 8px;"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.cdStatus == 0 ? '停用' : '启用'}}</Button>
            <Button type="default"
                    style="margin-left: 8px;"
                    v-permission="['edit']"
                    @click="edit(row)"
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
import { baseIcdList, baseIcdStatus, baseIcdDelete } from '@/api/dict_ICD10.js'
import Edit from './edit.vue'
export default {
  name: 'ICDDict',
  components: {
    Edit
  },
  data () {
    return {
      keyword: '',
      columns: [
        // {
        //   width: 55,
        //   type: 'selection',
        //   align: 'center'
        // },
        {
          title: '序号',
          key: 'cdSort',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '类别',
          key: 'cdClass',
          minWidth: 120,
          align: 'center'
        },
        {
          title: 'ICD编码',
          key: 'cdCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: 'ICD附加码',
          key: 'cdCodeArrached',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '疾病诊断名称',
          key: 'cdName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '拼音码',
          key: 'cdPyCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '五笔码',
          key: 'cdWbCode',
          minWidth: 120,
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
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false
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
      baseIcdList(pagination, params).then(({ data }) => {
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
        status = '1'
        msg = '停用'
      } else {
        status = '0'
        msg = '启用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该ICD10字典？`,
        onOk: () => {
          let params = {
            cdStatus: status,
            cdId: row.cdId
          }
          baseIcdStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}该ICD10字典`)
              this.$store.dispatch('getICD10Dict', true)
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
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          baseIcdDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`删除成功`)
              this.$store.dispatch('getICD10Dict', true)

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
    // 切换页码
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
.icd-dict-wrapper {
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
  .icd-dict-body {
    display: flex;
  }
  .left-sidebar-wrapper {
    width: 200px;
    min-width: 200px;
    .room-list-wrapper {
      margin-top: 25px;
      max-height: 70vh;
      overflow-y: auto;
      li {
        padding-left: 10px;
        height: 32px;
        line-height: 32px;
        &:hover {
          color: #57a3f3;
          cursor: pointer;
        }
      }
      li.is-actived {
        color: #2d8cf0;
        background-color: #f0faff;
      }
    }
    ul::-webkit-scrollbar {
      width: 5px;
      background-color: #eee;
    }
    ul::-webkit-scrollbar-button {
      display: none;
    }
    ul::-webkit-scrollbar-corner {
      display: none;
    }
    ul::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
  }
  .right-sidebar-wrapper {
    margin-left: 15px;
    flex: 1;
    min-width: 800px;
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
