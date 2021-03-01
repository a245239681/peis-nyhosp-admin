<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="staffDict-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right">
          <FormItem label="机构">
            <Input v-model="formData.orgName"
                   :disabled="true"
                   size="small"></Input>
          </FormItem>
          <FormItem label="姓名"
                    prop="poName"
                    :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
            <Input v-model="formData.poName"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="性别"
                    prop="poSex"
                    :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
            <Select v-model="formData.poSex"
                    :label-in-value="true"
                    filterable
                    size="small">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
              <Option value="未知">未知</Option>
            </Select>
          </FormItem>
          <FormItem label="工号"
                    prop="poHisEmpNo"
                    :rules="[{ required: true, message: '请输入工号', trigger: 'blur' }]">
            <Input v-model="formData.poHisEmpNo"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="所在科室"
                    prop="poDeptId"
                    :rules="[{ required: true, message: '请选择科室', trigger: 'change' }]">
            <Select v-model="formData.poDeptId"
                    :label-in-value="true"
                    filterable
                    @on-change="hisDeptChange"
                    size="small">
              <Option v-for="item in hisDept"
                      :value="item.cdId"
                      :key="item.cdId">{{ item.cdDeptName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="工作类别"
                    prop="poStaffTypeId"
                    :rules="[{ required: true, message: '请选择工作类别', trigger: 'change' }]">
            <Select v-model="formData.poStaffTypeId"
                    :label-in-value="true"
                    filterable
                    @on-change="staffTypeChange"
                    size="small">
              <Option v-for="item in staffDict"
                      :value="item.cdId"
                      :key="item.cdId">{{ item.cdName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="职称"
                    prop="poJobTitleId"
                    :rules="[{ required: true, message: '请选择职称', trigger: 'change' }]">
            <Select v-model="formData.poJobTitleId"
                    :label-in-value="true"
                    filterable
                    @on-change="jobTitleChange"
                    size="small">
              <Option v-for="item in jobTitleDict"
                      :value="item.sdId"
                      :key="item.sdId">{{ item.sdName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="拼音码"
                    prop="poPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
            <Input v-model="formData.poPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="poWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.poWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="启用状态">
            <RadioGroup v-model="formData.poStatus"
                        type="button">
              <Radio label="1">启用</Radio>
              <Radio label="0">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { editStaff } from '@/api/system_accountInfo.js'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {}
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
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
    hisDept: {
      get: function () {
        return this.$store.getters.getHisDeptDict
      },
      set: function () { }
    },
    staffDict: {
      get: function () {
        return this.$store.getters.getStaffTypeDict
      },
      set: function () { }
    },
    jobTitleDict: {
      get: function () {
        return this.$store.getters.getJobTitleDict
      },
      set: function () { }
    }
  },
  mounted () {
    this.$store.dispatch('getHisDeptDict')
    this.$store.dispatch('getStaffTypeDict')
    this.$store.dispatch('getJobTitleDict')
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
          editStaff(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getStaffDict', true)
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
          orgName: this.userInfo.orgName,
          poOrgId: this.userInfo.poOrgId,
          poStatus: '1'
        }
      } else {
        this.formData = row
      }
    },
    hisDeptChange (obj) {
      if (obj) {
        this.formData.poDeptName = obj.label
      }
    },
    staffTypeChange (obj) {
      if (obj) {
        this.formData.poStaffType = obj.label
      }
    },
    jobTitleChange (obj) {
      if (obj) {
        this.formData.poJobTitle = obj.label
      }
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.poName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'poPyCode', result.py)
          this.$set(this.formData, 'poWbCode', result.wb)
        }
      })
    }
  }
}
</script>
<style lang="less">
.staffDict-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
