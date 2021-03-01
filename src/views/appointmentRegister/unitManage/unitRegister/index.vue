<template>
  <div class="unit-register-wrapper">
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
          <div class="right-wrapper-title"
               v-if="unitId">
            <span style="margin-right:10px;font-weight:700;">已选：{{ unitName }}</span>
            <span v-if="unitId&&boVisitSn"
                  style="font-weight:700;">第{{boVisitSn}}次体检</span>
          </div>
          <div class="form-wrapper">
            <div class="left-form">
              <Form :model="formData"
                    inline
                    :label-width="80">
                <div class="flex-row">
                  <FormItem label="姓名">
                    <Input v-model="formData.name"
                           placeholder
                           size="small"></Input>
                  </FormItem>
                  <FormItem label="登记日期">
                    <Row>
                      <Col span="11">
                      <DatePicker type="date"
                                  v-model="formData.startTime"
                                  placeholder="请选择开始时间"
                                  :options="startTimeOption"
                                  @on-change="onStartTimeChange"
                                  size="small"></DatePicker>
                      </Col>
                      <Col span="2"
                           style="text-align: center">到</Col>
                      <Col span="11">
                      <DatePicker type="date"
                                  v-model="formData.endTime"
                                  placeholder="请选择结束时间"
                                  :options="endTimeOption"
                                  @on-change="onEndTimeChange"
                                  size="small"></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem :label-width="20"
                            v-permission="['print']"
                            style="width:240px; flex-shrink: 0; height:26px;margin-bottom:5px;">
                    <CheckboxGroup v-model="formData.selGroup"
                                   @on-change="checkBoxChange">
                      <!-- <Checkbox label="createRequestNote"
                                        v-permission="['print']"
                                        disabled>打印申请单</Checkbox> -->
                      <Checkbox label="printGuide">打印指引单</Checkbox>
                      <Checkbox label="printSampleCode">打印样本条码</Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </div>
                <div class="flex-row">
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
                  <FormItem label="体检编号">
                    <Row>
                      <Col span="11">
                      <Input v-model="formData.peId1"
                             placeholder
                             size="small"></Input>
                      </Col>
                      <Col span="2"
                           style="text-align: center">到</Col>
                      <Col span="11">
                      <Input v-model="formData.peId2"
                             placeholder
                             size="small"></Input>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="空白标签个数"
                            v-permission="['print']"
                            prop="labelNum"
                            :label-width="100"
                            style="height:28px;margin-bottom:0;margin-left:15px;">
                    <Select v-model="formData.labelNum"
                            size="small"
                            style="width:100px"
                            clearable>
                      <Option v-for="item in labelNumList"
                              :value="item"
                              :key="item">{{item}}</Option>
                    </Select>
                  </FormItem>
                </div>
              </Form>
            </div>
            <div class="btn-wrapper">
              <Button type="primary"
                      style="margin-bottom:11px;"
                      @click="getList()">查询</Button>
              <Button type="primary"
                      style="margin-bottom:11px;"
                      :loading="reloadMissonLoading"
                      @click="reloadMission()">重启任务</Button>
              <Button type="primary"
                      style="margin-bottom:11px;"
                      v-permission="['add']"
                      :loading="btnLoading"
                      @click="registerBatch">批量登记</Button>
              <Button type="primary"
                      style="margin-bottom:11px;"
                      :loading="checkProgressLoading"
                      @click="checkProgress()">查询进度</Button>

            </div>
          </div>
          <div class="group-table">
            <!-- <Table border :columns="columns" :data="tableData"></Table> -->
            <div class="table">
              <vxe-grid class="mytable-style"
                        resizable
                        highlight-hover-row
                        highlight-current-row
                        ref="xTable"
                        height="640"
                        size="medium"
                        align="center"
                        :columns="treeType == 1 ? columns1 : columns2"
                        :data="tableData"
                        :loading="isLoading"
                        :checkbox-config="{checkMethod}"
                        :edit-config="{trigger: 'manual', mode: 'row'}">
              </vxe-grid>

              <!-- <Table :columns="columns"
                     :data="tableData"
                     ref="table"
                     height="650"
                     disabled-hover
                     :loading="isLoading"
                     @on-select-all="selectAll"
                     @on-selection-change="selectChange">
                <template slot="boRegisterDate"
                          slot-scope="{row}">{{ row.canRegister == '0' ? '暂未登记' : row.boRegisterDate | dateTime }}</template>
                <template slot="action"
                          slot-scope="{row}">
                  <Button type="default"
                          v-if="row.canRegister == 0"
                          style="margin-left: 8px;"
                          @click="register(row)"
                          size="small">登记</Button>
                  <Tag v-else
                       type="border"
                       color="default">已登记</Tag>
                </template>
              </Table> -->
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
import {
  unitRegisterList,
  unitPersonRegister,
  reloadRegisterMission,
  checkRegisterProgress
} from '@/api/unitManage_unitRegister.js'
import { printBarcode, printGuide, printBarcodeMore, printGuideMore } from '@/api/personal_register.js'
import { guideSheetPrint } from "@/api/guideSheetManage";
import { getPrinterConfigFromLocalstorage } from '@/libs/util'
import { printFunc } from '@/libs/printOrder.js'
import { directPrintFunc } from '@/libs/directPrint.js'
import vueSelecttree from '@/components/vue-selecttree'
import moment from 'moment'
import config from '@/config'

export default {
  name: 'unitRegister',
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
        selGroup: ['printGuide', 'printSampleCode'],
        labelNum: '1'
      },
      columns1: [
        {
          width: 55,
          type: 'checkbox',
          align: 'center'
        },
        {
          title: '体检编号',
          field: 'boPeId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '姓名',
          field: 'boName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '年龄',
          field: 'boAge',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '分组名称',
          field: 'boGroupingName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '身份证号',
          field: 'boIdNo',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '手机号',
          field: 'boMobile',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '体检套餐',
          field: 'boPackageName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '登记日期',
          slot: 'boRegisterDate',
          field: 'boRegisterDate',
          minWidth: 150,
          align: 'center'
        },
        // {
        //   title: '总检日期',
        //   key: 'poGroupPayMethod',
        //   align: 'center'
        // },
        {
          title: '操作',
          field: 'action',
          // slot: "action",
          fixed: 'right',
          width: 100,
          align: 'center',
          slots: {
            default: ({ row }, h) => {
              let registerStatus = row.canRegister
              if (registerStatus == '0') {
                return [h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      ghost: false,
                      loading: row.$isLoading,
                      size: 'small'
                    },
                    style: {
                      padding: '0 5px'
                    },
                    on: {
                      click: () => {
                        this.register(row)
                      }
                    }
                  },
                  '登记'
                )]
              } else {
                return [h(
                  'Tag',
                  {
                    props: {
                      type: 'border',
                      color: 'default',
                      size: 'default'
                    }
                  },
                  '已登记'
                )]
              }
            }
          },

        }
      ],
      columns2: [
        {
          width: 55,
          type: 'checkbox',
          align: 'center'
        },
        {
          title: '体检编号',
          field: 'boPeId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '姓名',
          field: 'boName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '年龄',
          field: 'boAge',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '部门',
          field: 'boDepartment',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '子部门',
          field: 'boSubDepartmentName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '身份证号',
          field: 'boIdNo',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '手机号',
          field: 'boMobile',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '就诊卡号',
          field: 'boVisitCardNumber',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '登记日期',
          slot: 'boRegisterDate',
          field: 'boRegisterDate',
          minWidth: 150,
          align: 'center'
        },
        // {
        //   title: '总检日期',
        //   key: 'poGroupPayMethod',
        //   align: 'center'
        // },
        {
          title: '操作',
          field: 'action',
          // slot: "action",
          fixed: 'right',
          width: 100,
          align: 'center',
          slots: {
            default: ({ row }, h) => {
              let registerStatus = row.canRegister
              if (registerStatus == '0') {
                return [h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      ghost: false,
                      loading: row.$isLoading,
                      size: 'small'
                    },
                    style: {
                      padding: '0 5px'
                    },
                    on: {
                      click: () => {
                        this.register(row)
                      }
                    }
                  },
                  '登记'
                )]
              } else if (registerStatus == '1') {
                return [h(
                  'Tag',
                  {
                    props: {
                      type: 'border',
                      color: 'default',
                      size: 'default'
                    }
                  },
                  '已登记'
                )]
              } else {
                return [h(
                  'Tag',
                  {
                    props: {
                      type: 'border',
                      color: 'default',
                      size: 'default'
                    }
                  },
                  '无法登记'
                )]
              }
            }
          },

        }
      ],
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 1000,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      isLoading: false,
      selections: [], // 表格选中项
      startTimeOption: {},
      endTimeOption: {},
      unitId: '',
      unitName: '',
      boVisitSn: '',
      parentId: '', // 父级部门id
      parentName: '', // 父级部门名称
      subDeptId: '', // 子部门id
      subDeptName: '', // 子部门名称
      groupId: '',
      groupingName: '',
      filterText: '',
      disabledSingle: true,
      treeType: 1, // 单位树切换，1位分组，2为部门
      // disabledGroup: ["createRequestNote"],
      printOptions: [],
      printValue: '-1',
      boIds: [],
      guideInfo: [],
      printParams: {},
      labelNumList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      treeLoading: false,
      btnLoading: false,
      selectSex: false,
      reloadMissonLoading: false, // 重启任务loading
      checkProgressLoading: false // 查看进度loading
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
  mounted () {
    let printConfig = getPrinterConfigFromLocalstorage()

    if (printConfig.hasOwnProperty('labelNum')) {
      this.formData.labelNum = printConfig.labelNum.toString()
    } else {
      this.formData.labelNum = '1'
    }
    this.getTreeData()
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
      this.$refs.xTable.loadData(this.tableData)
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
            this.treeData = res
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
          this.treeData = res
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

    getList (page = 1, size = 1000) {
      if (this.isLoading) {
        return
      }
      if (!this.unitId) {
        this.$Message.warning('请先选择公司，再进行查询')
        return
      }
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }


      //格式化时间
      let startTime =
        this.formData.startTime
          ? moment(this.formData.startTime).format('YYYY-MM-DD')
          : ''
      let endTime =
        this.formData.endTime
          ? moment(this.formData.endTime).format('YYYY-MM-DD')
          : ''

      let params = {
        // searchField: this.keyword.trim()
        name: this.formData.name ? this.formData.name : '',
        bookingDate1: startTime,
        bookingDate2: endTime,
        // groupingName: this.formData.groupingName
        //   ? this.formData.groupingName
        //   : '',
        groupId: this.groupId || '',
        peId1: this.formData.peId1 ? this.formData.peId1 : '',
        peId2: this.formData.peId2 ? this.formData.peId2 : '',
        unitId: this.unitId ? this.unitId : '',
        unitVisitSn: this.boVisitSn ? this.boVisitSn : '',
        sex: this.formData.sex ? this.formData.sex : '',
        deptId: this.parentId || '',
        subDeptId: this.subDeptId || '',
      }
      this.isLoading = true
      unitRegisterList(pagination, params)
        .then(({ data }) => {
          // console.log(data)
          this.isLoading = false
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.tableData = res.records
            this.$refs.xTable.loadData(this.tableData)
            console.log(this.tableData)
            // this.tableData.forEach(item => {
            //   if (item.canRegister == 1) {
            //     item['_disabled'] = true
            //   }
            // })
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },

    handleNodeClick (data, node) {
      if (node.level == 1) return
      this.formData = {
        selGroup: ['printGuide', 'printSampleCode'],
        labelNum: '1'
      }
      let printConfig = getPrinterConfigFromLocalstorage()

      if (printConfig.hasOwnProperty('labelNum')) {
        this.formData.labelNum = printConfig.labelNum.toString()
      } else {
        this.formData.labelNum = '1'
      }
      if (this.treeType == 1) {
        this.parentName = ''
        this.parentId = ''
        this.subDeptName = ''
        this.subDeptId = ''
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
            console.log(data.canSelSex)
            if (data.canSelSex.length == 1) {
              this.formData.sex = data.canSelSex[0]
              this.selectSex = true
            } else {
              this.formData.sex = ''
              this.selectSex = false
            }
        }
      } else {
        this.groupId = ''
        this.groupingName = ''
        this.formData.sex = ''
        this.selectSex = false
        switch (node.level) {
          case 1:
            this.unitId = data.unitId
            this.unitName = data.label
            this.boVisitSn = ''
            this.parentName = ''
            this.parentId = ''
            this.subDeptName = ''
            this.subDeptId = ''
            break
          case 2:
            this.unitId = node.parent.data.unitId
            this.unitName = node.parent.data.label
            this.boVisitSn = data.boUnitVisitSn
            this.parentName = node.parent.data.label
            this.parentId = ''
            this.subDeptName = ''
            this.subDeptId = ''
            break
          case 3:
            this.unitId = node.parent.parent.data.unitId
            this.unitName = node.parent.parent.data.label
            this.boVisitSn = data.unitVisitSn
            this.parentName = node.parent.data.label
            this.parentId = data.deptId
            this.subDeptName = ''
            this.subDeptId = ''
            break
          case 4:
            // deptId父级部门id，subDeptId是子部门id
            this.unitId = data.unitId
            this.unitName = data.unitName
            this.boVisitSn = data.unitVisitSn
            this.parentName = data.parentName
            this.parentId = data.parentId
            this.subDeptName = data.deptName
            this.subDeptId = data.deptId
            break
        }
      }

      this.getList()
    },

    add () {
      this.editModalVisible = true
      this.modalTitle = 0
      this.$nextTick(() => {
        // this.$refs.editwrapper.getItemList({})
      })
    },
    register (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否登记？',
        onOk: async () => {
          let printConfig = getPrinterConfigFromLocalstorage()
          if (JSON.stringify(printConfig) === '{}') {
            this.$Message.error('请在右上角配置打印机')
            return false
          }
          let params = {
            personList: [Object.assign({}, row)],
            selGroup: this.formData.selGroup ? this.formData.selGroup : []
          }
          console.log(params)

          try {
            this.$set(row, '$isLoading', true)
            const { data } = await unitPersonRegister(params)
            // console.log(data)
            this.$set(row, '$isLoading', false)
            if (data.code == 0) {
              this.$Message.success(`登记成功`)
              this.getList(this.pageIndex, this.pageSize)

              // 如果该页面没有打印权限，则返回
              if (!this.checkPrintAuthority()) return false;
              this.printParams = {}
              if (
                this.formData.selGroup.indexOf('printSampleCode') > -1 &&
                data.data.sampleList
              ) {
                const sampleRes = await printBarcode({
                  boIds: data.data.sampleList,
                  labelNum: this.formData.labelNum
                })
                // console.log(sampleRes)
                if (sampleRes.data.code == 0) {
                  if (!sampleRes.data.data) {
                    // 如果此人无条码，接口返回状态码0，返回data为null时
                    this.printParams.barcodeUrl = sampleRes.data.data
                  } else {
                    this.printParams.barcodeUrl = this.$url + sampleRes.data.data
                  }
                } else {
                  this.$Message.error(`${sampleRes.data.message}`)
                  // return
                }
              }

              if (
                this.formData.selGroup.indexOf('printGuide') > -1 &&
                data.data.guideMap
              ) {

                let _params;
                if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
                  _params = {
                    zip: false,
                    merge: false,
                    duplex: false,
                    data: data.data.guideMap
                  }
                } else {
                  _params = {
                    zip: false,
                    merge: true,
                    duplex: false,
                    data: data.data.guideMap
                  }
                }
                const guideRes = await guideSheetPrint(_params)
                // console.log(guideRes)
                if (guideRes.data.code == 0) {
                  if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
                    let resData = []
                    guideRes.data.data.originalFileList.forEach(item => {
                      let _str = this.$url + item
                      resData.push(_str)
                    });
                    this.printParams.guideUrl = resData
                  } else {
                    let resData = []
                    guideRes.data.data.mergeFileList.forEach(item => {
                      let _str = this.$url + item
                      resData.push(_str)
                    });
                    this.printParams.guideUrl = resData
                  }

                } else {
                  this.$Message.error(`${guideRes.data.message}`)
                  // return
                }
              }

              if (!this.printParams.barcodeUrl) {
                let j = this.formData.selGroup.filter(val => {
                  return val != 'printSampleCode'
                })
                // console.log(j)
                this.printParams.selGroup = j
              } else {
                this.printParams.selGroup = this.formData.selGroup
              }
              // console.log(this.printParams)
              // let printConfig = getPrinterConfigFromLocalstorage()
              if (printConfig.browserPreview) {
                if (this.printParams.selGroup.length) {
                  if (!!this.printParams.barcodeUrl) {
                    window.open(this.printParams.barcodeUrl, '_blank', 'location=yes,height=650,width=570,scrollbars=yes,status=yes,left=30')
                  }
                  if (!!this.printParams.guideUrl) {
                    window.open(this.printParams.guideUrl, '_blank', 'location=yes,height=650,width=800,scrollbars=yes,status=yes,left=620')
                  }
                }
              }
              if (printConfig.lodopPreview) {
                if (this.printParams.selGroup.length) {
                  Object.assign(this.printParams, printConfig)
                  printFunc(this.printParams)
                }
              }

              if (printConfig.lodopPrint) {
                if (this.printParams.selGroup.length) {
                  Object.assign(this.printParams, printConfig)
                  directPrintFunc(this.printParams)
                }
              }
            } else {
              this.$Message.error(`${data.message}`)
            }
          } catch (err) {
            console.log(err)
            this.$set(row, '$isLoading', false)
            this.$Message.error(err.message)
          } finally {
            this.$set(row, '$isLoading', false)

          }
        },
        onCancel: () => { }
      })
    },

    //检查当前页面打印权限
    checkPrintAuthority () {
      console.log(this.$router.currentRoute.meta.authority)
      return this.$router.currentRoute.meta.authority.some(item => {
        return item == 'print'
      })
    },

    registerBatch () {

      this.selections = this.$refs.xTable.getSelectRecords()
      // let personList = this.selections.filter( item => item.canRegister == 0)


      if (this.isLoading) {
        return
      }
      if (this.selections.length == 0) {
        this.$Message.warning('请先选择需要登记的人员，再进行批量登记操作')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否批量登记选中人员？',
        onOk: async () => {
          let printConfig = getPrinterConfigFromLocalstorage()
          if (JSON.stringify(printConfig) === '{}') {
            this.$Message.error('请在右上角配置打印机')
            return false
          }

          let params = {
            personList: this.selections,
            selGroup: this.formData.selGroup ? this.formData.selGroup : []
          }
          console.log(params)
          try {
            this.btnLoading = true
            this.isLoading = true
            const { data } = await unitPersonRegister(params)
            this.isLoading = false
            this.btnLoading = false
            if (data.code == 0) {
              this.$Message.success(`登记成功`)
              this.getList(this.pageIndex, this.pageSize)
              // 如果该页面没有打印权限，则返回
              if (!this.checkPrintAuthority()) return false;
              this.printParams = {}
              if (
                this.formData.selGroup.indexOf('printSampleCode') > -1 &&
                data.data.sampleList
              ) {
                // 如果是浏览器，请求不分割PDF接口。 如果是插件，请求分割条码PDF接口
                if (printConfig.browserPreview) {
                  const sampleRes = await printBarcode({
                    boIds: data.data.sampleList,
                    labelNum: this.formData.labelNum
                  })
                  if (sampleRes.data.code == 0) {
                    if (!sampleRes.data.data) {
                      // 如果此人无条码，接口返回状态码0，返回data为null时
                      this.printParams.barcodeUrl = sampleRes.data.data
                    } else {
                      this.printParams.barcodeUrl = this.$url + sampleRes.data.data
                    }
                  } else {
                    this.$Message.error(`${sampleRes.data.message}`)
                    // return
                  }
                } else {
                  const sampleRes = await printBarcodeMore({
                    boIds: data.data.sampleList,
                    labelNum: this.formData.labelNum
                  })
                  console.log(sampleRes)
                  if (sampleRes.data.code == 0) {
                    if (!sampleRes.data.data) {
                      // 如果此人无条码，接口返回状态码0，返回data为null时
                      this.printParams.barcodeUrl = []
                    } else {
                      let result = sampleRes.data.data.map(item => {
                        return item = this.$url + item
                      })
                      this.printParams.barcodeUrl = result
                      console.log(result)
                    }
                  } else {
                    this.$Message.error(`${sampleRes.data.message}`)
                    // return
                  }
                }
              }
              console.log(this.printParams)
              console.log('barcode地址' + this.printParams.barcodeUrl)
              if (
                this.formData.selGroup.indexOf('printGuide') > -1 &&
                data.data.guideMap
              ) {
                // 如果是浏览器，请求不分割PDF接口。 如果是插件，请求分割指引单PDF接口
                if (printConfig.browserPreview) {
                  const guideRes = await printGuide(data.data.guideMap)
                  // console.log(guideRes)
                  if (guideRes.data.code == 0) {
                    this.printParams.guideUrl = this.$url + guideRes.data.data
                  } else {
                    this.$Message.error(`${guideRes.data.message}`)
                    // return
                  }
                } else {
                  const guideRes = await printGuideMore(data.data.guideMap)
                  console.log(guideRes)
                  if (guideRes.data.code == 0) {
                    let result = guideRes.data.data.map(item => {
                      return item = this.$url + item
                    })
                    this.printParams.guideUrl = result
                  } else {
                    this.$Message.error(`${guideRes.data.message}`)
                    // return
                  }
                }

              }

              if (!this.printParams.barcodeUrl) {
                let j = this.formData.selGroup.filter(val => {
                  return val != 'printSampleCode'
                })
                console.log(j)
                this.printParams.selGroup = j
              } else {
                this.printParams.selGroup = this.formData.selGroup
              }

              console.log(this.printParams)
              console.log('barcode地址2' + this.printParams.barcodeUrl)
              // let printConfig = getPrinterConfigFromLocalstorage()
              if (printConfig.browserPreview) {
                if (this.printParams.selGroup.length) {
                  if (!!this.printParams.barcodeUrl) {
                    window.open(this.printParams.barcodeUrl, '_blank', 'location=yes,height=650,width=570,scrollbars=yes,status=yes,left=30')
                  }
                  if (!!this.printParams.guideUrl) {
                    window.open(this.printParams.guideUrl, '_blank', 'location=yes,height=650,width=800,scrollbars=yes,status=yes,left=620')
                  }
                }
              }
              if (printConfig.lodopPreview) {
                if (this.printParams.selGroup.length) {
                  Object.assign(this.printParams, printConfig)
                  printFunc(this.printParams)
                }
              }
              if (printConfig.lodopPrint) {
                if (this.printParams.selGroup.length) {
                  Object.assign(this.printParams, printConfig)
                  directPrintFunc(this.printParams)
                }
              }
            } else {
              this.$Message.error(`${data.message}`)
            }
          } catch (err) {
            console.log(err)
            this.isLoading = false
            this.btnLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          }
        },
        onCancel: () => { }
      })
    },

    checkBoxChange () {
      console.log(this.formData.selGroup)
    },
    // 重启登记任务
    reloadMission () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否重启当前登记任务？',
        onOk: () => {
          this.reloadMissonLoading = true
          reloadRegisterMission({}).then(({ data }) => {
            this.reloadMissonLoading = false
            if (data.code == 0) {
              this.$Message.success('任务已提交')
            } else {
              this.$Message.error(`${data.message}`)
            }
          }).catch(err => {
            this.reloadMissonLoading = false
            this.$Message.error(err)
          })
        },
        onCancel: () => { }
      })

    },

    // 查看登记进度
    checkProgress () {
      this.checkProgressLoading = true
      checkRegisterProgress({}).then(({ data }) => {
        this.checkProgressLoading = false
        if (data.code == 0) {
          let result = data.data
          if (result.count > 0) {
            this.$Modal.confirm({
              title: '提示',
              content: `还剩${result.count}条数据未登记入库`,
              onOk: () => { },
              onCancel: () => { }
            })
          } else {
            this.$Message.success('登记完成，暂无登记任务')
          }

        }
      }).catch(err => {
        this.checkProgressLoading = false
        this.$Message.error(err)
      })
    },

    deleteAllHandle () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除所选数据？',
        onOk: () => { },
        onCancel: () => { }
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
    },

    checkMethod ({ row }) {
      return row.canRegister == '0'
    }
  }
}
</script>
<style lang="less">
.unit-register-wrapper {
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
