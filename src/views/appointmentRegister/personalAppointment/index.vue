<template>
  <div class="personal-appointment-wrapper">
    <Form ref="patientInfoForm"
          :model="patientInfoForm"
          label-position="right"
          :rules="ruleValidate"
          :show-message="false"
          autocomplete="on">
      <Row style="margin-bottom: 10px;background-color: #fff;"
           class="form-wrapper">
        <Card class="basic-info"
              :bordered="false"
              shadow>
          <div slot="title"
               class="search-title-wrapper">
            <span class="title">基本信息</span>
            <div class="search-btn"
                 @click="toBookingHistory">
              搜索历史预约
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" />
            </div>
            <!-- <Button type="primary" icon="ios-search" @click="toBookingHistory">搜索历史预约</Button> -->
          </div>
          <div class="basic-info-body">
            <div class="basic-info-body-pic">
              <img :src="patientInfoForm.boPic"
                   v-if="!!patientInfoForm.boPic"
                   alt="预约用户头像" />
              <img src="@/assets/images/userPhoto.png"
                   v-else
                   alt="预约用户头像" />
              <!-- <Button type="primary" @click="captureModalVisible = true">拍照采集</Button> -->
            </div>
            <div class="basic-info-body-input">
              <Row :gutter="16">
                <Col span="4">
                <FormItem label="姓名"
                          prop="boName"
                          :label-width="80">
                  <Input v-model="patientInfoForm.boName"
                         @on-search="searchHistoryByName"
                         search
                         size="small"
                         clearable />
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="证件类型"
                          prop="boCertificatesType"
                          :label-width="70">
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
                <Col span="6">
                <FormItem label="证件号码"
                          prop="boIdNo"
                          :label-width="80">
                  <Input v-model="patientInfoForm.boIdNo"
                         @on-search="getAgeAndBirthday"
                         @on-blur="AgeAndBirthday"
                         search
                         clearable
                         size="small" />
                </FormItem>
                </Col>
                <Col span="5">
                <FormItem label="就诊卡号"
                          prop="boPatientId"
                          :label-width="80">
                  <Input v-model="patientInfoForm.boVisitCardNumber"
                         @on-enter="getInfoByVisitCard"
                         size="small" />
                </FormItem>
                </Col>
                <Col span="3">
                <FormItem label="预约次数"
                          :label-width="70"
                          prop="boVisitSn">
                  <Input v-model="patientInfoForm.boVisitSn"
                         disabled
                         size="small" />
                </FormItem>
                </Col>
                <Col span="2">
                <FormItem label="年龄"
                          :label-width="40"
                          prop="boAge">
                  <Input v-model.number="patientInfoForm.boAge"
                         size="small"
                         disabled />
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="16">
                <Col span="8">
                <FormItem label="预约日期"
                          :label-width="80"
                          prop="bookingDate">
                  <Row>
                    <Col span="11">
                    <DatePicker type="date"
                                :editable="false"
                                format="yyyy-MM-dd"
                                @on-change="setDeadline"
                                v-model="patientInfoForm.bookingDate"
                                :options="bookingStartTime"
                                size="small"
                                placeholder="开始时间"></DatePicker>
                    </Col>
                    <Col span="2"
                         style="text-align:center;">-</Col>
                    <Col span="11">
                    <DatePicker type="date"
                                v-model="patientInfoForm.bookingExpireDate"
                                format="yyyy-MM-dd"
                                size="small"
                                placeholder="截止时间"
                                disabled></DatePicker>
                    </Col>
                  </Row>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="出生日期"
                          prop="boBirthday"
                          :label-width="80">
                  <DatePicker type="date"
                              placeholder="选择出生日期"
                              size="small"
                              style="width: 100%;"
                              clearable
                              v-model="patientInfoForm.boBirthday"
                              @on-change="changeBirthday"
                              @on-clear="clearBirthday"
                              :options="birth"></DatePicker>
                </FormItem>
                </Col>
                <Col span="3">
                <FormItem label="性别"
                          prop="boSex"
                          :label-width="50">
                  <Select v-model="patientInfoForm.boSex"
                          @on-change="changeSex"
                          size="small">
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="5">
                <FormItem label="联系方式"
                          prop="boMobile"
                          :label-width="80">
                  <Input v-model="patientInfoForm.boMobile"
                         clearable
                         size="small" />
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="费别"
                          prop="boChargeTypeId"
                          :label-width="60">
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
              <Row :gutter="16">
                <Col span="5">
                <FormItem label="体检类型"
                          prop="boCategoryId"
                          :label-width="80">
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
                <Col span="5">
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
                <Col span="4">
                <FormItem label="婚姻状态"
                          prop="boMaritalStatus"
                          :label-width="70">
                  <Select v-model="patientInfoForm.boMaritalStatus"
                          size="small">
                    <!-- <Option value="未知">未知</Option> -->
                    <Option value="不详">不详</Option>
                    <Option value="未婚">未婚</Option>
                    <Option value="已婚">已婚</Option>
                    <!-- <Option value="离异">离异</Option>
                      <Option value="丧偶">丧偶</Option> -->
                  </Select>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="人员来源"
                          prop="boSourceId"
                          :label-width="70">
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
                <Col span="5">
                <!-- <FormItem label="个人/单位"
                            :label-width="90"
                            prop="boIsUnit">
                    <RadioGroup v-model="patientInfoForm.boIsUnit"
                                size="small">
                      <Row>
                        <Col span="12">
                        <Radio label="0">个人</Radio>
                        </Col>
                        <Col span="12">
                        <Radio label="1">单位</Radio>
                        </Col>
                      </Row>
                    </RadioGroup>
                  </FormItem> -->
                <p style="float: right;">
                  总金额：
                  <span class="price">{{totalPrice/100}}</span>元
                </p>
                </Col>
              </Row>
              <Row :gutter="16">
                <Col span="5">
                <FormItem label="体检号"
                          :label-width="80"
                          prop="boPeId">
                  <Input v-model="patientInfoForm.boPeId"
                         disabled
                         size="small" />
                </FormItem>

                </Col>
                <Col span="9">
                <FormItem label="家庭地址"
                          prop="boAddress"
                          :label-width="70">
                  <Input v-model="patientInfoForm.boAddress"
                         size="small"
                         clearable />
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="保存自动清空">
                  <i-switch v-model="isAutoClear"
                            size="large"
                            @on-change="changeAutoClear">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                  </i-switch>
                </FormItem>
                </Col>
                <Col span="6">
                <!-- <p style="float: right;">
                    总金额：
                    <span class="price">{{totalPrice/100}}</span>元
                  </p> -->
                <Button type="primary"
                        style="float: right;"
                        @click="handleSubmit('patientInfoForm')"
                        :loading="isLoading"
                        v-permission="['add']">确认预约</Button>
                <Button type="error"
                        style="margin:0 12px;float: right;"
                        @click="handleReset('patientInfoForm')">清空</Button>
                <Button type="primary"
                        style="float: right;"
                        :loading="scanLoading"
                        @click="readIdCard">扫描证件</Button>
                </Col>
              </Row>
              <!-- <Row :gutter="16">
                <Col span="15">
                  <FormItem label="单位名称"
                            prop="boUnitName"
                            :label-width="70">
                    <Input v-model="patientInfoForm.boUnitName"
                          size="small"
                          @on-change="searchUnit"
                          @on-clear="clearUnit"
                          clearable />
                    <ul class="serch-unit-result"
                        v-show="showSearchResult">
                      <li v-for="(item, index) in unitsList"
                          :key="index"
                          @click="selectUnitName(index)">{{ item.boUnitName }}</li>
                    </ul>
                  </FormItem>
                </Col>
                <Col span="5">
                  <FormItem label="体检分组"
                            prop="boGroupId"
                            :label-width="70">
                    <Select v-model="patientInfoForm.boGroupId"
                            size="small"
                            clearable>
                      <Option v-for="item in groupsList"
                              :value="item.boGroupId"
                              :key="item.boGroupId">{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="4">
                  <Button type="primary"
                          style="float: right;"
                          @click="handleSubmit('patientInfoForm')"
                          :loading="isLoading"
                          v-permission="['add']">确认预约</Button>
                  <Button type="error"
                          style="margin:0 12px;float: right;"
                          @click="handleReset('patientInfoForm')">清空</Button>
                 
                </Col>
              </Row> -->
            </div>
          </div>
        </Card>
      </Row>
    </Form>
    <Row :gutter="16">
      <Col span="6">
      <Card style="margin-bottom: 10px;"
            :bordered="false"
            shadow
            class="unpick-packages-card">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">未选套餐</span>
          <div class="title-right-tool">
            <input-drop ref="packageInputDrop"
                        :width="140"
                        placeholder="套餐简码或名称"
                        :dropList="searchPackageList"
                        :isLoading="packageSearchLoading"
                        @search="searchPackage"
                        @clear="clearPackage"
                        @selectOption="selectPackage"></input-drop>
          </div>
        </div>
        <Scroll :height="400"
                :on-reach-bottom="reachPackageBottom"
                :distance-to-edge="-24">
          <RadioGroup v-model="userPickPackageId"
                      class="unselect-package"
                      vertical
                      @on-change="changePackage">
            <Radio :label="item.id"
                   v-for="item in allPackages"
                   :key="item.id"
                   class="unselect-package-item">{{item.name}}</Radio>
          </RadioGroup>
        </Scroll>
      </Card>
      <Card :bordered="false"
            shadow
            class="pick-package">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">已选套餐</span>
        </div>
        <div class="selected-package">
          <!-- closable @on-close="delPickProjects" -->
          <Tag color="primary"
               style="fontSize: 14px;"
               v-if="userPickPackageName">{{ userPickPackageName }}</Tag>
        </div>
      </Card>
      </Col>
      <Col span="18">
      <Card :bordered="false"
            shadow
            class="pick-projects">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">已选项目</span>
          <div class="title-right-tool">
            <Button type="default"
                    @click="clearPickProjects"
                    size="small">清空项目</Button>
          </div>
        </div>
        <!-- :row-class-name="addItemColor" -->
        <tree-table ref="comboTreeTable"
                    :key="Math.random()*10"
                    :columns="pickProjectsCols"
                    :data="pickProjectsTableData"
                    :expand-type="false"
                    :is-fold="true"
                    :selectable="false"
                    :show-row-hover="true"
                    :empty-text="emptyText"
                    expand-key="paName"
                    max-height="420"
                    border>
          <template slot="paExamType"
                    slot-scope="{row}">
            <span>{{row.paExamType}}</span>
          </template>
          <template slot="paName"
                    align="center"
                    slot-scope="{row}">
            <span>{{row.paName}}</span>
          </template>
          <template slot="paId"
                    slot-scope="{row}">
            <span>{{row.paId}}</span>
          </template>
          <template slot="paPrice"
                    slot-scope="{row}">
            <span>{{row.paPrice}}</span>
          </template>
          <template slot="paDeptName"
                    slot-scope="{row}">
            <span>{{row.paDeptName}}</span>
          </template>
          <template slot="boPackageId"
                    slot-scope="{row}">
            <span>{{row.packageId}}</span>
          </template>
        </tree-table>
      </Card>
      </Col>
    </Row>
    <book-history :visible="historyModalVisible"
                  :boname="boName"
                  @importRecord="importPersonalRecord"
                  @close="closeHistory"></book-history>
    <!-- <capture :visible="captureModalVisible"
                @cancel="captureModalVisible = false"
    @ok="importPic"></capture>-->
  </div>
</template>

<script>
import InputDrop from "@/views/appointmentRegister/components/inputDrop"
import BookHistory from "@/views/appointmentRegister/components/bookHistory";
import {
  getBookingPackage,
  getComboByPackage,
  save,
  listAllByUnitId,
  listByName,
  getMasterIndexByNameAndIdNo
} from "@/api/personal_appointment.js";
import moment from "moment";
import { getBirthAndAge } from "@/libs/tools.js";
import { getSelectionList, validate, commonFunc } from '@/views/appointmentRegister/components/mixins/bookRegister.js'
import { setAutoClearStorage, getAutoClearStorage } from '@/libs/util'
// import $ from 'jquery'
import jsonp from "jsonp";
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
  name: "personalAppointment",
  mixins: [getSelectionList, validate, commonFunc],
  components: {
    InputDrop,
    BookHistory
    // Capture
  },
  data () {
    return {
      ruleValidate: {
        bookingDate: [
          { required: true, message: "请选择预约日期" }
        ],
        // boIsUnit: [
        //   { required: true, message: '请选择个人/单位'}
        // ]
      },
      bookingStartTime: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      birth: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000;
        }
      },
      patientInfoForm: {
        boVisitSn: "1",
        boPeId: "",
        boName: "",
        boIdNo: "",
        boIsUnit: "0",
        boBirthday: "",
        boAge: "",
        boSex: "",
        boCertificatesType: "1",
        boChargeTypeId: '',
        boSettleStatus: "0",
        boMobile: null,
        boMaritalStatus: '',
        boCategoryId: '',
      },
      pickProjectsCols: [
        // {
        //   title: "套餐编号",
        //   key: "paPackageCode",
        //   template: "paPackageCode",
        //   width: 100,
        //   align: "center",
        //   headerAlign: "center"
        // },
        {
          title: "所属科室",
          key: "paDeptName",
          width: 120,
          template: "paDeptName",
          align: "center",
          headerAlign: "center"
        },
        {
          title: "项目名称",
          key: "paName",
          width: 200,
          template: "paName",
          align: "left",
          headerAlign: "center"
        },
        // {
        //   title: "组合编号",
        //   key: "paCode",
        //   template: "paCode",
        //   width: 80,
        //   align: "center",
        //   headerAlign: "center"
        // },
        {
          title: "检查类别",
          key: "paExamType",
          type: "template",
          template: "paExamType",
          width: 120,
          align: "center",
          headerAlign: "center"
        },
        {
          title: "单价（元）",
          key: "paPrice",
          template: "paPrice",
          width: 100,
          align: "center",
          headerAlign: "center"
        }
      ],
      historyModalVisible: false,
      captureModalVisible: false,
      modalTitle: "",
      packageCode: "",
      boName: "",
      showSearchResult: false,
      isLoading: false,
      scanLoading: false // 扫描证件loading
    };
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo;
      },
      set: function () { }
    },
    totalPrice () {
      return this.pickProjectsTableData.reduce((total, currentValue) => {
        return total + currentValue.paPrice * 100;
      }, 0);
    }
  },
  created () {
    this.getPackagesList();
    let setting = getAutoClearStorage()
    this.isAutoClear = setting.hasOwnProperty('isPersonalAppointment') ? setting.isPersonalAppointment : true
  },
  methods: {
    // 查询体检分组
    getGroups () {
      let groupParam = {
        boUnitId: this.patientInfoForm.boUnitId,
        boSex: this.patientInfoForm.boSex
      };
      listAllByUnitId(groupParam).then(res => {
        console.log(res);
        let result = res.data;
        if (result.code === 0) {
          this.groupsList = result.data;
        } else {
          this.$Message.error(result.Message);
        }
      });
    },
    //搜索单位名称
    searchUnit () {
      this.unitTimer && clearTimeout(this.unitTimer);
      if (!this.patientInfoForm.boUnitName) {
        this.clearUnit();
        return false;
      }
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: this.patientInfoForm.boUnitName
        };
        listByName(params).then(res => {
          let result = res.data;
          if (result.code === 0) {
            this.showSearchResult = true;
            this.unitsList = result.data;
          } else {
            this.$Message.error(result.message);
          }
        });
      }, 300);
    },
    //选中单位后
    selectUnitName (index) {
      this.patientInfoForm.boUnitName = this.unitsList[index].boUnitName;
      this.patientInfoForm.boUnitCode = this.unitsList[index].boUnitCode;
      this.patientInfoForm.boUnitId = this.unitsList[index].boUnitId;
      this.getGroups();
      this.showSearchResult = false;
      this.unitsList = [];
    },
    //清空单位后
    clearUnit () {
      this.showSearchResult = false;
      this.patientInfoForm.boUnitCode = "";
      this.patientInfoForm.boGroupId = "";
      this.patientInfoForm.boIsUnit = '0'
      this.unitsList = [];
      this.groupsList = [];
    },
    //导入个人信息到表单中
    importPersonalRecord (formData) {
      this.getInfoByEnter = true
      this.importData = true;
      this.clearForm("patientInfoForm");
      // console.log(formData.boPackageName);
      // this.patientInfoForm = formData;
      Object.assign(this.patientInfoForm, formData);
      this.patientInfoForm.boVisitSn = this.patientInfoForm.boBookingSn + 1;
      this.patientInfoForm.boSettleStatus = "0";
      let picUrl = this.$url + this.patientInfoForm.boPic
      this.$set(this.patientInfoForm, 'boPic', picUrl)
      if (!this.patientInfoForm.boChargeTypeId) {
        this.setChargTypeDefault();
      }
      if (this.patientInfoForm.boUnitId) {
        this.getGroups();
      }
      this.delPickProjects();
      if (formData.boPackageName) {
        this.changePackage(formData.boPackageId);
        this.userPickPackageId = formData.boPackageId;
        this.userPickPackageName = formData.boPackageName;
      }
    },
    //根据套餐名查找套餐ID
    findPackageName (packageId) {
      // console.log(allPackages)
      this.allPackages.forEach(item => {
        if (item.id === packageId) {
          this.patientInfoForm.boPackageId = item.id;
          this.patientInfoForm.boPackageCode = item.code;
          this.patientInfoForm.boPackageName = item.name;
          // this.packagePrice = item.price;
          this.packageCode = item.code;
          this.userPickPackageName = item.name;
        }
      });
    },
    //修改套餐,获取已选项目信息
    changePackage (packageId) {
      // console.log(packageId);
      if (packageId != undefined) {
        this.emptyText = "数据加载中...";
        this.findPackageName(packageId);
        let comboParams = {
          paPackageId: packageId
        };
        getComboByPackage(comboParams)
          .then(res => {
            let result = res.data;
            console.log(result);
            if (result.code === 0) {
              this.pickProjectsTableData = result.data;
            } else {
              this.emptyText = '暂无数据';
              this.$Message.error(result.message);
            }
            // this.pickProjectsTableData.forEach( item => {
            //     item.boPackageId = packageId;
            // });
          })
          .catch(err => {
            this.emptyText = "网络不稳定，暂无数据，请稍后重试";
            this.$Message.error("网络不稳定，请稍后重试");
          });
        // console.log(this.pickProjectsTableData);
      }
    },
    clearForm (form) {
      this.patientInfoForm = {};
      this.patientInfoForm = {
        boVisitSn: "1",
        boPeId: "",
        boName: "",
        boIdNo: "",
        boIsUnit: "0",
        boBirthday: "",
        boAge: "",
        boSex: "",
        boCountryId: "1",
        boCountry: "中国",
        boSettleStatus: "0",
        boCertificatesType: "1",
        boCategoryId: "",
        boUnitName: "",
        boChargeTypeId: '',
        boMobile: null,
        boMaritalStatus: '',
        boCategoryId: ''
      };
      this.$refs[form].resetFields();
      this.setChargTypeDefault();
      // this.grayInput = true
    },
    delPickProjects () {
      this.isPackageMore = false
      this.$refs.packageInputDrop.filterText = "";
      this.searchPackageList = [];
      this.pickProjectsTableData = [];
      this.emptyText = "暂无数据";
      this.userPickPackageId = "";
      this.userPickPackageName = "";
      this.allPackages = [];
      this.packagePageIndex = 1;
      this.getPackagesList();
    },
    //已选项目上的清空按钮
    clearPickProjects () {
      this.delPickProjects()
      this.$set(this.patientInfoForm, 'boPackageId', null)
      this.$set(this.patientInfoForm, 'boPackageName', null)
      this.$set(this.patientInfoForm, 'boPackageCode', null)
    },
    //改变性别时，更改体检分组以及套餐
    changeSex () {
      // console.log(this.patientInfoForm.boSex);
      if (this.patientInfoForm.boSex && !this.importData) {
        this.delPickProjects()
      }
    },
    //清空护士端页面的所有信息
    handleReset (form) {
      this.importData = false;
      this.getInfoByEnter = false;
      this.boPic = '';
      this.clearForm(form);
      this.delPickProjects();
    },
    //保存护士端信息
    handleSubmit (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.userPickPackageId === "") {
            this.$Message.error("您还未选择套餐");
            return
          }
          this.isLoading = true;
          this.patientInfoForm.boUnitId = this.patientInfoForm.boUnitId || "0"; //无单位时，ID值传0
          this.patientInfoForm.boSettleStatus = "0";
          this.patientInfoForm.boBirthday = moment(this.patientInfoForm.boBirthday).format('YYYY-MM-DD')
          // console.log(this.patientInfoForm);
          save(this.patientInfoForm).then(res => {
            this.isLoading = false;
            this.importData = false
            this.getInfoByEnter = false
            let result = res.data;
            if (result.code === 0) {
              // this.$Message.success("预约成功!");
              this.$Modal.success({
                title: '和湛科技体检系统',
                content: '预约成功',
                closable: true
              });
              // 清除掉传给后台的数据
              this.$set(this.patientInfoForm, 'boPackageId', null)
              this.$set(this.patientInfoForm, 'boPackageName', null)
              this.$set(this.patientInfoForm, 'boPackageCode', null)
              if (this.isAutoClear) {
                this.handleReset('patientInfoForm')
              }
            } else {
              this.$Message.error(result.message);
            }
          }).catch(err => {
            this.isLoading = false;
            this.importData = false
            this.getInfoByEnter = false
            this.$Message.error("网络不稳定，请稍后重试");
          });
        }
      });
    },
    setDeadline (e) {
      // console.log(this.userInfo);
      //判断当前机构ID，设置对应的截止时间
      let bookingDate = this.patientInfoForm.bookingDate;
      // console.log(bookingDate);
      let endDate = null;
      if (bookingDate) {
        let year = bookingDate.getFullYear();
        let month = bookingDate.getMonth();
        let date = bookingDate.getDate() + 1;
        endDate = new Date(year, month, date);
      }
      // console.log(endDate);
      this.patientInfoForm.bookingExpireDate = moment(endDate).format(
        "YYYY-MM-DD"
      );
      this.patientInfoForm.boBookingExpireDate = moment(endDate).format(
        "YYYY-MM-DD"
      );
      // console.log(this.patientInfoForm.bookingExpireDate);
      this.patientInfoForm.bookingDate = e;
      this.patientInfoForm.boBookingDate = e;
    },
    //导入预约用户图片地址
    importPic (picUrl) {
      // console.log(picUrl);
      this.patientInfoForm.boPic = picUrl;
    },
    //根据身份证号，获取档案信息；无档案，则计算年龄及出生日期
    getAgeAndBirthday () {
      // let name = this.patientInfoForm.boName.trim();
      if (!this.patientInfoForm.boIdNo) return
      let j = {};
      j["boIdNo"] = this.patientInfoForm.boIdNo.trim();
      j["boCertificatesType"] = this.patientInfoForm.boCertificatesType;
      this.clearForm("patientInfoForm");
      this.getInfoByEnter = true
      getMasterIndexByNameAndIdNo(j)
        .then(res => {
          // console.log(res.data)
          if (res.data.data) {
            this.importData = true;
            Object.assign(this.patientInfoForm, res.data.data);
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
            if (this.patientInfoForm.boUnitId && this.patientInfoForm.boUnitId != '****') {
              this.getGroups();
            }
            if (this.patientInfoForm.boCertificatesType == 1) {
              let idNo = getBirthAndAge(j["boIdNo"]);
              if (idNo.message) {
                this.$Message.error(idNo.message);
              } else {
                this.patientInfoForm.boAge = idNo.age;
              }
            }
            this.patientInfoForm.boVisitSn = this.patientInfoForm.boBookingSn + 1;
            // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
            this.patientInfoForm.boSettleStatus = "0";
            // console.log(this.patientInfoForm)
            // this.delPickProjects();     
          } else {
            this.importData = false;
            this.$Message.info({
              content: '系统内无该人员信息',
              duration: 5
            });
            this.patientInfoForm.boPic = this.boPic;
            this.boPic = '';
            let idNo = getBirthAndAge(j["boIdNo"]);
            if (idNo.message) {
              this.$Message.error(idNo.message);
            } else {
              this.patientInfoForm.boSettleStatus = "0";
              this.patientInfoForm.boIdNo = j["boIdNo"];
              this.patientInfoForm.boCertificatesType = j["boCertificatesType"];
              // j["boCertificatesType"] != 1 ? this.grayInput = false : this.grayInput = true
              this.patientInfoForm.boBirthday = idNo.birthday;
              this.patientInfoForm.boAge = idNo.age;
              this.patientInfoForm.boSex = idNo.sex;
            }
          }
          this.delPickProjects();
        })
        .catch(err => {
          this.importData = false;
          this.$Message.error("网络不稳定，请稍后重试");
          this.patientInfoForm.boPic = this.boPic;
          this.boPic = '';
          let idNo = getBirthAndAge(j["boIdNo"]);
          if (idNo.message) {
            this.$Message.error(idNo.message);
          } else {
            // this.patientInfoForm.boName = name;
            this.patientInfoForm.boIdNo = j["boIdNo"];
            this.patientInfoForm.boCertificatesType = j["boCertificatesType"];
            // j["boCertificatesType"] != 1 ? this.grayInput = false : this.grayInput = true
            this.patientInfoForm.boBirthday = idNo.birthday;
            this.patientInfoForm.boAge = idNo.age;
            this.patientInfoForm.boSex = idNo.sex;
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
      let params = {
        boIdNo: '',
        boCertificatesType: '',
        boVisitCardNumber: this.patientInfoForm.boVisitCardNumber
      }
      this.clearForm('patientInfoForm')
      this.getInfoByEnter = true
      getMasterIndexByNameAndIdNo(params)
        .then(res => {
          // console.log(res.data)
          if (res.data.data) {
            this.importData = true;
            Object.assign(this.patientInfoForm, res.data.data);
            if (!this.patientInfoForm.boPic) {
              this.patientInfoForm.boPic = this.boPic;
              this.boPic = '';
            } else {
              let picUrl = this.$url + this.patientInfoForm.boPic
              this.$set(this.patientInfoForm, 'boPic', picUrl)
            }
            // if (this.patientInfoForm.boUnitId && this.patientInfoForm.boUnitId != '****') {
            //   this.getGroups();
            // }
            if (!this.patientInfoForm.boChargeTypeId) {
              this.setChargTypeDefault();
            }
            this.patientInfoForm.boVisitSn = this.patientInfoForm.boBookingSn + 1;
            // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
            this.patientInfoForm.boSettleStatus = "0";
            // console.log(this.patientInfoForm)
          } else {
            this.importData = false;
            this.$Message.info({
              content: '系统内无该人员信息',
              duration: 5
            });
          }
          this.delPickProjects();
        })
        .catch(err => {
          this.importData = false;
          this.$Message.error("网络不稳定，请稍后重试");
        });
    },
    //按回车键弹出历史预约框并搜索记录
    searchHistoryByName () {
      // console.log(this.patientInfoForm.boName)
      this.boName = this.patientInfoForm.boName;
      this.historyModalVisible = true;
    },
    //滚轮到未选套餐底部刷新
    reachPackageBottom () {
      return new Promise(resolve => {
        setTimeout(() => {
          this.packagePageIndex++;
          this.getPackagesList();
          resolve();
        }, 300);
      });
    },
    //打开预约历史框
    toBookingHistory () {
      this.boName = this.patientInfoForm.boName;
      this.historyModalVisible = true;
    },
    closeHistory () {
      this.boName = "";
      this.historyModalVisible = false;
    },
    // 是否开启保存信息后，自动清空功能
    changeAutoClear (status) {
      console.log(status)
      console.log(this.isAutoClear)
      setAutoClearStorage({ isPersonalAppointment: status })
    }
  }
};
</script>

<style lang="less">
.personal-appointment-wrapper {
  // width: 100%;
  min-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .form-wrapper {
    .ivu-card-body {
      padding-bottom: 10px;
    }
    .ivu-form-item-label {
      font-size: 14px;
    }
    .ivu-input {
      font-size: 14px;
    }
    .ivu-select-input {
      font-size: 14px;
    }
    .ivu-select-item {
      font-size: 14px !important;
    }
    .ivu-select-selected-value {
      font-size: 14px !important;
    }
    .ivu-radio-wrapper {
      font-size: 14px;
    }
    .ivu-select-small.ivu-select-single
      .ivu-select-selection
      .ivu-select-placeholder,
    .ivu-select-small.ivu-select-single
      .ivu-select-selection
      .ivu-select-selected-value {
      height: 24px;
      line-height: 24px;
    }
  }
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
    justify-content: flex-end;
  }
  .title {
    padding-left: 8px;
    position: relative;
    font-weight: bold;
    // font-size: 16px;
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
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .zk-table__header-row {
    background-color: #d6eaff;
  }
  .ivu-select-disabled .ivu-select-selection,
  .ivu-input {
    color: #000;
  }
  .ivu-select-input[disabled] {
    -webkit-text-fill-color: #000;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
  .clearfix:after {
    display: block;
    content: '';
    clear: both;
    height: 0;
    line-height: 0;
    visibility: hidden;
  }
  .search-btn {
    position: absolute;
    top: 7px;
    right: 20px;
    padding: 7px 10px 6px 12px;
    font-size: 12px;
    border: 1px solid #2d8cf0;
    background-color: #2d8cf0;
    color: #fff;
    border-radius: 4px;
    font-size: 13px;
    &:hover {
      cursor: pointer;
    }
    .search-icon {
      color: #fff;
    }
  }
  .settlement.ivu-card-shadow,
  .basic-info.ivu-card-shadow {
    box-shadow: none;
  }
  .basic-info-body {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    &-pic {
      width: 10%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 80%;
      }
      button {
        margin-top: 20px;
      }
    }
    &-input {
      width: 90%;
    }
    .ivu-form-item {
      margin-bottom: 0px !important;
    }
    .serch-unit-result {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      top: 30px;
      left: 0;
      z-index: 10;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      margin: 5px 0;
      overflow: auto;
      li {
        // color: #c5c8ce;
        padding: 0 10px;
        &:hover {
          background-color: #d6eaff;
        }
      }
    }
  }
  .price {
    font-size: 26px;
    color: #e51c23;
    padding-right: 10px;
  }
  .selected-package {
    min-height: 26px;
  }
  .pick-projects {
    height: 596px;
  }
  .unpick-packages-card {
    .ivu-radio-wrapper {
      font-size: 14px;
    }
  }
  .zk-table__cell-inner {
    font-size: 14px;
  }
  .ivu-scroll-container {
    &::-webkit-scrollbar {
      width: 5px;
      background-color: #eee;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-corner {
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
  }
  .zk-table {
    line-height: 20px;
    .zk-table__body-row {
      height: 20px;
    }
    .zk-table__body-wrapper {
      height: 460px !important;
    }
    .zk-table--empty-row {
      height: 460px;
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
  // 选择框禁止色改为白底 - 特殊需求
  .ivu-select-disabled .ivu-select-selection,
  .ivu-input {
    background-color: #fff;
  }
  // .demo-table-package-row td {
  //   // background-color:#2db7f5;
  //   background-color: #e0eefd;
  //   color: #333;
  //   opacity: 0.8;
  // }
}
</style>


