<template>
  <div class="unit-person-manage-wrapper">
    <Card style="width:100%;height:100%;">
      <div class="main-body">
        <div class="guide-tree-wrapper">
          <Input search
                 enter-button
                 placeholder="搜索公司或分组"
                 v-model='filterText' />
          <ButtonGroup style='margin:15px 0;width:100%'>
            <Button style="width: 50%"
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
          <div class="guide-tree">
            <Spin size="large"
                  fix
                  v-if="treeLoading"></Spin>
            <vue-selecttree class="filter-tree"
                            :data="treeData"
                            :props="defaultProps"
                            node-key="id"
                            :highlight-current="true"
                            :default-expanded-keys="idArr"
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"
                            ref="tree"></vue-selecttree>
          </div>
        </div>
        <div class="unit-person-manage-right-wrapper">
          <div class="buttons-wrapper">
            <Button type="primary"
                    size="small"
                    ghost
                    style="margin-right:10px;"
                    @click="winReload">刷新页面</Button>
            <Button type="error"
                    size="small"
                    ghost
                    style="margin-right:10px;"
                    @click="handleRemoveBatch">批量移出分组</Button>

            <!-- <Button type="primary"
                      size="small"
                      ghost
                      style="margin-right:10px;"
                      @click="handleBatchAdd">批量加项</Button> -->
            <span class="line"
                  style="margin-right:10px;"></span>
            <Button type="primary"
                    size="small"
                    ghost
                    style="margin-right:10px;"
                    @click="handleBatchImport">批量导入人员</Button>
            <Button type="primary"
                    size="small"
                    ghost
                    style="margin-right:10px;"
                    @click="handleAdd">添加人员</Button>
            <Input search
                   enter-button="搜索"
                   placeholder="搜索人员"
                   clearable
                   v-model="keyword"
                   @on-search="getFilterList()"
                   style="width: auto" />
          </div>
          <div class="group-table">
            <!-- <Table border :columns="columns" :data="tableData"></Table> -->
            <div class="table">
              <Table :columns="columns"
                     :data="tableData"
                     :loading="isLoading"
                     height="710"
                     @on-selection-change="selectChange">
                <template slot="action"
                          slot-scope="{row}">
                  <Button type="error"
                          style="margin-left: 8px;"
                          v-permission="['edit']"
                          @click="deleteData(row)"
                          :disabled="row.canRemove == '0'"
                          size="small">移出分组</Button>
                  <!-- <Button type="default"
                          style="margin-left: 8px;"
                          @click="edit(row)"
                          size="small">体检加项</Button> -->
                  <!-- <Button type="default"
                          style="margin-left: 8px;"
                          v-permission="['edit']"
                          @click="edit(row)"
                          size="small">预约体检</Button> -->
                </template>
              </Table>

            </div>
            <div class="page-table">
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
          </div>
        </div>
      </div>
    </Card>
    <batch-add :visible="batchAddModalVisible"
               ref="batchAddwrapper"
               @close="batchAddModalVisible = false"></batch-add>
    <import :visible="batchImportModalVisible"
            ref="batchImportwrapper"
            :boUnitName="unitName"
            :boUnitId="unitId"
            :boGroupId="groupId"
            :boVisitSn="boVisitSn"
            :grouplist="groupList"
            @updateList="getFilterList"
            @close="closeBatchImportModal"></import>
    <Edit :visible="editModalVisible"
          :title="modalTitle"
          :boUnitName="unitName"
          :boUnitId="unitId"
          :boGroupId="groupId"
          :visitSn="boVisitSn"
          ref="editwrapper"
          @updateList="getFilterList(pageIndex, pageSize)"
          @close="closeEidtModal"></Edit>
  </div>
</template>
<script>
import BatchAdd from './batchAdd'
import Import from './import'
import Edit from './edit'
import vueSelecttree from '@/components/vue-selecttree'
import { UnitInfoTreeData } from '@/api/appointmentUnitManage.js'
import {
  unitPersonMasterList,
  removeGroup
} from '@/api/unitManage_unitPersonManage.js'

export default {
  name: 'unitPersonManage',
  components: {
    BatchAdd,
    Import,
    Edit,
    vueSelecttree
  },
  inject: ['reload'], // 注入依赖
  data () {
    return {
      treeData: [],
      idArr: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isexpand: false,
      formData: {
        input: ''
      },
      columns: [
        {
          width: 55,
          type: 'selection',
          align: 'center'
        },
        {
          title: '体检号',
          key: 'boPeId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'boName',
          minWidth: 90,
          align: 'center'
        },
        {
          title: '性别',
          key: 'boSex',
          minWidth: 90,
          align: 'center'
        },
        {
          title: '婚姻状况',
          key: 'boMaritalStatus',
          minWidth: 90,
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'boIdNo',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 100,
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
      isLoading: false,
      selections: [], // 表格选中项
      addItemTitle: '', // 加项弹框标题
      batchAddModalVisible: false,
      batchImportModalVisible: false,
      editModalVisible: false,
      keyword: '',
      unitId: '',
      unitName: '',
      groupId: '',
      boVisitSn: '',
      groupList: [],
      filterText: '',
      treeLoading: false
    }
  },
  watch: {
    // 节点过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    $route (to, from) {
      this.getTreeData()
    }
  },
  async mounted () {
    await this.getTreeData()
    // console.log(this.$route.params);
    if (Object.keys(this.$route.params).length > 0) {
      this.unitId = this.$route.params.unitId
      let unit = this.$route.params.unitName
      let visit = this.$route.params.unitVisit
      let arr = this.treeData
      arr.forEach((item, index) => {
        if (
          item.boUnitName == unit &&
          item.children.length !== 0 &&
          item.children[0].boVisitSn == visit
        ) {
          this.idArr.push(item.children[0].id)
        }
        if (item.boUnitName == unit) {
          this.$refs.tree.setCurrentKey(item.id)
        }
      })
      this.getList()
    }
  },
  methods: {
    transGroupName (tree) {
      tree.forEach(item => {
        // console.log(item)
        if (item.boGroupingName !== undefined) {
          item.label = item.boGroupingName
          delete item.boGroupingName
        } else {
          this.transGroupName(item.children)
        }
      })

      return tree
    },
    // 获取树数据
    async getTreeData () {
      let params = {
        keyword: this.filterText
      }
      this.treeLoading = true
      await UnitInfoTreeData(params)
        .then(({ data }) => {
          // console.log("data=>", data);
          this.treeLoading = false
          if (data.code == 0) {
            let res = data.data
            res.map(item => {
              item.label = item.boUnitName
              if (item.children.length > 0) {
                // item.children[0].label =
                //   "第" + Number(item.children[0].boVisitSn) + "次体检";
                let arr = item.children
                arr.forEach((v, i) => {
                  arr[i].label = '第' + Number(arr[i].boVisitSn) + '次体检'
                })
              }
            })
            // console.log(res)
            this.transGroupName(res)
            this.treeData = res
          } else {
            this.treeLoading = false
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.treeLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },

    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        keyword: this.keyword.trim(),
        unitId: this.unitId,
        groupId: this.groupId,
        unitVisitSn: this.boVisitSn
      }
      console.log(params)
      this.isLoading = true

      unitPersonMasterList(pagination, params)
        .then(({ data }) => {
          this.isLoading = false
          console.log(data)
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.tableData = res.records
            // console.log(this.tableData)
            this.tableData.forEach(item => {
              if (item.canRemove == '0') {
                item['_disabled'] = true
              }
            })
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
      this.editModalVisible = true
      this.modalTitle = 0

    },
    selectChange (val) {
      this.selections = val
      // console.log(this.selections)
    },

    // 单个移除分组
    deleteData (row) {
      console.log(row)
      this.$Modal.confirm({
        title: '提示',
        content: '是否移除分组？',
        onOk: () => {
          let params = {
            boBookingIds: [row.boBookingId]
          }
          removeGroup(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$Message.success(`已成功移除分组`)
                this.getFilterList()
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

    handleRemoveBatch () {
      let arr = []
      this.selections.map(item => {
        arr.push(item.boBookingId)
      })
      // console.log(arr)
      if (arr.length == 0) {
        this.$Message.warning('还未选择需要移除的人员')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否将所选人员移除分组？',
        onOk: () => {
          let params = {
            boBookingIds: arr
          }
          removeGroup(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$Message.success(`已成功移除分组`)
                this.getFilterList(this.pageIndex, this.pageSize)
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              console.log(err)
              this.$Message.error('网络不稳定，请稍后重试')
            })
        },
        onCancel: () => { }
      })
    },
    handleNodeClick (data, node) {
      // console.log(data)
      // console.log(node)
      switch (node.level) {
        case 1:
          this.unitId = data.boUnitId;
          this.unitName = data.boUnitName
          this.boVisitSn = ''
          this.groupId = ''
          this.groupList = []
          break;
        case 2:
          this.unitId = node.parent.data.boUnitId;
          this.unitName = node.parent.data.boUnitName
          this.boVisitSn = data.boVisitSn;
          this.groupId = ''
          this.groupList = []
          break;
        case 3:
          this.unitId = data.boUnitId
          this.unitName = data.boUnitName
          this.boVisitSn = data.boUnitVisitSn
          this.groupId = data.boGroupingId
          this.groupList = node.parent.data.children
          break;
      }
      this.getList()
    },

    getFilterList () {
      if (this.isLoading) {
        return false
      }
      let params = {
        groupId: this.groupId,
        unitId: this.unitId,
        unitVisitSn: this.boVisitSn,
        keyword: this.keyword.trim()
      }
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      this.isLoading = true
      unitPersonMasterList(pagination, params)
        .then(({ data }) => {
          // console.log(data)
          this.isLoading = false
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.tableData = res.records
            this.tableData.forEach(item => {
              if (item.canRemove == '0') {
                item['_disabled'] = true
              }
            })
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
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
    },
    // 点击批量加项
    handleBatchAdd () {
      this.batchAddModalVisible = true
    },
    // 关闭批量批量加项弹出窗
    closeBatchAddModal () {
      this.batchAddModalVisible = false
    },

    // 点击批量导入
    handleBatchImport () {
      if (!this.groupId) {
        this.$Message.warning('请选择单位及分组，再进行批量导入操作')
        return
      }
      this.batchImportModalVisible = true
      this.$nextTick(() => {
        this.$refs.batchImportwrapper.getTreeData()
        // this.$refs.batchImportwrapper.getList()
      })
    },

    // 关闭批量导入弹出框
    closeBatchImportModal () {
      this.batchImportModalVisible = false
    },

    // 点击打开添加/编辑人员弹出窗
    handleAdd () {
      console.log(this.groupId)
      if (!this.groupId) {
        this.$Message.warning('请选择单位分组')
        return
      }
      this.$nextTick(() => {
        this.$refs.editwrapper.getDeptList()
      })
      this.editModalVisible = true
    },
    // 关闭添加/编辑人员弹出窗
    closeEidtModal () {
      this.editModalVisible = false
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

    // 节点过滤
    filterNode (value, data, node) {
      console.log(value)
      console.log(data)
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

    winReload () {
      console.log('刷新页面')
      this.reload()
    }
  }
}
</script>
<style lang="less">
.unit-person-manage-wrapper {
  width: 100%;
  min-width: 1200px;
  height: auto;
  min-height: calc(~'100% - 80px');
  display: flex;
  .title {
    padding-left: 8px;
    position: relative;
    font-weight: bold;
    margin-bottom: 10px;
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
  .ivu-card-body {
    height: 100%;
  }
  .main-body {
    display: flex;
    height: 100%;
    .guide-tree-wrapper {
      min-width: 250px;
      padding: 0 10px 0 0;
      height: 100%;
      box-sizing: border-box;
      .guide-tree {
        min-height: 500px;
        max-height: 630px;
        overflow-y: auto;
        position: relative;
        width: 280px;
        .ma-tree-node__content {
          word-break: break-all; /* 不换行 */
          white-space: nowrap; /* 不换行 */
          overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
        }
        .ma-tree-node__label {
          width: 260px;
          word-break: break-all; /* 不换行 */
          white-space: nowrap; /* 不换行 */
          overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
        }
        &::-webkit-scrollbar {
          width: 5px;
          background-color: #eee;
        }
        &::-webkit-scrollbar-button {
          display: none;
        }
        &::-webkit-scrollbar-corner {
          display: none;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #e8e8e8;
        }
        /*滚动条样式*/
        .guide-tree::-webkit-scrollbar {
          /*滚动条整体样式*/
          width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
          height: 4px;
        }
        .guide-tree::-webkit-scrollbar-thumb {
          /*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }
        .guide-tree::-webkit-scrollbar-track {
          /*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }
    .unit-person-manage-right-wrapper {
      flex: 1;
      overflow: hidden;
      // width: calc(~'100% - 250px');
      .buttons-wrapper {
        height: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 5px;
        .line {
          width: 2px;
          height: 100%;
          background-color: #bbb;
        }
        .ivu-input-icon {
          right: 45px;
        }
      }
      .group-table {
        width: 100%;
        text-align: center;
        .ivu-table th {
          background-color: #d6eaff;
        }
        .page-table {
          margin-top: 24px;
        }
      }
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
