<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           width="1000"
           class="bill-query-edit-wrapper">
      <div class="modal-body">
        <div class="bill-info">
          <div class="title">发票情况</div>
          <Form :model="formData"
                :label-width="100"
                ref="form"
                label-position="right">
            <FormItem label="发票号：">
              <Input v-model="formData.invoiceNo"
                     disabled></Input>
            </FormItem>
            <FormItem label="新发票号："
                      v-if="title == 0">
              <Input v-model="formData.newInvoiceNo"></Input>
            </FormItem>
          </Form>
        </div>
        <div class="bill-preview">
          <div class="title">发票预览</div>
          <div class="bill-title">医院门诊收据</div>
          <div class="bill-number">
            <template v-if="billInfo.invoiceNo"><span>No.</span>{{billInfo.invoiceNo}}</template>
          </div>
          <div class="patient-name">姓名：{{billInfo.name}}</div>
          <vxe-table class="mytable-footer"
                     ref="xTree"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     height="400"
                     :data="tableData"
                     align="center"
                     :footer-method="footerMethod"
                     footer-row-class-name="table-footer-row"
                     :loading="isLoading">
            <vxe-table-column field="subjectName"
                              title="项目名称"
                              tree-node
                              min-width="200"></vxe-table-column>
            <vxe-table-column field="subjectAmount"
                              title="金额"
                              width="120"></vxe-table-column>
          </vxe-table>
          <div class="footer-tip">
            <div class="doctor-name">收款员：{{billInfo.payee}}</div>
            <div class="bill-date">收款日期：{{billInfo.date}}</div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer-wrapper">
          <div class="footer-date">
            <!-- <span class="pre-title">发票日期</span>
            <DatePicker v-model="billDate"
                        :value="billDate"
                        format="yyyy-MM-dd"
                        placement="top-start"
                        type="date"
                        size="small"
                        placeholder="请选择日期"></DatePicker> -->
          </div>
          <div class="footer-handle-wrapper">
            <Button type="primary"
                    :loading="billLoading"
                    @click="printConfirmHandle"
                    :disabled="!billInfo.invoiceNo"
                    v-permission="['print']">确认开票</Button>
            <Button @click="closeModal">退出</Button>
          </div>
        </div>

      </div>
    </Modal>
  </div>
</template>
<script>
import { billInfo, newBillPrint, billReprint } from '@/api/billQuery'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      isLoading: false,
      billDate: '', // 发票日期
      tableData: [], // 发票项目明细
      billInfo: {}, // 发票预览信息
      billLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新号重打' : '重打发票')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },

    // 获取预览信息
    getInfo (obj) {
      delete obj._XID
      this.isLoading = true
      billInfo(obj).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          console.log(data)
          this.billInfo = data.data
          this.tableData = data.data.subjectArray
          this.$set(this.formData, 'invoiceNo', data.data.invoiceNo)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 打印发票
    printConfirmHandle () {

      if (!printNotice()) return false
      if (this.title == 0) {
        let params = {}
        params.oldInvoiceNo = this.formData.invoiceNo
        params.newInvoiceNo = this.formData.newInvoiceNo
        params.invoiceType = this.billInfo.invoiceType
        if (!params.newInvoiceNo) {
          this.$Message.info('请输入新发票号')
          return false
        }
        this.billLoading = true
        newBillPrint(params).then(({ data }) => {
          this.billLoading = false
          if (data.code == 0) {
            console.log(data)
            let printParams = {
              invoiceUrl: this.$url + data.data,
              selGroup: ['printInvoice']
            }
            printMethods(printParams.invoiceUrl, printParams)
            this.$Message.success(data.message)
            this.$emit('updateList')
            this.closeModal()
          } else {
            this.billLoading = false
            this.$Message.error(data.message)
          }
        }).catch(err => {
          this.billLoading = false
          this.$Message.error(err.message)
        })
      } else {
        this.billLoading = true
        billReprint(this.formData).then(({ data }) => {
          this.billLoading = false
          if (data.code == 0) {
            console.log(data)
            let printParams = {
              invoiceUrl: this.$url + data.data,
              selGroup: ['printInvoice']
            }
            printMethods(printParams.invoiceUrl, printParams)
            this.$Message.success(data.message)
            this.$emit('updateList')
            this.closeModal()
          } else {
            this.billLoading = false
            this.$Message.error(data.message)
          }
        }).catch(err => {
          this.billLoading = false
          this.$Message.error(err.message)
        })
      }

    },

    // 合计
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return `合计：`
          }
          switch (column.property) {
            case 'subjectAmount':
              // return `累计发放体检表数：${Math.round(XEUtils.sum(data, 'number') * 100) / 100}`
              return this.billInfo.amount
          }
          return '-'
        })
      ]
    }
  }
}
</script>
<style lang="less">
.bill-query-edit-wrapper {
  .modal-body {
    width: 100%;
    display: flex;
    .bill-info {
      width: 350px;
      height: auto;
      flex-shrink: 0;
      padding: 0 20px;
      border-right: 1px solid #e6e6e6;
      .title {
        height: 30px;
        line-height: 30px;
        color: #2d8cf0;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .ivu-form-item-label {
        font-size: 16px !important;
        font-weight: bold;
        color: #252525;
      }
      .ivu-input[disabled] {
        color: #252525;
      }
      .ivu-input {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .bill-preview {
      flex: 1;
      height: auto;
      padding-left: 20px;
      padding-bottom: 10px;
      .title {
        height: 30px;
        line-height: 30px;
        color: #2d8cf0;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .bill-title {
        font-size: 16px;
        color: #252525;
        line-height: 1.8;
        text-align: center;
      }
      .bill-number {
        font-size: 14px;
        color: #252525;
        font-weight: bold;
        text-align: right;
        span {
          color: red;
          font-size: 16px;
        }
      }
      .patient-name {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .table-footer-row {
        font-weight: bold;
      }
    }
    .footer-tip {
      height: 30px;
      margin-top: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
    }
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
  .footer-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .footer-date {
      .pre-title {
        margin-right: 10px;
      }
    }
  }
}
</style>
