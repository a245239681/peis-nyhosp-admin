<template>
  <div class="unit-dept-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">单位部门管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button="搜索"
                 placeholder="搜索姓名或体检号"
                 clearable
                 @on-search="getList()"
                 v-model="keyword"
                 style="width: 200px" />
          <!-- <Button
            type="primary"
            style="margin-left: 8px;"
            v-permission="['add']"
            @click="edit"
          >添加部门人员</Button> -->
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
                                @node-contextmenu="rightClick"
                                @node-click="handleNodeClick"
                                ref="tree"></vue-selecttree>

                <!--鼠标右键菜单栏，其实就是添加一个基于鼠标位置的模态框而已 -->

                <div v-show="menuVisible"
                     :style="{...rightMenu}"
                     id="menu"
                     class="menu">
                  <ul>
                    <li class="menu__item"
                        @click="addCardPing">添加同级部门</li>
                    <li class="menu__item"
                        @click="addCard">下级添加</li>
                    <li class="menu__item"
                        @click="editCard">修改部门名称</li>
                    <li class="menu__item"
                        @click="deleteCard">删除</li>
                    <!-- <li class="menu__item" @click="isAddCardPing = true">平级添加</li>
                    <li class="menu__item" @click="addCard">下级添加</li>
                    <li class="menu__item" @click="deleteCard">删除</li> -->
                  </ul>
                </div>

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
                  <Button type="primary"
                          style="margin-left: 8px;"
                          v-permission="['edit']"
                          @click="edit(row)"
                          size="small">修改</Button>

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
          :data="cascaderData"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="closeModal"></Edit>
    <tree-modal :title="modalTitle"
                :visible="treeModalVisible"
                ref="treeModal"
                :parentNodeName="parentNodeName"
                @add="addDept"
                @close="closeTreeModal"></tree-modal>
  </div>
</template>
<script>
import Edit from './edit.vue'
import TreeModal from './treeModal.vue'
import vueSelecttree from '@/components/vue-selecttree'
import {
  UnitDeptTreeData,
  unitDeptList,
  unitDeptSave,
  unitDeptDel
} from '@/api/unitManage_unitDeptManage.js'
import { delimiter } from 'path'

export default {
  name: 'unitDeptManage',
  components: {
    Edit,
    TreeModal,
    vueSelecttree
  },
  data () {
    return {
      treeData: [],
      idArr: [], // 更新单位树结构时，保留之前的展开树节点
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isexpand: false,
      columns: [
        // {
        //   title: '序号',
        //   type: 'index',
        //   minWidth: 70,
        //   align: 'center'
        // },
        {
          title: '体检号',
          key: 'boPeId',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'boName',
          minWidth: 180,
          align: 'center'
        },
        // {
        //   title: '性别',
        //   key: 'deptName',
        //   minWidth: 70,
        //   align: 'center'
        // },
        {
          title: '婚姻状态',
          key: 'boMaritalStatus',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '部门',
          key: 'boDepartment',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '子部门',
          key: 'boSubDepartmentName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '体检分组',
          key: 'boGroupingName',
          minWidth: 120,
          align: 'center'
        },
        // {
        //   title: '体检状态',
        //   key: 'boAddPayMethod',
        //   minWidth: 120,
        //   align: 'center'
        // },
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
      selections: [], // 表格选中项
      unitName: '',
      unitId: '',
      unitVisitSn: '', // 单位体检次数
      parentId: '', // 父级部门id
      parentName: '', // 父级部门名称
      subDeptId: '', // 子部门id
      subDeptName: '', // 子部门名称
      // groupId: '',
      boVisitSn: '',
      filterText: '',
      menuVisible: false,
      NODE: '', // 当前选中单位树节点
      keyword: '',
      treeModalVisible: false,
      parentNodeName: '', // 当前节点父级节点的名称
      parentNodeId: '', // 当前节点父级节点的id
      curNodeName: '', // 当前节点名称
      curNodeId: '', // 当前节点id
      treeLoading: '',
      rightMenu: '',
      cascaderData: [], // 编辑框里级联的数据
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
  mounted () {
    this.getTreeData()
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.handleScroll);   //  离开页面清除（移除）滚轮滚动事件
  },
  methods: {
    // 树节点右键点击事件
    rightClick (MouseEvent, object, Node, element) {
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.menuVisible = true // 显示自定义菜单栏
      // var menu = document.querySelector('#menu')
      // menu.style.left = MouseEvent.clientX - 300 + 'px'
      this.rightMenu = { top: MouseEvent.pageY + 'px', left: MouseEvent.pageX + 'px' }
      document.addEventListener('click', this.foo)

      // menu.style.top = MouseEvent.clientY - 80 + 'px'
      this.NODE = Node
      this.idArr.push(Node.data.id)
    },

    handleScroll () {
      this.menuVisible = false
    },
    foo () {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      // console.log(this.$refs.treeModal)
      if (this.$refs.treeModal) {
        this.$nextTick(() => {
          this.$refs.treeModal.$refs.inputFocus.focus()
        })
      }

      document.removeEventListener('click', this.foo) // 及时关掉监听，不关掉的是一个坑
    },

    // // 节点展开时触发
    // handleNodeExpand(object, node, element) {
    //   console.log('节点展开时触发', node)
    //   this.idArr.push(node.data.id)
    // },

    // // 节点折起时触发
    // handleNodeCollapse(object, node, element) {
    //   console.log('节点折起时触发', node)
    //   let id = node.data.id
    //   let index = this.idArr.findIndex( item => {
    //     return item == id
    //   })
    //   this.idArr.splice(index, 1)
    // },

    addCardPing () {
      this.modalTitle = 0

      this.unitId = ''
      this.parentNodeName = ''
      this.parentId = ''
      this.unitVisitSn = ''
      // console.log(this.$refs.treeModal)
      // console.log(this.NODE)
      if (this.NODE.level == 1) {
        this.$Message.warning('单位节点不能平级添加节点！')
        return false
      }
      if (this.NODE.level == 2) {
        this.$Message.warning('单位体检次数节点不能平级添加节点！')
        return false
      }

      this.treeModalVisible = true
      switch (this.NODE.level) {
        case 3:
          this.unitId = this.NODE.parent.parent.data.unitId
          this.parentNodeName = this.NODE.parent.data.label
          this.unitVisitSn = this.NODE.parent.data.boUnitVisitSn
          this.parentId = 0
          break
        case 4:
          this.unitId = this.NODE.data.unitId
          this.parentNodeName = this.NODE.parent.data.label
          this.parentId = this.NODE.data.parentId
          this.unitVisitSn = this.NODE.data.unitVisitSn
          break
      }
    },

    addCard () {
      this.modalTitle = 0
      // console.log(this.modalTitle)
      this.parentNodeName = ''
      this.parentId = ''
      this.unitVisitSn = ''
      if (this.NODE.level == 1) {
        this.$Message.warning('单位下级无法添加部门！')
        return false
      }
      if (this.NODE.level >= 4) {
        this.$Message.warning('子部门节点不能添加下级节点！')
        return false
      }

      this.treeModalVisible = true
      this.parentNodeName = this.NODE.data.label
      switch (this.NODE.level) {
        case 2:
          this.unitId = this.NODE.parent.data.unitId
          this.parentNodeName = this.NODE.data.label
          this.unitVisitSn = this.NODE.data.boUnitVisitSn
          this.parentId = 0
          break
        case 3:
          this.unitId = this.NODE.parent.parent.data.unitId
          this.parentNodeName = this.NODE.data.label
          this.unitVisitSn = this.NODE.data.unitVisitSn
          this.parentId = this.NODE.data.deptId
          break
        case 4:
          break
      }
      // console.log(this.unitId)
      // console.log(this.parentNodeName)
      // console.log(this.parentId)
      // console.log('下级添加')
    },

    editCard () {
      // console.log(this.NODE)
      if (this.NODE.level == 1) {
        this.$Message.warning('不能修改单位信息！')
        return false
      }
      if (this.NODE.level == 2) {
        this.$Message.warning('不能修改单位体检次数！')
        return false
      }
      this.treeModalVisible = true
      this.modalTitle = 1
      this.parentNodeName = this.NODE.parent.data.label
      console.log(this.parentNodeName)
      this.$nextTick(() => {
        this.$refs.treeModal.getItemList(this.NODE)
      })
    },

    // 新增、修改部门信息
    async addDept (val) {
      console.log('触发了')
      // console.log(this.unitId)
      console.log(this.NODE.data)
      let params = {}
      if (this.modalTitle == 0) { //新增时参数
        params = {
          boDeptName: val,
          boId: null,
          boParentId: this.parentId,
          boUnitVisitSn: this.unitVisitSn,
          boUnitId: this.unitId
        }
      } else {  // 修改时参数
        params = {
          boDeptName: val,
          boId: this.NODE.data.deptId,
          boUnitVisitSn: this.unitVisitSn,
          boParentId: null,
          boUnitId: this.unitId
        }
      }
      // console.log(params)
      try {
        let { data } = await unitDeptSave(params)
        console.log(data)
        if (data.code == 0) {
          if (this.modalTitle == 0) {
            this.idArr.push(this.NODE.data.id)
          }
          this.getTreeData()
        } else {
          this.$Message.error(data.message)
        }
      } catch (err) {
        this.$Message.error('网络不稳定，获取失败，请稍后重试1')
      }

    },

    deleteCard () {
      if (this.NODE.level == 1) {
        this.$Message.warning('不能删除单位节点！')
        return false
      }
      if (this.NODE.level == 2) {
        this.$Message.warning('不能删除单位体检次数节点！')
        return false
      }
      let msg = ''

      if (this.NODE.level == 3 && this.NODE.childNodes.length > 0) {
        msg = '删除父节点部门，会同时删除子部门，是否删除？'
      } else {
        msg = '是否删除该部门'
      }
      this.$Modal.confirm({
        title: '提示',
        content: msg,
        onOk: async () => {
          let params = {
            boId: this.NODE.data.deptId
          }
          try {
            let { data } = await unitDeptDel(params)
            // console.log(data)
            if (data.code == 0) {
              this.$Message.success(data.message)
              this.getTreeData()
            } else {
              this.$Message.error(data.message)
            }

          } catch (err) {
            this.$Message.error(err)
          }
        }
      })
      console.log('删除节点', this.NODE)
      console.log(this.NODE.data.deptId)
    },

    handleNodeClick (data, node) {
      console.log(data)
      console.log(node)
      if (!data.boUnitVisitSn && !data.unitVisitSn) return

      this.menuVisible = false
      this.keyword = ''
      switch (node.level) {
        case 1:
          this.unitId = data.unitId
          this.unitName = data.label
          this.unitVisitSn = ''
          this.parentName = ''
          this.parentId = ''
          this.subDeptName = ''
          this.subDeptId = ''
          break
        case 2:
          this.unitId = node.parent.data.unitId
          this.unitName = node.parent.data.label
          this.unitVisitSn = data.boUnitVisitSn
          this.parentName = node.parent.data.label
          this.parentId = ''
          this.subDeptName = ''
          this.subDeptId = ''
          break
        case 3:
          this.unitId = node.parent.parent.data.unitId
          this.unitName = node.parent.parent.data.label
          this.unitVisitSn = data.unitVisitSn
          this.parentName = node.parent.data.label
          this.parentId = data.deptId
          this.subDeptName = ''
          this.subDeptId = ''
          break
        case 4:
          // deptId父级部门id，subDeptId是子部门id
          this.unitId = data.unitId
          this.unitName = data.unitName
          this.unitVisitSn = data.unitVisitSn
          this.parentName = data.parentName
          this.parentId = data.parentId
          this.subDeptName = data.deptName
          this.subDeptId = data.deptId
          break
      }
      this.getList()
    },

    // 处理树数据
    transTreeData (tree) {
      tree.forEach(item => {
        // if (item.name !== undefined) {
        //   item.label = item.deptName
        // } else {
        //   item.label = item.name
        //   this.transTreeData(item.children)
        // }
        if (item.hasOwnProperty('unitVisitSnList')) {
          item.label = item.name
          item.children = item.unitVisitSnList
          delete item.unitVisitSnList
          this.transTreeData(item.children)
        } else if (item.hasOwnProperty('departmentList')) {
          item.label = '第' + item.boUnitVisitSn + '次体检'
          item.children = item.departmentList
          delete item.departmentList
          this.transTreeData(item.children)
        } else if (item.hasOwnProperty('children')) {
          item.label = item.name
          this.transTreeData(item.children)
        } else if (item.hasOwnProperty('parentName')) {
          item.label = item.deptName
        }
      })

      return tree
    },

    // 获取树数据
    async getTreeData () {
      let params = {
        unitName: this.filterText
      }
      try {
        this.treeLoading = true
        let { data } = await UnitDeptTreeData(params)
        console.log(data)
        this.treeLoading = false
        if (data.code == 0) {
          let res = this.transTreeData(data.data)
          this.treeData = res
        } else {
          this.$Message.error(data.message)
        }
      } catch (err) {
        this.treeLoading = false
        this.$Message.error(err.message)
      }
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
        name: '',
        bookingDate1: '',
        bookingDate2: '',
        groupId: '',
        peId1: '',
        peId2: '',
        unitVisitSn: this.unitVisitSn || '',
        sex: '',
        unitId: this.unitId ? this.unitId : '',
        deptId: this.parentId || '',
        subDeptId: this.subDeptId || '',
        keyword: this.keyword.trim()
      }

      //防止重复点击
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      unitDeptList(pagination, params)
        .then(({ data }) => {
          console.log(data)
          this.isLoading = false
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.tableData = res.records
          } else {
            this.tableData = []
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error(err.message)
        })
    },

    // 处理级联数据
    transCascaderData (arr) {
      // arr.forEach(item => {
      //   if (item.deptName !== undefined) {
      //     item.value = item.deptId

      //   } else {
      //     item.value = item.deptId
      //     this.transCascaderData(item.children)
      //   }
      // })
      arr.forEach(item => {
        item.value = item.deptId
        if (item.children) {
          item.children.forEach(v => {
            v.value = v.deptId
          })
        }
      })
      return arr
    },


    edit (row) {
      // console.log(this.treeData)
      // console.log(this.unitId)
      let unitVisitSnArr = this.treeData.filter(item => item.unitId == this.unitId)[0].children
      let curVisitSnArr = unitVisitSnArr.filter(item => item.boUnitVisitSn == this.unitVisitSn)[0].children
      this.cascaderData = curVisitSnArr
      // this.cascaderData = this.treeData.filter(item => item.unitId == this.unitId)[0].children
      this.transCascaderData(this.cascaderData)
      console.log(this.cascaderData)
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
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
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },
    closeModal () {
      this.editModalVisible = false
    },

    closeTreeModal () {
      this.treeModalVisible = false
    },

    show () {
      this.isexpand = true
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
        }
      })
    },
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
    }
  }
}
</script>
<style lang="less">
.unit-dept-manage-wrapper {
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
      height: auto;
      // margin-right: 10px;
      .guide-tree-wrapper {
        min-width: 250px;
        padding: 0 10px 0 0;
        height: 100%;
        box-sizing: border-box;
        .guide-tree {
          min-height: 500px;
          max-height: 570px;
          overflow-y: auto;
          // position: relative;
          // .menu__item {
          //   display: block;
          //   line-height: 20px;
          //   text-align: center;
          //   margin-top: 10px;
          // }
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
          .menu {
            position: fixed;
            display: block;
            z-index: 20000;
            background-color: #fff;
            padding: 5px 0;
            border: 1px solid #ebeef5;
            border-radius: 4px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            .menu__item {
              list-style: none;
              margin: 0;
              padding: 0 15px;
              font-size: 14px;
              line-height: 30px;
              cursor: pointer;
            }
            li:hover {
              background-color: #1790ff;
              color: white;
            }
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
  .ivu-input-icon {
    right: 50px;
  }
}
</style>
