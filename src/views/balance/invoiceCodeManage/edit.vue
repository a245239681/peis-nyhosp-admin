<template>
  <div>
    <Modal v-model="isVisible"
           class="distribute-invoice-edit"
           width="450"
           @on-cancel="closeModal"
           title="分配发票"
           draggable>
      <div class="modal-body">
        <Form :model="formData"
              ref='form'
              :rules="ruleValidate"
              :label-width="95"
              label-position="left">
          <FormItem label="票据起始号"
                    prop="boStartNumber">
            <Input v-model="formData.boStartNumber"
                   οnkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                   @keyup.native="provingStartNumber"
                   size="small"></Input>
          </FormItem>
          <FormItem label="票据结束号"
                    prop="boEndNumber">
            <Input v-model="formData.boEndNumber"
                   οnkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                   @keyup.native="provingEndNumber"
                   size="small"></Input>
          </FormItem>
          <FormItem label="使用号段"
                    prop="boUseNumber">
            <Input v-model="formData.boUseNumber"
                   οnkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                   @keyup.native="provingUseNumber"
                   size="small"></Input>
          </FormItem>
          <FormItem label="申领人"
                    prop="boClaimantId">
            <Select v-model="formData.boClaimantId"
                    :label-in-value="true"
                    @on-change="changeSelect"
                    filterable
                    clearable
                    size="small">
              <Option v-for="item in receiverList"
                      :value="item.doctorId"
                      :key="item.doctorId">{{item.doctorName}}</Option>
            </Select>
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
import { invoiceReceipt } from '@/api/balance_invoiceCodeManage.js'

export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      formData: {
        boStartNumber: '',
        boEndNumber: '',
        boUseNumber: '',
        boClaimantId: '',
        boClaimantName: ''
      },
      isLoading: false,
      ruleValidate: {
        boStartNumber: [
          { required: true, message: '请输入票据起始号', trigger: 'blur' }
        ],
        boEndNumber: [
          { required: true, message: '请输入票据结束号', trigger: 'blur' }
        ],
        boUseNumber: [
          { required: true, message: '请输入使用号段', trigger: 'blur' }
        ],
        boClaimantId: [
          { required: true, message: '请输入申请人', trigger: 'change' }
        ],
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
    },
    receiverList: {
      get: function () {
        return this.$store.getters.getExamDoctorDict;
      },
      set: function () {

      }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  mounted () {
    let params = {
      deptName: "财务科",
      deptId: ''
    };
    this.$store.dispatch("getExamDoctorDict", { params, btn: true })
    // console.log(this.userInfo)
    // console.log(this.receiverList)

  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close');
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          console.log(this.formData)
          invoiceReceipt(this.formData).then(({ data }) => {
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

    setClaimant() {
      console.log(this.userInfo)
      let result = this.receiverList.some( item => {
        if (item.doctorId == this.userInfo.userId) {
          return true
        }
      })
      console.log(result)
      if (result) {
        this.formData.boClaimantId = this.userInfo.userId
        this.formData.boClaimantName = this.userInfo.poName
      } else {
        console.log('财务科没有这个人')
      }
    },
    changeSelect (e) {
      if (e != undefined) {
        this.formData.boClaimantId = e.value
        this.formData.boClaimantName = e.label
      }
    },

    // 限制只能输入正整数
    provingStartNumber () {
      this.formData.boStartNumber = this.formData.boStartNumber.replace(/[^\.\d]/g, '');
      this.formData.boStartNumber = this.formData.boStartNumber.replace('.', '');
    },
    provingEndNumber () {
      this.formData.boEndNumber = this.formData.boEndNumber.replace(/[^\.\d]/g, '');
      this.formData.boEndNumber = this.formData.boEndNumber.replace('.', '');
    },
    provingUseNumber () {
      this.formData.boUseNumber = this.formData.boUseNumber.replace(/[^\.\d]/g, '');
      this.formData.boUseNumber = this.formData.boUseNumber.replace('.', '');
    },
  }
}
</script>

<style lang="less">
.distribute-invoice-edit {
  .ivu-modal-header-inner {
    position: relative;
    padding-left: 8px;
    font-weight: bold;
    &::before {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .ivu-form-item {
    margin-bottom: 20px;
  }
}
</style>

