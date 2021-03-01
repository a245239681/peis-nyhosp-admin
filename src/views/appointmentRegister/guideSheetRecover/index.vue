<template>
  <div class="guide-sheet-recover-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">指引单回收管理</span>
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
                         @on-enter="recoverBycode"
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
                <FormItem label="体检日期"
                          :label-width="80"
                          prop="boExamTimeStart">
                  <DatePicker type="date"
                              v-model="form.boExamTimeStart"
                              size="small"></DatePicker>
                </FormItem>
                <FormItem label="到"
                          :label-width="36"
                          prop="boExamTimeEnd">
                  <DatePicker type="date"
                              v-model="form.boExamTimeEnd"
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
                <FormItem label="体检类型"
                          prop="boCategoryId"
                          :label-width="80">
                  <Select v-model="form.boCategoryId"
                          size="small"
                          style="min-width:150px"
                          clearable
                          @on-change="changeCategory"
                          :label-in-value="true">
                    <Option v-for="item in categoryList"
                            :value="item.cdId"
                            :key="item.cdId">{{item.cdName}}</Option>
                  </Select>
                </FormItem>
              </Form>
              <div class="handle-wrapper">
                <div><Button style="margin-left: 8px;width: 110px;"
                          type="primary"
                          v-permission="['leadingOut']"
                          @click="leadoutExcelHandle">导出为表格</Button></div>
                <div>
                  <Button style="margin-left: 8px;width: 110px;"
                          type="primary"
                          @click="getList()">查询</Button>
                </div>
              </div>
            </div>
            <div class="barcode-wrapper">
              <Tabs :value="defaultTabs"
                    :animated="false"
                    @on-click="tabsHandle">
                <TabPane label="全部"
                         name="3">
                </TabPane>
                <TabPane label="已回收"
                         name="1">
                </TabPane>
                <TabPane label="未回收"
                         name="0">
                </TabPane>
              </Tabs>

              <vxuTable :tableData="tableData"
                        :isLoading="isLoading"
                        ref="vxuTable"
                        :screenHeight="screenHeight"
                        @updateLoading="updateLoading"
                        @updateList="guideSheetUpdateRequest">
              </vxuTable>
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
  </div>
</template>
<script>
import vxuTable from './table'
import vueSelecttree from '@/components/vue-selecttree'
import { UnitInfoTreeData } from '@/api/appointmentUnitManage.js'
import { findGuideSheetRecoverList, guideSheetUpdate, guideSheetRecoverLeadout } from '@/api/guideSheetRecover'
import moment from 'moment'
export default {
  name: 'guideSheetRecover',
  components: {
    vxuTable,
    vueSelecttree
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
      form: {},
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      tableData: [],
      defaultTabs: '3',
      leadoutLoading: false
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
  computed: {
    // 体检类型列表
    categoryList: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
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
    this.$store.dispatch('getCategoryDict')
    let curDate = moment().format('YYYY-MM-DD')
    this.form.boRegisterDateStart = curDate
    this.form.boRegisterDateEnd = curDate
    this.form.boExamTimeStart = curDate
    this.form.boExamTimeEnd = curDate
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
        this.form.boGuideStatus = ''
      } else {
        this.form.boGuideStatus = name
      }
      this.getList()
    },

    // 获取指引单回收列表
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
      const _examStartDate = this.form.boExamTimeStart != '' ? moment(this.form.boExamTimeStart).format('YYYY-MM-DD') : ''
      const _examEndDate = this.form.boExamTimeEnd != '' ? moment(this.form.boExamTimeEnd).format('YYYY-MM-DD') : ''

      this.form.boRegisterDateStart = _startDate
      this.form.boRegisterDateEnd = _endDate
      this.form.boExamTimeStart = _examStartDate
      this.form.boExamTimeEnd = _examEndDate

      let params = Object.assign({}, this.form)

      this.isLoading = true
      findGuideSheetRecoverList(pagination, params)
        .then(({ data }) => {
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            let arr = res.records
            this.tableData = res.records
            this.$refs.vxuTable.reloadData(arr)
            // let xTable = this.$refs.table
            // xTable.reloadData(arr).then(() => {
            //   this.isLoading = false
            // })
            // console.log(this.tableData)
          } else {
            this.isLoading = false
            this.$refs.vxuTable.reloadData([])
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$refs.vxuTable.reloadData([])
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },

    updateLoading () {
      this.isLoading = false
    },
    // 扫码直接回收指引单
    recoverBycode () {
      const params = {
        boRegisterCode: this.form.boRegisterCode,
        type: 1
      }
      guideSheetUpdate(params).then(({ data }) => {
        if (data.code == 0) {
          this.$Message.success('指引单已回收')
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

    // 更改体检类型
    changeCategory (e) {
      if (!e) {
        this.form.boCategoryId = ''
      }
    },

    // 指引单回收
    guideSheetUpdateRequest (params) {
      guideSheetUpdate(params).then(({ data }) => {
        console.log(data)
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

    // 单位节点操作
    handleNodeClick (data, node) {
      console.log(data)
      console.log(node)
      this.form.boRegisterDateEnd = ''
      this.form.boRegisterDateStart = ''
      this.form.boExamTimeStart = ''
      this.form.boExamTimeEnd = ''
      this.form.boUnitId = ''
      this.form.unitVisitSn = ''
      this.form.unitGroupId = ''
      this.form.boGuideStatus = ''
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

    // 导出为Excel表格
    async leadoutExcelHandle () {
      if (this.leadoutLoading) return
      if (this.tableData.length <= 0) {
        this.$Message.warning('没有需要导出的数据')
        return false
      }

      this.leadoutLoading = true
      try {
        const { data } = await guideSheetRecoverLeadout(this.form)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '指引单回收统计.xlsx'
        link.click()
        this.$Message.success('操作成功')
      } catch (err) {
        this.leadoutLoading = false
        this.$Message.error(err.message)
      } finally {
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
.guide-sheet-recover-wrapper {
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
    width: 200px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    > div {
      display: flex;
      margin-top: 10px;
      justify-content: center;
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
