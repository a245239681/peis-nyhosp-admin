<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="checkExamDict-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="110"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData._index"
                   type="number"
                   disabled
                   size="small"/>
          </FormItem>
          <FormItem label="单位名称"
                    prop="boUnitName"
                    :rules="{ required: true, message: '请输入单位名称', trigger: 'blur'}">
            <Input v-model="formData.boUnitName" size="small" disabled/>
          </FormItem>
          <FormItem label="转账银行"
                    prop="boTransferBank"
                    :rules="{ required: true, message: '请输入转账银行', trigger: 'blur'}">
            <Input v-model="formData.boTransferBank"
                   size="small"/>
          </FormItem>
          <FormItem label="转账账号"
                    prop="boTransferAccount"
                    :rules="{ required: true, message: '请输入收款账号', trigger: 'blur'}">
            <Input v-model="formData.boTransferAccount"
                   size="small"/>
          </FormItem>
          <FormItem label="转账金额 (元)"
                    prop="boTransferAmount"
                    :rules="{ required: true, pattern: /^([1-9]\d{0,9}|0)(\.\d{0,2})?$/, message: '请输入数字（最多两位小数）', trigger: 'blur'}">
            <Input v-model="formData.boTransferAmount"
                   size="small"/>
          </FormItem>
          <FormItem label="转账时间"
                    prop="boTransferDate"
                    :rules="{ required: true, message: '请选择转账时间'}">
            <DatePicker type="datetime"
                        size="small"
                        style="width: 100%"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择转账时间"
                        v-model="formData.boTransferDate"></DatePicker>
          </FormItem>
          <FormItem label="填写人"
                    prop="boFiller"
                    :rules="{ required: true, message: '请输入填写人', trigger: 'blur'}">
            <Input v-model="formData.boFiller" size="small"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import moment from "moment";
import { transferSave } from '@/api/unitTransfer.js'
export default {
  props: {
    title: Number,
    visible: Boolean,
    unitId: {
      type: String,
      default: ''
    },
    unitName: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      formData: {
        boId: '',
        boUnitId: '',
        boUnitName: '',
        boTransferBank: '',
        boTransferAccount: '',
        boTransferAmount: '',
        boTransferDate: '',
        // boTransferDate: moment(Date()).format('YYYY-MM-DD HH:mm:ss'),  //设定转账时间默认为当前系统时间
        boFiller: '',
      },
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增转账单' : '编辑转账单');
    },
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
  },
  methods: {
    closeModal () {
      this.$emit('close');
      this.$refs.form.resetFields()
      // this.formData = {}
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.formData)
          let Time = moment(this.formData.boTransferDate).format('YYYY-MM-DD HH:mm:ss')
          console.log(Time)
          this.$set(this.formData, 'boTransferDate', Time)
          this.isLoading = true
          transferSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$emit('close')
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
      })
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          boOrgId: this.userInfo.poOrgId,
          boId: '',
          boUnitId: this.unitId,
          boUnitName: this.unitName,
          boTransferBank: '',
          boTransferAccount: '',
          boTransferAmount: '',
          // boTransferDate: moment(Date()).format('YYYY-MM-DD HH:mm:ss'),
          boTransferDate: '',
          boFiller: '',
        }
      } else {
        this.formData = row
        this.formData._index += 1
      }
    },
  },
}
</script>
<style lang="less">
.checkExamDict-edit-wrapper {
  .modal-body {
    width: 420px;
    margin: 0 auto;
  }
  .ivu-input {
    color: #000;
  }
}
</style>
