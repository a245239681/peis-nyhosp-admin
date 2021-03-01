<template>
  <div class="batch-send-exam-wrapper">
    <Card style="width:100%;height:100%;">
      <div class="main-body">
        <div class="guide-tree-wrapper">
          <div class="flex-wrapper">
            <Input search
                   enter-button
                   placeholder="搜索公司或分组"
                   v-model="filterText" />
            <Button style="margin: 1px 10px 1px 10px;"
                    size="small"
                    @click="deptOrGroupChange"
                    type="primary">
              <Icon type="md-swap" />{{treeType == 1 ? '切换部门': '切换分组'}}
            </Button>

          </div>

          <ButtonGroup style="margin:15px 0;width:100%">
            <Button style="width: 50%"
                    @click="show"
                    type="default">
              <Icon type="ios-arrow-down"
                    @click="show"></Icon>全部展开
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
                            :default-expand-all="isexpand"
                            :filter-node-method="filterNode"
                            @node-click="handleNodeClick"
                            ref="tree"></vue-selecttree>
          </div>
        </div>
        <div class="unit-register-right-wrapper">
          <div class="form-wrapper">
            <div class="left-form">
              <Form :model="formData"
                    inline
                    :label-width="80">
                <div class="flex-row">
                  <FormItem label="姓名">
                    <Input v-model="formData.medicalName"
                           placeholder
                           size="small"
                           clearable></Input>
                  </FormItem>
                  <FormItem label="性别">
                    <Select v-model="formData.sex"
                            size="small"
                            :disabled="selectSex"
                            clearable>
                      <Option value="不限">不限</Option>
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="流水号"
                            :label-width="70">
                    <Input v-model="formData.registerCode"
                           placeholder
                           size="small"
                           clearable></Input>
                  </FormItem>
                  <FormItem label="组合项目">
                    <Input v-model="formData.comboName"
                           size="small"
                           clearable />
                  </FormItem>
                </div>
                <div class="flex-row">
                  <FormItem label="试管名称">
                    <Select v-model="formData.testTubeId"
                            :label-in-value="true"
                            filterable
                            clearable
                            @on-change="testTubeChange"
                            size="small">
                      <Option v-for="item in testTubeDict"
                              :value="item.paId"
                              :key="item.paId"
                              :label="item.paName">
                        <span slot>{{ item.paName }}</span></Option>
                    </Select>
                  </FormItem>
                  <FormItem label="送检状态">
                    <Select v-model="formData.inspectStatus"
                            size="small"
                            clearable>
                      <Option value="1">已送检</Option>
                      <Option value="0">未送检</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="登记日期">
                    <Row>
                      <Col span="11">
                      <DatePicker type="date"
                                  v-model="formData.registerStartDate"
                                  placeholder="请选择开始时间"
                                  :options="startTimeOption"
                                  @on-change="onStartTimeChange"
                                  size="small"></DatePicker>
                      </Col>
                      <Col span="2"
                           style="text-align: center">到</Col>
                      <Col span="11">
                      <DatePicker type="date"
                                  v-model="formData.registerEndDate"
                                  placeholder="请选择结束时间"
                                  :options="endTimeOption"
                                  @on-change="onEndTimeChange"
                                  size="small"></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                </div>
              </Form>
            </div>
            <div class="btn-wrapper">
              <Button type="primary"
                      style="margin-bottom:11px;"
                      @click="getList(pageIndex,pageSize)">查询</Button>
              <Button type="primary"
                      style="margin-bottom:11px;"
                      v-permission="['edit']"
                      :loading="sendExamLoading"
                      @click="sendExamHandle()">批量送检</Button>
              <Button type="error"
                      style="margin-bottom:11px;"
                      v-permission="['edit']"
                      :loading="sendExamCancelLoading"
                      @click="cancelSendExamHandle()">批量取消</Button>
            </div>
          </div>
          <div class="group-table">
            <div class="table">
              <vxe-table class="mytable-style"
                         resizable
                         highlight-hover-row
                         highlight-current-row
                         ref="xTable"
                         height="640"
                         size="medium"
                         align="left"
                         :data="tableData"
                         :loading="isLoading"
                         :checkbox-config="{trigger: 'row'}">
                <vxe-table-column type="checkbox"
                                  align="center"
                                  width="55"></vxe-table-column>
                <vxe-table-column field="registerCode"
                                  title="流水号"
                                  min-width="160"></vxe-table-column>
                <vxe-table-column field="medicalName"
                                  title="姓名"
                                  min-width="100"></vxe-table-column>
                <vxe-table-column field="barcode"
                                  title="条码号"
                                  min-width="160"></vxe-table-column>
                <vxe-table-column field="comboName"
                                  title="项目组合"
                                  min-width="140"></vxe-table-column>
                <vxe-table-column field="specimanName"
                                  title="标本"
                                  min-width="120"></vxe-table-column>
                <vxe-table-column field="testTubeName"
                                  title="试管"
                                  min-width="140"></vxe-table-column>
                <vxe-table-column field="inspectStatus"
                                  title="送检状态"
                                  align="center"
                                  min-width="120">
                  <template v-slot="{row}">
                    <Tag color="green"
                         v-if="row.inspectStatus === '1'">已送检</Tag>
                    <Tag color="red"
                         v-else-if="row.inspectStatus === '0'">未送检</Tag>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="action"
                                  title="操作"
                                  fixed="right"
                                  align="center"
                                  min-width="120">
                  <template slot-scope="scope">
                    <Button type="default"
                            v-permission="['edit']"
                            :loading="curBarcode.indexOf(scope.row.barcode) > -1 && sendExamLoading"
                            size="small"
                            v-if="scope.row.inspectStatus === '0'"
                            @click.stop="sendExamHandle(scope.row)">送检</Button>
                    <Button type="error"
                            v-permission="['edit']"
                            :loading="curBarcode.indexOf(scope.row.barcode) > -1 && sendExamCancelLoading"
                            size="small"
                            v-if="scope.row.inspectStatus === '1'"
                            @click.stop="cancelSendExamHandle(scope.row)">取消送检</Button>
                  </template>
                </vxe-table-column>
              </vxe-table>
            </div>
            <div class="page-table">
              <Page :total="totalSize"
                    :page-size="pageSize"
                    :current="pageIndex"
                    :page-size-opts="[10,20,100,500,1000]"
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
  </div>
</template>
<script>
import { UnitInfoTreeData } from '@/api/appointmentUnitManage.js'
import { UnitDeptTreeData } from '@/api/unitManage_unitDeptManage'
import { batchSendExamList, sendExamSave, sendExamCancel } from '@/api/batchSendExam'

import vueSelecttree from '@/components/vue-selecttree'
import moment from 'moment'

export default {
  name: 'batchSendExam',
  components: {
    vueSelecttree
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isexpand: false,
      formData: {
        isUnit: ''
      },
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      selections: [], // 表格选中项
      startTimeOption: {},
      endTimeOption: {},
      unitId: '',
      unitName: '',
      boVisitSn: '',
      departmentId: '', // 父级部门id
      departmentName: '', // 父级部门名称
      subDepartmentId: '', // 子部门id
      subDepartmentName: '', // 子部门名称
      groupId: '',
      groupingName: '',
      filterText: '',
      disabledSingle: true,
      treeType: 1, // 单位树切换，1位分组，2为部门
      treeLoading: false,
      selectSex: false,
      sendExamLoading: false, // 送检loading
      sendExamCancelLoading: false, // 取消送检loading
      curBarcode: [] // 当前送检数据index
    }
  },
  filters: {
    dateTime: function (value, formatString) {
      formatString = formatString || 'YYYY-MM-DD'
      if (isNaN(value) && !isNaN(Date.parse(value))) {
        // 　　console.log("data是日期格式！")
        return moment(value).format(formatString)
      } else {
        return '暂未登记'
      }
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
  computed: {
    testTubeDict: {
      get: function () {
        return this.$store.getters.getTestTubeDict
      },
      set: function () { }
    },
  },
  mounted () {
    this.$store.dispatch('getTestTubeDict')
    this.getTreeData()

    let curDate = moment().format('YYYY-MM-DD')

    this.$set(this.formData, 'registerStartDate', curDate)
    this.$set(this.formData, 'registerEndDate', curDate)
  },
  methods: {
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

    onStartTimeChange (startTime, type) {
      console.log(this.formData.startTime)
      this.endTimeOption = {
        disabledDate (endTime) {
          return endTime < new Date(startTime) - 86400000
        }
      }
    },

    onEndTimeChange (endTime, type) {
      this.startTimeOption = {
        disabledDate (startTime) {
          return startTime > new Date(endTime)
        }
      }
    },

    // 试管类型
    testTubeChange (obj) {
      if (obj) {
        this.formData.testTubeName = obj.label
      }
    },

    // 切换分组和部门
    deptOrGroupChange () {
      if (this.treeType == 1) {
        this.treeType = 2
        this.getTreeDeptData()
      } else {
        this.treeType = 1
        this.getTreeData()
      }
      this.tableData = []
      this.selections = []
    },

    // 获取树数据
    getTreeData () {
      let params = {
        name: '',
        bookingDate1: '',
        bookingDate2: '',
        // groupingName: this.formData.groupingName
        //   ? this.formData.groupingName
        //   : '',
        peId1: '',
        peId2: ''
      }
      this.treeLoading = true
      UnitInfoTreeData(params)
        .then(({ data }) => {
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
            this.treeData = [{ label: '全部', id: 999999 }, { label: '个人', id: 888888 }].concat(res)
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey('999999')
            })
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.treeLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },

    // 获取单位部门树数据
    async getTreeDeptData () {
      let params = {
        unitName: this.filterText || ''
      }
      try {
        this.treeLoading = true
        let { data } = await UnitDeptTreeData(params)
        console.log(data)
        this.treeLoading = false
        if (data.code == 0) {
          let res = this.transTreeData(data.data)

          this.treeData = [{ label: '全部', id: 999999 }, { label: '个人', id: 888888 }].concat(res)
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey('999999')
          })
        } else {
          this.$Message.error(data.message)
        }
      } catch (err) {
        this.treeLoading = false
        this.$Message.error(err.message)
      }
    },

    // 处理单位部门树数据
    transTreeData (tree) {
      tree.forEach(item => {
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

    getList (page = 1, size = 20) {
      if (this.isLoading) {
        return
      }
      this.pageIndex = page
      this.pageSize = size
      let pagination = { page, size }


      //格式化时间
      let startTime =
        this.formData.registerStartDate
          ? moment(this.formData.registerStartDate).format('YYYY-MM-DD')
          : ''
      let endTime =
        this.formData.registerEndDate
          ? moment(this.formData.registerEndDate).format('YYYY-MM-DD')
          : ''
      let params = Object.assign({}, this.formData)
      params.registerStartDate = startTime
      params.registerEndDate = endTime
      params.unitId = this.unitId
      params.subDepartmentId = this.subDepartmentId
      params.departmentId = this.departmentId
      params.unitGroupId = this.groupId
      params.unitVisitSn = this.boVisitSn

      this.isLoading = true
      batchSendExamList(pagination, params)
        .then(({ data }) => {
          // console.log(data)
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

    handleNodeClick (data, node) {
      this.departmentName = ''
      this.departmentId = ''
      this.subDepartmentName = ''
      this.subDepartmentId = ''
      this.unitId = ''
      this.unitName = ''
      if (this.treeType == 1) {
        if (data.label == '个人') {
          this.boVisitSn = '0'
          this.formData.isUnit = '0'
        } else if (data.label == '全部') {
          this.formData.isUnit = ''
          this.boVisitSn = ''
        } else {
          this.formData.isUnit = '1'
          switch (node.level) {
            case 1:
              this.unitId = data.boUnitId;
              this.unitName = data.boUnitName
              this.boVisitSn = ''
              this.groupId = ''
              this.groupingName = ''
              break;
            case 2:
              this.unitId = node.parent.data.boUnitId;
              this.unitName = node.parent.data.boUnitName;
              this.boVisitSn = data.boVisitSn;
              this.groupId = ''
              this.groupingName = ''
              break;
            case 3:
              this.unitName = data.boUnitName
              this.unitId = data.boUnitId
              this.boVisitSn = data.boUnitVisitSn
              this.groupId = data.boGroupingId
              this.groupingName = data.label
              if (data.canSelSex.length == 1) {
                this.formData.sex = data.canSelSex[0]
                this.selectSex = true
              } else {
                this.formData.sex = ''
                this.selectSex = false
              }
          }
        }

      } else {
        this.groupId = ''
        this.groupingName = ''
        this.formData.sex = ''
        this.selectSex = false

        if (data.label == '个人') {
          this.formData.isUnit = '0'
          this.boVisitSn = '0'
        } else if (data.label == '全部') {
          this.formData.isUnit = ''
          this.boVisitSn = ''
        } else {
          switch (node.level) {
            case 1:
              this.unitId = data.unitId
              this.unitName = data.label
              this.boVisitSn = ''
              this.parentName = ''
              this.parentId = ''
              this.subDepartmentName = ''
              this.subDepartmentId = ''
              break
            case 2:
              this.unitId = node.parent.data.unitId
              this.unitName = node.parent.data.label
              this.boVisitSn = data.boUnitVisitSn
              this.parentName = node.parent.data.label
              this.parentId = ''
              this.subDepartmentName = ''
              this.subDepartmentId = ''
              break
            case 3:
              this.unitId = node.parent.parent.data.unitId
              this.unitName = node.parent.parent.data.label
              this.boVisitSn = data.unitVisitSn
              this.departmentName = node.parent.data.label
              this.departmentId = data.deptId
              this.subDepartmentName = ''
              this.subDepartmentId = ''
              break
            case 4:
              // deptId父级部门id，subDeptId是子部门id
              this.unitId = data.unitId
              this.unitName = data.unitName
              this.boVisitSn = data.unitVisitSn
              this.departmentName = data.parentName
              this.departmentId = data.parentId
              this.subDepartmentName = data.deptName
              this.subDepartmentId = data.deptId
              break
          }
        }
      }

      // this.getList()
    },

    async sendExamHandle (row) {
      if (row) {
        let arr = []
        arr.push(row.barcode)
        this.curBarcode = [row.barcode]
        try {
          this.sendExamLoading = true
          const { data } = await sendExamSave(arr)
          this.sendExamLoading = false
          if (data.code == 0) {
            this.$Message.success(`送检成功`)
            this.getList(this.pageIndex, this.pageSize)
          } else {
            this.$Message.error(`${data.message}`)
          }
        } catch (err) {
          this.sendExamLoading = false
          this.$Message.error(err.message)
        }
      } else {
        this.selections = this.$refs.xTable.getSelectRecords()

        if (this.sendExamLoading) {
          return
        }
        if (this.selections.length == 0) {
          this.$Message.warning('请先选择需要送检的数据，再进行批量操作')
          return false
        }

        this.$Modal.confirm({
          title: '提示',
          content: '是否批量送检选中数据？（已送检数据不会重复送检）',
          onOk: async () => {
            try {
              const params = this.selections.map(item => {
                return item.barcode
              })
              this.curBarcode = params
              this.sendExamLoading = true
              const { data } = await sendExamSave(params)
              this.sendExamLoading = false
              if (data.code == 0) {
                this.$Message.success(`送检成功`)
                this.getList(this.pageIndex, this.pageSize)
              } else {
                this.$Message.error(`${data.message}`)
              }
            } catch (err) {
              console.log(err)
              this.sendExamLoading = false
              this.$Message.error(err.message)
            }
          },
          onCancel: () => { }
        })
      }
    },

    // 取消送检
    async cancelSendExamHandle (row, index) {
      if (row) {
        let arr = []
        arr.push(row.barcode)
        this.curBarcode = [row.barcode]
        try {
          this.sendExamCancelLoading = true
          const { data } = await sendExamCancel(arr)
          this.sendExamCancelLoading = false
          if (data.code == 0) {
            this.$Message.success(`操作成功`)
            this.getList(this.pageIndex, this.pageSize)
          } else {
            this.$Message.error(`${data.message}`)
          }
        } catch (err) {
          this.sendExamCancelLoading = false
          this.$Message.error(err.message)
        }
      } else {
        this.selections = this.$refs.xTable.getSelectRecords()

        if (this.sendExamCancelLoading) {
          return
        }
        if (this.selections.length == 0) {
          this.$Message.warning('请先选择需要取消送检的数据，再进行批量操作')
          return false
        }

        this.$Modal.confirm({
          title: '提示',
          content: '是否批量取消送检选中数据？（已取消送检数据不会重复取消）',
          onOk: async () => {
            try {
              const params = this.selections.map(item => {
                return item.barcode
              })
              this.curBarcode = params
              this.sendExamCancelLoading = true
              const { data } = await sendExamCancel(params)
              this.sendExamCancelLoading = false
              if (data.code == 0) {
                this.$Message.success(`操作成功`)
                this.getList(this.pageIndex, this.pageSize)
              } else {
                this.$Message.error(`${data.message}`)
              }
            } catch (err) {
              console.log(err)
              this.sendExamCancelLoading = false
              this.$Message.error(err.message)
            }
          },
          onCancel: () => { }
        })
      }
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
.batch-send-exam-wrapper {
  width: 100%;
  min-width: 1400px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
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
    height: inherit;
  }
  .main-body {
    display: flex;
    height: 100%;
    .flex-wrapper {
      width: 280px;
      display: flex;
      height: 34px;
      justify-content: space-between;
      .ivu-input-group {
        max-width: 65%;
      }
    }
    .guide-tree-wrapper {
      min-width: 250px;
      padding: 0 10px 0 0;
      height: 100%;
      box-sizing: border-box;
      .guide-tree {
        min-height: 500px;
        max-height: 680px;
        overflow-y: auto;
        position: relative;
        width: 280px;
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
    .unit-register-right-wrapper {
      // width: calc(~'100% - 250px');
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      padding: 5px;
      // box-sizing: border-box;
      .right-wrapper-title {
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding-left: 22px;
        border-bottom: 1px solid #f2f2f9;
      }
      .form-wrapper {
        display: flex;
        padding: 10px 0;
        // margin-bottom: 10px;
        box-sizing: border-box;
        display: flex;
        // justify-content: space-between;
        .left-form {
          flex: 1;
          .ivu-form {
            height: 100%;
          }
          .ivu-date-picker {
            width: 100%;
          }
          .ivu-form-item {
            margin-bottom: 10px !important;
            align-items: center;
          }
          .ivu-checkbox-group {
            display: flex;
          }
          .ivu-checkbox-wrapper {
            margin-right: 25px;
          }
        }
        .flex-row {
          width: 100%;
          display: flex;
        }
        .btn-wrapper {
          display: flex;
          width: 220px;
          flex-shrink: 0;
          flex-wrap: wrap;
          justify-content: space-between;
          .ivu-btn {
            width: 46%;
          }
          .ivu-btn:nth-child(odd) {
            margin-left: 10px;
          }
        }
      }
      .group-table {
        // width: 100%;
        height: calc(~'100% - 145px');
        min-height: 350px;
        max-height: 700px;
        text-align: center;
        display: flex;
        // flex: 1;
        flex-direction: column;
        justify-content: space-between;
        .table {
          height: 100%;
        }
        .ivu-table-wrapper {
          height: 100%;
          // border: none;
        }
        .ivu-table th {
          background-color: #d6eaff;
        }
        .page-table {
          margin-top: 20px;
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
