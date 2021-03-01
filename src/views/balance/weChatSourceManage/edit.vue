<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-ok="save"
           @on-cancel="closeModal"
           title="批量设置号源"
           class="examPayoff-edit-wrapper">
      <div class="modal-body">
        <!--        <Form :model="formData"
              :label-width="80"
              ref="form"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.cdSort"
                   type="number"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="费别名称"
                    prop="cdName"
                    :rules="[{ required: true, message: '请输入费别名称', trigger: 'blur' }]">
            <Input v-model="formData.cdName"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="费别编码"
                    prop="cdCode"
                    :rules="[{ required: true, message: '请输入费别编码', trigger: 'blur' }]">
            <Input v-model="formData.cdCode"
                   size="small"></Input>
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
          <FormItem label="启用状态">
            <RadioGroup v-model="formData.cdStatus"
                        type="button">
              <Radio label="0">启用</Radio>
              <Radio label="1">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Form> -->

        <Form :model="formItem"
              :label-width="80"
              :rules="ruleCustom"
              ref="cdItem">
          <Form-item label="排班时间"
                     prop="dateRange">
            <Date-picker v-model="formItem.dateRange"
                         format="yyyy/MM/dd"
                         type="daterange"
                         placement="bottom-end"
                         placeholder="选择日期"
                         style="width: 200px"
                         :options="startTimeOptions"></Date-picker>
          </Form-item>
          <FormItem label="排班时间"
                    prop="checkbox">
            <CheckboxGroup v-model="formItem.checkbox">
              <Checkbox label="1"
                        border><span>星期一</span></Checkbox>
              <Checkbox label="2"
                        border><span>星期二</span></Checkbox>
              <Checkbox label="3"
                        border><span>星期三</span></Checkbox>
              <Checkbox label="4"
                        border><span>星期四</span></Checkbox>
              <Checkbox label="5"
                        border><span>星期五</span></Checkbox>
              <Checkbox label="6"
                        border><span>星期六</span></Checkbox>
              <Checkbox label="7"
                        border><span>星期天</span></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="号源数量"
                    prop="input">
            <Input v-model="formItem.input"
                   placeholder="请输入号源"
                   number></Input>
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

import { getCode } from '@/api/common.js'
import { wechatSourceAllUpdate } from '@/api/weChatSourceManage'
import moment from 'moment'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    const validateNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        return callback(new Error('请输入数字！'))
      }
      callback()
    }

    return {
      //开始日期约束
      startTimeOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      formData: {
        cdSort: 1,
        cdStatus: '0'
      },
      isLoading: false,
      formItem: {
        input: '',
        checkbox: [],
        dateRange: []
      },
      ruleCustom: {
        input: [
          { validator: validateNum, trigger: 'blur' }
        ],
        checkbox: [
          { required: true, type: 'array', min: 1, message: '请至少选择一项', trigger: 'change' }
        ]
      }
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
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    async save () {
      const that = this
      this.$refs.cdItem.validate((valid) => {
        if (valid) {
          let params = {
            dayStart: moment(that.formItem.dateRange[0]).format('YYYY-MM-DD'),
            dayEnd: moment(that.formItem.dateRange[1]).format('YYYY-MM-DD'),
            composingTime: that.formItem.checkbox,
            cdTotalSourceNo: that.formItem.input
          }
          console.log(params)
          wechatSourceAllUpdate(params).then((res) => {
            console.log(res)
            if (res.data.code == 0) {
              this.$Message.success('提交成功！')
              this.$router.go(0)
            } else {
              this.$Message.error(res.data.message)
            }
          })
        } else {
          this.$Message.error('请填写相关信息！')
        }
        // this.$emit('close')
      })
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          cdStatus: '0',
          cdSort: 1
        }
      } else {
        this.formData = row
      }
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.cdName
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
.examPayoff-edit-wrapper {
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
