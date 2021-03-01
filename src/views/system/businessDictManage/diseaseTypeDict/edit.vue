<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="diseaseTypeDict-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="100"
              ref="form"
              label-position="left">
          <FormItem label="分类名称"
                    prop="cdDiseaseType"
                    :rules="[{ required: true, message: '请输入疾病分类名称', trigger: 'blur' }]">
            <Input v-model="formData.cdDiseaseType"
                   @on-change="searchCode"></Input>
          </FormItem>
          <!-- <FormItem label="科室"
                    prop="cdDeptId"
                    :rules="[{ required: true, message: '请选择科室', trigger: 'change' }]">
            <Select v-model="formData.cdDeptId">
              <Option v-for="item in deptList"
                      :value="item.poId"
                      :label="item.poDeptName"
                      :key="item.poId">{{item.poDeptName}}</Option>
            </Select>
          </FormItem> -->
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
import { diseaseTypeSave } from '@/api/busdict_diseaseType.js'
import { getCode } from '@/api/common.js'
import moment from 'moment/moment'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {

      },
      isLoading: false,
      flag: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '添加疾病分类' : '编辑疾病分类')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    deptList: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () {

      }
    }
  },
  created () {
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      // this.formData = {}
      this.$emit('close')
    },
    save () {
      setTimeout(() => {
        if (this.flag) {
          return false
        }
      }, 1000)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          console.log(this.formData)

          diseaseTypeSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getDiseaseType', true)
              this.$refs.form.resetFields()
              this.$emit('close')
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error(err.message)
          })
        }
      })
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {}
      } else {
        this.formData = row
        console.log(this.formData)
      }
    },

    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.cdDiseaseType
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      this.flag = true
      getCode(params).then(({ data }) => {
        // this.flag = false
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
.diseaseTypeDict-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
