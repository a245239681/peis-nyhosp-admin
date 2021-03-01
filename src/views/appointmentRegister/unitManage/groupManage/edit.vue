<template>
  <div>
    <Modal v-model="isVisible"
           width="1360"
           class="group-modal"
           :mask-closable="false"
           :title="showTitle"
           :styles="{top: '20px'}"
           @on-cancel="closeModal">
      <div class="modal-body">
        <div class="group-form">
          <Form :model="groupForm"
                ref="groupForm"
                label-position="left"
                :label-width="70"
                :rules="ruleValidate">
            <Row :gutter="16">
              <!-- <Col span="6">
               <FormItem label="分组编号" prop="boId">
                  <Input v-model="groupForm.boId" disabled size="small"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="单位编号" prop="boUnitId">
                  <Input v-model="groupForm.boUnitId" disabled size="small"/>
                </FormItem>
              </Col> -->
              <Col span="6">
              <FormItem label="单位名称"
                        prop="boUnitName">
                <Input v-model="groupForm.boUnitName"
                       disabled
                       size="small" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="单位体检次数"
                        prop="boUnitVisitSn"
                        :label-width="110">
                <Input v-model="groupForm.boUnitVisitSn"
                       size="small"
                       disabled />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="分组名称"
                        prop="boGroupingName"
                        :label-width="90">
                <Input v-model="groupForm.boGroupingName"
                       size="small"
                       :disabled="grayAll" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="性别"
                        prop="boSex">
                <Select v-model="groupForm.boSex"
                        @on-change="changeSex"
                        size="small"
                        :disabled="grayAll">
                  <Option value="不限">不限</Option>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="6">
              <FormItem label="年龄下限"
                        prop="boAgeLowerBound">
                <Input v-model="groupForm.boAgeLowerBound"
                       size="small"
                       :disabled="grayAll" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="年龄上限"
                        prop="boAgeUpperBound">
                <Input v-model="groupForm.boAgeUpperBound"
                       size="small"
                       :disabled="grayAll" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="优先级"
                        prop="boPeLevel">
                <Select v-model="groupForm.boPeLevel"
                        :label-in-value="true"
                        filterable
                        size="small"
                        :disabled="grayAll">
                  <Option v-for="item in priorityList"
                          :value="item.cdId"
                          :key="item.cdId">{{item.cdName}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="婚姻状态"
                        prop="boMaritalStatus">
                <Select v-model="groupForm.boMaritalStatus"
                        size="small"
                        clearable
                        :disabled="grayAll">
                  <!-- <Option value="未知">未知</Option> -->
                  <Option value="不详">不详</Option>
                  <Option value="未婚">未婚</Option>
                  <Option value="已婚">已婚</Option>
                  <!-- <Option value="离异">离异</Option>
                        <Option value="丧偶">丧偶</Option> -->
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="标准价格"
                        prop="boGroupingPrice">
                <Input v-model="groupForm.boGroupingPrice"
                       size="small"
                       disabled />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="项目折扣（%）"
                        prop="boGroupingDiscount"
                        :label-width="130">
                <Input v-model="groupForm.boGroupingDiscount"
                       size="small"
                       @on-change="changeDiscount"
                       :disabled="grayAll">
                <!-- <span slot="append">%</span> -->
                </Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="实际价格"
                        prop="boGroupingDiscountPrice"
                        :label-width="100">
                <Input v-model="groupForm.boGroupingDiscountPrice"
                       size="small"
                       @on-change="changeDiscountPrice"
                       :disabled="grayAll" />
              </FormItem>
              </Col>
              <!-- <Col span="6">
              <FormItem label="快速预约人数"
                        :label-width="98">
                <Input v-model="groupForm.boQuickBookingNum"
                       size="small"
                       number 
                       :disabled="grayAll"/>
              </FormItem>
              </Col> -->
            </Row>
            <Row :gutter="16">
              <Col span="6">
              <FormItem label="分组支付方式"
                        prop="boGroupingPayType"
                        :label-width="100">
                <RadioGroup v-model="groupForm.boGroupingPayType">
                  <Radio label="0"
                         :disabled="grayAll">单位支付</Radio>
                  <Radio label="1"
                         :disabled="grayAll">个人支付</Radio>
                </RadioGroup>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="加项支付方式"
                        prop="boAddPayType"
                        :label-width="100">
                <RadioGroup v-model="groupForm.boAddPayType">
                  <Radio label="0"
                         :disabled="grayAll">单位支付</Radio>
                  <Radio label="1"
                         :disabled="grayAll">个人支付</Radio>
                </RadioGroup>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="启用状态"
                        prop="boStatus">
                <RadioGroup v-model="groupForm.boStatus"
                            type="button"
                            :disabled="grayAll">
                  <Radio label="0">启用</Radio>
                  <Radio label="1">停用</Radio>
                </RadioGroup>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <!-- v-if="isAddGroup" -->
        <div class="group-bottom-wrapper">
          <div class="left">
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
                              :disabled="grayAll"
                              @search="searchPackage"
                              @clear="clearPackage"
                              @selectOption="selectPackage"></input-drop>
                </div>
              </div>
              <Scroll :height="313"
                      :on-reach-bottom="reachPackageBottom"
                      :distance-to-edge="-24">
                <RadioGroup v-model="userPickPackages"
                            class="unselect-package"
                            vertical
                            @on-change="changePackage">
                  <Radio :label="item.name"
                         v-for="item in allPackages"
                         :key="item.rowId"
                         class="unselect-package-item"
                         :disabled="item.gray"></Radio>
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
                     style="font-size: 14px;"
                     v-if="userPickPackages">{{ userPickPackages }}</Tag>
              </div>
            </Card>
          </div>
          <div class="center">
            <Card :bordered="false"
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
                              :disabled="grayAll"
                              @search="searchProject"
                              @clear="clearProject"
                              @selectOption="selectProject"></input-drop>
                </div>
              </div>
              <Row :gutter="16"
                   class="select-groups">
                <Col span="5">
                <span style="font-size:14px;">科室分类</span>
                </Col>
                <Col span="8">
                <Select v-model="paDeptId"
                        filterable
                        size="small"
                        @on-change="changeItem"
                        :disabled="grayAll">
                  <Option value="all"
                          :key="0 + new Date().getTime()">全部</Option>
                  <Option v-for="item in deptList"
                          :value="item.poId"
                          :key="item.poId">{{ item.poDeptName }}</Option>
                </Select>
                </Col>
                <Col span="5">
                <span style="font-size:14px;">共{{totalItemNum}}项</span>
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
              <Scroll :height="381"
                      style="margin-top:20px;"
                      :on-reach-bottom="handleReachBottom"
                      :distance-to-edge="-24">
                <CheckboxGroup v-model="pickProjects"
                               class="unpick-projects"
                               @on-change="changeProject">
                  <Checkbox :label="item.id"
                            v-for="item in projects"
                            :key="item.id"
                            :disabled="item.gray"
                            class="unpick-projects-item">
                    <!-- <Icon type="ios-flask-outline" style="color:#2d8cf0;" v-if="item.isCombo"></Icon>
                                <Icon type="ios-flask" style="color:#2d8cf0;" v-else></Icon> -->
                    <Icon type="ios-flask-outline"
                          style="color:#2d8cf0;"></Icon>
                    <span style="margin-left: 3px;">{{item.name}}</span>
                  </Checkbox>
                </CheckboxGroup>
              </Scroll>
            </Card>
          </div>
          <div class="right">
            <Card :bordered="false"
                  shadow
                  class="pick-projects">
              <div slot="title"
                   class="search-title-wrapper">
                <span class="title">已选项目</span>
                <div class="title-right-tool">
                  <p class="project-count">
                    总计：{{pickProjectsTableData.length}} 项
                  </p>
                  <Button type="default"
                          style="margin-right: 10px;"
                          @click="openGroupProjects"
                          size="small"
                          :disabled="grayAll">复制其他分组项目</Button>
                  <Button type="default"
                          @click="delPickProjects"
                          size="small"
                          :disabled="grayAll">清空项目</Button>
                </div>
              </div>
              <tree-table ref="unitGroupTreeTable"
                          max-height="415"
                          :columns="pickProjectsCols"
                          :data="pickProjectsTableData"
                          :expand-type="false"
                          :is-fold="true"
                          :selectable="false"
                          :show-row-hover="true"
                          :empty-text="emptyText"
                          :row-class-name="addItemColor"
                          @row-dblclick="delTableData"
                          expand-key="paName"
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
            </Card>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="modal-footer">
        <p style="color:red; font-size: 14px;">温馨提醒：该分组如果已有在检人员，不可更改分组信息</p>
        <div>
          <Button @click="closeModal">取消</Button>
          <Button type="primary"
                  :loading="saveLoading"
                  @click="save">保存</Button>
        </div>
      </div>
    </Modal>
    <group-projects :visible="groupProjectsVisible"
                    @importProjects="importGroupProjects"
                    @close="closeGroupProjects"></group-projects>
  </div>
</template>

<script>
import InputDrop from "@/views/appointmentRegister/components/inputDrop"
import GroupProjects from "./selectGroupProjects.vue"
import {
  getBookingPackage,
  getComboByPackage,
  getItemByPage,
  getItemTreeByComboId,
} from '@/api/personal_register.js';
import { saveUnitGroup, getMoreItemTree } from '@/api/groupManage.js'
import { FilterByName } from '@/libs/tools.js'

export default {
  components: {
    InputDrop,
    GroupProjects
  },
  props: {
    title: Number,
    visible: Boolean,
    unitName: String,
    unitId: String,
    boVisitSn: [String, Number],
  },
  data () {
    return {
      groupForm: {},
      ruleValidate: {
        boAgeLowerBound: [
          { pattern: /^(([0-9]|[1-9][0-9]|1[0-4][0-9])(\.[0-9]+)?|150)$/, message: '请输入正确年龄范围（0-150）', trigger: 'blur' }
        ],
        boAgeUpperBound: [
          { pattern: /^(([0-9]|[1-9][0-9]|1[0-4][0-9])(\.[0-9]+)?|150)$/, message: '请输入正确年龄范围（0-150）', trigger: 'blur' }
        ],
        boGroupingName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ],
        boGroupingDiscount: [
          { required: true, pattern: /^([1-9]\d{0,2}|0)(\.\d{0,2})?$/, message: '请输入折扣（1-100）', trigger: 'change' }
        ],
        boGroupingDiscountPrice: [
          { required: true, pattern: /^([1-9]\d{0,9}|0)(\.\d{0,2})?$/, message: '请输入浮点数（最多两位小数）', trigger: 'change' }
        ],
        boSex: [
          { required: true, message: '请选择性别' }
        ],
      },
      boUnitName: '',
      boUnitId: '',
      boUnitVisitSn: '',
      allPackages: [], //用于保存所有套餐项目
      userPickPackages: '', //未选套餐单选值保存
      pickProjects: [], //未选项目多选值保存
      projects: [],    //多选框项目保存
      pickProjectsCols: [
        {
          type: 'template',
          title: '类型',
          key: 'isAddItem',
          template: 'isAddItem',
          width: 70,
          align: 'center',
          headerAlign: 'center'
        },
        // {
        //   title: '套餐编号',
        //   key: 'paPackageCode',
        //   template: 'paPackageCode',
        //   width: 100,
        //   align: 'center',
        //   headerAlign: 'center'
        // },
        {
          title: '所属科室',
          key: 'paDeptName',
          template: 'paDeptName',
          width: 140,
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '项目名称',
          key: 'paName',
          template: 'paName',
          minWidth: 160,
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
        //   width: 90,
        //   align: 'center',
        //   headerAlign: 'center'
        // },
        {
          title: '单价（元）',
          key: 'paPrice',
          template: 'paPrice',
          width: 94,
          align: 'center',
          headerAlign: 'center'
        }
      ],
      pickProjectsTableData: [],
      packageID: '',
      emptyText: '暂无数据',
      paDeptId: 'all',
      isComboProject: '1',
      tempPick: [],
      totalItemNum: [],
      packageInput: '',
      hackReset: false,
      paDeptId: 'all',
      isComboProject: '1',
      packagePages: 1,
      packagePageIndex: 1,
      packagePageSize: 10,
      comboPages: 1,
      comboPageIndex: 1,
      comboPageSize: 30,
      comboList: [],
      tempPick: [],
      tempPickLength: 0,
      totalItemNum: [],
      // projectInput: '',  //项目组合简码搜索框
      packageInput: '',  //套餐简码搜索框
      saveLoading: false,
      addItems: [], //修改时临时保存加项变量
      // isAddGroup: true,
      packageSearchLoading: false,
      projectSearchLoading: false,
      packageTimer: null,
      projectTimer: null,
      searchProList: [],
      searchPackageList: [],
      grayAll: false,  //已在检人员，不可修改套餐项目，判断标志
      isChangeInfo: false,  // 判断是新增还是修改分组
      groupProjectsVisible: false  //控制复制分组项目 窗口显示/隐藏
    }
  },
  computed: {
    showTitle () {
      return this.title == 0 ? '新增分组详情' : '编辑分组详情'
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    deptList: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    priorityList: {
      get: function () {
        return this.$store.getters.getPriorityDict
      },
      set: function () { }
    },
    totalPrice () {
      let _num = 0

      this.pickProjectsTableData.forEach(ele => {
        if (ele.paPrice) {
          _num = this.accAdd(_num, ele.paPrice)
        }
      })
      return _num
      // return this.pickProjectsTableData.reduce((total, currentValue) => {
      //   if (currentValue.paPrice == null) currentValue.paPrice = 0
      //   return total + currentValue.paPrice * 100;
      // }, 0);
    }
  },
  created () {
    //获取体检优先级
    this.$store.dispatch('getPriorityDict');
    //获取科室字典
    this.$store.dispatch('getRoomDict');
    this.getPackagesList();
    this.showItem();
  },
  mounted () {
    console.log(this.deptList)
  },
  watch: {
    totalPrice (newValue, oldValue) {
      console.log('new' + newValue);
      console.log('old' + oldValue);
      // const _num = this.accAdd(0, newValue / 100)
      this.groupForm.boGroupingPrice = newValue;
      this.changeDiscount();
    },
    unitName (newValue, oldValue) {
      console.log('new' + newValue);
      this.boUnitName = newValue
      console.log(this.boUnitName)
    },
    unitId (newValue, oldValue) {
      console.log('new' + newValue);
      this.boUnitId = newValue
    },
    boVisitSn (newValue, oldValue) {
      console.log('new' + newValue);
      this.boUnitVisitSn = newValue
    }
  },
  methods: {
    //根据已选项目反选未选项目的勾选项
    projectsChecked (tableData) {
      // console.log('传入已选项目长度' + tableData.length);
      this.pickProjects = [];

      //遍历所有体检组合项目
      for (let i = 0; i < this.projects.length; i++) {
        // 去掉全部灰项
        this.projects[i].gray = false
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
    //保存该分组要做的项目ComboList，后台做缴费记录用的
    pushComboList () {
      this.pickProjectsTableData.forEach((item, index) => {
        this.comboList.push({
          boObjectId: item.paId,
          boObjectCode: item.paCode,
          boObjectName: item.paName,
          boObjectType: item.boObjectType,  //2组合， 3套餐
          boDeptId: item.paDeptId,
          boDeptName: item.paDeptName,
          boComboSort: item.boComboSort
        })
      })
    },
    //双击删除表格中的项目
    delTableData (row, rowIndex, e) {
      if (this.grayAll) {
        this.$Message.warning("已有在检人员，不可删除已选项目")
        return
      }
      this.comboList = [];
      if (!this.pickProjectsTableData.length) {
        this.emptyText = '暂无数据'
      } else {
        this.pickProjectsTableData.splice(rowIndex, 1)
        this.projectsChecked(this.pickProjectsTableData)
        // 如果删去套餐中的组合项目，全部变成自选
        if (row.boObjectType == 3) {
          this.pickProjectsTableData.forEach((item, index) => {
            item.isAddItem = 2  // 0 - 套餐， 1 - 加做，2 - 自选
            item.boObjectType = 2
            this.comboList.push({
              boObjectId: item.paId,
              boObjectCode: item.paCode,
              boObjectName: item.paName,
              boObjectType: item.boObjectType,  //2组合， 3套餐
              boDeptId: item.paDeptId,
              boDeptName: item.paDeptName
            })
          })
          console.log(this.pickProjectsTableData)
          this.userPickPackages = ''
          this.$set(this.groupForm, 'boPackageId', '')
          this.$set(this.groupForm, 'boPackageCode', '')
          this.$set(this.groupForm, 'boPackageName', '')
        } else {
          this.pushComboList();
        }
        //单位人员，只能加项，不可删除套餐里的项目。
        // if (row.boObjectType == 3) {
        //   this.$Message.warning("套餐里的项目不可拆分删除，可加做、更换其他套餐或自选项目")
        //   return
        // } else {
        //   this.pickProjectsTableData.splice(rowIndex, 1)
        //   this.grayOff(this.pickProjectsTableData)
        //   this.pushComboList();
        // }
      }
      console.log(this.comboList)
    },
    //高亮表格中的加项颜色
    addItemColor (row, index) {
      let r = this.pickProjectsTableData.filter((val, index) => {
        // return val.isAddItem == "加做"
        return val.isAddItem == 1  // 0 - 套餐， 1 - 加做，2 - 自选
      });
      // console.log(this.pickProjectsTableData)
      // console.log(r)
      if (r.length && index < r.length) {
        return 'demo-table-addItem-row';
      } else {
        return 'demo-table-package-row';
      }
      return '';
    },
    //保存分组
    save () {
      this.$refs.groupForm.validate(valid => {
        if (!this.pickProjectsTableData.length) {
          this.$Message.error('保存失败，您还未选择待检套餐或项目');
          return false;
        }
        // 如果已有在检人员，修改分组不保存
        if (this.grayAll) {
          this.closeModal()
          return false;
        }
        console.log(valid)
        if (valid) {
          if (this.saveLoading) return
          // 因传 null表示不插入该值， 传对应的数据类型，表示修改该值，做以下判断
          // 如果是修改分组信息的，删空输入框而不输入任何内容时，年龄上下限，快速预约人数，默认设为0
          // 如果是新增分组信息的，删空输入框而不输入任何内容时，
          if (this.isChangeInfo) {
            this.groupForm.boAgeLowerBound = this.groupForm.boAgeLowerBound == '' ? 0 : this.groupForm.boAgeLowerBound
            this.groupForm.boAgeUpperBound = this.groupForm.boAgeUpperBound == '' ? 0 : this.groupForm.boAgeUpperBound
            // this.groupForm.boQuickBookingNum = this.groupForm.boQuickBookingNum == '' ? 0 : this.groupForm.boQuickBookingNum
          } else {
            this.groupForm.boAgeLowerBound = this.groupForm.boAgeLowerBound == '' ? null : this.groupForm.boAgeLowerBound
            this.groupForm.boAgeUpperBound = this.groupForm.boAgeUpperBound == '' ? null : this.groupForm.boAgeUpperBound
            // this.groupForm.boQuickBookingNum = this.groupForm.boQuickBookingNum == '' ? null : this.groupForm.boQuickBookingNum
          }
          this.saveLoading = true
          this.groupForm.comboList = this.comboList;
          saveUnitGroup(this.groupForm).then(({ data }) => {
            this.saveLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.closeModal()
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.saveLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
      })
    },
    //关闭新增（或修改）分组的弹出
    closeModal () {
      this.$refs.groupForm.resetFields()
      this.delPickProjects()
      this.$emit('close')
    },
    //新增分组或者修改分组的赋值判断
    async getItemList (row) {
      // console.log(Object.keys(row).length == 0)
      if (Object.keys(row).length == 0) {
        this.grayAll = false;
        this.groupForm = {
          boUnitName: this.boUnitName,
          boUnitId: this.boUnitId,
          boUnitVisitSn: this.boUnitVisitSn,
          boGroupingPayType: '0',
          boAddPayType: '1',
          boGroupingDiscount: '100',
          boGroupingPrice: '0',
          boGroupingDiscountPrice: '0',
          boStatus: '0'
        }
        this.isChangeInfo = false;
      } else {
        this.isChangeInfo = true;
        this.pickProjectsTableData = []
        this.pickProjects = []
        this.tempPick = []
        this.addItems = []
        this.comboList = []

        this.groupForm = row
        this.groupForm.settleNumber > 0 ? this.grayAll = true : this.grayAll = false
        // 有套餐组合项目返回时，分组未登记，可修改；返回null时，已登记，套餐项目不可修改
        if (JSON.stringify(this.groupForm.detailDictList) != '[]') {
          // this.isAddGroup = true;
          this.groupForm.detailDictList.forEach(item => {
            if (item.boObjectType == "3") {
              this.groupForm.boPackageId = item.boObjectId;
              this.groupForm.boPackageCode = item.boObjectCode;
              this.groupForm.boPackageName = item.boObjectName;
              this.userPickPackages = item.boObjectName;
            } else if (item.boObjectType == "2") {
              this.addItems.push(item.boObjectId)
              // console.log('addItems' + this.addItems)
            }
          })

          try {
            if (!!this.groupForm.boPackageId) {
              this.emptyText = '数据加载中...';
              let packageRes = await getComboByPackage({ paPackageId: this.groupForm.boPackageId })
              if (packageRes.data.code === 0) {
                //数组深拷贝
                [...this.pickProjectsTableData] = packageRes.data.data;
                this.emptyText = '此套餐下无项目组合';
              } else {
                this.emptyText = '暂无数据';
                this.$Message.error(packageRes.data.message);
              }
              this.pickProjectsTableData.forEach(item => {
                item.paPackageCode = this.groupForm.boPackageCode;
                // item.isAddItem = '套餐';
                item.isAddItem = 0;
                item.boObjectType = 3;    //2 组合， 3套餐
              });
            }

            //修改分组数据时，若有加项，获取加项信息
            if (this.addItems.length) {
              this.emptyText = '数据加载中...';
              let addItemRes = await getMoreItemTree({ boGroupingId: this.groupForm.boId, paComboId: this.addItems })
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
                    // isAddItem: '加做',
                    isAddItem: 1,
                    boObjectType: 2,
                    boComboSort: item.sort
                  })
                })
                this.grayOff(this.pickProjectsTableData);
                if (!this.userPickPackages) {
                  this.noPackage();
                }
              } else {
                this.emptyText = '暂无数据';
                this.$Message.error(addItemRes.data.message);
              }
            }
            //保存返回的套餐数据，用于保存comboList
            this.pushComboList()
          } catch (err) {
            console.log(err)
            this.$Message.error(err)
            this.$Message.error('网络不稳定，请稍后重试')
          }
          if (this.grayAll) {
            this.grayAllPackage()
            this.grayAllProject()
          } else {
            this.delGrayOffAllPackage()
            this.delGrayOff()
          }
        } else {
          // this.isAddGroup = false;
        }
      }
    },
    //分页获取所有 未选套餐
    getPackagesList (query = '') {
      if (this.packageSearchLoading) return
      this.packageSearchLoading = true;
      let pagination = {
        page: this.packagePageIndex,
        size: this.packagePageSize
      };
      let params = {
        paPackageName: query,
        paSex: this.groupForm.boSex
      };
      getBookingPackage(pagination, params).then(res => {
        let result = res.data;
        if (result.code == 0) {
          // console.log(result.data);
          result.data.records.forEach(item => {
            this.allPackages.push(item);
            if (query != '') {
              this.searchPackageList.push(item)
            }
          });
          console.log(this.allPackages)
        } else {
          this.$Message.error(result.message);
        }
        this.packageSearchLoading = false;
      }).catch(err => {
        this.packageSearchLoading = false;
        this.$Message.error('网络不稳定，请稍后重试')
      });
    },
    //修改套餐,获取已选项目信息
    changePackage (packageName) {
      console.log('查询预约套餐名' + packageName);
      this.$refs.projectInputDrop.filterText = "";
      this.paDeptId = 'all';
      this.projects = [];
      this.comboList = [];
      this.showItem();
      this.pickProjects = [];
      this.pickProjectsTableData = [];
      this.tempPickLength = 0;

      this.findPackageID(packageName);
      let comboParams = {
        paPackageId: this.packageID || this.groupForm.boPackageId
      };
      if (!!comboParams.paPackageId) {
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
          this.pickProjectsTableData.forEach(item => {
            item.boPackageId = this.groupForm.boPackageId;
            item.paPackageCode = this.groupForm.boPackageCode;
            item.isAddItem = 0;
            item.boObjectType = 3;    //2 组合， 3套餐
            item.boComboSort = item.paSort
          });
          //保存返回的套餐数据，用于保存comboList
          this.pushComboList()
          // this.grayOff(this.pickProjectsTableData);
        }).catch(err => {
          this.$Message.error('网络不稳定，请稍后重试')
        });
      }
    },
    //滚轮到未选套餐底部刷新
    reachPackageBottom () {
      if (this.grayAll) return
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
      if (this.grayAll) return
      return new Promise(resolve => {
        setTimeout(() => {
          this.comboPageIndex++
          this.showItem();
          resolve();
        }, 300);
      });
    },
    //已选项目上的清空按钮
    delPickProjects () {
      this.multiplyPackage = false
      this.isPackageMore = false
      this.isProjectMore = false
      this.$refs.packageInputDrop.filterText = "";
      this.$refs.projectInputDrop.filterText = "";
      this.pickProjectsTableData = [];
      this.emptyText = '暂无数据';
      this.packageID = '';
      this.packageInput = '';
      this.allPackages = [];
      this.packagePageIndex = 1;
      this.getPackagesList();
      this.$set(this.groupForm, "boPackageId", null)
      this.$set(this.groupForm, "boPackageCode", null)
      this.$set(this.groupForm, "boPackageName", null)
      this.$set(this.groupForm, "comboList", [])
      this.userPickPackages = '';
      // this.projectInput = '';
      this.paDeptId = 'all';
      this.pickProjects = [];
      this.projects = [];
      this.comboPageIndex = 1;
      this.showItem();
      this.comboList = [];
      this.tempPick = [];
      this.tempPickLength = 0;
      this.searchPackageList = [];
      this.searchProList = [];
      // this.delGrayOff();
      console.log(this.groupForm)
    },
    //改变性别时，更改体检分组以及套餐
    changeSex () {
      if (!!this.groupForm.boSex && !this.grayAll) {
        this.multiplyPackage = false
        this.delPickProjects();
      }
    },
    //根据套餐名查找套餐ID
    findPackageID (packageName) {
      // console.log(allPackages)
      this.allPackages.forEach(item => {
        if (item.name === packageName) {
          this.packageID = item.id;
          this.groupForm.boPackageId = item.id;
          this.groupForm.boPackageCode = item.code;
          this.groupForm.boPackageName = item.name;
          this.packagePrice = item.price;
        }
      });
    },
    //分页展示数据 未选项目
    showItem (query = '') {
      // console.log(this.paDeptId);
      // console.log(this.isComboProject);
      // console.log(this.comboPageIndex);
      this.projectSearchLoading = true;
      let pagination = {
        page: this.comboPageIndex,
        size: this.comboPageSize
      };
      let params = {
        // keyword: this.projectInput,
        keyword: query,
        paDeptId: this.paDeptId == 'all' ? '' : this.paDeptId,
        paFlag: this.isComboProject,
        paSex: this.groupForm.boSex
      };
      getItemByPage(pagination, params).then(res => {
        // console.log(res.data);
        let result = res.data;
        if (result.code == 0) {
          this.comboPages = result.data.pages;
          result.data.records.forEach(item => {
            this.projects.push(item);
            if (query !== '') {
              this.searchProList.push(item);
            }
          });
          this.totalItemNum = result.data.total;
          // this.grayOff(this.pickProjectsTableData);
          this.projectsChecked(this.pickProjectsTableData);
        } else {
          this.$Message.error(result.message);
        }
        this.projectSearchLoading = false;
      }).catch(err => {
        this.projectSearchLoading = false;
        this.$Message.error('网络不稳定，请稍后重试')
      });
    },
    //禁止勾选默认套餐
    grayAllPackage () {
      this.allPackages.forEach(item => {
        item.gray = true
      })
    },
    delGrayOffAllPackage () {
      this.allPackages.forEach(item => {
        item.gray = false
      })
    },
    //灰色勾选默认套餐项目组合
    grayOff (tableData) {
      // console.log('传入已选项目长度' + tableData.length);
      this.pickProjects = [];
      this.delGrayOff();

      //遍历所有体检组合项目，设置gray属性
      for (let i = 0; i < this.projects.length; i++) {
        // console.log(tableData[i].paName);
        for (let j = 0; j < tableData.length; j++) {
          if (this.projects[i].name == tableData[j].paName && tableData[j].boObjectType == 3) {
            this.pickProjects.push(tableData[j].paId);
            this.projects[i].gray = true;
          } else if (this.projects[i].name == tableData[j].paName && tableData[j].boObjectType == 2) {
            this.pickProjects.push(tableData[j].paId);
          }
        }
      }
      this.tempPick = this.pickProjects;
      console.log(this.tempPick + '....')
      this.tempPickLength = this.tempPick.length;
    },
    // 清除灰掉样式
    delGrayOff () {
      this.projects.forEach(item => {
        item.gray = false;
      });
    },
    // 清除灰掉样式
    grayAllProject () {
      this.projects.forEach(item => {
        item.gray = true;
      });
    },
    //改变选择框时，查询数据 按科室分类筛选,按项目分类筛选
    changeItem () {
      // console.log('我是科室ID'+ this.paDeptId);
      //清空状态
      // this.projectInput = '';
      this.$refs.projectInputDrop.filterText = "";
      this.isProjectMore = false
      this.searchProList = [];
      this.comboPageIndex = 1;
      this.projects = [];
      this.tempPickLength = 0;
      this.showItem();
    },
    //组合加项
    changeProject () {
      this.comboList = [];
      this.emptyText = '数据加载中...';
      // console.log(this.tempPickLength);
      if (this.pickProjects.length > this.tempPickLength) {
        // console.log('加项触发')
        // console.log('勾选项' + this.pickProjects);
        // console.log('临时' + this.tempPick);
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
          // console.log(res.data)
          let result = res.data;
          if (result.code == 0) {
            let addItem = result.data;
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
              boObjectType: 2,
              boComboSort: addItem.paSort
            });
            // console.log('aaaaaaa'+this.pickProjectsTableData.length);
            this.pushComboList();
            console.log(this.comboList);

            [...this.tempPick] = this.pickProjects;
            this.tempPickLength = this.tempPick.length;
            this.noPackage();
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
          this.emptyText = '网络不稳定，暂无数据，请稍后重试';
          this.$Message.error('网络不稳定，请稍后重试')
        })
      } else if (this.pickProjects.length < this.tempPickLength) {
        // console.log('减项触发')
        // console.log('temp长度' + this.tempPickLength);
        // console.log(this.tempPick)
        // console.log('pick' + this.pickProjects);
        // console.log('pick长度' + this.pickProjects.length);
        let uncheckItemId = this.getDiffrence(this.pickProjects, this.tempPick);
        let delIndex = 0;
        // console.log(uncheckItemId);

        //防止多次点击, 灰掉勾选框
        for (let m = 0; m < this.projects.length; m++) {
          if (this.projects[m].id == uncheckItemId) {
            this.projects[m].gray = true;
            break;
          }
        }
        for (let i = 0; i < this.pickProjectsTableData.length; i++) {
          if (this.pickProjectsTableData[i].paId == uncheckItemId) {
            delIndex = i;
            break;
          }
        }
        let arr = this.pickProjectsTableData.splice(delIndex, 1);
        this.projectsChecked(this.pickProjectsTableData)
        // 如果删去套餐中的组合项目，全部变成自选
        if (JSON.stringify(arr) != '[]' && arr[0].boObjectType == 3) {
          this.pickProjectsTableData.forEach((item, index) => {
            item.isAddItem = 2  // 0 - 套餐， 1 - 加做，2 - 自选
            item.boObjectType = 2
            this.comboList.push({
              boObjectId: item.paId,
              boObjectCode: item.paCode,
              boObjectName: item.paName,
              boObjectType: item.boObjectType,  //2组合， 3套餐
              boDeptId: item.paDeptId,
              boDeptName: item.paDeptName,
              boComboSort: item.boComboSort
            })
          })
          console.log(this.pickProjectsTableData)
          this.userPickPackages = ''
          this.$set(this.groupForm, 'boPackageId', '')
          this.$set(this.groupForm, 'boPackageCode', '')
          this.$set(this.groupForm, 'boPackageName', '')
        } else {
          this.pushComboList();
        }

        console.log(this.comboList);
        this.tempPick = [];
        [...this.tempPick] = this.pickProjects;
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
    },
    noPackage () {
      //如果没有套餐，加做全部改为自选
      if (!this.userPickPackages) {
        this.pickProjectsTableData.forEach(item => {
          // item.isAddItem = '自选'
          item.isAddItem = 2
        })
      }
    },
    getDiffrence (arr1, arr2) {
      return arr1.concat(arr2).filter((v, i, arr) => {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      })
    },
    //修改折扣率，浮点数两位，四舍五入， 并算出实际价格
    changeDiscount (e) {
      if (e) {
        this.$set(this.groupForm, 'boGroupingDiscount', e.target.value)
      }

      if (!this.groupForm.boGroupingDiscount) {
        this.groupForm.boGroupingDiscount = '0';
      }
      let params = (this.groupForm.boGroupingPrice * this.groupForm.boGroupingDiscount / 100).toFixed(2);
      let _num = this.accAdd(0, params)
      this.$set(this.groupForm, 'boGroupingDiscountPrice', _num)
    },
    //修改实际价格，算出折扣率
    changeDiscountPrice () {
      if (this.groupForm.boGroupingPrice > 0) {
        let params = (this.groupForm.boGroupingDiscountPrice / this.groupForm.boGroupingPrice * 100).toFixed(2);
        let _num = this.accAdd(0, params)
        this.$set(this.groupForm, 'boGroupingDiscount', _num)
      }
    },
    //搜索套餐
    searchPackage (query) {
      // console.log('输入值')
      // console.log(query)
      //如果已选项目中已有套餐，则不添加相同的套餐
      if (!!query && this.userPickPackages == query) return
      this.packageTimer && clearTimeout(this.packageTimer);
      this.packageTimer = setTimeout(() => {
        if (!this.packageSearchLoading) {
          this.packagePageIndex = 1;
          this.allPackages = [];
          this.searchPackageList = []; //未选套餐 搜索框的列表
          this.getPackagesList(query);
        }
      }, 300)
    },
    selectPackage (value, label) {
      console.log('输入框选择' + value)
      console.log('输入框选择' + label)
      if (value != undefined || value != '') {
        if (!this.userPickPackages && !this.multiplyPackage) {
          this.userPickPackages = label
          this.multiplyPackage = true
          this.changePackage(label)
        } else {
          let params = {
            paPackageId: value
          };
          this.emptyText = '数据加载中...'
          getComboByPackage(params).then((res) => {
            let result = res.data
            // console.log(result);
            if (result.code === 0) {
              let arr = this.pickProjectsTableData.concat(result.data)
              this.pickProjectsTableData = FilterByName(arr, 'paId')
              // 个人
              this.pickProjectsTableData.forEach(item => {
                item.boComboSort = item.paSort
                item.isAddItem = 2
                item.boObjectType = 2;    //2 组合， 3套餐
                item.boComboSort = item.paSort
              })
              console.log('单位分组-两个套餐以上选择变自选')
              console.log(this.pickProjectsTableData)
              // 搜索添加了两个套餐以上，清空套餐信息，变为自选
              this.userPickPackages = ''
              //  勾选项目组合处理
              this.delGrayOff()
              this.projectsChecked(this.pickProjectsTableData)

              // 清除掉传给后台的数据
              this.$set(this.groupForm, 'boPackageId', null)
              this.$set(this.groupForm, 'boPackageName', null)
              this.$set(this.groupForm, 'boPackageCode', null)
              this.comboList = []
              //  随意更改套餐，加减项目
              this.pushComboList()
            } else {
              this.emptyText = '暂无数据'
              this.$Message.error(result.message)
            }
          }).catch(err => {
            console.log(err)
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
        this.$refs.packageInputDrop.resetOptions()
      }
    },
    clearPackage () {
      if (!this.packageSearchLoading) {
        this.packagePageIndex = 1;
        this.allPackages = [];
        this.searchPackageList = []; //未选套餐 搜索框的列表
        this.getPackagesList();
      }
    },
    //搜索项目组合
    searchProject (query) {
      if (query !== undefined || query !== '' || query !== null) {
        //节流，因输入值改变而频繁发请求，延迟执行请求
        this.projectTimer && clearTimeout(this.projectTimer);
        this.projectTimer = setTimeout(() => {
          if (!this.projectSearchLoading) {
            this.comboPageIndex = 1;
            this.paDeptId = 'all';
            this.projects = []; //未选项目 checkbox列表
            this.searchProList = []; //未选项目 搜索框的列表
            this.tempPickLength = 0;
            this.showItem(query);
          }
        }, 300)
      }
    },
    selectProject (value, lable) {
      //如果已选项目中已有项目，则不添加新的项目，去重
      for (let i = 0; i < this.pickProjectsTableData.length; i++) {
        if (this.pickProjectsTableData[i].paId == value) return
      }
      if (value != undefined || value != '') {
        this.pickProjects.push(value)
        this.changeProject()
      }
      this.$refs.projectInputDrop.resetOptions()
    },
    clearProject () {
      if (!this.projectSearchLoading) {
        this.comboPageIndex = 1;
        this.paDeptId = 'all';
        this.projects = []; //未选项目 checkbox列表
        this.searchProList = []; //未选项目 搜索框的列表
        this.tempPickLength = 0;
        this.showItem();
      }
    },
    openGroupProjects () {
      this.groupProjectsVisible = true
    },
    closeGroupProjects () {
      this.groupProjectsVisible = false
    },
    // 复制项目
    async importGroupProjects (addItems, form) {
      console.log('复制出来的项目')
      console.log(addItems)
      console.log(form)
      this.$set(this.groupForm, "boPackageId", null)
      this.$set(this.groupForm, "boPackageCode", null)
      this.$set(this.groupForm, "boPackageName", null)
      this.pickProjects = []
      this.pickProjectsTableData = []
      this.comboList = []
      this.userPickPackages = form.groupPackageName
      // 如果有套餐，查出套餐里的所有组合
      if (!!form.groupPackageName) {
        this.$set(this.groupForm, "boPackageId", form.groupPackageId)
        this.$set(this.groupForm, "boPackageCode", form.groupPackageCode)
        this.$set(this.groupForm, "boPackageName", form.groupPackageName)
        this.emptyText = '数据加载中...';
        let comboParams = {
          paPackageId: form.groupPackageId
        };
        let packageRes = await getComboByPackage(comboParams);
        console.log(packageRes)
        if (packageRes.data.code === 0) {
          //数组深拷贝
          [...this.pickProjectsTableData] = packageRes.data.data;
          this.emptyText = '此套餐下无项目组合';
        } else {
          this.emptyText = '暂无数据';
          this.$Message.error(packageRes.data.message);
        }
        this.pickProjectsTableData.forEach(item => {
          item.boPackageId = form.groupPackageId;
          item.paPackageCode = form.groupPackageCode;
          item.isAddItem = 0;
          item.boObjectType = 3;    //2 组合， 3套餐
          item.boComboSort = item.paSort
        });
      }
      // 如果有加项
      if (addItems.length) {
        let addItemRes = await getMoreItemTree({ boGroupingId: form.boGroupId, paComboId: addItems })
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
              isAddItem: 1,  // 加做标签
              boObjectType: 2,   // 加做状态
              boComboSort: item.sort,
              paTestTubeId: item.testTubeId
            })
          })
          this.noPackage();
          this.pushComboList()
          console.log('复制项目存进comboList')
          console.log(this.comboList)
        } else {
          this.emptyText = '暂无数据';
          this.$Message.error(addItemRes.data.message);
        }
      }
      this.projectsChecked(this.pickProjectsTableData)

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

  }
}
</script>
<style lang="less">
.group-modal {
  .ivu-modal-body {
    padding-bottom: 0;
  }
  .modal-body {
    .group-form {
      width: 100%;
    }
    .group-bottom-wrapper {
      .left {
        width: 20%;
      }
      .center {
        width: 30%;
      }
      .right {
        width: 50%;
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
      .project-count {
        margin-right: 20px;
      }
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
    .ivu-select-disabled .ivu-select-selection,
    .ivu-input {
      color: #000;
    }
    // .ivu-select-input[disabled] {
    //   -webkit-text-fill-color: #000;
    // }
    .ivu-table th {
      background-color: #d6eaff;
    }
    .demo-table-package-row td {
      background-color: #fff;
      color: #333;
      opacity: 0.8;
    }
    .demo-table-addItem-row td {
      background-color: #fff9c4;
      color: #333;
      opacity: 0.8;
    }
    .group-bottom-wrapper {
      width: 100%;
      display: flex;
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
      .selected-package {
        min-height: 26px;
      }
      .unselect-package-item {
        width: 96%;
        min-width: 200px;
      }
      .select-groups span {
        font-size: 12px;
      }
      .pick-projects {
        height: 510px;
        .ivu-card-head {
          padding: 14px 16px 11px 16px;
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
        .ivu-checkbox-wrapper {
          font-size: 14px;
          color: #252525;
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
        .zk-table__header-row {
          background-color: #d6eaff;
        }
        .zk-table__body-row {
          height: 20px;
        }
        .zk-table__body-wrapper {
          height: 380px !important;
        }
        .zk-table--empty-row {
          height: 380px;
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
    }
  }
  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  // 选择框禁止色改为白底 - 特殊需求
  .ivu-select-disabled .ivu-select-selection,
  .ivu-input {
    background-color: #fff;
  }
}
</style>
