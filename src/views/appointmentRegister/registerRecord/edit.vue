<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="体检登记记录">
      <div class="modal-body">
         <Form :model="registerForm" label-position="left" :label-width="80">  
                <row :gutter="16">
                    <Col span="12">
                        <FormItem label="姓名">
                            <Input v-model="registerForm.name" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="体检次数">
                            <Input v-model="registerForm.examTimes" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row :gutter="16">
                    <Col span="12">
                        <FormItem label="个人/单位">
                            <Input v-model="registerForm.type" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="体验优先级">
                            <Input v-model="registerForm.piority" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row :gutter="16">
                    <Col span="12">
                        <FormItem label="出生日期">
                            <Input v-model="registerForm.type" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="婚姻状况">
                            <Input v-model="registerForm.piority" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row :gutter="16">
                    <Col span="12">
                        <FormItem label="人员来源">
                            <Input v-model="registerForm.source" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="费别">
                            <Input v-model="registerForm.feeType" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row>
                    <Col span="24">
                        <FormItem label="单位名称">
                            <Input v-model="registerForm.company" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row :gutter="16">
                    <Col span="12">
                        <FormItem label="体检类型">
                            <Input v-model="registerForm.dept" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="职业">
                            <Input v-model="registerForm.career" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row>
                    <Col span="24">
                        <FormItem label="预约套餐">
                            <Input v-model="registerForm.package" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <!-- <row :gutter="16">
                    <Col span="12">
                        <FormItem label="体检类别">
                            <Input v-model="registerForm.examType" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="结算折扣">
                            <Input v-model="registerForm.discount" disabled size="small" />
                        </FormItem>
                    </Col>
                </row> -->
                <row :gutter="16">
                    <Col span="12">
                        <FormItem label="预约日期">
                            <Input v-model="registerForm.date" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="截止日期">
                            <Input v-model="registerForm.deadline" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row :gutter="16">
                    <Col span="12">
                        <FormItem label="结算标志">
                            <Input v-model="registerForm.isSettlement" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="体检区域">
                            <Input v-model="registerForm.examArea" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <row :gutter="16">
                    <Col span="10">
                        <FormItem label="操作员">
                            <Input v-model="registerForm.operater" disabled size="small" />
                        </FormItem>
                    </Col>
                    <Col span="14">
                        <FormItem label="指引单打印时间" :label-width="100">
                            <Input v-model="registerForm.printTime" disabled size="small" />
                        </FormItem>
                    </Col>
                </row>
                <FormItem label="启用状态">
                    <RadioGroup v-model="registerForm.sdStatus" type="button" size="small">
                        <Radio label="0">启用</Radio>
                        <Radio label="1">停用</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { unitTypeSave } from '@/api/dict_unitType.js'

export default {
  props: {
    visible: Boolean,
    formData: Object
  },
  data () {
    return {
      registerForm:{
   
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
  created () {
    console.log(this.formData);
    this.registerForm = this.formData;
  },
  methods: {
    closeModal () {
      this.$emit('close');
    }
  }
}
</script>
<style lang="less">
.ivu-form-item{
    margin-bottom: 14px;
}
</style>