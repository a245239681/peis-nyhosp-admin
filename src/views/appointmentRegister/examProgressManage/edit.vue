<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable='false'
           @on-cancel="closeModal"
           title="客户信息"
           class="exam-ProgressManage-edit">
      <div class="modal-body"
           style='width:615px;margin:0 auto'>
        <img v-if="picture==$url"
             src="@/assets/images/userPhoto.png"
             alt=""
             style="display:inline-block;width:130px;height:170px;boder:1px solid black">
        <img v-if="picture!=$url"
             :src="picture"
             alt=""
             style="display:inline-block;width:130px;height:170px;boder:1px solid black">
        <Form :model="singleData"
              style="width:485px"
              :label-width="68"
              ref="form"
              inline
              label-position="right">
          <FormItem label="体检号"
                    prop='boPeId'>
            <Input v-model="singleData.boPeId"
                   style='width:150px'
                   size="small"></Input>
          </FormItem>
          <FormItem label="流水号"
                    :label-width="80"
                    prop="boRegisterCode">
            <Input v-model="singleData.boRegisterCode"
                   size="small"
                   style='width:140px'></Input>
          </FormItem>
          <FormItem label="姓名">
            <Input v-model="singleData.medicalName"
                   style='width:150px'
                   size="small"></Input>
          </FormItem>
          <FormItem label="体检状态"
                    :label-width="80">
            <Tag v-if="singleData.boPatientVisitStatus=='0'"
                 color="red">未检</Tag>
            <Tag v-if="singleData.boPatientVisitStatus=='1'"
                 color="blue">在检</Tag>
            <Tag v-if="singleData.boPatientVisitStatus=='3'"
                 color="orange">待主检</Tag>
            <Tag v-if="singleData.boPatientVisitStatus=='2' || singleData.boPatientVisitStatus=='7'"
                 color="purple">待总检</Tag>
            <Tag v-if="singleData.boPatientVisitStatus=='9'"
                 color="green">已总检</Tag>
            <Tag v-if="singleData.boPatientVisitStatus=='10'"
                 color="cyan">已打印</Tag>
            <Tag v-if="singleData.boPatientVisitStatus=='11'"
                 color="magenta">已装订</Tag>
            <Tag v-if="singleData.boPatientVisitStatus=='12'"
                 color="gray">已领取</Tag>
            <!-- <Tag v-if="singleData.boResultStatus=='未检'"
                 color="red">{{ singleData.boResultStatus }}</Tag>
            <Tag v-if="singleData.boResultStatus=='在检'"
                 color="blue">{{ singleData.boResultStatus }}</Tag>
            <Tag v-if="singleData.boResultStatus=='待主检'"
                 color="orange">{{ singleData.boResultStatus }}</Tag>
            <Tag v-if="singleData.boResultStatus=='待总检'"
                 color="purple">{{ singleData.boResultStatus }}</Tag>
            <Tag v-if="singleData.boResultStatus=='已总检'"
                 color="green">{{ singleData.boResultStatus }}</Tag>
            <Tag v-if="singleData.boResultStatus=='已打印'"
                 color="cyan">{{ singleData.boResultStatus }}</Tag> -->
          </FormItem>
          <FormItem label="证件号">
            <Input v-model="singleData.idNo"
                   style="width:270px"
                   size="small"></Input>
          </FormItem>
          <FormItem label="性别"
                    :label-width="50">
            <Input v-model="singleData.sex"
                   style="width:50px"
                   size="small"></Input>
          </FormItem>
          <FormItem label="单位">
            <Input v-model="singleData.unitName"
                   style="width:370px"
                   size="small"></Input>
          </FormItem>
          <FormItem label="分组">
            <Input v-model="singleData.groupingName"
                   style='width:150px'
                   size="small"></Input>
          </FormItem>
          <FormItem label="手机号">
            <Input v-model="singleData.mobile"
                   style='width:150px'
                   size="small"></Input>
          </FormItem>
        </Form>
      </div>
      <div style="margin-top:20px;height:513px;overflow:hidden">
        <Row style="background:#d6eaff;">
          <Col style="padding:10px 0;text-align:center;font-size:16px;font-weight:bolder;"
               span="4">状态</Col>
          <Col style="padding:10px 0;text-align:center;font-size:16px;font-weight:bolder"
               span="20">组合名称</Col>
        </Row>
        <Spin v-if="spinShow"
              class="demo-spin-container"
              fix></Spin>
        <div v-if="!spinShow"
             class="row">
          <span class="combo"
                v-for="(item,index) in comboList"
                :key="index">
            <div :class="[length>12?'combo_son':'combo_son2']">
              <Tag v-if="item.comboStatus==0"
                   color="blue">未检</Tag>
              <Tag v-if="item.comboStatus==1"
                   color="green">已检</Tag>
              <Tag v-if="item.comboStatus==2"
                   color="red">拒检</Tag>
              <Tag v-if="item.comboStatus==3"
                   color="orange">延期</Tag>
              <Tag v-if="item.comboStatus==4"
                   color="cyan">等待报告</Tag>
            </div>
            <div class="combo_include">
              <Menu theme="light"
                    width="auto">
                <Submenu :name="index">
                  <template slot="title">
                    {{item.comboName}}
                  </template>
                  <MenuItem v-for="(res,resIndex) of item.itemList"
                            :key="resIndex"
                            :name="resIndex"><span :class="{'red':res.itemStatus==1}">{{res.itemName}}</span></MenuItem>
                </Submenu>
              </Menu>
            </div>
          </span>

        </div>
      </div>
      <div slot="footer">
        <div class="footer-wrapper">
          <div>套餐:
            <span style="font-size:14px;font-weight:bolder"> {{singleData.boPackageName}}</span>
            <span style="margin-left:10px;">体检费用：<strong style="color:#ed4014;font-size:16px;">¥{{packagePrice}}</strong></span>
          </div>
          <div class="handle">
            <Button type="primary"
                    @click="showHandleLog"
                    :loading="handleLogLoading">进度查询</Button>
            <Button @click="closeModal">关闭</Button>
          </div>
        </div>

      </div>
    </Modal>
    <handle-log :visible="handleLogModalVisible"
                ref="handleLog"
                @close="handleLogModalVisible = false"></handle-log>
  </div>
</template>

<script>
import HandleLog from './handleLog'
import { save, sortByDeptId } from '@/api/singleItemMannage.js'
import {
  getPicture,
  getComboAndItem,
  handleLogList
} from "@/api/examProgressManage.js";
import { debuglog } from 'util';

export default {
  props: {
    title: Number,
    visible: Boolean,
    singleData: Object,
  },
  data () {
    return {
      isLoading: false,
      spinShow: false,
      columns: [
        { title: '状态', align: 'center', key: 'boResultStatus', width: 110 },
        { title: '组合名称', align: 'center', key: 'boCategory', }
      ],
      tableData: [],
      comboStatusName: '',
      tagColorName: '',
      picture: '',
      comboList: [],
      length: '',
      handleLogModalVisible: false,
      handleLogLoading: false
    }
  },
  components: {
    HandleLog
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {
      }
    },
    packagePrice: {
      get: function () {
        let total = 0;
        this.comboList.forEach(ele => {
          if (ele.realAmount) {
            total = this.accAdd(ele.realAmount, total)
          }
        });
        return total
      },
      set: function () {
      }
    }
  },
  methods: {
    getCombo (row) {
      this.spinShow = true
      getComboAndItem({ boId: row.boId }).then(({ data }) => {
        this.spinShow = false
        if (data.code == 0) {
          this.comboList = data.data
          this.length = this.comboList.length
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.spinShow = false
        this.$Message.error('网络不稳定,请稍后重试')
      })
      getPicture({ peId: row.boPeId, visitSn: row.boVisitSn }).then(({ data }) => {
        if (data.code == 0) {
          this.picture = this.$url + data.data[0].pic
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('网络不稳定,请稍后重试')
      })
    },
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.comboList = []
      this.picture = ''
      this.$emit('close');
    },

    // 显示操作记录
    showHandleLog () {
      if (this.handleLogLoading) return false
      const { boPeId, boRegisterCode } = this.singleData
      const params = { boPeId, boRegisterCode }

      this.handleLogLoading = true
      handleLogList(params).then(({ data }) => {
        this.handleLogLoading = false
        if (data.code === 0) {
          this.handleLogModalVisible = true
          this.$refs.handleLog.getTimeList(data.data)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.handleLogLoading = false
        this.$Message.error(err.message)
      })

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
  }
}
</script>

<style lang="less">
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
.exam-ProgressManage-edit {
  /deep/.ivu-modal {
    width: 620px !important;
  }
  /deep/.ivu-form-item {
    margin: 0;
  }
  .red {
    color: red;
  }
  .row {
    overflow: auto;
    height: 513px;
    padding-bottom: 45px !important;
    // .ivu-col {
    //   padding-bottom: 45px !important;
    // }
  }
  .row2 {
    overflow: hidden;
    height: 513px;
    .ivu-col {
      padding-bottom: 45px;
    }
  }
  .demo-spin-container {
    display: inline-block;
    width: 600px;
    height: 450px;
    position: relative;
    border: 1px solid #eeeff3;
  }
  .combo {
    display: flex;
    border: 1px solid #eeeff3;
    border-top: 0px solid White;
    .combo_son {
      padding: 5px 0;
      width: 106px;
      text-align: center;
      border: 1px solid #eeeff3;
      border-top: 0px solid White;
      border-bottom: 1px solid White;
      border-left: 1px solid White;
    }
    .combo_son2 {
      padding: 5px 0;
      width: 102px;
      text-align: center;
      border: 1px solid #eeeff3;
      border-top: 0px solid White;
      border-bottom: 1px solid White;
      border-left: 1px solid White;
    }
    .combo_include {
      width: 513px;
      line-height: 25px;
      font-size: 14px;
      font-weight: bolder;
      .ivu-menu-item {
        font-weight: normal;
        padding: 5px 24px;
      }
      .ivu-menu-submenu-title {
        color: #464444;
        padding: 0 24px;
        height: 38px;
        line-height: 38px;
      }
    }
  }
  .footer-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ivu-menu-light.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: white;
  }
  .ivu-menu-vertical .ivu-menu-item:hover,
  .ivu-menu-vertical .ivu-menu-submenu-title:hover {
    color: none;
  }
  .ivu-menu-vertical.ivu-menu-light:after {
    content: none;
  }
  .ivu-menu-item {
    border-top: 1px solid #eeeff3;
    height: 100%;
  }
  .ivu-menu-light.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    content: none;
  }
}
</style>
<style lang='less' scoped>
.modal-body {
  width: 370px;
  margin: 0 auto;
  display: flex;
}
</style>


