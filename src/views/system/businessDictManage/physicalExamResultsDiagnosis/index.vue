<template>
  <div class="physical-exam-results-diagnosis-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检项目结果录入_诊断</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 240px"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="搜索体检项目或诊断名称" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新增</Button>
          <!-- <Button type="error"
                  style="margin-left: 8px;"
                  @click="deleteAllHandle"
                  :disabled="selections.length == 0">批量删除</Button> -->
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading">
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
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.cdStatus == 0 ? '启用' : '停用'}}</Button>
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
        <div class="page-footer">
          <Page :total="totalSize"
                :page-size="pageSize"
                :current="pageIndex"
                size="small"
                :page-size-opts="[10,20,40,50]"
                @on-change="pageIndexChange"
                @on-page-size-change="pageSizeChange"
                show-sizer
                show-elevator
                show-total />
        </div>
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          :itemName="curItemName"
          :itemId="curItemId"
          :diagnosisName="curDiagnosisName"
          :diagnosisId="curDiagnosisId"
          :suggestion="curSuggestion"
          @updateList="getList(pageIndex, pageSize)"
          @openItemModal="openItemModal"
          @openDiagnosisList="openDiagnosisList"
          @close="closeEditModal"></Edit>
    <Index :title="itemModalTitle"
           :visible="itemVisible"
           @selected="itemSelected"
           @getItemName="getItemName"
           @close="itemVisible= false,editModalVisible = true"></Index>
    <Suggest :visible="diagnosisVisible"
             @cancel="diagnosisUnselected"
             @selected="diagnosisSelected"
             @getDiagnosisName="getDiagnosisName"
             @close="diagnosisVisible= false,editModalVisible = true" />
  </div>
</template>

<script>
import { dictItemAutoDiagnosisList, dictItemAutoDiagnosisStatus, dictItemAutoDiagnosisDelete } from '@/api/busdict_physicalExamResultsDiagnosis.js'

import Edit from './edit'
import Suggest from './suggest'
import Index from '../components/chooseList/index'

export default {
  name: 'physicalExamResultsDiagnosis',
  components: {
    Edit,
    Index,
    Suggest
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
          width: 100,
          align: 'center'
        },
        {
          title: '体检项目',
          key: 'itemName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '诊断名称',
          key: 'cdDiagName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '诊断建议',
          key: 'cdDiagRecommedation',
          minWidth: 250,
          // tooltip: true,
          align: 'center',
          render: (h, params) => {
            let texts = ''
            if (params.row.cdDiagRecommedation && params.row.cdDiagRecommedation !== null) {
              console.log(params.row.cdDiagRecommedation)
              if (params.row.cdDiagRecommedation.length > 20) {
                texts = params.row.cdDiagRecommedation.substring(0, 20) + '...'
              } else {
                texts = params.row.cdDiagRecommedation
              }
            }
            return h(
              'Tooltip',
              {
                props: {
                  placement: 'top',
                  transfer: true
                }
              },
              [
                texts,
                h(
                  'span',
                  {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all'
                    }
                  },
                  params.row.cdDiagRecommedation
                )
              ]
            )
          }
        },
        {
          title: '结果内容',
          key: 'cdItemDesc',
          // tooltip: true,
          minWidth: 200,
          align: 'center'
        },
        {
          title: '状态',
          key: 'cdStatus',
          slot: 'cdStatus',
          minWidth: 90,
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
      results: 1,
      keyword: '',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      itemModalTitle: 0, // 弹出框title，0为新增，1为编辑
      itemVisible: false,
      selections: [], // 表格勾选项集合
      curItemName: '',
      curItemId: '',

      curDiagnosisName: '',
      curDiagnosisId: '',
      curSuggestion: '',
      diagnosisVisible: false // //疾病诊断列表弹出框
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
        searchField: this.keyword.trim()
      }
      if (this.isLoading) {
        return fasle
      }
      this.isLoading = true
      dictItemAutoDiagnosisList(pagination, params).then(({ data }) => {
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
    edit (row) {
      console.log(row)
      this.modalTitle = 1
      this.editModalVisible = true
      this.itemVisible = false
      this.diagnosisVisible = false
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      this.curDiagnosisName = row.cdDiagName
      this.curDiagnosisId = row.cdDiagId
      this.curItemName = row.itemName
      this.curItemId = row.cdItemId
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
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
          dictItemAutoDiagnosisStatus(params).then(({ data }) => {
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
    // 打开体检项目页面 隐藏edit页面
    openItemModal () {
      this.itemVisible = true
      this.itemModalTitle = 0
    },
    // 打开疾病诊断列表对话框，关闭编辑框
    openDiagnosisList (visible) {
      this.diagnosisVisible = visible
      this.editModalVisible = false
    },
    // 关闭编辑框, 并清空编辑框里的数据
    closeEditModal () {
      this.editModalVisible = false
      this.curItemName = ''
      this.curItemId = ''
      this.curDiagnosisName = ''
      this.curDiagnosisId = ''
    },
    // 关闭体检项目列表对话框，打开体检项目录入诊断编辑框
    itemSelected (visible) {
      this.itemVisible = visible
      this.editModalVisible = true
    },
    // 点击取消，疾病诊断列表框点击取消后，返回编辑框
    diagnosisUnselected () {
      this.diagnosisVisible = false
      this.editModalVisible = true
    },
    // 点击选择诊断，关闭疾病诊断列表对话框，打开编辑框
    diagnosisSelected (visible) {
      this.diagnosisVisible = visible
      this.editModalVisible = true
    },
    // 获取选中的项目名称
    getItemName (val) {
      console.log(val)
      this.curItemName = val.curItemName
      this.curItemId = val.curItemId
    },
    // 获取选中的疾病名称
    getDiagnosisName (val) {
      console.log(val)
      this.curDiagnosisName = val.curDiagnosisName
      this.curDiagnosisId = val.curDiagnosisId
      this.curSuggestion = val.curSuggestion
    },
    deleteData (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          dictItemAutoDiagnosisDelete(params).then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.$Message.success(`删除成功`)

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
      this.getList(val, this.pageSize)
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
.physical-exam-results-diagnosis-wrapper {
  width: 100%;
  height: auto;
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
