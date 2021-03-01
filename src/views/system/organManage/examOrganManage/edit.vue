<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           width="580"
           class="exam-organ-edit-wrapper">
      <div class="modal-body">
        <Form ref="form"
              :model="formData"
              :label-width="85"
              :inline="true">
          <Row>
            <FormItem label="中心名称"
                      :rules="[{ required: true, message: '请输入中心名称', trigger: 'blur' }]"
                      prop="sdName">
              <Input v-model="formData.sdName"/>
            </FormItem>
            <FormItem label="英文名称"
                      :rules="[{ required: true, message: '请输入英文名称', trigger: 'blur' }]"
                      prop="sdEngName">
              <Input v-model="formData.sdEngName"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="通讯地址"
                      :rules="[{ required: true, message: '请输入通讯地址', trigger: 'blur' }]"
                      prop="sdAddress">
              <Input v-model="formData.sdAddress"/>
            </FormItem>
            <FormItem label="邮政编码"
                      :rules="[{ required: true, message: '请输入邮政编码', trigger: 'blur' }]"
                      prop="sdPostCode">
              <Input v-model="formData.sdPostCode"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="联系人"
                      :rules="[{ required: true, message: '请输入联系人', trigger: 'blur' }]"
                      prop="sdContactPerson">
              <Input v-model="formData.sdContactPerson"/>
            </FormItem>
            <FormItem label="联系电话"
                      :rules="[{ required: true, message: '请输入联系电话', trigger: 'blur' }]"
                      prop="sdTel">
              <Input v-model="formData.sdTel"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="联系邮箱"
                      :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式有误', trigger: 'blur' }]"
                      prop="sdEmail">
              <Input v-model="formData.sdEmail"/>
            </FormItem>
            <FormItem label="中心代码"
                      :rules="[{ required: true, message: '请输入中心代码', trigger: 'blur' }]"
                      prop="sdRelateCode">
              <Input v-model="formData.sdRelateCode"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="体检号前缀"
                      prop="sdPeIdPrefix">
              <Input v-model="formData.sdPeIdPrefix"/>
            </FormItem>
            <FormItem label="计算机导诊"
                      prop="sdComputerGuide">
              <Input v-model="formData.sdComputerGuide"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="问候语"
                      prop="sdGreeting">
              <Input v-model="formData.sdGreeting"
                     type="textarea"
                     style="width:418px;"
                     :autosize="{minRows: 4, maxRows: 4}"/>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="系统授权码"
                      prop="sdAuthorizedKey">
              <Input v-model="formData.sdAuthorizedKey"/>
            </FormItem>
            <FormItem label="系统校验码"
                      prop="sdVerifyKey">
              <Input v-model="formData.sdVerifyKey"/>
            </FormItem>
          </Row>
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
import { saveOrgan } from '@/api/system_examOrganManage.js'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增' : '编辑')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
    // userInfo: {
    //   get: function () {
    //     return this.$store.getters.getUserInfo
    //   },
    //   set: function () { }
    // },
  },
  mounted () {
    // this.$store.dispatch('getRoomDict', 'cd')
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
          this.isLoading = true
          saveOrgan(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              // this.$store.dispatch('getExamType', true)
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
        this.formData = {}
      } else {
        this.formData = row
      }
    }
  }
}
</script>
<style lang="less">
.exam-organ-edit-wrapper {
  .modal-body {
    width: 580px;
    margin: 0 auto;
  }
}
</style>
