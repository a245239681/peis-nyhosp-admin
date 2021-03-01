<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="申请改价"
           class="change-price-wrapper">
        <Form :model="formData"
              :label-width="80"
              label-position="left"
              ref="form">
            <p class="notice">价格修改将提交至管理员进行审批，审批通过后，方可按修改后的价格结算</p>
            <FormItem label="原价格">
                <Input v-model="formData.boOldPrice" disabled/>
            </FormItem>
            <FormItem label="修改价格" prop="boNewPrice"  
                      :rules="{ required: true, pattern: /^([1-9]\d{0,9}|0)(\.\d{0,2})?$/, message: '请输入数字（最多两位小数）', trigger: 'change'}">
                <Input v-model="formData.boNewPrice" number/>
            </FormItem>
            <FormItem label="备注信息" prop="boRemark">
                <Input v-model="formData.boRemark" type="textarea" :autosize="{minRows: 3, maxRows: 3}" />
            </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="closeModal">取消</Button>
          <Button type="primary" @click="confirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

export default {
  props: {
    visible: Boolean,
    oldPrice: {
        type: Number,
        default: '0'
    }
  },
  data () {
    return {
      formData: {
        boOldPrice: '',
        boNewPrice: '',
        boRemark: ''
      }
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    }
  },
  created () {
    this.$set(this.formData, 'boOldPrice', this.oldPrice)
  },
  watch: {
    oldPrice(val, oldVal){
      // console.log('new: %s, old: %s', val, oldVal)
      let newVal = Number.prototype.div(val, 100)
      this.$set(this.formData, 'boOldPrice', newVal)
    }
  },
  methods: {
    closeModal() {
      this.$emit('cancel');
      this.$refs.form.resetFields();
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('newPrice', this.formData);
          this.closeModal();
        }
      })
    }
  }
}
</script>
<style lang="less">
.change-price-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    .notice{
        line-height: 30px;
        padding-bottom: 10px;
    }
    .ivu-input {
        color:crimson;
    }
}
</style>