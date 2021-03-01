<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           :width="800"
           class="module-manage-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="form"
              inline
              label-position="right">
          <FormItem label="姓名"
                    :label-width="40">
            <Input v-model="formData.patientName"
                   style="width:80px;"
                   size="small" />
          </FormItem>
          <FormItem label="流水号"
                    :label-width="60">
            <Input v-model="formData.registerCode"
                   style="width:140px;"
                   size="small" />
          </FormItem>
          <FormItem label="his号"
                    :label-width="60">
            <Input v-model="formData.patientId"
                   style="width:120px;"
                   size="small" />
          </FormItem>
          <FormItem label="消息状态">
            <Tag color="red"
                 v-if="formData.medicalStatus == '1'">失败</Tag>
            <Tag color="green"
                 v-else-if="formData.medicalStatus == '0'">成功</Tag>
          </FormItem>
          <div class="sub-title-wrapper">
            <span class="title">消息内容</span>
            <FormItem label="消息类型">
              <Select v-model="formData.eventCode"
                      style="min-width: 160px"
                      size="small">
                <Option value="1">新增患者信息</Option>
                <Option value="2">更新患者信息</Option>
                <Option value="3">新增体检项目</Option>
                <Option value="4">减项体检项目</Option>
                <Option value="5">更新项目状态</Option>
                <Option value="6">接收检验报告数据</Option>
                <Option value="7">接收检查报告数据</Option>
                <Option value="8">作废报告</Option>
              </Select>
            </FormItem>
          </div>
          <Input v-model="formData.reportData"
                 type="textarea"
                 :autosize="{ minRows: 6, maxRows: 6 }"
                 placeholder="消息内容" />
          <div class="sub-title-wrapper">
            <span class="title">响应内容</span>
            <FormItem label="响应状态">
              <Select v-model="formData.platformStatus"
                      style="min-width: 160px"
                      size="small">
                <Option value="0">成功</Option>
                <Option value="1">失败</Option>
              </Select>
            </FormItem>
          </div>
          <Input v-model="formData.responseMsgContent"
                 type="textarea"
                 :autosize="{ minRows: 4, maxRows: 4 }"
                 placeholder="响应内容" />
          <div class="sub-title-wrapper">
            <span class="title">异常消息</span>
          </div>
          <Input v-model="formData.anomalyMessage"
                 type="textarea"
                 :autosize="{ minRows: 4, maxRows: 4 }"
                 placeholder="异常消息" />
        </Form>
      </div>
      <div slot="footer">
        <div class="footer-wrapper">
          <div class="left-tools-wrapper">
            <Button @click="rebuildMsgHandle"
                    type="primary"
                    v-if="formData.finalStatus == 1"
                    style="margin-right: 8px;">重新生成消息</Button>
            <Button @click="retryMsgHandle"
                    v-if="formData.finalStatus == 1"
                    type="primary">重发消息</Button>
          </div>
          <Button @click="closeModal">关闭</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { rebuildMsg, retryMsg } from '@/api/msgManage'
export default {
  props: {
    title: Number,
    visible: Boolean,
    moduleTypeDict: Array
  },
  data () {
    return {
      formData: {},
      isLoading: false,
      rebuildLoading: false,
      retryLoading: false,
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增消息' : '消息详情')
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
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    init (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {}
      } else {
        console.log(row)
        this.formData = row
      }
    },
    rebuildMsgHandle () {
      if (this.rebuildLoading) return
      const { id } = this.formData
      const params = { id }
      this.rebuildLoading = true
      rebuildMsg(params).then(({ data }) => {
        this.rebuildLoading = false
        if (data.code === 0) {
          this.$Message.success('操作成功')
          this.formData.reportData = data.data
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.rebuildLoading = false
        this.$Message.error(err.message)
      })
    },
    retryMsgHandle () {
      if (this.retryLoading) return
      const { id, reportData } = this.formData
      const params = { id, reportData }
      this.retryLoading = true
      retryMsg(params).then(({ data }) => {
        this.retryLoading = false
        if (data.code === 0) {
          this.$Message.success('操作成功')
          this.$emit('updateList')
          this.closeModal()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.retryLoading = false
        this.$Message.error(err.message)
      })
    }
  }
}
</script>
<style lang="less">
.module-manage-edit-wrapper {
  .file-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .file-name {
      display: inline-block;
      width: 140px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .ivu-btn-text {
      color: #ed4014;
    }
  }
  .ivu-form-item {
    margin-bottom: 0px !important;
  }
  .sub-title-wrapper {
    padding-top: 20px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      color: #2d8cf0;
      font-size: 14px;
    }
  }
  .footer-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tip {
    line-height: 50px;
    color: #ed4014;
    font-size: 12px;
    padding-left: 35px;
  }
}
</style>
