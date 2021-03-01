<template>
  <div class="exam-refund-wrapper">
    <div class="left-sidebar-wrapper">
      <Card style="width: 100%">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">体检退费</span>
        </div>
        <div class="page-body">
          <!-- <tree-table :loading="loadStatus"
                      ref="treeTable"
                      :columns="columns"
                      :data="treeData"
                      :expand-type="false"
                      :is-fold="false"
                      :selectable="false"
                      :empty-text="emptyText"
                      border
                      expand-key="name"></tree-table> -->
          <Table :columns="columns"
                 :data="tableData"
                 :height="screenHeight - 280"
                 border
                 highlight-row
                 @on-current-change="getCurrentInvoice"
                 :loading="isLoading">
            <template slot="isCompleted"
                      slot-scope="{row}">
              <span v-if="row.isCompleted == 0">未完成</span>
              <span v-else-if="row.isCompleted == 1">完成</span>
              <span v-else-if="row.isCompleted == 2">拒检</span>
              <span v-else>延期</span>
            </template>
            <template slot="amount"
                      slot-scope="{row}">
              <span>{{row.amount | amountFormat}}</span>
            </template>
            <template slot="realAmount"
                      slot-scope="{row}">
              <span>{{row.realAmount | amountFormat}}</span>
            </template>
            <template slot="settleDate"
                      slot-scope="{row}">
              <span>{{row.settleDate | dateformat}}</span>
            </template>
            <template slot="action"
                      slot-scope="{row}">

              <Button type="error"
                      style="margin-left: 8px;"
                      v-permission="['del']"
                      size="small">删除</Button>
            </template>
          </Table>
        </div>
        <!-- <div class="page-footer">
          <div class="money-total">
            总计：
            <span>{{ treeData.length }}</span>项，合计
            <strong>{{ totalAccount }}</strong>元
          </div>
        </div> -->
      </Card>
    </div>
    <div class="right-sidebar-wrapper">
      <Card style="width: 350px">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">患者信息</span>
        </div>
        <div class="item-wrapper">
          <Form style="min-height: 350px"
                :model="dataForm"
                :label-width="70"
                ref="accountFrom"
                label-position="right">
            <div class="form-pic-wrapper">
              <div class="pic-wrapper">
                <img v-if="dataForm.boPic"
                     :src="dataForm.boPic"
                     alt="患者头像">
                <img v-else
                     src="@/assets/images/userPhoto.png"
                     alt="患者头像">
              </div>
              <div class="patient-info">
                <FormItem label="流水号">
                  <Input v-model="dataForm.boRegisterCode"
                         @on-enter="getInfoByRegisterCode(dataForm.boRegisterCode)"
                         size="small"></Input>
                </FormItem>
                <FormItem label="姓名">
                  <Input disabled
                         v-model="dataForm.boName"
                         size="small"></Input>
                </FormItem>
                <FormItem label="体检号">
                  <Input disabled
                         v-model="dataForm.boPeId"
                         size="small"></Input>
                </FormItem>
                <FormItem label="体检次数">
                  <Input disabled
                         v-model="dataForm.boVisitSn"
                         size="small"></Input>
                </FormItem>
              </div>
            </div>
            <FormItem label="体检单位">
              <Input disabled
                     v-model="dataForm.unitName"
                     size="small"></Input>
            </FormItem>
            <FormItem label="单位分组">
              <Input disabled
                     v-model="dataForm.groupingName"
                     size="small"></Input>
            </FormItem>
          </Form>
          <div class="refund-info-wrapper">
            <div class="refund-main">
              <div class="refund-bill-info">
                <label for="billNumber">发票号：</label>
                <Input disabled
                       v-model="dataForm.invoiceNo"
                       size="small"></Input>
                <!-- <Button type="error"
                        style="margin-left: 8px;"
                        size="small">作废发票</Button> -->
              </div>
              <div class="is-print-bill">
                <!-- <Checkbox v-model="isDelBill">同时作废发票</Checkbox> -->
              </div>
              <ul class="count-detail">
                <li>
                  <span class="item-name">应收金额总计：</span>
                  <span class="count">&yen;{{dataForm.ying | amountFormat}}</span>
                </li>
                <li>
                  <span class="item-name">实收金额总计：</span>
                  <span class="count">&yen;{{dataForm.shi | amountFormat}}</span>
                </li>
                <li>
                  <span class="item-name">可退金额总计：</span>
                  <span class="count">&yen;{{dataForm.newPrice | amountFormat}}</span>
                </li>
                <li>
                  <span class="item-name">实际退费：</span>
                  <span class="count count-red">&yen;{{dataForm.newPrice | amountFormat}}</span>
                </li>
              </ul>
              <div class="handle-wrapper">

                <Button type="error"
                        style="width: 100%;margin-top: 20px;margin-bottom:10px;min-height:30px"
                        @click="refundHandle"
                        :disabled="!dataForm.newPrice || dataForm.newPrice == 0"
                        size="small">退费</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <info :visible="searchVisible"
          ref="InfoSearch"
          @func="getBasicInfo"
          @close="searchVisible = false">
    </info>
  </div>
</template>
<script>
import Info from '../components/search';
import { backFeeMsg, backFeeSave } from '@/api/examRefund.js'
import { patientVisitPic } from '@/api/record_result'
import moment from 'moment'

export default {
  name: 'examRefund',
  components: {
    Info
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      columns: [
        // {
        //   width: 55,
        //   type: 'selection',
        //   align: 'center'
        // },
        {
          title: '序号',
          type: 'index',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '发票号',
          key: 'invoiceNo',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'data',
          minWidth: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'subCol'
              },
            }, [
                h('ul', this.tableData[params.index].data.map(item => {
                  return h('li', {
                    attrs: {
                      title: item.comboName
                    }
                  }, item.comboName)
                  // return h('Poptip', {
                  //   props: {
                  //     content: item.comboName,
                  //     wordWrap: true,
                  //     width: '200',
                  //     trigger: 'hover'
                  //   }
                  // }, [
                  //     h('li', {
                  //       attrs: {
                  //         title: item.comboName
                  //       }
                  //     }, item.comboName)
                  //   ])
                }))
              ]);
          }
        },
        {
          title: '是否自费',
          key: 'data',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'subCol'
              },
            }, [
                h('ul', this.tableData[params.index].data.map(item => {
                  var param = (item.isOwnExpense == '1' ? '是' : '否')
                  return h('li', {
                  }, param)
                }))
              ]);
          }
        },
        {
          title: '项目状态',
          key: 'data',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'subCol'
              },
            }, [
                h('ul', this.tableData[params.index].data.map(item => {
                  var param = item.isCompleted
                  if (param == 0) {
                    return h('li', {
                    }, '未完成')
                  } else if (param == 1) {
                    return h('li', {
                    }, '完成')
                  } else if (param == 2) {
                    return h('li', {
                    }, '拒检')
                  } else {
                    return h('li', {
                    }, '延期')
                  }

                }))
              ]);
          }
        },
        {
          title: '支付方式',
          key: 'data',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'subCol'
              },
            }, [
                h('ul', this.tableData[params.index].data.map(item => {
                  return h('li', {
                  }, item.paymentType)
                }))
              ]);
          }
        },
        {
          title: '结算时间',
          key: 'data',
          minWidth: 170,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'subCol'
              },
            }, [
                h('ul', this.tableData[params.index].data.map(item => {
                  if (item.settleDate === null || item.settleDate == '') {
                    return h('li', {
                    }, '')
                  } else {
                    var date = moment(item.settleDate).format('YYYY-MM-DD HH:mm:ss')
                    return h('li', {
                    }, date)
                  }

                }))
              ]);
          }
        },
        {
          title: '应收金额（元）',
          key: 'data',
          minWidth: 140,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'subCol'
              },
            }, [
                h('ul', this.tableData[params.index].data.map(item => {
                  var money = this.moneyFormat(item.amount)
                  return h('li', {
                  }, money)
                }))
              ]);
          }
        },
        {
          title: '实收金额（元）',
          key: 'data',
          minWidth: 140,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'subCol'
              },
            }, [
                h('ul', this.tableData[params.index].data.map(item => {
                  var money = this.moneyFormat(item.realAmount)
                  return h('li', {
                  }, money)
                }))
              ]);
          }
        },

      ],
      tableData: [],
      dataForm: {
        ying: 0,
        shi: 0,
        newPrice: 0
      },
      isLoading: false,
      isDelBill: true,
      searchVisible: false,
    }
  },
  filters: {
    amountFormat (num) {
      let result = parseFloat(num)
      if (isNaN(result)) {
        return num;
      }
      result = Math.round(num * 100) / 100;
      let s = result.toString();
      let rs = s.indexOf('.');
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + 2) {
        s += '0';
      }
      return s;
    }
  },
  watch: {
    screenHeight (val) {
      if (!this.timer) {
        this.screenHeight = val
        this.timer = true
        let that = this
        setTimeout(() => {
          that.timer = false
        }, 300);
      }
    }
  },
  mounted () {
    // 动态计算可视窗口高度
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
  },
  methods: {
    getBasicInfo (data) {
      console.log(data)
      this.dataForm = data.basicInfo
      this.$set(this.dataForm, 'ying', 0)
      this.$set(this.dataForm, 'shi', 0)
      this.$set(this.dataForm, 'newPrice', 0)
      let num = ''
      let result = data.basicInfo
      if (result && result.boRegisterCode) {
        num = result.boRegisterCode
      }
      this.getInfoByRegisterCode(num)
      if (result) {
        this.getPatientPic(result.boPeId, result.boVisitSn)
      }
    },
    // 根据流水号获取退费人员信息
    getInfoByRegisterCode (num) {
      let params;
      if (num) {
        params = {
          boRegisterCode: num
        }
      } else {
        params = {
          boRegisterCode: this.registerCode
        }
      }
      backFeeMsg(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.tableData = result
          // this.dataForm.invoiceNo = result.invoiceNo || ''
          // this.dataForm.newPrice = result.newPrice || 0
          // this.dataForm.shi = result.shi || 0
          // this.dataForm.ying = result.ying || 0
          console.log(this.tableData)
        }
      })
    },
    // 获取病人照片
    getPatientPic (id, visitSn) {
      let params = {
        peId: id,
        visitSn: visitSn
      }
      patientVisitPic(params).then(({ data }) => {
        if (data.code == 0) {
          let picSrc = data.data[0].pic
          if (picSrc && picSrc != '') {
            let picurl = this.$url + picSrc
            this.$set(this.dataForm, 'boPic', picurl)
          }
        }
      }).catch(err => {
        return false
      })
    },

    getCurrentInvoice (currentRow) {
      let data = currentRow
      if (data && Object.keys(data).length > 0) {
        console.log(data)
        this.$set(this.dataForm, 'ying', data.ying)
        this.$set(this.dataForm, 'shi', data.shi)
        this.$set(this.dataForm, 'newPrice', data.shi)
        this.$set(this.dataForm, 'invoiceNo', data.invoiceNo)
      }
    },
    // 退费操作
    refundHandle () {
      if (this.tableData.length == 0) {
        this.$Message.error('没有退费项目！')
        return false
      }
      let params = {
        boInvoiceNo: this.dataForm.invoiceNo,
        boIsVoid: '0',
        boMoney: this.dataForm.newPrice,
        boPayType: this.tableData[0].paymentType,
        boRegisterCode: this.dataForm.boRegisterCode
      }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>您正在进行退费操作，是否确认退费？</p>',
        onOk: () => {
          backFeeSave(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success('退费成功！')
              this.$set(this.dataForm, 'ying', 0)
              this.$set(this.dataForm, 'shi', 0)
              this.$set(this.dataForm, 'newPrice', 0)
              this.$set(this.dataForm, 'invoiceNo', '')
              let num = this.dataForm.boRegisterCode
              this.getInfoByRegisterCode(num)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            console.log(err)
            this.$Message.error('网络不稳定，请稍后重试')
          })
          return false
        },
        onCancel: () => {
          return false
        }
      });
    },
    moneyFormat (num) {
      let result = parseFloat(num)
      if (isNaN(result)) {
        return num;
      }
      result = Math.round(num * 100) / 100;
      let s = result.toString();
      let rs = s.indexOf('.');
      if (rs < 0) {
        rs = s.length;
        s += '.';
      }
      while (s.length <= rs + 2) {
        s += '0';
      }
      return s;
    }
  },
}
</script>
<style lang="less">
.exam-refund-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-form-item {
    margin-bottom: 4px;
  }
  .page-footer {
    justify-content: flex-end;
    padding-right: 20px;
  }
  .left-sidebar-wrapper {
    flex: 1;
    max-width: 1300px;
    min-width: 900px;
    height: inherit;
    min-height: calc(~'100% - 80px');
    display: flex;
  }
  .base-msg-wrapper {
    margin-bottom: 10px;
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
  .input_red {
    .ivu-input-small {
      color: red;
      font-weight: bolder;
    }
  }
  .ivu-input[disabled] {
    color: #333;
  }
  .right-sidebar-wrapper {
    height: inherit;
    min-height: calc(~'100% - 80px');
    display: flex;
    min-width: 350px;
    margin-left: 10px;
    .ivu-card-body {
      height: calc(~'100% - 43px');
    }
    .item-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 100%;
    }
    .form-pic-wrapper {
      display: flex;
    }
    .pic-wrapper {
      width: 100px;
      height: 127px;
      display: inline-block;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .patient-info {
      flex: 1;
    }
    .refund-bill-info {
      display: flex;
      align-items: center;
      label {
        width: 100px;
        padding-right: 5px;
        text-align: right;
      }
    }
    .is-print-bill {
      padding-top: 10px;
      padding-bottom: 5px;
    }
    .count-detail {
      width: 100%;
      li {
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .item-name {
        font-size: 14px;
      }
      .count {
        font-size: 14px;
        font-weight: bold;
      }
      .count-red {
        font-size: 16px;
        color: #ed4014;
      }
    }
  }
  .ivu-table-cell {
    padding: 0;
  }
  .subCol {
    width: 100%;
    ul {
      width: 100%;
    }
    .ivu-poptip {
      width: 100%;
    }
    .ivu-poptip-rel {
      width: 100%;
    }
  }
  .subCol > ul li {
    list-style: none;
    text-align: center;
    padding: 9px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    border-bottom: 1px solid #ccc;
    overflow-x: hidden;
  }
  .subCol > ul > li:last-child {
    border-bottom: none;
  }
  .handle-wrapper {
    margin-top: 15px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-btn-error[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
}
</style>