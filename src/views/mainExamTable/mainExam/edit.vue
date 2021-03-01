<template>
  <div>
    <Modal v-model="isVisible"
           width="800"
           title="综述信息"
           @on-ok="ok"
           @on-cancel="cancel"
           :styles="{top: '20px'}"
           v-dragForbid
           draggable>
      <Input v-model="value"
             :value="fullValue"
             :autofocus="true"
             placeholder="请输入综述信息"
             type="textarea"
             :rows="36"
             :readonly="disabled" />
      <div slot="footer">
        <Button type="primary"
                @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    title: [String, Number],
    visible: Boolean,
    inputValue: String,
    disabled: Boolean
  },
  data () {
    return {
      value: ''
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    getValue () {
      return this.inputValue
    },
    fullValue () {
      this.value = this.getValue
      return this.inputValue
    }
  },
  watch: {
    value: function (val) {
      console.log(val)
      this.$emit('func1', val)
    }
  },
  methods: {
    // 关闭编辑框
    // closeModal() {
    //   this.$emit("close");
    // },
    ok () {
      this.$emit('close')
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-modal-content {
  width: 800px;
}
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
  margin-bottom: 12px;
}
</style>
