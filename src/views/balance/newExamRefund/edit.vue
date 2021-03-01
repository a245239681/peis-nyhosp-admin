<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="退费确认"
           width="350"
           class="new-exam-refund-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="100"
              ref="form"
              label-position="right">
          <FormItem label="退费金额：">
            <Input v-model="formData.paymentAmount"
                   disabled></Input>
          </FormItem>
          <FormItem label="退费发票：">
            <Input v-model="formData.invoiceNo"
                   disabled></Input>
          </FormItem>
          <FormItem label="退费方式：">
            <Input v-model="formData.refundType"
                   disabled></Input>
          </FormItem>
          <FormItem label="退费渠道：">
            <Input v-model="formData.paymentType"
                   disabled></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary"
                :loading="isLoading"
                @click="refundHandle">确认退费</Button>
        <Button @click="closeModal">退出</Button>

      </div>
    </Modal>
  </div>
</template>
<script>
import { refund } from '@/api/newExamRefund'
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
      isLoading: false,
      payType: 0, // 支付方式
      editModalVisible: false, // 弹窗开关
    }
  },
  computed: {
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

    getItemInfo (item) {
      let { invoiceNo, paymentType, paymentAmount } = item
      this.formData = { invoiceNo, paymentType, paymentAmount }
      this.$set(this.formData, 'refundType', '原支付方式退回')
    },

    // 退费操作
    refundHandle () {
      let params = {
        boInvoiceNo: this.formData.invoiceNo
      }
      this.isLoading = true
      refund(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.$Message.success(data.message)
          this.$emit('updateList')
          this.closeModal()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    }
  }
}
</script>
<style lang="less">
.new-exam-refund-edit-wrapper {
  .modal-body {
    width: 100%;
    display: flex;
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
}
</style>
