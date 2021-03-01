<template>
  <div class="person-balance-wrapper">
    <div class="left-sidebar-wrapper">
      <div class="base-msg-wrapper">
        <Card style="width: 100%">
          <div slot="title"
               class="search-title-wrapper">
            <span class="title">基本信息</span>
          </div>
          <div class="base-page-body">
            <Form :model="baseFormData"
                  :label-width="100"
                  ref="baseFormData"
                  :rules="ruleValidate"
                  :inline="true"
                  label-position="right">
              <Row type="flex"
                   class="form-body">
                <div class="form-content">
                  <FormItem label="姓名"
                            prop="boName">
                    <Input :disabled='disableStatus'
                           v-model="baseFormData.boName"
                           size="small"></Input>
                  </FormItem>
                  <FormItem label="性别"
                            prop="boSex">
                    <Input :disabled='disableStatus'
                           v-model="baseFormData.boSex"
                           size="small"></Input>
                  </FormItem>
                  <FormItem label="流水号"
                            prop="boRegisterCode">
                    <Input :disabled='disableStatus'
                           v-model="baseFormData.boRegisterCode"
                           size="small"></Input>
                  </FormItem>
                  <FormItem label="体检号"
                            prop="boPeId">
                    <Input :disabled='disableStatus'
                           v-model="baseFormData.boPeId"
                           size="small"></Input>
                  </FormItem>
                  <!-- <FormItem label="姓名">
                <Input v-model="baseFormData.name"
                       size="small"></Input>
              </FormItem>-->
                  <FormItem label="所属单位"
                            prop="boUnitName">
                    <Input :disabled='disableStatus'
                           v-model="baseFormData.boUnitName"
                           size="small"></Input>
                  </FormItem>
                  <FormItem label="单位体检次数"
                            prop="boUnitVisitSn">
                    <Input :disabled='disableStatus'
                           v-model="baseFormData.boUnitVisitSn"
                           size="small"></Input>
                  </FormItem>
                </div>
                <div class="form-btn">
                  <Button type="primary"
                          @click="openRight()">查询</Button>
                </div>
              </Row>

            </Form>
          </div>
        </Card>
      </div>
      <div class="pay-detail-wrapper">
        <Card style="width: 100%">
          <div slot="title"
               class="search-title-wrapper">
            <span class="title">费用明细</span>
            <!-- <span style="position:absolute;right: 16px;top: 4px;">
              <Button type='primary'
                      :loading="printLoading"
                      @click="printFP">打印</Button>
            </span> -->
          </div>
          <div class="page-body">
            <tree-table :loading="loadStatus"
                        ref="treeTable"
                        :columns="columns"
                        :data="treeData"
                        :expand-type="false"
                        :is-fold="true"
                        :selectable="true"
                        :empty-text="emptyText"
                        @checkbox-click="checkboxClick"
                        border
                        expand-key="name">
              <template slot="realPrice"
                        slot-scope="{row, rowIndex}">
                {{row.yingshou!=-1?row.yingshou:row.realPrice}}
              </template>
              <!-- <template slot="boIsOwnExpense"
                        slot-scope="{row, rowIndex}">
                <Checkbox :key="rowIndex"
                          v-model="allChecked"
                          @on-change="checkbox(row)"
                          :disabled="row.billStatus=='已缴费'"
                          true-value='1'
                          false-value='0'></Checkbox>
              </template> -->
            </tree-table>
            <!-- <Table :columns="columns"
                   :data="tableData"
                   :loading="isLoading">
              <template slot="action"
                        slot-scope="{row}">

                <Button type="error"
                        style="margin-left: 8px;"
                        v-permission="['del']"
                        size="small">删除</Button>
              </template>
            </Table>-->
          </div>
          <div class="page-footer">
            <div class="money-total">
              总计：
              <span>{{ treeData.length }}</span>项，合计
              <strong>{{ totalAccount }}</strong>元
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div class="right-sidebar-wrapper">
      <Card style="width: 300px">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">结算信息</span>
        </div>
        <div class="item-wrapper">
          <Form style="min-height: 300px"
                :model="accountFrom"
                :label-width="70"
                ref="accountFrom"
                :rules="ruleAccount"
                label-position="right">
            <FormItem label="发票号"
                      prop="boInvoiceNo">
              <Input :readonly='true'
                     v-model="accountFrom.boInvoiceNo"
                     size="small"></Input>
            </FormItem>
            <!-- <FormItem label="收据号" prop="boReceiptNo">
              <Input v-model="accountFrom.boReceiptNo" size="small"></Input>
            </FormItem> -->
            <FormItem label="合计金额"
                      style="margin-top:5px;">
              <div style="color:red;font-size:40px">
                {{totalAccount}}
              </div>
              <!-- <Input v-model="totalAccount"
                     class='input_red'
                     size="small"
                     :readonly="true"></Input> -->
            </FormItem>
            <!-- <FormItem label="折后金额">
              <Input v-model="accountFrom.discountMoney"
                     size="small"></Input>
            </FormItem>-->
            <FormItem label="应收金额"
                      prop="boRealAmount">
              <div style="color:red;font-size:40px">
                {{accountFrom.boRealAmount}}
              </div>
              <!-- <Input class='input_red'
                     v-model="accountFrom.boRealAmount"
                     size="small"
                     :readonly="true"></Input> -->
            </FormItem>
            <FormItem v-if="paymethod == 'XJZF'"
                      label="实收金额"
                      prop="boSettleAmount"
                      style="margin-top:5px">
              <Input v-model="accountFrom.boSettleAmount"
                     number
                     class='input_red'
                     size="small"
                     type="number"></Input>
            </FormItem>
            <FormItem v-if="paymethod == 'XJZF'"
                      label="找零金额">
              <Input v-model="AccountChange"
                     class='input_red'
                     size="small"
                     :readonly="true"></Input>
            </FormItem>
            <FormItem v-if="paymethod == 'ZFBZF' || paymethod == 'WXZF'"
                      label="扫码框"
                      :label-width="70"
                      prop="boAuthCode"
                      style="margin-top:5px">
              <input style='padding: 1px 7px;height: 24px;border-radius: 3px;'
                     v-model="accountFrom.boAuthCode"
                     size="small"
                     id="Code"></input>
            </FormItem>
          </Form>
          <div class="charge-method-wrapper">
            <p class="title">收费方式</p>
            <div class="charge-method-main">
              <div class="charge-methods-select">
                <Button v-for="item in payMethodsList"
                        :key="item.boId"
                        :type="paymethod == item.boCode ? 'primary':'default'"
                        style="margin-bottom:10px;margin-left: 10px"
                        @click="selectPayMethods(item.boCode,item.boName)"
                        size="small">{{ item.boName }}</Button>
              </div>
              <div class="is-print-bill">
                <Checkbox v-model="isPrintBill"
                          v-permission="['print']"
                          :disabled="isPrintBill">是否打印发票</Checkbox>
              </div>
              <div class="handle-wrapper">
                <Button :disabled='balaceStatus == 1||treeData.length<1'
                        :loading='isLoading'
                        type="primary"
                        style="width: 100%;margin-bottom:10px;min-height:30px"
                        size="small"
                        @click="makeSureBalace('accountFrom')">确认收费</Button>
                <!-- <Button type="primary" style="width: 100%;margin-bottom:10px;" size="small">补打发票</Button> -->
                <!-- <Button type="primary" style="width: 100%;margin-bottom:10px;" size="small">打印收费明细</Button> -->
                <Button type="error"
                        style="width: 100%;margin-top: 20px;margin-bottom:10px;min-height:30px"
                        size="small"
                        @click="clearForm">清屏</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <info :visible="searchVisible"
          ref="InfoSearch"
          @func="getBasicInfo"
          @close="searchVisible = false">
      <!-- <div class="silde-btn" @click="searchVisible = true">
        <Icon type="ios-arrow-back" class="slide-icon"/>
      </div> -->
    </info>
  </div>
</template>
<script>
// import SearchInfo from './searchInfo'
import Info from '../components/search'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import { mapGetters } from 'vuex'
import {
  getBalaceList,
  makeBalace,
  payMethods,
  invoiceAndReceipt,
  print
} from '@/api/personBalace.js'
import { ELOOP, EDEADLK } from 'constants'
import { Promise } from 'q'
import { debuglog } from 'util'
export default {
  name: 'personBalance',
  components: {
    Info
  },
  data () {
    const numberCheck = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('输入数字小于0'))
      } else {
        callback()
      }
    }

    return {
      printLoading: false,
      allChecked: false,
      checked: false,
      balaceStatus: 0,
      disableStatus: false,
      treeData: [],
      baseFormData: {},
      accountFrom: {
        boSettleAmount: 0,
        boRealAmount: 0,
        boPayType: []
      },
      disabled: false,
      searchVisible: false,
      accountChange: 0,
      columns: [
        // {
        //   width: 55,
        //   type: 'selection',
        //   align: 'center',
        //   headerAlign: 'center'
        // },
        {
          title: '项目组合名称',
          key: 'name',
          minWidth: 220,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '是否公费',
          key: 'IsOwnExpense',
          minWidth: 110,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '类型',
          key: 'type',
          minWidth: 120,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '执行科室',
          key: 'deptName',
          minWidth: 120,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '费用',
          key: 'price',
          minWidth: 120,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '应收费用',
          key: 'realPrice',
          type: 'template',
          minWidth: 120,
          align: 'center',
          headerAlign: 'center',
          template: 'realPrice'
        },
        // {
        //   title: '计价时间',
        //   key: 'time',
        //   minWidth: 120,
        //   align: 'center'
        // },
        // {
        //   title: '费用支付方',
        //   key: 'payName',
        //   minWidth: 120,
        //   align: 'center'
        // },
        {
          title: '费用状态',
          key: 'billStatus',
          minWidth: 120,
          align: 'center',
          headerAlign: 'center'
        }
        // {
        //   title: '操作',
        //   slot: 'action',
        //   fixed: 'right',
        //   width: 200,
        //   align: 'center',
        //   headerAlign: 'center'
        // }
      ],
      tableData: [],
      totalSize: 100,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      paymethod: '', // 支付方式：0现金、1银行卡、2社保卡、3微信、4支付宝
      isPrintBill: true,
      totalAccount: 0,
      loadStatus: false,
      ruleValidate: {
        // change: [
        //   { message: '请输入数字', trigger: 'change', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/ },
        //   { validator: numberCheck, trigger: 'blur' }
        // ]
        // boPeId: [{ required: true, message: '请填写体检号', trigger: 'change' }]
      },
      ruleAccount: {
        // boRealAmount: [
        //   { required: true, message: '暂无应收金额', trigger: 'change' }
        // ],
        // boAuthCode: [
        //   { required: true, message: '请扫码', trigger: 'blur' }
        // ],
        // boSettleAmount: [{ required: true, message: '请填写实收金额', type: 'number', min: 0, trigger: 'blur' }],
        boInvoiceNo: [
          {
            required: true,
            message: '此账号无发票号段，无法结算',
            trigger: 'blur'
          }
        ]
      },
      emptyText: '暂无数据',
      payMethodsList: []
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    AccountChange: function () {
      let change = 0
      change = this.accountFrom.boSettleAmount - this.accountFrom.boRealAmount
      return Number(change.toFixed(2))
    },
    boSettleAmount () {
      return this.accountFrom.boSettleAmount
    }
  },
  watch: {
    boSettleAmount (val, oldVal) {
      if (val >= 0) {
        this.accountFrom.boSettleAmount = val
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  },
  mounted () {
    this.getinvoiceAndReceipt()
    this.disableStatus = false
    this.getPayMethod()

    // console.log(this.getUserInfo)
    // this.accountFrom.boPayType = this.paymethod
  },
  methods: {
    // 检查当前页面打印权限
    checkPrintAuthority () {
      // console.log(this.$router.currentRoute.meta.authority)
      return this.$router.currentRoute.meta.authority.some(item => {
        return item == 'print'
      })
    },
    // 打印发票
    printFP () {
      // if (!this.disableStatus) {
      //   this.$Message.error('请选择需要打印的人')
      //   return
      // }

      // 如果该页面没有打印权限，则返回
      if (!this.checkPrintAuthority()) return false
      let pramas = {
        name: this.baseFormData.boName,
        cost: this.accountFrom.boRealAmount,
        invoiceNumber: this.accountFrom.boInvoiceNo,
        payee: this.$store.getters.getUserInfo.poName,
        chargeItem: '',
        registerCode: this.baseFormData.boRegisterCode
      }
      console.log(pramas)
      if (!printNotice()) return false
      this.printLoading = true
      print(pramas).then(({ data }) => {
        this.printLoading = false
        if (data.code == 0) {
          console.log(data)
          let printParams = {
            invoiceUrl: this.$url + data.data,
            selGroup: ['printInvoice']
          }
          printMethods(printParams.invoiceUrl, printParams)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.printLoading = false
        this.$Message.error('网络不稳定,请稍后重试')
      })
    },
    getBasicInfo (data) {
      // console.log(data)
      this.disableStatus = true
      // this.$refs['accountFrom'].resetFields()
      this.treeData = []
      this.$set(this.baseFormData, 'boVisitSn', data.basicInfo.boVisitSn)
      this.$set(this.baseFormData, 'boName', data.basicInfo.boName)
      this.$set(this.baseFormData, 'boSex', data.basicInfo.boSex)
      this.$set(this.baseFormData, 'boPeId', data.basicInfo.boPeId)
      this.$set(this.baseFormData, 'boUnitName', data.basicInfo.boUnitName)

      if (data.basicInfo.paymentType == '现金支付') {
        this.paymethod = 'XJZF'
      }
      if (data.basicInfo.paymentType == '银联支付') {
        this.paymethod = 'YLZF'
      }
      if (data.basicInfo.paymentType == '支付宝支付') {
        this.paymethod = 'ZFBZF'
      }
      if (data.basicInfo.paymentType == '微信支付') {
        this.paymethod = 'WXZF'
      }
      if (data.basicInfo.paymentAmount) {
        this.$set(
          this.accountFrom,
          'boSettleAmount',
          data.basicInfo.paymentAmount
        )
      } else {
        this.$set(this.accountFrom, 'boSettleAmount', 0)
      }
      this.$set(
        this.baseFormData,
        'boRegisterCode',
        data.basicInfo.boRegisterCode
      )
      this.$set(
        this.baseFormData,
        'boUnitVisitSn',
        data.basicInfo.boUnitVisitSn
      )
      this.$set(this.accountFrom, 'boVisitSn', data.basicInfo.boVisitSn)
      this.balaceStatus = data.basicInfo.boSettleStatus
      this.getList('baseFormData')

      // console.log(this.baseFormData)
    },
    // 选中check
    checkboxClick (row, rowIndex) {
      console.log(row)
      console.log(rowIndex)
    },
    getList (name, page = 1, size = 20) {
      this.loadStatus = true
      // console.log(this.baseFormData)
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getinvoiceAndReceipt()
          let pagination = {
            page: this.pageIndex,
            size: this.pageSize
          }
          getBalaceList(pagination, this.baseFormData).then(({ data }) => {
            // this.totalAccount = 0
            this.loadStatus = false
            if (data.data !== null) {
              this.treeData = data.data
              console.log(this.treeData)
              let tol = 0
              let yingshouOnce = 0
              let yingshouAll = 0
              let Peid = this.baseFormData.boPeId
              this.accountFrom.boPeId = Peid
              let d = true
              for (let i = 0; i < this.treeData.length; i++) {
                if (this.treeData[i].type == '加项') {
                  this.treeData[i].type = '自选'
                }
                if (this.treeData[i].children) {
                  this.treeData[i].children.forEach(res =>
                    this.$set(res, 'IsOwnExpense', '自费')
                  )
                }
                this.$set(this.treeData[i], 'IsOwnExpense', '自费')

                this.treeData[i].type == '加项'
                  ? (this.treeData[i].type = '自选')
                  : ''
                // if (this.balaceStatus == 2 || this.balaceStatus == 1) {
                //   this.balaceStatus == 2
                //     ? (this.treeData[i].boSettleStatus = '部分结算')
                //     : (this.treeData[i].boSettleStatus = '已结算')
                // } else {
                //   this.treeData[i].boSettleStatus = '未结算';
                // }
                if (this.treeData[i].yingshou != -1) {
                  tol = Number(this.treeData[i].yingshou)
                  yingshouOnce = Number(this.treeData[i].yingshou)
                } else {
                  tol += this.treeData[i].realPrice
                  yingshouAll += this.treeData[i].realPrice
                }

              }

              console.log(tol)
              let total = tol.toFixed(2)
              let yingshouTotal = (yingshouAll + yingshouOnce).toFixed(2)
              this.totalAccount = yingshouTotal
              this.accountFrom.boRealAmount = total
              this.$nextTick(() => {
                // console.log(this.$refs.treeTable)
                let objData = this.$refs.treeTable.bodyData
                console.log(objData)
                for (var i = 0; i < objData.length; i++) {
                  if (objData[i].billStatus && objData[i].billStatus == '未交费') {
                    objData[i]['_isChecked'] = true
                  } else {
                    objData[i]['_isDisabled'] = true
                  }
                }
                objData.forEach((item, index) => {
                  if (item.billStatus && item.billStatus == '未交费') {
                    item['_isChecked'] = true
                  } else {
                    item['_isdisabled'] = true
                  }
                })
              })
            } else {
              this.emptyText = '暂无数据'
              this.$Message.error('没有找到对应费用明细')
            }
          })
        } else {
          // console.log('fault')
        }
      })
    },
    openRight () {
      this.$refs.InfoSearch.showInfo(this.baseFormData)
    },
    selectPayMethods (code, paymethod) {
      this.disabled = false
      return new Promise((resolve, reject) => {
        this.accountFrom.boSettleAmount = 0
        this.accountFrom.boAuthCode = ''
        this.paymethod = code
        this.accountFrom.boPayType[0]['name'] = paymethod
        this.accountFrom.boPayType[0]['code'] = code
        resolve()
      }).then(function (res) {
        if (code == 'WXZF' || code == 'ZFBZF') {
          document.getElementById('Code').focus()
        }
      })

      // console.log(this.paymethod)
      // this.accountFrom.boPayType['money'] = this.accountFrom.boRealAmount
    },
    makeSureBalace (name) {
      // console.log(123)
      if (this.disabled && this.paymethod == 'XJZF') {
        this.$Message.error('实收金额不能为小于0')
        return false
      }
      if (
        Number(this.accountFrom.boSettleAmount) <
        Number(this.accountFrom.boRealAmount) &&
        this.paymethod == 'XJZF'
      ) {
        this.$Message.error('实收金额不能小于应收金额')
        return false
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isLoading = true
          // this.accountFrom.boPayType['money'] = this.accountFrom.boRealAmounts
          this.accountFrom.boPayType[0]['money'] = this.accountFrom.boRealAmount
          // console.log(this.isPrintBill)
          if (this.isPrintBill) {
            this.accountFrom.boIsPrint = 1
          } else {
            this.accountFrom.boIsPrint = 0
          }
          // console.log(this.accountFrom)
          this.upLoadBalace()
        }
      })
    },
    upLoadBalace () {
      return makeBalace(this.accountFrom)
        .then(({ data }) => {
          // console.log(data)
          if (data.code == '0') {
            this.printFP()
            this.isLoading = false
            this.$Message.success(data.message)
            this.clearForm()
            // this.getList('baseFormData')
            // this.$refs['accountFrom'].resetFields()
          } else {
            this.isLoading = false
            this.$Message.error(data.message)
          }
        }).catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    getPayMethod () {
      payMethods().then(({ data }) => {
        this.payMethodsList = data.data
        this.paymethod = data.data[0].boCode
        // this.accountFrom.boPayType = this.paymethod
        // this.accountFrom.boPayType['name'] = data.data[0].boName
        let i3 = { name: data.data[0].boName, code: this.paymethod }
        this.accountFrom.boPayType.push(i3)
        // console.log(this.paymethod)
        // this.accountFrom.boPayType['money'] = this.accountFrom.boRealAmount
        // console.log(data){name:xj, money: 200}
      })
    },
    clearForm () {
      // this.$refs['baseFormData'].resetFields()
      this.baseFormData = {}
      this.accountFrom = {
        boAuthCode: '',
        boSettleAmount: 0,
        boRealAmount: 0,
        boPayType: this.accountFrom.boPayType
      }
      this.totalAccount = 0
      this.treeData = []
      this.disableStatus = false
      this.getinvoiceAndReceipt()
    },
    getinvoiceAndReceipt () {
      invoiceAndReceipt({ staff_id: this.getUserInfo.userId }).then(
        ({ data }) => {
          // console.log(data.data.invoiceReceipt)
          if (data.code == 0) {
            this.$set(this.accountFrom, 'boInvoiceNo', data.data.invoiceReceipt)
            // this.$set(this.accountFrom, 'boReceiptNo', data.data.serialNumber)
            // console.log(this.accountFrom)
          }
        }
      )
    },
    PrintBill (data) {
      // console.log(data)
    }
  }
}
</script>
<style lang="less">
.person-balance-wrapper {
  width: 100%;
  min-width: 1300px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-checkbox-wrapper {
    font-size: 14px;
  }
  .zk-table {
    overflow: auto;
  }
  .zk-table__footer-wrapper,
  .zk-table__header-wrapper {
    overflow: visible;
  }
  .base-page-body {
    .form-body {
      .ivu-form-item-content {
        max-width: 180px;
      }
      .form-content {
        flex: 1;
      }
      .form-btn {
        width: 80px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column-reverse;
      }
    }
  }
  .ivu-form-item {
    margin-bottom: 25px;
  }
  .page-footer {
    justify-content: flex-end;
    padding-right: 20px;
  }
  .left-sidebar-wrapper {
    flex: 1;
    max-width: 1300px;
    min-width: 900px;
    .ivu-form-item {
      margin-bottom: 0px !important;
    }
  }
  .base-msg-wrapper {
    margin-bottom: 10px;
  }
  .pay-detail-wrapper {
    display: flex;
    width: 100%;
    height: inherit;
    min-height: calc(~'100% - 160px');
  }

  .right-sidebar-wrapper {
    min-width: 300px;
    margin-left: 10px;
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
  .charge-method-wrapper {
    margin-top: 20px;
  }
  .input_red {
    .ivu-input-small {
      color: red;
      font-weight: bolder;
    }
  }
  .zk-table__body-wrapper {
    height: 400px !important;
    overflow: visible;
  }
  .right-sidebar-wrapper {
    height: inherit;
    min-height: calc(~'100% - 80px');
    display: flex;
  }
  .charge-method-main {
    margin-top: 15px;
  }

  .handle-wrapper {
    margin-top: 15px;
  }
  .charge-methods-select {
    display: flex;
    flex-wrap: wrap;
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
