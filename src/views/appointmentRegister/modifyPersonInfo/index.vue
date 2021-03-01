
<template>
  <div class="personal-register-wrapper">
    <Form ref="patientInfoForm"
          :model="patientInfoForm"
          label-position="right"
          :rules="ruleValidate"
          :show-message="false"
          autocomplete="on">
      <div class="form-wrapper">
        <Card class="basic-info"
              :bordered="false"
              shadow>
          <Spin size="large"
                fix
                v-if="spinShow"></Spin>
          <div slot="title"
               class="search-title-wrapper">
            <span class="title">基本信息</span>
            <!-- <div class="search-btn"
                 @click="toBookingHistory">
              搜索历史预约
              <Icon type="ios-search"
                    class="search-icon"
                    size="16" />
            </div> -->
          </div>
          <div class="basic-info-body">
            <div class="basic-info-body-pic">
              <img :src="patientInfoForm.boPic"
                   v-if="!!patientInfoForm.boPic"
                   alt="登记用户头像">
              <img src="@/assets/images/userPhoto.png"
                   v-else
                   alt="登记用户头像">
              <Button type="primary"
                      @click="openCaptureModal">拍照采集</Button>
            </div>
            <div class="basic-info-body-input">
              <Row :gutter="16">
                <Col span="4">
                <FormItem label="姓名"
                          prop="boName"
                          :label-width="80">
                  <Input v-model="patientInfoForm.boName"
                         @on-search="openSearchPerson"
                         @on-blur="filterSpace"
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
                  <Input v-model.lazy="patientInfoForm.boIdNo"
                         @on-enter="getAgeAndBirthday"
                         @on-blur="AgeAndBirthday"
                         search
                         clearable
                         size="small" />
                </FormItem>
                </Col>
                <Col span="5">
                <FormItem label="就诊卡号"
                          prop="boVisitCardNumber"
                          :label-width="80">
                  <Input v-model="patientInfoForm.boVisitCardNumber"
                         @on-enter="getInfoByVisitCard"
                         size="small" />
                </FormItem>
                </Col>
                <Col span="5">
                <FormItem label="出生日期"
                          prop="boBirthday"
                          :label-width="80">
                  <DatePicker type="date"
                              placeholder="选择出生日期"
                              size="small"
                              clearable
                              v-model="patientInfoForm.boBirthday"
                              @on-change="changeBirthday"
                              @on-clear="clearBirthday"
                              :options="birth"></DatePicker>
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="16">
                <Col span="3">
                <FormItem label="性别"
                          prop="boSex"
                          :label-width="80">
                  <Select v-model="patientInfoForm.boSex"
                          @on-change="changeSex"
                          size="small">
                    <!-- <Option value="不限">不限</Option> -->
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="2">
                <FormItem label="年龄"
                          :label-width="40"
                          prop="boAge">
                  <Input v-model="patientInfoForm.boAge"
                         size="small"
                         disabled />
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="个人/单位"
                          :label-width="100"
                          prop="boIsUnit">
                  <RadioGroup v-model="patientInfoForm.boIsUnit"
                              @on-change="changeIsUnit"
                              size="small">
                    <Row>
                      <Col span="12">
                      <Radio label="0"
                             :disabled="getInfoByEnter">个人</Radio>
                      </Col>
                      <Col span="12">
                      <Radio label="1"
                             :disabled="getInfoByEnter">单位</Radio>
                      </Col>
                    </Row>
                  </RadioGroup>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="费别"
                          prop="boChargeTypeId"
                          :label-width="60">
                  <Select v-model="patientInfoForm.boChargeTypeId"
                          :label-in-value="true"
                          @on-change="changeChargeType"
                          :disabled="getInfoByEnter"
                          size="small">
                    <Option v-for="item in chargeTypeList"
                            :value="item.cdId"
                            :key="item.cdId">{{ item.cdName }}</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="3">
                <FormItem label="体检次数"
                          :label-width="70"
                          prop="boVisitSn">
                  <Input v-model="patientInfoForm.boVisitSn"
                         disabled
                         size="small" />
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="体检号"
                          :label-width="70"
                          prop="boPeId">
                  <Input v-model="patientInfoForm.boPeId"
                         disabled
                         size="small" />
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="预约日期"
                          :label-width="70"
                          prop="boBookingDate">
                  <Input v-model="patientInfoForm.boBookingDate"
                         disabled
                         size="small" />
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="16">
                <Col span="5">
                <FormItem label="联系方式"
                          prop="boMobile"
                          :label-width="80">
                  <Input v-model="patientInfoForm.boMobile"
                         clearable
                         size="small" />
                </FormItem>
                </Col>
                <Col span="5">
                <FormItem label="体检优先级"
                          prop="boPriorityId"
                          :label-width="85">
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

                <Col span="5">
                <FormItem label="体检类型"
                          prop="boCategoryId"
                          :label-width="80">
                  <Select v-model="patientInfoForm.boCategoryId"
                          :disabled="getInfoByEnter"
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
                <FormItem label="人员来源"
                          prop="boSourceId"
                          :label-width="70">
                  <Select v-model="patientInfoForm.boSourceId"
                          size="small"
                          :disabled="getInfoByEnter"
                          @on-change="changeSource"
                          :label-in-value="true">
                    <Option v-for="item in sourceList"
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
              </Row>
              <Row :gutter="16">
                <Col span="10">
                <FormItem label="单位名称"
                          prop="boUnitId"
                          :label-width="80">
                  <Select v-model="patientInfoForm.boUnitId"
                          :disabled="importData"
                          class="unitSelect"
                          size="small">
                    <Option v-for="item in unitsList"
                            :value="item.boUnitId"
                            :key="item.boUnitId">{{ item.boUnitName }}</Option>
                  </Select>
                </FormItem>

                </Col>
                <Col span="5">
                <FormItem label="体检分组"
                          prop="boGroupId"
                          :label-width="80">
                  <Select v-model="patientInfoForm.boGroupId"
                          :disabled="importData"
                          size="small"
                          clearable>
                    <Option v-for="item in groupsList"
                            :value="item.boGroupId"
                            :key="item.boGroupId">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="9">
                <FormItem label="详细地址"
                          prop="boAddress"
                          :label-width="70">
                  <Input v-model="patientInfoForm.boAddress"
                         size="small"
                         clearable />
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="16">
                <Col span="5">
                <FormItem label="登记流水号"
                          prop="boRegisterCode"
                          style="margin-left:-15px;"
                          :label-width="95">
                  <Input v-model="patientInfoForm.boRegisterCode"
                         ref="inputFocus"
                         @on-search="openSearchPersonByCode"
                         search
                         clearable
                         size="small" />
                </FormItem>
                </Col>
              </Row>
              <Row :gutter="16"
                   type="flex"
                   justify="end">
                <Col span="3">
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
                <Col span="4">
                <FormItem class="settlement-sel-group"
                          v-permission="['print']"
                          prop="selGroup">
                  <CheckboxGroup v-model="patientInfoForm.selGroup">
                    <!-- <Checkbox label="createRequestNote"
                                  v-permission="['print']"
                                  disabled>打印申请单</Checkbox> -->
                    <Checkbox label="printGuide">打印指引单</Checkbox>
                    <Checkbox label="printSampleCode">打印样本条码</Checkbox>
                  </CheckboxGroup>
                </FormItem>
                </Col>
                <Col span="6">
                <Button type="primary"
                        style="margin-left: 10px;float: right;"
                        @click="handleSubmit('patientInfoForm')"
                        :loading="isLoading"
                        v-permission="['add']">保存</Button>
                <Button type="error"
                        style="margin-left: 10px;float: right;"
                        @click="handleReset('patientInfoForm')">清空</Button>
                <Button id='readIDCard'
                        type="primary"
                        style="float: right;"
                        @click="readIdCard">扫描证件</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </div>
    </Form>
    <Row :gutter="8">
      <Col span="4">
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
                        :disabled="importData"
                        @search="searchPackage"
                        @clear="clearPackage"
                        @selectOption="selectPackage"></input-drop>
          </div>
        </div>
        <Scroll :height="399"
                :on-reach-bottom="reachPackageBottom"
                :distance-to-edge="-24">
          <RadioGroup v-model="userPickPackageId"
                      class="unselect-package"
                      vertical
                      @on-change="changePackage">
            <Radio :label="item.id"
                   v-for="item in allPackages"
                   :key="item.rowId"
                   class="unselect-package-item"
                   :disabled="importData">{{item.name}}</Radio>
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
          <Tag color="primary"
               style="fontSize: 14px;"
               v-if="userPickPackageName">{{ userPickPackageName }}</Tag>
        </div>
      </Card>
      </Col>
      <Col span="8">
      <Card :bordered="false"
            class="unpick-projects-card"
            shadow>
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">未选项目</span>
          <div class="title-right-tool">
            <input-drop ref="projectInputDrop"
                        :width="240"
                        placeholder="项目简码或名称"
                        :dropList="searchProList"
                        :isLoading="projectSearchLoading"
                        @search="searchProject"
                        @clear="clearProject"
                        @selectOption="selectProject"></input-drop>
          </div>
        </div>
        <Row :gutter="16"
             class="select-groups">
          <Col span="4">
          <span>科室分类</span>
          </Col>
          <Col span="8">
          <Select v-model="paDeptId"
                  filterable
                  size="small"
                  @on-change="changeItem">
            <Option value="all"
                    :key="1 + new Date().getTime()">全部</Option>
            <Option v-for="item in deptList"
                    :value="item.poId"
                    :key="item.poId">{{ item.poDeptName }}</Option>
          </Select>
          </Col>
          <Col span="4">
          <span>共{{totalItemNum}}项</span>
          </Col>
          <!-- <Col span="4">
                                <span>项目分类</span>
                            </Col> -->
          <!-- <Col span="8">
                                <Select v-model="isComboProject" filterable size="small">
                                    <Option value="1">体检项目组合</Option>
                                    <Option value="2">体检单项</Option>
                                </Select>
                            </Col> -->
        </Row>
        <Scroll :height="465"
                style="margin-top:20px;"
                :on-reach-bottom="handleReachBottom"
                :distance-to-edge="-24">
          <CheckboxGroup v-model="pickProjects"
                         class="unpick-projects"
                         @on-change="changeProject">
            <Checkbox :label="item.id"
                      v-for="(item, index) in projects"
                      :key="index"
                      class="unpick-projects-item"
                      :disabled="item.gray">
              <!-- <Icon type="ios-flask-outline" style="color:#2d8cf0;" v-if="item.isCombo"></Icon>
                                        <Icon type="ios-flask" style="color:#2d8cf0;" v-else></Icon> -->
              <!-- <Icon type="ios-flask-outline"
                      style="color:#2d8cf0;"></Icon> -->
              <span style="margin-left: 3px;">{{item.name}}</span>
            </Checkbox>
          </CheckboxGroup>
        </Scroll>
      </Card>
      </Col>
      <Col span="12">
      <Card :bordered="false"
            shadow
            class="pick-projects">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">已选项目</span>
          <!-- <span style="margin-left:10px; color:#e51c23;">自费一栏，打勾为“自费”项目，不打勾为“非自费”项目</span> -->
          <div class="title-right-tool">
            <!-- <Button @click="printInvoice"
                    style="margin-right: 8px;"
                    size="small">打印价格明细</Button>
            <Button @click="openPriceModal"
                    style="margin-right: 8px;"
                    size="small">申请改价</Button> -->
            <Button type="default"
                    @click="delAddItem"
                    size="small">清空新增项目</Button>
          </div>
        </div>
        <tree-table ref="registerTreeTable"
                    :key="1"
                    :columns="pickProjectsCols"
                    :data="pickProjectsTableData"
                    :expand-type="false"
                    :is-fold="false"
                    :selectable="false"
                    :show-row-hover="true"
                    :empty-text="emptyText"
                    :row-class-name="addItemColor"
                    @row-dblclick="delTableData"
                    expand-key="paName"
                    border>
          <!-- <template slot="paExamType"
                      slot-scope="{row}">
              <span>{{row.paExamType}}</span>
            </template> -->
          <template slot="paName"
                    align="center"
                    slot-scope="{row}">
            <span>{{row.paName}}</span>
          </template>
          <!-- <template slot="paId"
                        slot-scope="{row}">
                <span>{{row.paId}}</span>
              </template> -->
          <template slot="paPrice"
                    slot-scope="{row}">
            <span>{{row.paPrice}}</span>
          </template>
          <template slot="paDeptName"
                    slot-scope="{row}">
            <span>{{row.paDeptName}}</span>
          </template>
          <!-- <template slot="boPackageId"
                        slot-scope="{row}">
                <span>{{row.packageId}}</span>
              </template> -->
          <template slot="boIsOwnExpense"
                    slot-scope="{row, rowIndex}">
            <Checkbox v-model="row.boIsOwnExpense"
                      :key="rowIndex"
                      @on-change="changeTableCharge(row, rowIndex)"
                      :disabled="patientInfoForm.grayOwnExpense"
                      true-value="1"
                      false-value="0"></Checkbox>
          </template>
          <template slot="isRegister"
                    slot-scope="{row}">
            <Tag color="success"
                 v-if="row.isRegister == 0">已登记</Tag>
            <Tag color="warning"
                 v-else-if="row.isRegister == 1">未登记</Tag>
          </template>
          <template slot="boIsCompleted"
                    slot-scope="{row}">
            <Tag v-if="row.boIsCompleted==0"
                 color="blue">未检</Tag>
            <Tag v-if="row.boIsCompleted==1"
                 color="green">已检</Tag>
            <Tag v-if="row.boIsCompleted==2"
                 color="red">拒检</Tag>
            <Tag v-if="row.boIsCompleted==3"
                 color="orange">延期</Tag>
            <Tag v-if="row.boIsCompleted==4"
                 color="cyan">等待报告</Tag>
          </template>
          <template slot="boBillStatus"
                    slot-scope="{row}">
            <Tag v-if="row.boBillStatus==1"
                 color="volcano">未缴费</Tag>
            <Tag v-if="row.boBillStatus==2"
                 color="green">已缴费</Tag>
          </template>
        </tree-table>
        <div class="settlement">
          <div class="settlement-text">
            <p>总计：
              <span class="count">{{pickProjectsTableData.length}}</span>项
            </p>
            <p>检验项总计：
              <span class="count">{{totalInspect}}</span>项
            </p>
            <p>加项总计:
              <span class="count">{{totalAddItem}}</span>项
            </p>
            <p>加项金额:
              <span class="count">{{totalAddItemPrice}}</span>元
            </p>

          </div>
          <div class="settlement-text">
            <p v-show="!fixPrice">总金额：
              <span class="price">{{totalPrice/100}}</span>元
            </p>
            <p v-show="fixPrice">总金额（已改价）：
              <span class="price">{{Number.prototype.add(payMoney,notPay)}}</span>元
            </p>
            <p>已缴费:
              <span class="price">{{payMoney}}</span>元
            </p>
            <p>待缴费:
              <span class="price">{{notPay}}</span>元
            </p>
          </div>
        </div>
      </Card>
      </Col>
    </Row>
    <search-person :visible="personModalVisible"
                   :boname="boName"
                   :tableData="personTableData"
                   :isLoading="searchPersonLoading"
                   :totalItems="personTotalSize"
                   @searchName="searchName"
                   ref="searchPerson"
                   @importPerson="importPersonalRecord"
                   @close="closePerson"></search-person>
    <!-- <book-history :visible="historyModalVisible"
                  @importRecord="importPersonalRecord"
                  @close="closeHistory"></book-history> -->
    <capture :visible="captureModalVisible"
             v-if="hackReset"
             @cancel="closeCaptureModal"
             @ok="importPic"></capture>
    <!-- <change-price :visible="priceModalVisible"
                  :oldPrice="totalPrice"
                  @cancel="priceModalVisible = false"
                  @newPrice="applyNewPrice"></change-price> -->
  </div>
</template>

<script>
import moment from 'moment'
import InputDrop from "@/views/appointmentRegister/components/inputDrop"
import SearchPerson from '@/views/appointmentRegister/components/modifySearch';
import BookHistory from '@/views/appointmentRegister/components/bookHistory';
import Capture from '@/views/appointmentRegister/components/capture'
// import ChangePrice from './changePrice'
import {
  getSelectionList,
  validate,
  commonFunc,
  selectUnit,
  selectProject
} from '@/views/appointmentRegister/components/mixins/bookRegister.js'
import {
  getBookingPackage,
  getComboByPackage,
  searchGroupProjects,
  listAllByUnitId,
  getItemByPage,
  getItemTreeByComboId,
  printBarcode,
  printGuide,
  printDetail
} from '@/api/personal_register.js';
import { findLastRegisterInfo, save } from '@/api/modify_personInfo.js';
import { getMoreItemTree } from '@/api/groupManage.js'
import { getBirthAndAge } from "@/libs/tools.js";
import { getPrinterConfigFromLocalstorage } from '@/libs/util'
import { printFunc } from '@/libs/printOrder.js'
import { directPrintFunc } from '@/libs/directPrint.js'
// import $ from 'jquery'
import jsonp from 'jsonp'
import config from '@/config'

export default {
  name: 'personalRegister',
  mixins: [getSelectionList, validate, commonFunc, selectUnit, selectProject],
  components: {
    InputDrop,
    BookHistory,
    Capture,
    // ChangePrice,
    SearchPerson
  },
  data () {
    const checkPhone = (rule, value, callback) => {
      if (!value || (value && value.trim() === '')) {
        callback()
      } else {
        const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/ //  带杠的电话号码
        const reg2 = /^1[3|4|5|6|7|8][0-9]{9}$/ // 手机号码
        const reg3 = /^[0-9]{11,12}$/ //  纯数字的电话号码
        if (!reg.test(value) && !reg2.test(value) && !reg3.test(value)) {
          callback(new Error('手机号或座机号有误'))
        }
        callback()
      }
    }
    return {
      ruleValidate: {
        boPeId: [
          { required: true, message: '体检号不能为空' }
        ],
        boIsUnit: [
          { required: true, message: '请选择个人/单位' }
        ],
        boMobile: [
          // { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'change' }
        ],
      },
      birth: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000;
        }
      },
      labelNumList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      pickProjects: [], //未选项目多选值保存
      projects: [],    //多选框项目保存
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
        labelNum: '1',
        selGroup: ['printGuide', 'printSampleCode'],
        boGroupId: '',
        boUnitId: '',
        boMaritalStatus: '',
        boCategoryId: ''
      },
      pickProjectsCols: [
        {
          type: 'template',
          title: '自费',
          key: 'boIsOwnExpense',
          template: 'boIsOwnExpense',
          width: 50,
          align: 'center',
          headerAlign: 'center',
        },
        {
          type: 'template',
          title: '类型',
          key: 'isRegister',
          template: 'isRegister',
          width: 80,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '所属科室',
          key: 'paDeptName',
          width: 120,
          template: 'paDeptName',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '项目名称',
          key: 'paName',
          minWidth: 180,
          template: 'paName',
          align: 'left',
          headerAlign: 'center'
        },
        {
          type: 'template',
          title: '体检状态',
          key: 'boIsCompleted',
          template: 'boIsCompleted',
          width: 80,
          align: 'center',
          headerAlign: 'center'
        },
        {
          type: 'template',
          title: '缴费状态',
          key: 'boBillStatus',
          template: 'boBillStatus',
          width: 80,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '单价（元）',
          key: 'paPrice',
          template: 'paPrice',
          width: 88,
          align: 'center',
          headerAlign: 'center'
        }
      ],
      historyModalVisible: false,
      captureModalVisible: false,
      priceModalVisible: false,
      personModalVisible: false,
      isLoading: false,
      hackReset: false,
      paDeptId: 'all',
      isComboProject: '1',
      // comboPages: 1,
      comboPageIndex: 1,
      comboPageSize: 40,
      itemList: [],
      delItemList: [],
      tempPick: [],
      tempPickLength: 0,
      totalItemNum: [],
      boName: '',
      registerCode: '',
      boPic: '',  // 保存身份证照片
      printParams: {},
      fixPrice: false, //判断改价后显示改价价格
      groupAddItems: [], //单位分组加项保存
      groupPayType: '', //分组支付方式
      addPayType: '', //加项支付方式
      searchPersonLoading: false,
      personTableData: [],
      personTotalSize: 0,
      payMoney: 0,  //接收已缴费
      noPayMoney: 0,  //接收待缴费
      spinShow: false, // 全屏loading开关
    }
  },
  computed: {
    deptList: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    totalPrice () {
      return this.pickProjectsTableData.reduce((total, currentValue) => {
        if (currentValue.paPrice == null) currentValue.paPrice = 0
        return total + Number.prototype.mul(currentValue.paPrice, 100);
      }, 0);
    },
    totalAddItem () {
      let num = 0;
      this.pickProjectsTableData.forEach(item => {
        if (item.boIsAdditional == 1) {
          num++
        }
      })
      return num;
    },
    totalAddItemPrice () {
      let price = 0;
      this.pickProjectsTableData.forEach(item => {
        if (item.boIsAdditional == 1) {
          if (item.paPrice == null) item.paPrice = 0
          price += Number.prototype.mul(item.paPrice, 100)
        }
      })
      price = Number.prototype.div(price, 100)
      return price
    },
    totalInspect () {
      let num = 0;
      this.pickProjectsTableData.forEach(item => {
        if (item.paTestTubeId != null) {
          num++
        }
      })
      return num;
    },
    // pay () {
    //   let price = 0;
    //   this.pickProjectsTableData.forEach(item => {
    //     if (item.boBillStatus == 2) {
    //       if (item.paPrice == null) item.paPrice = 0
    //       price += Number.prototype.mul(item.paPrice, 100)
    //     }
    //   })
    //   price = Number.prototype.div(price, 100)
    //   return price
    // },
    notPay () {
      let price = 0;
      this.pickProjectsTableData.forEach(item => {
        if (item.boBillStatus == 1) {
          if (item.paPrice == null) item.paPrice = 0
          price += Number.prototype.mul(item.paPrice, 100)
          // price = Number.prototype.add(price, item.paPrice)
        }
      })
      // let noPayMoney = Number.prototype.mul(this.noPayMoney, 100)
      // price = Number.prototype.add(price, noPayMoney)
      price = Number.prototype.div(price, 100)
      // return Number.prototype.add(price, this.noPayMoney)
      return price
    }
  },
  created () {
    //获取科室
    this.$store.dispatch('getRoomDict');
    this.getPackagesList();
    this.showItem();
    let printConfig = getPrinterConfigFromLocalstorage()
    if (printConfig.hasOwnProperty('labelNum')) {
      this.patientInfoForm.labelNum = printConfig.labelNum.toString()
    } else {
      this.patientInfoForm.labelNum = '1'
    }
    // 聚焦文本框
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
  },
  methods: {
    //打印价格明细
    // async printInvoice () {
    //   if (!this.pickProjectsTableData.length) {
    //     this.$Message.warning('未选择套餐项目，不可打印价格明细')
    //     return
    //   }
    //   console.log('价格明细表格')
    //   console.log(this.pickProjectsTableData)
    //   let arr = []
    //   this.pickProjectsTableData.forEach(item => {
    //     arr.push({
    //       paIsOwnExcepense: item.boIsOwnExpense,
    //       paIsAdditional: item.boIsAdditional,
    //       paDeptName: item.paDeptName,
    //       paComboName: item.paName,
    //       paPrice: item.paPrice,
    //       paTestTubeId: item.paTestTubeId,
    //       paIsAddItem: item.isRegister
    //     })
    //   })
    //   try {
    //     let { data } = await printDetail(arr)
    //     // console.log(data)
    //     if (data.code === 0) {
    //       printFunc({
    //         guideUrl: this.$url + data.data,
    //         selGroup: ['printGuide'],
    //         taskName: '价格明细'
    //       })
    //     } else {
    //       this.$Message.error(data.message)
    //     }
    //   } catch (err) {
    //     this.$Message.error('网络不稳定，请稍后尝试')
    //   }
    // },
    //需要传给后台的未登记的项目参数
    pushItemList (delItem) {
      this.pickProjectsTableData.forEach((item, index) => {
        //  未登记算加项, 要传给后台
        if (item.isRegister == 1) {
          console.log('触发加项push ItemList')
          this.itemList.push({
            boComboId: item.paId,
            boComboName: item.paName,
            boDeptId: item.paDeptId,
            boDeptName: item.paDeptName,
            boComboSort: item.boComboSort,
            boIsOwnExpense: item.boIsOwnExpense,  //自费标志
            boIsAdditional: item.boIsAdditional,  //加项标志
            boAmount: item.boAmount,  // 费用
            boRealAmount: item.paPrice  // 应收费用
          })
        }
      })
      if (delItem != undefined && JSON.stringify(delItem) != '[]') {
        // 已登记算减项，要传给后台
        console.log('触发减项push DelItemList')
        console.log(delItem)
        let arr = delItem[0]
        this.delItemList.push({
          boId: arr.boId,
          boComboId: arr.paId,
          boComboName: arr.paName,
          boDeptId: arr.paDeptId,
          boDeptName: arr.paDeptName,
          boComboSort: arr.boComboSort,
          boIsOwnExpense: arr.boIsOwnExpense,  //自费标志
          boIsAdditional: arr.boIsAdditional,  //加项标志
          boAmount: arr.boAmount,  // 费用
          boRealAmount: arr.paPrice  // 应收费用
        })
      }
    },
    //保存已选项目表格中自费勾选项
    changeTableCharge (row, rowIndex) {
      // console.log('自费勾选项')
      // console.log(this.$refs.registerTreeTable)
      let arr = this.$refs.registerTreeTable.bodyData
      //解决勾选后，计算已缴费，待缴费数字不变动的问题
      this.pickProjectsTableData = Object.assign([], this.pickProjectsTableData, arr)
      this.itemList = []
      this.pushItemList();
      // console.log(this.pickProjectsTableData)
    },
    delAddItem () {
      // console.log('清空新增项目')
      // console.log(this.itemList.length)
      let len = this.itemList.length
      this.pickProjectsTableData.splice(0, len)
      this.grayOff(this.pickProjectsTableData)
      this.itemList = [];
      this.patientInfoForm.personalItem = [];
    },
    //双击删除表格中的项目
    delTableData (row, rowIndex, e) {
      let delItem = [];
      // boIsCompleted: '0',  // 未检
      // boBillStatus: '1'  // 未缴费
      // row.isRegister:  0 //已登记
      //个人人员，未缴费并且未检查的可减项
      if (this.patientInfoForm.boIsUnit == '0') {
        if (row.boIsCompleted != 0 || row.boBillStatus == 2) {
          this.$Message.warning("已检查或已缴费项目不可更改，可加做项目")
          return
        } else {
          if (row.isRegister == 0) {
            delItem = this.pickProjectsTableData.splice(rowIndex, 1)
            console.log('已删除的减项')
            console.log(delItem)
          }
          if (row.isRegister == 1) {
            this.pickProjectsTableData.splice(rowIndex, 1)
          }
        }
      }

      // 单位人员，单位付费，已缴费未检查的可以减项；个人支付，已缴费未检查不可减项
      if (this.patientInfoForm.boIsUnit == '1') {
        if (row.boIsCompleted != 0) {
          this.$Message.warning("单位人员,已检查或拒检的项目不可更改，可加做项目")
          return
        } else if (row.boIsCompleted == 0 && row.boIsOwnExpense == 1 && row.boBillStatus == 2) {
          this.$Message.warning("单位人员，由个人支付的已缴费项目不可更改，可加做项目")
          return
        } else {
          if (row.isRegister == 0) {
            delItem = this.pickProjectsTableData.splice(rowIndex, 1)
            console.log('已删除的减项')
            console.log(delItem)
          }
          if (row.isRegister == 1) {
            this.pickProjectsTableData.splice(rowIndex, 1)
          }
        }
      }

      this.projectsChecked(this.pickProjectsTableData)
      // 清空加项list
      this.itemList = [];
      this.pushItemList(delItem);

      if (!this.pickProjectsTableData.length) {
        this.emptyText = '暂无数据'
      }
      console.log('删除加项')
      console.log(this.itemList)
      console.log('删除减项')
      console.log(this.delItemList)
    },
    //高亮表格中的加项颜色
    addItemColor (row, index) {
      let r = this.pickProjectsTableData.filter((val, index) => {
        return val.isRegister == 1  // 0 - 套餐， 1 - 加做，2 - 自选
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
    //更改个人/单位
    changeIsUnit (e) {
      console.log(e)
      //单位的（1）： 不能换套餐，只可以加项目
      if (e == 1 && this.pickProjectsTableData.length) {
        console.log('no')
        // this.$set(this.patientInfoForm, 'grayOwnExpense', false)
        this.$set(this.patientInfoForm, 'grayOwnExpense', true)
        this.pickProjectsTableData.forEach(item => {
          item.boIsOwnExpense = '0'
        })
        console.log(this.pickProjectsTableData)
        this.grayOff(this.pickProjectsTableData);
        this.grayAllPackage();
      }
      //个人的（0）： 随意更改套餐，加减项目
      if (e == 0 && this.pickProjectsTableData.length) {
        console.log('iam')
        this.delGrayOffAllPackage()
        this.delGrayOff()
        this.$set(this.patientInfoForm, 'grayOwnExpense', true)
        this.pickProjectsTableData.forEach(item => {
          item.boIsOwnExpense = '1'
        })
        console.log(this.pickProjectsTableData)
        this.projectsChecked(this.pickProjectsTableData);
      }
    },
    //更改体检分组
    // async changeUnitGroup (e) {
    //   // if (!this.importData) {
    //   //   this.$set(this.patientInfoForm, "boPackageId", '')
    //   //   this.$set(this.patientInfoForm, "boPackageCode", '')
    //   //   this.$set(this.patientInfoForm, "boPackageName", '')
    //   //   this.delPickProjects();
    //   // }
    //   // if (!e) return
    //   // this.$set(this.patientInfoForm, 'boIsUnit', '1')
    //   // let packageCode = ''
    //   // let params = {
    //   //   boGroupingId: e,
    //   //   sort: 3 //用于获取数据排序 - 套餐优先
    //   // }
    //   // try {
    //   //   let { data } = await searchGroupProjects(params);
    //   //   console.log(data)
    //   //   if (data.code === 0) {
    //   //     // 分组带出来的项目，根据groupPayType=0时，默认非自费，=1是默认自费。
    //   //     // 在这基础上加项的，addPayType=0的时候，默认非自费。=1的时候，默认自费
    //   //     this.groupPayType = data.data.groupPayType
    //   //     this.addPayType = data.data.addPayType
    //   //     console.log(this.groupPayType + '分组支付')
    //   //     console.log(this.addPayType + '加项支付')
    //   //     data.data.data.forEach(item => {
    //   //       if (item.boObjectType == 3) {
    //   //         console.log(item.boObjectId)
    //   //         packageCode = item.boObjectCode
    //   //         this.userPickPackageId = item.boObjectId;
    //   //         this.userPickPackageName = item.boObjectName;
    //   //       }
    //   //       if (item.boObjectType == 2) {
    //   //         this.groupAddItems.push(item.boObjectId)
    //   //       }
    //   //     })
    //   //     if (!!this.userPickPackageId) {
    //   //       this.emptyText = '数据加载中...';
    //   //       let comboParams = {
    //   //         paPackageId: this.userPickPackageId
    //   //       };
    //   //       let packageRes = await getComboByPackage(comboParams);
    //   //       console.log(packageRes)
    //   //       if (packageRes.data.code === 0) {
    //   //         //数组深拷贝
    //   //         [...this.pickProjectsTableData] = packageRes.data.data;
    //   //         this.emptyText = '此套餐下无项目组合';
    //   //       } else {
    //   //         this.emptyText = '暂无数据';
    //   //         this.$Message.error(packageRes.data.message);
    //   //       }
    //   //       this.isUnit(this.userPickPackageId, this.groupPayType, this.addPayType);
    //   //       this.grayAllPackage();
    //   //     }

    //   //     if (this.groupAddItems.length) {
    //   //       let addItemRes = await getMoreItemTree({ paComboId: this.groupAddItems })
    //   //       console.log(addItemRes)
    //   //       if (addItemRes.data.code === 0) {
    //   //         addItemRes.data.data.forEach(item => {
    //   //           this.pickProjectsTableData.unshift({
    //   //             paId: item.id,
    //   //             paCode: item.comboCode,
    //   //             paName: item.comboName,
    //   //             paExamType: item.examType,
    //   //             paPrice: item.price,
    //   //             paDeptId: item.deptId,
    //   //             paDeptName: item.deptName,
    //   //             children: {
    //   //               paId: item.children.id,
    //   //               paName: item.children.itemName,
    //   //               paPrice: item.children.price
    //   //             },
    //   //             isRegister: 1,
    //   //             boIsOwnExpense: this.groupPayType,
    //   //             boIsAdditional: 1,
    //   //             boComboSort: item.sort,
    //   //             paTestTubeId: item.testTubeId
    //   //           })
    //   //         })
    //   //         // this.$set(this.patientInfoForm, 'grayOwnExpense', false)
    //   //         this.$set(this.patientInfoForm, 'grayOwnExpense', true)
    //   //         this.grayOff(this.pickProjectsTableData);
    //   //         this.grayAllPackage();
    //   //         if (!this.userPickPackageId) {
    //   //           this.pickProjectsTableData.forEach(item => {
    //   //             // item.isRegister = '自选'
    //   //             item.isRegister = 2
    //   //           })
    //   //         }
    //   //       } else {
    //   //         this.emptyText = '暂无数据';
    //   //         this.$Message.error(addItemRes.data.message);
    //   //       }
    //   //     }
    //   //     //更新要传的东西
    //   //     this.pushItemList();
    //   //     this.$set(this.patientInfoForm, 'boPackageId', this.userPickPackageId)
    //   //     this.$set(this.patientInfoForm, 'boPackageName', this.userPickPackageName)
    //   //     this.$set(this.patientInfoForm, 'boPackageCode', packageCode)
    //   //   } else {
    //   //     this.$Message.error(data.message);
    //   //   }
    //   // } catch (err) {
    //   //   console.log(err)
    //   //   // this.$Message.error(err)
    //   //   this.$Message.error('网络不稳定，请稍后重试')
    //   // }
    // },
    // 查询体检分组
    getGroups () {
      let groupParam = {
        boUnitId: this.patientInfoForm.boUnitId,
        boSex: this.patientInfoForm.boSex
      }
      listAllByUnitId(groupParam).then(res => {
        // console.log(res);
        let result = res.data;
        if (result.code === 0) {
          this.groupsList = result.data;
        } else {
          this.$Message.error(result.Message);
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
        labelNum: '1',
        selGroup: ['printGuide', 'printSampleCode'],
        boGroupId: '',
        boUnitId: '',
        boUnitName: '',
        boMaritalStatus: '',
        boCategoryId: ''
      };
      let printConfig = getPrinterConfigFromLocalstorage()
      if (printConfig.hasOwnProperty('labelNum')) {
        this.patientInfoForm.labelNum = printConfig.labelNum.toString()
      } else {
        this.patientInfoForm.labelNum = '1'
      }
      this.$refs[form].resetFields();
      console.log('清空表单')
      console.log(this.patientInfoForm)
      // this.grayInput = true;
      this.printParams = {};
      this.fixPrice = false;
      this.setChargTypeDefault();
    },
    //已选项目上的清空按钮
    delPickProjects () {
      this.multiplyPackage = false
      this.isProjectMore = false
      this.isPackageMore = false
      this.$refs.packageInputDrop.filterText = "";
      this.$refs.projectInputDrop.filterText = "";
      this.pickProjectsTableData = [];
      this.emptyText = '暂无数据';
      this.allPackages = [];
      this.packagePageIndex = 1
      this.getPackagesList();
      this.$set(this.patientInfoForm, "personalItem", [])
      this.userPickPackageId = '';
      this.userPickPackageName = '';
      this.paDeptId = 'all';
      this.pickProjects = [];
      this.projects = [];
      this.comboPageIndex = 1;
      this.showItem();
      this.tempPick = [];
      this.tempPickLength = 0;
      this.itemList = [];
      this.delItemList = [];
      this.groupAddItems = [];
      this.fixPrice = false;
      this.payMoney = 0;
      this.noPayMoney = 0;
      // this.unitsList = [];
      // this.groupsList = [];
      this.searchPackageList = [];
      this.searchProList = [];
      // this.groupPayType = '';
      // this.addPayType = '';
      console.log('清空项目')
      console.log(this.patientInfoForm)
    },
    //改变性别时，更改体检分组以及套餐
    changeSex () {
      //如果是查询历史记录，boSex值为undefined； 如果是手动选择变更性别，boSex则有值
      // console.log(this.patientInfoForm.boSex + '变更');
      if (this.patientInfoForm.boSex && !this.importData) {
        this.multiplyPackage = false
        this.delPickProjects();
      }
    },
    //清空护士端登记页面的所有信息
    handleReset (form) {
      this.importData = false;
      this.getInfoByEnter = false;
      this.boPic = '';
      this.unitsList = [];
      this.groupsList = [];
      this.clearForm(form);
      this.delPickProjects();
    },
    async saveAction () {
      this.isLoading = true;
      this.patientInfoForm.boSettleStatus = "0";
      this.patientInfoForm.boUnitId = this.patientInfoForm.boUnitId || '0';  //无单位时，ID值传0
      this.patientInfoForm.personalItem = this.itemList;  //  未登记的加项项目
      this.patientInfoForm.delPersonalItem = this.delItemList;  //  已登记的减项项目
      this.patientInfoForm.boBirthday = moment(this.patientInfoForm.boBirthday).format('YYYY-MM-DD')
      console.log('保存表单')
      console.log(this.patientInfoForm)
      if (/\.(jpeg|png|jpg)/i.test(this.patientInfoForm.boPic)) {
        this.patientInfoForm.boPic = this.patientInfoForm.boPic.split('?')[0]
      }

      try {
        const { data } = await save(this.patientInfoForm)
        // console.log(data)
        this.isLoading = false;
        if (data.code == 0) {
          this.printParams = {};
          // this.$Message.success(`登记成功!`)
          if (JSON.stringify(data.data.del) === '[]') {
            this.$Modal.success({
              title: '和湛科技体检系统',
              content: '登记成功',
              closable: true
            });
          } else {
            let str = ''
            data.data.del.forEach(item => {
              str += item.boComboName + '<br/>'
            })
            this.$Modal.success({
              title: '和湛科技体检系统',
              content: `登记成功，部分项目修改失败，减项失败项目如下:<br/><span style="color:red;font-weight:bold;">${str}<span>`,
              closable: true
            });
          }

          // 如果该页面没有打印权限，则返回
          if (!this.checkPrintAuthority()) return false;

          if (this.patientInfoForm.selGroup.indexOf('printSampleCode') > -1 && data.data.sampleList) {
            const sampleRes = await printBarcode({
              boIds: data.data.sampleList,
              labelNum: this.patientInfoForm.labelNum,
              addItemLogo: ""  //  登记后加减项标志
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
          console.log('打印参数');
          console.log(this.printParams);

          let printConfig = getPrinterConfigFromLocalstorage()
          if (printConfig.browserPreview) {
            if (this.printParams.selGroup.length) {
              if (!!this.printParams.barcodeUrl) {
                window.open(this.printParams.barcodeUrl, '_blank', 'location=yes,height=650,width=570,scrollbars=yes,status=yes,left=30')
              }
              if (!!this.printParams.guideUrl) {
                window.open(this.printParams.guideUrl, '_blank', 'location=yes,height=650,width=800,scrollbars=yes,status=yes,left=620')
              }
            }
          }
          if (printConfig.lodopPreview) {
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
          this.handleReset('patientInfoForm')
        } else {
          this.$Message.error(`${data.message}`);
        }
      } catch (err) {
        console.log(err)
        this.isLoading = false;
        this.$Message.error('网络不稳定，请稍后重试')
      }
    },
    //检查当前页面打印权限
    checkPrintAuthority () {
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
            this.$Message.error('保存失败，您还未选择待检套餐或项目');
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
                this.getInfoByEnter = false;
              },
              onCancel: () => {
                return
              }
            });
          } else {
            this.saveAction();
            this.getInfoByEnter = false;
          }

        }
      })
    },
    //打开预约历史框
    // toBookingHistory () {
    //   this.historyModalVisible = true;
    // },
    //导入预约用户图片地址
    importPic (base64Url) {
      // console.log(base64Url);
      this.patientInfoForm.boPic = base64Url;
    },
    // 未选套餐和未选项目 勾选
    checkUnpickItems () {
      for (let i = 0; i < this.patientInfoForm.personalItemList.length; i++) {
        if (this.patientInfoForm.personalItemList[i].boIsModifyPrice === 1) {
          this.fixPrice = true;
          break;
        }
      }
      // 已登记的项目自费栏勾选灰掉
      this.patientInfoForm.grayOwnExpense = true;
      // 获取已登记的套餐组合项目，添加到已选项目表格中，不可修改删除
      if (this.patientInfoForm.personalItemList) {
        this.patientInfoForm.personalItemList.forEach(item => {
          this.pickProjectsTableData.push({
            boId: item.boId,
            paId: item.boComboId,
            paName: item.boComboName,
            paPrice: item.boRealAmount,
            paDeptId: item.boDeptId,
            paDeptName: item.boDeptName,
            paTestTubeId: item.boShowType == 3 ? true : null,
            isRegister: 0,  // 已登记
            boIsAdditional: item.boIsAdditional,
            boComboSort: item.boComboSort,
            boIsOwnExpense: item.boIsOwnExpense,
            boAmount: item.boAmount,
            boIsCompleted: item.boIsCompleted,
            boBillStatus: item.boBillStatus
          })
        })
      }
      this.userPickPackageId = this.patientInfoForm.boPackageId;
      this.userPickPackageName = this.patientInfoForm.boPackageName;
      console.log('1111adsad')
      console.log(this.pickProjectsTableData)
    },
    //导入个人信息到表单中
    importPersonalRecord (formData) {
      // console.log(formData);
      this.getInfoByEnter = true;
      this.importData = true;
      this.clearForm('patientInfoForm');
      Object.assign(this.patientInfoForm, formData)
      this.$nextTick(() => {
        this.$set(this.patientInfoForm, 'boChargeTypeId', formData.boChargeTypeId)
        console.log(this.patientInfoForm)
      })
      this.delPickProjects();
      this.payMoney = formData.payMoneied
      this.noPayMoney = formData.noPayMoney

      console.log('已缴费' + this.payMoney + '待缴费' + this.noPayMoney)
      if (!!this.patientInfoForm.boPic) {
        let picUrl = this.$url + this.patientInfoForm.boPic + '?time=' + new Date().getTime()
        this.$set(this.patientInfoForm, 'boPic', picUrl)
      }
      // this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn;
      // formData.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true;
      this.patientInfoForm.boSettleStatus = "0";
      this.patientInfoForm.selGroup = ['printGuide', 'printSampleCode'];
      if (formData.boSettleStatus) {
        this.patientInfoForm.boSettleStatus = this.patientInfoForm.boSettleStatus.toString();
      }
      if (!this.patientInfoForm.boChargeTypeId) {
        this.setChargTypeDefault();
      }
      //防止查档案的时候，出现个人有单位分组的情况
      if (this.patientInfoForm.boIsUnit == 0) {
        // this.unitsList = [];
        // this.groupsList = [];
        this.$set(this.patientInfoForm, 'boGroupId', '')
        this.$set(this.patientInfoForm, 'boGroupingName', '')
      }
      if (this.patientInfoForm.boUnitId && this.patientInfoForm.boUnitId != "****") {
        this.unitsList = [];
        this.groupsList = [];
        this.unitsList.push({
          boUnitId: this.patientInfoForm.boUnitId,
          boUnitName: this.patientInfoForm.boUnitName
        })
        this.groupsList.push({
          boGroupId: this.patientInfoForm.boGroupId,
          name: this.patientInfoForm.boGroupingName
        })
      }
      console.log('导入')
      console.log(this.patientInfoForm)
      // 获取已登记的套餐组合项目，添加到已选项目表格中，不可修改删除
      this.checkUnpickItems();
    },
    //输入框回车时，根据身份证号，获取档案信息；无档案，则计算年龄及出生日期
    getAgeAndBirthday () {
      if (!this.patientInfoForm.boIdNo) return
      this.getInfoByEnter = true;
      let j = {}
      j['boIdNo'] = this.patientInfoForm.boIdNo.trim();
      j["boCertificatesType"] = this.patientInfoForm.boCertificatesType;
      this.personModalVisible = true
      this.$refs.searchPerson.idCardSearch(j)
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
        boVisitCardNumber: this.patientInfoForm.boVisitCardNumber
      }
      this.clearForm('patientInfoForm')
      let pagination = {
        page: 1,
        size: 5
      }
      // 更换获取患者的信息接口
      findLastRegisterInfo(pagination, params).then(({ data }) => {
        console.log(data)
        if (data.data.records.length) {
          this.importData = true;
          Object.assign(this.patientInfoForm, data.data.records[0])
          console.log(this.patientInfoForm)
          this.delPickProjects();
          this.payMoney = data.data.records[0].payMoneied
          this.noPayMoney = data.data.records[0].noPayMoney
          if (!this.patientInfoForm.boPic) {
            this.patientInfoForm.boPic = this.boPic;
            this.boPic = '';
          } else {
            let picUrl = this.$url + this.patientInfoForm.boPic + '?time=' + new Date().getTime()
            this.$set(this.patientInfoForm, 'boPic', picUrl)
          }
          this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn;
          if (!this.patientInfoForm.boChargeTypeId) {
            this.setChargTypeDefault();
          }
          //防止查询档案时，个人查到分组带出来
          if (this.patientInfoForm.boIsUnit == 0) {
            this.$set(this.patientInfoForm, 'boGroupId', '')
            this.$set(this.patientInfoForm, 'boGroupingName', '')
          }
          if (this.patientInfoForm.boUnitId && this.patientInfoForm.boUnitId != "****") {
            this.unitsList = [];
            this.groupsList = [];
            this.unitsList.push({
              boUnitId: this.patientInfoForm.boUnitId,
              boUnitName: this.patientInfoForm.boUnitName
            })
            this.groupsList.push({
              boGroupId: this.patientInfoForm.boGroupId,
              name: this.patientInfoForm.boGroupingName
            })
          }
          // console.log(this.patientInfoForm)
          this.checkUnpickItems();
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
    //根据套餐ID查找套餐名
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
    //判断单位还是个人,区分套餐与加做，自选
    isUnit (packageId, groupPayType = '0', addPayType = '1') {
      if (+this.patientInfoForm.boIsUnit) {
        // this.patientInfoForm.grayOwnExpense = false;
        this.patientInfoForm.grayOwnExpense = true;
        //单位
        this.pickProjectsTableData.forEach(item => {
          item.boPackageId = packageId;
          // item.isRegister = '套餐';
          item.isRegister = 0;
          item.boIsAdditional = 0;
          // item.boIsOwnExpense = "0";
          item.boIsOwnExpense = groupPayType;
        });
        console.log('单位')
        console.log(this.pickProjectsTableData)
      } else {
        this.patientInfoForm.grayOwnExpense = true;
        //个人
        this.pickProjectsTableData.forEach(item => {
          item.boPackageId = packageId;
          // item.isRegister = '套餐';
          item.isRegister = 0;
          item.boIsAdditional = 0;
          item.boIsOwnExpense = "1";
        });
        console.log('个人')
        console.log(this.pickProjectsTableData)
      }
      console.log(this.pickProjectsTableData)
      //个人的（0）： 随意更改套餐，加减项目
      //单位的（1）： 不能换套餐，只可以加项目
      this.delGrayOff();
      if (+this.patientInfoForm.boIsUnit) {
        this.grayOff(this.pickProjectsTableData);
      } else {
        this.projectsChecked(this.pickProjectsTableData);
      }
      if (this.fixPrice) {
        this.fixPrice = false
      }
    },
    //修改套餐,获取已选项目信息
    changePackage (packageId) {
      // this.itemList = []
      this.$refs.projectInputDrop.filterText = "";
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
            this.pickProjectsTableData.forEach(item => {
              item.boComboSort = item.paSort
            })
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
    //滚轮到未选套餐底部刷新
    reachPackageBottom () {
      if (+this.patientInfoForm.boIsUnit) return
      return new Promise(resolve => {
        setTimeout(() => {
          this.packagePageIndex++
          this.getPackagesList();
          resolve();
        }, 300);
      });
    },
    //滚轮到未选项目底部刷新
    handleReachBottom () {
      return new Promise(resolve => {
        setTimeout(() => {
          this.comboPageIndex++
          this.showItem();
          resolve();
        }, 300);
      });
    },
    //分页展示数据 未选项目
    showItem (query = '') {
      // console.log(this.paDeptId);
      // console.log(this.isComboProject);
      // console.log(this.comboPageIndex);
      if (this.isProjectMore) return
      if (this.projectSearchLoading) return
      this.projectSearchLoading = true
      let pagination = {
        page: this.comboPageIndex,
        size: this.comboPageSize
      };
      let params = {
        keyword: query,
        paDeptId: this.paDeptId == 'all' ? '' : this.paDeptId,
        paFlag: this.isComboProject,
        paSex: this.patientInfoForm.boSex
      };
      getItemByPage(pagination, params).then(res => {
        // console.log(res.data);
        let result = res.data;
        if (result.code == 0) {
          // this.projects = [];
          // this.comboPages = result.data.pages;
          // 判断当前页数和总页数是否相等，如果相同就不需要再请求了
          this.comboPageIndex == result.data.pages ? this.isProjectMore = true : this.isProjectMore = false
          result.data.records.forEach(item => {
            this.projects.push(item);
            if (query != '') {
              this.searchProList.push(item)
            }
          });
          this.totalItemNum = result.data.total;
          //个人的（0）： 随意更改套餐，加减项目
          //单位的（1）： 不能换套餐，只可以加项目
          this.delGrayOff();
          this.grayOff(this.pickProjectsTableData);
          // if (+this.patientInfoForm.boIsUnit) {
          //   this.grayOff(this.pickProjectsTableData);
          // } else {
          //   this.projectsChecked(this.pickProjectsTableData);
          // }
          console.log('项目组合重复了')
          console.log(this.projects)
        } else {
          this.$Message.error(result.message);
        }
        this.projectSearchLoading = false
      }).catch(err => {
        this.projectSearchLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      });
    },
    //根据已选项目反选未选项目的勾选项
    projectsChecked (tableData) {
      // console.log('传入已选项目长度' + tableData.length);
      this.pickProjects = [];

      //遍历所有体检组合项目
      for (let i = 0; i < this.projects.length; i++) {
        // console.log(tableData[i].paName);
        for (let j = 0; j < tableData.length; j++) {
          if (this.projects[i].name == tableData[j].paName) {
            this.pickProjects.push(tableData[j].paId);
          }
        }
      }
      //切换科室后，保存新的勾选项总数
      this.tempPick = null;
      this.tempPick = [...this.pickProjects];
      this.tempPickLength = this.tempPick.length;
    },
    //灰色勾选已登记的套餐项目组合
    grayOff (tableData) {
      // console.log('传入已选项目长度' + tableData.length);
      this.pickProjects = [];
      this.delGrayOff();

      // 个人，未缴费并未检查的项目可删除
      if (this.patientInfoForm.boIsUnit == '0') {
        //遍历所有体检组合项目，设置gray属性
        for (let i = 0; i < this.projects.length; i++) {
          // console.log(tableData[i].paName);
          for (let j = 0; j < tableData.length; j++) {
            if (this.projects[i].name == tableData[j].paName && (tableData[j].boIsCompleted != 0 || tableData[j].boBillStatus == 2)) {
              this.pickProjects.push(tableData[j].paId);
              this.projects[i].gray = true;
            } else if (this.projects[i].name == tableData[j].paName) {
              this.pickProjects.push(tableData[j].paId);
            }
          }
        }
      }
      // 单位人员，单位付费，已缴费未检查的可以减项；个人支付，已缴费未检查不可减项
      if (this.patientInfoForm.boIsUnit == '1') {
        //遍历所有体检组合项目，设置gray属性
        for (let i = 0; i < this.projects.length; i++) {
          // console.log(tableData[i].paName);
          for (let j = 0; j < tableData.length; j++) {
            if (this.projects[i].name == tableData[j].paName) {
              if (tableData[j].boIsCompleted != 0) {
                this.pickProjects.push(tableData[j].paId);
                this.projects[i].gray = true;
              } else if (tableData[j].boIsCompleted == 0 && tableData[j].boIsOwnExpense == 1 && tableData[j].boBillStatus == 2) {
                this.pickProjects.push(tableData[j].paId);
                this.projects[i].gray = true;
              } else {
                this.pickProjects.push(tableData[j].paId);
              }
            }
          }
        }
      }

      this.tempPick = this.pickProjects;
      // console.log(this.tempPick + '....')
      this.tempPickLength = this.tempPick.length;
    },
    // 清除灰掉样式
    delGrayOff () {
      this.projects.forEach(item => {
        item.gray = false;
      });
    },
    //改变选择框时，查询数据 按科室分类筛选,按项目分类筛选
    changeItem () {
      console.log('我是科室ID' + this.paDeptId);
      //清空状态
      this.$refs.projectInputDrop.filterText = "";
      this.isProjectMore = false
      this.searchProList = [];
      this.comboPageIndex = 1;
      this.projects = [];
      this.tempPickLength = 0;
      this.showItem();
    },
    changeProject () {
      this.itemList = [];
      this.emptyText = '数据加载中...';
      // console.log(this.pickProjects);
      // console.log('userpick'+this.userPickPackages)
      // console.log('temp长度' + this.tempPickLength);
      // console.log('pick长度' + this.pickProjects.length);
      if (this.pickProjects.length > this.tempPickLength) {
        // console.log('加项')
        // console.log(this.pickProjects);
        // console.log(this.projects)
        let lastId = this.pickProjects[this.pickProjects.length - 1];
        // console.log(lastId)

        //防止多次点击, 灰掉勾选框
        for (let i = 0; i < this.projects.length; i++) {
          if (this.projects[i].id == lastId) {
            this.projects[i].gray = true;
            break;
          }
        }
        // 发送请求，参数组合ID，获取树结构
        getItemTreeByComboId({ paComboId: lastId }).then(res => {
          let result = res.data;
          if (result.code == 0) {
            let addItem = result.data;
            console.log(addItem)
            if (+this.patientInfoForm.boIsUnit) {
              // this.patientInfoForm.grayOwnExpense = false;
              this.patientInfoForm.grayOwnExpense = true;
              //公司
              this.pickProjectsTableData.unshift({
                paId: addItem.id,
                paCode: addItem.comboCode,
                paName: addItem.comboName,
                paPrice: addItem.discountValue,
                paDeptId: addItem.deptId,
                paDeptName: addItem.deptName,
                isRegister: 1,  // 未登记项目
                boIsAdditional: 1,
                boComboSort: addItem.paSort,
                boIsOwnExpense: this.patientInfoForm.boAddPayType,
                paTestTubeId: addItem.testTubeId,
                boAmount: addItem.discountValue,
                boIsCompleted: '0',  // 未检
                boBillStatus: '1'  // 未缴费
              });
            } else {
              this.patientInfoForm.grayOwnExpense = true;
              //个人
              this.pickProjectsTableData.unshift({
                paId: addItem.id,
                paCode: addItem.comboCode,
                paName: addItem.comboName,
                paPrice: addItem.discountValue,
                paDeptId: addItem.deptId,
                paDeptName: addItem.deptName,
                isRegister: 1,  // 未登记项目
                boIsAdditional: 1,
                boComboSort: addItem.paSort,
                boIsOwnExpense: '1',
                paTestTubeId: addItem.testTubeId,
                boAmount: addItem.discountValue,
                boIsCompleted: '0',  // 未检
                boBillStatus: '1'  // 未缴费
              });
            }
            this.pushItemList();
            console.log(this.itemList);
            this.tempPick = this.pickProjects;
            this.tempPickLength = this.tempPick.length;
            // this.noPackage();
            for (let j = 0; j < this.projects.length; j++) {
              if (this.projects[j].id == lastId) {
                this.projects[j].gray = false;
                break;
              }
            }
          } else {
            this.emptyText = '暂无数据';
            this.$Message.error(result.message);
            for (let j = 0; j < this.projects.length; j++) {
              if (this.projects[j].id == lastId) {
                this.projects[j].gray = false;
                break;
              }
            }
          }
        }).catch(err => {
          console.log('12' + err)
          this.emptyText = '网络不稳定，暂无数据，请稍后重试';
          this.$Message.error('网络不稳定，请稍后重试')
        })
      } else if (this.pickProjects.length < this.tempPickLength) {
        // console.log('减项')
        // console.log(this.pickProjects);
        // console.log('temp长度' + this.tempPickLength);
        // console.log('pick长度' + this.pickProjects.length);
        let uncheckItemId = this.getDiffrence(this.pickProjects, this.tempPick);
        let delIndex = 0;
        let isRegister;
        // console.log(uncheckItemId);
        //防止多次点击, 灰掉勾选框
        for (let m = 0; m < this.projects.length; m++) {
          if (this.projects[m].id == uncheckItemId) {
            this.projects[m].gray = true;
            break;
          }
        }
        this.pickProjectsTableData.forEach((item, index) => {
          if (item.paId == uncheckItemId) {
            console.log(index);
            delIndex = index;
            isRegister = item.isRegister;
          }
        });

        //区分已登记和未登记项目减项
        let delItem = [];
        if (isRegister == 0) {
          delItem = this.pickProjectsTableData.splice(delIndex, 1)
          console.log('已删除的减项')
          console.log(delItem)
        }
        if (isRegister == 1) {
          this.pickProjectsTableData.splice(delIndex, 1)
        }

        this.pushItemList(delItem);
        console.log('删除加项')
        console.log(this.itemList)
        console.log('删除减项')
        console.log(this.delItemList)

        this.tempPick = this.pickProjects;
        this.tempPickLength = this.tempPick.length;
        if (!this.pickProjectsTableData.length) {
          this.emptyText = '暂无数据';
        }
        // this.noPackage();
        for (let n = 0; n < this.projects.length; n++) {
          if (this.projects[n].id == uncheckItemId) {
            this.projects[n].gray = false;
            break;
          }
        }
      }
      //如果有改价，恢复正常价格显示
      // if (this.fixPrice) {
      //   this.fixPrice = false
      // }
    },
    // noPackage () {
    //   //如果没有套餐，加做全部改为自选
    //   if (!this.userPickPackageId) {
    //     this.pickProjectsTableData.forEach(item => {
    //       // item.isRegister = '自选'
    //       item.isRegister = 2
    //     })
    //   }
    // },
    //找到不同的项目组合ID
    getDiffrence (arr1, arr2) {
      return arr1.concat(arr2).filter((v, i, arr) => {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      })
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
    // 去除姓名字段空格
    filterSpace () {
      this.patientInfoForm.boName = this.patientInfoForm.boName.replace(/\s+/g, "")
    },
    //姓名框按回车键弹出查询体检人员
    openSearchPerson () {
      this.patientInfoForm.boName = this.patientInfoForm.boName.replace(/\s+/g, "")
      // console.log(this.patientInfoForm.boRegisterCode)
      this.boName = this.patientInfoForm.boName.trim();
      // this.registerCode = this.patientInfoForm.boRegisterCode ? this.patientInfoForm.boRegisterCode.trim() : '';
      this.personModalVisible = true;
    },
    //扫码框按回车键弹出查询体检人员
    openSearchPersonByCode () {
      this.registerCode = this.patientInfoForm.boRegisterCode ? this.patientInfoForm.boRegisterCode.trim() : '';
      // this.personModalVisible = true;
      if (this.registerCode == '') return false

      const formData = {
        boRegisterCode: this.registerCode
      }
      const pagination = {
        page: 1,
        size: 10
      }
      this.spinShow = true;
      // console.log(params);
      findLastRegisterInfo(pagination, formData).then(({ data }) => {
        // console.log(data)
        this.spinShow = false;
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
          if (this.personTableData.length > 0) {
            this.importPersonalRecord(this.personTableData[0])
          } else {
            this.$Message.error('未查到相关病人信息');
          }

        } else {
          this.$Message.error(result.message);
        }
      }).catch(err => {
        this.spinShow = false
        this.$Message.error(err.message)
      });
    },
    closePerson () {
      this.boName = '';
      this.registerCode = '';
      this.personModalVisible = false;
    },
    //请求患者最后一次信息
    searchName (page = 1, size = 10, formData) {
      this.searchPersonLoading = true;
      let pagination = {
        page: page,
        size: size
      }
      // console.log(params);
      findLastRegisterInfo(pagination, formData).then(({ data }) => {
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
    closeHistory () {
      this.historyModalVisible = false;
    },
    //修改总金额
    // applyNewPrice (formData) {
    //   // console.log(formData)
    //   this.fixPrice = true;
    //   Object.assign(this.patientInfoForm, formData)
    //   // console.log(this.patientInfoForm)
    // },
    //申请改价弹框显示
    // openPriceModal () {
    //   if (+this.patientInfoForm.boIsUnit) {
    //     this.$Message.warning("暂不支持单位改价")
    //     return
    //   }
    //   this.priceModalVisible = true;
    // }
  }
}
</script>

<style lang="less">
.personal-register-wrapper {
  // width: 100%;
  min-width: 1500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .form-wrapper {
    width: 100%;
    margin-bottom: 10px;
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
  .unitSelect .ivu-select-input[disabled] {
    -webkit-text-fill-color: #000;
  }
  .ivu-select-disabled .ivu-select-selection,
  .ivu-input {
    color: #000;
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
  .basic-info.ivu-card-shadow {
    box-shadow: none;
  }
  .basic-info-body {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    &-pic {
      width: 11%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 55%;
      }
      button {
        margin-top: 10px;
      }
    }
    &-input {
      width: 88%;
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
  .selected-package {
    min-height: 26px;
  }
  .dept {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px solid #eee;
    padding: 8px 0;
    margin-bottom: 8px;
    &-item-active {
      background-color: #2d8cf0;
      color: #fff;
      border-radius: 5px;
    }
    &-item {
      margin: 2px;
      padding: 3px 8px;
      &:hover {
        background-color: #2d8cf0;
        color: #fff;
        border-radius: 5px;
      }
    }
  }
  .unpick-packages-card {
    .ivu-card-body {
      padding: 16px 8px 16px 10px;
    }
    .ivu-radio-wrapper {
      font-size: 14px;
    }
  }
  .unpick-projects-card .ivu-card-body {
    padding: 16px 8px 16px 10px;
  }
  .unselect-package-item {
    width: 96%;
    min-width: 200px;
  }
  .unpick-projects-item {
    font-size: 14px;
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
  .pick-projects {
    height: 593px;
    .ivu-card-body {
      .settlement {
        position: absolute;
        bottom: 8px;
        width: 95%;
        &-text {
          display: flex;
          flex: 1;
          justify-content: space-around;
          align-items: center;
          font-size: 14px;
          .count {
            color: blue;
            font-weight: bold;
          }
          .price {
            font-size: 26px;
            color: #e51c23;
            padding-right: 10px;
          }
        }
      }
    }
  }
  .unpick-projects {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    &-item {
      width: 45%;
      margin-bottom: 8px;
    }
  }
  .unselect-package {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-item {
      line-height: 2;
    }
  }
  .ivu-scroll-container {
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
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
  .zk-table__cell-inner {
    font-size: 14px;
  }
  .zk-table {
    line-height: 20px;
    .zk-table__body-row {
      height: 20px;
    }
    .zk-table__body-wrapper {
      height: 390px !important;
    }
    .zk-table--empty-row {
      height: 390px;
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

  //  选择框禁止色改为白底 - 特殊需求
  .ivu-select-disabled .ivu-select-selection,
  .ivu-input {
    background-color: #fff;
  }
}
</style>
