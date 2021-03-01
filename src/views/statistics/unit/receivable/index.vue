<template>
  <div class="unit-receivable-page-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">单位应收费用统计</span>
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

              <FormItem label="体检单位"
                        prop="unitId"
                        :label-width="80">
                <Select v-model="form.unitId"
                        class="unitSelect"
                        ref="unitSelectBox"
                        clearable
                        filterable
                        remote
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
                        @on-change="changeUnitVisitSn"
                        clearable
                        :label-in-value="true">
                  <Option v-for="item in unitVisitSnList"
                          :value="item.unitVisitSn"
                          :key="item.unitVisitSn">{{item.unitVisitSn}}</Option>
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
          <div class="search-info">登记时间：
            <template v-if="registerStartDate">
              <span>{{registerStartDate}}</span>&nbsp;到&nbsp;
              <span>{{registerEndDate}}</span>
            </template>
          </div>
          <div class="unit-statistics-table">
            <div class="row">
              <div class="title">体检单位</div>
              <div class="cont text-fix"
                   style="width:40%;">{{unitName}}</div>
              <div class="title">体检人数</div>
              <div class="cont">{{peopleNumber}}</div>
              <div class="title">体检次数</div>
              <div class="cont">{{unitVisitSn}}</div>
            </div>
            <div class="row">
              <div class="title">标准费用（公费）</div>
              <div class="cont"
                   style="width:40%;">{{standardImpartialAmount || standardImpartialAmount === 0 ? standardImpartialAmount.toFixed(2) : ''}}</div>
              <div class="title">标准费用（自费）</div>
              <div class="cont">{{standardOneselfAmount || standardOneselfAmount === 0 ? standardOneselfAmount.toFixed(2) : ''}}</div>
              <div class="title">标准费用合计</div>
              <div class="cont">{{standardTotalAmount || standardTotalAmount === 0 ? standardTotalAmount.toFixed(2) : ''}}</div>
            </div>
            <div class="row">
              <div class="title">加项费用（公费）</div>
              <div class="cont"
                   style="width:40%;">{{addItemImpartialAmount || addItemImpartialAmount === 0 ? addItemImpartialAmount.toFixed(2) : ''}}</div>
              <div class="title">加项费用（自费）</div>
              <div class="cont">{{addItemOneselfAmount || addItemOneselfAmount === 0 ? addItemOneselfAmount.toFixed(2) : ''}}</div>
              <div class="title">加项费用合计</div>
              <div class="cont">{{addItemTotalAmount || addItemTotalAmount === 0 ? addItemTotalAmount.toFixed(2) : ''}}</div>
            </div>
            <div class="row">
              <div class="title">公费总计</div>
              <div class="cont"
                   style="width:40%;">{{impartialTotalAmount ? impartialTotalAmount.toFixed(2) : ''}}</div>
              <div class="title">自费总计</div>
              <div class="cont">{{oneselfTotalAmount || oneselfTotalAmount === 0 ? oneselfTotalAmount.toFixed(2) : ''}}</div>
              <div class="title">总计</div>
              <div class="cont">{{totalAmount || totalAmount === 0 ? totalAmount.toFixed(2) : ''}}</div>
            </div>
          </div>
          <div class="search-info">标准费用明细：</div>
          <vxe-table class="mytable-footer"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :max-height="300"
                     :data="standardTableData"
                     :footer-method="standardFooter"
                     footer-row-class-name="table-footer-row"
                     :loading="isLoading">
            <vxe-table-column type="index"
                              title="序号"
                              width="60"></vxe-table-column>
            <vxe-table-column field="groupingName"
                              title="体检分组"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="groupingPropertyName"
                              title="分组属性"
                              width="120"></vxe-table-column>
            <vxe-table-column field="standardPrice"
                              title="标准价格"
                              width="120"></vxe-table-column>
            <vxe-table-column field="discount"
                              title="折扣"
                              width="80">
              <template v-slot="{ row }">
                <span>{{row.discount + '%'}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="receivablePrice"
                              title="实收单价"
                              width="120"></vxe-table-column>
            <vxe-table-column field="speopleNumber"
                              title="人数"
                              width="140"></vxe-table-column>
            <vxe-table-column field="standardAmount"
                              title="标准金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.standardAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="soneselfCostAmount"
                              title="自费金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.soneselfCostAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="simpartialExpenseAmount"
                              title="公费金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.simpartialExpenseAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="stotalAmount"
                              title="合计金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.stotalAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
          </vxe-table>
          <div class="search-info">加项费用明细：</div>
          <vxe-table class="mytable-footer"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     :max-height="300"
                     header-row-class-name="table-row"
                     :data="addItemTableData"
                     :footer-method="addItemFooter"
                     footer-row-class-name="table-footer-row"
                     :loading="isLoading">
            <vxe-table-column type="index"
                              title="序号"
                              width="60"></vxe-table-column>
            <vxe-table-column field="groupingName"
                              title="体检分组"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="addItemPropertyName"
                              title="加项属性"
                              width="120"></vxe-table-column>
            <vxe-table-column field="apeopleNumber"
                              title="加项人数"
                              width="120"></vxe-table-column>
            <vxe-table-column field="aoneselfCostAmount"
                              title="自费金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.aoneselfCostAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="aimpartialExpenseAmount"
                              title="公费金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.aimpartialExpenseAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="atotalAmount"
                              title="合计金额"
                              width="120">
              <template v-slot="{row}">
                <span>{{row.atotalAmount.toFixed(2)}}</span>
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
import { unitReceivableList, unitGroupInfo, unitReceivableLeadout } from '@/api/workload'
import moment from 'moment'

export default {
  name: 'unitReceivable',
  data () {
    return {
      form: {
        unitId: '',
        unitVisitSn: ''
      },
      unitSearchLoading: false,
      unitTimer: null,
      unitsList: [],
      groupsList: [],
      standardTableData: [], // 标准表数据
      addItemTableData: [], // 加项表数据
      isLoading: false,
      unitVisitSnList: [], // 单位体检次数列表
      unitName: '', // 体检单位
      unitVisitSn: '', // 体检次数
      peopleNumber: '', // 体检人数
      standardImpartialAmount: '', // 标准费用（公费）
      standardOneselfAmount: '', // 标准费用（自费）
      standardTotalAmount: '', // 标准费用总计
      addItemImpartialAmount: '', // 加项费用（公费）
      addItemOneselfAmount: '', // 加项费用（自费）
      addItemTotalAmount: '', // 加项费用总计
      impartialTotalAmount: '', // 公费总计
      oneselfTotalAmount: '', // 自费总计
      totalAmount: '', // 总计
      registerStartDate: '', // 登记时间
      registerEndDate: '',
      leadoutLoading: false

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
    this.$store.dispatch('getCategoryDict')
    let curDate = moment().format('YYYY-MM-DD')

    this.$set(this.form, 'startDate', curDate)
    this.$set(this.form, 'endDate', curDate)
  },
  methods: {
    // 获取总检医生工作量统计列表
    getList () {
      if (this.isLoading) return
      if (this.form.unitId == '') {
        this.$Message.warning('请选择需要统计的单位')
        return false
      }
      if (this.form.unitVisitSn == '') {
        this.$Message.warning('请选择单位体检次数')
        return false
      }

      // 格式化时间
      this.form.startDate = this.form.startDate != '' ? moment(this.form.startDate).format('YYYY-MM-DD') : ''
      this.form.endDate = this.form.endDate != '' ? moment(this.form.endDate).format('YYYY-MM-DD') : ''
      this.isLoading = true
      unitReceivableList(this.form).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          let result = data.data
          this.standardTableData = result.standardCostList || []
          this.addItemTableData = result.addItemCostList || []
          this.registerStartDate = this.form.startDate
          this.registerEndDate = this.form.endDate
          this.unitName = result.unitName
          this.unitVisitSn = result.unitVisitSn
          this.peopleNumber = result.peopleNumber
          this.standardImpartialAmount = result.standardImpartialAmount
          this.standardOneselfAmount = result.standardOneselfAmount
          this.standardTotalAmount = result.standardTotalAmount
          this.addItemImpartialAmount = result.addItemImpartialAmount
          this.addItemOneselfAmount = result.addItemOneselfAmount
          this.addItemTotalAmount = result.addItemTotalAmount
          this.impartialTotalAmount = result.impartialTotalAmount
          this.oneselfTotalAmount = result.oneselfTotalAmount
          this.totalAmount = result.totalAmount
        } else {
          this.standardTableData = []
          this.addItemTableData = []
          this.registerStartDate = ''
          this.registerEndDate = ''
          this.unitName = ''
          this.unitVisitSn = ''
          this.peopleNumber = ''
          this.standardImpartialAmount = ''
          this.standardOneselfAmount = ''
          this.standardTotalAmount = ''
          this.addItemImpartialAmount = ''
          this.addItemOneselfAmount = ''
          this.addItemTotalAmount = ''
          this.impartialTotalAmount = ''
          this.oneselfTotalAmount = ''
          this.totalAmount = ''
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 更改单位体检次数
    changeUnitVisitSn (e) {
      if (!e) {
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

    // 导出为Excel表格
    async leadoutExcelHandle () {
      if (this.leadoutLoading) return
      if (this.standardTableData.length <= 0 && this.addItemTableData.length <= 0) {
        this.$Message.warning('没有需要导出的数据')
        return false
      }
      let params = Object.assign({}, this.form)
      params.peopleNumber = this.peopleNumber
      params.standardImpartialAmount = this.standardImpartialAmount
      params.standardOneselfAmount = this.standardOneselfAmount
      params.standardTotalAmount = this.standardTotalAmount
      params.addItemImpartialAmount = this.addItemImpartialAmount
      params.addItemOneselfAmount = this.addItemOneselfAmount
      params.addItemTotalAmount = this.addItemTotalAmount
      params.impartialTotalAmount = this.impartialTotalAmount
      params.oneselfTotalAmount = this.oneselfTotalAmount
      params.totalAmount = this.totalAmount
      params.standardCostList = this.standardTableData
      params.addItemCostList = this.addItemTableData
      this.leadoutLoading = true
      try {
        const { data } = await unitReceivableLeadout(params)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: "application/vnd.ms-excel" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "单位应收费用统计.xls";
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
        unitId: '',
        unitVisitSn: ''
      }
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate)
      this.$set(this.form, 'endDate', curDate)
      this.clearUnit()
      this.standardTableData = []
      this.addItemTableData = []
      this.registerStartDate = ''
      this.registerEndDate = ''
      this.unitName = ''
      this.unitVisitSn = ''
      this.peopleNumber = ''
      this.standardImpartialAmount = ''
      this.standardOneselfAmount = ''
      this.standardTotalAmount = ''
      this.addItemImpartialAmount = ''
      this.addItemOneselfAmount = ''
      this.addItemTotalAmount = ''
      this.impartialTotalAmount = ''
      this.oneselfTotalAmount = ''
      this.totalAmount = ''
    },

    // 修改单位
    changeUnit (obj) {
      if (obj) {
        this.$set(this.form, 'unitId', obj.value)
        this.$set(this.form, 'unitName', obj.label)
        this.$set(this.form, 'unitVisitSn', '')
        this.getGroups()
      }
    },
    // 清除单位
    clearUnit () {
      this.$set(this.form, 'unitId', '')
      this.$set(this.form, 'unitName', '')
      this.$set(this.form, 'unitVisitSn', '')
      this.unitVisitSnList = []
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
    standardFooter ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 7) {
            return `合计：`
          }
          switch (column.property) {
            case 'soneselfCostAmount':
              return `${(Math.round(XEUtils.sum(data, 'soneselfCostAmount') * 100) / 100).toFixed(2)}`
            case 'simpartialExpenseAmount':
              return `${(Math.round(XEUtils.sum(data, 'simpartialExpenseAmount') * 100) / 100).toFixed(2)}`
            case 'stotalAmount':
              return `${(Math.round(XEUtils.sum(data, 'stotalAmount') * 100) / 100).toFixed(2)}`
          }
          return '-'
        })
      ]
    },
    addItemFooter ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 3) {
            return `合计：`
          }
          switch (column.property) {
            case 'aoneselfCostAmount':
              return `${(Math.round(XEUtils.sum(data, 'aoneselfCostAmount') * 100) / 100).toFixed(2)}`
            case 'aimpartialExpenseAmount':
              return `${(Math.round(XEUtils.sum(data, 'aimpartialExpenseAmount') * 100) / 100).toFixed(2)}`
            case 'atotalAmount':
              return `${(Math.round(XEUtils.sum(data, 'atotalAmount') * 100) / 100).toFixed(2)}`
          }
          return '-'
        })
      ]
    },
    rowClassName ({ row, rowIndex }) {
      if (row.payType == '合计：') {
        return 'row--current table-row'
      } else {
        return 'table-row'
      }
    }

  }
}
</script>
<style lang="less">
.unit-receivable-page-wrapper {
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
      margin: 10px 0;
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
  .unit-statistics-table {
    width: 100%;
    height: auto;
    border-top: 1px solid #e6e6e6;
    border-left: 1px solid #e6e6e6;
    .row {
      display: flex;
      align-items: center;
      text-align: center;
      width: 100%;
      & > div {
        width: 12%;
        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        color: #252525;
      }
      .title {
        font-weight: bold;
      }
      .title::after {
        display: none;
      }
      .text-fix {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .table-row {
    color: #252525;
  }
  .table-footer-row {
    font-weight: bold;
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
