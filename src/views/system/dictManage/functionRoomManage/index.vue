<template>
  <div class="func-room-dictmanage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">功能科室字典管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="keyword"
                 style="width: 210px"
                 @on-search="getList()"
                 placeholder="名称、拼音码、五笔码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
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
          <template slot="poIsPrtDeptRequest"
                    slot-scope="{row}">
            <td class="ivu-table-column-center">
              <div class="ivu-table-cell">
                {{row.poIsPrtDeptRequest == 0 ? '不打印' : '打印'}}
              </div>
            </td>
          </template>
          <template slot="poIsPrtReport"
                    slot-scope="{row}">
            <td class="ivu-table-column-center">
              <div class="ivu-table-cell">
                {{row.poIsPrtReport == 0 ? '不打印' : '打印'}}
              </div>
            </td>
          </template>
          <template slot="poIsViewPic"
                    slot-scope="{row}">
            <td class="ivu-table-column-center">
              <div class="ivu-table-cell">
                {{row.poIsViewPic == 0 ? '不打印' : '打印'}}
              </div>
            </td>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button :type="row.poStatus == 0 ? 'error' : 'default'"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.poStatus == 0 ? '停用' : '启用'}}</Button>
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
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
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
import Edit from './edit.vue'
import { funcDeptList, funcDeptUpdateStatus, funcDeptDelete } from '@/api/dict_funcRoomManage.js'
import { debuglog } from 'util'

export default {
  name: 'functionRoomManage',
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
          key: 'poSeq',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '机构名称',
          key: 'poOrgName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '科室名称',
          key: 'poDeptName',
          minWidth: 140,
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
          organName: '广西区妇幼',
          roomName: '妇科',
          roomType: '妇科',
          pingyinCode: 'fuke',
          wubiCode: 'wubi',
          freeCode: '自定义',
          hisRoomCode: 'x001',
          hisRoomName: '妇科',
          isPrinList: '是',
          isPrintReport: '否',
          isLookPic: '否'
        }
      ],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      isLoading: false,
      loading: false,
      selections: [] // 表格选中项
    }
  },
  created () {

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
      // 防重复提交
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      funcDeptList(pagination, params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          let res = data.data
          this.totalSize = res.total
          this.tableData = res.records
          console.log(this.tableData)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        console.log(err)
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
      console.log(row)
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    deleteData (row) {
      // this.deleteModalVisible = true;
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            poId: row.poId
          }

          funcDeptDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该体检科室`)
              this.$store.dispatch('getFuncRoomDict', true)

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
    statusChange (row) {
      let status = 0
      let msg = ''
      if (row.poStatus == 0) {
        status = 1
        msg = '停用'
      } else {
        status = 0
        msg = '启用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该功能科室？`,
        onOk: () => {
          let params = {
            poStatus: status,
            poId: row.poId
          }
          funcDeptUpdateStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}该功能科室`)
              this.$store.dispatch('getFuncRoomDict', true)
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
.func-room-dictmanage-wrapper {
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
