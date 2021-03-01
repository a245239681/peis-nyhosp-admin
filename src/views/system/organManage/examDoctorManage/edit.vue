<template>
  <div>
    <Modal v-model="isVisible"
           @on-cancel="closeModal"
           class="medical-history-edit"
           :styles="{top: '150px'}"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="85"
              label-position="left">
          <FormItem label="序号"
                    v-if="title == 1">
            <Input v-model="formData.cdSort"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="科室"
                    prop="poDeptId"
                    :rules="[{ required: true, message: '请选择科室', trigger: 'change' }]">
            <Select v-model="formData.poDeptId"
                    :label-in-value="true"
                    @on-change="deptChange"
                    clearable>
              <Option v-for="item in roomDict"
                      :value="item.poId"
                      :key="item.poDeptName">{{item.poDeptName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="医生"
                    prop="poDoctorId"
                    :rules="[{ required: true, message: '请选择医生', trigger: 'change' }]">
            <Select v-model="formData.poDoctorId"
                    :label-in-value="true"
                    filterable
                    remote
                    :remote-method="getDoctor"
                    :loading="doctorLoading"
                    @on-change="doctorChange"
                    clearable>
              <Option v-for="item in checkDoctorDict"
                      :value="item.poId"
                      :key="item.poName">{{item.poName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="启用状态"
                    prop="poStatus"
                    :rules="[{ required: true, message: '请选择启用状态', trigger: 'change' }]">
            <RadioGroup v-model="formData.poStatus">
              <Radio label="1">停用</Radio>
              <Radio label="0">启用</Radio>
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
import { checkDoctorMaintenanceSave, queryDoctorByName } from '@/api/system_examDoctorManage.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      deptList: [],
      formData: {
        poStatus: '0'
      },
      isLoading: false,
      doctorLoading: false,
      checkDoctorDict: []
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '添加医生' : '编辑医生')
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
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    }
    // checkDoctorDict: {
    //   get: function () {
    //     return this.$store.getters.getCheckDoctorDict
    //   },
    //   set: function () { }
    // },
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
    // this.$store.dispatch('getCheckDoctorDict', true)
    // console.log(this.checkDoctorDict)
  },
  methods: {
    deptChange (val) {
      if (val) {
        // console.log(val)
        this.formData.poDeptId = val.value
        this.formData.poDeptName = val.label
      }
    },
    getDoctor (query) {
      // console.log(query)
      if (query.trim() !== '') {
        this.doctorLoading = true
      }
      let params = {
        name: query
      }
      queryDoctorByName(params).then(res => {
        let result = res.data
        if (result.code === 0) {
          this.doctorLoading = false
          this.checkDoctorDict = result.data
        } else {
          this.$Message.error(result.message)
        }
      })
    },

    doctorChange (val) {
      if (val) {
        console.log(val)
        this.formData.poDoctorId = val.value
        this.formData.poDoctorName = val.label
        this.checkDoctorDict.map(item => {
          if (item.poId == this.formData.poDoctorId) {
            this.$set(this.formData, 'poDoctorNumber', item.poStaffId)
            this.$set(this.formData, 'poId', '')
          }
        })
        console.log(this.formData)
      }
    },
    closeModal () {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          console.log(this.formData)
          checkDoctorMaintenanceSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              let params = {
                deptId: this.formData.poDeptId,
                deptName: this.formData.poDeptName
              }
              console.log(params)
              let btn = true
              this.$store.dispatch('getExamDoctorDict', { params, btn })
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
          poStatus: '0'
        }
      } else {
        this.formData = row
        // console.log(this.$parent)
        console.log(this.formData)
      }
    }
  }
}
</script>

<style lang="less">
.medical-history-edit {
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
