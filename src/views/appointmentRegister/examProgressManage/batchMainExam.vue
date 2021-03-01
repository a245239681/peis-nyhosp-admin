<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="批量总检"
           width="400"
           class="batch-main-exam-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              :rules="rules"
              label-position="right">
          <FormItem label="主检日期"
                    prop="mainOperatorDate">
            <DatePicker v-model="formData.mainOperatorDate"
                        :value="formData.mainOperatorDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        size="small"
                        style="width: 220px;"
                        placeholder=""></DatePicker>
          </FormItem>
          <FormItem label="主检医生"
                    prop="mainExamDoctorId">
            <Select v-model="formData.mainExamDoctorId"
                    :label-in-value="true"
                    filterable
                    style="width: 220px;"
                    @on-change="mainExamDoctorChange"
                    size="small">
              <Option v-for="item in mainExamDoctorList"
                      :value="item.doctorId"
                      :label="item.doctorName"
                      :key="item.doctorId">{{ item.doctorName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="总检日期"
                    prop="finalDate">
            <DatePicker v-model="formData.finalDate"
                        :value="formData.finalDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        size="small"
                        style="width: 220px;"
                        placeholder=""></DatePicker>
          </FormItem>
          <FormItem label="总检医生">
            <Input v-model="formData.doctorName"
                   disabled
                   style="width: 220px;"
                   size="small" />
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
import { batchSaveInspection } from '@/api/examProgressManage'
import moment from 'moment'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    const dateValid = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback(new Error('日期不能为空'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      isLoading: false,
      patientData: [],
      rules: {
        mainOperatorDate: [{ required: true, validator: dateValid, trigger: 'change' }],
        finalDate: [{ required: true, validator: dateValid, trigger: 'change' }],
        mainExamDoctorId: [{ required: true, message: '请选择主检医生', trigger: 'change' }],
      }
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    mainExamDoctorList: {
      get: function () {
        return this.$store.getters.getMainExamDoctorDict
      },
      set: function () { }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  mounted () {
    this.$store.dispatch('getExamDoctorDict', { params: { deptName: '主检医生', deptId: '' }, btn: true })
    let curDate = moment().format('YYYY-MM-DD HH:mm')

    this.$set(this.formData, 'mainOperatorDate', curDate)
    this.$set(this.formData, 'finalDate', curDate)
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.patientData = []
      this.$emit('close')
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, this.formData)
          params.mainOperatorDate = moment(this.formData.mainOperatorDate).format('YYYY-MM-DD HH:mm')
          params.finalDate = moment(this.formData.finalDate).format('YYYY-MM-DD HH:mm')
          params.data = this.patientData

          this.isLoading = true
          batchSaveInspection(params).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('批量总检申请已提交，请稍后刷新页面查看')
              this.$emit('updateList')
              this.closeModal()
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error(err.message)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    init (arr, doctorInfo) {
      const { doctorId, doctorName } = doctorInfo
      let curDate = moment().format('YYYY-MM-DD HH:mm')

      this.$set(this.formData, 'mainOperatorDate', curDate)
      this.$set(this.formData, 'finalDate', curDate)
      this.formData.mainExamDoctorId = doctorId
      this.formData.doctorId = doctorId
      this.formData.doctorName = doctorName
      this.formData.mainExamDoctorName = doctorName

      arr.forEach(item => {
        const obj = {}
        obj.peId = item.boPeId
        obj.visitSn = item.boVisitSn
        this.patientData.push(obj)
      });
    },

    // 选择主检医生
    mainExamDoctorChange (obj) {
      if (obj) {
        this.formData.mainExamDoctorName = obj.label
        this.formData.mainExamDoctorId = obj.value
      }
    }
  }
}
</script>
<style lang="less">
.batch-main-exam-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
}
</style>
