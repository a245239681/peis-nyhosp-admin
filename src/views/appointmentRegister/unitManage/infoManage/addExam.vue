<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :closable="false"
           class="add-exam-popup-wrapper"
           width="400">
      <p slot="header">
        <span class="title">{{showTitle}}</span>
      </p>
      <div class="modal-body">
        <div class="form-wrapper">
          <Form :model="formData"
                :label-width="80"
                ref="form"
                :inline="true"
                label-position="right">
            <Row type="flex"
                 justify="space-between">
              <FormItem label="预约日期"
                        prop="boBookingDate"
                        :rules="[{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }]">
                <DatePicker type="date"
                            v-model="formData.boBookingDate"
                            :options="dateOptions"
                            placeholder="选择日期"
                            size="small"></DatePicker>
              </FormItem>
            </Row>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { addExam } from '@/api/appointmentUnitManage.js'
import moment from 'moment'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      isLoading: false,
      unitId: '',
      dateOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    }
  },
  computed: {
    showTitle () {
      return this.title == 0 ? '新增体检' : '转档'
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
  },
  mounted () {

  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    getItemList (row) {
      this.unitId = row.boId
      let tomorrowDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.formData, 'boBookingDate', tomorrowDate)
    },
    save () {
      if (this.isLoading) return
      let date = this.formData.boBookingDate != '' ? moment(this.formData.boBookingDate).format('YYYY-MM-DD') : '';
      let params = {
        boUnitId: this.unitId,
        boBookingDate: date
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          addExam(params).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('新增成功！')
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
      })

    }
  },
}
</script>
<style lang="less">
.add-exam-popup-wrapper {
  .title {
    padding-left: 8px;
    position: relative;
    font-weight: bold;
    &::after {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
}
</style>