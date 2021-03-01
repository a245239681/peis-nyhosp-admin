<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           width="900"
           class="wechat-bill-edit-wrapper">
      <div class="modal-body">
        <div class="bill-info">
          <Form :model="formData"
                :label-width="100"
                :rules="ruleValidate"
                ref="form"
                label-position="right">
            <div class="title">发票情况</div>
            <FormItem label="总计金额：">
              <Input v-model="formData.totalAmount"
                     disabled></Input>
            </FormItem>
            <FormItem label="发票号：">
              <Input v-model="formData.billNumber"
                     disabled></Input>
            </FormItem>
            <FormItem label="应收款：">
              <Input v-model="formData.price"
                     disabled></Input>
            </FormItem>
            <FormItem label="实收金额："
                      v-if="payType == 2"
                      prop="realPrice">
              <Input v-model="formData.realPrice"
                     @on-enter="caculateHandle"
                     @on-change="caculateHandle"
                     @on-blur="caculateHandle"></Input>
            </FormItem>
            <FormItem label="找零金额："
                      v-if="payType == 2">
              <Input v-model="formData.lastPrice"
                     disabled></Input>
            </FormItem>
          </Form>
          <div class="caculate-money">
            <div class="title">付款方式</div>
            <div v-if="payType == 0 && orderNo">
              <div v-if="payStatus == 2"
                   style="display:flex;align-item: center; justify-content:center;flex-direction: column;align-items: center;">
                <div>
                  <img src="@/assets/images/success.png"
                       alt="">
                </div>
                <div>支付成功</div>
              </div>
              <div v-if="payStatus !== 2"
                   style="display:flex;align-item: center; justify-content:center;flex-direction: column;align-items: center;">
                <div>
                  <img src="@/assets/images/loading.png"
                       alt="">
                </div>
                <div>支付中</div>
              </div>
            </div>
            <div class="pay-methods">
              <div><Button style="flex:1;"
                        :disabled="payStatus == 2"
                        @click="payTypeChange(0)"
                        :type="payType == 0 ? 'primary' : 'default'">微信、支付宝扫码支付 (F1)</Button></div>
              <div>
                <Button :disabled="payStatus == 2"
                        :type="payType == 1 ? 'primary' : 'default'"
                        @click="payTypeChange(1)"
                        style="flex:1;">银联支付 (F2)</Button>
                <Button :disabled="payStatus == 2"
                        style="margin-left: 8px; flex:1;"
                        @click="payTypeChange(2)"
                        :type="payType == 2 ? 'primary' : 'default'">现金支付 (F3)</Button>
              </div>
              <div>
                <Button :disabled="payStatus == 2"
                        :type="payType == 3 ? 'primary' : 'default'"
                        @click="payTypeChange(3)"
                        style="flex:1;">市医保支付 (F4)</Button>
                <Button :disabled="payStatus == 2"
                        style="margin-left: 8px; flex:1;"
                        @click="payTypeChange(4)"
                        :type="payType == 4 ? 'primary' : 'default'">区医保支付 (F5)</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="bill-preview">
          <div class="title">发票预览</div>
          <div class="bill-title">医院门诊收据</div>
          <div class="bill-number"><span>No.</span>{{formData.billNumber}}</div>
          <div class="patient-name">姓名：{{formData.username}}</div>
          <vxe-table class="mytable-footer"
                     ref="xTree"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     height="400"
                     :data="tableData"
                     align="center"
                     :footer-method="footerMethod"
                     footer-row-class-name="table-footer-row"
                     :loading="isLoading">
            <vxe-table-column field="subjectName"
                              title="项目名称"
                              tree-node
                              min-width="200"></vxe-table-column>
            <vxe-table-column field="subjectAmount"
                              title="金额"
                              width="120"></vxe-table-column>
          </vxe-table>
          <div class="footer-tip">
            <div class="doctor-name">收款员：{{userInfo.poName}}</div>
            <div class="bill-date">收款日期：{{ billDate | dateformat('YYYY-MM-DD')}}</div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer-wrapper">
          <div class="footer-date">
            <span class="pre-title">发票日期</span>
            <DatePicker v-model="billDate"
                        :value="billDate"
                        format="yyyy-MM-dd"
                        placement="top-start"
                        type="date"
                        size="small"
                        placeholder="请选择日期"></DatePicker>
          </div>
          <div class="footer-handle-wrapper">
            <Button type="primary"
                    :loading="isLoading"
                    :disabled="payStatus != 2 && payType == 0"
                    @click="confirmBilling">确认开票 (Enter)</Button>
            <Button @click="closeModal">退出 (Esc)</Button>
          </div>
        </div>

      </div>
    </Modal>
    <PhonePay :visible="editModalVisible"
              ref="phonePay"
              @getboAuthCode="getboAuthCode"
              @payment="payment"
              @handleQuery="handleQuery"
              @close="closePayModal"></PhonePay>
  </div>
</template>
<script>
import PhonePay from './phonePay';
import XEUtils from 'xe-utils';
import { budgetCost, payment, orderQuery } from '@/api/newPersonBalance';
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js';
import moment from 'moment';
import Nzh from 'nzh'; // 金额转中文
import { debounce } from '@/libs/tools';
let SPEEDER = new window.SpeechSynthesisUtterance();

export default {
  props: {
    title: Number,
    visible: Boolean,
  },
  components: {
    PhonePay,
  },
  data () {
    return {
      formData: {
        totalAmount: '',
        billNumber: '',
        price: '',
        realPrice: '',
        lastPrice: '',
      },
      isLoading: false,
      billDate: '', // 发票日期
      tableData: [], // 发票项目明细
      isLoading: false,
      payType: 0, // 支付方式
      editModalVisible: false, // 弹窗开关
      personalItemIds: [], // 报价入参
      boAuthCode: '', // 用户扫款码
      registerCode: '',
      orderNo: '',
      printLoading: false,
      payStatus: 0, // 支付状态 0-支付未成功，1-支付中，2-支付成功
      ruleValidate: {
        realPrice: [
          {
            message: '请输入正确的实收金额',
            trigger: 'blur',
            pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/,
          },
        ],
      },
    };
  },
  computed: {
    showTitle () {
      return this.title == 0 ? '补开发票' : '补开发票';
    },
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () { },
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo;
      },
      set: function () { },
    },
    'formData.lastPrice': {
      get: function () {
        let change = 0;
        change = this.formData.realPrice - this.formData.price;
        return Number(change.toFixed(2));
      },
      set: function () { },
    },
  },
  watch: {
    isVisible (newVal) {
      console.log('状态变化了', newVal);
      if (newVal) {
        // 打开了弹窗，监听Enter事件
        console.log('子组件开始监听');
        // document.removeEventListener("keydown", this.$parent.keys);
        document.addEventListener('keydown', this.keysMethods);
      } else {
        document.removeEventListener('keydown', this.keysMethods);
        // document.addEventListener("keydown", this.$parent.keys);
        this.payType = 0;
        this.payStatus = 0;
        this.orderNo = '';
      }
    },
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.keysMethods);
  },
  methods: {
    closeModal () {
      this.$emit('close');
    },

    keysMethods (e) {
      let key = window.event.keyCode ? window.event.keyCode : window.event.which;
      // console.log('key', key, e);
      // F1 -- 112
      // F2 -- 113
      // F3 -- 114
      // Enter -- 13
      // Esc -- 27
      // F9 -- 120
      // F12 --123
      // console.log(e, key);
      if (key == 112) {
        console.log('点击F1按钮');
        this.payTypeChange(0);
        e.preventDefault();
      }

      if (key == 113) {
        console.log('点击F2按钮');
        this.payTypeChange(1);
        e.preventDefault();
      }

      if (key == 114) {
        console.log('点击F3按钮');
        this.payTypeChange(2);
        e.preventDefault();
      }

      if (key == 115) {
        console.log('点击F4按钮');
        this.payTypeChange(3);
        e.preventDefault();
      }

      if (key == 116) {
        console.log('点击F5按钮');
        this.payTypeChange(4);
        e.preventDefault();
      }

      if (key === 13) {
        // Enter 等同于清空按钮
        // console.log('点击Enter按钮');
        this.confirmBilling();
        e.preventDefault();
      }
      // e.preventDefault();
    },

    getItemList (row) {
      console.log('row', row);
      this.formData.billNumber = row.billNumber;
      this.formData.username = this.$parent.form.name;
      this.registerCode = row.registerCode;
      this.personalItemIds = [];
      row.list.map((item) => {
        this.personalItemIds.push({
          id: item.id,
        });
      });
      console.log('personalItemIds', this.personalItemIds);
      this.billDate = moment().format('YYYY-MM-DD');
      this.budgetCost();
    },

    // 获取
    getboAuthCode (val) {
      console.log('getboAuthCode', val);
      this.boAuthCode = val;
      console.log('boAuthCode', this.boAuthCode);
    },

    // 获取报价信息
    async budgetCost () {
      let params = {
        personalItemIds: this.personalItemIds,
        boInvoiceNo: this.formData.billNumber,
      };
      try {
        let { data } = await budgetCost(params);
        console.log('data', data);
        if (data.code == 0) {
          this.formData.totalAmount = data.data.boRealAmount.toFixed(2);
          this.formData.price = data.data.boSettleAmount.toFixed(2);
          this.tableData = data.data.subjectList;
          this.personalItemIds = data.data.personalItemIds;
          if (SPEEDER) {
            let nzhcn = Nzh.cn;
            let cnSpeech = nzhcn.encodeS(this.formData.price);
            SPEEDER.text = `请您支付：${cnSpeech}元`;
            SPEEDER.rate = 0.8;
            SPEEDER.pitch = 2;
            window.speechSynthesis.speak(SPEEDER);
          }
        } else {
          this.$Message.error(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 支付创建订单并发起支付
    payment () {
      return new Promise(async (resolve, reject) => {
        let params = null;
        if (this.payType == 0) {
          params = {
            // boRegisterCode: '',
            // personalItemIds: this.personalItemIds,
            // boPayType: {
            //   boAuthCode: ''
            // },
            boRegisterCode: this.registerCode,
            personalItemIds: this.personalItemIds,
            boInvoiceNo: this.formData.billNumber,
            boPayType: {
              boAuthCode: this.boAuthCode,
              // boAuthCode: "135192159975619090"
            },
          };
        } else if (this.payType == 1) {
          params = {
            boRegisterCode: this.registerCode,
            personalItemIds: this.personalItemIds,
            boInvoiceNo: this.formData.billNumber,
            boPayType: {
              name: '银联支付',
              code: 'YLZF',
              money: this.formData.price,
            },
          };
        } else if (this.payType == 2) {
          params = {
            boRegisterCode: this.registerCode,
            personalItemIds: this.personalItemIds,
            boInvoiceNo: this.formData.billNumber,
            boPayType: {
              // name: '',
              // code: '',
              // money: '',
              name: '现金支付',
              code: 'XJZF',
              money: this.formData.price,
            },
          };
        } else if (this.payType == 3) {
          params = {
            boRegisterCode: this.registerCode,
            personalItemIds: this.personalItemIds,
            boInvoiceNo: this.formData.billNumber,
            boPayType: {
              name: '市医保支付',
              code: 'SYBZF',
              money: this.formData.price,
            },
          };
        } else if (this.payType == 4) {
          params = {
            boRegisterCode: this.registerCode,
            personalItemIds: this.personalItemIds,
            boInvoiceNo: this.formData.billNumber,
            boPayType: {
              name: '区医保支付',
              code: 'QYBZF',
              money: this.formData.price,
            },
          };
        }
        try {
          let { data } = await payment(params);
          console.log('payment', data);
          if (data.code == 0) {
            resolve(data.data);
          } else {
            this.$Message.error(data.message);
            reject();
          }
        } catch (err) {
          reject(err);
          console.log(err);
        }
      });
    },
    // 查询支付状态
    async handleQuery () {
      if (!printNotice()) return false;

      if (this.printLoading) return false;
      let params = {
        // orderNo: '',
        // boRegisterCode: '',
        // boInvoiceNo: '',
        orderNo: this.orderNo,
        boRegisterCode: this.registerCode,
        boInvoiceNo: this.formData.billNumber,
      };
      try {
        let { data } = await orderQuery(params);
        this.printLoading = true;
        console.log('orderQuery', data);

        if (data.code == 0) {
          // 支付宝、微信支付时启用语音播报
          if (data.data.paymentType && SPEEDER) {
            let nzhcn = Nzh.cn;
            let cnSpeech = nzhcn.encodeS(data.data.paymentFee);
            let _payType = data.data.paymentType || '';
            SPEEDER.text = `${_payType}：${cnSpeech}元`;
            SPEEDER.rate = 0.8;
            SPEEDER.pitch = 2;
            window.speechSynthesis.speak(SPEEDER);
          }

          // 支付成功，直接打印发票，清空,
          if (this.payType == 3 || this.payType == 4) {
            // 医保支付不需要进行打印发票
            console.log('医保支付，不用打印发票');
            this.$Message.success('支付成功');
          } else {
            let printParams = {
              guideUrl: this.$url + data.data.invoicePdf,
              selGroup: ['printGuide'],
            };
            printMethods(printParams.guideUrl, printParams);
          }

          this.formData.realPrice = '';
          this.formData.lastPrice = '';
          this.payStatus = 2;
          this.$parent.getinvoiceAndReceipt();
          this.$emit('close');
          // this.$emit('updateList');
          this.$parent.clear();
          // 刷新一次页面
          // this.$router.go(0);
          this.$parent.$refs.registerCodeInput.focus();
        } else {
          this.payStatus = 0;
          // if (this.payType == 0) {
          //   console.log(data.message);
          // } else {
          //   }
          this.$Message.error(data.message);

          this.printLoading = false;
        }
      } catch (err) {
        console.log(err);
        this.printLoading = false;
        this.$Message.error('网络不稳定，请稍后重试');
      } finally {
        this.printLoading = false;
      }
    },

    // 确定开票
    confirmBilling: debounce(async function () {
      // console.log('boAuthCode', this.boAuthCode);
      // console.log('防抖', this);
      if (!this.formData.billNumber) {
        this.$Message.error('缺少发票号');
        return false;
      }

      if (this.payType == 0 && !this.boAuthCode) {
        this.$Message.error('请先扫码支付');
        return false;
      }

      if (this.payType == 2 && !Boolean(Number(this.formData.realPrice))) {
        this.$Message.error('请输入正确的实收金额');
        return false;
      }

      if (this.payType == 2 && this.formData.realPrice <= 0) {
        this.$Message.error('实收金额不能为小于0');
        return false;
      }

      // 实收金额-应收金额，如果小于0，提示实收不能小于应收金额，大于等于0不用提示
      let result = this.formData.realPrice * 100 - this.formData.price * 100 < 0 ? true : false;

      if (this.payType == 2 && parseFloat(this.formData.realPrice) < parseFloat(this.formData.price)) {
        // if (this.payType == 2 && result) {
        this.$Message.error('实收金额不能小于应收金额');
        return false;
      }

      try {
        if (this.payType == 0) {
          this.handleQuery();
        } else {
          let result = await this.payment();
          console.log('result', result);
          this.orderNo = result.orderNo;
          // this.$refs.phonePay.orderNo = this.orderNo;
          this.handleQuery();
        }
      } catch (err) {
        console.log(err);
      }
    }, 500),

    closePayModal (query) {
      this.editModalVisible = false;
      console.log('query', query);
      this.boAuthCode = query;
      // 付款码弹窗关闭后需要重新监听弹窗的键盘事件
      document.addEventListener('keydown', this.keysMethods);
    },

    // 选择手机支付是打开弹窗
    payTypeChange (type) {
      this.payType = type;
      if (type == 0) {
        this.editModalVisible = true;
        // 打开付款码弹窗时关闭监听键盘事件
        document.removeEventListener('keydown', this.keysMethods);
        this.$refs.phonePay.focusHandle();
      } else {
        this.formData.realPrice = '';
        this.formData.lastPrice = '';
        this.editModalVisible = false;
      }
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      // let params = Object.assign({}, row)
      // this.$nextTick(() => {
      //   this.$refs.editwrapper.getItemList(params)
      // })
    },
    // 计算找零金额
    caculateHandle () {
      console.log('realPrice', this.formData.realPrice);
      let _price = this.formData.price ? Number(this.formData.price) * 100 : '';
      let _realPrice = this.formData.realPrice ? Number(this.formData.realPrice) * 100 : '';

      if (!_price || !_realPrice) return false;

      let _lastPrice = ((_realPrice - _price) / 100).toFixed(2);
      this.$set(this.formData, 'lastPrice', _lastPrice.toString());
    },
    // 合计
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return `合计：`;
          }
          switch (column.property) {
            case 'subjectAmount':
              // return `累计发放体检表数：${Math.round(XEUtils.sum(data, 'number') * 100) / 100}`
              // return `60.00`;
              return `${Math.round(XEUtils.sum(data, 'subjectAmount') * 100) / 100}`;
          }
          return '-';
        }),
      ];
    },
  },
};
</script>
<style lang="less">
.wechat-bill-edit-wrapper {
  .modal-body {
    width: 100%;
    display: flex;
    .bill-info {
      width: 300px;
      height: auto;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 20px;
      border-right: 1px solid #e6e6e6;
      .title {
        height: 30px;
        line-height: 30px;
        color: #2d8cf0;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .caculate-money {
        padding-bottom: 20px;
        .title {
          margin-bottom: 10px;
        }
      }
      .pay-methods {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        > div {
          display: flex;
          margin-top: 10px;
          justify-content: center;
        }
      }
      .ivu-form-item-label {
        font-size: 16px !important;
        font-weight: bold;
        color: #252525;
      }
      .ivu-input[disabled] {
        color: #252525;
      }
      .ivu-input {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .bill-preview {
      flex: 1;
      height: auto;
      padding-left: 20px;
      padding-bottom: 10px;
      .title {
        height: 30px;
        line-height: 30px;
        color: #2d8cf0;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .bill-title {
        font-size: 16px;
        color: #252525;
        line-height: 1.8;
        text-align: center;
      }
      .bill-number {
        font-size: 14px;
        color: #252525;
        font-weight: bold;
        text-align: right;
        span {
          color: red;
          font-size: 16px;
        }
      }
      .patient-name {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .table-footer-row {
        font-weight: bold;
      }
    }
    .footer-tip {
      height: 30px;
      margin-top: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
    }
    // .ivu-form-item {
    //   margin-bottom: 12px;
    // }
  }
  .footer-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .footer-date {
      .pre-title {
        margin-right: 10px;
      }
    }
  }
}
</style>
