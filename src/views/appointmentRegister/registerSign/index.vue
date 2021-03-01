<template>
  <div class="register-sign-wrapper">
    <Card style="width: 1000px;">
      <div slot="title"
           class="card-title-wrapper">
        <img src="@/assets/images/ico1.jpg"
             alt="logo" />
        <p>南宁市第一人民医院体检系统自助签到</p>
      </div>
      <div class="scan-wrapper">
        <span class="label">扫码区域</span>
        <Input v-model="registerCode"
               size="large"
               style="width: 460px;"
               ref="inputFocus"
               @on-enter="signHandle"
               placeholder="登记流水号" />
      </div>
      <div class="content-wrapper">
        <div class="pic-wrapper">
          <img :src="form.boPic"
               v-if="!!form.boPic"
               alt="登记用户头像">
          <img src="@/assets/images/userPhoto.png"
               v-else
               alt="登记用户头像">
        </div>
        <Form :model="form"
              label-position="right"
              ref="form"
              inline
              style="flex:1"
              :label-width="60">
          <div class="tip">请将指引单条形码靠近扫码枪完成扫码自助签到</div>
          <FormItem label="姓名"
                    :label-width="80"
                    prop="name">
            <Input v-model="form.name"
                   style="width:500px"
                   size="large"
                   clearable />
          </FormItem>
          <FormItem label="性别"
                    prop="sex"
                    :label-width="80">
            <!-- <Select v-model="form.sex"
                    size="large">
              <Option value="不限">不限</Option>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select> -->
            <Input v-model="form.sex"
                   style="width:200px"
                   size="large"
                   clearable />
          </FormItem>
          <FormItem label="年龄"
                    :label-width="80">
            <Input v-model="form.age"
                   style="width:210px"
                   size="large"
                   clearable />
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import { registerSign } from '@/api/registerSign'
export default {
  name: 'registerSign',
  data () {
    return {
      registerCode: '',
      form: {
        imageUrl: ''
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
  },
  methods: {
    signHandle () {
      if (this.isLoading) return
      if (!this.registerCode.trim()) {
        this.$Message.info('请输入流水号签到')
        return false
      }
      this.registerCode = this.registerCode.trim()
      const params = {
        registerCode: this.registerCode
      }
      this.isLoading = true
      registerSign(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.form = data.data
          this.$Message.success({
            content: '签到成功',
            duration: 3,
            onClose: () => {
              this.form = {
                imageUrl: ''
              }
              this.registerCode = ''
              this.$nextTick(() => {
                this.$refs.inputFocus.focus()
              })
            }
          })
        } else {
          this.$Message.error({
            content: `${data.message}`,
            duration: 3,
            onClose: () => {
              this.form = {
                imageUrl: ''
              }
              this.registerCode = ''
              this.$nextTick(() => {
                this.$refs.inputFocus.focus()
              })
            }
          })
        }
      }).catch(err => {
        this.isLoading = false
        this.registerCode = ''
        this.$nextTick(() => {
          this.$refs.inputFocus.focus()
        })
        this.$Message.error(err.message)
      })
    }
  },
}
</script>
<style lang="less">
.register-sign-wrapper {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  .card-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 70px;
    & > img {
      width: 63px;
      height: 63px;
    }
    & > p {
      color: #000;
      font-size: 48px;
      font-weight: bold;
      margin-left: 30px;
      height: auto;
      width: auto;
      display: inline-block;
      line-height: 1.5;
    }
  }
  .scan-wrapper {
    padding: 0 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .label {
      font-size: 48px;
      font-weight: bold;
      color: #1890ff;
      margin-right: 30px;
    }
    .ivu-input-large {
      height: 64px;
      font-size: 36px !important;
    }
  }
  .content-wrapper {
    display: flex;
    align-items: center;
    .ivu-input-large {
      height: 52px;
      font-size: 30px !important;
    }
    .ivu-form-item-label {
      font-size: 28px !important;
    }
    .pic-wrapper {
      width: 188px;
      height: 222px;
      overflow: hidden;
      border-radius: 10px;
      margin-right: 20px;
      flex-shrink: 0;
      img {
        width: 100%;
        height: auto;
      }
    }
    .tip {
      font-size: 28px;
      color: #1890ff;
      margin-bottom: 10px;
    }
  }
}
</style>