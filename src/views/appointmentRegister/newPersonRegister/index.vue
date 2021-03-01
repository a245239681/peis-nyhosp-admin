<template>
  <div class="new-person-register-wrapper">
    <!-- 基本信息 start -->
    <div class="basic-info-wrapper">
      <Card style="width: 100%;"
            :padding="10">
        <Form ref="formData"
              class="basic-info"
              :model="formData"
              label-position="right"
              :rules="ruleValidate"
              inline
              :show-message="false">
          <div class="avatar-wrapper">
            <div class="pic">
              <img :src="formData.boPic"
                   v-if="!!formData.boPic"
                   alt="登记用户头像">
              <img src="@/assets/images/userPhoto.png"
                   v-else
                   alt="登记用户头像">
            </div>
            <div class="pic-handle">
              <Button type="primary"
                      style="width:100%"
                      @click="openCaptureModal"
                      size="small">拍照采集</Button>
            </div>
          </div>
          <div class="sub-wrapper"
               style="min-width: 310px">
            <Row type="flex">
              <FormItem label="姓名"
                        prop="boName"
                        :label-width="55">
                <Input v-model="formData.boName"
                       search
                       size="small"
                       style="min-width:120px"
                       @on-blur="filterSpace"
                       @on-enter="profileSearch"
                       clearable />
              </FormItem>
              <FormItem label="证件"
                        prop="boCertificatesType"
                        :label-width="55">
                <Select v-model="formData.boCertificatesType"
                        style="min-width:70px"
                        size="small">
                  <Option value="1">身份证</Option>
                  <Option value="2">士兵证</Option>
                  <Option value="3">军官证</Option>
                  <Option value="4">警官证</Option>
                  <Option value="5">护照</Option>
                  <Option value="6">其他</Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="体检类型"
                        prop="boCategoryId"
                        style="flex:1"
                        :label-width="80">
                <Select v-model="formData.boCategoryId"
                        size="small"
                        style="min-width:140px"
                        transfer
                        @on-change="changeCategory"
                        :label-in-value="true">
                  <Option v-for="item in categoryList"
                          :value="item.cdId"
                          :key="item.cdId">{{item.cdName}}</Option>
                </Select>
              </FormItem>
              <FormItem label="费别"
                        prop="boChargeTypeId"
                        :label-width="55">
                <Select v-model="formData.boChargeTypeId"
                        :label-in-value="true"
                        @on-change="changeChargeType"
                        style="min-width:70px"
                        size="small">
                  <Option v-for="item in chargeTypeList"
                          :value="item.cdId"
                          :key="item.cdId">{{ item.cdName }}</Option>
                </Select>
              </FormItem>
            </Row>
            <Row>
              <FormItem label="个人/单位"
                        :label-width="85"
                        prop="boIsUnit">
                <RadioGroup v-model="formData.boIsUnit"
                            @on-change="personOrUnitChange"
                            size="small">
                  <Row>
                    <Col span="12">
                    <Radio label="0">个人体检</Radio>
                    </Col>
                    <Col span="12">
                    <Radio label="1">单位团检</Radio>
                    </Col>
                  </Row>
                </RadioGroup>
              </FormItem>
            </Row>
          </div>
          <div class="sub-wrapper"
               style="min-width: 310px">
            <Row type="flex">
              <FormItem label="证件号码"
                        prop="boIdNo"
                        style="flex:1"
                        :label-width="80">
                <Input v-model.lazy="formData.boIdNo"
                       @on-enter="getAgeAndBirthday"
                       @on-blur="AgeAndBirthday"
                       search
                       clearable
                       size="small" />
              </FormItem>
              <FormItem label="性别"
                        prop="boSex"
                        :label-width="55">
                <Select v-model="formData.boSex"
                        style="width:80px"
                        size="small">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="联系方式"
                        prop="boMobile"
                        style="flex:1"
                        :label-width="80">
                <Input v-model="formData.boMobile"
                       clearable
                       size="small" />
              </FormItem>
              <FormItem label="体检优先级"
                        prop="boPriorityId"
                        :label-width="85">
                <Select v-model="formData.boPriorityId"
                        :label-in-value="true"
                        @on-change="changePriority"
                        filterable
                        style="width:80px"
                        size="small">
                  <Option v-for="item in priorityList"
                          :value="item.cdId"
                          :key="item.cdId">{{item.cdName}}</Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="单位名称"
                        prop="boUnitId"
                        style="flex:1"
                        :label-width="80">
                <Select v-model="formData.boUnitId"
                        class="unitSelect"
                        ref="unitSelectBox"
                        clearable
                        filterable
                        remote
                        size="small"
                        :disabled="formData.boIsUnit === '0'"
                        v-if="formData.boIsUnit === '1' && !importFlag"
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
                <Input :value="formData.boUnitName"
                       v-else
                       disabled
                       size="small" />
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem class="settlement-sel-group"
                        v-permission="['print']"
                        style="flex:1"
                        prop="selGroup">
                <CheckboxGroup v-model="formData.selGroup"
                               size="default">
                  <!-- <Checkbox label="createRequestNote"
                                  v-permission="['print']"
                                  disabled>打印申请单</Checkbox> -->
                  <Checkbox label="printGuide"
                            size="large"
                            style="color:#252525;">打印指引单</Checkbox>
                  <Checkbox label="printSampleCode"
                            size="large"
                            style="color:#252525;">打印条码</Checkbox>
                </CheckboxGroup>
              </FormItem>
              <FormItem label="空白标签个数"
                        v-permission="['print']"
                        prop="labelNum"
                        :label-width="100">
                <Select v-model="formData.labelNum"
                        style="width:87px;"
                        size="small"
                        clearable>
                  <Option v-for="item in labelNumList"
                          :value="item"
                          :key="item">{{item}}</Option>
                </Select>
              </FormItem>
            </Row>
          </div>
          <div class="sub-wrapper"
               style="flex: 1;">
            <Row type="flex">
              <FormItem label="出生日期"
                        prop="boBirthday"
                        style="flex:1"
                        :label-width="80">
                <DatePicker type="date"
                            placeholder="选择出生日期"
                            size="small"
                            style="width:100%;"
                            clearable
                            @on-change="birthChange"
                            v-model="formData.boBirthday"
                            :options="birth"></DatePicker>
              </FormItem>
              <FormItem label="年龄"
                        :label-width="55"
                        prop="boAge">
                <Input v-model="formData.boAge"
                       size="small"
                       style="width:40px"
                       disabled />
              </FormItem>
              <FormItem label="婚姻状态"
                        prop="boMaritalStatus"
                        :label-width="75">
                <Select v-model="formData.boMaritalStatus"
                        style="width:87px"
                        size="small">
                  <Option value="不详">不详</Option>
                  <Option value="未婚">未婚</Option>
                  <Option value="已婚">已婚</Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="联系地址"
                        prop="boAddress"
                        style="flex:1"
                        :label-width="80">
                <Input v-model="formData.boAddress"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="体检次数"
                        :label-width="75"
                        prop="boVisitSn">
                <Input v-model="formData.boVisitSn"
                       disabled
                       style="width:87px"
                       size="small" />
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="所属部门"
                        style="flex:1"
                        :label-width="80">
                <Cascader :data="unitDeptList"
                          v-model="selectDeptArr"
                          change-on-select
                          size="small"
                          v-if="formData.boIsUnit === '1' && !importFlag"
                          style="width:100%;"
                          @on-change="unitDeptChange"></Cascader>
                <Input :value="(formData.boDepartmentName ? 
                            (formData.boSubDepartmentName ? 
                            formData.boDepartmentName  + '/' + formData.boSubDepartmentName : formData.boDepartmentName ) : '' )"
                       v-else
                       disabled
                       size="small" />
              </FormItem>
              <FormItem label="体检分组"
                        prop="boGroupId"
                        :class="{groupStar: formData.boIsUnit == '1'}"
                        :label-width="80">
                <Select v-model="formData.boGroupId"
                        :disabled="formData.boIsUnit === '0'"
                        size="small"
                        style="width:170px"
                        v-if="formData.boIsUnit === '1' && !importFlag"
                        @on-change="unitGroupChange"
                        :label-in-value="true"
                        clearable>
                  <Option v-for="item in groupsList"
                          :value="item.boGroupId"
                          :key="item.boGroupId">{{ item.name }}</Option>
                </Select>
                <Input :value="formData.boGroupName"
                       v-else
                       disabled
                       size="small" />
              </FormItem>
            </Row>
            <Row type="flex"
                 align="middle"
                 style="margin-right:10px;">
              <FormItem label="自动清空"
                        style="flex:1;min-width:140px;">
                <i-switch v-model="isAutoClear"
                          size="large"
                          @on-change="changeAutoClear">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
              </FormItem>
              <Button type="error"
                      style="margin-right:8px"
                      @click="resetHandle">清空页面</Button>
              <Button style="margin-right:8px"
                      type="primary"
                      @click="historySearch">查询预约</Button>
              <Button id='readIDCard'
                      style="margin-right:8px"
                      type="primary"
                      :loading="readCardLoading"
                      @click="readIdCard">扫描证件</Button>
              <Button type="primary"
                      v-permission="['add']"
                      :loading="registerLoading"
                      @click="handleSubmit">确认登记</Button>
            </Row>
          </div>

        </Form>
      </Card>
    </div>
    <!-- 基本信息 end -->
    <Row type="flex"
         style="margin-top: 10px">
      <!-- 未选套餐 start -->
      <div class="sub-wrapper"
           style="width: 272px;margin-right: 10px;">
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
                          :dropList="unSelectPackageList"
                          @search="searchPackage"
                          @clear="clearPackage"
                          @selectOption="changePackage"
                          :isLoading="packageSearchLoading"></input-drop>
            </div>
          </div>
          <Scroll :height="580"
                  :on-reach-bottom="updateSearchPackageList"
                  :distance-to-edge="-24">
            <RadioGroup v-model="curSelectPackage.packageId"
                        class="unselect-package"
                        vertical
                        @on-change="changePackage">
              <Radio :label="item.id"
                     v-for="item in unSelectPackageList"
                     :key="item.rowId"
                     class="unselect-package-item"
                     :disabled="item.disabled">{{item.name}}</Radio>
            </RadioGroup>
          </Scroll>
        </Card>
      </div>
      <!-- 未选套餐 end -->
      <!-- 未选项目 start -->
      <div class="sub-wrapper"
           style="width: 425px;margin-right: 10px;">
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
                          :dropList="unSelectProjectList"
                          :isLoading="projectSearchLoading"
                          @search="searchProject"
                          @selectOption="selectProjectByEnter"
                          @clear="clearProject"></input-drop>
            </div>
          </div>
          <Row :gutter="16"
               class="select-groups">
            <Col span="12">
            <div class="flex-wrapper">
              <span class="label">科室分类：</span>
              <Select v-model="curDeptId"
                      filterable
                      size="small"
                      @on-change="deptChange">
                <Option value="all"
                        :key="1 + new Date().getTime()">全部</Option>
                <Option v-for="item in deptList"
                        :value="item.poId"
                        :key="item.poId">{{ item.poDeptName }}</Option>
              </Select>
            </div>

            </Col>
            <Col span="4">
            <span>共{{totalItemNum}}项</span>
            </Col>
          </Row>
          <Scroll :height="536"
                  style="margin-top:20px;"
                  :on-reach-bottom="updateProjectList"
                  :distance-to-edge="-24">
            <CheckboxGroup v-model="selectedProjectList"
                           class="unpick-projects"
                           @on-change="changeProject">
              <Checkbox :label="item.id"
                        v-for="(item, index) in unSelectProjectList"
                        :key="index"
                        class="unpick-projects-item"
                        :disabled="item.disabled">
                <span style="margin-left: 3px;">{{item.name}}</span>
              </Checkbox>
            </CheckboxGroup>
          </Scroll>
        </Card>
      </div>
      <!-- 未选项目 end -->
      <!-- 已选项目 start -->
      <div class="sub-wrapper"
           style="flex: 1;min-width: 675px;">
        <Card :bordered="false"
              shadow
              class="pick-projects">
          <div slot="title"
               class="search-title-wrapper">
            <span class="title">已选项目</span>
            <div class="title-right-tool">
              <Button style="margin-right: 8px;"
                      @click="printInvoice"
                      size="small">打印价格明细</Button>
              <!-- 暂不使用 -->
              <!-- <Button @click="openPriceModal"
                      style="margin-right: 8px;"
                      size="small">申请改价</Button> -->
              <Button type="default"
                      size="small"
                      @click="clearComboItem">清空项目</Button>
            </div>
          </div>
          <vxe-table class="mytable-footer"
                     ref="selectedTable"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     align="center"
                     :row-class-name="addItemColor"
                     :cell-class-name="checkExamColor"
                     header-row-class-name="table-row"
                     @cell-dblclick="cancelRowHandle"
                     :height="425"
                     :data="tableData"
                     :loading="isLoading">
            <vxe-table-column field="paIsOwnExpense"
                              title="费别"
                              width="100">
              <template v-slot="{row}">
                <Tag color="green"
                     v-if="row.paIsOwnExpense == '0'">公费</Tag>
                <Tag color="magenta"
                     v-else-if="row.paIsOwnExpense == '1'">自费</Tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="paComboTypeName"
                              title="类型"
                              min-width="80">
              <template v-slot="{row}">
                <Tag color="green"
                     v-if="row.paComboTypeName == '套餐' || row.paPackageId">套餐</Tag>
                <Tag color="orange"
                     v-else-if="row.paComboTypeName == '加做' || row.paIsAdditional == '1'">加做</Tag>
                <Tag color="magenta"
                     v-else>自选</Tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="paDeptName"
                              title="科室"
                              min-width="140"></vxe-table-column>
            <vxe-table-column field="paComboName"
                              title="项目名称"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="paPayStatus"
                              title="缴费状态"
                              min-width="80">
              <template v-slot="{row}">
                <Tag color="green"
                     v-if="row.paPayStatus == '0'">已缴费</Tag>
                <Tag color="red"
                     v-else-if="row.paPayStatus == '1'">未缴费</Tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="paRealAmount"
                              title="单价"
                              min-width="80">
              <template v-slot="{row}">
                <span v-if="row.paRealAmount">{{row.paRealAmount.toFixed(2)}}</span>
                <span v-else>0.00</span>
              </template>
            </vxe-table-column>
          </vxe-table>
          <div class="selected-package">
            <div class="label">已选套餐：</div>
            <div class="content">{{curSelectPackage.packageName ? curSelectPackage.packageName : '无'}}</div>
          </div>
          <vxe-table class="mytable-footer"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     align="center"
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :data="amountData"
                     :loading="isLoading">
            <vxe-table-column field="addItemAmount"
                              title="加项金额"
                              min-width="100">
              <template v-slot="{row}">
                <span>{{row.addItemAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="totalAmount"
                              title="合计金额"
                              min-width="100">
              <template v-slot="{row}">
                <span>{{row.totalAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="paidAmount"
                              title="已缴费"
                              min-width="120">
              <template v-slot="{row}">
                <span>{{row.paidAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="unPaidAmount"
                              title="待缴费"
                              min-width="120">
              <template v-slot="{row}">
                <span>{{row.unPaidAmount.toFixed(2)}}</span>
              </template>
            </vxe-table-column>
          </vxe-table>
        </Card>
      </div>
      <!-- 已选项目 end -->
    </Row>

    <!-- 拍照弹窗 start -->
    <capture :visible="captureModalVisible"
             v-if="hackReset"
             @cancel="closeCaptureModal"
             @ok="importPic"></capture>
    <!-- 拍照弹窗 end -->
    <!-- 历史预约弹窗 start -->
    <History ref="historyWrapper"
             :visible="historyModalVisible"
             @bookingImport="getBookingInfo"
             @close="historyModalVisible = false"></History>
    <!-- 历史预约弹窗 end -->

    <!-- 体检档案弹窗 start -->
    <Profile ref="profileWrapper"
             :visible="profileModalVisible"
             @profileImport="getProfileInfo"
             @close="profileModalVisible = false"></Profile>
    <!-- 体检档案弹窗 end -->

  </div>
</template>
<script>
import moment from 'moment'
import { getBirthAndAge } from '@/libs/tools.js'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import { printFunc } from '@/libs/printOrder.js'
import { directPrintFunc } from '@/libs/directPrint.js'
import InputDrop from '@/views/appointmentRegister/components/inputDrop'
import { getPrinterConfigFromLocalstorage, setAutoClearStorage, getAutoClearStorage } from '@/libs/util'
import Capture from '@/views/appointmentRegister/components/capture'
import History from './history'
import Profile from './profile'
import jsonp from 'jsonp'

import {
  getBookingPackage,
  getComboByPackage,
  searchGroupProjects,
  listAllByUnitId,
  getItemByPage,
  listByName,
  newUnitDept,
  selectComboInfo,
  profileList,
  printDetail,
  saveRegister,
  printBarcode,
  printGuide,
} from '@/api/newPersonRegister'

export default {
  name: 'newPersonRegister',
  components: {
    InputDrop,
    Capture,
    History,
    Profile
  },
  data () {
    // 选中单位后验证分组
    const checkGroupId = (rule, value, callback) => {
      console.log('validate=>' + this.formData.boIsUnit)
      if (this.formData.boIsUnit == '1' && !this.formData.boGroupId) {
        callback(new Error('请选择体检分组！'))
      } else {
        callback()
      }
    }
    const examTypeValid = (rule, value, callback) => {
      if (!this.formData.boCategoryId) {
        callback(new Error('请选择体检类型！'))
      } else {
        callback()
      }
    }
    const checkIdno = (rule, value, callback) => {
      // 身份证为空时，也可以通过校验
      let reg2 = true
      if (!value) {
        reg2 = false
      } else if (value.length == 15 || value.length == 18) {
        reg2 = true
      }
      if (reg2 && this.formData.boCertificatesType == 1) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!reg.exec(value)) {
          callback(new Error('请输入正确的身份证号'))
        }
      } else if (reg2 && this.formData.boCertificatesType == 5) {
        const reg1 = /^[a-zA-Z0-9]{3,21}$/
        const reg2 = /^(P\d{7})|(G\d{8})$/
        if (!reg1.exec(value) && !reg2.exec(value)) {
          callback(new Error('请输入正确的护照号'))
        }
      } else if (reg2 && this.formData.boCertificatesType == 2 && this.formData.boCertificatesType == 3) {
        const reg = /^[a-zA-Z0-9]{7,21}$/
        if (!reg.exec(value)) {
          callback(new Error('请输入正确的证件号'))
        }
      } else if (reg2) {
        const reg = /^[a-zA-Z0-9]*$/
        if (!reg.exec(value)) {
          callback(new Error('证件号只允许输入英文和数字'))
        }
      }
      callback()
    }

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
      formData: {
        boIsUnit: '0',
        selGroup: ['printGuide', 'printSampleCode'], // 默认打印指引单、条码
        boCertificatesType: '1'
      },
      ruleValidate: {
        boName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        boIdNo: [
          { validator: checkIdno, trigger: 'blur' }
        ],
        boBirthday: [
          { required: true, message: '生日不能为空' }
        ],
        boChargeTypeId: [
          { required: true, message: '请选择费别' }
        ],
        boSex: [
          { required: true, message: '请选择性别' }
        ],
        boIsUnit: [
          { required: true, message: '请选择个人/单位' }
        ],
        boGroupId: [
          { validator: checkGroupId, trigger: 'change' }
        ],
        boMobile: [
          // { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'change' }
        ],
        boVisitCardNumber: [
          { pattern: /^[0-9a-zA-Z]+$/, message: '请输入数字或英文', trigger: 'blur' }
        ],
        boCategoryId: [
          { required: true, validator: examTypeValid, message: '请选择体检类型', trigger: 'change' }
        ]
      },
      birth: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
      labelNumList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      unitSearchLoading: false, // 单位搜索框loading
      unitTimer: null, // 定时器
      unitsList: [], // 单位列表
      groupsList: [], // 分组列表
      unitDeptList: [], // 单位部门数据
      selectDeptArr: [], // 当前选中部门数据
      isAutoClear: false, // 保存后是否自动清空页面内容
      packageSearchLoading: false, // 搜索未选套餐loading
      morePackageFlag: true, // 判断当前套餐页是否为最后一页
      packagePageIndex: 1, // 未选套餐当前页
      packagePageSize: 20, // 未选套餐每页数据条数
      unSelectPackageList: [],// 未选套餐列表
      curSelectPackage: {  // 当前选中套餐
        packageId: '',
        packageName: '',
        packageCode: ''
      },
      projectSearchLoading: false, // 搜索未选项目loading
      unSelectProjectList: [], // 未选项目列表
      curDeptId: 'all', // 未选项目--当前选中科室（默认全部）
      moreProjectFlag: true, // 判断当前套餐页是否为最后一页
      totalItemNum: 0, // 未选项目--项目组合总数
      comboPageIndex: 1, // 未选项目当前页
      comboPageSize: 40, // 未选项目每页数据条数
      projectTimer: null,
      packageTimer: null,
      selectedProjectList: [], // 未选项目-- 选中的项目组合
      isLoading: false, // 已选项目-- 表格loading
      tableData: [], // 已选择的项目组合列表
      amountData: [], // 各项金额合计数据
      captureModalVisible: false, // 拍照弹窗
      hackReset: false, // 用于判断是否重置拍照组件
      readCardLoading: false, // 扫描证件loading
      curSelectedComboId: '', // 当前点选的项目组合id
      curSelectedPackageId: '', // 当前点选的套餐id
      historyModalVisible: false, // 历史预约弹窗开关
      profileModalVisible: false, // 档案信息弹出开关
      curSelectedBookingId: '', // 当前选中的历史预约单id
      registerLoading: false,  // 体检登记按钮loading
      printParams: {}, // 打印参数
      importFlag: false // 是否从历史预约导入信息

    }
  },
  computed: {
    deptList: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    categoryList: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
    },
    priorityList: {
      get: function () {
        return this.$store.getters.getPriorityDict
      },
      set: function () { }
    },
    chargeTypeList: {
      get: function () {
        return this.$store.getters.getChargeTypeDict
      },
      set: function () { }
    },
    sourceList: {
      get: function () {
        return this.$store.getters.getPersonSourceDict
      },
      set: function () { }
    }
  },
  mounted () {
    // 自定义配置项
    let setting = getAutoClearStorage()
    let printConfig = getPrinterConfigFromLocalstorage()
    this.isAutoClear = setting.hasOwnProperty('isPersonalRegister') ? setting.isPersonalRegister : true
    if (printConfig.hasOwnProperty('labelNum')) {
      this.formData.labelNum = printConfig.labelNum.toString()
    } else {
      this.formData.labelNum = '1'
    }

    // 获取体检优先级
    this.$store.dispatch('getPriorityDict')
    // 获取体检类型
    this.$store.dispatch('getCategoryDict')
    // 获取费别
    this.$store.dispatch('getChargeTypeDict').then(() => {
      this.setChargTypeDefault()
    })
    // 获取人员来源
    this.$store.dispatch('getPersonSourceDict')
    // 获取科室
    this.$store.dispatch('getRoomDict')

    this.getPackagesList()
    this.getProjectList()

  },
  methods: {
    //  设置费别，默认自费
    setChargTypeDefault () {
      let arr = this.$store.getters.getChargeTypeDict
      console.log(arr)
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].cdName === '自费') {
          this.formData.boChargeTypeId = arr[i].cdId
          break
        }
      }
    },

    // 更改体检优先级
    changePriority (e) {
      // console.log(e)
      if (e != undefined) {
        this.formData.boPriority = e.label
      }
    },

    // 更改体检类型
    changeCategory (e) {
      console.log(this.formData)
      if (e) {
        this.formData.boCategory = e.label
        this.formData.boCategoryId = e.value
      }
    },

    // 更改费别
    changeChargeType (e) {
      if (e != undefined) {
        // console.log(e)
        this.formData.boChargeType = e.label
      }
    },

    // 更改出生日期，计算年龄
    birthChange (e) {
      if (!e) return
      let birthday = e.split('-')
      // 获取当前年月日并计算年龄
      let myDate = new Date()
      let monthNow = myDate.getMonth() + 1
      let dayNow = myDate.getDate()
      let age = myDate.getFullYear() - birthday[0]
      if (monthNow < birthday[1] || (monthNow == birthday[1] && dayNow < birthday[2])) {
        age--
      }
      this.$set(this.formData, 'boAge', age)
    },

    // 更改人员来源
    changeSource (e) {
      if (e != undefined) {
        // console.log(e)
        this.formData.boSource = e.label
      }
    },

    // 更改个人或单位
    personOrUnitChange () {
      this.curSelectPackage = {
        packageId: '',
        packageName: '',
        packageCode: ''
      }
      this.tableData = []
      this.amountData = []
      this.importFlag = false
      this.curSelectedPackageId = ''
      this.curSelectedComboId = ''
      this.curSelectedBookingId = ''
      this.selectedProjectList = []
      if (this.formData.boIsUnit == '0') {
        this.clearUnit()
      }
      this.isUnit(this.formData.boIsUnit)
    },

    // 搜索单位
    getUnits (query = '') {
      this.unitSearchLoading = true
      this.unitTimer && clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: query
        }
        listByName(params).then(({ data }) => {
          if (data.code === 0) {
            this.unitsList = data.data
          } else {
            this.$Message.error(result.message)
          }
          this.unitSearchLoading = false
        }).catch(err => {
          console.log(err)
          this.unitSearchLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }, 300)
    },

    //  选中单位后
    changeUnit (e) {
      if (e == undefined) return
      this.formData.boUnitName = e.label
      this.formData.boUnitId = e.value

      //  根据选中单位，带出相关单位信息
      let arr = this.unitsList.filter((item, index) => {
        return item.boUnitId == e.value
      })
      if (this.formData.boIsUnit == 0) {
        this.formData.boIsUnit = '1'
      }
      // this.formData.boChargeTypeId = arr[0].boChargeTypeId // 费别
      // this.formData.boPriorityId = arr[0].boPriorityId //  体检优先级
      // this.formData.boSourceId = arr[0].boSourceId //  人员来源
      // this.formData.boCategoryId = arr[0].boCategoryId // 体检类型
      this.formData = Object.assign(this.formData, arr[0])
      delete this.formData.boUnitVisitSn
      delete this.formData.boUnitCode
      delete this.formData.boUnitName
      this.getGroups()
    },

    // 查询体检分组
    getGroups () {
      const { boUnitId, boSex, boMaritalStatus } = this.formData
      const params = { boUnitId, boSex, boMaritalStatus }

      listAllByUnitId(params).then(res => {
        // console.log(res);
        let result = res.data
        if (result.code === 0) {
          this.groupsList = result.data
        } else {
          this.$Message.error(result.Message)
        }
      })
    },

    //  清空单位后
    clearUnit () {
      this.formData.boChargeTypeId = ''
      this.formData.boPriorityId = ''
      this.formData.boSourceId = ''
      this.formData.boCategoryId = ''
      this.formData.boSubDepartmentName = ''
      this.formData.boSubDepartmentId = ''
      this.formData.boDepartmentId = ''
      this.formData.boDepartment = ''
      this.formData.boGroupId = ''
      this.formData.boUnitId = ''
      this.formData.boUnitName = ''
      this.unitsList = []
      this.groupsList = []
      this.unitDeptList = []
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
        this.formData.boSubDepartmentName = selectedData[1].deptName
        this.formData.boSubDepartmentId = selectedData[1].deptId
        this.formData.boDepartmentId = selectedData[1].parentId
        this.formData.boDepartment = selectedData[1].parentName
        // console.log(this.formData)
      } else if (selectedData.length == 1) {
        // 只选择了父级
        this.formData.boSubDepartmentName = ''
        this.formData.boSubDepartmentId = ''
        this.formData.boDepartmentId = selectedData[0].deptId
        this.formData.boDepartment = selectedData[0].name
      } else {
        // 什么都没有选
        this.formData.boSubDepartmentName = ''
        this.formData.boSubDepartmentId = ''
        this.formData.boDepartmentId = ''
        this.formData.boDepartment = ''

      }
    },

    // 更改体检分组
    unitGroupChange (obj) {
      if (!obj) return
      this.formData.boGroupId = obj.value
      this.curSelectPackage = {
        packageId: '',
        packageName: '',
        packageCode: ''
      }
      this.curSelectedPackageId = ''
      this.curSelectedComboId = ''
      this.curSelectedBookingId = ''
      this.getSelectedComboItem()
    },

    // 打印价格明细
    printInvoice () {
      if (this.tableData.length == 0) {
        this.$Message.warning('未选择套餐项目，不可打印价格明细')
        return
      }
      if (!printNotice()) return false

      let arr = []
      this.tableData.forEach(item => {
        let { paIsAdditional, paDeptName, paComboName, paTestTubeId } = item
        let obj = { paIsAdditional, paDeptName, paComboName, paTestTubeId }
        obj.paPrice = item.paRealAmount
        obj.paIsOwnExcepense = item.paIsOwnExpense
        if (item.paComboTypeName == '自选') {
          obj.paIsAddItem = 2
        } else if (item.paComboTypeName == '套餐' || item.paPackageId) {
          obj.paIsAddItem = 0
        } else {
          obj.paIsAddItem = 1
        }
        arr.push(obj)
      })

      printDetail(arr).then(({ data }) => {
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
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },

    // 输入框回车时，根据身份证号，获取档案信息；无档案，则计算年龄及出生日期
    getAgeAndBirthday () {
      if (!this.formData.boIdNo) return

      const params = {
        boIdNo: this.formData.boIdNo.trim()
      }
      const pagination = { page: 1, size: 10 }

      profileList(params, pagination).then(({ data }) => {
        if (data.code === 0) {
          let result = data.data.records
          if (result.length > 0) {
            let _pic = this.formData.boPic || ''
            this.formData = Object.assign(this.formData, result[0])
            if (this.formData.boPic) {
              this.formData.boPic = this.$url + this.formData.boPic + '?time=' + new Date().getTime()
            } else {
              this.formData.boPic = _pic
            }
            // 设置体检次数
            this.formData.boVisitSn = (this.formData.boRegisterSn ? this.formData.boRegisterSn + 1 : 1)
            this.formData.boIsUnit = (this.formData.boIsUnit === null ? '0' : this.formData.boIsUnit)
            this.importFlag = true
            // 无费别类型时默认自费
            if (!this.formData.boChargeTypeId) {
              let _chargeArr = this.$store.getters.getChargeTypeDict
              let _selfArr = _chargeArr.filter(ele => {
                return ele.cdName === '自费'
              })
              this.formData.boChargeTypeId = _selfArr[0].cdId
            }
          } else {
            let _pic = this.formData.boPic
            let _idNo = this.formData.boIdNo.trim()
            let _name = this.formData.boName || ''
            let _address = this.formData.boAddress || ''
            this.resetHandle()
            this.formData.boPic = _pic
            this.formData.boIdNo = _idNo
            this.formData.boName = _name
            this.formData.boAddress = _address
            // 设置体检次数
            this.formData.boVisitSn = (this.formData.boRegisterSn ? this.formData.boRegisterSn + 1 : 1)
            const idNo = getBirthAndAge(_idNo)
            if (idNo.message) {
              this.$Message.error(idNo.message)
            } else {
              this.formData.boBirthday = idNo.birthday
              this.formData.boAge = idNo.age
              this.formData.boSex = idNo.sex
            }
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },

    // 输入框失焦时,根据身份证号，计算年龄和出生日期
    AgeAndBirthday () {
      if (this.formData.boIdNo &&
        this.formData.boCertificatesType == 1) {
        let no = this.formData.boIdNo.trim()
        let idNo = getBirthAndAge(no)
        if (idNo.message) {
          this.$Message.error(idNo.message)
          this.$set(this.formData, 'boBirthday', '')
          this.$set(this.formData, 'boAge', '')
          this.$set(this.formData, 'boSex', '')
        } else {
          this.$set(this.formData, 'boBirthday', idNo.birthday)
          this.$set(this.formData, 'boAge', idNo.age)
          this.$set(this.formData, 'boSex', idNo.sex)
        }
      }
    },

    // 保存护士端登记信息
    handleSubmit () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          if (!this.tableData.length) {
            this.$Message.info('保存失败，您还未选择待检套餐或项目')
            return false
          }
          let printConfig = getPrinterConfigFromLocalstorage()
          if (JSON.stringify(printConfig) === '{}') {
            this.$Message.info('请在右上角配置打印机')
            return false
          }
          // 如果上次总检了就是9，未总检就是0，是0的时候弹出
          if (this.formData.visitStatus == 0 && this.formData.boRegisterSn != 0) {
            this.$Modal.confirm({
              // title: '此人上次未做总检',
              content: '<p>上次体检未完成，是否再次登记？</p>',
              onOk: () => {
                this.saveAction()
              },
              onCancel: () => {

              }
            })
          } else {
            this.saveAction()
          }
        }
      })
    },
    saveAction () {
      if (this.registerLoading) return
      let params = {}
      params.masterIndex = Object.assign({}, this.formData)
      if (/\.(jpeg|png|jpg)/i.test(params.masterIndex.boPic)) {
        params.masterIndex.boPic = params.masterIndex.boPic.split('?')[0]
      }
      params.comboList = this.tableData
      params.selGroup = this.formData.selGroup
      params.masterIndex.boBirthday = this.formData.boBirthday != '' ? moment(this.formData.boBirthday).format('YYYY-MM-DD') : ''
      if (this.curSelectPackage.packageId) {
        params.masterIndex.boPackageId = this.curSelectPackage.packageId
        params.masterIndex.boPackageName = this.curSelectPackage.packageName
      } else {
        params.masterIndex.boPackageId = ''
        params.masterIndex.boPackageName = ''
      }
      delete params.masterIndex.selGroup
      delete params.masterIndex.labelNum

      this.registerLoading = true
      saveRegister(params).then(async ({ data }) => {
        this.registerLoading = false
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

          if (this.formData.selGroup.indexOf('printSampleCode') > -1 && data.data.sampleList) {
            const sampleRes = await printBarcode({
              boIds: data.data.sampleList,
              labelNum: this.formData.labelNum,
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

          if (this.formData.selGroup.indexOf('printGuide') > -1 && data.data.guideMap) {
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
            let j = this.formData.selGroup.filter((val) => {
              return val != 'printSampleCode'
            })
            console.log(j)
            this.printParams.selGroup = j
          } else {
            this.printParams.selGroup = this.formData.selGroup
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

          if (this.isAutoClear) {
            this.resetHandle()
          } else {
            this.clearComboItem()
          }
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.registerLoading = false
        this.$Message.error(err.message)
      })
    },

    // 检查当前页面打印权限
    checkPrintAuthority () {
      // console.log(this.$router.currentRoute.meta.authority)
      return this.$router.currentRoute.meta.authority.some(item => {
        return item == 'print'
      })
    },

    // 查询历史预约
    historySearch () {
      this.historyModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, this.formData)
      this.$nextTick(() => {
        this.$refs.historyWrapper.getItemList(params)
      })
    },

    // 去除姓名字段空格
    filterSpace () {
      this.formData.boName = this.formData.boName.replace(/\s+/g, "")
    },

    // 按姓名查询档案信息
    profileSearch () {
      // 删除所有空格
      this.formData.boName = this.formData.boName.replace(/\s+/g, "")
      if (this.formData.boName.trim() === '') return
      this.profileModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, this.formData)
      this.$nextTick(() => {
        this.$refs.profileWrapper.getItemList(params)
      })
    },

    // 获取历史预约查询到的信息
    getBookingInfo (msg) {

      this.formData = Object.assign(this.formData, msg)
      if (this.formData.boIsUnit === '0') {
        this.formData.boUnitId = ''
      }
      if (this.formData.boPic) {
        this.formData.boPic = this.$url + this.formData.boPic + '?time=' + new Date().getTime()
      }
      // 设置体检次数
      this.formData.boVisitSn = (this.formData.boRegisterSn ? this.formData.boRegisterSn + 1 : 1)
      this.formData.boIsUnit = (this.formData.boIsUnit === null ? '0' : this.formData.boIsUnit)
      this.importFlag = true
      // 无费别类型时默认自费
      if (!this.formData.boChargeTypeId) {
        let _chargeArr = this.$store.getters.getChargeTypeDict
        let _selfArr = _chargeArr.filter(ele => {
          return ele.cdName === '自费'
        })
        this.formData.boChargeTypeId = _selfArr[0].cdId
      }
      if (this.formData.boBookingId) {
        this.curSelectedBookingId = this.formData.boBookingId
        this.curSelectedComboId = ''
        this.curSelectedPackageId = this.formData.boPackageId
        this.curSelectPackage.packageId = this.formData.boPackageId
        this.curSelectPackage.packageName = this.formData.boPackageName
        this.getSelectedComboItem()
      }
    },

    // 获取弹窗查询到的档案信息
    getProfileInfo (msg) {
      if (this.formData.boIsUnit != msg.boIsUnit) {
        this.personOrUnitChange()
      }
      this.formData = Object.assign(this.formData, msg)
      if (this.formData.boIsUnit === '0') {
        this.formData.boUnitId = ''
      }
      if (this.formData.boPic) {
        this.formData.boPic = this.$url + this.formData.boPic + '?time=' + new Date().getTime()
      }
      // 设置体检次数
      this.formData.boVisitSn = (this.formData.boRegisterSn ? this.formData.boRegisterSn + 1 : 1)
      this.formData.boIsUnit = (this.formData.boIsUnit === null ? '0' : this.formData.boIsUnit)
      this.importFlag = true
      // 无费别类型时默认自费
      if (!this.formData.boChargeTypeId) {
        let _chargeArr = this.$store.getters.getChargeTypeDict
        let _selfArr = _chargeArr.filter(ele => {
          return ele.cdName === '自费'
        })
        this.formData.boChargeTypeId = _selfArr[0].cdId
      }
    },
    // 读取身份证
    readIdCard () {
      let url = `http://127.0.0.1:8989/api/ReadMsg`
      this.readCardLoading = true
      jsonp(url, { timeout: 3000 }, (_err, data) => {
        this.readCardLoading = false
        if (data != undefined && data != null) {
          if (data.retcode == '0x90 0x1') {
            this.formData.boCertificatesType = '1'
            this.formData.boIdNo = data.cardno
            this.formData.boPic = `data:image/jpg;base64,${data.photobase64}`
            this.formData.boName = data.name
            this.formData.boAddress = data.address
            this.getAgeAndBirthday()
          } else if (data.retcode == '0x41') {
            this.$Message.error('身份证读取失败，请稍后尝试')
          } else if (data.retcode == '0x1') {
            this.$Message.error('读卡器服务' + data.retmsg)
          }
        } else {
          this.$Modal.info({
            title: '和湛科技体检系统',
            content: `检测到该电脑未安装身份证读卡器驱动，请联系管理员安装相关驱动。<a href="./plugins/readIdCard3.0.9-2.zip" target="_blank" download="readIdCard3.0.9-2.zip">点击此处下载身份证读卡器驱动</a>`
          })
        }
      })
    },

    // 通过分组id,是否单位，单位id，套餐id搜索用户已选组合项
    getSelectedComboItem () {
      const { boGroupId, boIsUnit, boUnitId } = this.formData
      let params = { boGroupId, boIsUnit, boUnitId }
      params.paComboId = this.curSelectedComboId
      params.paPackageId = this.curSelectedPackageId
      params.boBookingId = this.curSelectedBookingId

      selectComboInfo(params).then(({ data }) => {
        if (data.code == 0) {
          // 点选套餐时，情况所选项目组合，获取套餐相应项目组合
          if (this.curSelectedPackageId) {
            this.tableData = data.data
            // 项目组合对应内容打勾
            let curArr = this.tableData.map(item => {
              return item.paComboId
            })
            this.selectedProjectList = curArr

            // 处理金额统计
            this.dealPrice()
          }
          // 点选组合时
          if (this.curSelectedComboId) {
            const _btn = this.tableData.some(item => (item.paComboTypeName === '套餐' || item.paPackageId))
            let result = data.data
            if (_btn) {
              result[0].paComboTypeName = '加做'
              result[0].paIsAdditional = '1'
            }
            this.tableData.unshift(...result)
            // 项目组合对应内容打勾
            let curArr = this.tableData.map(item => {
              return item.paComboId
            })
            this.selectedProjectList = curArr

            // 处理金额统计
            this.dealPrice()
          }
          // 选择单位分组时
          if (boGroupId && !this.curSelectedComboId) {
            this.tableData = data.data
            // 项目组合对应内容打勾
            let curArr = this.tableData.map(item => {
              return item.paComboId
            })
            this.selectedProjectList = curArr

            // 分组指定套餐打勾
            let _arr = this.tableData.filter(item => {
              return item.paPackageId
            })
            if (_arr.length > 0) {
              this.curSelectPackage.packageId = _arr[0].paPackageId
              this.curSelectPackage.packageName = _arr[0].paPackageName
            }

            // 处理金额统计
            this.dealPrice()
          }

          // 单位团检时，不给删除套餐项目
          this.isUnit(boIsUnit)

        } else {
          this.tableData = []
          this.selectedProjectList = []
          this.amountData = []
          this.isUnit(0)
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error(err.message)
      })
    },

    // 单位团检时，不给删除未选项目判断
    isUnit (btn) {
      if (btn == '1') {
        // 单位团检时，不给取消套餐对应组合项
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].paComboTypeName == '套餐' || this.tableData[i].paPackageId) {
            for (let j = 0; j < this.unSelectProjectList.length; j++) {
              if (this.unSelectProjectList[j].id == this.tableData[i].paComboId) {
                console.log(this.unSelectProjectList[j])
                this.unSelectProjectList[j].disabled = true
                break
              }
            }
          }
        }

        // 单位团检时，禁止更改套餐
        this.unSelectPackageList.forEach(ele => {
          ele.disabled = true
        })
      } else {
        this.unSelectProjectList.forEach(ele => {
          ele.disabled = false
        })
        this.unSelectPackageList.forEach(ele => {
          ele.disabled = false
        })
      }
    },

    // 滚轮到未选套餐底部刷新
    updateSearchPackageList () {
      return new Promise(resolve => {
        setTimeout(() => {
          this.packagePageIndex++
          this.getPackagesList()
          resolve()
        }, 300)
      })
    },

    // 分页获取所有 未选套餐列表
    getPackagesList (query = '') {
      if (!this.morePackageFlag) return false
      if (this.packageSearchLoading) return false
      this.packageSearchLoading = true
      let pagination = {
        page: this.packagePageIndex,
        size: this.packagePageSize
      }
      let params = {
        paPackageName: query,
        paSex: this.formData.boSex
      }
      getBookingPackage(pagination, params).then(({ data }) => {
        this.packageSearchLoading = false
        if (data.code == 0) {
          this.unSelectPackageList.push(...data.data.records)
          this.isUnit(this.formData.boIsUnit)
          // 判断当前页数和总页数是否相等，如果相同就不需要再请求了
          data.data.current !== data.data.pages ? this.morePackageFlag = true : this.morePackageFlag = false
        } else {
          this.$Message.error(data.message)
        }

      }).catch(err => {
        console.log(err)
        this.packageSearchLoading = false
        this.$Message.error(err.message)
      })
    },

    // 搜索未选套餐
    searchPackage (query) {
      this.packageTimer && clearTimeout(this.packageTimer)
      this.packageTimer = setTimeout(() => {
        if (!this.packageSearchLoading) {
          this.morePackageFlag = true
          this.packagePageIndex = 1
          this.unSelectPackageList = []
          this.getPackagesList(query)
        }
      }, 300)
    },

    // 清空未选套餐
    clearPackage () {
      if (!this.packageSearchLoading) {
        this.morePackageFlag = true
        this.packagePageIndex = 1
        this.unSelectPackageList = []
        this.getPackagesList()
      }
    },

    // 修改所选套餐
    changePackage (packageId) {
      if (!packageId) return false
      this.$refs.projectInputDrop.filterText = ''
      let _arr = this.unSelectPackageList.filter(ele => {
        return ele.id === packageId
      })

      this.$set(this.curSelectPackage, 'packageId', _arr[0].id)
      this.$set(this.curSelectPackage, 'packageName', _arr[0].name)
      this.$set(this.curSelectPackage, 'packageCode', _arr[0].code)
      this.curSelectedComboId = ''
      this.curSelectedPackageId = this.curSelectPackage.packageId || ''
      this.curSelectedBookingId = ''
      this.getSelectedComboItem()
    },

    // 更改科室时，查询数据 按科室分类筛选,按项目分类筛选
    deptChange () {
      // 清空状态
      this.$refs.projectInputDrop.filterText = ''
      this.moreProjectFlag = true
      this.unSelectProjectList = []
      this.comboPageIndex = 1
      this.getProjectList()
    },

    // 获取未选项目列表
    getProjectList (query = '') {
      if (!this.moreProjectFlag) return
      if (this.projectSearchLoading) return
      this.projectSearchLoading = true
      let pagination = {
        page: this.comboPageIndex,
        size: this.comboPageSize
      }
      let params = {
        keyword: query,
        paDeptId: this.curDeptId == 'all' ? '' : this.curDeptId,
        paFlag: '1', // 区分单项和组合 1为组合，2为单项
        paSex: this.formData.boSex
      }
      getItemByPage(pagination, params).then(({ data }) => {
        if (data.code == 0) {
          data.data.current !== data.data.pages ? this.moreProjectFlag = true : this.moreProjectFlag = false

          this.unSelectProjectList.push(...data.data.records)
          this.totalItemNum = data.data.total

          this.isUnit(this.formData.boIsUnit)
        } else {
          this.$Message.error(data.message)
        }
        this.projectSearchLoading = false
      }).catch(err => {
        this.projectSearchLoading = false
        this.$Message.error(err.message)
      })
    },

    //  搜索项目组合
    searchProject (query) {
      console.log(query)
      if (query !== undefined || query !== '' || query !== null) {
        //  节流，因输入值改变而频繁发请求，延迟执行请求
        this.projectTimer && clearTimeout(this.projectTimer)
        this.projectTimer = setTimeout(() => {
          if (!this.projectSearchLoading) {
            this.moreProjectFlag = true
            this.comboPageIndex = 1
            this.curDeptId = 'all'
            this.unSelectProjectList = []
            this.getProjectList(query)
            // if (+this.formData.boIsUnit) {
            //   this.grayOff(this.pickProjectsTableData)
            // }
          }
        }, 300)
      }
    },

    // 滚轮到未选项目底部刷新
    updateProjectList () {
      return new Promise(resolve => {
        setTimeout(() => {
          this.comboPageIndex++
          this.getProjectList()
          resolve()
        }, 300)
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

    // 导出拍照图片 base64
    importPic (base64Url) {
      // console.log(base64Url);
      this.formData.boPic = base64Url
    },

    // 双击删除行组合数据
    cancelRowHandle (row) {
      let _obj = row.row
      // 单位团检套餐项目不给删除
      if (this.formData.boIsUnit == '1' && (_obj.paComboTypeName == '套餐' || _obj.paPackageId)) {
        return false
      }
      // 删除已选项目指定项
      let _arr = this.tableData.filter(item => {
        return _obj.paComboId !== item.paComboId
      })
      // 去除未选项目勾选项
      this.selectedProjectList.splice(this.selectedProjectList.findIndex(item => item === _obj.paComboId), 1)
      // 取消项目为套餐项时，变更所有项目为自选项
      if (_obj.paComboTypeName == '套餐' || _obj.paPackageId) {
        _arr.forEach((item) => {
          item.paComboTypeName = '自选'
          item.paIsAdditional = '0'
          item.paPackageId = ''
          item.paPackageName = ''
        })
        this.curSelectPackage = {
          packageId: '',
          packageName: '',
          packageCode: ''
        }
      }
      this.tableData = _arr

      // 处理金额统计
      this.dealPrice()
    },

    // 修改选择的项目组合
    changeProject (arr) {
      if (arr.length < this.tableData.length) {
        // 取消勾选
        let _arr = this.tableData.filter(item => {
          return arr.some(ele => ele === item.paComboId)
        })
        // 取消项目为套餐项时，变更所有项目为自选项
        let _cancelArr = this.tableData.filter(item => {
          return !arr.some(ele => ele === item.paComboId)
        })
        if (_cancelArr.length > 0 && (_cancelArr[0].paComboTypeName == '套餐' || _cancelArr[0].paPackageId)) {
          _arr.forEach((item) => {
            item.paComboTypeName = '自选'
            item.paIsAdditional = '0'
            item.paPackageId = ''
            item.paPackageName = ''
          })
          this.curSelectPackage = {
            packageId: '',
            packageName: '',
            packageCode: ''
          }
        }
        this.tableData = _arr

        // 处理金额统计
        this.dealPrice()
      } else {
        // 勾选项目组合
        let _arr = arr.filter(item => {
          return !this.tableData.some(ele => ele.paComboId === item)
        })
        this.curSelectedComboId = _arr[0] || ''
        this.curSelectedPackageId = ''
        this.curSelectedBookingId = ''
        this.getSelectedComboItem()
      }
    },

    // 通过搜索框enter选择项目组合
    selectProjectByEnter (comboId) {
      // 组合存在时不添加
      let btn = !this.tableData.some(ele => ele.paComboId === comboId)
      if (btn) {
        this.curSelectedComboId = comboId
      } else {
        this.curSelectedComboId = ''
      }
      this.curSelectedPackageId = ''
      this.curSelectedBookingId = ''
      this.getSelectedComboItem()
    },

    // 重置项目组合
    clearProject () {
      if (!this.projectSearchLoading) {
        this.comboPageIndex = 1
        this.curDeptId = 'all'
        this.unSelectProjectList = []
        this.getProjectList()
      }
    },

    // 是否开启保存信息后，自动清空功能
    changeAutoClear (status) {
      setAutoClearStorage({ isPersonalRegister: status })
    },

    // 项目组合金额汇总统计
    dealPrice () {
      let { addItemAmount, totalAmount, paidAmount, unPaidAmount } = new Proxy({}, { get () { return 0 } })
      this.tableData.forEach((ele) => {
        totalAmount = this.accAdd(ele.paRealAmount, totalAmount)
        if (ele.paIsAdditional == '1') {
          addItemAmount = this.accAdd(ele.paRealAmount, addItemAmount)
        }
        if (ele.paPayStatus == '0') {
          paidAmount = this.accAdd(ele.paRealAmount, paidAmount)
        } else {
          unPaidAmount = this.accAdd(ele.paRealAmount, unPaidAmount)
        }
      })
      let _arr = []
      _arr.push({ addItemAmount, totalAmount, paidAmount, unPaidAmount })
      this.amountData = _arr
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
      return Math.round(num1 * m + num2 * m) / m;
    },

    // 高亮表格中的加项颜色
    addItemColor ({ row, column }) {
      if (row.paComboTypeName == '加做' || row.paIsAdditional == '1') {
        return 'table-add-item-row'
      } else {
        return 'table-row'
      }
    },

    // 修改表格中检验科项目颜色
    checkExamColor ({ row, column }) {
      if (column.property === 'paDeptName' || column.property === 'paComboName' || column.property === 'paRealAmount') {
        if (row.paComboCategory == '3') {
          return 'table-cell-color-red'
        }
      }
    },

    // 清空已选项目
    clearComboItem () {
      this.curSelectPackage = {
        packageId: '',
        packageName: '',
        packageCode: ''
      }
      this.curSelectedComboId = ''
      this.curSelectedPackageId = ''
      this.curSelectedBookingId = ''
      this.selectedProjectList = []
      this.tableData = []
      this.amountData = []
    },

    // 重置页面缓存
    resetHandle () {
      this.formData = {
        boIsUnit: '0',
        selGroup: ['printGuide', 'printSampleCode'], // 默认打印指引单、条码
        boCertificatesType: '1'
      }
      this.isUnit(this.formData.boIsUnit)
      let printConfig = getPrinterConfigFromLocalstorage()
      if (printConfig.hasOwnProperty('labelNum')) {
        this.formData.labelNum = printConfig.labelNum.toString()
      } else {
        this.formData.labelNum = '1'
      }
      this.curSelectPackage = {
        packageId: '',
        packageName: '',
        packageCode: ''
      }
      this.importFlag = false
      this.curSelectedComboId = ''
      this.curSelectedPackageId = ''
      this.curSelectedBookingId = ''
      this.selectedProjectList = []
      this.tableData = []
      this.amountData = []
    }

  },
}
</script>
<style lang="less">
.new-person-register-wrapper {
  width: 100%;
  min-width: 1400px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  .basic-info {
    width: 100%;
    height: auto;
    display: flex;
    .avatar-wrapper {
      width: 92px;
      flex-shrink: 0;
      height: auto;
      margin-right: 10px;
      .pic {
        width: 92px;
        height: 116px;
        overflow: hidden;
        border-radius: 8px;
        img {
          width: 100%;
          height: auto;
        }
      }
      .pic-handle {
        margin-top: 10px;
        text-align: center;
      }
    }
    .sub-wrapper {
      flex-shrink: 0;
    }
    .patient-cont-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      .pic-wrapper {
        width: 92px;
        flex-shrink: 0;
        height: 116px;
        overflow: hidden;
        border-radius: 8px;
        margin-right: 10px;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
    .handle-wrapper {
      width: 300px;
      flex-shrink: 0;
      padding: 0 10px;
      border-left: 1px solid #e6e6e6;
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
  .select-groups {
    font-size: 14px;
    .flex-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      .label {
        flex-shrink: 0;
        width: 80px;
      }
    }
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
  .unpick-projects-item {
    font-size: 14px;
    color: #252525;
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
  .unselect-package-item {
    width: 96%;
    min-width: 200px;
  }
  .unselect-package {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-item {
      line-height: 2;
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
  .selected-package {
    display: flex;
    padding: 10px 0;
    font-size: 14px;
    align-items: center;
    .label {
      color: #252525;
    }
    .content {
      color: #2d8cf0;
      font-weight: bold;
      font-size: 16px;
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
  .groupStar .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
  .vxe-table .vxe-body--column.table-cell-color-red {
    color: #e51c23;
  }
  .vxe-table .vxe-body--row.table-add-item-row {
    background-color: #fff9c4;
    color: #333;
    opacity: 0.8;
  }
  // 选择框禁止色改为白底 - 特殊需求
  .ivu-select-disabled .ivu-select-selection,
  .ivu-input {
    background-color: #fff;
  }
  .ivu-form-item {
    margin-bottom: 0 !important;
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
}
</style>
