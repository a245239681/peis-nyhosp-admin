<template>
  <div>
    <Modal v-model="isVisible"
           class="physical-exam-results-template-edit"
           @on-cancel="closeModal"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="85"
              ref="form"
              label-position="left">
          <FormItem label="序号"
                    v-if="title == 1">
            <Input v-model="formData.cdSort"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="科室">
            <Select v-model="formData.cdDeptId"
                    label-in-value
                    @on-change="selectDeptNameChange">
              <Option v-for="item in roomDict"
                      :value="item.poId"
                      :label="item.poDeptName"
                      :key="item.poId">{{item.poDeptName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="体检项目">
            <!-- <div class="search-bar"
                 @click="add">
              {{itemName}}
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" />
            </div> -->
            <Input v-model="formData.itemName"
                   clearable
                   @click.native="add"></Input>
            <!-- <Input search
                   @on-search='add'
                   enter-button
                   v-model="formData.itemName"
                   placeholder='体检项目'
                   size="small" /> -->
          </FormItem>
          <FormItem label="异常标志">
            <RadioGroup v-model="formData.cdDiagnosis">
              <Radio label="正常"></Radio>
              <Radio label="阳性"></Radio>
            </RadioGroup>
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
          <FormItem label="诊断">
            <Input v-model="formData.cdKeyword"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   size="small"></Input>
          </FormItem>
          <FormItem label="结果描述"
                    prop="cdDescription"
                    :rules="[{ required: true, message: '请输入结果描述', trigger: 'blur' }]">
            <Input v-model="formData.cdDescription"
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
    <!-- <Edit2 :title="modalTitle"
           :visible="editModalVisible"
           @close="editModalVisible = false"></Edit2> -->
  </div>
</template>

<script>
import { templateItemResultSave } from '@/api/busdict_physicalExamResultsTemplate.js'
import { getCode } from '@/api/common.js'

import { truncate } from 'fs'
export default {
  props: {
    visible: Boolean,
    title: Number,
    itemName: String,
    itemId: String,
    deptName: String,
    deptId: String
  },
  data () {
    return {
      formData: {

      },
      isLoading: false,
      show: true
      // modalTitle: 0, // 弹出框title，0为新增，1为编辑
      // editModalVisible: false,
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增体检项目录入模板' : '编辑体检项目录入模板')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    }
  },
  created () {
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
  },
  watch: {
    itemName: {
      handler (val, oldVal) {
        this.$set(this.formData, 'itemName', this.itemName)
        this.$set(this.formData, 'cdItemId', this.itemId)
        console.log(this.formData)
        this.searchCode()
      },
      deep: true
    }
  },
  methods: {
    selectDeptNameChange (val) {
      if (val) {
        this.formData.cdDeptId = val.value
        this.formData.cdDeptName = val.label
      }
    },
    closeModal () {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    save () {
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.isLoading = true
          console.log(this.formData)
          templateItemResultSave(this.formData).then(({ data }) => {
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
    add (value) {
      this.$emit('openEdit2')
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          cdStatus: '1',
          cdDeptId: this.deptId
        }
      } else {
        this.formData = row
        console.log(this.formData)
      }
    },

    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.itemName
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
.physical-exam-results-template-edit {
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
