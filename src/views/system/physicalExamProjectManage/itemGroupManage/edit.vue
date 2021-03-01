<template>
  <div>
    <Modal class="item-group-manage-edit"
           v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           width="1300"
           :title="showTitle">
      <p slot="header">
        <span class="title">{{showTitle}}</span>
      </p>
      <div class="modal-body">
        <div class="form-wrapper">
          <Form :model="formData"
                :label-width="110"
                ref="form"
                label-position="right"
                :rules="rules"
                inline>
            <Row type="flex">
              <FormItem label="序号"
                        style="flex:1;"
                        prop="paSort">
                <Input v-model="formData.paSort"
                       number
                       size="small"></Input>
              </FormItem>
              <FormItem label="组合编号"
                        style="flex:1;">
                <Input v-model="formData.paComboCode"
                       :disabled="title == 0"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="所在科室"
                        prop="paDeptId"
                        style="flex:1;">
                <Select v-model="formData.paDeptId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="belongDeptChange"
                        size="small">
                  <Option v-for="item in roomDict"
                          :value="item.poId"
                          :key="item.poId">{{ item.poDeptName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="组合名称"
                        style="flex:1;"
                        prop="paComboName">
                <Input v-model="formData.paComboName"
                       @on-change="searchCode"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="组合分类"
                        prop="paComboTypeId"
                        style="flex:1;">
                <Select v-model="formData.paComboTypeId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="comboTypeChange"
                        size="small">
                  <Option v-for="item in comboTypeDict"
                          :value="item.paId"
                          :key="item.paId">{{ item.paName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="拼音简码"
                        prop="paPyCode"
                        style="flex:1;">
                <Input v-model="formData.paPyCode"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="五笔简码"
                        prop="paWbCode"
                        style="flex:1;">
                <Input v-model="formData.paWbCode"
                       size="small"></Input>
              </FormItem>
              <FormItem label="费用类型"
                        prop="paFeeTypeId"
                        style="flex:1;">
                <Select v-model="formData.paFeeTypeId"
                        :label-in-value="true"
                        filterable
                        clearable
                        size="small">
                  <Option v-for="item in expenseTypeDict"
                          :value="item.paId"
                          :key="item.paId"
                          :label="item.paName">
                    <span slot>{{item.paName}}</span>
                  </Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">

              <FormItem label="对应性别"
                        prop="paSex"
                        style="flex:1;">
                <Select v-model="formData.paSex"
                        clearable
                        @on-change="clearSelectItem"
                        size="small">
                  <Option value="男">男</option>
                  <Option value="女">女</option>
                  <Option value="不限">不限</option>
                </Select>
              </FormItem>
              <FormItem label="检查类别"
                        prop="paExamType"
                        style="flex:1;">
                <Select v-model="formData.paExamType"
                        :label-in-value="true"
                        filterable
                        clearable
                        size="small">
                  <Option v-for="item in examDict"
                          :value="item.paTypeName"
                          :key="item.paId"
                          :label="item.paTypeName">
                    <span slot>{{item.paTypeName}}</span>
                  </Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="是否附加收费"
                        style="flex:1;">
                <RadioGroup v-model="formData.paIsOnlyCharge">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="检查子类别"
                        prop="paExamSubType"
                        style="flex:1;">
                <Select v-model="formData.paExamSubType"
                        :label-in-value="true"
                        filterable
                        clearable
                        size="small">
                  <Option v-for="item in examSubTypeDict"
                          :value="item.paExamSubclassName"
                          :key="item.paId"
                          :label="item.paExamSubclassName">
                    <span slot>{{item.paExamSubclassName}}</span>
                  </Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="结束获取"
                        style="flex:1;">
                <RadioGroup v-model="formData.paResultMode">
                  <Radio label="0">手动</Radio>
                  <Radio label="1">导入</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="his项目代码"
                        style="flex:1;"
                        prop="paHisItemCode">
                <Input v-model="formData.paHisItemCode"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="his项目名称"
                        style="flex:1;"
                        prop="paHisItemName">
                <Input v-model="formData.paHisItemName"
                       size="small"></Input>
              </FormItem>
              <FormItem label="his项目规格"
                        style="flex:1;">
                <Input v-model="formData.paHisItemSpec"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="his项目单位"
                        style="flex:1;">
                <Input v-model="formData.paHisUnits"
                       size="small"></Input>
              </FormItem>
              <FormItem label="his项目数量"
                        style="flex:1;">
                <Input v-model="formData.paHisAmount"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <!-- <FormItem label="his执行科室"
                        style="flex:1;">
                <Input v-model="formData.paHisDeptName"
                       size="small"></Input>
              </FormItem> -->
              <FormItem label="his执行科室"
                        prop="paHisDeptId"
                        style="flex:1;">
                <Select v-model="formData.paHisDeptId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="hisImplementChange"
                        size="small">
                  <Option v-for="item in hisImplementDict"
                          :value="item.paId"
                          :key="item.paId">{{ item.paDeptName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="临床类型"
                        style="flex:1;"
                        prop="paClinicalTypeId">
                <Select v-model="formData.paClinicalTypeId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="clinicalChange"
                        size="small">
                  <Option v-for="item in clinicalType"
                          :value="item.paId"
                          :key="item.paId"
                          :label="item.paClinicalTypeName">
                    <span slot>{{ item.paClinicalTypeName }}</span></Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="需要标本"
                        style="flex:1;">
                <RadioGroup v-model="formData.isSpecimen"
                            @on-change="isSpecimenChange">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="标本类型"
                        style="flex:1;"
                        :class="{specimanStar:specimanFlag}"
                        prop="paSpecimenId">
                <Select v-model="formData.paSpecimenId"
                        :label-in-value="true"
                        filterable
                        clearable
                        :disabled="formData.isSpecimen == 0"
                        @on-change="specimanChange"
                        size="small">
                  <Option v-for="item in specimanDict"
                          :value="item.paId"
                          :key="item.paId"
                          :label="item.paSpecimanName">
                    <span slot>{{ item.paSpecimanName }}</span></Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="需要试管"
                        style="flex:1;">
                <RadioGroup v-model="formData.isTestTube"
                            @on-change="isTestTubeChange">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="试管名称"
                        style="flex:1;"
                        :class="{testTubeStar:testTubeFlag}"
                        prop="paTestTubeId">
                <Select v-model="formData.paTestTubeId"
                        :label-in-value="true"
                        filterable
                        clearable
                        :disabled="formData.isTestTube == 0"
                        @on-change="testTubeChange"
                        size="small">
                  <Option v-for="item in testTubeDict"
                          :value="item.paId"
                          :key="item.paId"
                          :label="item.paName">
                    <span slot>{{ item.paName }}</span></Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="需要申请单"
                        style="flex:1;">
                <RadioGroup v-model="formData.paIsRequestForm">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="是否需要抽血"
                        style="flex:1;">
                <Select v-model="formData.paIsBlood"
                        style="width: 180px"
                        clearable
                        size="small">
                  <Option value="抽血">是</option>
                  <Option value="不抽血">否</option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="显示项目标签"
                        style="flex:1;">
                <RadioGroup v-model="formData.paIsBlankLabelShowCombo">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="用餐状态"
                        style="flex:1;">
                <RadioGroup v-model="formData.paIsBeforeMeal">
                  <Radio label="0">餐前</Radio>
                  <Radio label="1">餐后</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="平均检查时间"
                        style="flex:1;">
                <Input v-model="formData.paCheckTime"
                       size="small"></Input>
              </FormItem>

            </Row>
            <Row type="flex">
              <FormItem label="导诊前置科室"
                        prop="paGuideDeptId"
                        style="flex:1;">
                <Select v-model="formData.paGuideDeptId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="guideDeptChange"
                        size="small">
                  <Option v-for="item in roomDict"
                          :value="item.poId"
                          :key="item.poId">{{ item.poDeptName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="对应设备"
                        style="flex:1;">
                <Input v-model="formData.paEquipment"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="执行科室"
                        prop="paExecDeptId"
                        style="flex:1;">
                <Select v-model="formData.paExecDeptId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="execDeptChange"
                        size="small">
                  <Option v-for="item in roomDict"
                          :value="item.poId"
                          :key="item.poId">{{ item.poDeptName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="汇总科室"
                        prop="paAggregateDeptId"
                        style="flex:1;">
                <Select v-model="formData.paAggregateDeptId"
                        :label-in-value="true"
                        filterable
                        clearable
                        @on-change="hzroomChange"
                        size="small">
                  <Option v-for="item in roomDict"
                          :value="item.poId"
                          :key="item.poId">{{ item.poDeptName }}</Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="申请接口单编号"
                        style="flex:1;">
                <Input v-model="formData.paRequestApiNo"
                       size="small"></Input>
              </FormItem>
              <FormItem label="接口类型"
                        style="flex:1;">
                <Select v-model="formData.apiType"
                        clearable
                        size="small">
                  <!-- <Option value="test">test</option> -->
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="报告接口单编号"
                        style="flex:1;">
                <Input v-model="formData.paReportApiNo"
                       size="small"></Input>
              </FormItem>
              <FormItem label="功能类型"
                        style="flex:1;">
                <Select v-model="formData.paFunctionType"
                        clearable
                        @on-change="selectFunction"
                        size="small">
                  <Option :value="1">医生检查</option>
                  <Option :value="2">检验项目</option>
                  <Option :value="3">功能检查</option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="非标项目"
                        style='display:block;flex:1;'>
                <RadioGroup v-model="formData.paPicDisplayMethod">
                  <Radio label="0">是</Radio>
                  <Radio label="1">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="是否外院"
                        style="flex:1;">
                <RadioGroup v-model="formData.paIsOuterCourt">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="自动完成"
                        style="flex:1;">
                <RadioGroup v-model="formData.paIsAutoComplete">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="是否出报告"
                        style="flex:1;">
                <RadioGroup v-model="formData.paIsOutputReport">
                  <Radio label="1">是</Radio>
                  <Radio label="0">否</Radio>
                </RadioGroup>
              </FormItem>

            </Row>
            <Row type="flex">
              <FormItem label="检查诊室"
                        style="flex:1;">
                <Input v-model="formData.paAddressHint"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="温馨提示"
                        style="flex:1;">
                <Input v-model="formData.paGuideHint"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="正常小结"
                        style="flex:1;">
                <Input v-model="formData.paSummary"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="临床意义"
                        style="flex:1;">
                <Input v-model="formData.paClinicalEffective"
                       type="textarea"
                       :autosize="{minRows: 4,maxRows: 4}"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="总价格"
                        style="flex:1;"
                        prop='paPrice'>
                <Input v-model="formData.paPrice"
                       :number='true'
                       @on-change="caculateTotalPrice"
                       size="small"></Input>
              </FormItem>
              <FormItem label="折扣优惠"
                        style="flex:1;"
                        prop='paDiscount'>
                <Select v-model="formData.paDiscount"
                        clearable
                        @on-change="caculateTotalPrice"
                        size="small">
                  <Option v-for="(item,index) in zkPrice"
                          :value="item"
                          :key="index">{{item}}%</option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="折扣总额"
                        style="flex: 0.5;">
                <Input v-model="formData.paDiscountValue"
                       disabled
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="启用状态"
                        style="flex: 0.5;">
                <RadioGroup v-model="formData.paStatus"
                            type="button">
                  <Radio label="1">启用</Radio>
                  <Radio label="0">停用</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <!-- <div style='display:flex;justify-content:space-between;width:98%'>
                  <span class='button'>
                    <Button size='small'>停用</Button>
                    <Button size='small'
                            type="error">删除</Button>
                  </span>
                  <div style=''
                       class='button'>
                    <Button size='small'>取消</Button>
                    <Button size='small'
                            type="primary">保存</Button>
                  </div>
                </div> -->
          </Form>
        </div>
        <div class="unselected-item-wrapper">
          <div class="title-wrapper">
            <p class="title">
              <span>体检项目明细</span>
            </p>
            <div class="title-right-tool">
              <Input search
                     enter-button
                     style="width: 200px"
                     v-model="itemName"
                     size="small"
                     @on-search="getRoomItemList()"
                     placeholder="搜索体检项目" />
              <p style="padding: 0 10px;">已选择：<span>{{selections.length}}</span>项</p>
            </div>
          </div>
          <div class="main-wrapper">
            <vxe-table class="mytable-footer"
                       ref="table"
                       border
                       show-footer
                       show-overflow
                       :auto-resize="true"
                       highlight-hover-row
                       highlight-current-row
                       row-class-name="table-row"
                       :cell-class-name="itemColor"
                       header-row-class-name="table-row"
                       :height="800"
                       :data="tableData"
                       align="center"
                       size="small"
                       @checkbox-all="selectAllChange"
                       @checkbox-change="selectRowChange"
                       :checkbox-config="{trigger: 'row'}"
                       :loading="isLoading">
              <vxe-table-column type="checkbox"
                                width="60"></vxe-table-column>
              <vxe-table-column field="paItemName"
                                title="体检项目"
                                min-width="140"></vxe-table-column>
              <vxe-table-column field="paSex"
                                width="80"
                                title="性别"></vxe-table-column>
              <vxe-table-column field="action"
                                title="检查次数"
                                width="160">
                <template v-slot="{ row,index }">
                  <div class="number-wrapper">
                    <Button @click.stop="reduceNumber(row,index)"
                            type="primary"
                            :disabled="disabled"
                            size="small"><span style="width: 10px;display: inline-block;">-</span></Button>
                    <Input v-model="row.paNumber"
                           type="number"
                           style="text-align: center;"
                           @on-change.stop="itemNumberChange(row, index)"
                           size="small"></Input>
                    <Button @click.stop="addNumber(row,index)"
                            type="primary"
                            size="small"><span style="width: 10px;display: inline-block;">+</span></Button>
                  </div>
                </template>
              </vxe-table-column>
            </vxe-table>
            <!-- <Table :columns="columnGroup"
                   :loading="isLoading"
                   height="800"
                   ref="table"
                   @on-select-cancel="cancelSelect"
                   @on-select="selectChange"
                   :data="tableData">
              <template slot="action"
                        slot-scope="{row,index}">
                <div class="number-wrapper">
                  <Button @click="reduceNumber(row,index)"
                          type="primary"
                          :disabled="disabled"
                          size="small"><span style="width: 10px;display: inline-block;">-</span></Button>
                  <Input v-model="row.paNumber"
                         type="number"
                         style="text-align: center;"
                         @on-change="itemNumberChange(row, index)"
                         size="small"></Input>
                  <Button @click="addNumber(row,index)"
                          type="primary"
                          size="small"><span style="width: 10px;display: inline-block;">+</span></Button>
                </div>
              </template>
            </Table> -->
          </div>
        </div>
        <!-- <Row style='width:100%'
             :gutter='6'>
          <Col span='12'>

          <div class="title-main">

          </div>

          </Col>
          <Col span='12'>
          <Card class='body-left'>
            <div slot="title"
                 class="search-title-wrapper">
              <span class="title">体检项目组合</span>
            </div>
            <span slot='extra'>已选择:{{12}}项</span>
            <div class='body-left-main'>

            </div>
          </Card>
          </Col>
        </Row> -->

      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="saveLoading"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { save, roomItemList, comboItemList, sortByDeptId } from '@/api/itemGroupManage.js'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    const specimanRequire = (rule, value, callback) => {
      if (!value && this.specimanFlag) {
        callback(new Error('请选择标本类型'))
      } else {
        callback()
      }
    }
    const testTubeRequire = (rule, value, callback) => {
      if (!value && this.testTubeFlag) {
        callback(new Error('请选择试管颜色'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        paSort: [{ required: true, type: 'number', message: '请输入数字' }],
        paDeptId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        paComboName: [{ required: true, message: '请输入组合名称', trigger: 'blur' }],
        paComboTypeId: [{ required: true, message: '请选择组合分类', trigger: 'change' }],
        paPyCode: [{ required: true, message: '请输入拼音简码', trigger: 'blur' }],
        paWbCode: [{ required: true, message: '请输入五笔简码', trigger: 'blur' }],
        paSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        paFeeTypeId: [{ required: true, message: '请选择费别', trigger: 'change' }],
        paExamType: [{ required: true, message: '请选择检查类型', trigger: 'change' }],
        // paExamSubType: [{ required: true, message: '请选择检查子类', trigger: 'change' }],
        // paHisItemCode: [{ required: true, message: '请输入项目代码', trigger: 'blur' }],
        // paHisItemName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        // paHisDeptId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        // paGuideDeptId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        // paExecDeptId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        // paAggregateDeptId: [{ required: true, message: '请选择科室', trigger: 'change' }],
        paTestTubeId: [{ validator: testTubeRequire, trigger: 'change' }],
        paSpecimenId: [{ validator: specimanRequire, trigger: 'change' }],
        paDiscount: [{ required: true, type: 'number', message: '请选折扣', trigger: 'change' }]
      },
      zkPrice: [100],
      disabled: false,
      columnGroup: [
        {
          type: 'selection',
          width: 55,
          align: 'center'
        },
        {
          title: '体检项目',
          key: 'paItemName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '性别',
          key: 'paSex',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '检查次数',
          slot: 'action',
          width: 160,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData: [],
      formData: {},
      isLoading: false,
      saveLoading: false,
      status: 0,
      selections: [],
      specimanFlag: true, // 动态控制标本类型必填项
      testTubeFlag: true, // 动态控制试管类型必填项
      itemName: '', // 搜索体检项目明细、
      text: '', // 所在科室名称
      selectAllBtn: false // 全选标志，用于解决无法全选时导致无法取消当前的所有选择
    }
  },
  watch: {
    // tableData: {
    //   deep: true,
    //   handler: function (newVal, oldVal) {
    //     console.log(1)
    //     this.selections.forEach(item => {
    //       for (let i = 0; i < this.tableData.length; i++) {
    //         if (item.paId == this.tableData[i].paId) {
    //           this.tableData[i]._checked = true
    //           break
    //         }
    //       }
    //     })
    //   }
    // }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '添加项目组合' : '修改项目组合')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    comboTypeDict: {
      get: function () {
        return this.$store.getters.getComboTypeDict
      },
      set: function () { }
    },
    expenseTypeDict: {
      get: function () {
        return this.$store.getters.getExpenseTypeDict
      },
      set: function () { }
    },
    examDict: {
      get: function () {
        return this.$store.getters.getExamType
      },
      set: function () { }
    },
    examSubTypeDict: {
      get: function () {
        return this.$store.getters.getExamSubTypeDict
      },
      set: function () { }
    },
    specimanDict: {
      get: function () {
        return this.$store.getters.getSpeciman
      },
      set: function () { }
    },
    clinicalType: {
      get: function () {
        return this.$store.getters.getClinicalType
      },
      set: function () { }
    },
    testTubeDict: {
      get: function () {
        return this.$store.getters.getTestTubeDict
      },
      set: function () { }
    },
    hisImplementDict: {
      get: function () {
        return this.$store.getters.getHisImplementDict
      },
      set: function () { }
    }
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
    this.$store.dispatch('getComboTypeDict')
    this.$store.dispatch('getExpenseTypeDict', true)
    this.$store.dispatch('getExamType')
    this.$store.dispatch('getExamSubTypeDict')
    this.$store.dispatch('getSpecimanDict')
    this.$store.dispatch('getClinicalType')
    this.$store.dispatch('getTestTubeDict')
    this.$store.dispatch('getHisImplementDict')
  },
  methods: {
    selectFunction (e) {
      this.formData.paFunctionType = e
    },
    // 增加检查次数
    addNumber (row, index) {
      let num = Number(row.paNumber)
      row.paNumber = ++num
      this.tableData[index] = row
      // let len = this.selections.findIndex(item => item.paId == row.paId)
      // if (len != -1) {
      //   this.selections[len].paNumber = row.paNumber
      // }
    },
    // 减少检查次数
    reduceNumber (row, index) {
      if (row.paNumber <= 1) {
        return false
      }
      let num = Number(row.paNumber)
      row.paNumber = --num
      this.tableData[index] = row
      // let len = this.selections.findIndex(item => item.paId == row.paId)
      // if (len != -1) {
      //   this.selections[len].paNumber = row.paNumber
      // }
    },
    // 关闭弹窗
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.tableData = []
      // this.selections = []
      this.$emit('close')
    },
    // 清空已选项目
    clearSelectItem () {
      // this.selections = []
      this.$set(this.formData, 'paPrice', 0)
      this.$refs.table.setAllCheckboxRow(false)
      this.selections = this.$refs.table.getCheckboxRecords()
    },
    // 保存
    save () {
      if (this.selections.length == 0) {
        this.$Message.error('项目组合包含的项目个数不能为0')
        return false
      }
      this.formData = Object.assign({ paExamSubType: '', paHisItemCode: '', paHisItemName: '' }, this.formData)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          this.formData.packageComboList = this.selections
          save(this.formData).then(({ data }) => {
            this.saveLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$emit('close')
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
    // 根据科室查找项目组合
    getRoomItemList () {
      // this.selections = []
      let params = {
        text: this.formData.paDeptName,
        itemName: this.itemName
      }
      this.isLoading = true
      roomItemList(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data
          // 处理显示已经勾选中的行
          let arr = []
          this.selections.forEach(ele => {
            for (let i = 0; i < this.tableData.length; i++) {
              if (ele.paId == this.tableData[i].paId) {
                this.tableData[i].paNumber = ele.paNumber
                arr.push(this.tableData[i])
                break
              }
            }
            // let _arr = this.tableData.filter(item => {
            //   return ele.paId == item.paId
            // })
            // if (_arr.length > 0) {
            //   arr.push(_arr[0])
            // }
          })
          this.$refs.table.setCheckboxRow(arr, true)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },
    getItemList (_row) {
      let row = JSON.parse(JSON.stringify(_row))
      if (Object.keys(row).length == 0) {
        this.formData = {
          paStatus: '1',
          paIsOutputReport: '1',
          isSpecimen: '1',
          isTestTube: '1',
          paIsOuterCourt: '0',
          paIsRequestForm: '0',
          paResultMode: '0',
          paIsBeforeMeal: '0',
          paPicDisplayMethod: '1',
          paIsAutoComplete: '1',
          paIsOnlyCharge: '0',
          paIsBlankLabelShowCombo: '0',
          paId: ''
        }
        this.specimanFlag = true
        this.testTubeFlag = true
      } else {
        this.formData = row
        // 判断是否需要标本
        if (row.paSpecimenId && row.paSpecimenId !== null) {
          this.$set(this.formData, 'isSpecimen', '1')
          this.specimanFlag = true
        } else {
          this.$set(this.formData, 'isSpecimen', '0')
          this.specimanFlag = false
        }
        console.log(this.formData)
        // 判断是否抽血
        if (row.paTestTubeId && row.paTestTubeId !== null) {
          this.$set(this.formData, 'isTestTube', '1')
          this.testTubeFlag = true
        } else {
          this.$set(this.formData, 'isTestTube', '0')
          this.testTubeFlag = false
        }
        // this.getRoomItemList(row.paDeptName)
        let params = {
          comboId: row.paId
        }
        this.isLoading = true
        roomItemList({ text: row.paDeptName }).then(({ data }) => {
          if (data.code == 0) {
            let tableData = data.data
            comboItemList(params).then(({ data }) => {
              this.isLoading = false
              if (data.code == 0) {
                let result = data.data
                let order = 0
                let value
                let arr = [] // 保存选择的项目组合
                for (let i = 0; i < result.length; i++) {
                  for (let j = 0; j < tableData.length; j++) {
                    if (result[i].paId == tableData[j].paId) {
                      // tableData[j].checked = true
                      tableData[j].order = order
                      tableData[j].paNumber = result[i].paNumber
                      arr.push(tableData[j])
                      order++
                      value = tableData.splice(j, 1)
                      tableData.unshift(value[0])
                      break
                    }
                  }
                }
                this.tableData = tableData
                this.$refs.table.setCheckboxRow(arr, true)
                this.$nextTick(() => {
                  this.selections = this.$refs.table.getCheckboxRecords()
                })
              } else {
                this.$Message.error(data.message)
              }
            })
          } else {
            this.isLoading = false
            this.$Message.error(data.message)
          }
        }).catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }
    },
    // 选中行操作
    selectRowChange (_row) {
      if (!this.formData.paSex || this.formData.paSex == '') {
        this.$Message.error('请选择先选择组合对应性别！')
        this.$refs.table.setAllCheckboxRow(false)
        return false
      }
      if (_row.row.paSex != '不限' && _row.row.paSex != this.formData.paSex && this.formData.paSex != '不限') {
        this.$Message.error('体检项目与组合性别不匹配，无法选择！')
        this.$refs.table.setCheckboxRow(_row.row, false)
      }

      // 取消勾选时，删除selections内的对应项
      if (!_row.checked) {
        let idx = this.selections.findIndex(ele => {
          return ele.paId == _row.row.paId
        })

        if (idx > -1) {
          this.selections.splice(idx, 1)
        }
      } else {
        let selectedData = this.$refs.table.getCheckboxRecords()
        selectedData.forEach(ele => {
          let _arr = this.selections.filter(item => {
            return ele.paId == item.paId
          })
          if (_arr.length == 0) {
            this.selections.push(ele)
          }
        })
      }
      let totalPrice = 0

      // this.selections = this.$refs.table.getCheckboxRecords()
      for (let i of this.selections) {
        // totalPrice += i.paPrice
        totalPrice = Number.prototype.add(totalPrice, i.paPrice)
      }
      console.log(totalPrice)

      this.$set(this.formData, 'paPrice', totalPrice)
      this.caculateTotalPrice()
    },
    // 全选操作
    selectAllChange (obj) {
      this.selectAllBtn = !this.selectAllBtn
      if (!this.formData.paSex || this.formData.paSex == '') {
        this.$Message.error('请选择先选择组合对应性别！')
        this.$refs.table.setAllCheckboxRow(false)
        return false
      }

      let selectArr = obj.selection
      selectArr.forEach(ele => {
        if (ele.paSex != '不限' && ele.paSex != this.formData.paSex && this.formData.paSex != '不限') {
          this.$refs.table.setCheckboxRow(ele, false)
        }
      })

      // 取消全选时，删除selections内的对应项
      if (!obj.checked || !this.selectAllBtn) {
        this.selections = []
        this.$refs.table.setAllCheckboxRow(false)
      } else {
        let selectedData = this.$refs.table.getCheckboxRecords()
        this.selections = selectedData
      }
      let totalPrice = 0

      // this.selections = this.$refs.table.getCheckboxRecords()
      for (let i of this.selections) {
        totalPrice += i.paPrice
      }

      this.$set(this.formData, 'paPrice', totalPrice)
      this.caculateTotalPrice()
    },
    // 更改细项数量
    itemNumberChange (row, index) {
      this.tableData[index] = row
    },
    caculateTotalPrice () {
      let discount = this.formData.paDiscount
      // console.log(discount)
      let totalPrice = this.formData.paPrice
      if (totalPrice && !discount) {
        let price = (totalPrice * 100) / 100
        this.$set(this.formData, 'paDiscountValue', price.toFixed(2))
      } else if (totalPrice && discount) {
        let price = (totalPrice * discount) / 100
        this.$set(this.formData, 'paDiscountValue', price.toFixed(2))
      } else {
        this.$set(this.formData, 'paDiscountValue', 0)
      }
    },
    // 是否需要标本
    isSpecimenChange (val) {
      if (val == 0) {
        this.$set(this.formData, 'paSpecimenId', '')
        this.$set(this.formData, 'paSpecimenName', '')
        this.$set(this.formData, 'isSpecimen', '0')
        this.specimanFlag = false
      } else {
        this.$set(this.formData, 'isSpecimen', '1')
        this.specimanFlag = true
      }
    },
    // 是否需要试管
    isTestTubeChange (val) {
      if (val == 0) {
        this.$set(this.formData, 'paTestTubeId', '')
        this.$set(this.formData, 'paTestTube', '')
        this.$set(this.formData, 'isTestTube', '0')
        this.testTubeFlag = false
      } else {
        this.$set(this.formData, 'isTestTube', '1')
        this.testTubeFlag = true
      }
    },

    // 所在科室
    belongDeptChange (obj) {
      this.itemName = ''
      if (obj) {
        this.formData.paDeptName = obj.label
      } else {
        return false
      }
      if (this.showTitle == '添加项目组合' && obj) {
        sortByDeptId({ deptId: obj.value }).then(({ data }) => {
          if (data.code == 0) {
            console.log(data)
            this.$set(this.formData, 'paSort', data.data.sort)
            console.log(this.formData.paSort)
          } else {
            this.$Message.error(data.message)
          }
        }).catch(err => {
          this.$Message.error('网络不稳定,请稍后重试')
        })
      }
      this.getRoomItemList()
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.paComboName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'paPyCode', result.py)
          this.$set(this.formData, 'paWbCode', result.wb)
        }
      })
    },
    // 修改表格中检验科项目颜色
    itemColor ({ row, column }) {
      if (column.property === 'paItemName') {
        return 'table-column-align'
      }
    },
    // 汇总科室
    hzroomChange (obj) {
      if (obj) {
        this.formData.paAggregateDept = obj.label
      }
    },
    // 执行科室
    execDeptChange (obj) {
      if (obj) {
        this.formData.paExecDept = obj.label
      }
    },
    // his执行科室
    hisImplementChange (obj) {
      if (obj) {
        this.formData.paHisDeptName = obj.label
      }
    },
    // 导诊前置科室
    guideDeptChange (obj) {
      if (obj) {
        this.formData.paGuideDept = obj.label
      }
    },
    // 试管类型
    testTubeChange (obj) {
      if (obj) {
        this.formData.paTestTube = obj.label
      }
    },
    // 临床类型
    clinicalChange (obj) {
      if (obj) {
        this.formData.paClinicalTypeName = obj.label
      }
    },
    // 标本类型
    specimanChange (obj) {
      if (obj) {
        this.formData.paSpecimenName = obj.label
      }
    },
    // 组合分类
    comboTypeChange (obj) {
      if (obj) {
        this.formData.paComboTypeName = obj.label
      }
    },
    chargeTypeChange (obj) {
      if (obj) {
        this.formData.paExamType = obj.label
      }
    }
  }
}
</script>

<style lang="less">
.item-group-manage-edit {
  .ivu-form-item {
    margin-bottom: 20px;
  }
  .ivu-input[disabled] {
    color: #333;
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
  .modal-body {
    width: 100%;
    margin: 0 auto;
    display: flex;
    .form-wrapper {
      width: 600px;
      padding-right: 10px;
      /*动态必填项className*/
      .testTubeStar .ivu-form-item-label:before,
      .specimanStar .ivu-form-item-label:before {
        content: '*';
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
      }
    }
    .table-column-align {
      text-align: left;
    }
    .unselected-item-wrapper {
      margin-left: 10px;
      border-left: 1px solid #e5e5e5;
      padding-left: 10px;
      flex: 1;
      max-width: 660px;
      .title-wrapper {
        padding: 12px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .main-wrapper {
        width: 100%;
        .number-wrapper {
          display: flex;
          justify-content: center;
          .ivu-input {
            text-align: center;
          }
          .ivu-input-wrapper {
            width: 60px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
          }
          /* 谷歌 */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            appearance: none;
            margin: 0;
          }
          /* 火狐 */
          input {
            -moz-appearance: textfield;
          }
        }
        .ivu-btn-default {
          color: #2d8cf0;
          border-color: #2d8cf0;
        }
        .ivu-btn[disabled] {
          color: #c5c8ce;
          background-color: #f7f7f7;
          border-color: #dcdee2;
        }
      }
      .room-selected-wrapper {
        width: 200px;
        .room-list-wrapper {
          margin-top: 15px;
          max-height: 500px;
          overflow-y: auto;
          li {
            padding-left: 10px;
            height: 32px;
            line-height: 32px;
            &:hover {
              color: #57a3f3;
              cursor: pointer;
            }
          }
          li.is-actived {
            color: #2d8cf0;
            background-color: #f0faff;
          }
        }
        ul::-webkit-scrollbar {
          width: 5px;
          background-color: #eee;
        }
        ul::-webkit-scrollbar-button {
          display: none;
        }
        ul::-webkit-scrollbar-corner {
          display: none;
        }
        ul::-webkit-scrollbar-thumb {
          border-radius: 5px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #e8e8e8;
        }
      }
    }
  }
}
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
</style>
