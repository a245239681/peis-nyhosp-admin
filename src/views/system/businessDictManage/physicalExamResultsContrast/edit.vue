<template>
  <div>
    <Modal v-model="isVisible"
           class="physical-exam-contrast-edit"
           @on-cancel="closeModal"
           :title="showTitle"
           :mask-closable="false">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="85"
              label-position="left">
          <FormItem label="序号"
                    v-if="title == 1">
            <Input v-model="formData.cdSort"
                   size="small"></Input>
          </FormItem>
          <FormItem label="体检项目"
                    prop="cdObjectName"
                    :rules="[{ required: true, message: '请输入体检项目'}]">
            <!-- <div class="search-bar"
                 @click="add">
              {{itemName}}
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" /> -->
            <Input v-model="formData.cdObjectName"
                   @click.native="add"></Input>
            <!-- </div> -->
          </FormItem>
          <FormItem label="结果描述">
            <Input v-model="formData.cdResultDescription"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <Row>
            <Col span="11">
            <FormItem label="结果下限">
              <Input v-model="formData.cdResultLower"
                     size="small"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="结果上限">
              <Input v-model="formData.cdResultUpper"
                     size="small"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="年龄下限">
              <Input v-model="formData.cdAgeLower"
                     size="small"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="年龄上限">
              <Input v-model="formData.cdAgeUpper"
                     size="small"></Input>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="结果类型"
                    prop="cdResultType"
                    :rules="[{ required: true, message: '请选择结果类型', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdResultType">
              <Radio label="0">字符</Radio>
              <Radio label="1">数字</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否正常"
                    prop="cdIsAbnormal"
                    :rules="[{ required: true, message: '请选择是否正常', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdIsAbnormal">
              <Radio label="0">是</Radio>
              <Radio label="1">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="项目是否进入小结"
                    :label-width="140"
                    prop="cdItemSummary"
                    :rules="[{ required: true, message: '请选择项目是否进入小结', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdItemSummary">
              <Radio label="1">否</Radio>
              <Radio label="0">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="对应诊断是否进入小结"
                    :label-width="170"
                    prop="cdDiseaseSummary"
                    :rules="[{ required: true, message: '请选择对应诊断是否进入小结', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdDiseaseSummary">
              <Radio label="1">否</Radio>
              <Radio label="0">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="结果单位">
            <Input v-model="formData.cdResultUnit"></Input>
          </FormItem>
          <FormItem label="疾病诊断">
            <!-- <div class="search-bar"
                 @click="choose">
              {{diagnosisName}}
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" /> -->
            <!-- </div> -->
            <Input v-model="formData.cdDiseaseDiagnosis"
                   @on-focus="choose"
                   clearable></Input>
          </FormItem>
          <FormItem label="拼音码"
                    prop="cdPyCode"
                    :rules="[{ required: true, message: '请输入拼音码' }]">
            <Input v-model="formData.cdPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="cdWbCode"
                    :rules="[{ required: true, message: '请输入五笔码'}]">
            <Input v-model="formData.cdWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="对应性别"
                    prop="cdSex"
                    :rules="[{ required: true, message: '请选择对应性别', trigger: 'change' }]">
            <Select v-model="formData.cdSex"
                    size="small">
              <Option value="不限">不限</Option>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
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
import { resultContrastSave } from '@/api/busdict_physicalExamResultsContrast.js'
import { getCode } from '@/api/common.js'

export default {
  props: {
    title: Number,
    visible: Boolean,
    itemName: String,
    itemId: String,
    deptId: String,
    diagnosisName: String,
    diagnosisId: String
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
      return (this.title == 0 ? '新建体检项目结果对照' : '编辑体检项目结果对照')
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
    itemId: {
      handler (val, oldVal) {
        this.$set(this.formData, 'cdObjectName', this.itemName)
        this.$set(this.formData, 'cdObjectId', this.itemId)
      },
      deep: true
    },
    formData: {
      handler (val, oldVal) {
        if (!val.cdDiseaseDiagnosis) {
          this.$set(this.formData, 'cdDiseaseDiagnosisId', '')
          console.log(this.formData)
        }
      },
      deep: true
    },
    diagnosisId: {
      handler (val, oldVal) {
        this.$set(this.formData, 'cdDiseaseDiagnosis', this.diagnosisName)
        this.$set(this.formData, 'cdDiseaseDiagnosisId', this.diagnosisId)
      },
      deep: true
    }
  },
  mounted () {
    // console.log(this.itemId)
    // console.log(this.itemName)
  },
  methods: {
    closeModal () {
      this.$emit('close')
      this.$refs.form.resetFields()
    },

    add (value) {
      this.$emit('openEdit2')
    },
    choose (value) {
      this.$emit('openDiagnosisList', true)
    },
    save () {
      this.$refs.form.validate((valid) => {
        // console.log(valid)
        if (valid) {
          this.isLoading = true
          this.formData.cdSort = Number(this.formData.cdSort)
          // this.formData.cdObjectId = this.itemId
          // this.formData.cdObjectName = this.itemName
          this.formData.cdDeptId = this.deptId
          // this.formData.cdDiseaseDiagnosisId = this.diagnosisId
          // this.formData.cdDiseaseDiagnosis = this.diagnosisName
          // console.log(this.formData)
          resultContrastSave(this.formData).then(({ data }) => {
            // console.log(data)
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
          cdStatus: '1',
          cdIsAbnormal: '0',
          cdItemSummary: '1',
          cdDiseaseSummary: '0',
          cdResultType: '0',
          cdObjectName: this.itemName,
          cdObjectId: this.itemId
        }
      } else {
        this.formData = row
        this.$parent.curDeptId = row.cdDeptId
        // console.log(this.formData)
        this.$set(this.formData, 'cdObjectName', this.itemName)
      }
      // console.log(this.formData)
    },

    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.cdResultDescription
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
.physical-exam-contrast-edit {
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
    margin-bottom: 15px;
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
