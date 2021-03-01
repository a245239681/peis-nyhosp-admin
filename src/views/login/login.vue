<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <div class="form-con">
          <login-form ref="login"
                      @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { getUserInfo } from '@/api/user'
import { setLoginOrgLocalstorage } from '@/libs/util'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({ userName, password, orgId, orgName }) {
      this.handleLogin({ userName, password, orgId }).then(res => {
        this.$refs.login.closeLoading()
        if (res.data && res.data.code == 1) {
          this.$Message.error(res.data.message)
          return false
        }
        setLoginOrgLocalstorage({ id: orgId, name: orgName })
        this.$Message.success({
          content: '登录成功，请稍后...',
          onClose: () => {
            this.$router.push({
              name: this.$config.homeName
            })
          }
        })

        // let token = res.data.data.token

        // mock 数据接口
        // let token = res.data.token
        // getUserInfo(token).then(res => {
        //   const data = res.data.data
        //   this.$store.commit('setAvator', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png')
        //     this.$store.commit('setUserName', data.poName)
        //     this.$store.commit('setUserId', data.poId)
        //     this.$store.commit('setAccess', ["super_admin"])
        //     this.$store.commit('setHasGetInfo', true)

        // })
      }).catch(err => {
        this.$refs.login.closeLoading()
        this.$Message.error('网络不稳定，请稍后重试')
      })
    }
  }
}
</script>

<style>
</style>
