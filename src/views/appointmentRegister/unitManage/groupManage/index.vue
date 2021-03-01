<template>
  <div class="group-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">单位人员分组</span>
        <div class="title-right-tool">
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">添加分组</Button>
          <!-- <Button type="error"
                  style="margin-left: 8px;"
                  @click="deleteAllHandle"
                  :disabled="selections.length == 0">批量删除</Button> -->
        </div>
      </div>
      <div class="main-body">
        <div class="main-body-wrapper">
          <div class="main-left-part">
            <div class="guide-tree-wrapper">
              <Input search
                     enter-button
                     placeholder="搜索公司"
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
                                :highlight-current='true'
                                :default-expanded-keys="idArr"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick"
                                ref="tree"></vue-selecttree>
              </div>
            </div>
          </div>
          <div class="main-right-part">
            <div class="group-table">
              <Table :columns="columns"
                     :data="tableData"
                     class="table"
                     height="710"
                     :loading="isLoading"
                     @on-selection-change="selectChange">
                <template slot="boStatus"
                          slot-scope="{row}">
                  <Tag color="green"
                       v-if="row.boStatus == 0">启用</Tag>
                  <Tag color="orange"
                       v-else>停用</Tag>
                </template>
                <template slot="action"
                          slot-scope="{row}">
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
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          :unitName="unitName"
          :unitId="unitId"
          :boVisitSn="boVisitSn"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="closeModal"></Edit>
  </div>
</template>
<script>
import Edit from './edit.vue'
import { saveUnitGroup, getUnitGroupList, delUnitGroup } from '@/api/groupManage.js'
import vueSelecttree from '@/components/vue-selecttree'
import { UnitInfoTreeData } from '@/api/appointmentUnitManage.js'
import { delimiter } from 'path';

export default {
  name: 'groupManage',
  components: {
    Edit,
    vueSelecttree
  },
  data () {
    return {
      treeData: [],
      idArr: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isexpand: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          minWidth: 70,
          align: 'center'
        },
        {
          title: '单位名称',
          key: 'boUnitName',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '分组名称',
          key: 'boGroupingName',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '性别',
          key: 'boSex',
          minWidth: 70,
          align: 'center'
        },
        {
          title: '年龄限制',
          key: 'boAgeLimit',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '结算人数',
          key: 'settleNumber',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '标准价格',
          key: 'boGroupingPrice',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '分组支付方式',
          key: 'boGroupPayMethod',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '加项支付方式',
          key: 'boAddPayMethod',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '启用状态',
          slot: 'boStatus',
          minWidth: 100,
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
      isLoading: false,
      treeLoading: false,
      selections: [], // 表格选中项
      unitName: '',
      unitId: '',
      // groupId: '',
      boVisitSn: '',
      filterText: '',
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
    console.log(this.$route.params)
    if (Object.keys(this.$route.params).length > 0) {

      this.unitId = this.$route.params.unitId
      this.unitName = this.$route.params.unitName
      this.boVisitSn = this.$route.params.unitVisit
      let unit = this.$route.params.unitName
      let visit = this.$route.params.unitVisit
      let arr = this.treeData
      console.log(arr)
      arr.forEach((item, index) => {
        if (item.boUnitName == unit && item.children.length !== 0 && item.children[0].boVisitSn == visit) {
          this.idArr.push(item.children[0].id)
          this.$refs.tree.setCurrentKey(item.children[0].id)
          // console.log(this.unitId)
          // console.log(this.boVisitSn)
        }

      })
      this.getList()
    }
  },
  methods: {
    handleNodeClick (data, node) {
      console.log(data)
      console.log(data.boVisitSn + '123')
      this.boVisitSn = data.boVisitSn
      if (data.boVisitSn) {
        this.unitName = node.parent.data.boUnitName
        this.unitId = node.parent.data.boUnitId
        this.groupId = ''

      } else {
        return false;
      }
      this.getList();
    },
    // 获取树数据
    async getTreeData () {
      let params = {
        keyword: this.filterText
      }
      this.treeLoading = true
      await UnitInfoTreeData(params).then(({ data }) => {
        // console.log('data=>', data)
        this.treeLoading = false
        if (data.code == 0) {
          let res = data.data
          res.map(item => {
            item.label = item.boUnitName
            if (item.children && item.children.length > 0) {
              // item.children.splice(0, item.children.length - 1)
              // item.children[0].label = '第' + Number(item.children[0].boVisitSn) + '次体检'
              // delete item.children[0].children;
              item.children.forEach(items => {
                items.label = '第' + Number(items.boVisitSn) + '次体检'
                if (items.children && items.children.length > 0) {
                  delete items.children
                }
              })
            }
          })
          this.treeData = res
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.treeLoading = false
        this.$Message.error(err.message)
        console.log(err)
      })
    },
    //获取表格数据
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        boUnitId: this.unitId,
        boUnitVisitSn: this.boVisitSn || ''
      }
      //防止重复点击
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      getUnitGroupList(pagination, params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          let res = data.data
          this.totalSize = res.total
          this.tableData = res.records
          this.tableData.forEach(item => {
            if (item.boAgeLowerBound && item.boAgeUpperBound) {
              item.boAgeLimit = `${item.boAgeLowerBound}-${item.boAgeUpperBound}`
            } else if (item.boAgeLowerBound && (item.boAgeLowerBound === null || item.boAgeLowerBound === 0)) {
              item.boAgeLimit = `${item.boAgeLowerBound}以上`
            } else if ((item.boAgeLowerBound === null || item.boAgeLowerBound === 0) && item.boAgeUpperBound) {
              item.boAgeLimit = `${item.boAgeUpperBound}以下`
            } else {
              item.boAgeLimit = `不限`
            }
            item.boGroupingPayType && item.boGroupingPayType == '0' ? item.boGroupPayMethod = '单位支付' : item.boGroupPayMethod = '个人支付';
            item.boAddPayType && item.boAddPayType == '0' ? item.boAddPayMethod = '单位支付' : item.boAddPayMethod = '个人支付';
          })
          console.log(this.tableData)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    add () {
      if (this.unitId && this.boVisitSn) {
        this.editModalVisible = true
        this.modalTitle = 0
        this.$nextTick(() => {
          this.$refs.editwrapper.getItemList({})
        })
      } else {
        this.$Message.warning('添加分组，需点击左侧公司菜单下最近一次体检')
      }
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
            id: row.boId
          }
          delUnitGroup(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该分组`)

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
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },
    closeModal () {
      this.editModalVisible = false;
    },

    show () {
      this.isexpand = true
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand;
        }
      });
    },
    hide () {
      this.isexpand = false
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand;
        }
      });
    },
    // 节点过滤
    filterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true;
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true;
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node);
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level;
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false;
      }
      // 先取当前节点的父节点
      let parentData = node.parent;
      // 遍历当前节点的父节点
      let index = 0;
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true;
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent;
        index++;
      }
      // 没匹配到返回false
      return false;
    },
  }
}
</script>
<style lang="less">
.group-manage-wrapper {
  width: 100%;
  min-width: 1200px;
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
  .main-body-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    .main-left-part {
      // width: 210px;
      height: auto;
      // margin-right: 20px;
      .guide-tree-wrapper {
        min-width: 230px;
        padding: 0 10px 0 0;
        height: 100%;
        box-sizing: border-box;
        .guide-tree {
          min-height: 610px;
          max-height: 610px;
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
    }
    .main-right-part {
      flex: 1;
      overflow: hidden;
      height: auto;
    }
  }
  .main-body {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .group-tree-wrapper {
      width: 17%;
      .search-group-btn,
      .expand-btn,
      .group-tree {
        width: 100%;
      }
      .expand-btn {
        margin: 10px 0;
      }
      .group-tree {
        max-height: 680px;
        overflow-y: auto;
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
      }
    }
    .group-table {
      width: 100%;
      text-align: center;
      .page-table {
        margin-top: 24px;
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
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>
