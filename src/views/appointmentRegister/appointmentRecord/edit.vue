<template>
  <div>
    <Modal class="appointment-record-edit-wrapper"
           v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="预约记录">
      <div class="modal-body">
        <Form :model="formData"
              label-position="right"
              ref="form"
              :label-width="80">
          <row :gutter="16">
            <Col span="12">
            <FormItem label="姓名">
              <Input v-model="formData.patientName"
                     disabled></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="体检次数">
              <Input v-model="formData.visitSn"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <row :gutter="16">
            <Col span="12">
            <FormItem label="体检类别">
              <Input v-model="formData.category"
                     disabled></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="体验优先级">
              <Input v-model="formData.priority"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <row :gutter="16">
            <Col span="12">
            <FormItem label="人员来源">
              <Input v-model="formData.source"
                     disabled></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="费别">
              <Input v-model="formData.chargeType"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <row>
            <Col span="24">
            <FormItem label="单位名称">
              <Input v-model="formData.unitName"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <row :gutter="16">
            <Col span="12">
            <FormItem label="所属部门">
              <Input v-model="formData.department"
                     disabled></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="职业">
              <Input v-model="formData.occupation"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <row>
            <Col span="24">
            <FormItem label="预约套餐">
              <Input v-model="formData.packageName"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <row :gutter="16">
            <Col span="12">
            <FormItem label="结算标志">
              <Input v-model="formData.settleStatus"
                     disabled>{{formData.settleStatus | settleFormat}}</Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="结算折扣">
              <Input v-model="formData.discount"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <row :gutter="16">
            <Col span="12">
            <FormItem label="预约日期">
              <Input v-model="formData.bookingDate"
                     disabled></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="截止日期">
              <Input v-model="formData.bookingExpireDate"
                     disabled></Input>
            </FormItem>
            </Col>
          </row>
          <!-- <row>
            <Col span="6">使用状态</Col>
            <Col span="6">启用按钮</col>
            <Col span="6">关闭按钮</col>
            <Col span="6">
            <Button type="primary"
                    @click="closeRecordCard">关闭</Button>
            </col>
          </row> -->
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary"
                @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { unitTypeSave } from '@/api/dict_unitType.js'

export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      formData: {

      }
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    }
  },
  filters: {
    settleFormat (val) {
      if (val == 0) {
        return '未结算'
      } else if (val == 1) {
        return '已结算'
      } else if (val == 2) {
        return '部分结算'
      }
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close');
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          cdStatus: '0'
        }
      } else {
        this.formData = row
      }
    },
  }
}
</script>
<style lang="less">
.appointment-record-edit-wrapper {
  .ivu-input[disabled] {
    color: #333;
  }
}
.ivu-form-item {
  margin-bottom: 14px;
}
</style>