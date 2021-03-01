<template>
  <div>
    <Modal
      v-model="isVisible"
      width="800"
      title="疾病科普"
      @on-ok="ok"
      :mask-closable="false"
      :closable="false"
    >
      <Input
        :readonly="inputStatus == 9"
        v-model="value"
        :value="fullValue"
        :autofocus="true"

        type="textarea"
        :rows="16"
      />
      <div slot="footer">
        <Button
          type="primary"
          @click="ok"
        >确定</Button>
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
    status: [String, Number]
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
      set: function () {}
    },
    inputStatus: {
      get: function () {
        // console.log(this.status)
        return this.status
      },
      set: function () {}
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
      // console.log(val);
      this.$emit('func3', val)
    }
  },
  methods: {
    // 关闭编辑框
    closeModal () {
      this.$emit('close')
    },
    ok () {
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
  margin-bottom: 12px;
}
</style>
