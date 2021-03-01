<template>
  <div class="network-register-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">网络预约 - 人员登记</span>
      </div>
      <div class="page-body clearfix">
       <div class="personaInfo-wrapper">
        <Form ref="patientInfoForm"
          :model="patientInfoForm"
          label-position="right"
          :rules="ruleValidate"
          :show-message="false"
          :label-width="80"
          autocomplete="on">
          <div class="top-wrapper">
            <div class="photo">
              <img :src="patientInfoForm.boPic"
                   v-if="!!patientInfoForm.boPic"
                   alt="登记用户头像">
              <img src="@/assets/images/userPhoto.png"
                   v-else
                   alt="登记用户头像">
              <div class="btns"
                   style="margin-top: 10px;">
                <Button type="primary"
                    @click="openCaptureModal">拍照采集</Button>
              </div>
            </div>
            <div class="form">
              <Row :gutter="8">
                <Col span="5">
                  <FormItem label="姓名"
                            prop="boName">
                    <Input v-model="patientInfoForm.boName"
                          @on-search="openSearchPerson"
                          search
                          size="small"
                          clearable />
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem label="证件类型"
                            prop="boCertificatesType">
                    <Select v-model="patientInfoForm.boCertificatesType"
                            size="small"
                            @on-change="changeCert">
                      <Option value="1">身份证</Option>
                      <Option value="2">士兵证</Option>
                      <Option value="3">军官证</Option>
                      <Option value="4">警官证</Option>
                      <Option value="5">护照</Option>
                      <Option value="6">其他</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="证件号码"
                            prop="boIdNo"
                            :label-width="80">
                    <Input v-model.lazy="patientInfoForm.boIdNo"
                          @on-enter="getAgeAndBirthday"
                          @on-blur="AgeAndBirthday"
                          search
                          clearable
                          size="small" />
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="就诊卡号"
                          prop="boVisitCardNumber">
                    <Input v-model="patientInfoForm.boVisitCardNumber"
                          @on-enter="getInfoByVisitCard"
                          size="small" />
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="8">
                <Col span="5">
                  <FormItem label="出生日期"
                            prop="boBirthday">
                    <DatePicker type="date"
                                placeholder="选择出生日期"
                                clearable
                                size="small"
                                style="width: 100%;"
                                v-model="patientInfoForm.boBirthday"
                                @on-change="changeBirthday"
                                @on-clear="clearBirthday"
                                :options="birth"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="8">
                  <Row :gutter="8">
                    <Col span="14">
                    <FormItem label="性别"
                              :label-width="60"
                              prop="boSex">
                      <Select v-model="patientInfoForm.boSex"
                              size="small">
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                      </Select>
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="年龄"
                              :label-width="45"
                              prop="boAge">
                      <Input v-model="patientInfoForm.boAge"
                            size="small"
                            disabled />
                    </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col span="6">
                  <FormItem label="联系方式"
                            prop="boMobile">
                    <Input v-model="patientInfoForm.boMobile"
                          size="small"
                          clearable />
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem label="费别"
                            :label-width="60"
                            prop="boChargeTypeId">
                  <Select v-model="patientInfoForm.boChargeTypeId"
                          :label-in-value="true"
                          @on-change="changeChargeType"
                          size="small">
                    <Option v-for="item in chargeTypeList"
                            :value="item.cdId"
                            :key="item.cdId">{{ item.cdName }}</Option>
                  </Select>
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="8">
                <Col span="4">
                  <FormItem label="体检次数"
                            prop="boVisitSn">
                    <Input v-model="patientInfoForm.boVisitSn"
                          disabled
                          size="small" />
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="体检号"
                            :label-width="65"
                            prop="boPeId">
                    <Input v-model="patientInfoForm.boPeId"
                          disabled
                          size="small" />
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="预约日期"
                            prop="boBookingDate">
                    <Input v-model="patientInfoForm.boBookingDate"
                          disabled
                          size="small" />
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="已选套餐"
                            prop="boPackageName">
                    <Input v-model="patientInfoForm.boPackageName"
                          disabled
                          size="small" />
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="8">
                 <Col span="6">
                  <FormItem label="体检优先级"
                            prop="boPriorityId"
                            :label-width="90">
                    <Select v-model="patientInfoForm.boPriorityId"
                            :label-in-value="true"
                            @on-change="changePriority"
                            filterable
                            size="small">
                      <Option v-for="item in priorityList"
                              :value="item.cdId"
                              :key="item.cdId">{{item.cdName}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="体检类型"
                            prop="boCategoryId"
                            :label-width="90">
                    <Select v-model="patientInfoForm.boCategoryId"
                            size="small"
                            @on-change="changeCategory"
                            :label-in-value="true">
                      <Option v-for="item in categoryList"
                              :value="item.cdId"
                              :key="item.cdId">{{item.cdName}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="人员来源"
                            prop="boSourceId">
                    <Select v-model="patientInfoForm.boSourceId"
                            size="small"
                            @on-change="changeSource"
                            :label-in-value="true">
                      <Option v-for="item in sourceList"
                              :value="item.cdId"
                              :key="item.cdId">{{item.cdName}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="婚姻状态"
                            prop="boMaritalStatus">
                    <Select v-model="patientInfoForm.boMaritalStatus"
                            size="small">
                      <Option value="不详">不详</Option>
                      <Option value="未婚">未婚</Option>
                      <Option value="已婚">已婚</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="8">
                <Col span="10">
                  <FormItem label="详细地址"
                            prop="boAddress">
                    <Input v-model="patientInfoForm.boAddress"
                          size="small"
                          clearable />
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem label="保存自动清空" :label-width="120">
                    <i-switch v-model="isAutoClear"
                              size="large"
                              @on-change="changeAutoClear">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem label="空白标签个数"
                            v-permission="['print']"
                            prop="labelNum"
                            :label-width="100">
                    <Select v-model="patientInfoForm.labelNum"
                            size="small"
                            clearable>
                      <Option v-for="item in labelNumList"
                              :value="item"
                              :key="item">{{item}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem class="settlement-sel-group"
                            v-permission="['print']"
                            prop="selGroup">
                    <CheckboxGroup v-model="patientInfoForm.selGroup">
                      <!-- <Checkbox label="createRequestNote"
                                    disabled>打印申请单</Checkbox> -->
                      <Checkbox label="printGuide">打印指引单</Checkbox>
                      <Checkbox label="printSampleCode">打印样本条码</Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
       </div>
       <div class="project-wrapper">
        <div class="title-bar">
          <span class="title">已选项目</span>
          <!-- <Button type="default"
                  @click="clearPickProjects"
                  size="small">清空项目</Button> -->
        </div>
        <tree-table ref="netRegisterTreeTable"
                    :key="4"
                    :columns="pickProjectsCols"
                    :data="pickProjectsTableData"
                    :expand-type="false"
                    :is-fold="false"
                    :selectable="false"
                    :show-row-hover="true"
                    :empty-text="emptyText"
                    :row-class-name="addItemColor"
                    expand-key="paName"
                    border>
            <template slot="isAddItem"
                    slot-scope="{row}">
            <Tag color="green"
                 v-if="row.isAddItem == 0">套餐</Tag>
            <Tag color="orange"
                 v-else-if="row.isAddItem == 1">加做</Tag>
            <Tag color="magenta"
                 v-else-if="row.isAddItem == 2">自选</Tag>
          </template>
          <template slot="paName"
                    align="center"
                    slot-scope="{row}">
            <span>{{row.paName}}</span>
          </template>
          <template slot="paPrice"
                    slot-scope="{row}">
            <span>{{row.paPrice}}</span>
          </template>
          <template slot="paDeptName"
                    slot-scope="{row}">
            <span>{{row.paDeptName}}</span>
          </template>
        </tree-table>
       </div>
      </div>
      <div class="page-footer">
        <p style="float: right; margin-right: 30px; font-size: 16px;">
          总金额：
          <span style="font-size: 26px; color: #e51c23; padding-right:10px;">{{patientInfoForm.boPackagePrice || 0}}</span>元
        </p>
        <p style="float: right; margin-right: 30px; font-size: 16px;">
          已缴费：
          <span style="font-size: 26px; color: #e51c23; padding-right:10px;">{{patientInfoForm.boPackagePrice || 0}}</span>元
        </p>
        <Button id='readIDCard'
                type="primary"
                style="margin-right: 10px;float: right;"
                @click="readIdCard">扫描证件</Button>
        <Button type="error"
                style="margin-right: 10px;float: right;"
                @click="handleReset('patientInfoForm')">清空</Button>
        <Button type="primary"
                style="margin-right: 30px;float: right;"
                @click="handleSubmit('patientInfoForm')"
                :loading="isLoading"
                v-permission="['add']">确认登记</Button>
      </div>
      <search-person :visible="personModalVisible"
                    :boname="boName"
                    :tableData="personTableData"
                    :isLoading="searchPersonLoading"
                    :totalItems="personTotalSize"
                    @searchName="searchName"
                    @importPerson="importPersonalRecord"
                    @close="closePerson"></search-person>
      <capture :visible="captureModalVisible"
              v-if="hackReset"
              @cancel="closeCaptureModal"
              @ok="importPic"></capture>
    </Card>
  </div>
</template>
<script>
import moment from 'moment'
import SearchPerson from '@/views/appointmentRegister/components/searchPerson'
import Capture from '@/views/appointmentRegister/components/capture'
import { 
  getSelectionList, 
  validate, 
  commonFunc, 
  selectUnit, 
  selectProject 
} from '@/views/appointmentRegister/components/mixins/bookRegister.js'
import {
  getComboByPackage,
  getMasterIndexByNameAndIdNo,
  save,
  printBarcode,
  printGuide,
  printDetail
} from '@/api/personal_register.js';
import { getBirthAndAge } from "@/libs/tools.js";
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import { setAutoClearStorage, getAutoClearStorage } from '@/libs/util'
import { getPrinterConfigFromLocalstorage } from '@/libs/util'
import { printFunc } from '@/libs/printOrder.js'
import { directPrintFunc } from '@/libs/directPrint.js'

export default {
  name: "networkRegister",
  mixins: [ getSelectionList, getSelectionList, validate, commonFunc ],
  components: {
    Capture,
    SearchPerson
  },
  data () {
    return {
      ruleValidate: {
        boIsUnit: [
          { required: true, message: '请选择个人/单位' }
        ]
      },
      birth: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000;
        }
      },
      labelNumList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      patientInfoForm: {
        boVisitSn: '1',
        boPeId: '',
        boName: '',
        boIdNo: '',
        boIsUnit: '0',
        boBirthday: '',
        boAge: '',
        boSex: '',
        boMobile: '',
        boSettleStatus: '0',
        boCertificatesType: '1',
        boChargeTypeId: '',
        labelNum: '3',
        selGroup: ['printGuide', 'printSampleCode'],
        boGroupId: '',
        boUnitId: '',
        boMaritalStatus: '',
        boCategoryId: ''
      },
      pickProjectsCols: [
        {
          type: 'template',
          title: '类型',
          key: 'isAddItem',
          template: 'isAddItem',
          minWidth: 80,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '所属科室',
          key: 'paDeptName',
          minWidth: 160,
          template: 'paDeptName',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '项目名称',
          key: 'paName',
          minWidth: 220,
          template: 'paName',
          align: 'left',
          headerAlign: 'center'
        },
        {
          title: '单价（元）',
          key: 'paPrice',
          template: 'paPrice',
          minWidth: 88,
          align: 'center',
          headerAlign: 'center'
        }
      ],
      pickProjects: [], // 未选项目多选值保存
      projects: [], // 多选框项目保存
      historyModalVisible: false,
      captureModalVisible: false,
      priceModalVisible: false,
      personModalVisible: false,
      isLoading: false,
      hackReset: false,
      paDeptId: 'all',
      isComboProject: '1',
      comboPages: 1,
      comboPageIndex: 1,
      comboPageSize: 40,
      // itemList: [],
      tempPick: [],
      tempPickLength: 0,
      totalItemNum: [],
      boName: '',
      boPic: '',  // 保存身份证照片
      printParams: {},
      fixPrice: false, //判断改价后显示改价价格
      groupAddItems: [], //单位分组加项保存
      groupPayType: '', //分组支付方式
      addPayType: '', //加项支付方式
      searchPersonLoading: false,
      personTableData: [],
      personTotalSize: 0
    }
  },
  created () {
    let setting = getAutoClearStorage()
    this.isAutoClear = setting.hasOwnProperty('isNetworkRegister') ? setting.isNetworkRegister : true
  },
  methods: {
    //高亮表格中的加项颜色
    addItemColor (row, index) {
      let r = this.pickProjectsTableData.filter((val, index) => {
        return val.isAddItem == 1  // 0 - 套餐， 1 - 加做，2 - 自选
      });
      if (r.length && index < r.length) {
        if (row.paTestTubeId !== null) {
          return 'demo-table-addItem-row testTube'
        } else {
          return 'demo-table-addItem-row';
        }
      } else {
        if (row.paTestTubeId !== null) {
          return 'demo-table-package-row testTube'
        } else {
          return 'demo-table-package-row';
        }
      }
      return '';
    },
    //开启摄像弹窗，由于capture组件未销毁，导致两个页面调用该组件时，只有其中一个能正常使用摄像功能，需要销毁组件重建
    openCaptureModal () {
      this.captureModalVisible = true;
      this.$nextTick(() => {
        this.hackReset = true;//重建组件
      });
    },
    //关闭摄像弹窗
    closeCaptureModal () {
      this.captureModalVisible = false;
      this.hackReset = false; //销毁组件
    },
    //姓名框按回车键弹出查询体检人员
    openSearchPerson () {
      // console.log(this.patientInfoForm.boName)
      this.boName = this.patientInfoForm.boName.trim();
      this.personModalVisible = true;
    },
    closePerson () {
      this.boName = '';
      this.personModalVisible = false;
    },
    searchName (page = 1, size = 10, formData) {
      this.searchPersonLoading = true;
      formData['isNetPay'] = 1
      console.log('查询已缴费人员')
      console.log(formData)
      //请求患者过往预约信息
      let pagination = {
        page: page,
        size: size
      }
      // console.log(params);
      getMasterIndexByNameAndIdNo(pagination, formData).then(({data}) => {
        // console.log(data)
        if (data.code == 0) {
          //表单数据存入
          this.personTableData = data.data.records;
          this.personTableData.forEach(item => {
            item.boIsUnit == 0 ? item.IsUnit = '个人' : item.IsUnit = '单位';
            if (item.boCertificatesType == 1) item.CertificatesType = '身份证';
            if (item.boCertificatesType == 2) item.CertificatesType = '士兵证';
            if (item.boCertificatesType == 3) item.CertificatesType = '军官证';
            if (item.boCertificatesType == 4) item.CertificatesType = '警官证';
            if (item.boCertificatesType == 5) item.CertificatesType = '护照';
            if (item.boCertificatesType == 6) item.CertificatesType = '其他';
          })
          this.personTotalSize = data.data.total;
          this.searchPersonLoading = false;
        } else {
          this.searchPersonLoading = false;
          this.$Message.error(result.message);
        }
      }).catch(err => {
        this.$Message.error('网络不稳定，请稍后重试')
      });
    },
        //导入预约用户图片地址
    importPic (base64Url) {
      // console.log(base64Url);
      this.patientInfoForm.boPic = base64Url;
    },
    //输入框回车时，根据身份证号，获取档案信息；无档案，则计算年龄及出生日期
    getAgeAndBirthday () {
      // let name = this.patientInfoForm.boName.trim();
      if (!this.patientInfoForm.boIdNo) return
      this.getInfoByEnter = true;
      let j = {}
      j['boIdNo'] = this.patientInfoForm.boIdNo.trim();
      j["boCertificatesType"] = this.patientInfoForm.boCertificatesType;
      j['isNetPay'] = 1
      this.clearForm('patientInfoForm')    
      // console.log(this.patientInfoForm)
      let pagination = {
        page: 1,
        size: 5
      }
      // 更换获取患者的信息接口
      getMasterIndexByNameAndIdNo(pagination, j).then(({ data }) => {
        if (data.data.records.length) {
          this.importData = true;
          Object.assign(this.patientInfoForm, data.data.records[0])
          // console.log(this.patientInfoForm)
          this.delPickProjects();
          //  是否保留身份证照片
          if (!this.patientInfoForm.boPic) {
            this.patientInfoForm.boPic = this.boPic;
            this.boPic = '';
          } else {
            let picUrl = this.$url + this.patientInfoForm.boPic
            this.$set(this.patientInfoForm, 'boPic', picUrl)
          }
          if (!this.patientInfoForm.boChargeTypeId) {
            this.setChargTypeDefault();
          }
          if (this.patientInfoForm.boCertificatesType == 1) {
            let idNo = getBirthAndAge(j["boIdNo"]);
            if (idNo.message) {
              this.$Message.error(idNo.message);
            } else {
              this.patientInfoForm.boAge = idNo.age;
            }
          }
          this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn + 1;
          // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
          // this.patientInfoForm.boSettleStatus = "0";
          //防止查询档案时，个人查到分组带出来
          if (this.patientInfoForm.boIsUnit == 0) {
            this.$set(this.patientInfoForm, 'boGroupId', '')
            this.$set(this.patientInfoForm, 'boGroupingName', '')
            //  个人的档案信息登记时，允许修改为单位人员
            this.importData = false;
            this.patientInfoForm.boUnitId = null
            this.patientInfoForm.boMaritalStatus = this.patientInfoForm.boMaritalStatus ? this.patientInfoForm.boMaritalStatus : ''
          }
          this.changePackage(this.patientInfoForm.boPackageId)
          // console.log(this.patientInfoForm)
          console.log('身份证回车')
          console.log(this.patientInfoForm)
        } else {
          this.$Message.info({
            content: '系统内无该人员信息',
            duration: 5
          });
          this.importData = false;
          this.patientInfoForm.boPic = this.boPic;
          this.boPic = '';
          let idNo = getBirthAndAge(j['boIdNo']);
          if (idNo.message) {
            this.$Message.error(idNo.message);
          } else {
            // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
            this.patientInfoForm.boSettleStatus = "0";
            // this.patientInfoForm.boName = name;
            this.patientInfoForm.boIdNo = j['boIdNo'];
            this.patientInfoForm.boCertificatesType = j["boCertificatesType"];
            // j["boCertificatesType"] != 1 ? this.grayInput = false : this.grayInput = true;
            this.patientInfoForm.boBirthday = idNo.birthday;
            this.patientInfoForm.boAge = idNo.age;
            this.patientInfoForm.boSex = idNo.sex;
            this.delPickProjects();
          }
        }
      }).catch(err => {
        // console.log(err)
        this.importData = false;
        this.$Message.error('网络不稳定，请稍后重试')
        this.patientInfoForm.boPic = this.boPic;
        this.boPic = '';
        let idNo = getBirthAndAge(j['boIdNo']);
        if (idNo.message) {
          this.$Message.error(idNo.message);
        } else {
          // this.patientInfoForm.boName = name;
          this.patientInfoForm.boIdNo = j['boIdNo'];
          this.patientInfoForm.boCertificatesType = j["boCertificatesType"];
          // j["boCertificatesType"] != 1 ? this.grayInput = false : this.grayInput = true;
          this.patientInfoForm.boBirthday = idNo.birthday;
          this.patientInfoForm.boAge = idNo.age;
          this.patientInfoForm.boSex = idNo.sex;
          this.patientInfoForm.boSettleStatus = "0";
          this.delPickProjects();
        }
      });
    },
    // 根据就诊卡号获取档案信息
    getInfoByVisitCard () {
      if (!this.patientInfoForm.boVisitCardNumber || (this.patientInfoForm.boVisitCardNumber.trim() == '')) {
        this.$Message.error('请填写就诊卡号！');
        return false
      }
      this.getInfoByEnter = true;
      let params = {
        boIdNo: '',
        boCertificatesType: '',
        boVisitCardNumber: this.patientInfoForm.boVisitCardNumber,
        isNetPay: 1
      }
      this.clearForm('patientInfoForm')
      let pagination = {
        page: 1,
        size: 5
      }
      // 更换获取患者的信息接口
      getMasterIndexByNameAndIdNo(pagination, params).then(({ data }) => {
        if (data.data.records.length) {
          this.importData = true;
          Object.assign(this.patientInfoForm, data.data.records[0])
          // console.log(this.patientInfoForm)
          this.delPickProjects();
          if (!this.patientInfoForm.boPic) {
            this.patientInfoForm.boPic = this.boPic;
            this.boPic = '';
          } else {
            let picUrl = this.$url + this.patientInfoForm.boPic
            this.$set(this.patientInfoForm, 'boPic', picUrl)
          }
          this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn + 1;
          // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
          // this.patientInfoForm.boSettleStatus = "0";
          if (!this.patientInfoForm.boChargeTypeId) {
            this.setChargTypeDefault();
          }
          //防止查询档案时，个人查到分组带出来
          if (this.patientInfoForm.boIsUnit == 0) {
            this.$set(this.patientInfoForm, 'boGroupId', '')
            this.$set(this.patientInfoForm, 'boGroupingName', '')
            //  个人的档案信息登记时，允许修改为单位人员
            this.importData = false;
            this.patientInfoForm.boUnitId = null
            this.patientInfoForm.boMaritalStatus = this.patientInfoForm.boMaritalStatus ? this.patientInfoForm.boMaritalStatus : ''
          }
          // console.log(this.patientInfoForm)
        } else {
          this.$Message.info({
            content: '系统内无该人员信息',
            duration: 5
          });
          this.importData = false;
          this.delPickProjects();
        }
      }).catch(err => {
        // console.log(err)
        this.importData = false;
        this.$Message.error('网络不稳定，请稍后重试')
        this.delPickProjects();
      });
    },
    //清空护士端登记页面的所有信息
    handleReset (form) {
      this.importData = false;
      this.getInfoByEnter = false;
      this.boPic = '';
      this.clearForm(form);
      this.delPickProjects();
      // console.log('清空了所有信息')
      // console.log(this.patientInfoForm)
    },
    async saveAction () {
      this.isLoading = true;
      this.patientInfoForm.boSettleStatus = "0";
      this.patientInfoForm.boUnitId = this.patientInfoForm.boUnitId || '0';  //无单位时，ID值传0
      // this.patientInfoForm.itemList = this.itemList;
      this.patientInfoForm.boBirthday = moment(this.patientInfoForm.boBirthday).format('YYYY-MM-DD')
      console.log('保存表单')
      console.log(this.patientInfoForm)

      try {
        const { data } = await save(this.patientInfoForm)
        this.isLoading = false;
        // console.log(data)
        if (data.code == 0) {
          this.printParams = {};
          // this.$Message.success(`登记成功!`)
          this.$Modal.success({
            title: '和湛科技体检系统',
            content: '登记成功',
            closable: true
          });
         
           // 如果该页面没有打印权限，则返回
          if (!this.checkPrintAuthority()) return false;

          if (this.patientInfoForm.selGroup.indexOf('printSampleCode') > -1 && data.data.sampleList) {
            const sampleRes = await printBarcode({ 
              boIds: data.data.sampleList, 
              labelNum: this.patientInfoForm.labelNum,
              addItemLogo: '0'  //  登记后加项标志
            })
            // console.log(sampleRes)
            if (sampleRes.data.code == 0) {
              if (!sampleRes.data.data) {
                // 如果此人无条码，接口返回状态码0，返回data为null时
                this.printParams.barcodeUrl = sampleRes.data.data
              } else {
                this.printParams.barcodeUrl = this.$url + sampleRes.data.data
              }
            } else {
              this.$Message.error(`${sampleRes.data.message}`)
              // return
            }
          }

          if (this.patientInfoForm.selGroup.indexOf('printGuide') > -1 && data.data.guideMap) {
            // console.log(data.data.guideMap)
            const guideRes = await printGuide(data.data.guideMap)
            // console.log(guideRes)
            if (guideRes.data.code == 0) {
              this.printParams.guideUrl = this.$url + guideRes.data.data
            } else {
              this.$Message.error(`${guideRes.data.message}`)
              // return
            }
          }

          if (!this.printParams.barcodeUrl) {
            let j = this.patientInfoForm.selGroup.filter((val) => {
              return val != 'printSampleCode';
            })
            console.log(j)
            this.printParams.selGroup = j;
          } else {
            this.printParams.selGroup = this.patientInfoForm.selGroup
          }
          console.log(this.printParams);

          let printConfig = getPrinterConfigFromLocalstorage()
          if (printConfig.lodopPreview || printConfig.browserPreview) {
            if (this.printParams.selGroup.length) {
              Object.assign(this.printParams, printConfig)
              printFunc(this.printParams);
            }
          }
          if (printConfig.lodopPrint) {
            if (this.printParams.selGroup.length) {
              Object.assign(this.printParams, printConfig)
              directPrintFunc(this.printParams);
            }
          }

          // 清除掉传给后台的数据
          this.$set(this.patientInfoForm, 'boPackageId', null)
          this.$set(this.patientInfoForm, 'boPackageName', null)
          this.$set(this.patientInfoForm, 'boPackageCode', null)
          // this.itemList = []
          if (this.isAutoClear) {
            this.handleReset('patientInfoForm')
          }
        } else {
          this.$Message.error(`${data.message}`);
        }

      } catch (err) {
        // console.log(err)
        this.isLoading = false;
        this.$Message.error('网络不稳定，请稍后重试')
      }
    },
    //检查当前页面打印权限
    checkPrintAuthority() {
      // console.log(this.$router.currentRoute.meta.authority)
      return this.$router.currentRoute.meta.authority.some(item => {
        return item == 'print'
      })
    },
    //保存护士端登记信息
    handleSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (!this.pickProjectsTableData.length) {
            this.$Message.error('登记失败，该人员未预约任何套餐');
            return false;
          }
          let printConfig = getPrinterConfigFromLocalstorage()
          if (JSON.stringify(printConfig) === '{}') {
            this.$Message.error('请在右上角配置打印机')
            return false
          }
          //如果上次总检了就是9，未总检就是0，是0的时候弹出
          if (this.patientInfoForm.visitStatus == 0 && this.patientInfoForm.boRegisterSn != 0) {
            this.$Modal.confirm({
              // title: '此人上次未做总检',
              content: '<p>上次体检未完成，是否再次登记？</p>',
              onOk: () => {
                this.saveAction();
                this.importData = false;
                this.getInfoByEnter = false;
              },
              onCancel: () => {
                return
              }
            });
          } else {
            this.saveAction();
            this.importData = false;
            this.getInfoByEnter = false;
          }
        }
      })
    },
    clearForm (form) {
      this.patientInfoForm = null
      this.patientInfoForm = {
        boVisitSn: '1',
        boPeId: '',
        boName: '',
        boIdNo: '',
        boIsUnit: '0',
        boBirthday: '',
        boAge: '',
        boSex: '',
        boMobile: '',
        boSettleStatus: '0',
        boCertificatesType: '1',
        boChargeTypeId: '',
        labelNum: '3',
        selGroup: ['printGuide', 'printSampleCode'],
        boGroupId: '',
        boUnitId: '',
        boMaritalStatus: '',
        boCategoryId: ''
      };
      this.$refs[form].resetFields();
      console.log('清空表单')
      console.log(this.patientInfoForm)
      // this.grayInput = true;
      this.printParams = {};
      this.setChargTypeDefault();
    },
    delPickProjects () {
      this.pickProjectsTableData = [];
      this.emptyText = '暂无数据';
    },
    //已选项目上的清空按钮
    // clearPickProjects() {
    //   this.delPickProjects()
    //   this.$set(this.patientInfoForm, 'boPackageId', null)
    //   this.$set(this.patientInfoForm, 'boPackageName', null)
    //   this.$set(this.patientInfoForm, 'boPackageCode', null)
    // },
    //导入个人信息到表单中
    importPersonalRecord (formData) {
      console.log(formData);
      this.importData = true;
      this.getInfoByEnter = false;
      this.clearForm('patientInfoForm');
      Object.assign(this.patientInfoForm, formData)
      this.delPickProjects();
      if (!!this.patientInfoForm.boPic) {
        let picUrl = this.$url + this.patientInfoForm.boPic
        this.$set(this.patientInfoForm, 'boPic', picUrl)
      }
      this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn + 1;
      this.patientInfoForm.selGroup = ['printGuide', 'printSampleCode'];
      // formData.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true;
      this.patientInfoForm.boSettleStatus = "0";
      if (formData.boSettleStatus) {
        this.patientInfoForm.boSettleStatus = this.patientInfoForm.boSettleStatus.toString();
      }
      if (!this.patientInfoForm.boChargeTypeId) {
        this.setChargTypeDefault();
      }
      //防止查档案的时候，出现个人有单位分组的情况
      if (this.patientInfoForm.boIsUnit == 0) {
        this.$set(this.patientInfoForm, 'boGroupId', '')
        this.$set(this.patientInfoForm, 'boGroupingName', '')
      }

      console.log('导入')
      console.log(this.patientInfoForm)
      if (formData.boPackageName) {
        let comboParams = {
          paPackageId: formData.boPackageId
        };
        this.emptyText = '数据加载中...';
        //获取组合项目
        getComboByPackage(comboParams).then((res) => {
          let result = res.data;
          if (result.code === 0) {
            this.pickProjectsTableData = result.data;
            if (this.patientInfoForm.boIsUnit == '0') {
              //个人
              this.pickProjectsTableData.forEach(item => {
                // item.isAddItem = '套餐';
                item.isAddItem = 0;
                item.boIsAdditional = 0;
                item.boIsOwnExpense = "1";
              });
            } else {
              //单位
              this.pickProjectsTableData.forEach(item => {
                // item.isAddItem = '套餐';
                item.isAddItem = 0;
                item.boIsAdditional = 0;
                item.boIsOwnExpense = "0";
              });
            }
            this.emptyText = '此套餐下无项目组合';
          } else {
            this.emptyText = '暂无数据';
            this.$Message.error(result.message);
          }
        }).catch(err => {
          // console.log(err)
          this.$Message.error('网络不稳定，请稍后重试')
        });
      }
    },
    //修改套餐,获取已选项目信息
    changePackage (packageId) {
      this.findPackageName(packageId);
      let comboParams = {
        paPackageId: packageId
      };
      if (comboParams.paPackageId) {
        this.emptyText = '数据加载中...';
        getComboByPackage(comboParams).then((res) => {
          let result = res.data;
          // console.log(result);
          if (result.code === 0) {
            //数组深拷贝
            [...this.pickProjectsTableData] = result.data;
            this.emptyText = '此套餐下无项目组合';
          } else {
            this.emptyText = '暂无数据';
            this.$Message.error(result.message);
          }
          this.isUnit(comboParams.paPackageId);
        }).catch(err => {
          this.$Message.error('网络不稳定，请稍后重试')
        });
      }
    },
    // 是否开启保存信息后，自动清空功能
    changeAutoClear (status) {
      console.log(status)
      console.log(this.isAutoClear)
      setAutoClearStorage({isNetworkRegister: status})
    }
  }
}
</script>
<style lang="less">
.network-register-wrapper {
  width: 100%;
  min-width: 1000px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-group {
      top: 0;
    }
  }
  .title-right-tool {
    display: flex;
    align-items: center;
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
  .ivu-form-item {
    margin-bottom: 3px !important;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-input[disabled] {
    color: #666;
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
  .settlement-sel-group.ivu-form-item {
    display: flex;
    justify-content: flex-end;
    color: #2d8cf0;
    margin-bottom: 0;
    .ivu-checkbox-wrapper {
      font-size: 14px;
    }
  }
  .select-groups {
    font-size: 14px;
    .ivu-select-item {
      font-size: 14px !important;
    }
    .ivu-select-selected-value {
      font-size: 14px !important;
    }
    .ivu-select-input {
      font-size: 14px;
    }
  }
  .zk-table {
    line-height: 20px;
    .zk-table__cell-inner {
      font-size: 14px;
    }
    .zk-table__header-row {
      background-color: #d6eaff;
    }
    .zk-table__body-row {
      height: 20px;
    }
    .zk-table__body-wrapper {
      height: 440px !important;
    }
    .zk-table--empty-row {
      height: 440px;
    }
    ::-webkit-scrollbar {
      width: 5px;
      background-color: #eee;
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
    ::-webkit-scrollbar-corner {
      display: none;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
  }
  .demo-table-package-row td {
    // background-color:#2db7f5;
    background-color: #fff;
    color: #333;
    opacity: 0.8;
  }
  .demo-table-package-row.testTube td .zk-table__cell-inner {
    color: #e51c23;
  }
  .demo-table-addItem-row td {
    background-color: #fff9c4;
    color: #333;
    opacity: 0.8;
  }
  .demo-table-addItem-row.testTube td .zk-table__cell-inner {
    color: #e51c23;
  }
  .page-footer {
    justify-content: flex-end;
  }
  .personaInfo-wrapper {
    width: 100%;
  }
  .project-wrapper {
    width: 100%;
    .title-bar{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 8px;
      .title{
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
    }
  }
  .top-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .form {
      width: 88%;
    }
    .photo {
      width: 12%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 55%;
      }
    }
  }
  //  选择框禁止色改为白底 - 特殊需求
  .ivu-select-disabled .ivu-select-selection, .ivu-input {
    background-color: #fff;
  }
}
</style>