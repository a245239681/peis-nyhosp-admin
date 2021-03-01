<template>
  <div>
    <Modal class="disease-science-edit"
           v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="85"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title == 1">
            <Input v-model="formData.cdSort"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="体检项目"
                    prop="cditemName"
                    :rules="[{ required: true, message: '请输入体检项目', trigger: 'change' }]">
            <!-- <div class="search-bar"
                 @click="add">
              {{ itemName }}
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" />
            </div> -->
             <Input v-model="formData.cditemName"
                   @click.native="add"></Input>
          </FormItem>
          <FormItem label="诊断名称">
            <!-- <div class="search-bar"
                 @click="choose">
              {{diagnosisName}}
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" />
            </div> -->
            <Input v-model="formData.cdDiagName"
                   @click.native="choose"></Input>
          </FormItem>
          <FormItem label="诊断建议">
            <Input v-model="formData.cdDiagRecommedation"
                   type="textarea"
                   disabled
                   :autosize="{minRows: 5,maxRows: 5}"
                   size="small"></Input>
          </FormItem>
          <FormItem label="结果内容"
                    prop="cdItemDesc"
                    :rules="[{ required: true, message: '请输入结果内容', trigger: 'blur' }]">
            <Input v-model="formData.cdItemDesc"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   size="small"></Input>
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
import { dictItemAutoDiagnosisSave } from '@/api/busdict_physicalExamResultsDiagnosis.js'

export default {
  props: {
    title: Number,
    visible: Boolean,
    itemName: String,
    itemId: String,
    diagnosisName: String,
    diagnosisId: String,
    suggestion: String
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
      return (this.title == 0 ? '新增体检项目结果录入_诊断' : '编辑体检项目结果录入_诊断')
    },
    disabled () {
      return (this.title != 0)
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  watch: {
    diagnosisName: {
      handler (newVal, oldVal) {
        this.$set(this.formData, 'cdDiagName', this.diagnosisName)
        this.$set(this.formData, 'cdDiagId', this.diagnosisId)
        this.$set(this.formData, 'cdDiagRecommedation', this.suggestion)
      },
      deep: true
    },
    itemName: {
      handler (newVal, oldVal) {
        // this.formData.cditemName = this.itemName
        this.$set(this.formData, 'cditemName', this.itemName)
        this.$set(this.formData, 'cdItemId', this.itemId)
      },
      deep: true
    }
  },
  mouted () {
    console.log(this.itemName)
    console.log(this.itemId)
  },
  methods: {
    closeModal () {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    add (value) {
      this.$emit('openItemModal')
    },
    choose (value) {
      this.$emit('openDiagnosisList', true)
    },
    save () {
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.isLoading = true
          // this.formData.cdItemId = this.itemId
          // this.formData.cditemName = this.itemName
          this.formData.cdDeptId = this.deptId

          // this.formData.cdDiagName = this.diagnosisName
          console.log(this.formData)
          dictItemAutoDiagnosisSave(this.formData).then(({ data }) => {
            console.log(data)
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
        this.$refs.form.resetFields()
        this.formData = {
          cdStatus: '1'
        }
      } else {
        this.formData = row
        console.log(this.formData)
        this.$set(this.formData, 'cditemName', this.itemName)
      }
    }
  }
}
</script>

<style lang="less">
.disease-science-edit {
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
  .modal-body {
    // width: 450px;
    margin: 0 auto;
  }
  .ivu-form-item {
    margin-bottom: 20px;
  }
  .search-bar {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 8px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    box-sizing: border-box;
    .search-icon {
      float: right;
      margin-right: 5px;
      padding-top: 6px;
    }
  }
}
</style>
