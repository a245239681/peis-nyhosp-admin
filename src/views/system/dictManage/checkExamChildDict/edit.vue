<template>
  <div>
    <Modal v-model="isVisible"
           class="child-type-edit-wrapper"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="120"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.paSort"
                   type="number"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="检查类别"
                    prop="paExamTypeId"
                    :rules="{ required: true, message: '请选择检查类别', trigger: 'change' }">
            <Select v-model="formData.paExamTypeId"
                    filterable
                    size="small"
                    @on-change="changeExam">
              <Option v-for="item in examTypeDict"
                      :value="item.paId"
                      :key="item.paId">{{item.paTypeName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="检查子类别名称"
                    prop="paExamSubclassName"
                    :rules="[{ required: true, message: '请输入子类名称', trigger: 'blur' }]">
            <Input v-model="formData.paExamSubclassName"
                   @on-change="searchCode"
                   size="small" />
          </FormItem>
          <FormItem label="检查子类别别名"
                    prop="paExamClassName"
                    :rules="[{ required: true, message: '请输入子类别名', trigger: 'blur' }]">
            <Input v-model="formData.paExamClassName"
                   size="small" />
          </FormItem>
          <FormItem label="输入码">
            <Input v-model="formData.paInputCode"
                   size="small" />
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
import { dictExamChildTypeSave } from '@/api/dict_checkExamChildDict.js'
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
    examTypeDict: {
      get: function () {
        return this.$store.getters.getExamType
      },
      set: function () { }
    }
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
          dictExamChildTypeSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getExamSubTypeDict', true)
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
          paSort: 1
        }
      } else {
        this.formData = row
      }
    },
    changeExam () {
      console.log(this.formData.paExamTypeId)
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.paExamSubclassName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'paInputCode', result.py)
        }
      })
    }
  }
}
</script>
<style lang="less">
.child-type-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
