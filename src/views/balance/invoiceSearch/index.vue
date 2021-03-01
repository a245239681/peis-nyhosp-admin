<template>
  <div class="invoice-search-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">发票查询</span>
      </div>
      <div class="body-top">
        <Form :label-width="80"
              ref="form"
              :model="formData"
              inline>
          <Row :gutter="16"
               type="flex">
            <FormItem label="发票号码" prop="invoiceNoS">
              <Input v-model="formData.invoiceNoS" size="small"/>
            </FormItem>
            <FormItem label="到" prop="invoiceNoE" :label-width="20">
              <Input v-model="formData.invoiceNoE" size="small"/>
            </FormItem>
            <FormItem label="就诊卡号" prop="idNo">
              <Input v-model="formData.idNo" size="small" style="width:200px;"/>
            </FormItem>
            <FormItem label="病人姓名" prop="name">
              <Input v-model="formData.name" size="small"/>
            </FormItem>
            <FormItem label="收费日期">
              <DatePicker type="daterange"
                        :value="daterangeValue"
                        size="small"
                        split-panels
                        placement="bottom-start"
                        placeholder="请选择日结时间范围"
                        @on-change="searchByDaterange"
                        style="width: 240px;"></DatePicker>
            </FormItem>
            <FormItem label="收款员"
                      prop="getFeeManId">
              <Select v-model="formData.getFeeManId"
                      :label-in-value="true"
                      @on-change="changePerson"
                      :disabled="!showAll"
                      filterable
                      size="small"
                      style="width:150px;">
                <Option value="all"
                        label="全部">全部</Option>
                <Option v-for="item in receiverList"
                        :value="item.doctorId"
                        :key="item.doctorId">{{item.doctorName}}</Option>
              </Select>
            </FormItem>
            <FormItem label="单位名称" prop="unitId">
              <Select v-model="formData.unitId"
                      style="width:366px;"
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
            <FormItem label="登记流水号" prop="registerCode" :label-width="90">
              <Input v-model="formData.registerCode" size="small" style="width:200px;"/>
            </FormItem>
          
           
          </Row>
            <div style="float:right;">
                <Button
                    type="primary"
                    @click="search"
                    >查询</Button>
            <Button style="margin-left:10px;"               
                  @click="refSeachList">重置</Button>
                       <!-- @click="print" -->
            <Button style="margin-left:10px;margin-right:30px;"
                  type="primary"
             
                  v-permission="['print']">打印</Button>   
            </div>
        </Form>
      </div>
    <!-- height="400" -->
      <div class="body-main page-body">
        <vxe-table class="mytable-footer"
                    ref="workloadTable"
                    border
                    stripe
                    align="center"
                    :auto-resize="true"
                    highlight-hover-row
                    show-footer
                    :footer-method="footerMethod"
                    :data="tableData"
                    :loading="isLoading">
          <vxe-table-column type="index" width="60"></vxe-table-column>
          <vxe-table-column field="invoiceNo" title="发票号码" min-width="140"></vxe-table-column>
          <vxe-table-column field="name" title="姓名" min-width="125"></vxe-table-column>
          <vxe-table-column field="payType" title="付款方式" min-width="100"></vxe-table-column>
          <vxe-table-column field="medicalInsuranceNum" title="医保号" min-width="166"></vxe-table-column>
          <vxe-table-column field="getFeeDate" title="收费日期" min-width="180"></vxe-table-column>
          <vxe-table-column field="prescriptionMoney" title="处方金额" min-width="100"></vxe-table-column>
          <vxe-table-column field="cashMoney" title="现金金额" min-width="100"></vxe-table-column>
          <vxe-table-column field="unionMoney" title="银联金额" min-width="100"></vxe-table-column>
          <vxe-table-column field="aliMoney" title="支付宝金额" min-width="100"></vxe-table-column>
          <vxe-table-column field="weChatMoney" title="微信金额" min-width="100"></vxe-table-column>
          <vxe-table-column field="otherMoney" title="其他金额" min-width="100"></vxe-table-column>
          <vxe-table-column field="back" title="作废" min-width="80">
            <template v-slot="{ row }">
              <span>{{row.back? '是' : '否'}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="backMoney" title="退费金额" min-width="100" show-overflow></vxe-table-column>
        </vxe-table>
      </div>
    </Card>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import moment from "moment";
import { getInvoiceNo } from "@/api/invoiceSearch.js";
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import { listByName } from '@/api/personal_register.js'

export default {
  name: "invoiceSearch",
  data () {
    return {
      formData: {
        getFeeManId: "all",
        getFeeDateS: '',
        getFeeDateE: ''
      },
      tableData: [],
      daterangeValue: [],
      getData: [],  //用于传给后台，无多余自动添加XID参数，避免接口报错
      unitsList: [],
      showAll: false,
      printLoading: false,
      isLoading: false, 
      unitSearchLoading: false,
      unitTimer: null
    };
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
    receiverList: {
      get: function () {
        return this.$store.getters.getExamDoctorDict
      },
      set: function () { }
    }
  },
  created () {
    let curDate = moment().format('YYYY-MM-DD')
    // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
    // this.$set(this.formData, 'getFeeDateS', curDate)
    // this.$set(this.formData, 'getFeeDateE', curDate)
    let params = {
      deptName: '财务科',
      deptId: ''
    }
    this.$store.dispatch("getExamDoctorDict", { params, btn: true }).then(({data}) => {
      if (JSON.stringify(data) !== '[]') {
        // 设置结算人id
        this.setClaimant()
        this.search()
      }
    })
  },
  methods: {
    // 判断登录账号是否为财务科中的人
    setClaimant () {
      let result = this.receiverList.some(item => {
        console.log(item.doctorId)
        return item.doctorId == this.userInfo.userId
      })
      // console.log(result)
      if (result) {
        this.formData.getFeeManId = this.userInfo.userId
        this.formData.getFeeMan = this.userInfo.poName
        this.showAll = false
      } else {
        this.formData.getFeeManId = 'all'
        this.showAll = true
      }
    },
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['prescriptionMoney', 'cashMoney','unionMoney','aliMoney','weChatMoney','otherMoney','backMoney'].includes(column.property)) {
            return XEUtils.sum(data, column.property).toFixed(2)
          }
          return null
        }),
      ]
    },
    changePerson (e) {
      console.log(e)
      if (e) {
        this.formData.getFeeManId = e.value
        this.formData.getFeeMan = e.label
      }
    },
    search() {
      console.log(this.formData)
      if (this.isLoading) return false;
      this.isLoading = true;
      let params = {
        name: this.formData.name || '',
        registerCode: this.formData.registerCode || '',
        idNo: this.formData.idNo || '',
        getFeeMan: this.formData.getFeeMan || '',
        unitId: this.formData.unitId || '',
        invoiceNoS: this.formData.invoiceNoS || '',
        invoiceNoE: this.formData.invoiceNoE || '',
        // getFeeDateS: '',
        // getFeeDateE: ''
        getFeeDateS: this.formData.getFeeDateS ? moment(this.formData.getFeeDateS).format('YYYY-MM-DD') : '',
        getFeeDateE:this.formData.getFeeDateE ? moment(this.formData.getFeeDateE).format('YYYY-MM-DD') : ''
      }
      getInvoiceNo(params).then(({ data }) => {
        console.log('拿到的data数据')
        console.log(data)
        // JSON 数据深拷贝，解决vxe-table自动加上_XID参数，后端不接收该参数
        if (data.code == 0) {
          let arr = []
          for(let x in data.data){
              let json=data.data[x];
              arr.push(JSON.parse(JSON.stringify(json)));
          }
          this.getData = data.data;
          this.tableData = arr;
        } else {
          this.$Message.error(data.message);
        }
        this.isLoading = false;
        console.log('表格数据')
        console.log(this.tableData)
        console.log('临时数据')
        console.log(this.getData)
      }).catch(err => {
        console.log(err)
        this.tableData = [];
        this.isLoading = false;
        this.$Message.error("网络不稳定，请稍后重试");
      })
    },
    refSeachList () {
      this.formData = {}
      this.setClaimant()
      // let curDate = moment().format('YYYY-MM-DD')
      this.daterangeValue = []
      this.tableData = []
      this.getData = []
      this.unitsList = []
    },
    // 工作量打印
    // print () {
    //   if (!printNotice()) return false
    //   if (JSON.stringify(this.getData) === '[]') {
    //     this.$Message.error('不可打印无数据的统计表');
    //     return false
    //   }
    //   if (this.printLoading) return false
    //   this.printLoading = true;
    //   let dateRange = {
    //     startTime: moment(this.formData.getFeeDateS).format('YYYY-MM-DD'),
    //     endTime: moment(this.formData.getFeeDateE).format('YYYY-MM-DD'),
    //   }
    //   printWorkload(dateRange, this.getData).then(({ data }) => {
    //     if (data.code == 0) {
    //       let printParams = {
    //         guideUrl: this.$url + data.data,
    //         selGroup: ['printGuide'],
    //         taskName: '发票清单'
    //       }
    //       printMethods(printParams.guideUrl, printParams)
    //     } else {
    //       this.$Message.error(data.message);
    //     }
    //     this.printLoading = false;
    //   }).catch(err => {
    //     this.printLoading = false;
    //     this.$Message.error("网络不稳定，请稍后重试");
    //   })
    // },
    searchByDaterange(daterange) {
      console.log(daterange)
      this.createDateS = daterange[0]
      this.createDateE = daterange[1]
      this.$set(this.formData, 'getFeeDateS', daterange[0])
      this.$set(this.formData, 'getFeeDateE', daterange[1])
    },
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
    //  选中单位后
    changeUnit (e) {
      if (e == undefined) return
      this.formData.unitName = e.label
      this.formData.unitId = e.value
      //  根据选中单位，带出相关单位信息
      let arr = this.unitsList.filter((item, index) => {
        return item.boUnitName == e.label
      })
    },
    //  清空单位后
    clearUnit () {
      this.formData.boUnitName = ''
      this.formData.boUnitCode = ''
      this.formData.boUnitId = ''
      this.formData.boGroupId = ''
      this.formData.boIsUnit = '0'
      this.unitsList = []
    }
  }
};
</script>
<style lang="less">
.invoice-search-wrapper {
  width: 100%;
  min-width: 800px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .serch-unit-result {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 30px;
    left: 0;
    z-index: 10;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    margin: 5px 0;
    overflow: auto;
    li {
      // color: #c5c8ce;
      padding: 0 10px;
      &:hover {
        background-color: #d6eaff;
      }
    }
  }
  .ivu-form-item {
    margin-bottom: 0px !important;
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
  .body-top {
    width: 100%;
    display: flex;
    padding-bottom: 15px;
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
