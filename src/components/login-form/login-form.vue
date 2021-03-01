<template>
  <Form ref="loginForm"
        class="login-form"
        :model="form"
        :rules="rules"
        @keydown.enter.native="handleSubmit">
    <FormItem prop="orgId">
      <Select v-model="form.orgId"
              :label-in-value="true"
              filterable
              placement="top-end"
              transfer
              @on-change="organChange">
        <Option v-for="(item, index) in orgList"
                :value="item.ID"
                :key="index">{{ item.NAME }}</Option>
      </Select>
    </FormItem>
    <FormItem prop="userName">
      <Input v-model="form.userName"
             clearable
             placeholder="请输入用户名">
      <span slot="prepend">
        <Icon :size="16"
              type="ios-person"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password"
             clearable
             v-model="form.password"
             placeholder="请输入密码">
      <span slot="prepend">
        <Icon :size="14"
              type="md-lock"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit"
              type="primary"
              :loading="isLoading"
              long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getOrgList } from '@/api/user'
import { getLoginOrgLocalstorage } from '@/libs/util'
export default {
  name: 'LoginForm',
  props: {
    organRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '请选择机构', trigger: 'change' }
        ]
      }
    },
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: ''
      },
      isLoading: false,
      orgList: []
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        orgId: this.organRules
      }
    }
  },
  mounted () {
    this.getOrganList()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            orgId: this.form.orgId,
            orgName: this.form.orgName
          })
        }
      })
    },
    closeLoading () {
      this.isLoading = false
    },
    // 获取机构列表
    getOrganList () {
      getOrgList().then(({ data }) => {
        if (data.code == 0) {
          this.orgList = data.data
          let loginOrgInfo = getLoginOrgLocalstorage()
          if (Object.keys(loginOrgInfo).length > 0) {
            this.$set(this.form, 'orgId', loginOrgInfo.id)
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // 更改机构
    organChange (obj) {
      if (obj) {
        this.$set(this.form, 'orgName', obj.label)
        this.$set(this.form, 'orgId', obj.value)
      }
    },

  }
}
</script>
<style lang="less">
#app .ivu-form-item {
  margin-bottom: 24px;
}
.login-form {
  .ivu-select-item {
    font-size: 14px;
  }
}
</style>
