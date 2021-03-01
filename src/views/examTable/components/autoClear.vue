<template>
  <Modal v-model="isVisible"
         scrollable
         width="500"
         @on-cancel="closeModal"
         title="清空配置">
    <div class="model-body">
      <Form :model="clearForm"
            ref="clearForm"
            :label-width="120"
            label-position="right">
        <FormItem label="自动清空">
          <i-switch v-model="clearForm.isExamTableAutoClear"
                    size="large"
                    @on-change="autoClearChange">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>

      </Form>
    </div>
    <div slot="footer">
      <Button @click="closeModal">取消</Button>
      <Button type="primary"
              @click="confirm">确定</Button>
    </div>
  </Modal>
</template>
<script>
import {
  setAutoClearStorage,
  getAutoClearStorage
} from '@/libs/util'
export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      clearForm: {}
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () { }
    }
  },
  created () {
    this.getSetting()
  },
  methods: {
    closeModal () {
      this.$emit("close");
    },
    confirm () {
      setAutoClearStorage(this.clearForm)
      this.$emit("close")
    },
    autoClearChange (status) {
      console.log(status)
    },
    getSetting () {
      let setting = getAutoClearStorage()
      if (Object.keys(setting).length > 0) {
        this.clearForm = setting
      } else {
        this.$set(this.clearForm, 'isExamTableAutoClear', true)
      }
    }
  },
}
</script>