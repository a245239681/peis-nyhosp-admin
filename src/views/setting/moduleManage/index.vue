<template>
  <div class="module-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">系统模板管理</span>
        <div class="title-right-tool">
          <Form :model="formData"
                :label-width="80"
                ref="form"
                inline
                label-position="right">
            <FormItem label="模板名称">
              <Input v-model="formData.name"
                     size="small"
                     placeholder="请输入模板名称"></Input>
            </FormItem>
            <FormItem label="模板类型">
              <Select v-model="formData.type"
                      style="min-width: 160px"
                      size="small">
                <Option v-for="item in moduleTypeDict"
                        :value="item.code"
                        :key="item.code"
                        :label="item.name">
                  <span slot>{{item.name}}</span></Option>
              </Select>
            </FormItem>
          </Form>
          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="getList()">筛选</Button>

          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['edit']"
                  @click="add">新建模板</Button>
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
          <template slot="status"
                    slot-scope="{row}">
            <span v-if="row.status == 1">启用</span>
            <span v-else-if="row.status == 0">停用</span>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    @click="edit(row)"
                    v-permission="['edit']"
                    size="small">修改</Button>
            <Button :type="row.status == 1 ? 'error' : 'default'"
                    v-permission="['edit']"
                    style="margin-left: 8px;"
                    @click="statusChange(row)"
                    size="small">{{row.status == 1 ? '停用' : '启用'}}</Button>
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
          :moduleTypeDict="moduleTypeDict"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { moduleList, moduleType, moduleStatus } from '@/api/moduleManage'
import Edit from './edit.vue'

export default {
  name: 'moduleManage',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        {
          title: '模板类型',
          key: 'typeName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '模板名称',
          key: 'name',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '文件名',
          key: 'path',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '启用状态',
          slot: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 160,
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
      formData: {}, // 筛选数据
      moduleTypeDict: [], // 模板类型字典
      isLoading: false
    }
  },
  mounted () {
    this.getModuleType()
    this.getList()
  },
  methods: {
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = { page, size }

      // 防重复提交
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      moduleList(pagination, this.formData).then(({ data }) => {
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
        this.$Message.error(err.message)
      })
    },

    // 获取模板类型
    getModuleType () {
      moduleType({}).then(({ data }) => {
        if (data.code == 0) {
          this.moduleTypeDict = data.data
        } else {
          this.moduleTypeDict = []
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    add () {
      this.editModalVisible = true
      this.modalTitle = 0
      this.$nextTick(() => {
        this.$refs.editwrapper.init({})
      })
    },
    edit (row) {
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.init(params)
      })
    },
    deleteData (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.paId
          }
          clinicalDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`删除成功`)
              this.$store.dispatch('getClinicalType', true)

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
    statusChange (row) {
      let status = 0
      let msg = ''
      if (row.status == 0) {
        status = 1
        msg = '启用'
      } else {
        status = 0
        msg = '停用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该模板？`,
        onOk: () => {
          let params = {
            status: status,
            id: row.id
          }
          moduleStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}该模板`)
              this.getList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error(err.message)
          })
        },
        onCancel: () => {

        }
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
.module-manage-wrapper {
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
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
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
