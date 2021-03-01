<template>
  <div class="staff-dict-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">工作人员字典管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="姓名" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="add">添加</Button>
          <Button type="primary"
                  style="margin-left: 8px;"
                  :loading="loading"
                  v-permission="['add']"
                  @click="importHis">导入his人员</Button>
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
          <template slot="poCreateDate"
                    slot-scope="{row}">
            <span>{{row.poCreateDate | dateformat}}</span>
          </template>
          <template slot="poStatus"
                    slot-scope="{row}">
            <Tag color="green"
                 v-if="row.poStatus == 1">启用</Tag>
            <Tag color="orange"
                 v-else>停用</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button :type="row.poStatus == 0 ? 'default' : 'error'"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.poStatus == 0 ? '启用' : '停用'}}</Button>
            <Button type="default"
                    style="margin-left: 8px;"
                    v-permission="['edit']"
                    @click="edit(row)"
                    size="small">修改</Button>
            <Button type="error"
                    style="margin-left: 8px;"
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
import { getStaffList, staffStatus, staffDelete, doctorDataSynchronous } from '@/api/system_accountInfo.js'
import Edit from './edit.vue'

export default {
  name: 'staffDict',
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
          title: '机构名称',
          key: 'orgName',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'poName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '性别',
          key: 'poSex',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '工号',
          key: 'poHisEmpNo',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '科室名称',
          key: 'poDeptName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '工作类别',
          key: 'poStaffType',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '职称',
          key: 'poJobTitle',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '拼音码',
          key: 'poPyCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '五笔码',
          key: 'poWbCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '创建日期',
          slot: 'poCreateDate',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '状态',
          slot: 'poStatus',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 200,
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
      isLoading: false,
      loading: false
    }
  },
  computed: {
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    }
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
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
      getStaffList(pagination, params).then(({ data }) => {
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
      let status = '0'
      let msg = ''
      if (row.poStatus == 0) {
        status = '1'
        msg = '启用'
      } else {
        status = '0'
        msg = '停用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该工作人员？`,
        onOk: () => {
          let params = {
            poStatus: status,
            poId: row.poId
          }
          staffStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}该工作人员`)
              this.$store.dispatch('getStaffDict', true)
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
            id: row.poId
          }
          staffDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该数据`)
              this.$store.dispatch('getStaffDict', true)

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
    },
    importHis () {
      // http://117.141.4.40:28087/api/his/doctorDataSynchronous
      let params = {
        DoctorType: '',
        DepartmentId: '',
        OrganizationId: ''
      }
      this.loading = true
      doctorDataSynchronous(params).then(({ data }) => {
        this.loading = false
        console.log(data)
        if (data.code == 0) {
          this.$Message.success('导入成功')
          this.getList()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('网络不稳定')
      })
    }
  }
}
</script>
<style lang="less">
.staff-dict-wrapper {
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
