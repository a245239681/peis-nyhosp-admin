<template>
  <div>
    <div class="page-header-wrapper">
      <div class="photo">
        <img v-if="form.boPic"
             :src="form.boPic"
             alt="患者头像">
        <img v-else
             src="@/assets/images/userPhoto.png"
             alt="患者头像">
      </div>
      <Form class="form-wrapper"
            :model="form"
            label-position="right"
            :label-width="40">

        <div class="info">
          <div class="flex-wrapper">
            <FormItem label="姓名"
                      prop="boName"
                      style="width:25%;"
                      class="vip-parent">
              <Input v-model="form.boName"
                     disabled
                     size="small" />
              <div class="vip-icon"
                   v-if="form.boPriority != undefined && form.boPriority !== null && form.boPriority != '普通'"><img src="@/assets/images/vip_icon.png"
                     alt="VIP"></div>
            </FormItem>
            <FormItem label="性别"
                      style="width:12%;"
                      :label-width="50"
                      prop="boSex">
              <Input v-model="form.boSex"
                     disabled
                     size="small" />
            </FormItem>
            <FormItem label="年龄"
                      :label-width="50"
                      style="width:12%;"
                      prop="boAge">
              <Input v-model="form.boAge"
                     disabled
                     size="small" />
            </FormItem>
            <FormItem label="婚姻状态"
                      style="width:13.5%;"
                      :label-width="80"
                      prop="boMaritalStatus">
              <Input v-model="form.boMaritalStatus"
                     disabled
                     size="small" />
            </FormItem>
            <FormItem label="体检次数"
                      style="width:12.5%;"
                      :label-width="80"
                      prop="boVisitSn">
              <Input v-model="form.boVisitSn"
                     disabled
                     size="small" />
            </FormItem>
            <FormItem label="体检类型"
                      style="width:24%;"
                      :label-width="80"
                      prop="boCategory">
              <Input v-model="form.boCategory"
                     disabled
                     size="small" />
            </FormItem>
          </div>
          <div class="flex-wrapper">
            <div style="width:75%">
              <div class="flex-wrapper">
                <FormItem label="证件"
                          style="width:33.5%"
                          prop="boIdNo">
                  <Input v-model="form.boIdNo"
                         disabled
                         size="small" />
                </FormItem>
                <FormItem label="联系方式"
                          style="width:32%"
                          :label-width="80"
                          prop="boMobile">
                  <Input v-model="form.boMobile"
                         disabled
                         size="small" />
                </FormItem>
                <FormItem label="体检套餐"
                          style="width:34.5%"
                          :label-width="80"
                          prop="boPackage">
                  <Input v-model="form.boPackage"
                         disabled
                         size="small" />
                </FormItem>
              </div>
              <div class="flex-wrapper">
                <FormItem label="单位"
                          style="width:65.5%;"
                          :label-width="40"
                          prop="boUnitName">
                  <Input v-model="form.boUnitName"
                         disabled
                         size="small" />
                </FormItem>
                <FormItem label="体检分组"
                          style="width:34.5%"
                          :label-width="80"
                          prop="boGroupingName">
                  <Input v-model="form.boGroupingName"
                         disabled
                         size="small" />
                </FormItem>
              </div>
            </div>
            <div style="width:25%; padding: 0 10px;">
              <div class="scan-code-input-wrapper">
                <div class="title">扫码区域&nbsp;<span>请使用扫码枪扫描条码</span></div>
                <FormItem label="">
                  <Input v-model="registerCode"
                         clearable
                         ref="inputFocus"
                         @on-enter="getPatientByRegisterCode"
                         size="small" />
                </FormItem>
              </div>

            </div>
          </div>
        </div>
        <div class="btns">
          <!-- <Button style="visibility: hidden;">复诊</Button> -->
          <Button type="error"
                  style="margin-bottom: 8px;"
                  @click="handleReset()">清空</Button>
          <Form :model="clearForm"
                ref="clearForm"
                style="margin-bottom: 8px"
                :label-width="80"
                label-position="right">
            <FormItem label="自动清空">
              <i-switch v-model="clearForm.isExamTableAutoClear"
                        @on-change="clearSetting"
                        size="large">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>

          </Form>
          <Button type="primary"
                  style="margin-bottom: 5px;"
                  @click="save()"
                  :loading="saveLoading"
                  v-permission="['edit']">保存结果</Button>
        </div>
      </Form>
    </div>

    <div class="result-wrapper">
      <div class="aside">
        <div class="combo-title">组合项目</div>
        <ul class="combo-list"
            :style="'height:' + ((screenHeight - 430) <= 570 ? 570 : (screenHeight - 430)) + 'px;'">
          <li class="combo-item"
              v-if="comboListFilter.length == 0"
              style="justify-content: center;">暂无数据</li>
          <li class="combo-item"
              :class="showComboClass(item)"
              v-for="(item, index) in comboListFilter"
              @click="getComboItem(item)"
              :key="index">
            <div class="combo-name">
              <Icon v-show="item.isInspection == '1'"
                    type="md-checkmark-circle"
                    style="margin-right:5px;" />
              <Icon v-show="item.boIsCompleted == '2' && item.isInspection != '1'"
                    type="md-close-circle"
                    style="margin-right:5px;" />
              <Icon v-show="item.boIsCompleted == '4' && item.isInspection != '1'"
                    type="md-alert"
                    style="margin-right:5px;" />
              {{item.boComboName}}
            </div>
            <div class="combo-handle"
                 :class="{'is-refuse' : item.boIsCompleted == '2'}"
                 v-if="curcomboBoId == item.boId && item.boIsCompleted != '1' && item.isInspection != '1'">
              <Button type="error"
                      @click.stop="refuseExamHandle(item,item.boIsCompleted)"
                      :loading="refuseExamLoading"
                      size="small">{{item.boIsCompleted != '2'? '拒检' : '恢复'}}</Button>
            </div>
            <div class="combo-handle"
                 v-if="curcomboBoId == item.boId && item.isInspection == '1'">
              <Button type="error"
                      @click.stop="delExamHandle()"
                      :loading="delExamLoading"
                      size="small">删除结果</Button>
            </div>
          </li>
        </ul>
      </div>
      <div class="main">
        <Table :columns="tableCols"
               :data="tableData[curComboId]"
               :loading="tableLoading"
               highlight-row
               @on-current-change="curRowTable"
               @on-row-click="setCurInputFocus"
               :row-class-name="changeTableClass"
               :height="(screenHeight - 550) <= 375 ? 375 : (screenHeight - 550)"
               size="small">
          <template slot-scope="{ row, index }"
                    slot="paRecord">
            <div class="check-result-content">
              <Input type="text"
                     class="js-self-focus"
                     v-model="row.paRecord"
                     v-if="row.paRecordType == 1"
                     @on-change="bindResultInput(row, index)"
                     @on-blur="getExamResult(row,index)"
                     size="small" />
              <Input type="text"
                     class="js-self-focus"
                     v-model="row.paRecord"
                     v-else
                     @on-enter="getExamResult(row,index)"
                     @on-change="bindResultInput(row, index)"
                     @dblclick.native="showCheckList(row,index)"
                     size="small" />
              <Icon v-if="row.identification == 'h' || row.identification == 'ah' || row.identification == 'HH' || row.identification == 'H'"
                    style="color: red; font-size: 18px; font-weight:400;"
                    type="md-arrow-round-up" />
              <Icon v-if="row.identification == 'l' || row.identification == 'al' || row.identification == 'LL' || row.identification == 'L'"
                    style="color: #2d8cf0; font-size: 18px; font-weight:400;"
                    type="md-arrow-round-down" />
            </div>
            <!-- <div class="check-result-content"
                 v-if="row.paRecordType == 1">
              <Input type="text"
                     v-model="row.paRecord"
                     @on-change="bindResultInput(row, index)"
                     @on-blur="getExamResult(row,index)"
                     size="small" />
              <Icon v-if="row.identification == 'h' || row.identification == 'ah'"
                    style="color: red; font-size: 18px; font-weight:400;"
                    type="md-arrow-round-up" />
              <Icon v-if="row.identification == 'l' || row.identification == 'al'"
                    style="color: red; font-size: 18px; font-weight:400;"
                    type="md-arrow-round-down" />
            </div>
            <Poptip trigger="focus"
                    placement="bottom"
                    word-wrap
                    v-else
                    class="check-result-poptip"
                    :transfer="true"
                    content="content">
              <template slot="content">
                <div class="check-result-select-item">
                  <CellGroup>
                    <Cell @click.native="resultSelectHandle(row,result,index)"
                          :title="result.resultDescription"
                          v-for="(result, idx) in row.paResultList"
                          :key="idx"
                          :selected="result.resultDescription == row.paRecord" />
                  </CellGroup>
                </div>
              </template>
              <Input v-model="row.paRecord"
                     @on-change="bindResultInput(row, index)"
                     @on-enter="getExamResult(row,index)"
                     size="small"></Input>
              <Icon v-if="row.identification == 'h' || row.identification == 'ah'"
                    style="color: red; font-size: 18px; font-weight:400;"
                    type="md-arrow-round-up" />
              <Icon v-if="row.identification == 'l' || row.identification == 'al'"
                    style="color: red; font-size: 18px; font-weight:400;"
                    type="md-arrow-round-down" />
            </Poptip> -->
          </template>
          <template slot-scope="{ row, index }"
                    slot="paIsAbnormal">
            <Checkbox v-model="row.paIsAbnormal"
                      v-tabindex="-1"
                      @on-change="bindIsAbnormal(row, index)"></Checkbox>
          </template>
          <template slot-scope="{ row, index }"
                    slot="paContent">
            <Input type="text"
                   v-model="row.paResultDescription"
                   v-tabindex="-1"
                   @on-change="bindResultDescription(row, index)"
                   size="small" />
          </template>
          <template slot-scope="{ row, index }"
                    slot="refValue">
            <!-- <span>{{tableData[curComboId][index].paResultLower}} - {{tableData[curComboId][index].paResultUpper}}</span> -->
            <span>{{row.paReferenceRange}}</span>
          </template>
          <template slot-scope="{ row, index }"
                    slot="action">
            <Button size="small"
                    @click="getReport"
                    :loading="reportLoading"
                    type="default">查报告</Button>
            <Button size="small"
                    style="margin-left: 5px;"
                    @click="delReport"
                    type="error">删除</Button>
          </template>
        </Table>
        <div class="main-bottom">
          <div class="summary">
            <Tabs size="small"
                  name="summaryTab"
                  @on-click="curTabActive"
                  :animated="true">
              <TabPane label="分科小结"
                       name="branchTip"
                       tab="summaryTab">
                <Input v-model="branchExtraTip"
                       type="textarea"
                       :autosize="{minRows: 5,maxRows: 5}"
                       placeholder="请输入体检小结" />
              </TabPane>
              <TabPane label="分科建议"
                       name="branchAdvice"
                       tab="summaryTab">
                <Input v-model="allBranchAdvice"
                       type="textarea"
                       :autosize="{minRows: 5,maxRows: 5}"
                       placeholder="请输入分科建议" />
              </TabPane>
              <TabPane label="分科病史"
                       name="branchHistory"
                       tab="summaryTab">
                <Input v-model="branchHistory"
                       type="textarea"
                       :autosize="{minRows: 5,maxRows: 5}"
                       placeholder="请输入分科病史" />
              </TabPane>
              <TabPane label="疾病科普"
                       name="diseaseScience"
                       tab="summaryTab">
                <Input v-model="diseaseScience"
                       type="textarea"
                       :autosize="{minRows: 5,maxRows: 5}"
                       placeholder="请输入疾病科普" />
              </TabPane>
            </Tabs>
            <span class="summary-sel-btn">
              <Button type="primary"
                      size="small"
                      @click="popupShowHandle"
                      v-show="curTabIndex != 'summaryInput' && curTabIndex != 'diseaseScience'">选择</Button>
            </span>

          </div>
          <div class="diagList">
            <div class="diagList-title">
              <span>诊断列表</span>
              <!-- <Button type="primary" size="small" class="diagList-sel-btn">选择</Button> -->
              <!-- <div class="diagList-content">
                <Button size="small"
                        class="diagList-edit-btn">修改</Button>
                <Button type="error"
                        size="small"
                        class="diagList-del-btn">删除</Button>
              </div> -->
            </div>
            <Input v-model="diagnosisList"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   placeholder="请添加诊断列表" />
          </div>
        </div>
      </div>
    </div>
    <div class="record-dept">
      <!-- <div class="record-dept-title">录入科室：
        <Select v-model="dept"
                size="small"
                disabled
                style="width:160px">
          <Option v-for="item in roomList"
                  :value="item.poId"
                  :key="item.poId">{{ item.poDeptName }}</Option>
        </Select>
      </div> -->
      <div class="record-dept-waiting">
        <Button size="small"
                type="primary"
                @click="importExamData"
                :loading="importExamLoading">导入检验结果</Button>
      </div>
      <div class="doctor">
        <span class="pre-title">检验者</span>
        <Select v-model="doctorName"
                :label-in-value="true"
                filterable
                placement="top-end"
                transfer
                size="small">
          <Option v-for="(item, index) in examDoctorDict"
                  :value="item.doctorName"
                  @click.native="examDoctorChange(item)"
                  :key="index">{{ item.doctorName }}</Option>
        </Select>
      </div>
      <div class="doctor">
        <span class="pre-title">审核者</span>
        <Select v-model="lisDoctorName"
                :label-in-value="true"
                filterable
                placement="top-end"
                transfer
                size="small">
          <Option v-for="(item, index) in examDoctorDict"
                  :value="item.doctorName"
                  @click.native="lisDoctorChange(item)"
                  :key="index">{{ item.doctorName }}</Option>
        </Select>
      </div>
      <div class="operator">
        <span class="pre-title">操作员</span>
        <Input prefix="ios-contact"
               v-model="operator"
               disabled
               size="small" />
      </div>
      <div class="examDate">
        <span class="pre-title">体检日期</span>
        <DatePicker v-model="examDate"
                    :value="examDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    size="small"
                    placement="bottom-end"
                    placeholder="请选择日期"></DatePicker>
      </div>
    </div>
    <!-- 科室小结、科室建议、分科病史弹窗 -->
    <Modal v-model="popupBtn"
           v-dragForbid
           draggable
           scrollable
           width="800"
           title="示例">
      <demo-input @updateDemo="updateDemo"
                  ref="demoInput"></demo-input>
      <div slot="footer"></div>
    </Modal>
    <diseaseList :visible="diseaseListVisible"
                 @updateCheckResult="updateCheckResult"
                 :title="diseaseListTitle"
                 ref="diseaseListWrapper"
                 @close="diseaseListVisible = false"></diseaseList>
    <!-- 自动清空配置弹窗 -->
    <!-- <AutoClear :visible="clearModelBtn"
               @close="clearModelBtn = false">

    </AutoClear> -->
  </div>
</template>
<script>
import {  getCombo, getSingleItem, resultContrast, patientVisitPic, refuseExam, delExamResult,
  resultSave, BMICaculate, recordSummary, PatientMsgByRegisterCode, checkReport, deleteReport} from '@/api/record_result'
import { reportJY } from '@/api/manualImportInspectionReport.js'
import moment from 'moment'
import DemoInput from './demoInput.vue'
import diseaseList from '../components/diseaseList'
import {
  setAutoClearStorage,
  getAutoClearStorage,
  getLoginOrgLocalstorage
} from '@/libs/util'
const ORGINFO = getLoginOrgLocalstorage()

export default {
  components: {
    DemoInput,
    diseaseList
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {},
      clearForm: {},
      tableData: {},
      tableLoading: false,
      tableCols: [
        // {
        //   title: '项目代码',
        //   key: 'paItemCode',
        //   align: 'center',
        //   width: 100
        // },
        {
          title: '明细项目',
          key: 'paItemName',
          align: 'center',
          minWidth: 140
        },
        {
          title: '检查结果',
          slot: 'paRecord',
          align: 'center',
          minWidth: 120
        },
        {
          title: '单位',
          key: 'paUnit',
          align: 'center',
          minWidth: 60
        },
        {
          title: '是否阳性',
          slot: 'paIsAbnormal',
          width: 100,
          align: 'center'
        },
        {
          title: '诊断结果',
          slot: 'paContent',
          align: 'center',
          minWidth: 120
        },
        {
          title: '参考值',
          slot: 'refValue',
          align: 'center',
          minWidth: 120
        },
        // {
        //   title: '历年对比',
        //   slot: 'action',
        //   align: 'center',
        //   width: 100
        // }
      ],
      // 非标显示操作列
      tableCols2: [
        {
          title: '明细项目',
          key: 'paItemName',
          align: 'center',
          minWidth: 140
        },
        {
          title: '检查结果',
          slot: 'paRecord',
          align: 'center',
          minWidth: 140
        },
        {
          title: '单位',
          key: 'paUnit',
          align: 'center',
          minWidth: 80
        },
        {
          title: '是否阳性',
          slot: 'paIsAbnormal',
          width: 100,
          align: 'center'
        },
        {
          title: '诊断结果',
          slot: 'paContent',
          align: 'center',
          minWidth: 140
        },
        {
          title: '参考值',
          slot: 'refValue',
          align: 'center',
          minWidth: 120
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 180
        }
      ],
      diseaseListVisible: false, // 检验结果列表弹窗
      comboList: [], // 项目组合列表
      branchExtraTip: '未见异常', // 分科小结（选填）
      branchTipList: [], // 分科小结列表
      branchAdvice: '', // 分科建议
      branchAdviceList: {}, // 分科建议列表
      branchHistory: '无', // 分科病史
      diagnosisList: '', //诊断列表文本域
      operator: '',
      examDate: '',
      dept: '',
      num: 250,
      comboItemList: [], // 已修改的组合单项列表
      curComboId: '', // 当前组合id
      curShowType: '1', // 非标组合判断 0为非标
      curTabIndex: 'branchTip', // 当前tab项
      saveLoading: false,
      popLoading: false,
      reportLoading: false,
      popupBtn: false,
      weight: '',
      height: '',
      itemHeight: '',
      itemWeight: '',
      BMIDiagnose: '',
      BMIBranch: '0', // 判断BMI是否进入小结 0进入，1不进入
      activeComboItem: '', // 当前选中组合
      curComboDept: {}, // 当前编辑组合所属科室信息
      PoptipVisible: false,
      isGetResult: false, // 诊断结果防重复提交
      registerCode: '',  // 登记流水号
      examStatus: '', // 病人体检状态
      doctorId: '', // 检验者id
      doctorName: '', // 检验者姓名
      lisDoctorId: '',  // 审核者id
      lisDoctorName: '', // 审核者姓名
      refuseExamLoading: false, // 拒检请求loading
      delExamLoading: false, // 删除分检结果loading
      curcomboBoId: '', // 当前选中组合项主键， 拒检接口需要获取
      curRowTableData: {}, // 当前行数据
      curResultList: [], // 当前所选细项检验结果
      diseaseListTitle: 0, // 结果弹出框title，0为检查，1为检验
      BMIbranchAdvice: '', // BMI分科建议
      BMIDiseaseId: '', // BMI疾病id
      allBranchAdvice: '',
      diseaseScience: '', // 疾病科普
      curFocusInput: 0, // 当前聚焦input框
      patientVisitIdList: [], // 导入检验结果--id列表
      importExamLoading: false, // 导入检验结果loading
    }
  },
  computed: {
    roomList: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () {
      }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
    examDoctorDict: {
      get: function () {
        return this.$store.getters.getExamDoctorDict
      },
      set: function () { }
    },
    // 过滤无科室权限列表项
    comboListFilter: function () {
      return this.comboList.filter(item => {
        return this.userInfo.userAllDeptId.some((ele) => {
          return item.boDeptId == ele
        })
      })
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
    },
    branchAdvice (newVal) {
      this.allBranchAdvice = (this.branchAdvice + this.BMIbranchAdvice)
    },
    BMIbranchAdvice (newVal) {
      this.allBranchAdvice = (this.branchAdvice + this.BMIbranchAdvice)
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

    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
    this.$store.dispatch('getRoomDict');
    // let params = {
    //   deptId: ''
    // }
    // this.$store.dispatch('getExamDoctorDict', { params })
    this.dept = this.userInfo.userDeptId
    this.operator = this.userInfo.poName
    this.examDate = moment().format('YYYY-MM-DD HH:mm')
    // 获取自动清空分检配置
    let setting = getAutoClearStorage()
    if (Object.keys(setting).length > 0) {
      this.clearForm = setting
    } else {
      this.$set(this.clearForm, 'isExamTableAutoClear', true)
    }
  },
  methods: {
    getExamResult (row, index) {
      console.log(row)
      this.PoptipVisible = false
      if (row.paItemName.indexOf('身高') >= 0) {
        this.height = row.paRecord
        this.itemHeight = row.paItemName
        this.caculateBMI()
      }
      if (row.paItemName.indexOf('体重') >= 0) {
        this.weight = row.paRecord
        this.itemWeight = row.paItemName
        this.caculateBMI()
      }
      if (row.paRecord == '') {
        return false
      }
      let curId = row.paId
      let params
      if (row.paRecordType == '1' || this.curResultList.length == 0) {
        let result = this.tableData[this.curComboId][index].paRecord.trim()
        let _result = result.split('；')
        params = {
          paId: curId,
          result: _result,
          sex: this.form.boSex,
          age: this.form.boAge,
          paRecordType: row.paRecordType,
          boPicDisplayMethod: this.curShowType
        }
      } else {
        params = {
          paId: curId,
          result: this.curResultList,
          sex: this.form.boSex,
          age: this.form.boAge,
          paRecordType: row.paRecordType,
          boPicDisplayMethod: this.curShowType
        }
      }

      resultContrast(params).then(({ data }) => {
        this.curResultList = []
        if (data.code == 0) {
          let result = data.data
          let abnormalBoolean = false // iview checkbox只接受Boolean，要做处理
          if (result.paIsAbnormal == 1) {
            abnormalBoolean = true
          }

          let _resultDescription = ''
          let _diseaseIdList = []
          for (let i = 0; i < result.resultList.length; i++) {
            _resultDescription += (result.resultList.length - 1) == i ? result.resultList[i].paResultDescription : result.resultList[i].paResultDescription + '；'
            if (result.resultList[i].paDiseaseId) {
              _diseaseIdList.push(result.resultList[i].paDiseaseId)
            }
          }

          this.$set(this.tableData[this.curComboId][index], 'paIsAbnormal', abnormalBoolean)
          // this.$set(this.tableData[this.curComboId][index], 'paResultDescription', result.paResultDescription)
          this.$set(this.tableData[this.curComboId][index], 'paResultDescription', _resultDescription)
          this.$set(this.tableData[this.curComboId][index], 'paReferenceRange', result.paReferenceRange)
          this.$set(this.tableData[this.curComboId][index], 'identification', result.identification)
          // this.$set(this.tableData[this.curComboId][index], 'paItemSummary', result.paItemSummary)
          // this.$set(this.tableData[this.curComboId][index], 'paDiseaseId', result.paDiseaseId)
          this.$set(this.tableData[this.curComboId][index], 'resultList', result.resultList)
          this.$set(this.tableData[this.curComboId][index], 'diseaseIdList', _diseaseIdList)

          // 添加手录判断
          this.$set(this.tableData[this.curComboId][index], 'isFreeHand', false)
          // 保存项目检查结果的疾病建议
          let adviceItem = {
            paId: result.paId,
            resultList: result.resultList
          }
          this.$set(this.branchAdviceList, result.paId, adviceItem)
          // 填写分科建议
          this.getItemAdvice()
          // 填写诊断列表
          this.getDiagnosisList()
          data.message && this.$Message.success(data.message)
        } else {
          data.message && this.$Message.error(data.message)
        }
      }).catch(err => {
        // 同时触发查询检查结果和查询组合项目时会有冲突，不影响数据结果，先注释错误提示
        // this.$Message.error(err.message)
      })
    },
    handleReset () {
      this.form = {}
      this.tableData = {}
      this.comboList = []
      this.branchExtraTip = ''
      this.branchTipList = []
      this.branchAdvice = ''
      this.branchHistory = ''
      this.diagnosisList = ''
      this.comboItemList = []
      this.curComboId = ''
      this.branchAdviceList = {}
      this.registerCode = ''
      this.curResultList = []
      this.BMIDiseaseId = ''
      this.BMIbranchAdvice = ''
      this.BMIDiagnose = ''
      this.allBranchAdvice = ''
      this.diseaseScience = ''
      this.patientVisitIdList = []
      // 重置table input框聚焦
      this.curFocusInput = 0
      document.onkeydown = null
      this.$nextTick(() => {
        this.$refs.inputFocus.focus()
      })

    },
    async getComboItem (item) {
      this.curComboId = item.boComboId
      this.curcomboBoId = item.boId
      this.curShowType = item.boPicDisplayMethod || '1'
      // if (this.tableData[this.curComboId]) {
      //   return false
      // }
      // 获取组合对应检查医生字典
      let obj = {
        deptId: item.boDeptId,
        deptName: ''
      }
      await this.$store.dispatch('getExamDoctorDict', { params: obj, btn: true }).then(({ data }) => {
        if (item.isInspection == '1') {
          return false
        }
        let isHasDoctor = data.some(ele => {
          return this.userInfo.poName == ele.doctorName
        })

        if (isHasDoctor) {
          this.doctorId = this.userInfo.userId
          this.doctorName = this.userInfo.poName
          this.lisDoctorId = this.userInfo.userId
          this.lisDoctorName = this.userInfo.poName
        } else if (!isHasDoctor && data.length > 0) {
          this.doctorId = data[0].doctorId
          this.doctorName = data[0].doctorName
          this.lisDoctorId = data[0].doctorId
          this.lisDoctorName = data[0].doctorName
        } else {
          this.doctorId = ''
          this.doctorName = ''
          this.lisDoctorId = ''
          this.lisDoctorName = ''
        }
      })
      // 登录医生无科室权限不可查看相应组合项目
      let isdisabled = this.userInfo.userAllDeptId.some((ele) => {
        return item.boDeptId == ele
      })
      if (!isdisabled) {
        return false
      }
      this.$set(this.curComboDept, 'deptName', item.boDeptName)
      this.$set(this.curComboDept, 'deptId', item.boDeptId)
      // this.$set(this.curComboDept, 'isInspection', item.isInspection)
      // 获取小结、建议、病史模板信息
      this.$refs.demoInput.getCurDept(item.boDeptId)
      // 切换组合时，清空诊断和小结等信息
      this.branchExtraTip = '未见异常'
      this.branchTipList = []
      this.branchAdvice = ''
      this.branchHistory = '无'
      this.diagnosisList = '未见异常'
      this.comboItemList = []
      this.branchAdviceList = {}
      this.curResultList = []
      this.BMIDiseaseId = ''
      this.BMIbranchAdvice = ''
      this.BMIDiagnose = ''
      this.allBranchAdvice = ''
      this.diseaseScience = ''
      // 重置table input框聚焦
      this.curFocusInput = 0
      document.onkeydown = null

      let params = {
        comboId: this.curComboId,
        peId: this.form.boPeId,
        visitSn: this.form.boVisitSn,
        showType: '3'
      }
      // 获取已填写的小结、建议、诊断信息
      this.getRecordSummary(item)
      this.tableLoading = true
      getSingleItem(params).then(({ data }) => {
        this.tableLoading = false
        if (data.code == 0) {
          let result = data.data
          for (let i = 0; i < result.length; i++) {
            result[i].paRecord = result[i].paRecord ? result[i].paRecord : ''
            if (result[i].paIsAbnormal === null || result[i].paIsAbnormal == '0') {
              result[i].paIsAbnormal = false
            } else {
              result[i].paIsAbnormal = true
            }
            result[i].paResultDescription = result[i].paResultDescription ? result[i].paResultDescription : ''
            result[i].paReferenceRange = result[i].paReferenceRange ? result[i].paReferenceRange : ''
            result[i].resultList = result[i].resultList || []
            result[i].diseaseIdList = []
          }
          this.$set(this.tableData, this.curComboId, result)
          this.addKeypressEvent()
          // console.log(this.tableData)
          // this.tableData[id] = result
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.tableLoading = false
        this.$Message.error('获取病人组合细项失败，请稍后重试')
      })
    },
    // 拒检操作
    refuseExamHandle (row, status) {
      // status 为组合完成状态，0为未完成，1为完成，2为拒检
      let _status = '0'
      let _comboId = this.curcomboBoId
      let flag = '0'
      if (status == '0') {
        _status = '2'
      }
      // 检验项目送检时拒检
      if (status == '4') {
        _status = '2'
        flag = '4'
      }
      if (row.sendExamFlag && row.sendExamFlag == '4') {
        _status = '4'
        flag = '0'
      }

      let params = {
        boId: _comboId,
        boIsCompleted: _status
      }
      this.refuseExamLoading = true
      refuseExam(params).then(({ data }) => {
        this.refuseExamLoading = false
        if (data.code == 0) {
          for (let i = 0; i < this.comboList.length; i++) {
            if (this.comboList[i].boId == _comboId) {
              this.$set(this.comboList[i], 'boIsCompleted', _status)
              this.$set(this.comboList[i], 'sendExamFlag', flag)
              break
            }
          }
          this.$Message.success('操作成功！')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.refuseExamLoading = false
        this.$Message.error('网络连接失败，请稍后重试')
      })
    },
    // 删除分检结果操作
    delExamHandle () {

      this.$Modal.confirm({
        title: '提示',
        content: '删除组合分检数据后无法恢复，是否删除？',
        onOk: () => {
          let _comboId = this.curcomboBoId
          let params = {
            boId: _comboId
          }
          this.delExamLoading = true
          delExamResult(params).then(({ data }) => {
            this.delExamLoading = false
            if (data.code == 0) {
              for (let i = 0; i < this.comboList.length; i++) {
                if (this.comboList[i].boId == _comboId) {
                  this.$set(this.comboList[i], 'isInspection', '0')
                  this.$set(this.comboList[i], 'boIsCompleted', '0')
                  this.getComboItem(this.comboList[i])
                  break
                }
              }
              this.$Message.success('操作成功！')
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.delExamLoading = false
            this.$Message.error('网络连接失败，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })

    },

    // 获取当前聚焦的input索引
    setCurInputFocus (row, index) {
      this.curFocusInput = index
      console.log('setfocusidx', this.curFocusInput)
    },

    // 全局添加键盘上下键事件
    addKeypressEvent () {
      this.$nextTick(() => {
        document.onkeydown = null
        let _arr = document.getElementsByClassName('js-self-focus')
        let _inputArr = []
        for (let i = 0; i < _arr.length; i++) {

          _inputArr.push(_arr[i].getElementsByTagName('input')[0])
        }
        let that = this
        document.onkeydown = function (event) {
          const e = event || window.event || arguments.callee.caller.arguments[0];
          // 键盘下
          if (e && e.keyCode == 40) {
            if (that.curFocusInput < _inputArr.length - 1) {
              ++that.curFocusInput
              _inputArr[that.curFocusInput].focus()
            } else {
              _inputArr[that.curFocusInput].focus()
            }
          }
          // 键盘上
          if (e && e.keyCode == 38) {
            if (that.curFocusInput > 0) {
              --that.curFocusInput
              _inputArr[that.curFocusInput].focus()
            } else {
              that.curFocusInput = 0
              _inputArr[that.curFocusInput].focus()
            }
          }
        }
      })

    },

    // 显示分科小结示例弹窗
    popupShowHandle () {
      this.popupBtn = true
      this.$refs.demoInput.getCurTab(this.curTabIndex)
    },
    // 当前表格选中行
    curRowTable (curRow) {
      console.log(curRow)
      this.curRowTableData = curRow
    },
    getPatientInfo (row) {
      this.handleReset()
      this.form = row
      this.registerCode = row.boRegisterCode
      this.examStatus = row.boResultStatus
      row.boPatientVisitId && this.patientVisitIdList.push(row.boPatientVisitId)
      if (this.examStatus == '9') {
        this.$Message.error('该病人已总检，如需修改数据请取消总检后重试')
      }
      this.getPatientCombo(row.boPeId, row.boVisitSn)
      this.getPatientPic(row.boPeId, row.boVisitSn)
      // this.getPatientPackage(row.boPeId, row.boVisitSn)
    },
    // 身高体重计算BMI值
    caculateBMI () {
      if (this.height && this.itemHeight && this.weight && this.itemWeight) {
        let params = {
          height: this.height,
          weight: this.weight,
          itemHeight: this.itemHeight,
          itemWeight: this.itemWeight,
          sex: this.form.boSex
        }
        BMICaculate(params).then(({ data }) => {
          if (data.code == 0) {
            this.BMIDiagnose = data.data[0].paResultDescription
            this.BMIBranch = data.data[0].paItemSummary
            let BMIAdvice = data.data[0].dictSuggestion.paDictSuggestionList
            let cont = ''
            if (BMIAdvice.length > 0) {
              BMIAdvice.forEach(ele => {
                cont += ele + '\n'
              })
            }
            this.BMIDiseaseId = data.data[0].paDiseaseDiagnosisId
            this.BMIbranchAdvice = cont
            this.getDiagnosisList()
          }
        })
      }
    },
    // 获取非标报告
    getReport () {
      let params = {
        inComboId: this.curComboId,
        inPeId: this.form.boPeId,
        inVisitSn: this.form.boVisitSn
      }
      this.reportLoading = true
      checkReport(params).then(({ data }) => {
        this.reportLoading = false
        if (data.code == 0) {
          let url = this.$url + data.data
          window.open(url)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('获取失败，请稍后重试')
      })
    },
    // 删除非标报告
    delReport () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该项报告？',
        onOk: () => {
          let params = {
            inComboId: this.curComboId,
            inPeId: this.form.boPeId,
            inVisitSn: this.form.boVisitSn
          }
          deleteReport(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(data.message)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('操作失败，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },
    // 双击弹出检查结果列表
    showCheckList (row, index) {
      this.diseaseListVisible = true
      this.diseaseListTitle = 1
      let obj = {
        curItem: row,
        curIndex: index
      }
      this.$refs.diseaseListWrapper.getItemList(obj)
    },
    // 使用已选检查结果查询诊断
    updateCheckResult (data) {
      console.log(data)
      let curRow = data.rowData.curItem
      let curIndex = data.rowData.curIndex
      this.curResultList = data.checkedList
      let cont = ''
      for (let i = 0; i < this.curResultList.length; i++) {
        cont += ((this.curResultList.length - 1) == i ? this.curResultList[i] : this.curResultList[i] + '；')
      }
      console.log(cont)
      this.$set(this.tableData[this.curComboId][curIndex], 'paRecord', cont)
      let _row = this.tableData[this.curComboId][curIndex]
      this.getExamResult(_row, curIndex)
    },
    // 根据单项诊断获取病人分科建议
    getItemAdvice () {
      let suggestStr = ''
      let knowledgeStr = ''
      let resultArr = []

      // 对分科建议和疾病科普项去重
      for (let j in this.branchAdviceList) {
        let item = this.branchAdviceList[j]
        resultArr.push(...item.resultList)
      }

      const res = new Map();
      let newResultArr = resultArr.filter((ele) => !res.has(ele.paDiseaseId) && res.set(ele.paDiseaseId, 1));

      newResultArr.forEach(ele => {
        let diseaseName = ele.paDiseaseName
        let knowledgeArr = ele.knowledgeList
        let suggestArr = ele.paDictSuggestionList
        let cont = ''
        let cont2 = ''

        if (knowledgeArr.length > 0) {
          knowledgeArr.forEach(i => {
            cont += i + '\n'
          })
          if (ORGINFO.name && ORGINFO.name.indexOf('民主路') > -1) {
            cont = diseaseName + '：\n' + cont
          } else {
            cont = diseaseName + '：' + cont
          }
          knowledgeStr += cont
        }
        if (suggestArr.length > 0) {
          suggestArr.forEach(j => {
            cont2 += j + '\n'
          })
          if (ORGINFO.name && ORGINFO.name.indexOf('民主路') > -1) {
            cont2 = diseaseName + '：\n' + cont2
          } else {
            cont2 = diseaseName + '：' + cont2
          }
          suggestStr += cont2
        }
      })
      this.branchAdvice = suggestStr
      this.diseaseScience = knowledgeStr
    },
    // 获取病人已填写结果数据
    getRecordSummary (curComboInfo) {
      let params = {
        comboId: this.curComboId,
        peId: this.form.boPeId,
        visitSn: this.form.boVisitSn,
        boDeptId: this.curComboDept.deptId
      }
      recordSummary(params).then(({ data }) => {
        if (data.code == 0) {
          if (data.data.summaryList.length > 0) {
            let resultData = data.data.summaryList[0]
            this.branchExtraTip = resultData.conclusion ? resultData.conclusion.replace(/<br\/>/g, '\n') : ''
            this.diagnosisList = resultData.diagnosisList ? resultData.diagnosisList.replace(/<br\/>/g, '\n') : ''
            this.branchAdvice = resultData.suggestion ? resultData.suggestion.replace(/<br\/>/g, '\n') : ''
            this.branchHistory = resultData.medicalHistory ? resultData.medicalHistory.replace(/<br\/>/g, '\n') : ''
            this.diseaseScience = resultData.diseasePopularizationScience ? resultData.diseasePopularizationScience.replace(/<br\/>/g, '\n') : ''
            this.dept = resultData.deptId
            this.doctorId = resultData.examDoctorId
            this.doctorName = resultData.examDoctorName
            this.lisDoctorId = resultData.lisDoctorId
            this.lisDoctorName = resultData.lisDoctorName
            this.operator = resultData.operatorName
            this.examDate = moment(resultData.resultDate).format('YYYY-MM-DD HH:mm')
          } else {
            this.dept = this.userInfo.userDeptId
            this.operator = this.userInfo.poName
            this.examDate = moment().format('YYYY-MM-DD HH:mm')
          }
        }
      })
    },

    // 获取对应病人项目组合
    getPatientCombo (id, visitSn) {
      let params = {
        peId: id,
        visitSn: visitSn,
        peShowType: [3]
      }
      getCombo(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.comboList = result
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('获取病人组合项目失败，请稍后重试')
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
          if (picSrc != '') {
            this.$set(this.form, 'boPic', this.$url + picSrc)
          }
        }
      }).catch(err => {
        return false
      })
    },
    curTabActive (name) {
      this.curTabIndex = name
      this.$refs.demoInput.getCurTab(this.curTabIndex)
    },
    // 根据流水号查询病人信息
    getPatientByRegisterCode () {
      this.patientVisitIdList = []
      let params = {
        registerCode: this.registerCode,
        peShowType: [3]
      }
      this.handleReset()
      this.registerCode = params.registerCode

      PatientMsgByRegisterCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.form = result[0]
          result[0].boPatientVisitId && this.patientVisitIdList.push(result[0].boPatientVisitId)
          this.$set(this.form, 'boPackage', result[2].boPackage)
          this.$set(this.form, 'boPackageId', result[2].boPackageId)
          if (result[1].pic != '') {
            this.$set(this.form, 'boPic', this.$url + result[1].pic)
          } else {
            this.$set(this.form, 'boPic', '')
          }
          this.comboList = result[2].comboList
          // this.registerCode = ''
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('网络连接失败，请稍后重试')
      })
    },
    // 获取诊断列表
    getDiagnosisList () {
      this.diagnosisList = ''
      let branchtipData = '' // 分科小结随诊断带出
      console.log(this.tableData)
      this.tableData[this.curComboId].forEach((item, index, arr) => {
        let itemData = ''

        if (item.paIsAbnormal && item.paRecord != '' || item.isFreeHand && item.paRecord != '') {
          this.diagnosisList += item.paItemName + '：' + item.paResultDescription + '\n'
        }
        if (item.isFreeHand) {
          itemData += item.paResultDescription
        } else {
          for (let i = 0; i < item.resultList.length; i++) {
            // if (item.resultList[i].paItemSummary && item.resultList[i].paItemSummary == '0') {
            //   branchtipData += item.resultList[i].paResultDescription + '\n'
            // }
            if (item.resultList[i].paItemSummary && item.resultList[i].paItemSummary == '0') {
              itemData += (item.resultList.length - 1) == i ? item.resultList[i].paResultDescription : item.resultList[i].paResultDescription + ' '
            } else {
              itemData += ''
            }
          }
        }

        if (itemData.trim() != '' && arr.length > 1) {
          // 多个项目多个结果添加括号（新需求去除括号）
          if (item.resultList.length > 1) {
            itemData = ' ' + itemData + ' '
          }
          branchtipData += item.paItemName + itemData + '  '
        } else if (itemData.trim() != '' && arr.length == 1) {
          branchtipData += itemData
        } else {
          branchtipData += ''
        }

        if (item.paItemName.indexOf('身高') >= 0 && this.BMIDiagnose) {
          this.diagnosisList += 'BMI诊断：' + this.BMIDiagnose + '\n'
          if (this.BMIBranch == '0') {
            branchtipData += 'BMI诊断' + this.BMIDiagnose + '  '
          }
        }
      });

      if (this.diagnosisList.trim() == '') {
        this.diagnosisList = '未见异常'
      }
      // 诊断添加到分科小结
      if (branchtipData.trim() != '') {
        this.branchExtraTip = branchtipData
      } else {
        this.branchExtraTip = '未见异常'
      }
    },

    // 更新分科小结，分科病史，分科建议
    updateDemo (str) {
      if (this.curTabIndex == 'branchTip') {
        this.branchExtraTip += str + '\n'
      } else if (this.curTabIndex == 'branchHistory') {
        this.branchHistory += str + '\n'
      } else if (this.curTabIndex == 'branchAdvice') {
        this.allBranchAdvice += str + '\n'
      }
    },

    save () {
      //防按钮回车触发
      if (this.saveLoading) return false

      if (this.examStatus == '9') {
        this.$Message.error('该病人已总检，如需修改数据请取消总检后重试')
        return false
      }
      if (this.doctorId == '') {
        this.$Message.warning('请选择审核医生！')
        return false
      }
      if (this.lisDoctorId == '') {
        this.$Message.warning('请选择检验医生！')
        return false
      }
      if (Object.keys(this.tableData).length == 0) {
        return false
      }
      // 拒检项目提示恢复后保存
      let curCombo = this.comboList.filter(ele => {
        return ele.boComboId == this.curComboId
      })
      if (curCombo.length > 0 && curCombo[0].boIsCompleted == '2') {
        this.$Message.warning('拒检组合无法保存，请恢复后重试')
        return false
      }

      let params = {
        medicalHistory: this.branchHistory,
        operateDate: moment(this.examDate).format('YYYY-MM-DD HH:mm:ss'),
        suggestion: this.allBranchAdvice,
        diagnosisList: this.diagnosisList,
        conclusion: this.branchExtraTip.replace(/^\s+|\s+$/g, ''),
        deptId: this.curComboDept.deptId,
        deptName: this.curComboDept.deptName,
        doctorId: this.doctorId,
        doctorName: this.doctorName,
        lisDoctorId: this.lisDoctorId,
        lisDoctorName: this.lisDoctorName,
        operatorId: this.userInfo.userId,
        operatorName: this.userInfo.poName,
        showType: '3', // 区分检验检查 1为检查 3为检验
        bmiDiseaseId: this.BMIDiseaseId,
        diseasePopularizationScience: this.diseaseScience,
        imgName: '',
        registerCode: this.registerCode || ''
      }
      params.masterIndex = this.form

      // 为项目添加项目小结
      let _comboId = this.curComboId
      let arr = JSON.parse(JSON.stringify(this.tableData[_comboId])) // 需要深拷贝，否则会影响原数据
      for (let k = 0; k < arr.length; k++) {
        if (arr[k].paIsAbnormal === false) {
          arr[k].paIsAbnormal = '0'
        } else {
          arr[k].paIsAbnormal = '1'
        }
      }
      console.log(arr)
      params.itemList = arr
      this.saveLoading = true
      resultSave(params).then(({ data }) => {
        this.saveLoading = false
        if (data.code == 0) {
          this.$Message.success('保存成功！')
          this.operator = this.userInfo.poName
          this.comboInspection(_comboId)
          let setting = getAutoClearStorage()
          if (Object.keys(setting).length == 0 || (Object.keys(setting).length > 0 && setting.isExamTableAutoClear)) {
            this.handleReset()
          }
          this.$nextTick(() => {
            this.$refs.inputFocus.focus()
          })
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.saveLoading = false
        this.$Message.error('网络连接失败，请稍后重试')
      })
    },
    // table 双向绑定input实时渲染会导致input框失去焦点，做如下处理
    bindResultInput (row, index) {
      this.tableData[this.curComboId][index] = row
      if (row.paRecord.trim() == '' || row.paRecord.trim() == '/') {
        this.$set(this.tableData[this.curComboId][index], 'paIsAbnormal', false)
        this.$set(this.tableData[this.curComboId][index], 'paResultDescription', '')
        if (row.paItemName.indexOf('身高') >= 0 || row.paItemName.indexOf('体重') >= 0) {
          this.BMIDiagnose = ''
        }
        this.getDiagnosisList()
      }
    },
    bindIsAbnormal (row, index) {
      this.tableData[this.curComboId][index] = row
      // this.$set(this.tableData[this.curComboId][index], 'paIsAbnormal', row.paIsAbnormal)
      this.$set(this.tableData[this.curComboId][index], 'isFreeHand', true)
      this.getDiagnosisList()
    },
    bindResultDescription (row, index) {
      this.tableData[this.curComboId][index] = row
      this.$set(this.tableData[this.curComboId][index], 'isFreeHand', true)
      this.getDiagnosisList()
    },
    resultSelectHandle (row, res, idx) {
      this.$set(this.tableData[this.curComboId][idx], 'paRecord', res.resultDescription)
      this.getExamResult(this.tableData[this.curComboId][idx], idx)
    },

    //保存成功后，当前组合项更改为已激活状态
    comboInspection (comboId) {
      for (let i = 0; i < this.comboList.length; i++) {
        if (this.comboList[i].boComboId == comboId) {
          this.$set(this.comboList[i], 'isInspection', '1')
          break
        }
      }
    },
    // 导入检验结果操作
    importExamData () {
      if (this.patientVisitIdList.length === 0) {
        this.$Message.info('请选择病人后再导入检验结果数据')
        return false
      }
      let params = {
        patientVisitIds: this.patientVisitIdList
      }
      this.importExamLoading = true
      reportJY(params).then(({ data }) => {
        this.importExamLoading = false
        if (data.code == 0) {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error(data.message)
        }
        // 导入后刷新数据，避免导入成功后表格数据不更新的问题
        this.form = {}
        this.tableData = {}
        this.comboList = []
        this.branchExtraTip = ''
        this.branchTipList = []
        this.branchAdvice = ''
        this.branchHistory = ''
        this.diagnosisList = ''
        this.comboItemList = []
        this.curComboId = ''
        this.branchAdviceList = {}
        this.curResultList = []
        this.BMIDiseaseId = ''
        this.BMIbranchAdvice = ''
        this.BMIDiagnose = ''
        this.allBranchAdvice = ''
        this.diseaseScience = ''
        this.patientVisitIdList = []
        // 重置table input框聚焦
        this.curFocusInput = 0
        document.onkeydown = null
        this.getPatientByRegisterCode()
      }).catch(err => {
        this.importExamLoading = false
        this.$Message.error(err.message)
      })
    },

    // 清空配置
    clearSetting () {
      setAutoClearStorage(this.clearForm)
    },
    // 修改审核医生 
    examDoctorChange (obj) {
      if (obj) {
        this.doctorId = obj.doctorId
      }
    },
    // 修改检验医生
    lisDoctorChange (obj) {
      if (obj) {
        this.lisDoctorId = obj.doctorId
        console.log(obj)
      }
    },
    changeTableClass (row, index) {
      let btn = this.tableData[this.curComboId][index].paIsAbnormal
      let _row = this.tableData[this.curComboId][index]
      if (_row.identification == 'h' ||
        _row.identification == 'ah' ||
        _row.identification == 'HH' ||
        _row.identification == 'H') {
        return 'active-table-row-red'
      } else if (_row.identification == 'l' ||
        _row.identification == 'al' ||
        _row.identification == 'LL' ||
        _row.identification == 'L') {
        return 'active-table-row-blue'
      } else if (btn) {
        return 'active-table-row-red'
      } else {
        return ''
      }
    },

    // 多权限医生项目组合class处理
    showComboClass (obj) {
      let isdisabled = this.userInfo.userAllDeptId.some((item) => {
        return obj.boDeptId == item
      })
      let isActive = (obj.boComboId == this.curComboId)
      let isInspection = (obj.isInspection == '1')
      let isRefuse = (obj.boIsCompleted == '2' && obj.isInspection != "1")
      let hasSend = (obj.boIsCompleted == '4' && obj.isInspection != "1")
      return {
        'disabled': !isdisabled,
        'active': isActive,
        'is-inspection': isInspection,
        'refuse-active': isRefuse,
        'is-send': hasSend
      }
    }
  },
}
</script>
<style lang="less">
.page-header-wrapper {
  display: flex;
  .photo {
    width: 100px;
    height: 127px;
    flex-shrink: 0;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
  }
  .form-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 20px;
    .info {
      height: auto;
    }
    .btns {
      width: 150px;
      height: auto;
      flex-shrink: 0;
      margin-left: 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  }
}
.vip-parent {
  position: relative;
  .vip-icon {
    position: absolute;
    right: 0;
    top: 4px;
    width: 46.5px;
    height: 24px;
    img {
      width: 100%;
      height: auto;
    }
  }
}
.main {
  textarea {
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
}
.check-result-content {
  min-width: 120px;
  display: flex;
  align-items: center;
}
.summary-item-label {
  word-break: break-all;
}
.check-result-select-item {
  width: 100%;
  height: auto;
  span {
    width: 100%;
    display: block;
    height: 24px;
    line-height: 24px;
    border-bottom: 1px solid #eee;
  }
  span.active {
    background-color: #ebf7ff;
  }
}
.diagList-title {
  height: 34px;
}
.check-result-poptip {
  display: block;
  min-width: 120px;
  max-width: 220px;
  .ivu-poptip-rel {
    display: flex;
    align-items: center;
  }
}
.flex-wrapper {
  display: flex;
  margin-bottom: 5px;
}
.scan-code-input-wrapper {
  border: 2px dotted #2d8cf0;
  border-radius: 4px;
  padding: 5px;
  .title {
    font-size: 16px;
    color: #2d8cf0;
    font-weight: bold;
    line-height: 1.5;
    display: flex;
    align-items: center;
    span {
      font-size: 12px;
      font-weight: 400;
      color: #999;
    }
    &::before,
    &::after {
      display: none;
      content: '';
    }
  }
  .ivu-form-item-content {
    margin-left: 0 !important;
    .ivu-input {
      font-size: 16px !important;
      font-weight: bold;
    }
  }
}
.result-wrapper {
  .combo-list {
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
  .active-table-row-red {
    color: #ed4014;
    input {
      color: #ed4014 !important;
    }
    .ivu-checkbox-checked .ivu-checkbox-inner {
      border-color: #ed4014;
      background-color: #ed4014;
    }
  }
  .active-table-row-blue {
    color: #2d8cf0;
    input {
      color: #2d8cf0 !important;
    }
    .ivu-checkbox-checked .ivu-checkbox-inner {
      border-color: #2d8cf0;
      background-color: #2d8cf0;
    }
  }
  .combo-item {
    cursor: pointer;
    min-height: 43px;
    border-bottom: 1px solid #e8eaec;
  }
  .combo-item.is-inspection {
    color: #2d8cf0;
  }
  .combo-item.refuse-active {
    color: #ed4014;
  }
  .combo-item.is-send {
    color: #f89e17;
  }
  .combo-item.active {
    background-color: #ebf7ff;
  }
  .combo-item.disabled {
    color: #c5c8ce !important;
    background-color: #f7f7f7;
    cursor: not-allowed;
  }
}
</style>
