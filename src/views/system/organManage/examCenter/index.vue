<template>
  <div class="exam-center-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检中心基本信息设置</span>
        <div class="title-right-tool">
          <Button type="primary"
                  @click="editHandle">修改</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <Form ref="examForm"
              :model="formData"
              :label-width="85"
              :inline="true">
          <Row>
            <FormItem label="中心名称"
                      :rules="[{ required: true, message: '请输入中心名称', trigger: 'blur' }]"
                      prop="sdName">
              <Input v-model="formData.sdName"
                     :disabled="!isEdit"></Input>
            </FormItem>
            <FormItem label="英文名称"
                      :rules="[{ required: true, message: '请输入英文名称', trigger: 'blur' }]"
                      prop="sdEngName">
              <Input v-model="formData.sdEngName"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="通讯地址"
                      :rules="[{ required: true, message: '请输入通讯地址', trigger: 'blur' }]"
                      prop="sdAddress">
              <Input v-model="formData.sdAddress"
                     :disabled="!isEdit"></Input>
            </FormItem>
            <FormItem label="邮政编码"
                      :rules="[{ required: true, message: '请输入邮政编码', trigger: 'blur' }]"
                      prop="sdPostCode">
              <Input v-model="formData.sdPostCode"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="联系人"
                      :rules="[{ required: true, message: '请输入联系人', trigger: 'blur' }]"
                      prop="sdContactPerson">
              <Input v-model="formData.sdContactPerson"
                     :disabled="!isEdit"></Input>
            </FormItem>
            <FormItem label="联系电话"
                      :rules="[{ required: true, message: '请输入联系电话', trigger: 'blur' }]"
                      prop="sdTel">
              <Input v-model="formData.sdTel"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="联系邮箱"
                      :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式有误', trigger: 'blur' }]"
                      prop="sdEmail">
              <Input v-model="formData.sdEmail"
                     :disabled="!isEdit"></Input>
            </FormItem>
            <FormItem label="中心代码"
                      :rules="[{ required: true, message: '请输入中心代码', trigger: 'blur' }]"
                      prop="sdRelateCode">
              <Input v-model="formData.sdRelateCode"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="体检号前缀"
                      prop="sdPeIdPrefix">
              <Input v-model="formData.sdPeIdPrefix"
                     :disabled="!isEdit"></Input>
            </FormItem>
            <FormItem label="计算机导诊"
                      prop="sdComputerGuide">
              <Input v-model="formData.sdComputerGuide"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="报告机构名称"
                      :label-width="100"
                      prop="sdReportName">
              <Input v-model="formData.sdReportName"
                     style="width:418px;"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="问候语"
                      prop="sdGreeting">
              <Input v-model="formData.sdGreeting"
                     type="textarea"
                     style="width:418px;"
                     :autosize="{minRows: 4, maxRows: 4}"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>
          <Row>
            <FormItem label="系统授权码"
                      prop="sdAuthorizedKey">
              <Input v-model="formData.sdAuthorizedKey"
                     :disabled="!isEdit"></Input>
            </FormItem>
            <FormItem label="系统校验码"
                      prop="sdVerifyKey">
              <Input v-model="formData.sdVerifyKey"
                     :disabled="!isEdit"></Input>
            </FormItem>
          </Row>

        </Form>
      </div>
      <div class="page-footer"
           v-if="isEdit">
        <Button type="default"
                @click="cancelHandle">取消</Button>
        <Button type="primary"
                style="margin-left: 8px;"
                @click="saveHandle">保存</Button>
      </div>
    </Card>
  </div>
</template>
<script>
import { examCenterList, examCenterSave } from '@/api/examCenter.js'
export default {
  name: 'examCenter',
  data () {
    return {
      formData: {
        cnName: '爱康国宾体检中心',
        enName: 'center'

      },
      isEdit: false

    }
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  mounted () {
    this.getCenterInfo()
  },
  methods: {
    editHandle () {
      this.isEdit = true
    },
    cancelHandle () {
      this.isEdit = false
    },
    getCenterInfo () {
      let params = {
        orgId: this.userInfo.poOrgId
      }
      examCenterList(params).then(({ data }) => {
        if (data.code == 0) {
          this.formData = data.data
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('保存失败，请稍后重试')
      })
    },
    saveHandle () {
      this.$refs['examForm'].validate((valid) => {
        if (valid) {
          examCenterSave(this.formData).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success('保存成功')
              this.cancelHandle()
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('保存失败，请稍后重试')
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.exam-center-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-group {
      top: 0;
    }
  }
  .title-right-tool {
    display: flex;
    align-items: center;
  }
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
  .ivu-form-item {
    margin-bottom: 24px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-input[disabled] {
    color: #666;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-btn-error[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
}
</style>
