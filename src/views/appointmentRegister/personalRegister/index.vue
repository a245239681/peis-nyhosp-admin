
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
                      <Radio label="0">个人</Radio>
                      </Col>
                      <Col span="12">
                      <Radio label="1">单位</Radio>
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
                          :label-width="60"
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
                          size="small"
                          @on-change="changeMaritalStatu">
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
                <Col span="5">
                <FormItem label="单位名称"
                          prop="boUnitId"
                          :label-width="80">
                  <Select v-model="patientInfoForm.boUnitId"
                          class="unitSelect"
                          ref="unitSelectBox"
                          clearable
                          filterable
                          remote
                          size="small"
                          v-if="!importData"
                          :label-in-value="true"
                          placeholder=" "
                          @on-change="changeUnit"
                          @on-clear="clearUnit"
                          :remote-method="getUnits"
                          :loading="unitSearchLoading">
                    <Option v-for="item in unitsList"
                            :value="item.boUnitId"
                            @click.native="getUnitDept(item)"
                            :key="item.boUnitId">{{ item.boUnitName }}</Option>
                  </Select>
                  <Input v-model="patientInfoForm.boUnitName"
                         v-else
                         disabled
                         size="small" />
                </FormItem>
                </Col>
                <Col span="5">
                <FormItem label="所属部门"
                          :label-width="80">
                  <Cascader :data="unitDeptList"
                            v-model="selectDeptArr"
                            change-on-select
                            size="small"
                            v-if="!importData"
                            @on-change="unitDeptChange"></Cascader>
                  <Input :value="(patientInfoForm.boDepartmentName ? 
                            (patientInfoForm.boSubDepartmentName ? 
                            patientInfoForm.boDepartmentName  + '/' + patientInfoForm.boSubDepartmentName : patientInfoForm.boDepartmentName ) : '' )"
                         v-else
                         disabled
                         size="small" />
                </FormItem>
                </Col>
                <Col span="5">
                <FormItem label="体检分组"
                          prop="boGroupId"
                          :class="{groupStar: patientInfoForm.boIsUnit == '1'}"
                          :label-width="80">
                  <Select v-model="patientInfoForm.boGroupId"
                          :disabled="importData"
                          size="small"
                          @on-change="changeUnitGroup"
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
              <Row :gutter="16"
                   type="flex"
                   justify="end">
                <!-- <Col span="11">&nbsp;</Col> -->
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
                <Col span="3">
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
                <Button type="primary"
                        style="margin-left: 10px;float: right;"
                        @click="handleSubmit('patientInfoForm')"
                        :loading="isLoading"
                        v-permission="['add']">确认登记</Button>
                <Button type="error"
                        style="margin-left: 10px;float: right;"
                        @click="handleReset('patientInfoForm')">清空</Button>
                <Button id='readIDCard'
                        type="primary"
                        style="float: right;"
                        :loading="scanLoading"
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
                   :disabled="item.gray">{{item.name}}</Radio>
          </RadioGroup>
          <!-- <CheckboxGroup v-model="userPickPackageIds">
              <Checkbox label="twitter">
                  <span>Twitter</span>
              </Checkbox>
          </CheckboxGroup> -->
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
          <span style="margin-left:10px; color:#e51c23;">自费一栏，打勾为“自费”项目，不打勾为“非自费”项目</span>
          <div class="title-right-tool">
            <Button @click="printInvoice"
                    style="margin-right: 8px;"
                    size="small">打印价格明细</Button>
            <!-- 暂不使用 -->
            <!-- <Button @click="openPriceModal"
                    style="margin-right: 8px;"
                    size="small">申请改价</Button> -->
            <Button type="default"
                    @click="clearPickProjects"
                    size="small">清空项目</Button>
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
          <template slot="isAddItem"
                    slot-scope="{row}">
            <Tag color="green"
                 v-if="row.isAddItem == 0">套餐</Tag>
            <Tag color="orange"
                 v-else-if="row.isAddItem == 1">加做</Tag>
            <Tag color="magenta"
                 v-else-if="row.isAddItem == 2">自选</Tag>
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
              <span class="price">{{patientInfoForm.boNewPrice}}</span>元
            </p>
            <p>已缴费:
              <span class="price">{{pay}}</span>元
            </p>
            <p v-show="!fixPrice">待缴费:
              <span class="price">{{notPay}}</span>元
            </p>
            <p v-show="fixPrice">待缴费（已改价）：
              <span class="price">{{patientInfoForm.boNewPrice}}</span>元
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
                   @importPerson="importPersonalRecord"
                   @close="closePerson"></search-person>
    <book-history :visible="historyModalVisible"
                  @importRecord="importPersonalRecord"
                  @close="closeHistory"></book-history>
    <capture :visible="captureModalVisible"
             v-if="hackReset"
             @cancel="closeCaptureModal"
             @ok="importPic"></capture>
    <change-price :visible="priceModalVisible"
                  :oldPrice="totalPrice"
                  @cancel="priceModalVisible = false"
                  @newPrice="applyNewPrice"></change-price>
  </div>
</template>

<script>
import moment from 'moment'
import InputDrop from '@/views/appointmentRegister/components/inputDrop'
import SearchPerson from '@/views/appointmentRegister/components/searchPerson'
import BookHistory from '@/views/appointmentRegister/components/bookHistory'
import Capture from '@/views/appointmentRegister/components/capture'
import ChangePrice from './changePrice'
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
  getMasterIndexByNameAndIdNo,
  save,
  printBarcode,
  printGuide,
  printDetail,
  newUnitDept,
  archivesList
} from '@/api/personal_register.js'
import { getMoreItemTree } from '@/api/groupManage.js'
import { getBirthAndAge } from '@/libs/tools.js'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import { getPrinterConfigFromLocalstorage, setAutoClearStorage, getAutoClearStorage } from '@/libs/util'
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
    ChangePrice,
    SearchPerson
  },
  data () {
    // 选中单位后验证分组
    const checkGroupId = (rule, value, callback) => {
      console.log('validate=>' + this.patientInfoForm.boIsUnit)
      if (this.patientInfoForm.boIsUnit == '1' && !this.patientInfoForm.boGroupId) {
        callback(new Error('请选择体检分组！'))
      } else {
        callback()
      }
    }
    return {
      ruleValidate: {
        boIsUnit: [
          { required: true, message: '请选择个人/单位' }
        ],
        boGroupId: [
          { validator: checkGroupId, trigger: 'change' }
        ]
      },
      birth: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000
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
          headerAlign: 'center'
        },
        {
          type: 'template',
          title: '类型',
          key: 'isAddItem',
          template: 'isAddItem',
          width: 80,
          align: 'center',
          headerAlign: 'center'
        },
        // {
        //   title: '套餐编号',
        //   key: 'paPackageCode',
        //   template: 'paPackageCode',
        //   width: 80,
        //   align: 'center',
        //   headerAlign: 'center'
        // },
        {
          title: '所属科室',
          key: 'paDeptName',
          width: 160,
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
        // {
        //   title: '组合编号',
        //   key: 'paCode',
        //   template: 'paCode',
        //   width: 80,
        //   align: 'center',
        //   headerAlign: 'center'
        // },
        // {
        //   title: '检查类别',
        //   key: 'paExamType',
        //   type: 'template',
        //   template: 'paExamType',
        //   width: 120,
        //   align: 'center',
        //   headerAlign: 'center'
        // },
        {
          title: '单价（元）',
          key: 'paPrice',
          template: 'paPrice',
          width: 88,
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
      // comboPages: 1,
      comboPageIndex: 1,
      comboPageSize: 40,
      itemList: [],
      tempPick: [],
      tempPickLength: 0,
      totalItemNum: [],
      boName: '',
      boPic: '', // 保存身份证照片
      printParams: {},
      fixPrice: false, // 判断改价后显示改价价格
      groupAddItems: [], // 单位分组加项保存
      groupPayType: '', // 分组支付方式
      addPayType: '', // 加项支付方式
      searchPersonLoading: false,
      personTableData: [],
      personTotalSize: 0,
      scanLoading: false, // 扫描证件
      unitDeptList: [], // 单位部门数据
      selectDeptArr: [], // 当前选中部门数据
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
        return total + Number.prototype.mul(currentValue.paPrice, 100)
      }, 0)
    },
    totalAddItem () {
      let num = 0
      this.pickProjectsTableData.forEach(item => {
        if (item.boIsAdditional == 1) {
          num++
        }
      })
      return num
    },
    totalAddItemPrice () {
      let price = 0
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
      let num = 0
      this.pickProjectsTableData.forEach(item => {
        if (item.paTestTubeId != null) {
          num++
        }
      })
      return num
    },
    pay () {
      let price = 0
      this.pickProjectsTableData.forEach(item => {
        if (item.boIsOwnExpense == 0) {
          if (item.paPrice == null) item.paPrice = 0
          price += Number.prototype.mul(item.paPrice, 100)
        }
      })
      price = Number.prototype.div(price, 100)
      return price
    },
    notPay () {
      let price = 0
      this.pickProjectsTableData.forEach(item => {
        if (item.boIsOwnExpense == 1) {
          if (item.paPrice == null) item.paPrice = 0
          price += Number.prototype.mul(item.paPrice, 100)
        }
      })
      price = Number.prototype.div(price, 100)
      return price
    }
  },
  created () {
    // 获取科室
    this.$store.dispatch('getRoomDict')
    this.getPackagesList()
    this.showItem()
    let setting = getAutoClearStorage()
    let printConfig = getPrinterConfigFromLocalstorage()
    this.isAutoClear = setting.hasOwnProperty('isPersonalRegister') ? setting.isPersonalRegister : true
    if (printConfig.hasOwnProperty('labelNum')) {
      this.patientInfoForm.labelNum = printConfig.labelNum.toString()
    } else {
      this.patientInfoForm.labelNum = '1'
    }
  },
  methods: {
    // 打印价格明细
    async printInvoice () {
      if (!this.pickProjectsTableData.length) {
        this.$Message.warning('未选择套餐项目，不可打印价格明细')
        return
      }
      if (!printNotice()) return false
      // console.log('价格明细表格')
      // console.log(this.pickProjectsTableData)
      let arr = []
      this.pickProjectsTableData.forEach(item => {
        arr.push({
          paIsOwnExcepense: item.boIsOwnExpense,
          paIsAdditional: item.boIsAdditional,
          paDeptName: item.paDeptName,
          paComboName: item.paName,
          paPrice: item.paPrice,
          paTestTubeId: item.paTestTubeId,
          paIsAddItem: item.isAddItem
        })
      })
      try {
        let { data } = await printDetail(arr)
        // console.log(data)
        if (data.code === 0) {
          let printParams = {
            guideUrl: this.$url + data.data,
            selGroup: ['printGuide'],
            taskName: '价格明细'
          }
          printMethods(printParams.guideUrl, printParams)
        } else {
          this.$Message.error(data.message)
        }
      } catch (err) {
        this.$Message.error('网络不稳定，请稍后尝试')
      }
    },
    // 需要传给后台的已选项目参数
    pushItemList () {
      this.pickProjectsTableData.forEach((item, index) => {
        this.itemList.push({
          boComboId: item.paId,
          boComboName: item.paName,
          boIsOwnExpense: item.boIsOwnExpense, // 自费标志
          boSort: index, // 表格排序序号，暂时无用
          boIsAdditional: item.boIsAdditional, // 加项标志
          boDeptId: item.paDeptId,
          boDeptName: item.paDeptName,
          boComboSort: item.boComboSort,
          boAmount: item.paPrice,
          boRealAmount: item.paPrice
        })
      })
    },
    // 保存已选项目表格中自费勾选项
    changeTableCharge (row, rowIndex) {
      // console.log('自费勾选项')
      // console.log(this.$refs.registerTreeTable)
      let arr = this.$refs.registerTreeTable.bodyData
      // 解决勾选后，计算已缴费，待缴费数字不变动的问题
      this.pickProjectsTableData = Object.assign([], this.pickProjectsTableData, arr)
      this.itemList = []
      this.pushItemList()
      // console.log(this.pickProjectsTableData)
    },
    // 双击删除表格中的项目
    delTableData (row, rowIndex, e) {
      this.itemList = []
      // 个人人员，随意加减项； 单位人员，只能加项，不可删除套餐里的项目。
      if (this.patientInfoForm.boIsUnit == '1' && row.boIsAdditional == 0) {
        this.$Message.warning('单位人员套餐不可更改，可加做项目')
        return
      } else {
        this.pickProjectsTableData.splice(rowIndex, 1)
      }
      this.projectsChecked(this.pickProjectsTableData)
      // 如果删去套餐中的组合项目，全部变成自选
      if (row.boIsAdditional == 0) {
        this.pickProjectsTableData.forEach((item, index) => {
          // item.isAddItem = "加做"
          item.isAddItem = 2 // 0 - 套餐， 1 - 加做，2 - 自选
          item.boIsAdditional = 1
          this.itemList.push({
            boComboId: item.paId,
            boComboName: item.paName,
            boIsOwnExpense: item.boIsOwnExpense, // 自费标志
            boSort: index, // 表格排序序号，暂时无用
            boIsAdditional: 1, // 加项标志
            boDeptId: item.paDeptId,
            boDeptName: item.paDeptName,
            boComboSort: item.boComboSort,
            boAmount: item.paPrice,
            boRealAmount: item.paPrice
          })
        })
        this.userPickPackageId = ''
        this.userPickPackageName = ''
        this.$set(this.patientInfoForm, 'boPackageId', '')
        this.$set(this.patientInfoForm, 'boPackageCode', '')
        this.$set(this.patientInfoForm, 'boPackageName', '')
      } else {
        this.pushItemList()
      }
      if (!this.pickProjectsTableData.length) {
        this.emptyText = '暂无数据'
      }
      console.log(this.itemList)
    },
    // 高亮表格中的加项颜色
    addItemColor (row, index) {
      let r = this.pickProjectsTableData.filter((val, index) => {
        return val.isAddItem == 1 // 0 - 套餐， 1 - 加做，2 - 自选
      })
      if (r.length && index < r.length) {
        if (row.paTestTubeId !== null) {
          return 'demo-table-addItem-row testTube'
        } else {
          return 'demo-table-addItem-row'
        }
      } else {
        if (row.paTestTubeId !== null) {
          return 'demo-table-package-row testTube'
        } else {
          return 'demo-table-package-row'
        }
      }
      return ''
    },
    // 更改个人/单位
    changeIsUnit (e) {
      console.log(e)
      // 单位的（1）： 不能换套餐，只可以加项目
      if (e == 1 && this.pickProjectsTableData.length) {
        console.log('no')
        // this.$set(this.patientInfoForm, 'grayOwnExpense', false)
        this.$set(this.patientInfoForm, 'grayOwnExpense', true)
        this.pickProjectsTableData.forEach(item => {
          item.boIsOwnExpense = '0'
        })
        console.log(this.pickProjectsTableData)
        this.grayOff(this.pickProjectsTableData)
        this.grayAllPackage()
      }
      // 个人的（0）： 随意更改套餐，加减项目
      if (e == 0 && this.pickProjectsTableData.length) {
        console.log('iam')
        this.delGrayOffAllPackage()
        this.delGrayOff()
        this.$set(this.patientInfoForm, 'grayOwnExpense', true)
        this.pickProjectsTableData.forEach(item => {
          item.boIsOwnExpense = '1'
        })
        console.log(this.pickProjectsTableData)
        this.projectsChecked(this.pickProjectsTableData)
      }
    },
    // 更改体检分组
    async changeUnitGroup (e) {
      if (!this.importData) {
        this.$set(this.patientInfoForm, 'boPackageId', '')
        this.$set(this.patientInfoForm, 'boPackageCode', '')
        this.$set(this.patientInfoForm, 'boPackageName', '')
        this.delPickProjects()
      }
      if (!e) return
      this.$set(this.patientInfoForm, 'boIsUnit', '1')
      let packageCode = ''
      let params = {
        boGroupingId: e,
        sort: 3 // 用于获取数据排序 - 套餐优先
      }
      try {
        let { data } = await searchGroupProjects(params)
        console.log(data)
        if (data.code === 0) {
          // 分组带出来的项目，根据groupPayType=0时，默认非自费，=1是默认自费。
          // 在这基础上加项的，addPayType=0的时候，默认非自费。=1的时候，默认自费
          this.groupPayType = data.data.groupPayType
          this.addPayType = data.data.addPayType
          console.log(this.groupPayType + '分组支付')
          console.log(this.addPayType + '加项支付')
          data.data.data.forEach(item => {
            if (item.boObjectType == 3) {
              console.log(item.boObjectId)
              packageCode = item.boObjectCode
              this.userPickPackageId = item.boObjectId
              this.userPickPackageName = item.boObjectName
            }
            if (item.boObjectType == 2) {
              this.groupAddItems.push(item.boObjectId)
            }
          })
          if (this.userPickPackageId) {
            this.emptyText = '数据加载中...'
            let comboParams = {
              paPackageId: this.userPickPackageId
            }
            console.log(comboParams)
            let packageRes = await getComboByPackage(comboParams)

            if (packageRes.data.code === 0) {
              // 数组深拷贝
              [...this.pickProjectsTableData] = packageRes.data.data
              this.emptyText = '此套餐下无项目组合'
            } else {
              this.emptyText = '暂无数据'
              this.$Message.error(packageRes.data.message)
            }
            this.isUnit(this.userPickPackageId, this.groupPayType, this.addPayType)
            this.grayAllPackage()
          }

          if (this.groupAddItems.length) {
            let addItemRes = await getMoreItemTree({ boGroupingId: this.patientInfoForm.boGroupId, paComboId: this.groupAddItems })
            console.log(addItemRes)
            if (addItemRes.data.code === 0) {
              addItemRes.data.data.forEach(item => {
                this.pickProjectsTableData.unshift({
                  paId: item.id,
                  paCode: item.comboCode,
                  paName: item.comboName,
                  paExamType: item.examType,
                  paPrice: item.discountValue,
                  paDeptId: item.deptId,
                  paDeptName: item.deptName,
                  children: {
                    paId: item.children.id,
                    paName: item.children.itemName,
                    paPrice: item.children.price
                  },
                  isAddItem: 1, // 加做
                  boIsOwnExpense: this.groupPayType,
                  boIsAdditional: 1,
                  boComboSort: item.sort,
                  paTestTubeId: item.testTubeId
                })
              })
              // this.$set(this.patientInfoForm, 'grayOwnExpense', false)
              this.$set(this.patientInfoForm, 'grayOwnExpense', true)
              this.grayOff(this.pickProjectsTableData)
              this.grayAllPackage()
              if (!this.userPickPackageId) {
                this.pickProjectsTableData.forEach(item => {
                  // item.isAddItem = '自选'
                  item.isAddItem = 2
                })
              }
            } else {
              this.emptyText = '暂无数据'
              this.$Message.error(addItemRes.data.message)
            }
          }
          // 更新要传的东西
          this.pushItemList()
          this.$set(this.patientInfoForm, 'boPackageId', this.userPickPackageId)
          this.$set(this.patientInfoForm, 'boPackageName', this.userPickPackageName)
          this.$set(this.patientInfoForm, 'boPackageCode', packageCode)
        } else {
          this.$Message.error(data.message)
        }
      } catch (err) {
        console.log(err)
        // this.$Message.error(err)
        // this.$Message.error('网络不稳定，请稍后重试')
      }
    },
    // 查询体检分组
    getGroups () {
      let groupParam = {
        boUnitId: this.patientInfoForm.boUnitId,
        boSex: this.patientInfoForm.boSex,
        boMaritalStatus: this.patientInfoForm.boMaritalStatus
      }
      listAllByUnitId(groupParam).then(res => {
        // console.log(res);
        let result = res.data
        if (result.code === 0) {
          this.groupsList = result.data
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 导入个人信息到表单中
    importPersonalRecord (formData) {
      // console.log(formData);
      this.importData = true
      this.getInfoByEnter = false
      this.clearForm('patientInfoForm')
      Object.assign(this.patientInfoForm, formData)

      this.delPickProjects()
      if (this.patientInfoForm.boPic) {
        let picUrl = this.$url + this.patientInfoForm.boPic
        this.$set(this.patientInfoForm, 'boPic', picUrl)
      }
      this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn + 1
      this.patientInfoForm.selGroup = ['printGuide', 'printSampleCode']
      // formData.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true;
      // this.patientInfoForm.boSettleStatus = "0";
      if (formData.boSettleStatus) {
        this.patientInfoForm.boSettleStatus = this.patientInfoForm.boSettleStatus.toString()
      }
      if (!this.patientInfoForm.boChargeTypeId) {
        this.setChargTypeDefault()
      }
      // 防止查档案的时候，出现个人有单位分组的情况
      if (this.patientInfoForm.boIsUnit == 0) {
        this.$set(this.patientInfoForm, 'boGroupId', '')
        this.$set(this.patientInfoForm, 'boGroupingName', '')
        //  个人的档案信息登记时，允许修改为单位人员
        this.importData = false
        this.patientInfoForm.boUnitId = null
        this.patientInfoForm.boMaritalStatus = this.patientInfoForm.boMaritalStatus ? this.patientInfoForm.boMaritalStatus : ''
      }
      if (this.patientInfoForm.boUnitId && this.patientInfoForm.boUnitId != '****') {
        this.unitsList = []
        this.groupsList = []
        this.unitsList.push({
          boUnitId: this.patientInfoForm.boUnitId,
          boUnitName: this.patientInfoForm.boUnitName
        })
        this.groupsList.push({
          boGroupId: this.patientInfoForm.boGroupId,
          name: this.patientInfoForm.boGroupingName
        })
        this.changeUnitGroup(this.patientInfoForm.boGroupId)
      }
      console.log('导入')
      console.log(this.patientInfoForm)
      if (formData.boPackageName) {
        this.userPickPackageId = formData.boPackageId
        this.userPickPackageName = formData.boPackageName
        let comboParams = {
          paPackageId: formData.boPackageId
        }
        this.emptyText = '数据加载中...'
        console.log(formData)
        // 获取组合项目
        getComboByPackage(comboParams).then((res) => {
          let result = res.data
          if (result.code === 0) {
            this.pickProjectsTableData = result.data
            // 个人的（0）： 随意更改套餐，加减项目
            // 单位的（1）： 不能换套餐，只可以加项目
            if (this.patientInfoForm.boIsUnit == '0') {
              this.patientInfoForm.grayOwnExpense = true
              // 个人
              this.pickProjectsTableData.forEach(item => {
                // item.isAddItem = '套餐';
                item.isAddItem = 0
                item.boIsAdditional = 0
                if (this.patientInfoForm.boSettleStatus == '1') {
                  item.boIsOwnExpense = '0'
                } else {
                  item.boIsOwnExpense = '1'
                }
              })
              this.projectsChecked(this.pickProjectsTableData)
            } else {
              // this.patientInfoForm.grayOwnExpense = false;
              this.patientInfoForm.grayOwnExpense = true
              // 单位
              this.pickProjectsTableData.forEach(item => {
                // item.isAddItem = '套餐';
                item.isAddItem = 0
                item.boIsAdditional = 0
                item.boIsOwnExpense = '0'
              })
              // console.log('单位或者无选项')
              // console.log(this.pickProjectsTableData)
              this.grayOff(this.pickProjectsTableData)
              this.grayAllPackage()
            }
            this.emptyText = '此套餐下无项目组合'
          } else {
            this.emptyText = '暂无数据'
            this.$Message.error(result.message)
          }
        }).catch(err => {
          console.log(err)
          // this.$Message.error('网络不稳定，请稍后重试')
        })
      }
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
        boMaritalStatus: '',
        boCategoryId: ''
      }
      let printConfig = getPrinterConfigFromLocalstorage()
      if (printConfig.hasOwnProperty('labelNum')) {
        this.patientInfoForm.labelNum = printConfig.labelNum.toString()
      } else {
        this.patientInfoForm.labelNum = '1'
      }
      this.selectDeptArr = []
      this.unitDeptList = []
      this.$refs[form].resetFields()
      console.log('清空表单')
      console.log(this.patientInfoForm)
      // this.grayInput = true;
      this.printParams = {}
      this.fixPrice = false
      this.setChargTypeDefault()
    },
    delPickProjects () {
      this.emptyText = '暂无数据'
      this.pickProjectsTableData = []
      //  清空未选套餐
      this.isPackageMore = false
      this.$refs.packageInputDrop.filterText = ''
      this.allPackages = []
      this.packagePageIndex = 1
      this.searchPackageList = []
      this.getPackagesList()
      this.userPickPackageId = ''
      this.userPickPackageName = ''
      //  清空未选项目
      this.isProjectMore = false
      this.$refs.projectInputDrop.filterText = ''
      this.paDeptId = 'all'
      this.pickProjects = []
      this.projects = []
      this.searchProList = []
      this.comboPageIndex = 1
      this.showItem()
      // 其他清空
      this.tempPick = []
      this.tempPickLength = 0
      this.itemList = []
      this.groupAddItems = []
      this.fixPrice = false
      this.multiplyPackage = false
      this.$set(this.patientInfoForm, 'itemList', [])
      // this.unitsList = [];
      // this.groupsList = [];
      // this.groupPayType = '';
      // this.addPayType = '';
      console.log('清空项目')
      console.log(this.patientInfoForm)
    },
    // 已选项目上的清空按钮
    clearPickProjects () {
      this.delPickProjects()
      this.$set(this.patientInfoForm, 'boPackageId', null)
      this.$set(this.patientInfoForm, 'boPackageName', null)
      this.$set(this.patientInfoForm, 'boPackageCode', null)
    },
    // 改变性别时，更改体检分组以及套餐
    changeSex () {
      // 如果是查询历史记录，boSex值为undefined； 如果是手动选择变更性别，boSex则有值
      // console.log(this.patientInfoForm.boSex + '变更');
      // if (this.patientInfoForm.boSex && !this.importData) {
      //   this.$set(this.patientInfoForm, 'boPackageId', '')
      //   this.$set(this.patientInfoForm, 'boPackageName', '')
      //   this.$set(this.patientInfoForm, 'boPackageCode', '')
      //   console.log('切换性别后')
      //   console.log(this.patientInfoForm)
      //   this.multiplyPackage = false
      //   this.delPickProjects()
      // }
      // if (+this.patientInfoForm.boIsUnit) {
      //   this.getGroups()
      //   this.patientInfoForm.boGroupId = ''
      // }
    },
    // 改变婚姻状态，更新体检分组
    changeMaritalStatu () {
      if (+this.patientInfoForm.boIsUnit) {
        this.getGroups()
        this.patientInfoForm.boGroupId = ''
      }
    },
    // 清空护士端登记页面的所有信息
    handleReset (form) {
      this.importData = false
      this.getInfoByEnter = false
      this.boPic = ''
      this.unitsList = []
      this.groupsList = []
      this.selectDeptArr = []
      this.unitDeptList = []
      this.clearForm(form)
      this.delPickProjects()
    },
    async saveAction () {
      this.isLoading = true
      // this.patientInfoForm.boSettleStatus = "0";
      this.patientInfoForm.boUnitId = this.patientInfoForm.boUnitId || '0' // 无单位时，ID值传0
      this.patientInfoForm.itemList = this.itemList
      this.patientInfoForm.boBirthday = moment(this.patientInfoForm.boBirthday).format('YYYY-MM-DD')
      console.log('保存表单')
      console.log(JSON.stringify(this.patientInfoForm))

      try {
        const { data } = await save(this.patientInfoForm)
        this.isLoading = false
        // console.log(data)
        if (data.code == 0) {
          this.printParams = {}
          // this.$Message.success(`登记成功!`)
          this.$Modal.success({
            title: '和湛科技体检系统',
            content: '登记成功',
            closable: true
          })

          // 如果该页面没有打印权限，则返回
          if (!this.checkPrintAuthority()) return false

          if (this.patientInfoForm.selGroup.indexOf('printSampleCode') > -1 && data.data.sampleList) {
            const sampleRes = await printBarcode({
              boIds: data.data.sampleList,
              labelNum: this.patientInfoForm.labelNum,
              addItemLogo: '0' //  登记后加项标志
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
              return val != 'printSampleCode'
            })
            console.log(j)
            this.printParams.selGroup = j
          } else {
            this.printParams.selGroup = this.patientInfoForm.selGroup
          }
          console.log(this.printParams)

          let printConfig = getPrinterConfigFromLocalstorage()
          if (printConfig.browserPreview) {
            if (this.printParams.selGroup.length) {
              if (this.printParams.barcodeUrl) {
                window.open(this.printParams.barcodeUrl, '_blank', 'location=yes,height=650,width=570,scrollbars=yes,status=yes,left=30')
              }
              if (this.printParams.guideUrl) {
                window.open(this.printParams.guideUrl, '_blank', 'location=yes,height=650,width=800,scrollbars=yes,status=yes,left=620')
              }
            }
          }
          if (printConfig.lodopPreview) {
            if (this.printParams.selGroup.length) {
              Object.assign(this.printParams, printConfig)
              printFunc(this.printParams)
            }
          }
          if (printConfig.lodopPrint) {
            if (this.printParams.selGroup.length) {
              Object.assign(this.printParams, printConfig)
              directPrintFunc(this.printParams)
            }
          }

          // 清除掉传给后台的数据
          this.$set(this.patientInfoForm, 'boPackageId', null)
          this.$set(this.patientInfoForm, 'boPackageName', null)
          this.$set(this.patientInfoForm, 'boPackageCode', null)
          if (this.isAutoClear) {
            this.handleReset('patientInfoForm')
          } else {
            this.itemList = []
          }
        } else {
          this.$Message.error(`${data.message}`)
        }
      } catch (err) {
        // console.log(err)
        this.isLoading = false
        this.$Message.error(err.message)
      }
    },
    // 检查当前页面打印权限
    checkPrintAuthority () {
      // console.log(this.$router.currentRoute.meta.authority)
      return this.$router.currentRoute.meta.authority.some(item => {
        return item == 'print'
      })
    },
    // 保存护士端登记信息
    handleSubmit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (!this.pickProjectsTableData.length) {
            this.$Message.error('保存失败，您还未选择待检套餐或项目')
            return false
          }
          let printConfig = getPrinterConfigFromLocalstorage()
          if (JSON.stringify(printConfig) === '{}') {
            this.$Message.error('请在右上角配置打印机')
            return false
          }
          // 如果上次总检了就是9，未总检就是0，是0的时候弹出
          if (this.patientInfoForm.visitStatus == 0 && this.patientInfoForm.boRegisterSn != 0) {
            this.$Modal.confirm({
              // title: '此人上次未做总检',
              content: '<p>上次体检未完成，是否再次登记？</p>',
              onOk: () => {
                this.saveAction()
                this.importData = false
                this.getInfoByEnter = false
              },
              onCancel: () => {

              }
            })
          } else {
            this.saveAction()
            this.importData = false
            this.getInfoByEnter = false
          }
        }
      })
    },
    // 打开预约历史框
    toBookingHistory () {
      this.historyModalVisible = true
    },
    // 导入预约用户图片地址
    importPic (base64Url) {
      // console.log(base64Url);
      this.patientInfoForm.boPic = base64Url
    },
    // 输入框回车时，根据身份证号，获取档案信息；无档案，则计算年龄及出生日期
    getAgeAndBirthday () {
      if (!this.patientInfoForm.boIdNo) return
      const params = {
        keyword: this.patientInfoForm.boIdNo.trim()
      }
      const pagination = {
        page: 1,
        size: 5
      }
      archivesList(pagination, params).then(({ data }) => {
        if (data.code === 0) {
          if (data.data.records.length > 0) {
            let obj = data.data.records[0]
            this.patientInfoForm = Object.assign(this.patientInfoForm, obj)
            //  是否保留身份证照片
            if (!this.patientInfoForm.boPic) {
              this.patientInfoForm.boPic = this.boPic
              this.boPic = ''
            } else {
              let picUrl = this.$url + this.patientInfoForm.boPic
              this.$set(this.patientInfoForm, 'boPic', picUrl)
            }
            this.patientInfoForm.boVisitSn = (this.patientInfoForm.boRegisterSn ? this.patientInfoForm.boRegisterSn + 1 : 1)
            if (!this.patientInfoForm.boChargeTypeId) {
              this.setChargTypeDefault()
            }
          } else {
            let _pic = this.boPic
            let _idNo = this.patientInfoForm.boIdNo.trim()
            let _name = this.patientInfoForm.boName || ''
            let _address = this.patientInfoForm.boAddress || ''
            this.handleReset('patientInfoForm')
            this.patientInfoForm.boPic = _pic
            this.patientInfoForm.boIdNo = _idNo
            this.patientInfoForm.boName = _name
            this.patientInfoForm.boAddress = _address
            this.boPic = ''
            let idNo = getBirthAndAge(_idNo)
            if (idNo.message) {
              this.$Message.error(idNo.message)
            } else {
              this.patientInfoForm.boBirthday = idNo.birthday
              this.patientInfoForm.boAge = idNo.age
              this.patientInfoForm.boSex = idNo.sex
            }
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // getAgeAndBirthday () {
    //   this.itemList = []
    //   if (!this.patientInfoForm.boIdNo) return
    //   this.getInfoByEnter = true
    //   let j = {}
    //   j['boIdNo'] = this.patientInfoForm.boIdNo.trim()
    //   j['boCertificatesType'] = this.patientInfoForm.boCertificatesType
    //   this.clearForm('patientInfoForm')
    //   // console.log(this.patientInfoForm)
    //   let pagination = {
    //     page: 1,
    //     size: 5
    //   }
    //   // 更换获取患者的信息接口
    //   getMasterIndexByNameAndIdNo(pagination, j).then(({ data }) => {
    //     if (data.data.records.length) {
    //       this.importData = true
    //       Object.assign(this.patientInfoForm, data.data.records[0])
    //       // console.log(this.patientInfoForm)
    //       this.delPickProjects()
    //       //  是否保留身份证照片
    //       if (!this.patientInfoForm.boPic) {
    //         this.patientInfoForm.boPic = this.boPic
    //         this.boPic = ''
    //       } else {
    //         let picUrl = this.$url + this.patientInfoForm.boPic
    //         this.$set(this.patientInfoForm, 'boPic', picUrl)
    //       }
    //       if (!this.patientInfoForm.boChargeTypeId) {
    //         this.setChargTypeDefault()
    //       }
    //       if (this.patientInfoForm.boCertificatesType == 1) {
    //         let idNo = getBirthAndAge(j['boIdNo'])
    //         if (idNo.message) {
    //           this.$Message.error(idNo.message)
    //         } else {
    //           this.patientInfoForm.boAge = idNo.age
    //         }
    //       }
    //       this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn + 1
    //       // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
    //       // this.patientInfoForm.boSettleStatus = "0";
    //       // 防止查询档案时，个人查到分组带出来
    //       if (this.patientInfoForm.boIsUnit == 0) {
    //         this.$set(this.patientInfoForm, 'boGroupId', '')
    //         this.$set(this.patientInfoForm, 'boGroupingName', '')
    //         //  个人的档案信息登记时，允许修改为单位人员
    //         this.importData = false
    //         this.patientInfoForm.boUnitId = null
    //         this.patientInfoForm.boMaritalStatus = this.patientInfoForm.boMaritalStatus ? this.patientInfoForm.boMaritalStatus : ''
    //       }
    //       if (this.patientInfoForm.boUnitId && this.patientInfoForm.boUnitId != '****') {
    //         this.unitsList = []
    //         this.groupsList = []
    //         this.unitsList.push({
    //           boUnitId: this.patientInfoForm.boUnitId,
    //           boUnitName: this.patientInfoForm.boUnitName
    //         })
    //         this.groupsList.push({
    //           boGroupId: this.patientInfoForm.boGroupId,
    //           name: this.patientInfoForm.boGroupingName
    //         })
    //         // this.getGroups()
    //         this.changeUnitGroup(this.patientInfoForm.boGroupId)
    //       }
    //       this.userPickPackageId = this.patientInfoForm.boPackageId
    //       this.userPickPackageName = this.patientInfoForm.boPackageName
    //       this.changePackage(this.userPickPackageId)
    //       // console.log(this.patientInfoForm)

    //       // 个人的（0）： 随意更改套餐，加减项目
    //       // 单位的（1）： 不能换套餐，只可以加项目
    //       if (+this.patientInfoForm.boIsUnit) {
    //         this.grayOff(this.pickProjectsTableData)
    //         this.grayAllPackage()
    //       } else {
    //         this.projectsChecked(this.pickProjectsTableData)
    //       }
    //       console.log('身份证回车')
    //       console.log(this.patientInfoForm)
    //     } else {
    //       this.$Message.info({
    //         content: '系统内无该人员信息',
    //         duration: 5
    //       })
    //       this.importData = false
    //       this.patientInfoForm.boPic = this.boPic
    //       this.boPic = ''
    //       let idNo = getBirthAndAge(j['boIdNo'])
    //       if (idNo.message) {
    //         this.$Message.error(idNo.message)
    //       } else {
    //         // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
    //         // this.patientInfoForm.boSettleStatus = "0";
    //         // this.patientInfoForm.boName = name;
    //         this.patientInfoForm.boIdNo = j['boIdNo']
    //         this.patientInfoForm.boCertificatesType = j['boCertificatesType']
    //         // j["boCertificatesType"] != 1 ? this.grayInput = false : this.grayInput = true;
    //         this.patientInfoForm.boBirthday = idNo.birthday
    //         this.patientInfoForm.boAge = idNo.age
    //         this.patientInfoForm.boSex = idNo.sex
    //         this.delPickProjects()
    //       }
    //     }
    //   }).catch(err => {
    //     // console.log(err)
    //     this.importData = false
    //     this.$Message.error('网络不稳定，请稍后重试')
    //     this.patientInfoForm.boPic = this.boPic
    //     this.boPic = ''
    //     let idNo = getBirthAndAge(j['boIdNo'])
    //     if (idNo.message) {
    //       this.$Message.error(idNo.message)
    //     } else {
    //       // this.patientInfoForm.boName = name;
    //       this.patientInfoForm.boIdNo = j['boIdNo']
    //       this.patientInfoForm.boCertificatesType = j['boCertificatesType']
    //       // j["boCertificatesType"] != 1 ? this.grayInput = false : this.grayInput = true;
    //       this.patientInfoForm.boBirthday = idNo.birthday
    //       this.patientInfoForm.boAge = idNo.age
    //       this.patientInfoForm.boSex = idNo.sex
    //       this.patientInfoForm.boSettleStatus = '0'
    //       this.delPickProjects()
    //     }
    //   })
    // },
    // 根据就诊卡号获取档案信息
    getInfoByVisitCard () {
      if (!this.patientInfoForm.boVisitCardNumber || (this.patientInfoForm.boVisitCardNumber.trim() == '')) {
        this.$Message.error('请填写就诊卡号！')
        return false
      }
      this.getInfoByEnter = true
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
      getMasterIndexByNameAndIdNo(pagination, params).then(({ data }) => {
        if (data.data.records.length) {
          this.importData = true
          Object.assign(this.patientInfoForm, data.data.records[0])
          // console.log(this.patientInfoForm)
          this.delPickProjects()
          if (!this.patientInfoForm.boPic) {
            this.patientInfoForm.boPic = this.boPic
            this.boPic = ''
          } else {
            let picUrl = this.$url + this.patientInfoForm.boPic
            this.$set(this.patientInfoForm, 'boPic', picUrl)
          }
          this.patientInfoForm.boVisitSn = this.patientInfoForm.boRegisterSn + 1
          // this.patientInfoForm.boCertificatesType != 1 ? this.grayInput = false : this.grayInput = true
          // this.patientInfoForm.boSettleStatus = "0";
          if (!this.patientInfoForm.boChargeTypeId) {
            this.setChargTypeDefault()
          }
          // 防止查询档案时，个人查到分组带出来
          if (this.patientInfoForm.boIsUnit == 0) {
            this.$set(this.patientInfoForm, 'boGroupId', '')
            this.$set(this.patientInfoForm, 'boGroupingName', '')
            //  个人的档案信息登记时，允许修改为单位人员
            this.importData = false
            this.patientInfoForm.boUnitId = null
            this.patientInfoForm.boMaritalStatus = this.patientInfoForm.boMaritalStatus ? this.patientInfoForm.boMaritalStatus : ''
          }
          if (this.patientInfoForm.boUnitId && this.patientInfoForm.boUnitId != '****') {
            this.unitsList = []
            this.groupsList = []
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
        } else {
          this.$Message.info({
            content: '系统内无该人员信息',
            duration: 5
          })
          this.importData = false
          this.delPickProjects()
        }
      }).catch(err => {
        // console.log(err)
        this.importData = false
        this.$Message.error(err.message)
        this.delPickProjects()
      })
    },
    // 根据套餐ID查找套餐名
    findPackageName (packageId) {
      // console.log(allPackages)
      this.allPackages.forEach(item => {
        if (item.id === packageId) {
          this.patientInfoForm.boPackageId = item.id
          this.patientInfoForm.boPackageCode = item.code
          this.patientInfoForm.boPackageName = item.name
          // this.packagePrice = item.price;
          this.packageCode = item.code
          this.userPickPackageName = item.name
        }
      })
    },
    // 判断单位还是个人,区分套餐与加做，自选
    isUnit (packageId, groupPayType = '0', addPayType = '1') {
      if (+this.patientInfoForm.boIsUnit) {
        // this.patientInfoForm.grayOwnExpense = false;
        this.patientInfoForm.grayOwnExpense = true
        // 单位
        this.pickProjectsTableData.forEach(item => {
          item.boPackageId = packageId
          // item.isAddItem = '套餐';
          item.isAddItem = 0
          item.boIsAdditional = 0
          // item.boIsOwnExpense = "0";
          item.boIsOwnExpense = groupPayType
        })
        console.log('单位')
        console.log(this.pickProjectsTableData)
      } else {
        this.patientInfoForm.grayOwnExpense = true
        // 个人
        this.pickProjectsTableData.forEach(item => {
          item.boPackageId = packageId
          // item.isAddItem = '套餐';
          item.isAddItem = 0
          item.boIsAdditional = 0
          if (this.patientInfoForm.boSettleStatus == '1') {
            item.boIsOwnExpense = '0'
          } else {
            item.boIsOwnExpense = '1'
          }
        })
        console.log('个人')
        console.log(this.pickProjectsTableData)
      }
      console.log(this.pickProjectsTableData)
      // 个人的（0）： 随意更改套餐，加减项目
      // 单位的（1）： 不能换套餐，只可以加项目
      this.delGrayOff()
      if (+this.patientInfoForm.boIsUnit) {
        this.grayOff(this.pickProjectsTableData)
      } else {
        this.projectsChecked(this.pickProjectsTableData)
      }
      if (this.fixPrice) {
        this.fixPrice = false
      }
    },
    // 修改套餐,获取已选项目信息
    changePackage (packageId) {
      this.itemList = []
      this.$refs.projectInputDrop.filterText = ''
      this.findPackageName(packageId)
      let comboParams = {
        paPackageId: packageId
      }
      if (comboParams.paPackageId) {
        this.emptyText = '数据加载中...'
        getComboByPackage(comboParams).then((res) => {
          let result = res.data
          // console.log(result);
          if (result.code === 0) {
            // 数组深拷贝
            [...this.pickProjectsTableData] = result.data
            this.pickProjectsTableData.forEach(item => {
              item.boComboSort = item.paSort
            })
            this.emptyText = '此套餐下无项目组合'
          } else {
            this.emptyText = '暂无数据'
            this.$Message.error(result.message)
          }
          this.isUnit(comboParams.paPackageId)
        }).catch(err => {
          this.$Message.error(err.message)
        })
      }
    },
    // 滚轮到未选套餐底部刷新
    reachPackageBottom () {
      if (+this.patientInfoForm.boIsUnit) return
      return new Promise(resolve => {
        setTimeout(() => {
          this.packagePageIndex++
          this.getPackagesList()
          resolve()
        }, 300)
      })
    },
    // 滚轮到未选项目底部刷新
    handleReachBottom () {
      return new Promise(resolve => {
        setTimeout(() => {
          this.comboPageIndex++
          this.showItem()
          resolve()
        }, 300)
      })
    },
    // 分页展示数据 未选项目
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
      }
      let params = {
        keyword: query,
        paDeptId: this.paDeptId == 'all' ? '' : this.paDeptId,
        paFlag: this.isComboProject,
        paSex: this.patientInfoForm.boSex
      }
      getItemByPage(pagination, params).then(res => {
        // console.log(res.data);
        let result = res.data
        if (result.code == 0) {
          // this.projects = [];
          // this.comboPages = result.data.pages;
          // 判断当前页数和总页数是否相等，如果相同就不需要再请求了
          this.comboPageIndex == result.data.pages ? this.isProjectMore = true : this.isProjectMore = false
          result.data.records.forEach(item => {
            this.projects.push(item)
            if (query != '') {
              this.searchProList.push(item)
            }
          })
          this.totalItemNum = result.data.total
          // 个人的（0）： 随意更改套餐，加减项目
          // 单位的（1）： 不能换套餐，只可以加项目
          this.delGrayOff()
          if (+this.patientInfoForm.boIsUnit) {
            this.grayOff(this.pickProjectsTableData)
          } else {
            this.projectsChecked(this.pickProjectsTableData)
          }
          console.log('项目组合重复了')
          console.log(this.projects)
        } else {
          this.$Message.error(result.message)
        }
        this.projectSearchLoading = false
      }).catch(err => {
        this.projectSearchLoading = false
        this.$Message.error(err.message)
      })
    },
    // 根据已选项目反选未选项目的勾选项
    projectsChecked (tableData) {
      // console.log('传入已选项目长度' + tableData.length);
      this.pickProjects = []

      // 遍历所有体检组合项目
      for (let i = 0; i < this.projects.length; i++) {
        // console.log(tableData[i].paName);
        for (let j = 0; j < tableData.length; j++) {
          if (this.projects[i].name == tableData[j].paName) {
            this.pickProjects.push(tableData[j].paId)
          }
        }
      }
      // 切换科室后，保存新的勾选项总数
      this.tempPick = null
      this.tempPick = [...this.pickProjects]
      this.tempPickLength = this.tempPick.length
    },
    // 灰色勾选默认套餐项目组合
    grayOff (tableData) {
      // console.log('传入已选项目长度' + tableData.length);
      this.pickProjects = []
      this.delGrayOff()

      // 遍历所有体检组合项目，设置gray属性
      for (let i = 0; i < this.projects.length; i++) {
        // console.log(tableData[i].paName);
        for (let j = 0; j < tableData.length; j++) {
          if (this.projects[i].name == tableData[j].paName && tableData[j].boIsAdditional == 0) {
            this.pickProjects.push(tableData[j].paId)
            this.projects[i].gray = true
          } else if (this.projects[i].name == tableData[j].paName && tableData[j].boIsAdditional == 1) {
            this.pickProjects.push(tableData[j].paId)
          }
        }
      }
      this.tempPick = this.pickProjects
      // console.log(this.tempPick + '....')
      this.tempPickLength = this.tempPick.length
    },
    // 清除灰掉样式
    delGrayOff () {
      this.projects.forEach(item => {
        item.gray = false
      })
    },
    // 改变选择框时，查询数据 按科室分类筛选,按项目分类筛选
    changeItem () {
      console.log('我是科室ID' + this.paDeptId)
      // 清空状态
      this.$refs.projectInputDrop.filterText = ''
      this.isProjectMore = false
      this.searchProList = []
      this.comboPageIndex = 1
      this.projects = []
      this.tempPickLength = 0
      this.showItem()
    },
    changeProject () {
      // if (!this.patientInfoForm.boSex) {
      //   this.$Message.info('请先选择性别，再选择体检项目')
      //   this.pickProjects = []
      //   return false
      // }
      this.itemList = []
      this.emptyText = '数据加载中...'
      // console.log(this.pickProjects);
      // console.log('userpick'+this.userPickPackages)
      // console.log('temp长度' + this.tempPickLength);
      // console.log('pick长度' + this.pickProjects.length);
      if (this.pickProjects.length > this.tempPickLength) {
        // console.log('加项')
        // console.log(this.pickProjects);
        // console.log(this.projects)
        let lastId = this.pickProjects[this.pickProjects.length - 1]
        // console.log(lastId)

        // 防止多次点击, 灰掉勾选框
        for (let i = 0; i < this.projects.length; i++) {
          if (this.projects[i].id == lastId) {
            this.projects[i].gray = true
            break
          }
        }
        // 发送请求，参数组合ID，获取树结构
        getItemTreeByComboId({ paComboId: lastId }).then(res => {
          let result = res.data
          if (result.code == 0) {
            let addItem = result.data
            if (+this.patientInfoForm.boIsUnit) {
              // this.patientInfoForm.grayOwnExpense = false;
              this.patientInfoForm.grayOwnExpense = true
              // 公司
              this.pickProjectsTableData.unshift({
                paId: addItem.id,
                paCode: addItem.comboCode,
                paName: addItem.comboName,
                paExamType: addItem.examType,
                paPrice: addItem.discountValue,
                paDeptId: addItem.deptId,
                paDeptName: addItem.deptName,
                children: {
                  paId: addItem.children.id,
                  paName: addItem.children.itemName,
                  paPrice: addItem.children.price
                },
                // isAddItem: '加做',
                isAddItem: 1,
                boIsAdditional: 1,
                boComboSort: addItem.paSort,
                boIsOwnExpense: !this.addPayType ? '1' : this.addPayType,
                paTestTubeId: addItem.testTubeId
              })
            } else {
              this.patientInfoForm.grayOwnExpense = true
              // 个人
              this.pickProjectsTableData.unshift({
                paId: addItem.id,
                paCode: addItem.comboCode,
                paName: addItem.comboName,
                paExamType: addItem.examType,
                paPrice: addItem.discountValue,
                paDeptId: addItem.deptId,
                paDeptName: addItem.deptName,
                children: {
                  paId: addItem.children.id,
                  paName: addItem.children.itemName,
                  paPrice: addItem.children.price
                },
                // isAddItem: '加做',
                isAddItem: 1,
                boIsAdditional: 1,
                boComboSort: addItem.paSort,
                boIsOwnExpense: '1',
                paTestTubeId: addItem.testTubeId
              })
            }
            this.pushItemList()
            console.log(this.itemList)
            this.tempPick = this.pickProjects
            this.tempPickLength = this.tempPick.length
            this.noPackage()
            for (let j = 0; j < this.projects.length; j++) {
              if (this.projects[j].id == lastId) {
                this.projects[j].gray = false
                break
              }
            }
          } else {
            this.emptyText = '暂无数据'
            this.$Message.error(result.message)
            for (let j = 0; j < this.projects.length; j++) {
              if (this.projects[j].id == lastId) {
                this.projects[j].gray = false
                break
              }
            }
          }
        }).catch(err => {
          this.emptyText = '网络不稳定，暂无数据，请稍后重试'
          this.$Message.error('网络不稳定，请稍后重试')
        })
      } else if (this.pickProjects.length < this.tempPickLength) {
        // console.log('减项')
        // console.log(this.pickProjects);
        // console.log('temp长度' + this.tempPickLength);
        // console.log('pick长度' + this.pickProjects.length);
        let uncheckItemId = this.getDiffrence(this.pickProjects, this.tempPick)
        let delIndex = 0
        let isInPackage = false
        // console.log(uncheckItemId);
        // 防止多次点击, 灰掉勾选框
        for (let m = 0; m < this.projects.length; m++) {
          if (this.projects[m].id == uncheckItemId) {
            this.projects[m].gray = true
            break
          }
        }
        this.pickProjectsTableData.forEach((item, index) => {
          if (item.paId == uncheckItemId) {
            console.log(index)
            delIndex = index
            if (item.boIsAdditional == 0) {
              isInPackage = true
            }
          }
        })
        this.pickProjectsTableData.splice(delIndex, 1)
        // 只要删掉一个套餐里的，其他全部当成加项处理
        if (isInPackage) {
          this.pickProjectsTableData.forEach((item, index) => {
            // item.isAddItem = '加做';
            item.isAddItem = 1
            item.boIsAdditional = 1
            this.itemList.push({
              boComboId: item.paId,
              boComboName: item.paName,
              boIsOwnExpense: item.boIsOwnExpense, // 自费标志
              boSort: index, // 表格排序序号，暂时无用
              boIsAdditional: 1, // 加项标志
              boDeptId: item.paDeptId,
              boDeptName: item.paDeptName,
              boComboSort: item.boComboSort,
              boAmount: item.paPrice,
              boRealAmount: item.paPrice
            })
          })
          this.userPickPackageId = ''
          this.userPickPackageName = ''
          this.$set(this.patientInfoForm, 'boPackageId', '')
          this.$set(this.patientInfoForm, 'boPackageCode', '')
          this.$set(this.patientInfoForm, 'boPackageName', '')
        } else {
          this.pushItemList()
        }
        console.log(this.itemList)
        this.tempPick = this.pickProjects
        this.tempPickLength = this.tempPick.length
        if (!this.pickProjectsTableData.length) {
          this.emptyText = '暂无数据'
        }
        this.noPackage()
        for (let n = 0; n < this.projects.length; n++) {
          if (this.projects[n].id == uncheckItemId) {
            this.projects[n].gray = false
            break
          }
        }
      }
      // 如果有改价，恢复正常价格显示
      if (this.fixPrice) {
        this.fixPrice = false
      }
    },
    noPackage () {
      // 如果没有套餐，加做全部改为自选
      if (!this.userPickPackageId) {
        this.pickProjectsTableData.forEach(item => {
          // item.isAddItem = '自选'
          item.isAddItem = 2
        })
      }
    },
    // 找到不同的项目组合ID
    getDiffrence (arr1, arr2) {
      return arr1.concat(arr2).filter((v, i, arr) => {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    // 开启摄像弹窗，由于capture组件未销毁，导致两个页面调用该组件时，只有其中一个能正常使用摄像功能，需要销毁组件重建
    openCaptureModal () {
      this.captureModalVisible = true
      this.$nextTick(() => {
        this.hackReset = true// 重建组件
      })
    },
    // 关闭摄像弹窗
    closeCaptureModal () {
      this.captureModalVisible = false
      this.hackReset = false // 销毁组件
    },
    // 姓名框按回车键弹出查询体检人员
    openSearchPerson () {
      // console.log(this.patientInfoForm.boName)
      this.boName = this.patientInfoForm.boName.trim()
      this.personModalVisible = true
    },
    closePerson () {
      this.boName = ''
      this.personModalVisible = false
    },
    searchName (page = 1, size = 10, formData) {
      this.searchPersonLoading = true
      // 请求患者过往预约信息
      let pagination = {
        page: page,
        size: size
      }
      // console.log(formData);
      getMasterIndexByNameAndIdNo(pagination, formData).then(({ data }) => {
        // console.log(data)
        if (data.code == 0) {
          // 表单数据存入
          this.personTableData = data.data.records
          this.personTableData.forEach(item => {
            item.boIsUnit == 0 ? item.IsUnit = '个人' : item.IsUnit = '单位'
            if (item.boCertificatesType == 1) item.CertificatesType = '身份证'
            if (item.boCertificatesType == 2) item.CertificatesType = '士兵证'
            if (item.boCertificatesType == 3) item.CertificatesType = '军官证'
            if (item.boCertificatesType == 4) item.CertificatesType = '警官证'
            if (item.boCertificatesType == 5) item.CertificatesType = '护照'
            if (item.boCertificatesType == 6) item.CertificatesType = '其他'
          })
          this.personTotalSize = data.data.total
          this.searchPersonLoading = false
        } else {
          this.searchPersonLoading = false
          this.$Message.error(result.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },
    closeHistory () {
      this.historyModalVisible = false
    },

    // 选择单位时获取最新单位次数下的部门
    getUnitDept (item) {
      this.selectDeptArr = []
      this.unitDeptList = []
      const params = {
        boUnitId: item.boUnitId
      }
      newUnitDept(params).then(({ data }) => {
        if (data.code == 0) {
          this.unitDeptList = data.data
          this.transCascaderData(this.unitDeptList)
          console.log(this.unitDeptList)
        } else {
          this.$Message.error(data.message)
        }
      })
    },

    // 处理部门级联数据
    transCascaderData (arr) {
      arr.forEach(item => {
        item.value = item.deptId
        item.label = item.name
        if (item.children) {
          item.children.forEach(v => {
            v.value = v.deptId
            v.label = v.deptName
          })
        }
      })
      return arr
    },

    // 选择部门
    unitDeptChange (value, selectedData) {
      if (selectedData.length == 2) {
        // 即选择了父级部门，又选择了子级部门
        this.patientInfoForm.boSubDepartmentName = selectedData[1].deptName
        this.patientInfoForm.boSubDepartmentId = selectedData[1].deptId
        this.patientInfoForm.boDepartmentId = selectedData[1].parentId
        this.patientInfoForm.boDepartment = selectedData[1].parentName
        // console.log(this.formData)
      } else if (selectedData.length == 1) {
        // 只选择了父级
        this.patientInfoForm.boSubDepartmentName = ''
        this.patientInfoForm.boSubDepartmentId = ''
        this.patientInfoForm.boDepartmentId = selectedData[0].deptId
        this.patientInfoForm.boDepartment = selectedData[0].name
      } else {
        // 什么都没有选
        this.patientInfoForm.boSubDepartmentName = ''
        this.patientInfoForm.boSubDepartmentId = ''
        this.patientInfoForm.boDepartmentId = ''
        this.patientInfoForm.boDepartment = ''

      }
    },

    // 修改总金额
    applyNewPrice (formData) {
      // console.log(formData)
      this.fixPrice = true
      Object.assign(this.patientInfoForm, formData)
      // console.log(this.patientInfoForm)
    },
    // 申请改价弹框显示
    openPriceModal () {
      if (+this.patientInfoForm.boIsUnit) {
        this.$Message.warning('暂不支持单位改价')
        return
      }
      this.priceModalVisible = true
    },
    // 是否开启保存信息后，自动清空功能
    changeAutoClear (status) {
      console.log(status)
      console.log(this.isAutoClear)
      setAutoClearStorage({ isPersonalRegister: status })
    }
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
    .groupStar .ivu-form-item-label:before {
      content: '*';
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
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
  .ivu-cascader {
    line-height: 32px;
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
  // 选择框禁止色改为白底 - 特殊需求
  .ivu-select-disabled .ivu-select-selection,
  .ivu-input {
    background-color: #fff;
  }
}
</style>
