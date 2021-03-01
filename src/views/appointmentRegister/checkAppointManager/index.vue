<template>
  <div class="guide-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">检查申请单管理</span>
      </div>
      <div class="main-body">
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
            <vue-selecttree class="filter-tree"
                            :data="treeData"
                            :props="defaultProps"
                            node-key="id"
                            :default-expand-all="isexpand"
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"
                            ref="tree"></vue-selecttree>
            <!-- <unit-tree  :data="treeData"
                           :defaultProps="defaultProps"
                           :isExpand="isExpand"
                           ref="tree"
                           @node-click="handleNodeClick"/> -->
          </div>
        </div>
        <div class="guide-table">
          <Form :model="form"
                label-position="right"
                :label-width="80">
            <Row :gutter="16">
              <Col span="6">
              <FormItem label="姓名"
                        prop="name">
                <Input v-model="form.name"
                       size="small"
                       clearable />
              </FormItem>
              </Col>
              <Col span="9">
              <Row :gutter="16">
                <Col span="13">
                <FormItem label="体检编号"
                          prop="peStartId">
                  <Input v-model="form.peStartId"
                         size="small"
                         clearable></Input>
                </FormItem>
                </Col>
                <Col span="11">
                <FormItem label="到"
                          prop="peEndId"
                          :label-width="28">
                  <Input v-model="form.peEndId"
                         size="small"
                         clearable></Input>
                </FormItem>
                </Col>
              </Row>
              </Col>
              <Col span="6">
              <FormItem label="登记日期"
                        prop="regDateRange">
                <DatePicker type="daterange"
                            v-model="form.regDateRange"
                            split-panels
                            placeholder="选择登记日期范围"
                            placement="bottom-end"
                            style="width: 200px;"
                            size="small"></DatePicker>
              </FormItem>
              </Col>
              <Col span="3">
              <Button type="primary"
                      style="width: 80px;">查询</Button>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="6">
              <FormItem label="单位名称"
                        prop="boUnitId">
                <Select v-model="form.boUnitId"
                        size="small"
                        filterable
                        remote
                        clearable
                        :remote-method="getUnits"
                        :loading="unitNameLoading"
                        @on-change="changeUnitName"
                        placeholder="搜索单位">
                  <Option v-for="item in unitsList"
                          :value="item.boUnitId"
                          :key="item.boUnitId">{{ item.boUnitName }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="5">
              <FormItem label="体检分组"
                        prop="boGroupId">
                <Select v-model="form.boGroupId"
                        size="small">
                  <Option v-for="item in groupsList"
                          :value="item.boGroupId"
                          :key="item.boGroupId">{{ item.name }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="4">
              &nbsp;
              <!-- <FormItem label="打印状态" prop="printStatus">
                      <Select v-model="form.printStatus" size="small">
                          <Option :value="0">不限</Option>
                          <Option :value="1">未打印</Option>
                          <Option :value="2">已打印</Option>
                      </Select>
                    </FormItem> -->
              </Col>
              <Col span="6">
              &nbsp;
              </Col>
              <Col span="3">
              <Button type="primary"
                      style="width: 80px;">全部打印</Button>
              </Col>
            </Row>
          </Form>
          <!-- :loading="isLoading" -->
          <Table :columns="columns"
                 :data="tableData"
                 class="table"
                 height="580"
                 @on-selection-change="selectChange">
            <template slot="action"
                      slot-scope="{row}">
              <Button type="default"
                      style="margin-left: 8px;"
                      @click="check(row)"
                      size="small">查看</Button>
              <Button type="default"
                      style="margin-left: 8px;"
                      @click="print(row)"
                      size="small">打印</Button>
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
    </Card>
    <info ref="info"
          :visible="searchVisible"
          @func="getBasicInfo"
          @close="searchVisible = false">
      <!-- <div class="silde-btn" @click="searchVisible = true">
        <Icon type="ios-arrow-back" class="slide-icon"/>
      </div> -->
    </info>
  </div>
</template>
<script>
import Info from './search'
import vueSelecttree from '@/components/vue-selecttree'
import { listAllByUnitId, listByName } from '@/api/personal_register.js'
import { UnitAllInfoTreeData } from '@/api/appointmentUnitManage.js'

export default {
  name: 'guideSheetManage',
  components: {
    Info,
    vueSelecttree
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isexpand: false,
      searchVisible: false,
      unitGroups: [
        {
          title: '金源公司',
          expand: true,
          children: [
            {
              title: '第一次体检 2019-10-19',
              expand: true,
              children: [
                {
                  title: '男子组'
                },
                {
                  title: '女子组'
                }
              ]
            }
          ]
        },
        {
          title: '和湛公司',
          expand: true,
          children: [
            {
              title: '第二次体检 2019-10-29',
              expand: true,
              children: [
                {
                  title: '男子组'
                },
                {
                  title: '女子组'
                }
              ]
            }
          ]
        }
      ],
      columns: [
        {
          width: 55,
          type: 'selection',
          align: 'center'
        },
        {
          title: '体检编号',
          key: 'peId',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '年龄',
          key: 'age',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '单位名称',
          key: 'unitName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '体检次数',
          key: 'resultStatus',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '登记日期',
          key: 'regDate',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '体检状态',
          key: 'resultStatus',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '总检日期',
          key: 'regDate',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'regDate',
          minWidth: 120,
          align: 'center'
        },
        // {
        //   title: '指引单打印次数',
        //   key: 'printTimes',
        //   minWidth: 100,
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
      tableData: [
        {
          peId: '1',
          name: '李白',
          resultStatus: '0',
          sex: '男',
          age: '20',
          unitName: '腾讯',
          regDate: '2019',
          printTimes: '999'
        },
        {
          peId: '2',
          name: '李白',
          resultStatus: '0',
          sex: '男',
          age: '20',
          unitName: '腾讯',
          regDate: '2019',
          printTimes: '999'
        }
      ],
      form: {},
      totalSize: 100,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      isLoading: true,
      selections: [], // 表格选中项
      unitsList: [],
      groupsList: [],
      unitNameLoading: false,
      isPersonalActive: false,
      filterText: '',
      treeData: [],
    }
  },
  watch: {
    // 节点过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    // this.getList()
    this.getTreeData()
  },
  methods: {
    // 查询单位
    getUnits (query) {
      // console.log(query);
      if (query !== '') {
        this.unitNameLoading = true
        let unitParam = {
          boUnitName: query
        }
        listByName(unitParam).then(res => {
          let result = res.data
          if (result.code === 0) {
            this.unitNameLoading = false
            this.unitsList = result.data
          } else {
            this.unitNameLoading = false
            this.$Message.error(result.message)
          }
        })
      }
    },
    // 选取单位后，显示单位代码
    changeUnitName (unitId) {
      console.log(unitId)
      if (unitId != undefined) {
        for (let i = 0; i < this.unitsList.length; i++) {
          if (this.unitsList[i].boUnitId === unitId) {
            this.form.boUnitName = this.unitsList[i].boUnitName
          }
        }
        this.getGroups()
      } else {
        this.form.boUnitName = ''
        this.form.boUnitId = ''
      }
    },
    // 查询体检分组
    getGroups () {
      let groupParam = {
        boUnitId: this.form.boUnitId,
        boSex: ''
      }
      listAllByUnitId(groupParam).then(res => {
        let result = res.data
        if (result.code === 0) {
          this.groupsList = result.data
        } else {
          this.$Message.error(result.Message)
        }
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
        searchField: this.keyword.trim()
      }
      this.isLoading = true
      dictDeptList(pagination, params).then(({ data }) => {
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
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    print (row) {

    },
    check (row) {
      this.$refs.info.showInfo()
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
            id: row.cdId
          }
          dictDeptDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该体检类别`)
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
        content: `是否${msg}改体检类别？`,
        onOk: () => {
          let params = {
            poStatus: status,
            poId: row.poId
          }
          dictDeptUpdateStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}该体检类别`)
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
      this.getList(this.pageIndex, val)
    },
    // 点击个人，切换个人指引单管理
    selectPersonal () {
      this.isPersonalActive = true
    },
    // 点击某个公司，切换公司的指引单管理
    selectUnit (curNodeArr, curItem) {
      console.log(curNodeArr)
      console.log(curItem)
    },
    getBasicInfo (data) {
      console.log(data)
      // 接收子组件的传值
      // this.formData = {
      //   boPeId: data.basicInfo.boPeId,
      //   boVisitSn: data.basicInfo.boVisitSn,
      //   boName: data.basicInfo.boName,
      //   boPeType: data.basicInfo.boCategory,
      //   boSex: data.basicInfo.boSex,
      //   boAge: data.basicInfo.boAge,
      //   unitName: data.basicInfo.boUnitName,
      //   boPackageName: data.basicInfo.boPackageName
      // }
      // this.diagnosticTableData = data.diagnosticRecords
      // this.deptResultTableData = data.otherInfo.fenke
      // this.review = data.otherInfo.reviewList
      // this.suggest = data.otherInfo.suggestList
      // this.uncheckedItems = data.otherInfo.comboList
      // this.imgUrl = data.otherInfo.inComboId
      // this.doctor = this.userInfo.poName
      // this.operator = this.userInfo.poName
      // this.examDate = moment().format('YYYY-MM-DD')
      // this.disabled = data.disabled
      // console.log(this.suggest)
      // console.log(this.review)
    },
    handleNodeClick (data, node) {
      console.log('123')
    },

    transGroupName (tree) {
      tree.forEach(item => {
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
    getTreeData () {
      let params = {
        keyword: this.filterText
      }
      UnitAllInfoTreeData(params).then(({ data }) => {
        console.log('data=>', data)
        if (data.code == 0) {
          let res = data.data
          res.map(item => {
            item.label = item.boUnitName
            if (item.children.length > 0) {
              item.children[0].label = '第' + Number(item.children[0].boVisitSn) + '次体检'
            }
          })
          this.transGroupName(res)
          this.treeData = res
          console.log(this.treeData)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        // this.$Message.error('网络不稳定，请稍后重试')
      })
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
<style lang="less" scoped>
.guide-manage-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-guide {
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
  .main-body {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .guide-tree-wrapper {
      width: 280px;
      flex-shrink: 0;
      margin-right: 20px;
      .search-guide-btn,
      .expand-btn,
      .guide-tree {
        width: 100%;
      }
      .expand-btn {
        margin: 10px 0;
      }
      .guide-tree {
        max-height: 680px;
        overflow-y: auto;
        .personal {
          text-indent: 1.5em;
          font-size: 12px;
          .isActive,
          li span:hover {
            background-color: #d6eaff;
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
      }
    }
    .guide-table {
      flex: 1;
      overflow: hidden;
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
