<template>
  <div>
    <Modal v-model="isVisible"
           class="printer-modal"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="设置"
           width="500">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="120"
              label-position="right">
          <div class="title">打印设置
          </div>
          <FormItem label="默认A4打印机">
            <Select v-model="formData.defaultPrinter"
                    :disabled="formData.browserPreview">
              <Option v-for="(item,index) in printerList"
                      :value="item"
                      :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="条码打印机">
            <Select v-model="formData.barcodePrinter"
                    :disabled="formData.browserPreview">
              <Option v-for="(item,index) in printerList"
                      :value="item"
                      :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="发票打印机">
            <Select v-model="formData.invoicePrinter"
                    :disabled="formData.browserPreview">
              <Option v-for="(item,index) in printerList"
                      :value="item"
                      :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="浏览器预览打印">
            <div class="flex-wrapper"
                 style="justify-content: flex-end;">
              <i-switch v-model="formData.browserPreview"
                        size="large"
                        @on-change="changeBrowserPreview">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>
            <!-- <span style="color:#ed4014; margin-left:20px">*开启时，登记页面仍采用插件预览打印方式</span> -->
          </FormItem>
          <FormItem label="插件预览打印"
                    v-if="!isMac">
            <div class="flex-wrapper">
              <span style="color:#ed4014; margin-left:20px">
                <a :href="`${$url}/booking/downloadFile/lodop.zip`"
                   download="lodop.zip">点击此处下载打印插件</a>
              </span>
              <i-switch v-model="formData.lodopPreview"
                        size="large"
                        @on-change="changeLodopPreview">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>
          </FormItem>
          <FormItem label="插件静默打印"
                    v-if="!isMac">
            <div class="flex-wrapper">
              <span style="color:#ed4014; margin-left:20px">需关闭预览打印功能</span>
              <i-switch v-model="formData.lodopPrint"
                        size="large"
                        @on-change="changeLodopPrint">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>

          </FormItem>
          <FormItem label="多文件打印"
                    v-if="!isMac">
            <div class="flex-wrapper">
              <span style="color:#ed4014; margin-left:20px">体检报告、指引单多文件打印</span>
              <i-switch v-model="formData.multiLodopPrint"
                        size="large"
                        @on-change="changeMultiLodopPrint">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>

          </FormItem>
          <FormItem label="默认空白标签">
            <Input v-model="formData.labelNum"
                   size="small"
                   type="number"
                   clearable></Input>
          </FormItem>
          <div class="title">个性化设置</div>
          <FormItem label="主总检保存前提示未检"
                    :label-width="160">
            <div class="flex-wrapper"
                 style="justify-content: flex-end;">
              <i-switch v-model="formData.mainExamTipFlag"
                        size="large"
                        @on-change="mainExamTipFlagChange">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>

            <!-- <span style="color:#ed4014; margin-left:20px">*开启时，登记页面仍采用插件预览打印方式</span> -->
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                @click="confirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getLodop } from "@/libs/LodopFuncs.js";
import {
  getPrinterConfigFromLocalstorage,
  setPrinterConfigLocalstorage
} from '@/libs/util'

export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      formData: {
        browserPreview: true,
        lodopPreview: false,
        lodopPrint: false
      },
      printerList: [],
      isMac: false
    };
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () { }
    }
  },
  watch: {
    'formData.browserPreview': {
      handler (newVal, oldVal) {
        console.log('浏览器开关动了')
        console.log(newVal)
        console.log(oldVal)
        if (newVal === undefined) return
        if (!this.isMac && !newVal) {
          console.log('获取打印列表执行吗？')
          this.printerList = []
          this.getPrinterList()
        }
      },
      immediate: true
    }
  },
  mounted () {
    // 如果是苹果电脑不加载lodop
    this.isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    console.log('isMAC' + this.isMac)
    // setPrinterConfigLocalstorage(this.formData)
  },
  methods: {
    getPrinterList () {
      console.log('获取打印列表')
      let LODOP = getLodop();
      if (!LODOP) return
      let len = LODOP.GET_PRINTER_COUNT();
      for (let i = 0; i < len; i++) {
        this.printerList.push(LODOP.GET_PRINTER_NAME(i));
      }
      console.log(this.printerList)
    },
    getPrinterConfig () {
      let params = getPrinterConfigFromLocalstorage()
      if (JSON.stringify(params) !== '{}') {
        this.formData = Object.assign({}, params)
        if (!this.formData.hasOwnProperty('mainExamTipFlag')) {
          this.$set(this.formData, "mainExamTipFlag", true);
        }
      } else {
        this.$set(this.formData, "defaultPrinter", null);
        this.$set(this.formData, "barcodePrinter", null);
        this.$set(this.formData, "lodopPreview", false);
        this.$set(this.formData, "lodopPrint", false);
        this.$set(this.formData, "browserPreview", true);
        this.$set(this.formData, "labelNum", '');
        this.$set(this.formData, "mainExamTipFlag", true);
        this.$set(this.formData, "multiLodopPrint", false);
      }
    },
    changeBrowserPreview (status) {
      if (status) {
        // this.$set(this.formData, "defaultPrinter", null);
        // this.$set(this.formData, "barcodePrinter", null);
        this.$set(this.formData, "lodopPrint", false);
        this.$set(this.formData, "lodopPreview", false);
        this.$set(this.formData, "multiLodopPrint", false);
      } else {
        this.$set(this.formData, "lodopPrint", false);
        this.$set(this.formData, "lodopPreview", true);
        this.$set(this.formData, "multiLodopPrint", false);
      }
    },

    mainExamTipFlagChange (status) {
      return false
      if (status) {
        this.$set(this.formData, "mainExamTipFlag", true)
      } else {
        this.$set(this.formData, "mainExamTipFlag", false)
      }
    },

    changeLodopPreview (status) {
      if (status) {
        this.$set(this.formData, "lodopPrint", false);
        this.$set(this.formData, "browserPreview", false);
        this.$set(this.formData, "multiLodopPrint", false);
      } else {
        this.$set(this.formData, "lodopPrint", true);
        this.$set(this.formData, "browserPreview", false);
      }
    },
    changeLodopPrint (status) {
      if (status) {
        this.$set(this.formData, "lodopPreview", false);
        this.$set(this.formData, "browserPreview", false);
      } else {
        this.$set(this.formData, "lodopPreview", true);
        this.$set(this.formData, "browserPreview", false);
        this.$set(this.formData, "multiLodopPrint", false);
      }
    },
    changeMultiLodopPrint (status) {
      if (status) {
        this.$set(this.formData, "lodopPreview", false);
        this.$set(this.formData, "browserPreview", false);
        this.$set(this.formData, "lodopPrint", true);
      }
    },
    confirm () {
      setPrinterConfigLocalstorage(this.formData)
      this.$emit("close");
    },
    closeModal () {
      this.$emit("close");
    }
  }
};
</script>

<style lang="less">
.printer-modal {
  .title {
    line-height: 36px;
    font-size: 14px;
    color: #2d8cf0;
    font-weight: bold;
    padding-left: 8px;
  }
  .flex-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 34px;
  }
  .ivu-form-item {
    margin-bottom: 12px !important;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
}
</style>
