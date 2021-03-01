<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="领取人信息"
           class="receiver-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="110"
              ref="form"
              :rules="ruleValidate"
              label-position="right">
          <FormItem label="领取人姓名"
                    prop="boRecipientName">
            <div class="flex-wrapper">
              <Input v-model="formData.boRecipientName"
                     size="small" />
              <Button type="primary"
                      :loading="readCardLoading"
                      style="margin-left: 10px"
                      size="small"
                      @click="readIdCard">录入</Button>
            </div>
          </FormItem>
          <FormItem label="身份证号码"
                    prop="boRecipientIdNo">
            <Input v-model="formData.boRecipientIdNo"
                   size="small" />
          </FormItem>
          <FormItem label="联系电话"
                    prop="boRecipientPhone">
            <Input v-model="formData.boRecipientPhone"
                   size="small" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">完成领取</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { healthTableUpdate } from '@/api/healthTable'
import jsonp from 'jsonp'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    const checkIdno = (rule, value, callback) => {
      const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'))
      }
      callback()
    }

    const checkPhone = (rule, value, callback) => {
      const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/ //  带杠的电话号码
      const reg2 = /^1[3|4|5|6|7|8][0-9]{9}$/ // 手机号码
      const reg3 = /^[0-9]{11,12}$/ //  纯数字的电话号码
      if (!reg.test(value) && !reg2.test(value) && !reg3.test(value)) {
        callback(new Error('联系方式格式有误'))
      }
      callback()
    }
    return {
      formData: {},
      isLoading: false,
      ruleValidate: {
        boRecipientName: [{ required: true, message: '请输入领取人姓名', trigger: 'blur' },
        { min: 2, max: 16, message: '姓名不得超过16个字符', trigger: 'blur' }],
        boRecipientPhone: [{ required: true, message: '请输入领取人手机号', trigger: 'blur' },
        { validator: checkPhone, required: true, trigger: 'blur' }],
        boRecipientIdNo: [{ required: true, message: '请输入领取人证件号码', trigger: 'blur' },
        { validator: checkIdno, required: true, trigger: 'blur' }],
      },
      readCardLoading: false
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
    // 读取身份证
    readIdCard () {
      let url = `http://127.0.0.1:8989/api/ReadMsg`
      this.readCardLoading = true
      jsonp(url, { timeout: 3000 }, (_err, data) => {
        this.readCardLoading = false
        if (data != undefined && data != null) {
          if (data.retcode == '0x90 0x1') {
            this.formData.boRecipientIdNo = data.cardno
            this.formData.boRecipientName = data.name
          } else if (data.retcode == '0x41') {
            this.$Message.error('身份证读取失败，请稍后尝试')
          } else if (data.retcode == '0x1') {
            this.$Message.error('读卡器服务' + data.retmsg)
          }
        } else {
          this.$Modal.info({
            title: '和湛科技体检系统',
            content: `检测到该电脑未安装身份证读卡器驱动，请联系管理员安装相关驱动。<a href="./plugins/readIdCard3.0.9-2.zip" target="_blank" download="readIdCard3.0.9-2.zip">点击此处下载身份证读卡器驱动</a>`
          })
        }
      })
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, this.formData)
          params.type = 1
          delete params._XID

          this.isLoading = true
          healthTableUpdate(params).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('操作成功')
              this.$emit('updateList')
              this.$emit('close')
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error(error.message)
          })
        }
      })
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {}
      } else {
        this.formData = row
      }
    }
  }
}
</script>
<style lang="less">
.receiver-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
  .flex-wrapper {
    display: flex;
    height: 34px;
    align-items: center;
  }
}
</style>
