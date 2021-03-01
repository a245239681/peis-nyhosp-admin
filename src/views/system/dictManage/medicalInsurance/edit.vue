<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="medical-insurance-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="70"
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
            <Input v-model="formData.paOrgName"
                   :disabled="true"
                   size="small" />
          </FormItem>
          <FormItem label="名称"
                    prop="paMedicalName"
                    :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
            <Input v-model="formData.paMedicalName"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="拼音码"
                    prop="paPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
            <Input v-model="formData.paPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="paWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.paWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="启用状态">
            <RadioGroup v-model="formData.paStatus"
                        type="button">
              <Radio label="0">启用</Radio>
              <Radio label="1">停用</Radio>
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
import { medicalSave } from '@/api/medicalInsurance.js'
import { getCode } from '@/api/common.js'
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
      console.log(this.formData)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          medicalSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getMedicalInsuranceDict', true)
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
          paStatus: '0',
          paSort: 1,
          paOrgName: this.userInfo.orgName,
          paOrgId: this.userInfo.poOrgId,
          paId: ''
        }
      } else {
        this.formData = row
      }
    },
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.paMedicalName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'paPyCode', result.py)
          this.$set(this.formData, 'paWbCode', result.wb)
        }
      })
    }
  }
}
</script>
<style lang="less">
.medical-insurance-edit-wrapper {
  .ivu-input[disabled] {
    color: #252525;
  }
  .modal-body {
    width: 370px;
    margin: 0 auto;
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
}
</style>
