<template>
  <div>
    <Modal v-model="isVisible"
           class="main-judge-result-edit"
           @on-cancel="closeModal"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              ref='form'
              :label-width="85"
              label-position="left">
          <FormItem label="序号"
                    v-if="title == 1">
            <Input v-model="formData.cdSort"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="判定说明"
                    prop="cdDescription"
                    :rules="[{ required: true, message: '请输入判定说明', trigger: 'blur' }]">
            <Input v-model="formData.cdDescription"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   placeholder="请输入判定内容"></Input>
          </FormItem>
          <FormItem label="启用状态"
                    prop="cdStatus"
                    :rules="[{ required: true, message: '请选择启用状态', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdStatus">
              <Radio label="1">启用</Radio>
              <Radio label="0">停用</Radio>
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
import { dictDiterminationSave } from '@/api/busdict_mainJudgeResult.js'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {

      },
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增主判定结果' : '修改主判定结果')
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
          dictDiterminationSave(this.formData).then(({ data }) => {
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
          cdStatus: '1'
        }
      } else {
        this.formData = row
        console.log(this.formData)
      }
    }
  }
}
</script>

<style lang="less">
.main-judge-result-edit {
  .ivu-modal-header-inner {
    position: relative;
    padding-left: 8px;
    font-weight: bold;
    &::before {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .ivu-form-item {
    margin-bottom: 24px;
  }
}
</style>
