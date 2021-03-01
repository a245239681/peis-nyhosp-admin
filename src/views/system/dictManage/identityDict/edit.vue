<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="identityDict-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.sdSort"
                   type="number"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="身份名称"
                    prop="sdName"
                    :rules="[{ required: true, message: '请输入身份名称', trigger: 'blur' }]">
            <Input v-model="formData.sdName"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="身份编号"
                    prop="sdCode"
                    :rules="[{ required: true, message: '请输入身份编号', trigger: 'blur' }]">
            <Input v-model="formData.sdCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="拼音码"
                    prop="sdPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
            <Input v-model="formData.sdPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="sdWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.sdWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="启用状态">
            <RadioGroup v-model="formData.sdStatus"
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
import { identifySave } from '@/api/dict_identify.js'
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
          identifySave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getIdentityDict', true)
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
          sdStatus: '0',
          sdSort: 1
        }
      } else {
        this.formData = row
      }
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.sdName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'sdPyCode', result.py)
          this.$set(this.formData, 'sdWbCode', result.wb)
        }
      })
    }
  }
}
</script>
<style lang="less">
.identityDict-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
