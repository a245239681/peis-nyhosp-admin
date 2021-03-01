<template>
  <div class="physical-exam-results-contrast-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检项目结果对照</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="keyword"
                 style="width: 200px"
                 @on-search="getList()"
                 placeholder="搜索结果描述" />
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
      <div class="main-body">
        <div class="tree-wrapper">
          <Input search
                 enter-button
                 placeholder="搜索体检科室或检查项目"
                 v-model='filterText' />
          <ButtonGroup style='margin:15px 0;width:100%'>
            <Button style="width: 50%;"
                    @click="show"
                    type="default">
              <Icon type="ios-arrow-down"
                    @click="show"></Icon>
              全部展开
            </Button>
            <Button style="width: 50%"
                    @click="hide"
                    type="default">
              全部收起
              <Icon type="ios-arrow-up"
                    @click="hide"></Icon>
            </Button>
          </ButtonGroup>
          <div class="tree">
            <Spin fix
                  v-if="treeLoading"></Spin>
            <m-tree class="filter-tree"
                    :data="treeData"
                    :props="defaultProps"
                    node-key="id"
                    :default-expanded-keys="[0]"
                    :highlight-current='true'
                    :filter-node-method="filterNode"
                    @node-click="handleNodeClick"
                    ref="tree">
            </m-tree>
          </div>
        </div>
        <div class="table-wrapper clearfix">
          <Table :columns="columns"
                 :data="tableData"
                 :loading="isLoading"
                 height="740"
                 border
                 @on-selection-change="selectChange">
            <template slot="cdResultType"
                      slot-scope="{row}">
              {{row.cdResultType == "0" ? '字符' : '数字'}}
            </template>
            <template slot="cdIsAbnormal"
                      slot-scope="{row}">
              {{row.cdIsAbnormal == "0" ? '是' : '否'}}
            </template>
            <template slot="cdStatus"
                      slot-scope="{row}">
              <!-- {{row.cdStatus == "0" ? '停用' : '启用'}} -->
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
          <div class="footer">
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
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          :itemName="curItemName"
          :itemId="curItemId"
          :deptId="curDeptId"
          :diagnosisName="curDiagnosisName"
          :diagnosisId="curDiagnosisId"
          @updateList="getList(pageIndex, pageSize)"
          @openEdit2="openEdit2"
          @openDiagnosisList="openDiagnosisList"
          @close="closeEditModal"></Edit>
    <Index :title="modalTitle1"
           :visible="editModalVisible1"
           @selected="itemSelected"
           @getItemName="getItemName"
           @close="editModalVisible1= false,editModalVisible = true"></Index>
    <diagnosis-list :visible="diagnosisVisible"
                    @cancel="diagnosisUnselected"
                    @dSelected="diagnosisSelected"
                    @getDiagnosisName="getDiagnosisName"
                    @close="diagnosisVisible= false,editModalVisible = true" />

  </div>
</template>

<script>
import {
  resultContrastList,
  resultContrastStatus,
  resultContrastDelete,
  getDeptTreeData
} from '@/api/busdict_physicalExamResultsContrast.js'

import Edit from './edit'
import Index from '../components/chooseList/index'
import DiagnosisList from '../components/diseaseDiagnosisList/index'

export default {
  name: 'physicalExamResultsContrast',
  components: {
    Edit,
    Index,
    DiagnosisList
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
          minWidth: 70,
          align: 'center'
        },
        {
          title: '体检项目',
          minWidth: 145,
          key: 'cdObjectName',
          align: 'center'
        },
        {
          title: '结果描述',
          key: 'cdResultDescription',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '结果下限',
          minWidth: 70,
          key: 'cdResultLower',
          align: 'center'
        },
        {
          title: '结果上限',
          minWidth: 70,
          key: 'cdResultUpper',
          align: 'center'
        },
        {
          title: '年龄下限',
          minWidth: 70,
          key: 'cdAgeLower',
          align: 'center'
        },
        {
          title: '年龄上限',
          minWidth: 70,
          key: 'cdAgeUpper',
          align: 'center'
        },
        {
          title: '对应性别',
          minWidth: 70,
          key: 'cdSex',
          align: 'center'
        },
        {
          title: '结果类型',
          minWidth: 70,
          slot: 'cdResultType',
          key: 'cdResultType',
          align: 'center'
        },
        {
          title: '是否正常',
          minWidth: 70,
          slot: 'cdIsAbnormal',
          key: 'cdIsAbnormal',
          align: 'center'
        },
        {
          title: '结果单位',
          minWidth: 95,
          key: 'cdResultUnit',
          align: 'center'
        },
        {
          title: '疾病诊断',
          minWidth: 100,
          key: 'cdDiseaseDiagnosis',
          align: 'center'
        },
        {
          title: '拼音码',
          minWidth: 75,
          key: 'cdPyCode',
          align: 'center'
        },
        {
          title: '五笔码',
          minWidth: 75,
          key: 'cdWbCode',
          align: 'center'
        },
        {
          title: '状态',
          minWidth: 90,
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
      filterText: '',
      defaultProps: {
        children: 'itemList',
        label: 'label'
      },
      treeData: [],
      treeLoading: false,
      tableData: [],
      isLoading: false,
      keyword: '',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      modalTitle1: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible1: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      curItemName: '',
      curItemId: '',
      curDeptId: '',
      curDiagnosisName: '',
      curDiagnosisId: '',
      diagnosisVisible: false, // //疾病诊断列表弹出框
      paItemName: '',
      itemId: '',
      itemName: '',
      treeLoading: false
    }
  },
  watch: {
    // 节点过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.getList()
    this.getTreeData()
  },
  methods: {
    toTreeData (tree) {
      tree.forEach(item => {
        if (item.itemName !== undefined) {
          item.label = item.itemName
          delete item.itemName
        } else {
          this.toTreeData(item.itemList)
        }
      })
      return tree
    },

    // 获取左侧树数据结构
    async getTreeData () {
      let params = {
        paItemName: this.paItemName
      }
      try {
        this.treeLoading = true
        const { data } = await getDeptTreeData(params)
        console.log(data)
        this.treeLoading = false
        if (data.code == 0) {
          let res = data.data
          let result = [
            {
              id: 0,
              label: '体检科室',
              itemList: [...res]
            }
          ]
          result[0].itemList.map(item => {
            item.label = item.deptName
          })
          this.toTreeData(result)
          console.log(result)
          this.treeData = result
        } else {
          this.treeLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        }
      } catch (err) { }
    },

    getList (page = 1, size = 20) {
      // this.pageIndex = page
      // this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        searchField: this.keyword.trim(),
        deptId: this.curDeptId ? this.curDeptId : '',
        itemId: this.itemId ? this.itemId : ''
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      resultContrastList(pagination, params)
        .then(({ data }) => {
          // console.log(data)
          this.isLoading = false
          if (data.code == 0) {
            this.totalSize = data.data.total
            this.tableData = data.data.records
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    add () {
      this.modalTitle = 0
      this.editModalVisible = true
      this.editModalVisible1 = false
      this.diagnosisVisible = false
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
        this.curItemName = this.itemName
        this.curItemId = this.itemId
      })
    },
    edit (row) {
      console.log(row)
      this.modalTitle = 1
      this.editModalVisible = true
      this.editModalVisible1 = false
      this.diagnosisVisible = false
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      this.curDiagnosisName = row.cdDiseaseDiagnosis
      this.curDiagnosisId = row.cdDiseaseDiagnosisId
      this.curItemName = row.cdObjectName
      this.curItemId = row.cdObjectId
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    // 关闭编辑框, 并清空编辑框的疾病名称的数据
    closeEditModal () {
      this.editModalVisible = false
      this.curItemName = ''
      this.curItemId = ''
      this.curDiagnosisName = ''
      this.curDiagnosisId = ''
    },
    openEdit2 () {
      // 打开体检项目页面 隐藏edit页面
      this.editModalVisible = false
      this.editModalVisible1 = true
      this.modalTitle1 = 0
    },
    // 关闭体检项目列表对话框，打开体检项目录入模板编辑框
    itemSelected (listVisible) {
      this.editModalVisible1 = listVisible
      this.editModalVisible = true
    },

    // 获取选中的项目名称
    getItemName (val) {
      // console.log(val)
      this.curItemName = val.curItemName
      this.curItemId = val.curItemId
      this.curDeptId = val.curDeptId
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
          resultContrastStatus(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$Message.success(`已${msg}`)
                this.getList()
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.$Message.error('网络不稳定，请稍后重试')
            })
        },
        onCancel: () => { }
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
          resultContrastDelete(params)
            .then(({ data }) => {
              // console.log(data)
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
            })
            .catch(err => {
              this.$Message.error('网络不稳定，请稍后重试')
            })
        },
        onCancel: () => { }
      })
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      // console.log(this.pageSize)
      this.getList()
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getList()
    },
    selectChange (val) {
      this.selections = val
    },
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
    // 打开疾病诊断列表对话框，关闭编辑框
    openDiagnosisList (visible) {
      this.diagnosisVisible = visible
      this.editModalVisible = false
    },
    // 获取选中的疾病名称
    getDiagnosisName (val) {
      // console.log(val)
      this.curDiagnosisName = val.curDiagnosisName
      this.curDiagnosisId = val.curDiagnosisId
    },

    // 节点过滤
    filterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },

    // 全部展开
    show () {
      this.isexpand = true
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
        }
      })
    },
    // 全部收起
    hide () {
      this.isexpand = false
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
        }
      })
    },

    async handleNodeClick (data, node) {
      // console.log(data)
      console.log(node)
      this.pageIndex = 1
      this.keyword = ''
      switch (node.level) {
        case 1:
          this.curDeptName = ''
          this.curDeptId = ''
          this.itemId = ''
          this.itemName = ''
          break
        case 2:
          this.curDeptName = data.deptName
          this.curDeptId = data.deptId
          this.itemId = ''
          this.itemName = ''
          break
        case 3:
          this.itemId = data.itemId
          this.itemName = data.label
          this.curDeptName = node.parent.data.deptName
          this.curDeptId = node.parent.data.deptId
          break
      }
      this.getList()
    }
  }
}
</script>

<style lang="less">
.physical-exam-results-contrast-wrapper {
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
    width: 100%;
    height: calc(~'100% - 60px');
    padding: 5px;
    .main-body {
      display: flex;
      width: 100%;
      height: 100%;
      .tree-wrapper {
        min-width: 250px;
        max-width: 300px;
        height: 100%;
        padding: 0 10px;
        .tree {
          width: 100%;
          min-height: 500px;
          max-height: 650px;
          overflow: auto;
          position: relative;
        }
        .m-tree-node > .m-tree-node__children {
          overflow: visible;
        }
      }
      .table-wrapper {
        max-width: calc(~'100% - 250px');
        .footer {
          margin-top: 20px;
          text-align: center;
        }
      }
    }
  }
  /*滚动条样式*/
  .tree::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .tree::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  .tree::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
