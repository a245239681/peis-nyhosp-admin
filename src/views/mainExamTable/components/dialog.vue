<template>
  <div class="dialog-wrapper"
       v-if="showModal">
    <div class="ivu-modal-mask"
         style="z-index: 1204;"></div>
    <div class="ivu-modal-wrap"
         style="z-index: 1204;">
      <div class="ivu-modal"
           style="width: 416px;">
        <div class="ivu-modal-content">
          <div class="ivu-modal-body">
            <div class="ivu-modal-confirm">
              <div class="ivu-modal-confirm-head">
                <div class="ivu-modal-confirm-head-icon ivu-modal-confirm-head-icon-confirm">
                  <slot name="icon"></slot>
                </div>
                <div class="ivu-modal-confirm-head-title">{{title}}</div>
              </div>
              <div class="ivu-modal-confirm-body">
                <!-- <div>是否取消总检？</div> -->
                <slot name="cont"></slot>
              </div>
              <div class="ivu-modal-confirm-footer">
                <Button type="text"
                        @click="cancelHandle">{{cancelText}}</Button>
                <Button type="primary"
                        @click="confirmHandle">{{confirmText}}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    confirmHandle () {
      this.$emit('confirm')
      this.$emit('close')
    },
    cancelHandle () {
      this.$emit('cancel')
      this.$emit('close')
    }
  }
}
</script>
<style lang="less">
</style>
