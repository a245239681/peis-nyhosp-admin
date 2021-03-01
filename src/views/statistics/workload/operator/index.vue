<template>
  <div class="operator-workload-page-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">操作员工作量统计</span>
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
              <FormItem label="操作员姓名"
                        :label-width="95"
                        prop="name">
                <Input v-model="form.name"
                       style="width:125px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="体检科室"
                        :label-width="80"
                        prop="deptId">
                <Select v-model="form.deptId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="deptChange"
                        size="small">
                  <Option v-for="item in roomDict"
                          :value="item.poId"
                          :key="item.poId">{{ item.poDeptName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="操作时间"
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
                        prop="examTypeId"
                        :label-width="80">
                <Select v-model="form.examTypeId"
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
                        prop="source">
                <RadioGroup v-model="form.source"
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
                        clearable>
                  <Option v-for="item in groupingResultList"
                          :value="item.groupingId"
                          :key="item.groupingId">{{ item.groupingName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="体检时间"
                        :label-width="80"
                        prop="medicalDateStart">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.medicalDateStart"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="medicalDateEnd">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.medicalDateEnd"
                            size="small"></DatePicker>
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
                        @click="getList"
                        :loading="isLoading">查询</Button>
              </div>

            </div>
          </div>
        </div>
        <div class="table-wrapper">
          <div class="search-info">符合查询条件的记录共：<span>{{dataCount}}</span>条，
            体检人数<span>{{peopleCount}}</span>人，工作量分析如下：</div>
          <vxe-table class="mytable-footer"
                     ref="workloadTable"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :height="(screenHeight - 320) <= 500 ? 500 : (screenHeight - 320)"
                     :data="tableData"
                     :span-method="rowspanMethod"
                     :loading="isLoading">
            <vxe-table-column field="operatorName"
                              title="操作员"
                              width="200"></vxe-table-column>
            <vxe-table-column field="deptName"
                              title="检查科室"></vxe-table-column>
            <vxe-table-column field="comboName"
                              title="体检项目组合"></vxe-table-column>
            <vxe-table-column field="unitPrice"
                              title="项目单价"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.unitPrice.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="itemNumber"
                              title="项目数量"
                              width="120"></vxe-table-column>
            <vxe-table-column field="operateTimes"
                              title="操作次数"
                              width="140"></vxe-table-column>
            <vxe-table-column field="operateCount"
                              title="合计"
                              width="140"></vxe-table-column>
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
import { operatorWorkloadList, unitGroupInfo, operatorLeadout } from '@/api/workload'
import moment from 'moment'

export default {
  name: 'operatorWorkload',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        source: ''
      },
      unitSearchLoading: false,
      unitTimer: null,
      unitsList: [],
      groupsList: [],
      tableData: [],
      isLoading: false,
      unitVisitSnList: [], // 单位体检次数列表
      groupingResultList: [], // 单位分组列表
      unitInfoBtn: true, // 单位信息选择禁用开关
      peopleCount: 0, // 体检人数
      dataCount: 0, // 数据条数
      leadoutLoading: false,

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
    this.$set(this.form, 'medicalDateStart', curDate)
    this.$set(this.form, 'medicalDateEnd', curDate)
  },
  methods: {
    // 获取总检医生工作量统计列表
    getList () {
      // 格式化时间
      this.form.startDate = this.form.startDate != '' ? moment(this.form.startDate).format('YYYY-MM-DD') : ''
      this.form.endDate = this.form.endDate != '' ? moment(this.form.endDate).format('YYYY-MM-DD') : ''
      this.form.medicalDateStart = this.form.medicalDateStart != '' ? moment(this.form.medicalDateStart).format('YYYY-MM-DD') : ''
      this.form.medicalDateEnd = this.form.medicalDateEnd != '' ? moment(this.form.medicalDateEnd).format('YYYY-MM-DD') : ''

      this.isLoading = true
      operatorWorkloadList(this.form).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          let result = data.data
          this.tableData = result.workLoadList
          this.peopleCount = result.peopleCount
          this.dataCount = result.dataCount
        } else {
          this.tableData = []
          this.peopleCount = 0
          this.dataCount = 0
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 更改科室
    deptChange (obj) {
      if (!obj) {
        this.form.deptId = ''
      }
    },

    // 更改体检类型
    changeCategory (e) {
      if (!e) {
        this.form.examTypeId = ''
      }
    },

    // 更改单位体检次数
    changeUnitVisitSn (e) {
      if (e) {
        this.$set(this.form, 'groupId', '')
        const arr = this.unitVisitSnList.filter(item => {
          return item.unitVisitSn == e.value
        })
        if (arr.length > 0) {
          this.groupingResultList = arr[0].groupingResultList
        } else {
          this.groupingResultList = []
        }
      } else {
        this.$set(this.form, 'groupId', '')
        this.$set(this.form, 'unitVisitSn', '')
        this.groupingResultList = []
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

    // 导出为Excel表格
    async leadoutExcelHandle () {
      if (this.leadoutLoading) return
      if (this.tableData.length <= 0) {
        this.$Message.warning('没有需要导出的数据')
        return false
      }
      const params = Object.assign({}, this.form)
      params.workLoadList = this.tableData
      this.leadoutLoading = true
      try {
        const { data } = await operatorLeadout(params)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: "application/vnd.ms-excel" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "操作员工作量统计.xls";
        link.click();
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
        source: ''
      }
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate)
      this.$set(this.form, 'endDate', curDate)
      this.$set(this.form, 'medicalDateStart', curDate)
      this.$set(this.form, 'medicalDateEnd', curDate)
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
        this.getGroups()
      }
    },
    // 清除单位
    clearUnit () {
      this.$set(this.form, 'unitId', '')
      this.$set(this.form, 'unitName', '')
      this.$set(this.form, 'unitVisitSn', '')
      this.$set(this.form, 'groupId', '')
      this.groupingResultList = []
      this.unitVisitSnList = []
    },
    // 修改单位体检分组
    changeUnitGroup (val) {
      val ? this.$set(this.form, 'groupId', val) : this.$set(this.form, 'groupId', '')
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

    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod ({ row, $rowIndex, column, data }) {
      const fields = ['doctorId', 'operatorName', 'operateCount']
      const cellValue = XEUtils.get(row, column.property)
      console.log(cellValue)
      if (cellValue && fields.includes(column.property)) {
        const prevRow = data[$rowIndex - 1]
        let nextRow = data[$rowIndex + 1]
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
            nextRow = data[++countRowspan + $rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    }
  }
}
</script>
<style lang="less">
.operator-workload-page-wrapper {
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
