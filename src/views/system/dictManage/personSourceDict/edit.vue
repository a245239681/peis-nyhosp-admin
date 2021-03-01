<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="examPayoff-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="110"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.cdSort"
                   type="number"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="人员来源名称"
                    prop="cdName"
                    :rules="[{ required: true, message: '请输入人员来源名称', trigger: 'blur' }]">
            <Input v-model="formData.cdName"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="拼音码"
                    prop="cdPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
            <Input v-model="formData.cdPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="cdWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.cdWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="使用状态"
                    prop="cdStatus"
                    :rules="[{ required: true, message: '请选择使用状态', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdStatus"
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
import { peDictSourceSave } from '@/api/dict_personSourceDict.js'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {
        cdSort: '',
        cdStatus: '0'
      },
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return this.title == 0 ? '新增人员来源' : '编辑人员来源'
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    }
  },
  created () { },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.isLoading = true
          peDictSourceSave(this.formData)
            .then(({ data }) => {
              this.isLoading = false
              if (data.code == 0) {
                this.$Message.success('保存成功！')
                this.$emit('updateList')
                // this.$store.dispatch("getExpenseTypeDict", true);
                this.$emit('close')
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.isLoading = false
              this.$Message.error('网络不稳定，请稍后重试')
            })
        }
      })
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          cdStatus: '0'
        }
      } else {
        this.formData = row
      }
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.cdName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'cdPyCode', result.py)
          this.$set(this.formData, 'cdWbCode', result.wb)
        }
      })
    }
  }
}
</script>
<style lang="less">
.examPayoff-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
