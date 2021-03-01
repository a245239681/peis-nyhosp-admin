<template>
  <div>
    <Modal v-model="isVisible"
           @on-cancel="closeModal"
           title="拒绝理由"
           class="refuse-reason-edit-wrapper">
      <Form :model="formData">
        <FormItem prop="refuseReason">
          <Input v-model="formData.boRefuseReason"
              type="textarea"
              :rows="6"
              :maxlength = 85
              placeholder="请输入拒绝原因，可不填，字数不超过80字" />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="closeModal">关闭</Button>
        <Button type="primary"
                :isLoading="isLoading"
                @click="save">拒绝</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { modifyStatus } from '@/api/price_modifyPriceApprove.js'

export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      formData: {
        refuseReason: ''
      },
      isLoading: false
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }

  },
  mounted () {

  },
  methods: {
    // 关闭编辑框，清空编辑框内容
    closeModal () {
      this.$emit('close')
      this.formData = {}
    },

    save () {
      console.log(this.formData)
      this.isLoading = true
      modifyStatus(this.formData).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.$Message.success('操作成功！')
          this.$emit('updateList')
          this.formData = {}
          this.$emit('close')
        } else {
          this.$emit('close')
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },

    getItemList (row) {
      // 拒绝原因赋值
      this.formData = {
        boId: row.boId ? row.boId : '',
        boRefuseReason: row.boRefuseReason ? row.boRefuseReason : '',
        boStatus: '0'
      }
    }
  }
}
</script>

<style lang="less">
.refuse-reason-edit-wrapper {
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
}
</style>
