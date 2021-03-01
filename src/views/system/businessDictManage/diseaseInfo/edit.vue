<template>
  <div>
    <Modal v-model="isVisible"
           class="medical-history-edit"
           :mask-closable="false"
           @on-cancel="closeModal"
           :width="1200"
           :title="showTitle">
      <div class="modal-body">
        <div class="left-side-wrapper">
          <Form :model="formData"
                :label-width="100"
                ref="form"
                label-position="right">
            <FormItem label="疾病名称"
                      prop="cdDiseaseName"
                      :rules="[{ required: true, message: '请输入疾病名称', trigger: 'blur' }]">
              <Input v-model="formData.cdDiseaseName"
                     @on-change="searchCode"
                     size="small"></Input>
            </FormItem>
            <FormItem label="科室"
                      prop="deptId"
                      :rules="[{ required: true, message: '请选择科室', trigger: 'blur' }]">
              <Select v-model="formData.deptId"
                      :label-in-value="true"
                      filterable
                      clearable
                      @on-change="deptChange"
                      size="small">
                <Option v-for="item in roomDict"
                        :value="item.poId"
                        :key="item.poId">{{ item.poDeptName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="疾病分类">
              <Select v-model="formData.cdDiseaseTypeId"
                      size="small">
                <Option v-for="item in diseaseTypeList"
                        :value="item.cdId"
                        :label="item.cdDiseaseType"
                        :key="item.cdId">{{ item.cdDiseaseType }}</Option>
              </Select>
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
            <FormItem label="自定义码">
              <Input v-model="formData.cdCustCode"
                     size="small"></Input>
            </FormItem>
            <FormItem label="ICD编码">
              <Input v-model="formData.cdIcdCode"
                     disabled
                     size="small"></Input>
            </FormItem>
            <!-- <FormItem label="ICD10名称"
                              prop="cdIcdName"
                              :rules="[{ required: true, message: '请输入ICD10名称', trigger: 'blur' }]"> -->
            <!-- <Select v-model="formData.cdIcdName"
                                label-in-value
                                @on-change="selectICD10Change">
                            <Option v-for="item in ICD10List" :value="item.cdName" :label="item.cdName" :key="item.cdId">{{item.cdName}}</Option>

                        </Select> -->
            <FormItem label="ICD名称">
              <div class="search-bar"
                   @click="openICD10">
                {{ ICD10Name }}
                <Icon type="ios-search"
                      class="search-icon"
                      size="16" />
              </div>
              <!-- <Input v-model="formData.cdIcdName"></Input> -->
            </FormItem>

            <FormItem label="启用状态"
                      prop="cdStatus"
                      :rules="[{ required: true, message: '请选择启用状态', trigger: 'change' }]">
              <RadioGroup v-model="formData.cdStatus"
                          size="small">
                <Radio label="0">启用</Radio>
                <Radio label="1">停用</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
        <div class="right-side-wrapper">
          <div class="header-wrapper">
            <div class="header">建议内容</div>
            <div class="select-cont">
              <span>是否疾病：</span>
              <RadioGroup v-model="formData.cdIsIllness"
                          size="small">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
              <span>是否常见疾病：</span>
              <RadioGroup v-model="formData.cdIsCommonIll"
                          size="small">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </div>
          </div>
          <div class="cont-wrapper">
            <Input v-model="formData.suggestion"
                   type="textarea"
                   :autosize="{minRows: 8,maxRows: 8}"
                   placeholder="请填写建议内容" />
          </div>
          <div class="header-wrapper">
            <div class="header">科普内容</div>
            <div class="select-cont">
              <span>科普类型：</span>
              <RadioGroup v-model="formData.cdType"
                          size="small">
                <Radio label="1">阳性发现</Radio>
                <Radio label="2">疾病诊断</Radio>
              </RadioGroup>
            </div>
          </div>
          <div class="cont-wrapper">
            <Input v-model="formData.knowledge"
                   type="textarea"
                   :autosize="{minRows: 8,maxRows: 8}"
                   placeholder="请填写科普内容" />
          </div>
        </div>
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
import { dictDiseaseSave, baseIcd10List } from '@/api/busdict_diseaseInfo.js'
import { getCode } from '@/api/common.js'

export default {
  props: {
    title: Number,
    visible: Boolean,
    ICD10Name: String,
    ICD10Id: String,
    ICD10Code: String
  },
  data () {
    return {
      formData: {
        cdType: '1',
        cdIsIllness: '1',
        cdIsCommonIll: '1',
        cdStatus: '0'
      },
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增疾病' : '编辑疾病')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    diseaseTypeList: {
      get: function () {
        return this.$store.getters.getDiseaseType
      },
      set: function () {

      }
    },
    // 体检科室列表
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    }
  },
  created () {
  },
  watch: {
    ICD10Name: {
      handler (val, oldVal) {
        this.formData.cdIcdCode = this.ICD10Code
        this.formData.cdIcdName = this.ICD10Name
      },
      deep: true
    }
  },
  mounted () {
    this.$store.dispatch('getDiseaseType')
    this.$store.dispatch('getRoomDict')
  },
  methods: {
    // async selectICD10Change (val) {
    //   await  baseIcd10List({cdId: this.formData.cdIcdCode}).then( ({ data }) => {
    //       if (data.code == 0) {
    //         this.$set( this.formData, 'cdIcdCode', data.data[0].cdCode)
    //         this.$set( this.formData, 'cdIcdClass', data.data[0].cdClass)
    //       } else {
    //         this.$Message.error(data.message)
    //       }
    //   }).catch(err => {
    //     this.$Message.error('网络不稳定，请稍后重试')
    //   })
    // },

    // 更改科室
    deptChange (obj) {
      if (!obj) {
        this.formData.deptId = ''
      }
    },

    selectDiseaseTypeChange (val) {
      console.log(val)
      this.formData.cdDiseaseType = val.label
      this.formData.cdDiseaseTypeId = val.value
    },
    // 关闭编辑框，清空编辑框内容
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    openICD10 () {
      this.$emit('openICD10List', true)
    },
    // 保存编辑框内容，清空编辑框内容
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          let params = Object.assign({}, this.formData)
          delete params._XID
          dictDiseaseSave(params).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$emit('close')
              this.$refs.form.resetFields()
            } else {
              // this.formData = {}
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
          cdType: '1',
          cdIsIllness: '1',
          cdIsCommonIll: '1',
          cdStatus: '0'
        }
      } else {
        this.formData = row
        if (!row.suggestionId) {
          this.formData.cdIsIllness = '1'
          this.formData.cdIsCommonIll = '1'
        }
        if (!row.knowledgeId) {
          this.formData.cdType = '1'
        }
      }
    },

    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.cdDiseaseName
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
.medical-history-edit {
  .modal-body {
    display: flex;
    width: 100%;
    .left-side-wrapper {
      width: 300px;
      flex-shrink: 0;
      height: auto;
      margin-right: 20px;
    }
    .right-side-wrapper {
      flex: 1;
      padding-left: 20px;
      border-left: 1px solid #e6e6e6;
      .header-wrapper {
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .header {
          font-size: 16px;
          color: #252525;
          font-weight: bold;
        }
      }
      .select-cont {
        display: flex;
        align-items: center;
        margin-left: 20px;
        font-size: 14px;
        & > span {
          color: #252525;
          margin-left: 10px;
        }
      }
      .cont-wrapper {
        padding-bottom: 20px;
      }
    }
  }
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
    height: 24px;
    line-height: 24px;
    padding-left: 8px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    box-sizing: border-box;
    .search-icon {
      float: right;
      margin-right: 5px;
      padding-top: 3px;
    }
  }
}
</style>
