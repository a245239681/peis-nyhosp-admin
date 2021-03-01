<template>
  <div class="abnormal-analysis-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">异常结果统计</span>
        <!-- <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 240px"
                 v-model="keyword"
                 @on-search="getItemList()"
                 placeholder="请搜索姓名或证件号码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新建档案</Button>
        </div> -->
      </div>
      <div class="page-body clearfix">
        <div class="screen-info-wrapper">
          <div class="screen-form">
            <Form :model="form"
                  label-position="right"
                  ref="form"
                  inline
                  style="flex:1"
                  :label-width="60">
              <FormItem label="姓名"
                        :label-width="80"
                        prop="name">
                <Input v-model="form.name"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="性别"
                        prop="sex"
                        :label-width="40">
                <Select v-model="form.sex"
                        @on-change="sexChange"
                        size="small">
                  <Option value="不限">不限</Option>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </FormItem>
              <FormItem label="年龄范围"
                        :label-width="80"
                        prop="ageStart">
                <Input v-model="form.ageStart"
                       style="width:60px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="ageEnd">
                <Input v-model="form.ageEnd"
                       style="width:60px"
                       size="small"
                       clearable />
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
              <FormItem label="检查日期"
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
                        @on-change="changeUnitGroup"
                        :label-in-value="true"
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
          <div class="search-info">符合查询条件的记录共：<span>{{totalSize}}</span>条，
            合计<span>{{tableData.length > 0 ? tableData[0].peopleNumber : 0}}</span>人。具体名单如下：</div>
          <vxe-table class="mytable-footer"
                     ref="workloadTable"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     align="center"
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :height="(screenHeight - 420) <= 500 ? 500 : (screenHeight - 420)"
                     :data="tableData"
                     :loading="isLoading">
            <vxe-table-column field="itemName"
                              title="项目名称"
                              show-overflow="title"
                              width="140"></vxe-table-column>
            <vxe-table-column field="diseaseName"
                              title="异常结果"
                              min-width="180"></vxe-table-column>
            <vxe-table-column field="malePatientNumber"
                              title="男性"
                              min-width="100"></vxe-table-column>
            <vxe-table-column field="malePatientRatio"
                              title="男性比例"
                              min-width="100">
              <template v-slot="{row}">
                <span>{{row.malePatientRatio > 0 ? row.malePatientRatio + '%' : row.malePatientRatio}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="femalePatientNumber"
                              title="女性"
                              width="100"></vxe-table-column>
            <vxe-table-column field="femalePatientRatio"
                              title="女性比例"
                              min-width="100">
              <template v-slot="{row}">
                <span>{{row.femalePatientRatio > 0 ? row.femalePatientRatio + '%' : row.femalePatientRatio}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="patientNumber"
                              title="总人数"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="diseaseTotalRatio"
                              title="总占比"
                              min-width="100">
              <template v-slot="{row}">
                <span>{{row.diseaseTotalRatio > 0 ? row.diseaseTotalRatio + '%' : row.diseaseTotalRatio}}</span>
              </template>
            </vxe-table-column>

          </vxe-table>
          <div class="pagination-wrapper">
            <Page :total="totalSize"
                  :page-size="pageSize"
                  :current="pageIndex"
                  :page-size-opts="[10,20,40,100]"
                  @on-change="pageIndexChange"
                  @on-page-size-change="pageSizeChange"
                  size="small"
                  show-sizer
                  show-elevator
                  show-total />
          </div>
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
import { abnormalAnalysisList, unitGroupInfo, abnormalAnalysisLeadout } from '@/api/workload'
import moment from 'moment'

export default {
  name: 'abnormalAnalysis',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        isUnit: '',
        sex: '不限'
      },
      unitSearchLoading: false,
      unitTimer: null,
      unitsList: [],
      tableData: [],
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
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

    this.$set(this.form, 'startDate', curDate)
    this.$set(this.form, 'endDate', curDate)
  },
  methods: {
    // 获取总检医生工作量统计列表
    getList (page = 1, size = 20) {

      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 格式化时间
      this.form.startDate = this.form.startDate != '' ? moment(this.form.startDate).format('YYYY-MM-DD') : ''
      this.form.endDate = this.form.endDate != '' ? moment(this.form.endDate).format('YYYY-MM-DD') : ''
      this.isLoading = true

      abnormalAnalysisList(pagination, this.form).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalSize = data.data.total
        } else {
          this.tableData = []
          this.totalSize = 0
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

    // 更改性别
    sexChange (e) {
      if (!e) {
        this.form.sex = '不限'
      }
    },

    // 更改婚姻状态
    itemStatusChange (e) {
      if (!e) {
        this.form.itemStatus = ''
      }
    },

    // 更改体检状态
    resultStatusChange (e) {
      if (!e) {
        this.form.resultStatusId = ''
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
        const { data } = await abnormalAnalysisLeadout(this.form)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '异常结果统计.xlsx'
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
        isUnit: '',
        sex: '不限'
      }
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate)
      this.$set(this.form, 'endDate', curDate)
      this.$set(this.form, 'registerStartDate', curDate)
      this.$set(this.form, 'registerEndDate', curDate)
      this.totalSize = 0
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
      } else {
        this.$set(this.form, 'unitId', '')
        this.$set(this.form, 'unitName', '')
      }
    },
    // 清除单位
    clearUnit () {
      this.$set(this.form, 'unitId', '')
      this.$set(this.form, 'unitName', '')
      this.$set(this.form, 'unitVisitSn', '')
      this.$set(this.form, 'groupId', '')
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
        this.$set(this.form, 'groupId', obj.value)
        this.$set(this.form, 'groupName', obj.label)
      } else {
        this.$set(this.form, 'groupId', '')
        this.$set(this.form, 'groupName', '')
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
    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    },
    formatTime ({ cellValue, row, column }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}
</script>
<style lang="less">
.abnormal-analysis-wrapper {
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
  .item-star .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
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
