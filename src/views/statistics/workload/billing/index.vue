<template>
  <div class="billing-page-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">项目开单统计</span>
      </div>
      <div class="page-body clearfix">
        <div class="screen-info-wrapper">
          <div class="screen-form">
            <Form :model="form"
                  label-position="right"
                  ref="form"
                  inline
                  style="flex:1;max-width: 1300px;"
                  :label-width="60">
              <FormItem label="体检科室"
                        :label-width="80"
                        prop="deptId">
                <Select v-model="form.deptId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="deptRoomChange"
                        size="small">
                  <Option v-for="item in roomDict"
                          :value="item.poId"
                          :key="item.poId">{{ item.poDeptName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="登记时间"
                        :label-width="80"
                        prop="startDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.startDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="endDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.endDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="体检类型"
                        prop="categoryId"
                        :label-width="80">
                <Select v-model="form.categoryId"
                        size="small"
                        style="min-width:140px"
                        clearable
                        @on-change="changeCategory"
                        :label-in-value="true">
                  <Option v-for="item in categoryList"
                          :value="item.cdId"
                          :key="item.cdId">{{item.cdName}}</Option>
                </Select>
              </FormItem>
              <FormItem label=""
                        :label-width="20"
                        prop="isUnit">
                <RadioGroup v-model="form.isUnit"
                            @on-change="sourceChange">
                  <Radio label=""><span>全部</span></Radio>
                  <Radio label="0"><span>个人</span></Radio>
                  <Radio label="1"><span>单位</span></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="体检单位"
                        prop="unitId"
                        :label-width="80">
                <Select v-model="form.unitId"
                        class="unitSelect"
                        ref="unitSelectBox"
                        clearable
                        filterable
                        remote
                        :disabled="unitInfoBtn"
                        size="small"
                        :label-in-value="true"
                        placeholder=" "
                        @on-change="changeUnit"
                        @on-clear="clearUnit"
                        :remote-method="getUnits"
                        :loading="unitSearchLoading">
                  <Option v-for="item in unitsList"
                          :value="item.boUnitId"
                          :key="item.boUnitId">{{ item.boUnitName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="单位体检次数"
                        :label-width="100"
                        prop="unitVisitSn">
                <Select v-model="form.unitVisitSn"
                        size="small"
                        style="min-width:102px"
                        :disabled="unitInfoBtn"
                        @on-change="changeUnitVisitSn"
                        clearable
                        :label-in-value="true">
                  <Option v-for="item in unitVisitSnList"
                          :value="item.unitVisitSn"
                          :key="item.unitVisitSn">{{item.unitVisitSn}}</Option>
                </Select>
              </FormItem>
              <FormItem label="体检分组"
                        prop="groupId"
                        :label-width="80">
                <Select v-model="form.groupId"
                        size="small"
                        style="width:140px"
                        :disabled="unitInfoBtn"
                        :label-in-value="true"
                        @on-change="changeUnitGroup"
                        clearable>
                  <Option v-for="item in groupingResultList"
                          :value="item.groupingId"
                          :key="item.groupingId">{{ item.groupingName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="所属部门"
                        :label-width="80">
                <Cascader :data="deptList"
                          v-model="selectDeptArr"
                          change-on-select
                          size="small"
                          style="width:140px"
                          :disabled="unitInfoBtn"
                          @on-change="deptChange"></Cascader>
              </FormItem>
            </Form>
            <div class="handle-wrapper">
              <div><Button style="margin-left: 8px;width: 126px;"
                        type="primary"
                        v-permission="['leadingOut']"
                        :loading="leadoutLoading"
                        @click="leadoutExcelHandle">导出为表格</Button></div>
              <div>
                <Button style="margin-left: 8px;"
                        type="default"
                        @click="resetHandle">重置</Button>
                <Button style="margin-left: 8px;"
                        type="primary"
                        @click="getList()"
                        :loading="isLoading">查询</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <div class="search-info">符合查询条件的记录共：<span>{{totalNum}}</span>条，
            共开单<span>{{totalPeopleNum}}</span>人。具体名单如下：</div>
          <vxe-table class="mytable-footer"
                     ref="xTree"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     :row-class-name="rowClassName"
                     header-row-class-name="table-row"
                     :data="tableData"
                     :tree-config="tableTreeConfig"
                     :span-method="colspanMethod"
                     :footer-method="footerMethod"
                     footer-row-class-name="table-footer-row"
                     :height="(screenHeight - 320) <= 500 ? 500 : (screenHeight - 320)"
                     :loading="isLoading">
            <vxe-table-column field="deptName"
                              title="体检科室"
                              tree-node
                              width="200"></vxe-table-column>
            <vxe-table-column field="comboName"
                              min-width="160"
                              title="体检项目组合"></vxe-table-column>
            <vxe-table-column field="comboPrice"
                              title="项目单价"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.comboPrice || row.comboPrice == 0 ? Number(row.comboPrice).toFixed(2) : ''}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="comboRegisterPeopleNum"
                              title="开单人次"
                              width="200"></vxe-table-column>
            <vxe-table-column field="comboTotalAmount"
                              title="实检金额"
                              width="200">
              <template v-slot="{row}">
                <span>{{row.comboTotalAmount || row.comboTotalAmount == 0 ? Number(row.comboTotalAmount).toFixed(2) : ''}}</span>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import {
  listByName
} from '@/api/personal_register.js'
import {
  getDeptInfoByUnit
} from "@/api/unitManage_unitPersonManage.js";
import { unitGroupInfo, billingList, billingLeadout } from '@/api/workload'
import moment from 'moment'

export default {
  name: 'billingStatistics',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        isUnit: ''
      },
      unitSearchLoading: false,
      unitTimer: null,
      unitsList: [],
      tableData: [],
      isLoading: false,
      totalNum: 0,
      totalPeopleNum: 0,
      pageIndex: 1,
      pageSize: 20,
      tableTreeConfig: {
        children: 'comboList',
        accordion: true, // 一层只允许展开一个节点
        expandAll: false, // 默认是否全部展开
        trigger: 'row' // 展开方式，点击行展开
      },
      unitVisitSnList: [], // 单位体检次数列表
      groupingResultList: [], // 单位分组列表
      unitInfoBtn: true, // 单位信息选择禁用开关
      leadoutLoading: false,
      deptList: [], // 单位部门数据
      selectDeptArr: [] // 选择的部门数据
    }
  },
  watch: {
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
    // 体检科室列表
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
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
    this.$store.dispatch('getRoomDict')
    this.$store.dispatch('getCategoryDict')
    let curDate = moment().format('YYYY-MM-DD')

    this.$set(this.form, 'startDate', curDate)
    this.$set(this.form, 'endDate', curDate)
  },
  methods: {
    // 获取总检医生工作量统计列表
    getList () {
      // 格式化时间
      this.form.startDate = this.form.startDate != '' ? moment(this.form.startDate).format('YYYY-MM-DD') : ''
      this.form.endDate = this.form.endDate != '' ? moment(this.form.endDate).format('YYYY-MM-DD') : ''
      this.isLoading = true
      billingList(this.form).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          let result = data.data
          this.tableData = this.getGroupSummary(result.deptList)
          this.totalNum = result.comboRecordNum || 0
          this.totalPeopleNum = result.totalPeopleNum || 0
        } else {
          this.tableData = []
          this.totalNum = 0
          this.totalPeopleNum = 0
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 更改体检类型
    changeCategory (e) {
      if (e) {
        this.form.categoryId = e.value
        this.form.categoryName = e.label
      } else {
        this.form.categoryId = ''
        this.form.categoryName = ''
      }
    },

    // 更改科室
    deptRoomChange (obj) {
      if (obj) {
        this.form.deptId = obj.value
        this.form.deptName = obj.label
      } else {
        this.form.deptId = ''
        this.form.deptName = ''
      }
    },

    // 更改单位体检次数
    changeUnitVisitSn (e) {
      this.selectDeptArr = []
      this.deptList = []
      this.groupingResultList = []
      if (e) {
        this.$set(this.form, 'groupId', '')
        const arr = this.unitVisitSnList.filter(item => {
          return item.unitVisitSn == e.value
        })
        if (arr.length > 0) {
          this.groupingResultList = arr[0].groupingResultList
          this.getDeptList()
        }
      } else {
        this.$set(this.form, 'groupId', '')
        this.$set(this.form, 'unitVisitSn', '')
      }
    },

    // 获取单位列表
    getUnits (query = '') {
      this.unitSearchLoading = true
      this.unitTimer && clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: query
        }
        listByName(params).then(({ data }) => {
          if (data.code === 0) {
            this.unitsList = data.data
          } else {
            this.$Message.error(result.message)
          }
          this.unitSearchLoading = false
        }).catch(err => {
          console.log(err)
          this.unitSearchLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }, 300)
    },

    // 获取单位部门
    getDeptList () {
      const params = {
        boUnitId: this.form.unitId,
        boUnitVisitSn: this.form.unitVisitSn
      }
      getDeptInfoByUnit(params).then(({ data }) => {
        if (data.code == 0) {
          this.deptList = data.data
          this.transCascaderData(this.deptList)
          console.log(this.deptList)
        } else {
          this.$Message.error(data.message)
        }
      })
    },

    // 处理级联数据
    transCascaderData (arr) {
      arr.forEach(item => {
        item.value = item.deptId
        item.label = item.name
        if (item.children) {
          item.children.forEach(v => {
            v.value = v.deptId
            v.label = v.deptName
          })
        }
      })
      return arr
    },

    // 选择部门
    deptChange (value, selectedData) {
      if (selectedData.length == 2) {
        // 即选择了父级部门，又选择了子级部门
        this.form.boSubDepartmentName = selectedData[1].deptName
        this.form.boSubDepartmentId = selectedData[1].deptId
        this.form.boDepartmentId = selectedData[1].parentId
        this.form.boDepartment = selectedData[1].parentName
        // console.log(this.formData)
      } else if (selectedData.length == 1) {
        // 只选择了父级
        this.form.boSubDepartmentName = ''
        this.form.boSubDepartmentId = ''
        this.form.boDepartmentId = selectedData[0].deptId
        this.form.boDepartment = selectedData[0].name
      } else {
        // 什么都没有选
        this.form.boSubDepartmentName = ''
        this.form.boSubDepartmentId = ''
        this.form.boDepartmentId = ''
        this.form.boDepartment = ''

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
        const { data } = await billingLeadout(this.form)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '项目开单统计.xls'
        link.click()
        this.$Message.success('操作成功')
      } catch (err) {
        this.leadoutLoading = false
        this.$Message.error(err.message)
      } finally {
      }
    },

    // 重置
    resetHandle () {
      this.form = {
        isUnit: ''
      }
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate)
      this.$set(this.form, 'endDate', curDate)
      this.totalNum = 0
      this.totalPeopleNum = 0
      this.unitInfoBtn = true
      this.clearUnit()
      this.tableData = []
    },

    // 修改来源
    sourceChange (val) {
      if (val == 1) {
        this.unitInfoBtn = false
      } else {
        this.unitInfoBtn = true
        this.clearUnit()
      }
    },

    // 修改单位
    changeUnit (obj) {
      if (obj) {
        this.$set(this.form, 'unitId', obj.value)
        this.$set(this.form, 'unitName', obj.label)
        this.$set(this.form, 'unitVisitSn', '')
        this.$set(this.form, 'groupId', '')
        this.$set(this.form, 'boDepartmentId', '')
        this.$set(this.form, 'boSubDepartmentId', '')
        this.$set(this.form, 'boSubDepartmentName', '')
        this.$set(this.form, 'boDepartment', '')
        this.deptList = []
        this.selectDeptArr = []
        this.getGroups()
      }
    },
    // 清除单位
    clearUnit () {
      this.$set(this.form, 'unitId', '')
      this.$set(this.form, 'unitName', '')
      this.$set(this.form, 'unitVisitSn', '')
      this.$set(this.form, 'groupId', '')
      this.$set(this.form, 'groupName', '')
      this.$set(this.form, 'boDepartmentId', '')
      this.$set(this.form, 'boSubDepartmentId', '')
      this.$set(this.form, 'boSubDepartmentName', '')
      this.$set(this.form, 'boDepartment', '')
      this.groupingResultList = []
      this.unitVisitSnList = []
      this.deptList = []
      this.selectDeptArr = []
    },
    // 修改单位体检分组
    changeUnitGroup (obj) {
      if (obj) {
        this.form.groupId = obj.value
        this.form.groupName = obj.label
      } else {
        this.form.groupId = ''
        this.form.groupName = ''
      }
    },
    // 查询单位分组信息
    getGroups () {
      let params = {
        boUnitId: this.form.unitId
      }
      unitGroupInfo(params).then(({ data }) => {
        if (data.code === 0) {
          console.log(data.data)
          this.unitVisitSnList = data.data.unitVisitSnList
        } else {
          this.$Message.error(result.Message)
        }
      })
    },

    // 表格汇总
    getGroupSummary (data) {
      XEUtils.eachTree(data, (row, index, items, path, parent, nodes) => {
        let children = row.comboList
        if (children && children.length) {
          // 合计子节点
          Object.assign(row, this.handleSummary(children))
        } else {
          if (index === items.length - 1) {
            // 全量汇总
            for (let len = nodes.length - 2; len >= 0; len--) {
              // console.log(nodes[len])
              Object.assign(nodes[len], this.handleSummary(nodes[len].comboList))
            }
          }
        }
      }, this.tableTreeConfig)
      XEUtils.eachTree(data, (row) => {
        let children = row.comboList
        if (children && children.length) {
          // 动态增加一行汇总
          children.push({
            deptName: `合计：`,
            comboRegisterPeopleNum: row.comboRegisterPeopleNum,
            comboTotalAmount: row.comboTotalAmount
          })
        }
      }, this.tableTreeConfig)
      return data
    },
    // 计算逻辑
    handleSummary (children) {
      return {
        comboRegisterPeopleNum: XEUtils.sum(children, 'comboRegisterPeopleNum'),
        comboTotalAmount: (Math.round(XEUtils.sum(children, 'comboTotalAmount') * 100) / 100).toFixed(2)
      }
    },

    colspanMethod ({ row, column }) {
      // 当行被展开时将行合并
      let xTree = this.$refs.xTree
      if (row.comboList && row.comboList.length && xTree && xTree.isTreeExpandByRow(row)) {
        if (column.treeNode) {
          return {
            rowspan: 1,
            colspan: 6
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return `合计：`
          }
          switch (column.property) {
            case 'comboRegisterPeopleNum':
              return `累计开单人次：\r${Math.round(XEUtils.sum(data, 'comboRegisterPeopleNum') * 100) / 100}`
            case 'comboTotalAmount':
              return `累计金额：\r${Math.round(XEUtils.sum(data, 'totalPrice') * 100) / 100}`
          }
          return '-'
        })
      ]
    },
    rowClassName ({ row, rowIndex }) {
      if (row.deptName == '合计：') {
        return 'row--current table-row'
      } else {
        return 'table-row'
      }
    },
    formatTime ({ cellValue, row, column }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}
</script>
<style lang="less">
.billing-page-wrapper {
  width: 100%;
  min-width: 1300px;
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
  .screen-info-wrapper {
    padding-bottom: 15px;
    .code-search-input {
      display: flex;
      align-items: center;
      min-width: 180px;
      flex-shrink: 0;
    }
    .screen-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ivu-form-item {
        margin-bottom: 0px !important;
      }
    }
  }
  .table-wrapper {
    .search-info {
      line-height: 1.8;
      font-weight: bold;
      color: #252525;
      margin-bottom: 10px;
      span {
        color: #40a9ff;
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
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
  }
  .table-row {
    color: #252525;
  }
  .page-body {
    padding-bottom: 0px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-cascader {
    line-height: 32px;
  }
  .ivu-input[disabled] {
    background-color: #f3f3f3 !important;
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
