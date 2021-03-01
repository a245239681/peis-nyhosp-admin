<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="system-setting-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right">
          <FormItem label="机构名称"
                    prop="sdOrgName"
                    :rules="[{ required: true, message: '请输入机构名称', trigger: 'blur' }]">
            <Input v-model="formData.sdOrgName"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="名称"
                    prop="sdName"
                    :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
            <Input v-model="formData.sdName"
                   size="small"></Input>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="formData.sdDescription"
                   type="textarea"
                   :rows="4"
                   size="small"></Input>
          </FormItem>
          <FormItem label="开关">
            <RadioGroup v-model="formData.sdContent"
                        type="button">
              <Radio label="0">开</Radio>
              <Radio label="1">关</Radio>
            </RadioGroup>
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
import { settingSave } from '@/api/system_setting.js'
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
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  methods: {
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          console.log(this.formData)
          settingSave(this.formData).then(({ data }) => {
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
          sdContent: '0',
          sdOrgName: this.userInfo.orgName,
          sdOrgId: this.userInfo.poOrgId
        }
        this.$set
      } else {
        this.formData = row
      }
    },
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    }
  }
}
</script>
<style lang="less">
.system-setting-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
}
</style>
