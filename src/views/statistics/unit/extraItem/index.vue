<template>
  <div class="extra-item-statistics-page-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">单位加项统计</span>
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
              <FormItem label="体检分组"
                        prop="groupId"
                        :label-width="80">
                <Select v-model="form.groupId"
                        size="small"
                        style="width:140px"
                        @on-change="changeUnitGroup"
                        clearable>
                  <Option v-for="item in groupingResultList"
                          :value="item.groupingId"
                          :key="item.groupingId">{{ item.groupingName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="收费类型"
                        prop="payType"
                        :label-width="80">
                <Select v-model="form.payType"
                        @on-change="payTypeChange"
                        clearable
                        size="small">
                  <Option value="">全部</Option>
                  <Option value="1">个人支付</Option>
                  <Option value="0">单位支付</Option>
                </Select>
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
          <div class="search-info"></div>
          <vxe-table class="mytable-footer"
                     ref="xTree"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     :row-class-name="rowClassName"
                     header-row-class-name="table-row"
                     :height="(screenHeight - 320) <= 500 ? 500 : (screenHeight - 320)"
                     :data="tableData"
                     :seq-config="{startIndex: 1}"
                     :footer-method="footerMethod"
                     footer-row-class-name="table-footer-row"
                     :tree-config="tableTreeConfig"
                     :span-method="colspanMethod"
                     :loading="isLoading">
            <vxe-table-column field="patientName"
                              tree-node
                              title="姓名"></vxe-table-column>
            <vxe-table-column field="groupingName"
                              title="体检分组"
                              width="200"></vxe-table-column>
            <vxe-table-column field="registerCode"
                              title="登记流水号"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="addItemName"
                              title="加项项目名称"></vxe-table-column>
            <vxe-table-column field="payType"
                              title="结算方式"></vxe-table-column>
            <vxe-table-column field="addItemPrice"
                              title="加项价格">
              <template v-slot="{row}">
                <span>{{row.addItemPrice || row.addItemPrice === 0 ? Number(row.addItemPrice).toFixed(2) : ''}}</span>
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
import { extraItemStatisticsList, unitGroupInfo, extraItemLeadout } from '@/api/workload'
import moment from 'moment'

export default {
  name: 'extraItemStatistics',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        unitId: '',
        unitVisitSn: ''
      },
      unitSearchLoading: false,
      unitTimer: null,
      unitsList: [],
      groupsList: [],
      tableData: [],
      isLoading: false,
      unitVisitSnList: [], // 单位体检次数列表
      groupingResultList: [], // 单位分组列表
      tableTreeConfig: {
        children: 'addItemList',
        accordion: true, // 一层只允许展开一个节点
        expandAll: false, // 默认是否全部展开
        trigger: 'row' // 展开方式，点击行展开
      },
      leadoutLoading: false,
      totalAddItemsPrice: '' // 合计字段：加项价格
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
    // 获取统计列表
    getList () {
      if (this.form.unitId == '') {
        this.$Message.warning('请选择需要统计的单位')
        return false
      }
      // 格式化时间
      this.form.startDate = this.form.startDate != '' ? moment(this.form.startDate).format('YYYY-MM-DD') : ''
      this.form.endDate = this.form.endDate != '' ? moment(this.form.endDate).format('YYYY-MM-DD') : ''
      this.isLoading = true
      extraItemStatisticsList(this.form).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = this.getGroupSummary(data.data)
        } else {
          this.tableData = []
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
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
      params.addUnitList = this.tableData
      params.groupingPrice = this.totalAddItemsPrice

      this.leadoutLoading = true
      try {
        const { data } = await extraItemLeadout(params)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: "application/vnd.ms-excel" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "单位加项统计.xls";
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
      this.tableData = []
    },

    // 更改支付类型
    payTypeChange (e) {
      if (!e) {
        this.form.payType = ''
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
          this.unitVisitSnList = data.data.unitVisitSnList
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 表格汇总
    getGroupSummary (data) {
      XEUtils.eachTree(data, (row, index, items, path, parent, nodes) => {
        let children = row.addItemList
        if (children && children.length) {
          // 合计子节点
          Object.assign(row, this.handleSummary(children))
        } else {
          if (index === items.length - 1) {
            // 全量汇总
            for (let len = nodes.length - 2; len >= 0; len--) {
              // console.log(nodes[len])
              Object.assign(nodes[len], this.handleSummary(nodes[len].addItemList))
            }
          }
        }
      }, this.tableTreeConfig)
      XEUtils.eachTree(data, (row) => {
        let children = row.addItemList
        if (children && children.length) {
          // 动态增加一行汇总
          children.push({
            payType: `合计：`,
            addItemPrice: row.addItemPrice
          })
        }
      }, this.tableTreeConfig)
      return data
    },
    // 计算逻辑
    handleSummary (children) {
      return {
        addItemPrice: (Math.round(XEUtils.sum(children, 'addItemPrice') * 100) / 100).toFixed(2)
      }
    },
    colspanMethod ({ row, $rowIndex, column, columnIndex, data }) {
      // 当行被展开时将行合并
      let xTree = this.$refs.xTree
      if (row.addItemList && row.addItemList.length && xTree && xTree.isTreeExpandByRow(row)) {
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
          if (columnIndex === 4) {
            return `合计：`
          }
          switch (column.property) {
            case 'addItemPrice':
              this.totalAddItemsPrice = (Math.round(XEUtils.sum(data, 'addItemPrice') * 100) / 100).toFixed(2)
              return `${(Math.round(XEUtils.sum(data, 'addItemPrice') * 100) / 100).toFixed(2)}`
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
.extra-item-statistics-page-wrapper {
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
