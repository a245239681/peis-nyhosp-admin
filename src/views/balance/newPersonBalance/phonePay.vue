<template>
  <div>
    <Modal v-model="isVisible" @on-cancel="closeModal" title="微信、支付宝当面付" width="300" class="phone-pay-wrapper">
      <div class="modal-body">
        <Form :model="formData" :label-width="100" ref="form" label-position="right">
          <FormItem label="用户付款码：">
            <Input v-model="formData.boAuthCode" ref="inputFocus" @keydown.enter.native.prevent="enter"></Input>
          </FormItem>
        </Form>
      </div>
      <div v-if="orderNo">
        <div v-if="payStatus == 2" style="display:flex;align-item: center; justify-content:center;flex-direction: column;align-items: center;">
          <div>
            <img src="@/assets/images/success.png" alt="">
          </div>
          <div>支付成功</div>
        </div>
        <div v-if="payStatus !== 2" style="display:flex;align-item: center; justify-content:center;flex-direction: column;align-items: center;">
          <div>
            <img src="@/assets/images/loading.png" alt="">
          </div>
          <div>支付中</div>
        </div>
      </div>
      <div slot="footer" class="footer-wrapper">
        <Button type="primary" style="flex:1;" @click="handleQuery">手动查询支付状态</Button>
        <Button style="margin-left: 10px; flex:1;" type="default" @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { payment, orderQuery } from '@/api/newPersonBalance';

export default {
  props: {
    title: Number,
    visible: Boolean,
  },
  data() {
    return {
      formData: {
        billNumber: '',
      },
      isLoading: false,
      billDate: '', // 发票日期
      tableData: [], // 发票项目明细
      isLoading: false,
      payType: 0, // 支付方式
      payStatus: 0, // 支付状态 0-支付失败，1-支付中， 2-支付失败
      orderNo: '',
      timer: null,
      isQuerying: false, // 查询状态
    };
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {},
    },
  },
  watch: {
    isVisible(val) {
      console.log('弹窗状态改变', val);
      if (val) {
        // document.addEventListener('keydown', this.keysMethods);
      } else {
        clearInterval(this.timer);
        // document.removeEventListener('keydown', this.keysMethods);
      }
    },

    'formData.boAuthCode': {
      handler: function (newVal, oldVal) {
        this.$emit('getboAuthCode', newVal);
      },
      // immediate: true
    },
    payStatus: {
      handler: function (newVal, oldVal) {
        console.log('支付状态改变', newVal, oldVal);
        this.$parent.payStatus = newVal;
        this.$parent.orderNo = this.orderNo;
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    // 监听键盘事件
    // keysMethods(e) {
    //   let key = window.event.keyCode ? window.event.keyCode : window.event.which;
    //   console.log(e, key);

    //   if (key === 13) {
    //     // Enter 等同于清空按钮
    //     console.log('点击Enter按钮');
    //     this.enter();
    //     e.preventDefault();
    //   }
    // },

    closeModal() {
      // 如果还在自动查询的过程中，关闭弹窗时需要关闭定时器
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.$emit('close', this.formData.boAuthCode);
    },

    async enter() {
      if (!this.formData.boAuthCode.trim()) {
        this.$Message.warning('请输入付款码');
        return;
      }
      try {
        let params = {
          boRegisterCode: this.$parent.registerCode,
          personalItemIds: this.$parent.personalItemIds,
          boInvoiceNo: this.$parent.formData.billNumber,
          boPayType: {
            boAuthCode: this.formData.boAuthCode,
          },
        };
        let { data } = await payment(params);
        console.log('data', data);
        if (data.code == 0) {
          this.orderNo = data.data.orderNo;
          this.payStatus = 1; // 支付中

          if (this.timer) {
            clearInterval(this.timer);
          }

          if (this.payStatus == 2) {
            console.log('支付成功了，不再执行定时器');
            return;
          }

          this.timer = setInterval(() => {
            console.log('每隔3秒查询一次状态');
            this.autoQueryStatus();
          }, 3000);
        } else {
          this.payStatus = 0; // 支付失败
          clearInterval(this.timer);
        }
      } catch (err) {
        console.log(err);
        this.payStatus = 0;
        clearInterval(this.timer);
      }
    },

    // focus
    focusHandle() {
      this.$nextTick(() => {
        this.payStatus = 0;
        this.orderNo = '';
        this.formData.boAuthCode = '';
        this.$refs.inputFocus.focus();
      });
    },

    // 自动查询支付状态
    async autoQueryStatus() {
      console.log('timer', this.timer);

      let params = {
        orderNo: this.orderNo,
        boRegisterCode: this.$parent.registerCode,
        boInvoiceNo: this.$parent.formData.billNumber,
      };
      try {
        this.isQuerying = true;
        let { data } = await orderQuery(params);

        console.log('orderQuery', data);
        if (data.code == 0) {
          this.payStatus = 2; // 支付成功
          // 支付成功后自动关闭弹窗并触发确认开票的方法
          this.closeModal();
          this.$parent.confirmBilling();
        } else {
          this.payStatus = 0; // 支付失败
        }
      } catch (err) {
        console.log(err);
        this.payStatus = 0; // 支付失败
        this.$Message.error('网络不稳定，请稍后重试');
      } finally {
        this.isQuerying = false;
      }
    },

    // 手动查询支付状态
    async handleQuery() {
      // this.$emit("handleQuery");
      if (this.timer) {
        clearInterval(this.timer);
      }

      if (!this.formData.boAuthCode.trim()) {
        this.$Message.warning('请输入付款码');
        return;
      }

      if (this.isQuerying) {
        // 自动查询正在进行时，点击了手动查询
        this.$Message.warning('正在查询中，请稍后查询');
        return;
      }

      this.isQuerying = true;

      if (!this.orderNo.trim()) {
        this.$Message.warning('请先支付');
        return;
      }

      let params = {
        orderNo: this.orderNo,
        boRegisterCode: this.$parent.registerCode,
        boInvoiceNo: this.$parent.formData.billNumber,
      };
      try {
        let { data } = await orderQuery(params);
        console.log('orderQuery', data);
        if (data.code == 0) {
          this.payStatus = 2; // 支付成功
        } else {
          this.payStatus = 0; // 支付失败
          this.$Message.error(data.message);
        }
      } catch (err) {
        console.log(err);
        this.payStatus = 0; // 支付失败
        this.$Message.error('网络不稳定，请稍后重试');
      } finally {
        this.isQuerying = false;
      }
    },
  },
};
</script>
<style lang="less">
.phone-pay-wrapper {
  .footer-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
