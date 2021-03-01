<template>
  <div class="diagnosis-wrapper">
    <Modal  v-model="isVisible"
            :title="diagnosisTitle"
            @on-ok="ok"
            @on-cancel="closeDiagnosis"
            :mask-closable="false">
         <div class="modal-body">

                <Form  :model="formData"
                    ref="form"
                    :label-width="150"
                    label-position="left">
                <FormItem label="记录分类">
                    <RadioGroup v-model="formData.cdStatus">
                    <Radio label="1">阳性发现</Radio>
                    <Radio label="0">疾病诊断</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否体现在主检报告">
                    <RadioGroup v-model="formData.cdStatus">
                    <Radio label="1">体现</Radio>
                    <Radio label="0">不体现</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="科室">
                    <Input v-model="formData.cdSort"></Input>
                </FormItem>
                <FormItem label="项目组合">
                    <Input v-model="formData.cdSort"></Input>
                </FormItem>
                <FormItem label="项目">
                    <Input v-model="formData.cdSort"></Input>
                </FormItem>
                <FormItem label="记录内容"
                          prop="cdSuggestion"
                          :rules="[{ required: true, message: '请输入科室建议', trigger: 'blur' }]">
                    <Input v-model="formData.cdSuggestion" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入科室建议"></Input>
                </FormItem>
                <FormItem label="建议内容"
                          prop="cdSuggestion"
                          :rules="[{ required: true, message: '请输入科室建议', trigger: 'blur' }]">
                    <Input v-model="formData.cdSuggestion" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="请输入科室建议"></Input>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button @click="closeDiagnosis">取消</Button>
            <Button type="primary"
                    @click="save">保存</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'diagnosis',
  props: {
    title: String,
    visible: Boolean
  },
  data () {
    return {
      diagnosisTitle: '添加诊断',
      formData: {

      }
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
  methods: {
    // 关闭编辑框
    closeDiagnosis () {
      this.$emit('close', false)
    },
    ok () {
      this.$emit('add', false)
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          console.log(this.formData)
          // dictDeptSuggestSave(this.formData).then(({ data }) => {
          //   console.log(data)
          //   this.isLoading = false
          //   if (data.code == 0) {
          //     this.$Message.success('保存成功！')
          //     this.$emit('updateList')
          //     this.$emit('close')
          //   } else {
          //     this.$emit('close')
          //     this.$Message.error(data.message)
          //   }
          // }).catch(err => {
          //   this.isLoading = false
          //   this.$Message.error('网络不稳定，请稍后重试')
          // })
        }
      })
    }

  }
}
</script>

<style lang="less">

</style>
