<template>
  <div>
    <Modal v-model="isVisible"
           @on-cancel="closeModal"
           class="tree-modal"
           :styles="{top: '150px'}"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="85"
              label-position="left">
          <FormItem label="父节点名称">
            <Input v-model="curParentNodeName"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="节点名称"
                    prop="curNodeName"
                    :rules="[{ required: true, message: '请输入节点对应的部门名称'}]">
            <Input v-model="formData.curNodeName"
                   ref="inputFocus"
                   @on-blur="handleBlur"
                   size="small"></Input>
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

export default {
  props: {
    parentNodeName: String,
    visible: Boolean,
    title: Number,
  },
  data () {
    return {
      formData: {
        curNodeName: ''
      },
      isLoading: false,
    }
  },
  computed: {
    showTitle () {
      return this.title == 0 ? '新增部门' : '修改部门';
    },
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    },
    curParentNodeName: {
      get: function () {
        return this.parentNodeName;
      },
      set: function () {

      }
    }
  },
  watch: {
    curParentNodeName: {
      handler (val, oldVal) {
        // console.log(val, oldVal)
        if (val) {
          this.$set(this.formData, 'parentNodeName', val)
        }

      },
      deep: true
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
  },
  methods: {

    closeModal () {
      this.$emit('close');
      this.$refs.form.resetFields()
    },
    save () {
      // console.log(this.formData.curNodeName)
      this.$refs.form.validate((valid) => {
        if (valid) {
          // if(this.title == '0') {
          this.$emit('add', this.formData.curNodeName)
          this.$set(this.formData, 'curNodeName', '')
          // }
          this.$emit('close');
          this.$refs.form.resetFields()
        }
      })
    },
    getItemList (row) {
      console.log(row)
      if (Object.keys(row).length == 0) {
        this.formData = {
          curNodeName: ''
        }
      } else {
        this.$set(this.formData, 'curNodeName', row.data.label)
      }
    },

    handleBlur () {

      console.log(this.formData.curNodeName)
    }
  }
}
</script>

<style lang="less">
.tree-modal {
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

