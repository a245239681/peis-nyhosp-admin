<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="取消订单"
           class="delete-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right">
          <FormItem label="操作备注"
                    prop="remark"
                    :rules="[{ required: true, message: '请输入备注', trigger: 'blur' }]">
            <Input v-model="formData.remark"
                   type="textarea"
                   :autosize="{minRows: 4, maxRows: 4}"></Input>
          </FormItem>
          <FormItem label="取消原因"
                    prop="reason"
                    :rules="[{ required: true, message: '请输入取消原因', trigger: 'blur' }]">
            <Input v-model="formData.reason"
                   type="textarea"
                   :autosize="{minRows: 4, maxRows: 4}"></Input>
          </FormItem>
          <FormItem label="订单金额"
                    prop="orderPrice">
            <span class="money-text">{{formData.orderPrice ? "¥" + formData.orderPrice : ''}}</span>
          </FormItem>
          <FormItem label="退款金额"
                    prop="refundPrice"
                    :rules="[{ required: true, message: '请输入退款金额', trigger: 'blur' }]">
            <Input v-model="formData.refundPrice"
                   size="small"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { refundOrder } from '@/api/weChatOrderManage'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {
        orderId: '',
        userId: '',
        orderPrice: ''
      },
      isLoading: false
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
  created () {
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.formData.orderPrice != this.formData.refundPrice) {
            this.$Message.error('输入的退款金额不等于订单金额，请重新输入')
            return
          }
          this.isLoading = true
          refundOrder(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success(data.message)
              this.$emit('updateList')
              this.$emit('close')
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error(err.message)
          })
        }
      })
    },
    getItemList (row) {
      console.log(row)
      this.formData.orderId = row.orderId
      this.formData.userId = row.userId
      this.$set(this.formData, 'orderPrice', row.orderPrice)
    }
  }
}
</script>
<style lang="less">
.delete-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
  .money-text {
    font-size: 16px;
    font-weight: bold;
    color: red;
  }
}
</style>
