<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="roleManage-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.poSort"
                   type="number"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="角色名称"
                    prop="poName"
                    :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
            <Input v-model="formData.poName"
                   size="small"></Input>
          </FormItem>
          <FormItem label="机构名称">
            <Input v-model="formData.orgName"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="角色描述">
            <Input v-model="formData.poRemark"
                   type="textarea"
                   :rows="4"
                   size="small"></Input>
          </FormItem>
          <FormItem label="启用状态">
            <RadioGroup v-model="formData.poStatus"
                        type="button">
              <Radio label="1">启用</Radio>
              <Radio label="0">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { roleSave } from '@/api/roleManage.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {}
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
          roleSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$emit('close')
            } else {
              this.$emit('close')
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
          poStatus: '1',
          poSort: 1
        }
      } else {
        this.formData = row
      }
    }
  }
}
</script>
<style lang="less">
.roleManage-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
    .ivu-form-item {
      margin-bottom: 12px;
    }
  }
}
</style>
