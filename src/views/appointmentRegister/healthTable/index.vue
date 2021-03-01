<template>
  <div class="health-table-recover-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检表发放管理</span>
      </div>
      <div class="main-body page-body clearfix">
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
                <vue-selecttree class="filter-tree"
                                node-key="id"
                                :data="treeData"
                                :props="defaultProps"
                                :highlight-current="true"
                                :default-expand-all="isexpand"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick"
                                ref="tree"></vue-selecttree>
              </div>
            </div>
          </div>
          <div class="main-right-part">
            <div class="guide-table-form-wrapper">
              <Form :model="form"
                    label-position="right"
                    ref="form"
                    inline
                    style="flex:1"
                    :label-width="60">
                <FormItem label="扫码区"
                          :label-width="80"
                          prop="boRegisterCode">
                  <Input v-model="form.boRegisterCode"
                         style="width:150px"
                         size="small"
                         ref="inputFocus"
                         @on-enter="getList()"
                         clearable />
                </FormItem>
                <FormItem label="登记日期"
                          :label-width="80"
                          prop="boRegisterDateStart">
                  <DatePicker type="date"
                              v-model="form.boRegisterDateStart"
                              size="small"></DatePicker>
                </FormItem>
                <FormItem label="到"
                          :label-width="36"
                          prop="boRegisterDateEnd">
                  <DatePicker type="date"
                              v-model="form.boRegisterDateEnd"
                              size="small"></DatePicker>
                </FormItem>
                <FormItem label="体检编号"
                          prop="boPeIdStart"
                          :label-width="80">
                  <Input v-model="form.boPeIdStart"
                         style="width:100px"
                         size="small"
                         clearable></Input>
                </FormItem>

                <FormItem label="到"
                          prop="boPeIdEnd"
                          :label-width="28">
                  <Input v-model="form.boPeIdEnd"
                         style="width:100px"
                         size="small"
                         clearable></Input>
                </FormItem>

                <FormItem label="患者姓名"
                          :label-width="80"
                          prop="name">
                  <Input v-model="form.name"
                         style="width:150px"
                         size="small"
                         clearable />
                </FormItem>
              </Form>
              <div class="handle-wrapper">
                <Button style="margin-left: 8px;"
                        type="primary"
                        @click="getList()">查询</Button>
              </div>
            </div>
            <div class="barcode-wrapper">
              <Tabs :value="defaultTabs"
                    :animated="false"
                    @on-click="tabsHandle">
                <TabPane label="全部"
                         name="3">
                </TabPane>
                <TabPane label="已发放"
                         name="1">
                </TabPane>
                <TabPane label="未发放"
                         name="0">
                </TabPane>
              </Tabs>
              <vxe-table ref="table"
                         border
                         resizable
                         show-overflow
                         show-header-overflow
                         highlight-hover-row
                         highlight-current-row
                         align="center"
                         :data="tableData"
                         :height="(screenHeight - 350) <= 350 ? 500 : (screenHeight - 350)"
                         :loading="isLoading">
                <vxe-table-column field="boPeId"
                                  title="体检号"
                                  min-width="140"></vxe-table-column>
                <vxe-table-column field="medicalName"
                                  title="姓名"
                                  min-width="100"></vxe-table-column>
                <vxe-table-column field="boUnitName"
                                  title="单位"
                                  min-width="160"></vxe-table-column>
                <vxe-table-column field="boMedicalTableIssueUserName"
                                  title="发放人"
                                  min-width="100"></vxe-table-column>
                <vxe-table-column field="boMedicalTableIssueDate"
                                  title="发放时间"
                                  min-width="160">
                  <template v-slot="{ row }">
                    <span v-if="row.boMedicalTableIssueDate">{{row.boMedicalTableIssueDate | dateformat}}</span>
                    <span v-else></span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="boRecipientName"
                                  title="领用人"
                                  min-width="100"></vxe-table-column>
                <vxe-table-column field="boRecipientIdNo"
                                  title="领用身份"
                                  min-width="160"></vxe-table-column>
                <vxe-table-column field="boRecipientPhone"
                                  title="领用手机"
                                  min-width="140"></vxe-table-column>
                <vxe-table-column field="boMedicalTableIssueStatus"
                                  title="发放状态"
                                  min-width="80">
                  <template v-slot="{ row }">
                    {{(row.boMedicalTableIssueStatus == '0' ? '未发放' : '已发放')}}
                  </template>
                </vxe-table-column>
                <vxe-table-column field="boRegisterCode"
                                  title="登记流水号"
                                  min-width="140"></vxe-table-column>
                <vxe-table-column field="action"
                                  title="操作"
                                  fixed="right"
                                  min-width="120">
                  <template v-slot="{ row }">
                    <Button type="default"
                            v-if="row.boMedicalTableIssueStatus == '0'"
                            style="margin-left: 8px;"
                            v-permission="['edit']"
                            @click="provideHandle(row)"
                            size="small">发放</Button>
                    <Button v-else
                            type="error"
                            style="margin-left: 8px;"
                            v-permission="['edit']"
                            @click="recoverHandle(row)"
                            size="small">恢复</Button>
                  </template>
                </vxe-table-column>
              </vxe-table>
            </div>
          </div>
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
      </div>
    </Card>
    <Receiver :visible="receiverModalVisible"
              ref="receiverWrapper"
              @updateList="getList(pageIndex, pageSize)"
              @close="receiverModalVisible = false"></Receiver>
  </div>
</template>
<script>
import Receiver from './receiver'
import vueSelecttree from '@/components/vue-selecttree'
import { UnitInfoTreeData } from '@/api/appointmentUnitManage.js'
import { healthTableList, healthTableUpdate } from '@/api/healthTable'
import moment from 'moment'
export default {
  name: 'healthTable',
  components: {
    vueSelecttree,
    Receiver
  },
  data () {
    return {
      isexpand: false,
      screenHeight: document.body.clientHeight,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      form: {
        boMedicalTableIssueStatus: ''
      },
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      tableData: [],
      defaultTabs: '3',
      receiverModalVisible: false
    }
  },
  watch: {
    // 节点过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    screenHeight (val) {
      if (!this.timer) {
        this.screenHeight = val
        this.timer = true
        let that = this
        setTimeout(() => {
          that.timer = false
        }, 300)
      }
    }
  },
  mounted () {
    // 动态计算可视窗口高度
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
    let curDate = moment().format('YYYY-MM-DD')
    this.form.boRegisterDateStart = curDate
    this.form.boRegisterDateEnd = curDate
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
    this.getList()
    this.getTreeData()
  },
  methods: {
    // 获取树数据
    async getTreeData () {
      let params = {
        keyword: ''
      }
      this.treeLoading = true
      await UnitInfoTreeData(params)
        .then(({ data }) => {
          console.log('data=>', data)
          this.treeLoading = false
          if (data.code == 0) {
            let res = data.data
            // this.treeData = JSON.parse(JSON.stringify(res).replace(/'boUnitName'/g, 'label').replace(/'boGroupingName'/g, 'label'));
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
            this.transGroupName(res)
            let treeList = [{ label: '全部', id: 999999 }].concat(res)
            this.treeData = treeList
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey('999999')
            })
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
    transGroupName (tree) {
      tree.forEach(item => {
        if (item.boGroupingName !== undefined) {
          item.label = item.boGroupingName
          delete item.boGroupingName
        } else {
          this.transGroupName(item.children)
        }
      })
    },
    tabsHandle (name) {
      this.defaultTabs = name
      if (name == 3) {
        this.form.boMedicalTableIssueStatus = ''
      } else {
        this.form.boMedicalTableIssueStatus = name
      }
      this.getList()
    },

    // 体检表发放操作
    provideHandle (row) {
      this.receiverModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.receiverWrapper.getItemList(params)
      })
    },

    // 体检表恢复操作
    recoverHandle (row) {
      let params = Object.assign({}, row)
      params.type = 2
      delete params._XID

      healthTableUpdate(params).then(({ data }) => {
        if (data.code == 0) {
          this.$Message.success('操作成功')
          this.getList(this.pageIndex, this.pageSize)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err)
      })
    },

    // 获取发放列表
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 格式化时间
      const _startDate = this.form.boRegisterDateStart != '' ? moment(this.form.boRegisterDateStart).format('YYYY-MM-DD') : ''
      const _endDate = this.form.boRegisterDateEnd != '' ? moment(this.form.boRegisterDateEnd).format('YYYY-MM-DD') : ''
      this.form.boRegisterDateStart = _startDate
      this.form.boRegisterDateEnd = _endDate
      let params = Object.assign({}, this.form)

      this.isLoading = true
      healthTableList(pagination, params)
        .then(({ data }) => {
          this.isLoading = false
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.tableData = res.records
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error(err.message)
        })
    },

    // 扫码直接发放体检表
    sendBycode () {
      const params = {
        boRegisterCode: this.form.boRegisterCode,
        type: 1
      }
      healthTableUpdate(params).then(({ data }) => {
        if (data.code == 0) {
          this.$Message.success('体检表已发放')
          this.$set(this.form, 'boRegisterCode', '')
          this.$nextTick(() => {
            this.$refs.inputFocus.focus()
          })
          this.tabsHandle('3')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error(err)
      })
    },

    // 单位节点操作
    handleNodeClick (data, node) {
      console.log(data)
      console.log(node)
      this.form.boRegisterDateEnd = ''
      this.form.boRegisterDateStart = ''
      this.form.boUnitId = ''
      this.form.unitVisitSn = ''
      this.form.unitGroupId = ''
      this.form.boMedicalTableIssueStatus = ''
      this.defaultTabs = '3'
      if (data.label && data.label == '全部') {
        this.getList()
      } else {
        switch (node.level) {
          case 1:
            // this.form.unit = data.boUnitName
            this.form.boUnitId = data.boUnitId
            break
          case 2:
            // this.form.unit = node.parent.data.boUnitName
            this.form.boUnitId = node.parent.data.boUnitId
            this.form.unitVisitSn = data.boVisitSn
            break
          case 3:
            // this.form.unit = node.parent.parent.data.boUnitName
            this.form.boUnitId = node.parent.parent.data.boUnitId
            this.form.unitVisitSn = node.parent.data.boVisitSn
            this.form.unitGroupId = data.boGroupingId
        }
        this.getList()
      }
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
    // 全部展开
    show () {
      console.log(this.$refs.tree.store._getAllNodes())
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
    // 点击行选中或取消选中
    cellClickHandle ({ row, rowIndex, column, columnIndex }, event) {
      console.log(row)
      // this.$refs.barCodeTable.toggleRowSelection(row)
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
.health-table-recover-wrapper {
  width: 100%;
  min-width: 1400px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-form-item {
    margin-bottom: 6px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
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
  .main-body-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    .main-left-part {
      width: 200px;
      height: auto;
      margin-right: 20px;
    }
    .main-right-part {
      flex: 1;
      height: auto;
      overflow: hidden;
    }
  }
  .guide-table-form-wrapper {
    display: flex;
    justify-content: space-between;
  }
  .guide-tree-wrapper {
    .search-guide-btn,
    .expand-btn,
    .guide-tree {
      width: 100%;
    }
    .expand-btn {
      margin: 10px 0;
    }
    .guide-tree {
      max-height: 660px;
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
        height: 5px;
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
  .handle-wrapper {
    margin-left: 10px;
    margin-right: 20px;
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
  .ivu-form-item {
    margin-bottom: 0 !important;
  }
  .vxe-table .vxe-cell {
    text-align: center;
  }
  .vxe-checkbox > input + .vxe-checkbox--icon {
    text-align: left;
  }
}
</style>
