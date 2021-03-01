<template>
  <div>
    <Modal v-model="isVisible"
          class="physical-exam-results-attr-edit"
           @on-cancel="closeModal"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              :label-width="85"
              label-position="left">
          <FormItem label="体检项目">
            <Input search
                   size="small"
                   @on-search='add'
                   enter-button />
          </FormItem>
          <!-- <FormItem label="科室">
            <Select v-model="formData.dept"
                    size="small">
              <Option value="xxk">心胸科</Option>
              <Option value="ek">儿科</Option>
              <Option value="fk">妇科</Option>
            </Select>
          </FormItem> -->
          <FormItem label="属性分类">
            <Input v-model="formData.pyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="中文名称">
            <Input v-model="formData.wbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="描述内容">
            <Input v-model="formData.customCode"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   size="small"></Input>
          </FormItem>
          <!-- <FormItem label="科普知识">
            <Input v-model="formData.knowledge"
                   size="small"></Input>
          </FormItem> -->
          <FormItem label="异常标志">
            <RadioGroup v-model="formData.exceptionFlag">
              <Radio label="阳性发现"></Radio>
              <Radio label="疾病诊断"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="启用状态"
                    prop="cdStatus"
                    :rules="[{ required: true, message: '请选择启用状态', trigger: 'change' }]">
            <RadioGroup v-model="formData.isUse">
              <Radio label="启用"></Radio>
              <Radio label="停用"></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {

      }
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新建体检项目结果' : '编辑体检项目结果')
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
    save () {
      this.$emit('close')
    },
    add (value) {
      this.$emit('openEdit2')
    }
  }
}
</script>

<style lang="less">
.physical-exam-results-attr-edit{
  .ivu-modal-header-inner {
    position: relative;
    padding-left: 8px;
    font-weight: bold;
    &::before {
      content: "";
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
