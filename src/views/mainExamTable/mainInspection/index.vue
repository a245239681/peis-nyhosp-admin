<template>
  <div class="main-exam-wrapper"
       id="rightMenu">
    <Spin size="large"
          fix
          v-if="spinShow"></Spin>
    <div class="main-exam-top-wrapper">
      <div class="left-box">
        <div class="basic-info">
          <div class="title-container">
            <span class="title">基本信息</span>
            <div class="title-right-tool">
              <!-- <Button type="warning" size="small">重置</Button> -->
            </div>
          </div>
          <Form ref=:form
                :label-width="100">
            <div class="basic-info-main">
              <div class="basic-info-body-pic">
                <img :src="imgUrl"
                     v-if="imgUrl"
                     alt="">
                <img src="@/assets/images/userPhoto.png"
                     v-else
                     alt="登记用户头像">
              </div>
              <div class="basic-info-body-input">
                <div class="info-item">
                  <!-- <FormItem label="体检号">
                    <Input v-model="formData.boPeId"
                           size="small"
                           readonly />
                  </FormItem> -->
                  <FormItem label="姓名">
                    <Input v-model="formData.boName"
                           size="small"
                           readonly />
                  </FormItem>
                  <FormItem label="体检次数"
                            :label-width="100">
                    <Input v-model="formData.boVisitSn"
                           size="small"
                           readonly />
                  </FormItem>
                </div>
                <!-- <div class="info-item">
                  <FormItem label="姓名">
                    <Input v-model="formData.boName"
                           size="small"
                           readonly />
                  </FormItem>

                  <FormItem label="体检类别"
                            :label-width="100">
                    <Input v-model="formData.boCategory"
                           size="small"
                           readonly />
                  </FormItem>
                </div> -->
                <div class="info-item">
                  <FormItem label="性别">
                    <Input v-model="formData.boSex"
                           size="small"
                           readonly />
                  </FormItem>

                  <FormItem label="年龄"
                            :label-width="100">
                    <Input v-model="formData.boAge"
                           size="small"
                           readonly />
                  </FormItem>
                </div>
                <div class="info-item">
                  <FormItem label="登记流水号">
                    <Input ref='inputFocus'
                           v-model="formData.registerCode"
                           @on-enter="getPatientByRegisterCode"
                           size="small" />
                  </FormItem>
                  <FormItem label="单位名称">
                    <Input v-model="formData.boUnitName"
                           size="small"
                           readonly />
                  </FormItem>

                  <!-- <FormItem label="体检套餐"
                            :label-width="100">
                    <Input v-model="formData.boPackageName"
                           size="small"
                           readonly />
                  </FormItem> -->
                </div>
                <!-- <div class="info-item">
                  <FormItem label="登记流水号">
                    <Input ref='inputFocus'
                           v-model="formData.registerCode"
                           @on-enter="getPatientByRegisterCode"
                           size="small" />
                  </FormItem>
                </div> -->
              </div>
            </div>
          </Form>
        </div>
        <div class="records-info">
          <Card>
            <div>
              <Tabs value="name1">
                <TabPane label="诊断明细"
                         name="name1">
                  <vxe-table border
                             ref="xTree"
                             :auto-resize="true"
                             max-height="530"
                             :cell-style="{padding: '0px 0px'}"
                             :row-class-name="diagnosticStyle"
                             :tree-config="{children: 'children', hasChild: 'hasChild', expandAll: foldForm.isFold,trigger: 'row'}"
                             :data="diagnosticTableData">
                    <vxe-table-column field="deptName"
                                      title="科室"
                                      min-width="100"
                                      tree-node></vxe-table-column>
                    <vxe-table-column field="itemName"
                                      min-width="140"
                                      title="诊断项目">
                      <template slot-scope="{ row }">
                        <span v-if="row.identification == 'h' 
                        || row.identification == 'ah' 
                        || row.identification == 'H'
                        || row.identification == 'HH'"
                              style="color:red"> {{ row.itemName }} </span>
                        <span v-else-if="row.identification == 'l' 
                        || row.identification == 'al' 
                        || row.identification == 'L'
                        || row.identification == 'LL'"
                              style="color:blue"> {{ row.itemName }} </span>
                        <span v-else-if="row.isAbnormal == '1'"
                              style="color:red">{{row.itemName}}</span>
                        <span v-else>{{row.itemName}}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="answer"
                                      min-width="90"
                                      title="数值">
                      <template slot-scope="{ row }">
                        <span v-if="row.identification == 'h' 
                        || row.identification == 'ah' 
                        || row.identification == 'H'
                        || row.identification == 'HH'"
                              style="color:red"> {{ row.answer }} </span>
                        <span v-else-if="row.identification == 'l' 
                        || row.identification == 'al' 
                        || row.identification == 'L'
                        || row.identification == 'LL'"
                              style="color:blue"> {{ row.answer }} </span>
                        <span v-else-if="row.isAbnormal == '1'"
                              style="color:red">{{row.answer}}</span>
                        <span v-else>{{row.answer}}</span>
                        <Icon v-if=" row.identification == 'h' || row.identification == 'ah' || row.identification == 'HH' || row.identification == 'H' "
                              style="color: red; font-size: 18px; font-weight:400;"
                              type="md-arrow-up" />
                        <Icon v-if="row.identification == 'l' || row.identification == 'al' || row.identification == 'LL' || row.identification == 'L'"
                              style="color: blue; font-size: 18px; font-weight:400;"
                              type="md-arrow-down" />
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="reference"
                                      min-width="90"
                                      title="对照范围">
                      <template slot-scope="{ row }">
                        <span v-if="row.identification == 'h' 
                        || row.identification == 'ah' 
                        || row.identification == 'H'
                        || row.identification == 'HH'"
                              style="color:red"> {{ row.reference }} </span>
                        <span v-else-if="row.identification == 'l' 
                        || row.identification == 'al' 
                        || row.identification == 'L'
                        || row.identification == 'LL'"
                              style="color:blue"> {{ row.reference }} </span>
                        <span v-else-if="row.isAbnormal == '1'"
                              style="color:red">{{row.reference}}</span>
                        <span v-else>{{row.reference}}</span>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column field="result"
                                      min-width="180"
                                      title="结论">
                      <template slot-scope="{ row }">
                        <span v-if="row.identification == 'h' 
                        || row.identification == 'ah' 
                        || row.identification == 'H'
                        || row.identification == 'HH'"
                              style="color:red"> {{ row.result }} </span>
                        <span v-else-if="row.identification == 'l' 
                        || row.identification == 'al' 
                        || row.identification == 'L'
                        || row.identification == 'LL'"
                              style="color:blue"> {{ row.result }} </span>
                        <span v-else-if="row.isAbnormal == '1'"
                              style="color:red">{{row.result}}</span>
                        <span v-else>{{row.result}}</span>
                      </template>
                    </vxe-table-column>
                  </vxe-table>

                  <!-- <Table
                    :columns="diagnosticCols"
                    highlight-row
                    ellipsis
                    height="465"
                    :row-class-name="changeTableClass"
                    :data="diagnosticTableData"
                  >
                    <template
                      slot="answer"
                      slot-scope="{row}"
                    >

                      <span> {{ row.answer }} </span>
                      <Icon
                        v-if=" row.identification == 'h' || row.identification == 'ah'"
                        style="color: red; font-size: 18px; font-weight:400;"
                        type="md-arrow-up"
                      />
                      <Icon
                        v-if="row.identification == 'l' || row.identification == 'al'"
                        style="color: red; font-size: 18px; font-weight:400;"
                        type="md-arrow-down"
                      />
                    </template>
                    <template
                      slot="result"
                      slot-scope="{row, index}"
                    >
                      <Input
                        type="text"
                        v-model="editResult"
                        v-if="editIndex === index"
                      />
                      <span v-else>{{ row.result }}</span>
                    </template> -->
                  <!-- <template slot="action"
                              slot-scope="{row, index}">
                      <div v-if="editIndex === index">
                        <Button @click="handleSave(index)"
                                size="small"
                                type="primary"
                                ghost
                                style="margin-right:10px;">保存</Button>
                        <Button @click="editIndex = -1"
                                size="small"
                                type="primary"
                                ghost>取消</Button>
                      </div>
                      <div v-else>
                        <Button @click="handleEdit(row, index)"
                                :disabled="disabled"
                                size="small"
                                type="primary"
                                ghost>修改</Button>
                      </div>
                    </template> -->
                  <!-- </Table> -->
                </TabPane>
                <TabPane label="分科结果"
                         name="name2">
                  <Table :columns="deptResultCols"
                         highlight-row
                         ellipsis
                         height="465"
                         :data="deptResultTableData">
                    <template slot="inComboName"
                              slot-scope="{row}">
                      <span>{{ row.inComboName ? row.inComboName : '无' }}</span>
                    </template>
                    <template slot="inConclusion"
                              slot-scope="{row}">
                      <span>{{ row.inConclusion ? row.inConclusion : '无' }}</span>
                    </template>
                    <template slot="inSuggestion"
                              slot-scope="{row}">
                      <span>{{ row.inSuggestion ? row.inSuggestion : '无' }}</span>
                    </template>
                  </Table>
                </TabPane>
                <TabPane label="诊断记录"
                         name="name3">
                  <Table :columns="diagnosticRecordCols"
                         highlight-row
                         height="465"
                         :data="diagnosticRecordTableData">
                  </Table>
                </TabPane>
                <TabPane label="历史诊断"
                         name="name4">
                  <tree-table ref="historyTreeTable"
                              :columns="historyDiagnosticCols"
                              :data="historyTableData"
                              :expand-type="false"
                              :is-fold="false"
                              :selectable="false"
                              :empty-text="emptyText">
                    <template slot="inSort"
                              slot-scope="{row}">
                      <span>{{row.inSort}}</span>
                    </template>
                    <template slot="inDeptName"
                              slot-scope="{row}">
                      <span>{{row.inDeptName}}</span>
                    </template>
                    <template slot="inExamDoctorName"
                              slot-scope="{row}">
                      <span>{{row.inExamDoctorName}}</span>
                    </template>
                    <template slot="inSuggestion"
                              slot-scope="{row}">
                      <span>{{row.inSuggestion}}</span>
                    </template>
                    <template slot="inConclusion"
                              slot-scope="{row}">
                      <span>{{row.inConclusion}}</span>
                    </template>
                  </tree-table>
                </TabPane>
              </Tabs>
              <span class="is-expend-switch">
                <Form ref="foldForm"
                      :model="foldForm"
                      style="margin-bottom: 8px"
                      :label-width="80"
                      label-position="right">
                  <FormItem label="是否展开">
                    <i-switch size="large"
                              v-model="foldForm.isFold"
                              @on-change="foldSetting">
                      <span slot="open">展开</span>
                      <span slot="close">收起</span>
                    </i-switch>
                  </FormItem>

                </Form>
              </span>
            </div>
          </Card>
        </div>
      </div>
      <div class="right-box">
        <div class="result-container">
          <div class="summarize">
            <div class="title-container">
              <span class="title">综述</span>
            </div>
            <div class="content-container">
              <div class="textarea">
                <Input v-model="newReview"
                       type="textarea"
                       :rows="11"
                       :disabled="formData.boResultStatus == 7 || reviewModalOpen"
                       @dblclick.native="handleDbClickReview"
                       placeholder="请输入综述信息" />
              </div>
            </div>
          </div>
          <div class="suggest">
            <div class="title-container">
              <span class="title">建议</span>
            </div>
            <div class="content-container">
              <div class="textarea">
                <Input v-model="newSuggest"
                       type="textarea"
                       :rows="11"
                       :disabled="formData.boResultStatus == 7 || suggestModalOpen"
                       @dblclick.native="handleDbClickSuggest"
                       placeholder="请输入建议信息" />
              </div>
            </div>
          </div>
          <div class="btn-box">
            <Row :gutter="16">
              <Col span="14">
              <div class="left-btn">
                <Button type="primary"
                        size="small"
                        style="margin-right:10px;"
                        @click="openDiseaseSuggest">添加疾病建议</Button>
                <Button type="primary"
                        size="small"
                        style="margin-right:10px;"
                        @click="openScienceModal">疾病科普</Button>
                <Button type="primary"
                        v-permission="['print']"
                        :disabled="!(formData.boResultStatus == 7)"
                        @click="applyPrint"
                        size="small"
                        :loading="reportLoading"
                        style="margin-right:10px;">体检报告</Button>
                <Button type="primary"
                        style="margin-right:10px;"
                        size="small"
                        v-permission="['print']"
                        @click="getPicReport">影像报告</Button>
                <Button type="primary"
                        :disabled="!(formData.boPeId && formData.boVisitSn)"
                        v-permission="['list']"
                        @click="openHistorySummarize"
                        size="small"
                        style="margin-right:10px;">历次综述</Button>
              </div>
              </Col>
              <!-- <Col span="1"></Col> -->
              <Col span="10">
              <div class="right-btn">
                保存自动清空：
                <i-switch v-model="isMainInspectionExamAutoClear"
                          style="margin-right:10px;"
                          @on-change="autoClearChange"
                          size="large">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
                <Button style="margin-right:10px;"
                        v-permission="['edit']"
                        size="small"
                        @click="handleReset">清空</Button>
                <Button type="primary"
                        v-if="formData.boResultStatus == 7 || formData.boResultStatus == 9"
                        size="small"
                        v-permission="['edit']"
                        @click="cancelMainExam">取消主检</Button>
                <Button type="primary"
                        v-else
                        :loading="loading"
                        size="small"
                        v-permission="['edit']"
                        @click="saveMainExam">保存主检</Button>

              </div>
              </Col>
            </Row>

          </div>
        </div>
        <div class="not-check-item"
             style="margin-top:12px;">
          <div class="title-container">
            <span class="title">未检项目</span>
            <div class="color">
              <div class="block-color">
                <div class="block-item">未检:<span style="background-color: #2d8cf0;"></span></div>
                <div class="block-item">拒检:<span style="background-color: #ed4014;"></span></div>
                <div class="block-item">等待报告:<span style="background-color: #ff9900;"></span></div>

              </div>
            </div>
          </div>
          <div class="uncheckedItems-list">
            <ul>
              <li v-for="(item, index) in uncheckedItems"
                  :key="index">
                <Tag color="primary"
                     v-if="item.boiscompleted == 0">{{ item.bocomboname }}</Tag>
                <Tag color="error"
                     v-if="item.boiscompleted == 2">{{ item.bocomboname }}</Tag>
                <Tag color="warning"
                     v-if="item.boiscompleted == 4">{{ item.bocomboname }}</Tag>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="main-exam-footer-wrapper">
      <div class="footer-info">
        <div class="left-side">
          <span class="pre-title">主检结论</span>
          <Select v-model="conclusionId"
                  :label-in-value="true"
                  filterable
                  style="width: 140px;"
                  @on-change="conclusionChange"
                  clearable
                  size="small">
            <Option v-for="item in conclusionList"
                    :value="item.sdId"
                    :label="item.sdName"
                    :key="item.sdId">{{ item.sdName }}</Option>
          </Select>
        </div>
        <div class="right-side">
          <div class="footer-item">
            <span class="pre-title">主检医生</span>
            <Input v-model="mainExamDoctorName"
                   size="small"
                   style="width: 200px"
                   disabled />
          </div>
          <!-- <div class="footer-item">
          <span class="pre-title">主检医生</span>
          <Input v-model="mainExamDoctorName"
                 size="small"
                 style="width: 200px"
                 v-if="formData.boResultStatus == 7"
                 :disabled="formData.boResultStatus == 7" />
          <Select v-else
                  v-model="mainExamDoctorId"
                  :label-in-value="true"
                  filterable
                  @on-change="mainExamDoctorChange"
                  size="small">
            <Option v-for="item in mainExamDoctorList"
                    :value="item.doctorId"
                    :label="item.doctorName"
                    :key="item.doctorId">{{ item.doctorName }}</Option>
          </Select>
        </div>
        <div class="footer-item">
          <span class="pre-title">操作员</span>
          <Input v-model="operator"
                 disabled
                 size="small" />
        </div> -->
          <div class="footer-item">
            <span class="pre-title">主检日期</span>
            <DatePicker v-model="examDate"
                        :value="examDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        placement="top-start"
                        size="small"
                        placeholder="请选择日期"></DatePicker>
          </div>
        </div>
      </div>
    </div>

    <info :visible="searchVisible"
          ref="search"
          @handleReset="handleReset"
          @getPatientInfo="checkMainExamRecord"
          @close="searchVisible = false">
      <!-- <div class="silde-btn" @click="searchVisible = true">
        <Icon type="ios-arrow-back" class="slide-icon"/>
      </div> -->
    </info>
    <summarize :visible="summarizeModalVisible"
               :name="formData.boName"
               :peId="formData.boPeId"
               :sex="formData.boSex"
               :visit="formData.boVisitSn"
               ref="summarize"
               @close="summarizeModalVisible = false"></summarize>
    <Edit :visible="editModalVisible"
          @func1="changeReviewValue"
          :inputValue="inputVal"
          ref="editwrapper"
          :disabled="revModalInputStatus"
          @close="closeEditModal"></Edit>
    <Edit2 :visible="editModalVisible2"
           @func2="changeSugeestValue"
           :inputValue="inputVal2"
           ref="editwrapper2"
           :disabled="sugModalInputStatus"
           @close="closeEditModal2"></Edit2>
    <Science :visible="scienceModalVisible"
             ref="science"
             :status="formData.boResultStatus"
             :inputValue="newScience"
             @func3="changeScienceValue"
             @close="scienceModalVisible = false"></Science>
    <disease-suggest :visible="diseaseSuggestVisible"
                     ref="diseaseSuggest"
                     @getDiseaseSuggest="getSuggest"
                     @close="diseaseSuggestVisible = false"></disease-suggest>
    <VueContextMenu class="right-menu"
                    ref="vueContextMenu"
                    :target="contextMenuTarget"
                    :show="contextMenuVisible"
                    @update:show="showRightMenu">
      <div class="menu-item"
           @click="rightMenuSearchDiseaseSuggest()">
        <div class="right-menu-cont">
          <Icon type="md-search"
                style="margin-top: -1px"
                size="14" />
          <span class="cont">快速搜索疾病“{{quickSearchWord}}”</span>
        </div>
      </div>
      <div class="menu-item"
           @click="copyData()">
        <div class="right-menu-cont">
          <Icon type="ios-copy"
                style="margin-top: -1px"
                size="14" />
          <span class="cont">复制</span>
        </div>
        <div class="right-menu-desc">Ctrl + C</div>
      </div>
      <div class="menu-item"
           @click="parseData()">
        <div class="right-menu-cont">
          <Icon type="md-copy"
                style="margin-top: -1px"
                size="14" />
          <span class="cont">粘贴</span>
        </div>
        <div class="right-menu-desc">Ctrl + V</div>
      </div>
      <div class="menu-item"
           @click="openDiseaseAdviceModal()">
        <div class="right-menu-cont">
          <Icon type="md-add-circle"
                style="margin-top: -1px"
                size="14" />
          <span class="cont">添加选中文字为疾病建议模板</span>
        </div>
        <div class="right-menu-desc"></div>
      </div>
    </VueContextMenu>
    <!-- 右键菜单弹窗 start -->
    <QuickSearch :visible="quickSearchVisible"
                 ref="quickSearchWrapper"
                 @upDateData="quickSuggestAndKnowledge"
                 @close="quickSearchVisible = false"></QuickSearch>
    <AddDisease :title="0"
                :visible="diseaseAdviceVisible"
                ref="diseaseAdviceWrapper"
                :ICD10Name="curICD10Name"
                :ICD10Id="curICD10Id"
                :ICD10Code="curICD10Code"
                @openICD10List="openICD10List"
                @close="closeDiseaseAdviceModal"></AddDisease>
    <Icd10-list :visible="ICD10Visible"
                @cancel="ICD10Unselected"
                @selected="ICD10Selected"
                @getICD10Name="getICD10Name"
                @close="closeICD10Modal"></Icd10-list>
  </div>
</template>
<script>
import {
  mainExamBasicInfoList,
  deptResultDetailsList,
  chiefDiagnosisSave,
  getPicPort,
  cancelMainInspection,
  reportPrint
} from '@/api/mainExam.js'
import { PatientMsgByRegisterCode } from '@/api/record_result'
import {
  printNotice,
  printMethods
} from '@/components/main/components/printer-modal/index.js'
import moment from 'moment'
import Edit from './edit'
import Edit2 from './edit2'
import Info from './search'
import Diagnosis from './diagnosis'
import Summarize from './summarize'
import Science from './science'
import DiseaseSuggest from './diseaseSuggest'
import QuickSearch from '../components/quickSearch'
import { component as VueContextMenu } from '@xunlei/vue-context-menu'
import { mapActions } from 'vuex'
import { setAutoClearStorage, getAutoClearStorage, setFoldSettingLocalstorage, getFoldSettingLocalstorage, getPrinterConfigFromLocalstorage } from '@/libs/util.js'
import AddDisease from '../components/addDisease'
import Icd10List from '../components/ICD10List'

export default {
  name: 'mainInspection',
  components: {
    Edit,
    Edit2,
    Diagnosis,
    Info,
    Summarize,
    Science,
    DiseaseSuggest,
    VueContextMenu,
    QuickSearch,
    Icd10List,
    AddDisease
  },
  data () {
    return {
      contextMenuTarget: null,
      contextMenuVisible: false,
      quickSearchVisible: false, // 快速搜索弹窗开关
      curSelectElement: null, // 当前右键菜单点击的元素
      quickSearchWord: '',
      basicInfo: {},
      formData: {},
      foldForm: {
        isFold: false
      },
      diagnosticCols: [
        // {
        //   title: '序号',
        //   minWidth: 60,
        //   type: 'template',
        //   template: 'inSort'
        // },
        {
          title: '科室',
          key: 'deptName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '诊断项目',
          key: 'itemName',
          type: 'template',
          template: 'itemName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '数值',
          key: 'answer',
          type: 'template',
          template: 'answer',
          minWidth: 70,
          align: 'center'
        },
        {
          title: '对照范围',
          key: 'reference',
          type: 'template',
          template: 'reference',
          minWidth: 90,
          align: 'center'
        },
        {
          title: '结论',
          key: 'result',
          type: 'template',
          template: 'result',
          minWidth: 100,
          align: 'center'
        }
        // {
        //   title: '操作',
        //   slot: 'action',
        //   fixed: 'right',
        //   minWidth: 120,
        //   align: 'center'
        // }
      ],
      diagnosticTableData: [],
      deptResultCols: [
        {
          title: '序号',
          width: 50,
          key: 'inSort',
          align: 'center'
        },
        {
          title: '检查科室',
          key: 'inDeptName',
          minWidth: 90,
          align: 'center'
        },
        {
          title: '项目组合',
          key: 'inComboName',
          slot: 'inComboName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '体检医生',
          key: 'inExamDoctorName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '科室小结',
          width: 150,
          ellipsis: true,
          align: 'center',
          key: 'inConclusion',
          render: (h, params) => {
            let texts = ''
            if (params.row.inConclusion && params.row.inConclusion !== null) {
              // console.log(params.row.inConclusion)
              if (params.row.inConclusion.length > 10) {
                texts = params.row.inConclusion.substring(0, 10) + '...'
              } else {
                texts = params.row.inConclusion
              }
            }
            return h(
              'Tooltip',
              {
                props: {
                  placement: 'top',
                  transfer: true
                }
              },
              [
                texts,
                h(
                  'span',
                  {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all'
                    }
                  },
                  params.row.inConclusion
                )
              ]
            )
          }
        },
        {
          title: '科室建议',
          width: 200,
          ellipsis: true,
          align: 'center',
          key: 'inSuggestion',
          render: (h, params) => {
            let texts = ''
            if (params.row.inSuggestion && params.row.inSuggestion !== null) {
              // console.log(params.row.inSuggestion)
              if (params.row.inSuggestion.length > 10) {
                texts = params.row.inSuggestion.substring(0, 10) + '...'
              } else {
                texts = params.row.inSuggestion
              }
              return h(
                'Tooltip',
                {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  texts,
                  h(
                    'span',
                    {
                      slot: 'content',
                      style: {
                        whiteSpace: 'normal',
                        wordBreak: 'break-all'
                      }
                    },
                    params.row.inSuggestion
                  )
                ]
              )
            } else {
              texts = '无'
              return h(
                'span',
                {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-all'
                  }
                },
                texts
              )
            }
          }
        }
      ],
      diagnosticRecordCols: [
        {
          title: '序号',
          width: 65,
          key: 'inSort',
          align: 'center'
        },
        {
          title: '检查科室',
          key: 'inDeptName',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '体检医生',
          key: 'inExamDoctorName',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '诊断记录',
          key: 'inDiagnosisList',
          type: 'html',
          tooltip: true,
          minWidth: 120,
          align: 'center'
        }
      ],
      historyDiagnosticCols: [
        {
          title: '序号',
          minWidth: 120,
          key: 'inSort',
          type: 'template',
          template: 'inSort'
        },
        {
          title: '检查科室',
          key: 'inDeptName',
          type: 'template',
          minWidth: 90,
          template: 'inDeptName'
        },
        {
          title: '体检医生',
          key: 'inExamDoctorName',
          type: 'template',
          minWidth: 100,
          template: 'inExamDoctorName'
        },
        {
          title: '科室小结',
          key: 'inSuggestion',
          type: 'template',
          minWidth: 110,
          tooltip: true,
          template: 'inSuggestion'
        },
        {
          title: '科室建议',
          minWidth: 110,
          key: 'inConclusion',
          type: 'template',
          tooltip: true,
          template: 'inConclusion'
        }
      ],
      diagnosticRecordTableData: [],
      editIndex: -1, // 当前聚焦的输入框的行数
      editNum: '', // 当然聚焦数值的输入框的输入内容
      editResult: '', // 当然聚焦数值的输入框的输入内容
      imgUrl: '',
      deptResultTableData: [],
      disabled: false, // 输入框输入状态
      review: [], // 综述内容,
      suggest: [],
      editModalVisible: false,
      editModalVisible2: false,
      modalVisible: false,
      diagnosisVisible: false, // 添加诊断弹出框
      // deptRecords: false, // 科室小结和科室建议弹出框
      deptSummary: '科室小结内容',
      deptSuggest: '科室建议内容',
      uncheckedItems: [], // 未检项目
      comboIdList: [], // 未检项目对应的id
      searchVisible: false,
      newReview: '', // 新填入综述信息
      newSuggest: '', // 新填入建议信息
      operator: '',
      examDate: '',
      loading: false,
      historyTableData: [], // 历史诊断数据
      emptyText: '暂无数据',
      appendResultId: '',
      summarizeModalVisible: false, // 历史综述窗口
      visitId: '', // 取消总检时需要传的参数
      doctorId: '', // 总检医生id
      doctorName: '', // 总检医生姓名
      mainExamDoctorId: '', // 主检医生id
      mainExamDoctorName: '', // 主检医生姓名
      registerCode: '', // 登记流水号(中间变量，用于清空流水号后的其他需要流水号的操作)
      inputVal: '', // 综述弹出框的内容
      inputVal2: '', // 建议弹出框的内容
      otherInfo: {}, // 其他信息
      diagnosticRecords: [], // 诊断明细数据
      historyRecords: [], // 诊断历史数据
      spinShow: false,
      reportLoading: false,
      scienceModalVisible: false,
      diseaseSuggestVisible: false,
      science: [], // 科普信息
      newScience: '', // 新填入科普信息,
      suggestModalOpen: false,
      reviewModalOpen: false,
      isMainInspectionExamAutoClear: false, // 保存是否清空
      sugModalInputStatus: false, //
      revModalInputStatus: false, //
      patientInfo: {}, // 病人信息
      conclusionId: '', // 总检结论id
      conclusionName: '',  // 总检结论名称
      diseaseAdviceVisible: false, // 新增疾病建议弹窗开关
      ICD10Visible: false, // ICD10 弹窗开关
      curICD10Id: '', // 当前选中ICD10 id
      curICD10Code: '',
      curICD10Name: '',
    }
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
    receiverList: {
      get: function () {
        return this.$store.getters.getFinExamDoctorDict
      },
      set: function () { }
    },
    mainExamDoctorList: {
      get: function () {
        return this.$store.getters.getMainExamDoctorDict
      },
      set: function () { }
    },
    conclusionList: {
      get: function () {
        return this.$store.getters.getMainConclusionDict
      },
      set: function () { }
    }
  },
  created () {
    // 获取是否展开诊断明细配置
    let setting = getFoldSettingLocalstorage()
    if (Object.keys(setting).length > 0) {
      this.foldForm = setting
      this.$nextTick(() => {
        if (this.foldForm.isFold) {
          this.$refs.xTree.setAllTreeExpansion(true)
        } else {
          this.$refs.xTree.clearTreeExpand()
        }
      })
    } else {
      this.$set(this.foldForm, 'isFold', true)
      this.$nextTick(() => {
        this.$refs.xTree.setAllTreeExpansion(true)
      })
    }
  },
  mounted () {
    this.contextMenuTarget = document.getElementById('rightMenu');
    // 监听右键点击的位置
    let that = this;
    window.document.oncontextmenu = function (e) {
      that.curSelectElement = e.target
    }

    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
    this.$store.dispatch('getMainConclusionDict')
    // console.log(this.$router.currentRoute.meta.authority)
    // console.log(this.userInfo);
    let mainDoctorParams = {
      deptName: '主检医生',
      deptId: ''
    }
    this.getExamDoctorDict({ params: { deptName: '主检医生', deptId: '' }, btn: true }).then(res => {
      let result = this.mainExamDoctorList.some(item => {
        return item.doctorId == this.userInfo.userId
      })
      if (result) {
        this.mainExamDoctorId = this.userInfo.userId
        this.mainExamDoctorName = this.userInfo.poName
      } else {
        this.mainExamDoctorId = ''
        this.mainExamDoctorName = ''
      }
    })

    let params = {
      deptName: '总检医生',
      deptId: ''
    }
    this.$store
      .dispatch('getExamDoctorDict', { params, btn: true })
      .then(res => {
        // console.log(this.receiverList)
        let result = this.receiverList.some(item => {
          // console.log(item)
          return item.doctorId == this.userInfo.userId
        })
        // console.log(result)
        if (result) {
          this.doctorId = this.userInfo.userId
          this.doctorName = this.userInfo.poName
        } else {
          this.doctorId = ''
          this.doctorName = ''
        }
      })
    // this.doctorId = this.userInfo.poId;

    // this.doctorName = this.userInfo.poName;
    this.operator = this.userInfo.poName
    this.examDate = moment().format('YYYY-MM-DD HH:mm')
    // console.log(this.doctorId)
    // 查看locaStorage里是否存有设置
    let isConfig = getAutoClearStorage()
    if (!isConfig.isMainInspectionExamAutoClear) {
      setAutoClearStorage({ isMainInspectionExamAutoClear: this.isMainInspectionExamAutoClear })
    } else {
      this.isMainInspectionExamAutoClear = isConfig.isMainInspectionExamAutoClear
    }
  },
  destroyed () {
    window.document.oncontextmenu = null
  },
  methods: {
    ...mapActions(['getExamDoctorDict']),
    deleteData (row, index) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          this.diagnosticTableData.splice(index, 1)
          // console.log(this.diagnosticTableData)
        },
        onCancel: () => { }
      })
    },

    // 点击编辑表格内容
    handleEdit (row, index) {
      this.editIndex = index
      this.editNum = row.answer
      this.editResult = row.result
    },

    // 保存表格编辑内容
    handleSave (index) {
      this.diagnosticTableData[index].answer = this.editNum
      this.diagnosticTableData[index].result = this.editResult
      // console.log(this.diagnosticTableData)
      this.$set(
        this.diagnosticTableData,
        index,
        this.diagnosticTableData[index]
      )
      this.editIndex = -1
    },
    // 展开收起配置
    foldSetting () {
      if (this.foldForm.isFold) {
        this.$refs.xTree.setAllTreeExpansion(true)
      } else {
        this.$refs.xTree.clearTreeExpand()
      }
      setFoldSettingLocalstorage(this.foldForm)
    },
    // 打开添加诊断弹框
    openDiagnosis (visible) {
      this.diagnosisVisible = visible
      this.modalVisible = false
    },
    // 添加诊断弹框点击确定后，返回诊断明细
    diagnosisAdded (diagnosisVisible) {
      this.diagnosisVisible = diagnosisVisible
      this.modalVisible = true
    },
    // 添加诊断弹框点击取消后，返回诊断明细
    closeDiagnosis (diagnosisVisible) {
      this.diagnosisVisible = diagnosisVisible
      this.modalVisible = true
    },
    // 检查用户是否存在总检记录
    checkMainExamRecord (val) {
      let params = {
        boPeId: val.boPeId,
        boVisitSn: val.boVisitSn,
        boName: val.boName
      }
      this.patientInfo = val
      this.spinShow = true
      deptResultDetailsList(params).then(({ data }) => {
        this.spinShow = false
        if (data.code == 0) {
          let result = data.data
          let len = result.data.length
          let otherInfo = null
          // 诊断记录数据
          otherInfo = { ...result.data[len - 1] }
          if (otherInfo.isMain == '0' || val.boResultStatus == '0' || val.boResultStatus == '9') {
            this.getInfo(val, '')
          } else {
            this.$Modal.confirm({
              title: '提示',
              content: '该客户已保存过主检，\n是否重新生成综述、建议、科普数据？',
              cancelText: '重新生成',
              okText: '保留原始数据',
              onOk: () => {
                this.getInfo(val, '0')
              },
              onCancel: () => {
                this.getInfo(val, '1')
              }
            })
          }
        }
      }).catch(err => {
        this.spinShow = false
        console.log(err)
        this.$Message.error('连接超时，请稍后重试')
      })
    },
    getInfo (val, btn) {
      // console.log(val)
      let params = {
        boPeId: val.boPeId,
        boVisitSn: val.boVisitSn,
        boName: val.boName,
        isDeleteOldData: btn || ''
      }
      this.visitId = val.visitId
      let basicInfo = Object.assign({}, val)
      this.formData = {
        boResultStatus: basicInfo.boResultStatus,
        boPeId: basicInfo.boPeId,
        boVisitSn: basicInfo.boVisitSn,
        boName: basicInfo.boName,
        boCategory: basicInfo.boCategory,
        boSex: basicInfo.boSex,
        boAge: basicInfo.boAge,
        boUnitName: basicInfo.boUnitName,
        boPackageName: basicInfo.boPackageName
          ? basicInfo.boPackageName
          : '暂无套餐',
        registerCode: basicInfo.boRegisterCode,
        boResultStatus: basicInfo.boResultStatus
      }
      this.registerCode = basicInfo.boRegisterCode
      // console.log(this.formData)
      this.setPageInfo(params)
    },

    // 设置页面信息
    setPageInfo (params) {
      // console.log('params=>', params)
      this.spinShow = true
      deptResultDetailsList(params)
        .then(({ data }) => {
          // console.log(data)
          this.spinShow = false
          if (data.code == 0) {
            let result = data.data

            // 诊断记录数据
            let arr = result.data.filter(item => {
              return item.inId != -2
            })
            let len = result.data.length
            let otherInfo = null

            this.historyTableData = result.historyData
            this.diagnosticTableData = [...arr]

            this.diagnosticTableData.forEach(item => {
              item.itemName = item.comboName
              delete item.comboName
              if (item.showType == '3') {
                item.answer = (item.lisDoctorName ? '审核者：' + item.lisDoctorName : '')
                item.identification = ''
                item.reference = '检验者：' + item.checkName
              } else {
                item.answer = '操作员：' + item.operatorName
                item.identification = ''
                item.reference = '检查者：' + item.checkName
              }

              delete item.checkName
              item.result = !item.resultDate ? '' : (item.resultDate == 'null') ? '' : moment(item.resultDate).format('YYYY-MM-DD')
              delete item.resultDate
            })
            // console.log(this.diagnosticTableData)
            otherInfo = { ...result.data[len - 1] }

            if (this.historyTableData.length > 0) {
              this.historyTableData.forEach(item => {
                item.inSort = item.date
                delete item.date
                item.children = item.data
                delete item.data
                // item.children.forEach((v, i) => {
                //   v.inSort = i + 1;
                // });
                if (item.children.length > 0) {
                  item.children.forEach((v, i) => {
                    v.inSort = i + 1
                    if (v.inSuggestion && v.inSuggestion.indexOf('<br/>') > 0) {
                      v.inSuggestion = v.inSuggestion.replace(/<br\/>/g, '\n')
                    }
                    if (v.inConclusion && v.inConclusion.indexOf('<br/>') > 0) {
                      v.inConclusion = v.inConclusion.replace(/<br\/>/g, '\n')
                    }
                  })
                } else {
                  item.children.push({
                    inSort: '暂无诊断'
                  })
                }
              })
            }
            // console.log(this.historyTableData)
            this.deptResultTableData = otherInfo.fenke
            this.deptResultTableData.forEach(item => {
              if (item.inSuggestion && item.inSuggestion.indexOf('<br/>') > 0) {
                item.inSuggestion = item.inSuggestion.replace(/<br\/>/g, '\n')
              }
              if (item.inConclusion && item.inConclusion.indexOf('<br/>') > 0) {
                item.inConclusion = item.inConclusion.replace(/<br\/>/g, '\n')
              }
            })

            // 诊断记录
            this.diagnosticRecordTableData = [...otherInfo.fenke].filter(
              item => {
                // 只显示有诊断记录的行
                return item.inDiagnosisList
              }
            )
            this.review = otherInfo.reviewList ? otherInfo.reviewList : []

            // 先置空，后赋值
            this.newReview = ''
            // 综述文本域内容
            this.review.map(item => {
              if (item) {
                this.newReview += `${item.replace(/<br\/>/g, '\n')} `
              }
            })
            // console.log(this.newReview)
            this.suggest = otherInfo.suggestList
            this.newSuggest = ''
            this.suggest.map((item, index) => {
              if (item) {
                this.newSuggest += `${item.replace(/<br\/>/g, '\n')} \n`
              }
            })

            // 科普信息
            this.newScience = ''
            this.science = otherInfo.diseasePopularizationScienceList
            // console.log(this.science)
            this.science.map(item => {
              if (item) {
                this.newScience += `${item.replace(/<br\/>/g, '\n')} `
              }
            })
            // console.log(otherInfo.diseasePopularizationScienceList)

            this.uncheckedItems = otherInfo.comboList ? otherInfo.comboList : []
            this.comboIdList = otherInfo.comboIdList
              ? otherInfo.comboIdList
              : []
            this.imgUrl = otherInfo.inComboId
              ? this.$url + otherInfo.inComboId
              : ''

            this.appendResultId = otherInfo.appendResultId
              ? otherInfo.appendResultId
              : ''
            this.operator = otherInfo.mainAuditName || this.userInfo.poName
            this.examDate = otherInfo.mainAuditDate ? moment(otherInfo.mainAuditDate).format('YYYY-MM-DD HH:mm') : moment().format('YYYY-MM-DD HH:mm')

            // 总检结论
            this.conclusionId = otherInfo.inConclusionId || ''
            // console.log(otherInfo.finalDoctorId)
            // console.log(this.receiverList)
            // 总检医生
            this.doctorId = otherInfo.finalDoctorId
            let flag = this.receiverList.some(item => {
              return (item.doctorId == otherInfo.finalDoctorId || item.doctorId == this.userInfo.userId)
            })
            // console.log(flag)
            if (flag) {
              this.doctorId = otherInfo.finalDoctorId || this.userInfo.userId
              this.doctorName = otherInfo.finalDoctorName || this.userInfo.poName
            } else {
              this.doctorId = ''
              this.doctorName = ''
            }

            // 主检医生
            this.mainExamDoctorId = otherInfo.mainExamDoctorId
            this.mainExamDoctorName = otherInfo.mainExamDoctorName
            let flag2 = this.mainExamDoctorList.some(item => {
              return (item.doctorId == otherInfo.mainExamDoctorId || item.doctorId == this.userInfo.userId)
            })
            if (flag2) {
              this.mainExamDoctorId = otherInfo.mainExamDoctorId || this.userInfo.userId
              this.mainExamDoctorName = otherInfo.mainExamDoctorName || this.userInfo.poName
            } else {
              this.mainExamDoctorId = ''
              this.mainExamDoctorName = ''
            }
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.spinShow = false
          console.log(err)
          this.$Message.error('连接超时，请稍后重试')
        })
    },

    // 修改总检医生
    examDoctorChange (obj) {
      if (obj) {
        // console.log(obj)
        this.doctorName = obj.label
        this.doctorId = obj.value
      }
    },
    mainExamDoctorChange (obj) {
      if (obj) {
        this.mainExamDoctorName = obj.label
        this.mainExamDoctorId = obj.value
      }
    },

    // 修改总检结论
    conclusionChange (obj) {
      if (obj) {
        this.conclusionId = obj.value
        this.conclusionName = obj.label
      }
    },

    // 清空
    handleReset () {
      this.formData = {}
      this.uncheckedItems = []
      this.review = []
      this.newReview = ''
      this.suggest = []
      this.newSuggest = ''
      this.newScience = ''
      this.diagnosticTableData = []
      this.deptResultTableData = []
      this.diagnosticRecordTableData = []
      this.historyTableData = []
      this.imgUrl = ''
      this.registerCode = ''
      // this.doctor = ''
      this.examDate = ''
      // this.operator = ''
      this.visitId = ''
      this.conclusionId = ''
      this.conclusionName = ''
    },
    // 保存总检
    async saveMainExam () {
      if (this.loading) {
        return
      }
      if (!this.mainExamDoctorId) {
        this.$Message.warning('请选择主检医生，再进行保存主检操作')
        return
      }
      if (!this.formData.boPeId && !this.formData.boVisitSn) {
        this.$Message.warning('信息不全，不能保存主检')
        return
      }
      // if (this.diagnosticTableData.length == 0) {
      //   this.$Message.warning("还未进行体检，不能保存总检");
      //   return;
      // }
      let resultList = []
      // console.log(this.diagnosticTableData)
      this.diagnosticTableData.forEach(item => {
        if (item.children) {
          item.children.map((v, i) => {
            resultList.push({
              inComboId: v.inComboId || '',
              inDeptId: v.inDeptId || '',
              inIsInReport: v.inIsInChiefReport || '',
              inItemId: v.inItemId || '',
              answer: v.answer || '',
              result: v.result || '',
              inPeId: this.formData.boPeId,
              inRecContent: v.inContent || '',
              inRecType: v.inRecType || '',
              inRemark: v.itemName,
              inSort: v.inSort || '',
              inSuggestion: '',
              inVisitSn: this.formData.boVisitSn
            })
          })
        }
      })
      // console.log(resultList)
      // this.diagnosticTableData.map((item, i) => {
      //   resultList.push({
      //     inComboId: this.diagnosticTableData[i].inComboId || '',
      //     inDeptId: this.diagnosticTableData[i].inDeptId || '',
      //     inIsInReport: this.diagnosticTableData[i].inIsInChiefReport || '',
      //     inItemId: this.diagnosticTableData[i].inItemId || '',
      //     answer: this.diagnosticTableData[i].answer || '',
      //     result: this.diagnosticTableData[i].result || '',
      //     inPeId: this.formData.boPeId,
      //     inRecContent: this.diagnosticTableData[i].inContent || '',
      //     inRecType: this.diagnosticTableData[i].inRecType || '',
      //     inRemark: this.diagnosticTableData[i].itemName,
      //     inSort: this.diagnosticTableData[i].inSort || '',
      //     inSuggestion: '',
      //     inVisitSn: this.formData.boVisitSn
      //   })
      // })

      let params = {
        inInputContent: {
          inContent: this.newReview, // 综述
          inRemark: this.newSuggest, // 建议
          inDiseasePopularizationScience: this.newScience // 科普
        },
        resultList: resultList,
        comboIdList: this.comboIdList,
        appendResultId: this.appendResultId,
        doctorName: null,
        doctorId: null,
        mainExamDoctorId: this.mainExamDoctorId,
        mainExamDoctorName: this.mainExamDoctorName,
        mainOperatorDate: moment(this.examDate).format('YYYY-MM-DD HH:mm:ss'),
        conclusionId: this.conclusionId,
        conclusionName: this.conclusionName
      }
      const setting = getPrinterConfigFromLocalstorage()

      if (this.uncheckedItems.length > 0 && (!setting.hasOwnProperty('mainExamTipFlag') || setting.mainExamTipFlag)) {
        this.$Modal.confirm({
          title: '提示',
          content: '还有未体检项目，是否继续保存主检',
          onOk: async () => {
            try {
              // 发送请求
              this.loading = true
              this.spinShow = true
              let type = 1 // type: 1为主检，2为总检
              const { data } = await chiefDiagnosisSave(params, type)
              // console.log(data)
              this.loading = false
              this.spinShow = false
              if (data.code == 0) {
                this.$Message.success('保存成功')
                this.$set(this.formData, 'boResultStatus', 7)
                if (this.isMainInspectionExamAutoClear) {
                  this.handleReset()
                } else {
                  let param = {
                    boPeId: this.formData.boPeId,
                    boVisitSn: this.formData.boVisitSn,
                    boName: this.formData.boName
                  }
                  this.setPageInfo(param)
                }
                // console.log(this.newReview)
                //
                this.$refs.search.handleSearch()
              } else {
                this.$Message.error(data.message)
              }
            } catch (err) {
              console.log('网络错误', err)
              this.loading = false
              this.spinShow = false
            } finally {
              // 登记流水号输入框聚焦
              this.$refs.inputFocus.focus()
            }
          },
          onCancel: () => { }
        })
      } else {
        try {
          // 发送请求
          this.loading = true
          this.spinShow = true
          let type = 1 // type: 1为主检，2为总检
          const { data } = await chiefDiagnosisSave(params, type)
          console.log(data)
          this.loading = false
          this.spinShow = false
          if (data.code == 0) {
            this.$Message.success('保存成功')
            this.$set(this.formData, 'boResultStatus', 7)
            if (this.isMainInspectionExamAutoClear) {
              this.handleReset()
            } else {
              let param = {
                boPeId: this.formData.boPeId,
                boVisitSn: this.formData.boVisitSn,
                boName: this.formData.boName
              }
              this.setPageInfo(param)
            }

            this.$refs.search.handleSearch()
          } else {
            this.$Message.error(data.message)
          }
        } catch (err) {
          console.log('网络错误', err)
          this.loading = false
          this.spinShow = false
        } finally {
          // this.handleReset()
          this.$refs.inputFocus.focus()
        }
      }
    },

    // 取消总检
    cancelMainExam () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否取消主检？',
        onOk: () => {
          let params = {
            visitId: this.visitId
          }
          cancelMainInspection(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$Message.success('操作成功')
                this.$set(this.formData, 'boResultStatus', 3)
                // 清除之前的主检医生，换成当前登录医生
                let flag2 = this.mainExamDoctorList.some(item => {
                  return (item.doctorId == this.userInfo.userId)
                })
                if (flag2) {
                  this.mainExamDoctorId = this.userInfo.userId
                  this.mainExamDoctorName = this.userInfo.poName
                } else {
                  this.mainExamDoctorId = ''
                  this.mainExamDoctorName = ''
                }
                this.$refs.search.handleSearch()
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.$Message.error('网络不稳定，请稍后重试')
            })
        },
        onCancel: () => { }
      })
    },

    // 体检报告
    applyPrint () {
      if (!printNotice()) return false
      let params = [
        {
          inPeId: this.formData.boPeId,
          inVisitSn: this.formData.boVisitSn,
          inRegisterCode: this.registerCode
        }
      ]
      if (this.patientInfo && this.patientInfo.printDate) {
        this.$Modal.confirm({
          title: '提示',
          content: `该病人已于${moment(this.patientInfo.printDate).format('YYYY-MM-DD HH:mm:ss')}打印报告，是否再次打印？`,
          onOk: () => {
            this.reportLoading = true
            reportPrint(params)
              .then(({ data }) => {
                // console.log(data);
                this.reportLoading = false
                if (data.code == 0) {
                  let printParams = {
                    guideUrl: this.$url + data.data,
                    selGroup: ['printGuide'],
                    taskName: '体检报告'
                  }
                  printMethods(printParams.guideUrl, printParams)
                } else {
                  this.$Message.error(data.message)
                }
              })
              .catch(err => {
                this.$Message.error('网络不稳定，请稍后重试')
                this.reportLoading = false
              })
          },
          onCancel: () => { }
        })
      } else {
        this.reportLoading = true
        reportPrint(params)
          .then(({ data }) => {
            // console.log(data);
            this.reportLoading = false
            if (data.code == 0) {
              let printParams = {
                guideUrl: this.$url + data.data,
                selGroup: ['printGuide'],
                taskName: '体检报告'
              }
              printMethods(printParams.guideUrl, printParams)
            } else {
              this.$Message.error(data.message)
            }
          })
          .catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
            this.reportLoading = false
          })
      }
    },

    // 影像报告
    getPicReport () {
      if (!this.formData.boPeId) {
        this.$Message.warning('请先选择病人，再进行操作')
        return false
      }
      if (!printNotice()) return false
      let params = {
        inPeId: this.formData.boPeId,
        inVisitSn: this.formData.boVisitSn,
        inRegisterCode: this.registerCode
      }
      getPicPort(params)
        .then(({ data }) => {
          if (data.code == 0) {
            let printParams = {
              guideUrl: this.$url + data.data,
              selGroup: ['printGuide'],
              taskName: '影像报告'
            }
            printMethods(printParams.guideUrl, printParams)
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.$Message.error('网络不稳定，请稍后重试')
        })
      // console.log(params);
    },

    // 历史综述
    openHistorySummarize () {
      // console.log("历史综述");
      this.summarizeModalVisible = true
      this.$refs.summarize.getList()
    },

    // 根据流水号查询病人信息
    async getPatientByRegisterCode () {
      let params = {
        boRegisterCode: this.formData.registerCode
      }
      let pagination = {
        page: 1,
        size: 20
      }
      this.spinShow = true
      try {
        const { data } = await mainExamBasicInfoList(pagination, params)
        this.spinShow = false
        // console.log(data)
        if (data.code == 0) {
          let result = data.data.records[0]
          this.checkMainExamRecord(result)
          this.registerCode = this.formData.registerCode
          // this.$set(this.formData, 'registerCode', '')
        }
      } catch (err) {
        this.spinShow = false
      }
    },

    closeEditModal () {
      this.editModalVisible = false
      this.reviewModalOpen = false
    },

    closeEditModal2 () {
      this.editModalVisible2 = false
      this.suggestModalOpen = false
    },

    handleDbClickReview () {
      // console.log('双击综述')
      // if (this.formData.boResultStatus == 9 ) {
      //   return false
      // }
      this.revModalInputStatus = this.formData.boResultStatus == 7
      this.editModalVisible = true
      this.reviewModalOpen = true
      this.inputVal = this.newReview
    },

    changeReviewValue (val) {
      // console.log(val)
      this.newReview = val
    },

    changeSugeestValue (val) {
      this.newSuggest = val
    },

    changeScienceValue (val) {
      this.newScience = val
    },

    handleDbClickSuggest () {
      // console.log(this.formData.boResultStatus == 9)
      // console.log('双击建议')
      // if (this.formData.boResultStatus == 9) {
      //   return false
      // }
      // console.log(this.formData)
      this.sugModalInputStatus = this.formData.boResultStatus == 7
      this.editModalVisible2 = true
      this.suggestModalOpen = true
      this.inputVal2 = this.newSuggest
    },

    changeTableClass (row, index) {
      if (row.identification && row.identification !== 'z') {
        return 'active-table-row'
      }
    },

    openScienceModal () {
      this.scienceModalVisible = true
    },

    openDiseaseSuggest () {
      this.diseaseSuggestVisible = true
      this.$nextTick(() => {
        this.$refs.diseaseSuggest.curActive == 'all'
      })
    },
    // 打开右键菜单
    showRightMenu (show) {
      const words = window.getSelection().toString()
      if (words) this.quickSearchWord = words

      return this.contextMenuVisible = show
    },

    // 右键快速搜索疾病建议及科普
    rightMenuSearchDiseaseSuggest () {
      this.quickSearchVisible = true
      this.$nextTick(() => {
        this.$refs.quickSearchWrapper.curActive == 'all'
      })
      this.$refs.quickSearchWrapper.init(this.quickSearchWord)
    },

    // 右键复制
    copyData () {
      let input = document.createElement('input')
      input.setAttribute('readonly', 'readonly') // 防止手机上弹出软键盘
      input.setAttribute('value', this.quickSearchWord)
      document.body.appendChild(input)
      input.select()
      const res = document.execCommand('copy')
      document.body.removeChild(input)
      this.contextMenuVisible = false
    },

    // 右键粘贴
    parseData () {
      if (this.curSelectElement.type === 'text' || this.curSelectElement.type === 'textarea') {
        this.$nextTick(() => {
          this.curSelectElement.focus()
          this.curSelectElement.value += this.quickSearchWord
          this.curSelectElement.dispatchEvent(new Event('input'))
          this.contextMenuVisible = false
        })
      }
    },

    // 右键快速填写疾病建议及科普
    quickSuggestAndKnowledge (obj) {
      this.newSuggest = obj.suggestCont + this.newSuggest
      this.newScience = obj.knowledgeCont + this.newScience
    },

    getSuggest (val) {
      this.newSuggest =
        '*' + val.diseaseName + '：' + (val.cdSuggestion ? val.cdSuggestion : '') + '\n' + this.newSuggest
    },

    diagnosticStyle (row, rowIndex) {
      if (row.rowLevel == 0) {
        return 'table-info-cell-parent'
      } else {
        return ''
      }
    },

    autoClearChange (status) {
      // console.log(this.isMainExamAutoClear)
      setAutoClearStorage({ isMainInspectionExamAutoClear: this.isMainInspectionExamAutoClear })
    },

    // 新增疾病建议弹窗
    openDiseaseAdviceModal () {
      this.diseaseAdviceVisible = true
      this.curICD10Name = ''
      this.curICD10Id = ''
      this.$nextTick(() => {
        this.$refs.diseaseAdviceWrapper.getItemList({}, this.quickSearchWord)
      })
    },

    // 关闭疾病建议新增框, 并清空框的疾病名称的数据
    closeDiseaseAdviceModal () {
      this.diseaseAdviceVisible = false
      this.curICD10Id = ''
      this.curICD10Code = ''
    },

    // 点击取消，关闭ICD10列表框，返回编辑框
    ICD10Unselected () {
      this.ICD10Visible = false
      this.diseaseAdviceVisible = true
      this.curICD10Name = ''
      this.curICD10Id = ''
      this.curICD10Code = ''
    },
    // 点击选择，关闭ICD10列表框，打开编辑框
    ICD10Selected (visible) {
      this.ICD10Visible = visible
      this.diseaseAdviceVisible = true
    },
    // 获取选中的疾病名称
    getICD10Name (val) {
      console.log(val)
      this.curICD10Name = val.curICD10Name
      this.curICD10Id = val.curICD10Id
      this.curICD10Code = val.curICDCode
    },
    // 打开ICD10列表对话框，关闭编辑框
    openICD10List (visible) {
      this.ICD10Visible = visible
      this.diseaseAdviceVisible = false
    },
    closeICD10Modal () {
      this.ICD10Visible = false,
        this.diseaseAdviceVisible = true
    }
  }
}
</script>
<style lang="less">
.main-exam-wrapper {
  width: 100%;
  height: inherit;
  position: relative;
  min-width: 1200px;
  .main-exam-top-wrapper {
    height: 95%;
    display: flex;
    box-sizing: border-box;
    .title-container {
      height: 40px;
      padding-left: 20px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
    }
    .left-box {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding-bottom: 8px;
      .basic-info {
        margin-bottom: 8px;
        background-color: #fff;
        border-radius: 4px;
        color: #333;
        border: 1px solid #dcdee2;
        border-color: #e8eaec;
        transition: all 0.2s ease-in-out;
        &:hover {
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          border-color: #eee;
        }
        .basic-info-main {
          display: flex;
          justify-content: flex-start;
          height: calc(~'100% - 42px');
          padding: 15px 20px;
          box-sizing: border-box;
          .basic-info-body-pic {
            width: 90px;
            margin-right: 0px;
            border-radius: 4px;
            // border: 1px solid rgba(187, 187, 187, 1);
            overflow: hidden;
            img {
              width: 100%;
              height: auto;
            }
          }
          .basic-info-body-input {
            display: flex;
            flex: 1;
            flex-direction: column;
            .info-item {
              width: 100%;
              display: flex;
              .ivu-form-item {
                width: 50%;
                margin-bottom: 15px !important;
                margin-right: 10px;
                height: 25px;
              }
            }
          }
        }
      }

      .records-info {
        height: calc(~'100% - 192px');
        .ivu-card {
          height: 100%;
        }
        .ivu-tabs {
          overflow-y: auto;
        }
        .zk-table__body-wrapper {
          height: 420px !important;
        }
        .zk-table--empty-row {
          height: 420px;
        }
        .zk-table__cell-inner {
          // color: #515a6e;
          text-align: left;
        }
        .zk-table .table-info-cell-parent {
          font-weight: 600;
          background-color: #ebf7ff;
        }
        .vxe-table {
          color: #252525;
        }
        .table-info-cell-parent {
          font-weight: 600;
          background-color: #ebf7ff;
        }
        .active-table-row {
          color: #ed4014;
        }
      }
    }
    .right-box {
      flex: 1;
      min-width: 780px;
      margin-left: 12px;
      display: flex;
      height: 100%;
      flex-direction: column;
      box-sizing: border-box;
      padding-bottom: 10px;
      .result-container {
        width: 100%;
        height: 700px;
        background-color: #fff;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        border: 1px solid #dcdee2;
        border-color: #e8eaec;
        transition: all 0.2s ease-in-out;
        &:hover {
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          border-color: #eee;
        }
        .summarize,
        .suggest {
          width: 100%;
          height: 320px;
        }
        .content-container {
          padding: 10px;
          box-sizing: border-box;
          .content {
            opacity: 0.6;
            width: 100%;
            height: 100px;
            font-size: 14px;
            color: #333;
            overflow-y: auto;
            background-color: #f3f3f3;
            padding: 5px 10px 0;
            margin-bottom: 5px;
          }
          .textarea {
            width: 100%;
            display: flex;
            flex-direction: column;
            line-height: 2;
            padding-top: 10px;
            .ivu-input {
              resize: none;
            }
          }
        }

        .suggest {
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        .btn-box {
          flex: 1;
          // display: flex;
          // justify-content: space-between;
          // align-items: center;
          line-height: 50px;
          padding: 0 20px;
          .left-btn {
            min-width: 500px;
          }
          .right-btn {
            min-width: 150px;
          }
        }
      }
      .title-container {
        height: 40px;
        padding-left: 20px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .not-check-item {
        height: 130px;
        background-color: #fff;
        border: 1px solid #dcdee2;
        border-color: #e8eaec;
        transition: all 0.2s ease-in-out;
        box-sizing: border-box;
        &:hover {
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          border-color: #eee;
        }
        .uncheckedItems-list {
          height: calc(~'100% - 40px');
          padding: 0 10px;
          overflow-y: auto;
          box-sizing: border-box;
          li {
            float: left;
            margin: 5px;
            .ivu-tag {
              height: 25px;
              line-height: 25px;
              padding: 0 10px;
              font-size: 12px;
              box-sizing: border-box;
            }
          }
        }
      }
    }
  }
  .main-exam-footer-wrapper {
    height: 5%;
    margin-top: 10px;
    .footer-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      background-color: #fff;
      font-size: 15px;
      .left-side {
        padding-left: 20px;
        span {
          margin-right: 10px;
        }
      }
      .right-side {
        display: flex;
        align-items: center;
      }
      .footer-item {
        display: flex;
        white-space: nowrap;
        margin-right: 18px;
        align-items: center;
        span {
          padding-right: 5px;
        }
      }
    }
  }
  .title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-group {
      top: 0;
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
  .is-expend-switch {
    position: absolute;
    top: 17px;
    right: 24px;
    .ivu-form-item {
      margin-bottom: 0;
    }
  }
  .silde-btn {
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 10;
    width: 30px;
    height: 40px;
    line-height: 40px;
    border-radius: 50% 0 0 50%;
    background-color: #5cadff;
    cursor: pointer;
    .slide-icon {
      text-align: center;
      font-size: 30px;
      color: #fff;
    }
  }
  .right-menu {
    position: fixed;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
    border-radius: 1px;
    z-index: 999;
    display: none;
    .menu-item {
      width: 300px;
      height: 40px;
      cursor: pointer;
      line-height: 40px;
      padding: 2px 10px;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #1a1a1a;
      text-decoration: none;
      .right-menu-cont {
        flex: 1;
        display: flex;
        align-items: center;
      }
      .right-menu-desc {
        width: 60px;
        flex-shrink: 0;
      }
      .cont {
        max-width: 200px;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .menu-item:hover {
      background: #eee;
      color: #252525;
    }
  }
  .vxe-tree .vxe-tree--btn-wrapper {
    background-color: transparent;
  }
  .ivu-col {
    height: 100%;
  }
  .ivu-tabs .ivu-tabs-tabpane {
    padding: 2px;
  }
  .ivu-input[disabled],
  fieldset[disabled] .ivu-input,
  .ivu-select-disabled .ivu-select-selection {
    color: #333;
    font-weight: 500;
  }

  .ivu-table-column-center .ivu-table-cell {
    height: 100%;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
  }
  .ivu-tooltip {
    height: 100%;
  }
  .ivu-tooltip-rel {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .ivu-table-cell-tooltip-content {
    height: 100%;
    text-align: center;
    // line-height: 48px;
  }

  .zk-table__cell-inner {
    font-size: 14px;
  }
}
</style>

<style lang="less" scoped>
</style>
