<template>
  <div class="changePassword-wrapper">
    <Modal
      v-model="isVisible"
      title="密码修改"
      :mask-closable="false"
      @on-cancel="closeEditModal"
    >
      <Form
        :model="formData"
        :label-width="100"
        :rules="ruleValidate"
        ref="form"
      >
        <FormItem
          label="原密码"
          prop="oldPassword"
        >
          <Input type="password" v-model="formData.oldPassword"/>
        </FormItem>
        <FormItem
          label="新密码"
          prop="newPassword"
        >
          <Input
            type="password"
            v-model="formData.newPassword"
          />
        </FormItem>
        <FormItem
          label="重复新密码"
          prop="newPassword2"
        >
          <Input
            type="password"
            v-model="formData.newPassword2"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="closeEditModal">取消</Button>
        <Button
          type="primary"
          :loading="isLoading"
          @click="save"
        >保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user.js'
import { mapActions } from 'vuex'

export default {
  props: {
    visible: Boolean
  },
  computed: {
    isVisible: {
      get: function() {
        return this.visible
      },
      set: function() {}
    },
    userInfo: {
      get: function() {
        return this.$store.getters.getUserInfo
      },
      set: function() {}
    }
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      let reg = /\s+/
      if(reg.test(value) || value == '') {
        callback(new Error('密码中不能有空格，请重新输入'))
      } else {
        callback()
      }
    }
    const validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.formData.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      isLoading: false,
      ruleValidate: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { required: true, validator: validateNewPassword, trigger: 'blur' },
        ],
        newPassword2: [
          { required: true, trigger: 'blur', message: '重复密码不能为空！' },
          { required: true, validator: validateNewPassword2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    console.log(this.formData.oldPassword)
    // console.log(this.userInfo)
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isLoading = true
          let params = {
            oldPassword: this.formData.oldPassword,
            newPassword: this.formData.newPassword,
            staffId: this.userInfo.poHisEmpNo,
            userId: this.userInfo.userId
          }
          console.log(this.formData)
          updatePassword(params)
            .then(({ data }) => {
              this.isLoading = false
              if (data.code == 0) {
                this.$Message.success('修改成功！')
                this.formData = {}
                this.$emit('logout')
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.isLoading = false
              this.formData = {}
              this.$Message.error('网络不稳定，请稍后重试')
            })
        }
      })
    },
    closeEditModal() {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
.changePassword-wrapper {
  input:-webkit-autofill {
	    -webkit-box-shadow: 0 0 0 1000px white inset !important;
	}

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
}
</style>
