<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="menuListManage-edit-wrapper">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="80"
              ref="formSubmit"
              label-position="right">
          <FormItem label="父级"
                    v-if="title != 0">
            <Input v-model="formData.poParentName"
                   :disabled="true"
                   size="small"></Input>
          </FormItem>
          <FormItem label="菜单名称"
                    prop="poName"
                    :rules="[{ required: true, message: '请输入菜单名称', trigger: 'blur' }]">
            <Input v-model="formData.poName"
                   size="small"></Input>
          </FormItem>
          <FormItem label="可见级别"
                    prop="poDisplayLevel"
                    :rules="[{ required: true, message: '请输入可见级别', trigger: 'change' }]">
            <Select v-model="formData.poDisplayLevel"
                    size="small">
              <Option value="0">普通用户</Option>
              <Option value="1">机构管理员</Option>
              <Option value="2">超级管理员</Option>
            </Select>
          </FormItem>
          <FormItem label="链接"
                    prop="poPageUrl"
                    :rules="[{ required: true, message: '请输入菜单链接', trigger: 'blur' }]">
            <Input v-model="formData.poPageUrl"
                   size="small"></Input>
          </FormItem>
          <FormItem label="排序"
                    prop="poSort">
            <Input v-model="formData.poSort"
                   size="small"></Input>
          </FormItem>
          <FormItem label="菜单图标">
            <Poptip trigger="focus"
                    placement="bottom"
                    word-wrap
                    width="286"
                    content="content">
              <template slot="content">
                <div>
                  <span class="icon-wrapper"
                        @click="choseIcon(item)"
                        v-for="(item, index) in iconList"
                        :key="index">
                    <Icon :type="item"
                          size="20" /></span>
                  </span>
                </div>
              </template>
              <Input v-model="formData.poIcon"
                     size="small"></Input>
            </Poptip>

          </FormItem>
          <FormItem label="功能">
            <CheckboxGroup v-model="formData.authorityList">
              <Checkbox label="list">
                <span>查询</span>
              </Checkbox>
              <Checkbox label="add">
                <span>添加</span>
              </Checkbox>
              <Checkbox label="edit">
                <span>修改</span>
              </Checkbox>
              <Checkbox label="del">
                <span>删除</span>
              </Checkbox>
              <Checkbox label="approve">
                <span>审批</span>
              </Checkbox>
              <Checkbox label="leadingIn">
                <span>导入</span>
              </Checkbox>
              <Checkbox label="leadingOut">
                <span>导出</span>
              </Checkbox>
              <Checkbox label="print">
                <span>打印</span>
              </Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="状态">
            <RadioGroup v-model="formData.poStatus"
                        type="button">
              <Radio label="0"><span>启用</span></Radio>
              <Radio label="1"><span>禁用</span></Radio>
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
import { editMenu } from '@/api/system_menuManage.js'
import icon from '@/libs/iconList.js'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {
        poStatus: '0',
        poIcon: ''
      },
      iconList: icon,
      isLoading: false
    }
  },
  mounted () {

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
  methods: {
    closeModal () {
      this.formData = {
        poStatus: '0',
        poIcon: ''
      }
      this.$refs.formSubmit.resetFields()
      this.$emit('close')
    },
    save () {
      this.$refs.formSubmit.validate((valid) => {
        if (valid) {
          this.isLoading = true
          if (this.formData.hasOwnProperty('children')) {
            delete this.formData.children
          }
          // console.log(JSON.stringify(this.formData))
          console.log(this.formData)
          editMenu(this.formData).then((res) => {
            this.isLoading = false
            let result = res.data
            if (result.code == 0) {
              this.$emit('upDateList')
              this.$emit('close')
              this.$Message.success('保存成功,页面权限配置重新登录后生效')
            } else {
              this.$Message.error(result.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
      })
    },
    choseIcon (item) {
      this.formData.poIcon = item
    },
    getFormData (type, row) {
      if (type == 0 && row.hasOwnProperty('poId')) {
        this.formData = {
          poStatus: '0',
          poIcon: ''
        }
        this.$refs.formSubmit.resetFields()
        this.formData.poParentId = row.poId
      } else if (type == 1) {
        this.formData = row
        console.log(this.formData)
      }
    }
  }
}
</script>
<style lang="less">
.menuListManage-edit-wrapper {
  .modal-body {
    width: 350px;
    margin: 0 auto;
    .ivu-form-item {
      margin-bottom: 24px;
    }
    .ivu-poptip-body-content {
      height: 150px;
      overflow: visible;
    }
    .icon-wrapper {
      display: inline-block;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
