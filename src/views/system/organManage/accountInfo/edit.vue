<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="accountInfo-edit-wrapper">
      <div class="modal-body"
           style="width: 370px; margin: 0 auto;">
        <Form :model="formData"
              :label-width="80"
              ref="formSubmit"
              label-position="right">
          <FormItem label="所在机构">
            <Input v-model="formData.orgName"
                   :disabled="true"
                   size="small"></Input>
          </FormItem>
          <FormItem label="所在科室"
                    prop="poDeptId"
                    :rules="[{ required: true, message: '请选择科室', trigger: 'change' }]">
            <Select v-model="formData.poDeptId"
                    :label-in-value="true"
                    filterable
                    @on-change="deptChange"
                    size="small">
              <Option v-for="item in roomDict"
                      :value="item.poId"
                      :key="item.poId">{{ item.poDeptName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="姓名">
            <Input v-model="formData.poName"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="账号"
                    v-if="title == 0"
                    prop="poStaffId"
                    :rules="[{ required: true, message: '请选择账号', trigger: 'change' }]">
            <Select v-model="formData.poStaffId"
                    :label-in-value="true"
                    filterable
                    size="small">
              <Option v-for="item in staffDict"
                      :value="item.poHisEmpNo"
                      @click.native="selectStaff(item)"
                      :key="item.poId">{{ item.poHisEmpNo }}</Option>
            </Select>
          </FormItem>
          <FormItem label="账号"
                    v-else
                    prop="poStaffId"
                    :rules="[{ required: true, message: '请选择账号', trigger: 'blur' }]">
            <Input v-model="formData.poStaffId"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="密码">
            <Input v-model="formData.poPassword"
                   size="small"></Input>
          </FormItem>
          <FormItem label="其他科室">
            <Select v-model="formData.otherDeptIdList"
                    multiple
                    size="small">
              <Option v-for="item in roomDict"
                      :value="item.poId"
                      :key="item.poId">{{ item.poDeptName }}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="密码"
                    prop="poPassword"
                    :rules="[{ required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'string', min: 8, max: 16, message: '密码长度为8-16位', trigger: 'blur' }]">
            <Input v-model="formData.poPassword"
                   size="small"></Input>
          </FormItem> -->
          <FormItem label="启用状态">
            <RadioGroup v-model="formData.poStatus"
                        type="button">
              <Radio label="1">启用</Radio>
              <Radio label="0">停用</Radio>
            </RadioGroup>
          </FormItem>
          <!-- <FormItem label="默认角色">
            <Input v-model="formData.role"
                   size="small"></Input>
          </FormItem>
          <FormItem label="其他角色">
            <Select v-model="formData.otherRole"
                    multiple
                    :max-tag-count="2">
              <Option v-for="item in roleList"
                      :value="item.value"
                      :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem> -->
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">保存</Button>
      </div>
      <template>
      </template>
    </Modal>
  </div>
</template>
<script>
import { editAccount } from '@/api/system_accountInfo.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      roleList: [
        {
          value: '管理员',
          label: '管理员'
        }
      ],
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
      set: function () { }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    staffDict: {
      get: function () {
        return this.$store.getters.getStaffDict
      },
      set: function () { }
    }
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
    this.$store.dispatch('getStaffDict')
  },
  methods: {
    closeModal () {
      this.$refs.formSubmit.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    save () {
      this.$refs.formSubmit.validate((valid) => {
        if (valid) {
          this.isLoading = true
          // console.log(JSON.stringify(this.formData))
          editAccount(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$emit('upDateList')
              this.$emit('close')
              this.$Message.success('保存成功，配置账号重新登录后生效')
              this.$store.dispatch('getStaffDict', true)
              this.$store.dispatch('getCheckDoctorDict', true)
              this.$store.dispatch('getExamDoctorDict', true)
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
          poOrgId: this.userInfo.poOrgId,
          orgName: this.userInfo.orgName,
          poStatus: '1',
          poId: ''
        }
      } else {
        this.formData = row
      }
    },
    selectStaff (obj) {
      if (obj) {
        this.formData.poSex = obj.poSex
        this.$set(this.formData, 'poName', obj.poName)
      }
    },
    deptChange (obj) {
      if (obj) {
        console.log(obj)
        this.formData.poDept = obj.label
      }
    }
  }
}
</script>
<style lang="less">
</style>
