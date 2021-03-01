<template>
  <div>
    <Modal v-model="isVisible"
           @on-cancel="closeModal"
           :title="showTitle"
           :mask-closable="false"
           class="disease-advice-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="90"
              ref="form"
              label-position="left">
          <FormItem label="疾病名称"
                    prop="diseaseName"
                    :rules="[{ required: true, message: '请输入疾病名称'}]">
            <!-- <div class="search-bar"
                 @click="toDiseaseList">
              {{diseaseName}}
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" />
            </div> -->
            <Input v-model="formData.diseaseName"
                   @click.native="toDiseaseList"></Input>
          </FormItem>
          <FormItem label="科室"
                    prop="cdDeptId"
                    :rules="[{ required: true, message: '请选择科室', trigger: 'change' }]">
            <Select v-model="formData.cdDeptId">
              <Option v-for="item in roomDict"
                      :value="item.poId"
                      :label="item.poDeptName"
                      :key="item.poId">{{item.poDeptName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否疾病"
                    prop="cdIsIllness"
                    :rules="[{ required: true, message: '请选择是否为疾病', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdIsIllness">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否常见病"
                    prop="cdIsCommonIll"
                    :rules="[{ required: true, message: '请选择是否为常见病', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdIsCommonIll">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="拼音码"
                    prop="cdPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
            <Input v-model="formData.cdPyCode"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="cdWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.cdWbCode"></Input>
          </FormItem>
          <FormItem label="自定义码">
            <Input v-model="formData.cdCustCode"></Input>
          </FormItem>
          <FormItem label="建议内容">
            <Input v-model="formData.cdSuggestion"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   placeholder="请输入建议内容"></Input>
          </FormItem>
          <FormItem label="启用状态"
                    prop="cdStatus"
                    :rules="[{ required: true, message: '请选择启用状态', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdStatus">
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
import { dictSuggestionSave } from '@/api/busdict_diseaseAdvice.js'
import { getCode } from '@/api/common.js'

export default {
  props: {
    title: Number,
    visible: Boolean,
    diseaseName: String,
    curCdId: String,
    cdPyCode: String,
    cdWbCode: String
  },
  data () {
    return {
      deptList: [],
      formData: {
        diseaseName: ''
      },
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增疾病建议' : '编辑疾病建议')
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
  watch: {
    diseaseName: {
      handler (val, oldVal) {
        this.$set(this.formData, 'diseaseName', this.diseaseName)
        this.searchCode()
      },
      deep: true
    }
  },
  mounted () {
    console.log(this.diseaseName)
    this.$store.dispatch('getRoomDict')
  },
  methods: {
    // 关闭编辑框，清空编辑框内容
    closeModal () {
      this.$refs.form.resetFields()
      this.$emit('close')
      // this.formData = {};
    },
    // 保存编辑框内容，清空编辑框内容
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.formData.cdDisId = this.curCdId
          this.formData.cdDiseaseName = this.diseaseName
          console.log(this.formData)
          dictSuggestionSave(this.formData).then(({ data }) => {
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
    // 打开疾病列表框
    toDiseaseList () {
      this.$emit('openDiseaseList', true)
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          cdStatus: '0'
        }
      } else {
        this.formData = row
        this.$parent.curCdId = this.formData.cdDisId
        this.$set(this.formData, 'diseaseName', this.diseaseName)
        // console.log(this.formData)
      }
    },

    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.diseaseName
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
.disease-advice-edit-wrapper {
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
<style lang="less" scoped>
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
</style>
