<template>
  <div class="new-person-balance-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <div class="title-left-wrapper">
          <Form :model="form"
                label-position="right"
                ref="form"
                inline
                style="flex:1"
                :label-width="60">
            <FormItem label="姓名"
                      :label-width="80"
                      prop="name">
              <Input v-model="form.name"
                     style="width:140px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
            <FormItem label="性别"
                      :label-width="60"
                      prop="sex">
              <Input v-model="form.sex"
                     style="width:80px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
            <FormItem label="年龄"
                      :label-width="60"
                      prop="age">
              <Input v-model="form.age"
                     style="width:80px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
            <FormItem label="体检号"
                      :label-width="80"
                      prop="peId">
              <Input v-model="form.peId"
                     style="width:140px"
                     size="small"
                     disabled
                     clearable />
            </FormItem>
          </Form>
        </div>
        <div class="title-right-tool">
          <span class="scan-label">扫码区域</span>
          <Input v-model="registerCode"
                 ref="registerCodeInput"
                 style="width:160px;font-size: 16px;font-weight:bold;margin-left:8px;"
                 @keydown.enter.native.prevent="getList"
                 clearable />
        </div>
      </div>
      <div class="page-body clearfix">
        <div class="table-wrapper">
          <vxe-table resizable
                     :tree-config="{children: 'children',trigger: 'row'}"
                     row-id="id"
                     :data="tableData"
                     :checkbox-config="{checkRowKeys:idArr, reserve: true, labelField: 'name', highlight: true, trigger: 'row'}"
                     :height="(screenHeight - 360) <= 480 ? 480 : (screenHeight - 360)"
                     @checkbox-all="selectChangeEvent"
                     @checkbox-change="selectChangeEvent">
            <vxe-table-column title="项目名称"
                              field="name"
                              tree-node
                              type="checkbox"
                              min-width="140"></vxe-table-column>
            <vxe-table-column title="项目科室"
                              field="deptName"
                              min-width="140"></vxe-table-column>
            <vxe-table-column field="type"
                              title="费用类型"
                              width="120"></vxe-table-column>
            <vxe-table-column field="price"
                              title="单价"
                              width="120"></vxe-table-column>
            <vxe-table-column field="realPrice"
                              title="应收费用"
                              width="120"></vxe-table-column>
            <vxe-table-column field="billStatus"
                              title="费用状态"
                              width="140"></vxe-table-column>
          </vxe-table>
        </div>
      </div>
      <div class="page-footer">
        <div class="total-amount-wrapper">
          <div class="total">总金额：<span>¥{{totalPrice}}</span></div>
          <div class="should-be">本次应收：<span>¥ {{receivable}}</span></div>
        </div>
        <div class="handle-wrapper">
          <div class="bill-wrapper">
            <div class="cont">
              <span>本次收费发票号：</span>
              <Input v-model="curBillNum"
                     style="width:140px"
                     clearable />
            </div>
            <!-- <Button type="primary"
                    style="margin-left: 8px;">修改当前发票</Button> -->
          </div>
          <div class="charge-wrapper">
            <Button type="primary"
                    @click="edit"
                    @keyup.120.prevent="handleKeyup"
                    style="min-width:100px;">结算 (F9)</Button>
            <Button type="default"
                    style="min-width:100px;margin-left: 8px;"
                    @click="clear"
                    @keyup.123.prevent="clear">清空 (F12)</Button>
          </div>
        </div>
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList"
          @close="closeModal"></Edit>
  </div>
</template>
<script>
import moment from 'moment';
import { balanceList } from '@/api/newPersonBalance';
import { invoiceAndReceipt } from '@/api/personBalace.js';
import Edit from './edit';
import { mapGetters } from 'vuex';
import Nzh from 'nzh'; // 金额转中文
let SPEEDER = new window.SpeechSynthesisUtterance();
console.log(SPEEDER);

export default {
  name: 'newPersonBalance',
  components: {
    Edit,
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        // 体检人员信息
        name: '',
        age: '',
        sex: '',
        peId: '',
      },
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      tableData: [],
      isLoading: false,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      emptyText: '暂无数据', // 无数据文案
      registerCode: '', //扫码区数据
      curBillNum: '', // 本次收费发票号
      receivable: 0, // 应收金额
      totalPrice: 0, // 总金额
      invoiceInfo: {}, // 发票情况
      childrenList: [], // 所有子选项列表
      personalItemIds: [], // 未缴费列表
      idArr: [], // 未缴费项目对应的id
    };
  },
  watch: {
    screenHeight (val) {
      if (!this.timer) {
        this.screenHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(() => {
          that.timer = false;
        }, 300);
      }
    },
  },
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  created () {
    document.addEventListener('keydown', this.keys);
    // document.addEventListener("keyup", this.keys);
    // if (this.$route.path == '/balance/newPersonBalance') {
    //   this.keys();
    // }
  },
  mounted () {
    // 动态计算可视窗口高度
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight;
        that.screenHeight = window.screenHeight;
      })();
    };
    let curDate = moment().format('YYYY-MM-DD');
    this.$nextTick(() => {
      this.$refs.registerCodeInput.focus();
    });

    this.$set(this.form, 'startDate', curDate);
    this.$set(this.form, 'endDate', curDate);

    this.getinvoiceAndReceipt();
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.keys);
    // document.removeEventListener("keyup", this.keys);
    console.log('结束监听');
  },

  methods: {
    keys (event) {
      // 监听键盘事件e
      let key = window.event.keyCode ? window.event.keyCode : window.event.which;
      // console.log('key', key, e);
      // F1 -- 112
      // F2 -- 113
      // F3 -- 114
      // Enter -- 13
      // Esc -- 27
      // F9 -- 120
      // F12 --123
      // console.log(event, key);
      // if (key == 112) {
      //   console.log("点击F1按钮");
      //   event.returnValue = false;
      //   event.preventDefault();
      //   event.stopPropagation();
      //   return false;
      // }

      // if (key == 113) {
      //   console.log("点击F2按钮");
      //   event.preventDefault();
      // }

      // if (key == 114) {
      //   console.log("点击F3按钮");
      //   event.preventDefault();
      // }

      if (key == 120) {
        // F9 等同于点击结算按钮
        console.log('点击F9按钮');
        this.edit();
        event.preventDefault();
        // return;
      }
      if (key == 123) {
        // F12 等同于清空按钮
        console.log('点击F12按钮');
        this.clear();
        event.preventDefault();
        // return;
      }
    },

    closeModal () {
      this.editModalVisible = false;
      // this.keys();
    },

    /**
     * 获取当前账号使用的发票号
     */
    getinvoiceAndReceipt () {
      invoiceAndReceipt({ staff_id: this.getUserInfo.userId }).then(({ data }) => {
        if (data.code == 0) {
          this.curBillNum = data.data.invoiceReceipt;
          // this.$set(this.accountFrom, 'boInvoiceNo', data.data.invoiceReceipt)
          // this.$set(this.accountFrom, 'boReceiptNo', data.data.serialNumber)
          // console.log(this.accountFrom)
        }
      });
    },

    // 获取缴费明细
    getList () {
      if (this.registerCode.trim() == '') {
        this.$Message.info('请输入登记流水号');
        this.registerCode = '';
        return false;
      }
      this.getinvoiceAndReceipt()
      this.registerCode = this.registerCode.trim();
      const params = {
        boRegisterCode: this.registerCode, // 200609010001
      };

      this.isLoading = true;
      balanceList(params)
        .then(({ data }) => {
          this.isLoading = false;
          if (data.code == 0) {
            this.totalPrice = 0;
            this.receivable = 0;
            this.personalItemIds = [];
            this.idArr = [];
            this.form = {
              name: data.data.name,
              age: data.data.age,
              sex: data.data.sex,
              peId: data.data.peId,
            };
            this.tableData = data.data.comboList;
            this.tableData.map((item) => {
              this.totalPrice = this.accAdd(this.totalPrice, item.price);
              this.totalPrice = this.totalPrice.toFixed(2);
              if (item.children && item.children.length > 0) {
                item.children.map((v) => {
                  if (v.billStatus == '未交费') {
                    this.idArr.push(v.id);
                    this.personalItemIds.push(v);
                    this.receivable = this.accAdd(this.receivable, v.realPrice);
                    this.receivable = this.receivable.toFixed(2);
                  }
                  // else {
                  //   this.receivable = (0).toFixed(2);
                  // }
                });
              } else {
                if (item.billStatus == '未交费') {
                  this.idArr.push(item.id);
                  this.personalItemIds.push(item);
                  this.receivable = this.accAdd(this.receivable, item.realPrice);
                  this.receivable = this.receivable.toFixed(2);
                }
              }
            });
            // console.log('idArr', this.idArr);
            //
          } else {
            // this.totalPrice = 0;
            // this.receivable = 0;
            // this.tableData = [];
            // this.personalItemIds = [];
            // this.idArr = [];
            this.clear();
            this.$Message.error('未查找到流水号');
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$Message.error(err.message);
        });
    },

    edit (row) {
      console.log(this.personalItemIds);
      if (this.personalItemIds.length == 0) {
        this.$Message.warning('没有未缴费的项目');
        return;
      }

      this.editModalVisible = true;
      this.modalTitle = 1;
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      this.invoiceInfo = {
        // totalAmount: this.totalPrice, // 总金额
        billNumber: this.curBillNum, // 发票号
        // price: this.receivable, // 应收
        list: this.personalItemIds,
        registerCode: this.registerCode, //this.registerCode // 流水号？ 扫码区域的值
      };
      let params = Object.assign({}, this.invoiceInfo);
      console.log('params', params);
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params);
      });
    },

    // 清空
    clear () {
      this.form = {
        // 体检人员信息
        name: '',
        age: '',
        sex: '',
        peId: '',
      };
      this.tableData = [];
      this.childrenList = [];
      this.registerCode = '';
      this.personalItemIds = [];
      this.idArr = [];
      this.receivable = 0; // 应收金额
      this.totalPrice = 0;
      this.$refs.registerCodeInput.focus();
      // 重新获取最新的发票号
      this.getinvoiceAndReceipt();
    },

    // 选中check
    selectChangeEvent ({ records }) {
      console.log('点击复选', records);
      // 筛选出所有的子选项，records是父级和子级都在同一级
      this.personalItemIds = [];
      this.receivable = 0;
      let childrenList = records.filter((item) => !item.children);
      childrenList.forEach((item) => {
        if (item.billStatus == '未交费') {
          this.personalItemIds.push({ id: item.id });
          this.receivable = this.accAdd(this.receivable, item.realPrice);
        }
      });

      this.receivable = this.receivable.toFixed(2);
      console.log(this.personalItemIds);
    },

    // 两个浮点数求和
    accAdd (num1, num2) {
      var r1, r2, m;
      try {
        r1 = num1.toString().split('.')[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = num2.toString().split('.')[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      // return (num1*m+num2*m)/m;
      return Math.round(num1 * m + num2 * m) / m;
    },
    // 重置
    resetHandle () {
      this.form = {
        source: '',
      };
      let curDate = moment().format('YYYY-MM-DD');
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'startDate', curDate);
      this.$set(this.form, 'endDate', curDate);
      this.tableData = [];
    },
  },
};
</script>
<style lang="less">
.new-person-balance-wrapper {
  width: 100%;
  min-width: 1300px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
  }
  .title-right-tool {
    display: flex;
    align-items: center;
    border: 2px dotted #2d8cf0;
    border-radius: 5px;
    padding: 5px 10px;
    span {
      color: #2d8cf0;
      font-size: 16px;
      font-weight: bold;
    }
    .ivu-input {
      font-size: 16px;
      font-weight: bold;
      color: #252525;
    }
  }
  .title {
    padding-left: 8px;
    position: relative;
    font-weight: bold;
    &::after {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .screen-info-wrapper {
    padding-bottom: 15px;
    .code-search-input {
      display: flex;
      align-items: center;
      min-width: 180px;
      flex-shrink: 0;
    }
    .screen-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ivu-form-item {
        margin-bottom: 0px !important;
      }
    }
  }
  .table-wrapper {
    .search-info {
      line-height: 1.8;
      font-weight: bold;
      color: #252525;
      margin-bottom: 10px;
      span {
        color: #40a9ff;
      }
    }
  }
  .page-footer {
    display: block;
    height: auto;
    padding: 0 20px;
    position: relative;
    margin: 0;
    bottom: 0;
    .total-amount-wrapper {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 16px;
      padding: 20px 0;
      border-bottom: 1px solid #e5e5e5;
      span {
        color: #ed4014;
        font-weight: bold;
      }
      .total {
        margin-right: 10px;
      }
    }
    .handle-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bill-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      .ivu-input {
        font-size: 16px;
        font-weight: bold;
        color: #252525;
      }
    }
  }
  .table-row {
    color: #252525;
  }
  .table-footer-row {
    font-weight: bold;
    color: #252525;
  }
  .page-body {
    padding-bottom: 0px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-btn-error[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
}
</style>
