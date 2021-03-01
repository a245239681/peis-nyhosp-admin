<template>
  <div>
    <Modal v-model="isVisible"
           @on-cancel="closeModal"
           class="disease-science-edit-wrapper"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="85"
              label-position="right">
          <FormItem label="疾病名称"
                    prop="diseaseName"
                    :rules="[{ required: true, message: '请输入疾病名称'}]">
            <!-- <div class="search-bar"
                 @click="toDiseaseList">
              {{ diseaseName }}
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" /> -->
            <Input v-model="formData.diseaseName"
                   @on-change="searchCode"
                   @click.native="toDiseaseList"></Input>
            <!-- </div> -->
          </FormItem>
          <FormItem label="科室">
            <Select v-model="formData.cdDeptId"
                    label-in-value>
              <Option v-for="item in roomDict"
                      :value="item.poId"
                      :label="item.poDeptName"
                      :key="item.poId">{{item.poDeptName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="拼音码"
                    prop="cdPyCode"
                    :rules="[{ required: true, message: '请输入拼音码'}]">
            <Input v-model="formData.cdPyCode"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="cdWbCode"
                    :rules="[{ required: true, message: '请输入五笔码'}]">
            <Input v-model="formData.cdWbCode"></Input>
          </FormItem>
          <FormItem label="自定义码">
            <Input v-model="formData.cdCustCode"></Input>
          </FormItem>
          <FormItem label="疾病分类">
            <Input v-model="formData.cdDiseaseType"
                   disabled></Input>
          </FormItem>
          <FormItem label="科普知识">
            <Input v-model="formData.cdKnowledge"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   placeholder="请输入科普知识"></Input>
          </FormItem>
          <FormItem label="类型"
                    prop="cdType"
                    :rules="[{ required: true, message: '请输入异常标志', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdType">
              <Radio label="1">阳性发现</Radio>
              <Radio label="2">疾病诊断</Radio>
            </RadioGroup>
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
import { dictDiseaseKnowledgeSave } from '@/api/busdict_diseaseScience.js'
import { getCode } from '@/api/common.js'

export default {
  props: {
    title: Number,
    visible: Boolean,
    diseaseName: String,
    curCdId: String,
    diseaseType: String,
    diseaseTypeId: String,
    cdPyCode: String,
    cdWbCode: String
  },
  data () {
    return {
      deptList: [], // 科室列表
      formData: {
        diseaseName: ''
      },
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增疾病科普' : '编辑疾病科普')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    // diseaseTypeList : {
    //   get: function () {
    //     return this.$store.getters.getDiseaseType
    //   },
    //   set: function () {

    //   }
    // },
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    }
    // cdDiseaseId () {
    //   return this.formData.cdDiseaseId
    // }

  },
  watch: {
    diseaseName: {
      handler (val, oldVal) {
        this.formData.cdDiseaseType = this.diseaseType
        this.formData.cdDiseaseTypeId = this.diseaseTypeId
        this.$set(this.formData, 'diseaseName', this.diseaseName)
        this.searchCode()
        // this.$refs.form.resetFields()
        console.log()
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
    // this.$store.dispatch('getDiseaseType')
    this.$store.dispatch('getRoomDict')
  },
  methods: {
    // 关闭编辑框，清空编辑框内容
    closeModal () {
      this.$refs.form.resetFields()
      // this.formData = {}
      this.$emit('close')
    },
    // 保存编辑框内容，清空编辑框内容
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.formData.cdDiseaseId = this.curCdId
          this.formData.cdDiseaseName = this.diseaseName

          console.log(this.formData)
          dictDiseaseKnowledgeSave(this.formData).then(({ data }) => {
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
      console.log(row)
      if (Object.keys(row).length == 0) {
        this.formData = {
          cdStatus: '0'
        }
      } else {
        this.formData = row
        this.formData.diseaseName = row.cdDiseaseName
        this.$parent.curCdId = this.formData.cdDiseaseId
        console.log(this.formData)
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
.disease-science-edit-wrapper {
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
    margin-bottom: 20px;
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
  box-sizing: border-box;
  border-radius: 4px;
  .search-icon {
    float: right;
    margin-right: 5px;
    padding-top: 6px;
  }
}
</style>
