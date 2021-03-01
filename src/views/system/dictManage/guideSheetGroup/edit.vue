<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="guideSheetGroup-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.paSort"
                   type="number"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="体检机构">
            <Input v-model="formData.orgName"
                   :disabled="true"
                   size="small"></Input>
          </FormItem>
          <FormItem label="分组名称"
                    prop="paTypeName"
                    :rules="[{ required: true, message: '请输入分组名称', trigger: 'blur' }]">
            <Input v-model="formData.paTypeName"
                   size="small"></Input>
          </FormItem>
          <FormItem label="分组描述">
            <Input v-model="formData.paDescription"
                   type="textarea"
                   :rows="4"
                   size="small"></Input>
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
import { guideTypeSave } from '@/api/dict_guideType.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      isLoading: false,
      userInfo: this.$store.getters.getUserInfo
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
  },
  created () {
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
          guideTypeSave(this.formData).then(({ data }) => {
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
          orgName: this.userInfo.orgName,
          paOrgId: this.userInfo.paOrgId,
          paSort: 1
        }
      } else {
        this.formData = row
      }
    }
  }
}
</script>
<style lang="less">
.guideSheetGroup-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
}
</style>
