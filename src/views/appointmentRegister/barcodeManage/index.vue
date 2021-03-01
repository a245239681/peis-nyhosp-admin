<template>
  <div class="barcode-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">条码标签管理</span>
      </div>
      <div class="main-body">
        <div class="main-body-wrapper">
          <div class="main-left-part">
            <div class="guide-tree-wrapper">
              <div class="flex-wrapper">
                <Input search
                       enter-button
                       placeholder="搜索公司"
                       v-model="filterText" />
                <Button style="margin: 1px 10px 1px 10px;"
                        size="small"
                        @click="deptOrGroupChange"
                        type="primary">
                  <Icon type="md-swap" />{{treeType == 1 ? '切换部门': '切换分组'}}
                </Button>
              </div>
              <ButtonGroup style='margin:15px 0;width:100%'>
                <Button style="width: 50%"
                        @click="show"
                        type="default">
                  <Icon type="ios-arrow-down"
                        @click="show"></Icon>
                  全部展开
                </Button>
                <Button style="width: 50%"
                        @click="hide"
                        type="default">
                  全部收起
                  <Icon type="ios-arrow-up"
                        @click="hide"></Icon>
                </Button>
              </ButtonGroup>
              <div class="guide-tree">
                <vue-selecttree class="filter-tree"
                                node-key="id"
                                :data="treeData"
                                :props="defaultProps"
                                :highlight-current="true"
                                :default-expand-all="isexpand"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick"
                                ref="tree"></vue-selecttree>
              </div>
            </div>
          </div>
          <div class="main-right-part">
            <!-- <div class="main-right-content"> -->
            <div class="guide-table-form-wrapper">
              <Form :model="form"
                    label-position="right"
                    ref="dataForm"
                    :label-width="60">
                <Row :gutter="16">
                  <Col span="8">
                  <Row :gutter="16">
                    <Col span="14">
                    <FormItem label="姓名"
                              :label-width="90"
                              prop="medicalName">
                      <Input v-model="form.medicalName"
                             size="small"
                             clearable />
                    </FormItem>
                    </Col>
                    <Col span="10">
                    <FormItem label="性别"
                              prop="boSex"
                              :label-width="40">
                      <Select v-model="form.boSex"
                              size="small">
                        <Option value="不限">不限</Option>
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                      </Select>
                    </FormItem>
                    </Col>
                  </Row>
                  </Col>
                  <Col span="7">
                  <Row :gutter="16">
                    <Col span="13">
                    <FormItem label="年龄"
                              prop="boAgeStart"
                              :label-width="60">
                      <Input v-model="form.boAgeStart"
                             type="number"
                             size="small"
                             clearable></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="到"
                              prop="boAgeEnd"
                              :label-width="28">
                      <Input v-model="form.boAgeEnd"
                             type="number"
                             size="small"
                             clearable></Input>
                    </FormItem>
                    </Col>
                  </Row>
                  </Col>
                  <Col span="9">
                  <Row :gutter="16">
                    <Col span="13">
                    <FormItem label="体检编号"
                              prop="boPeIdStart"
                              :label-width="80">
                      <Input v-model="form.boPeIdStart"
                             size="small"
                             type="number"
                             clearable></Input>
                    </FormItem>
                    </Col>
                    <Col span="11">
                    <FormItem label="到"
                              prop="boPeIdEnd"
                              :label-width="28">
                      <Input v-model="form.boPeIdEnd"
                             size="small"
                             type="number"
                             clearable></Input>
                    </FormItem>
                    </Col>
                  </Row>
                  </Col>

                </Row>
                <Row :gutter="16">
                  <Col span="5">
                  <FormItem label="登记日期"
                            :label-width="80"
                            prop="boRegisterDateStart">
                    <DatePicker type="date"
                                v-model="form.boRegisterDateStart"
                                size="small"></DatePicker>
                  </FormItem>
                  </Col>
                  <Col span="4">
                  <FormItem label="到"
                            :label-width="36"
                            prop="boRegisterDateEnd">
                    <DatePicker type="date"
                                v-model="form.boRegisterDateEnd"
                                size="small"></DatePicker>
                  </FormItem>
                  </Col>
                  <Col span="5">
                  <FormItem label="试管类型"
                            prop="boApplyTypeId"
                            :label-width="80">
                    <Select v-model="form.boApplyTypeId"
                            filterable
                            clearable
                            @on-change="changeApplyType"
                            size="small">
                      <Option v-for="item in testTubeDict"
                              :value="item.paId"
                              :key="item.paId">{{
                        (item.paName ? item.paName : '') + (item.paSpecification ? '-' + item.paSpecification : '') +
                        (item.paColor ? '-' + item.paColor : '') }}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <!-- <Col span="6">
                    <FormItem label="体检科室"
                              prop="boDeptId"
                              :label-width="80">
                      <Select v-model="form.boDeptId"
                              filterable
                              size="small"
                              clearable
                              @on-change="changeDept"
                              :label-in-value="true">
                        <Option v-for="item in deptList"
                                :value="item.poId"
                                :key="item.poId">{{ item.poDeptName }}</Option>
                      </Select>
                    </FormItem>
                    </Col> -->
                  <Col span="4">
                  <FormItem label="空白标签"
                            prop="labelNum"
                            :label-width="80">
                    <Input v-model="form.labelNum"
                           size="small"
                           clearable></Input>
                  </FormItem>
                  </Col>
                  <Col span="6">
                  <FormItem label="组合项目"
                            prop="boComboId"
                            :label-width="80">
                    <Select v-model="form.boComboId"
                            placeholder="简码或名称搜索"
                            filterable
                            size="small"
                            remote
                            clearable
                            @on-change="comboChange"
                            :remote-method="searchCombo"
                            :loading="comboLoading">
                      <Option v-for="item in comboList"
                              :value="item.id"
                              :key="item.id">{{item.comboName}}</Option>
                    </Select>
                  </FormItem>
                  </Col>
                </Row>
                <Row :gutter="16">
                  <Col span="6">
                  <FormItem label="登记流水号"
                            :label-width="90">
                    <Input v-model="form.boRegisterCode"
                           clearable
                           ref="inputFocus"
                           @on-enter="getList"
                           size="small" />
                  </FormItem>
                  </Col>
                </Row>
                <Row :gutter="16"
                     type="flex"
                     justify="end">
                  <div class="handle-wrapper">
                    <div class="switch-wrapper"
                         style="margin-right: 20px;">
                      单独查询空白标签：
                      <i-switch size="large"
                                @on-change="isBlankBarcodeChange">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                      </i-switch>
                    </div>
                    <Button type="primary"
                            :loading="isLoading"
                            @click="getList">查询</Button>
                    <Button type="primary"
                            @click="$refs.barCodeTable.setAllSelection(true)"
                            style="margin-left: 8px;">全选</Button>
                    <Button type="primary"
                            @click="toggleSelectHandle"
                            style="margin-left: 8px;">反选</Button>
                    <Button type="primary"
                            @click="print"
                            :loading="isPrintLoading"
                            v-permission="['print']"
                            style="margin-left: 8px;">批量打印</Button>
                  </div>
                </Row>
              </Form>
            </div>
            <div class="barcode-wrapper">
              <!-- <div class="barcode-body">
                  <Spin fix
                        v-if="isLoading"></Spin>
                  <div class="empty-barcode"
                       v-if="listData.length == 0 && isLoading == false">暂无数据，请输入条件查询条码信息</div>
                  <div class="barcode-item"
                       :class="{'is-active' : item.isSelected}"
                       v-else
                       v-for="(item, index) in listData"
                       @click="selectItemHandle(index)"
                       :key="item.boId">
                    <div class="barcode-icon">
                      <img src="@/assets/images/barcode_icon.png"
                           alt="条码标签">
                    </div>
                    <div class="barcode-content">
                      <p>
                        <span>{{item.boBarcode}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{{item.unitAbbreviation}}</span>-
                        <span>{{item.personnelSort}}</span>
                      </p>
                      <p>
                        <span>{{item.medicalName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{{item.sex}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{{item.age}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span v-if="item.priority">{{item.priority}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>{{item.boIsAdditional}}</span>
                      </p>
                      <p>
                        <span>{{item.specimanName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{{item.inVitroName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{{item.specification}}</span>
                      </p>
                      <p class="exam-item-name">
                        <span v-for="(subItem, index) in item.comboNameList"
                              :key="index">{{index == item.comboNameList.length - 1 ? subItem : subItem + '、'}}</span>
                      </p>
                      <Icon class="icon-mark"
                            type="md-checkmark-circle"
                            size="24"
                            style="color: #2d8cf0;" />
                    </div>
                  </div>
                </div> -->
              <vxe-table ref="barCodeTable"
                         style="margin-top: 20px;"
                         border
                         resizable
                         show-overflow
                         show-header-overflow
                         highlight-hover-row
                         highlight-current-row
                         align="center"
                         @cell-click="cellClickHandle"
                         :height="(screenHeight - 385) <= 350 ? 550 : (screenHeight - 385)"
                         :loading="isLoading"
                         :checkbox-config="{ trigger: 'row',  highlight: true, range: true}">
                <vxe-table-column type="checkbox"
                                  fixed="left"
                                  width="60"></vxe-table-column>
                <vxe-table-column type="index"
                                  title="序号"
                                  width="80"></vxe-table-column>
                <vxe-table-column field="boPeId"
                                  title="体检编号"
                                  min-width="140"></vxe-table-column>
                <vxe-table-column field="unitAbbreviation"
                                  title="单位名称"
                                  min-width="120"></vxe-table-column>
                <vxe-table-column field="registerCode"
                                  title="流水号"
                                  min-width="160"></vxe-table-column>
                <vxe-table-column field="medicalName"
                                  title="姓名"
                                  min-width="100"></vxe-table-column>
                <vxe-table-column field="sex"
                                  title="性别"
                                  min-width="60"></vxe-table-column>
                <vxe-table-column field="age"
                                  title="年龄"
                                  min-width="60"></vxe-table-column>
                <vxe-table-column field="boBarcode"
                                  title="条码编号"
                                  min-width="180"></vxe-table-column>
                <vxe-table-column field="comboNameList"
                                  title="项目组合"
                                  :formatter="formatItem"
                                  min-width="180"></vxe-table-column>
                <vxe-table-column field="specimanName"
                                  title="样本"
                                  min-width="120"></vxe-table-column>
                <vxe-table-column field="inVitroName"
                                  title="试管"
                                  min-width="140"></vxe-table-column>
                <vxe-table-column field="priority"
                                  title="优先级"
                                  :formatter="formatPriority"
                                  min-width="100"></vxe-table-column>
              </vxe-table>

              <div class="barcode-title">
                总计：<span>{{totalPerson}}</span>人，<span>{{totalSize}}</span>条条码数据
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import vueSelecttree from '@/components/vue-selecttree'
import { listAllByUnitId, listByName, getItemByPage } from '@/api/personal_register.js'
import { UnitInfoTreeData } from '@/api/appointmentUnitManage.js'
import { UnitDeptTreeData } from '@/api/unitManage_unitDeptManage'
import { clearTimeout, setTimeout } from 'timers'
import { checkBarcode, barcodePrint, barcodePrintMore } from '@/api/barcodeManage.js'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import { getPrinterConfigFromLocalstorage } from '@/libs/util'

import moment from 'moment'

export default {
  name: 'guideSheetManage',
  components: {
    vueSelecttree
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {
        medicalName: '',
        boSex: '',
        labelNum: '',
        boVisitSn: '',
        boUnitId: '',
        personal: '1',
        boRegisterDateStart: '',
        boRegisterDateEnd: '',
        boPeIdStart: '',
        boPeIdEnd: '',
        boGroupingId: '',
        boDeptId: '',
        boComboId: '',
        boApplyTypeId: '',
        unitOrPersonal: '1', // 1-全部；2-个人；3-单位
        isBlankBarcode: '1'

      },
      // tableColumn:[
      //   { type: '序号', width: 50 }
      // ],
      totalSize: 0,
      totalPerson: 0,
      isLoading: false,
      selections: [], // 表格选中项
      unitsList: [],
      groupsList: [],
      comboList: [],
      unitNameLoading: false,
      isPersonalActive: false,
      comboLoading: false,
      timer: null,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isexpand: false,
      boVisitSn: '',
      unitName: '',
      unitId: '',
      parentId: '', // 父级部门id
      subDeptId: '', // 子部门id
      filterText: '',
      boVisitSn: '',
      unitName: '',
      unitId: '',
      listData: [],
      isPrintLoading: false,
      treeType: 1, // 单位树切换，1位分组，2为部门
    }
  },
  computed: {
    deptList: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    testTubeDict: {
      get: function () {
        return this.$store.getters.getTestTubeDict
      },
      set: function () { }
    }
  },
  watch: {
    // 节点过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    },
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
    // 获取科室
    this.$store.dispatch('getRoomDict')
    this.getTreeData()
    this.$store.dispatch('getTestTubeDict')
    let printConfig = getPrinterConfigFromLocalstorage()
    if (printConfig.hasOwnProperty('labelNum')) {
      this.form.labelNum = printConfig.labelNum.toString()
    } else {
      this.form.labelNum = '1'
    }

    let curDate = moment().format('YYYY-MM-DD')
    this.form.boRegisterDateStart = curDate
    this.form.boRegisterDateEnd = curDate
    // 聚焦文本框
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
  },
  methods: {
    // 是否单独查询空白标签开关
    isBlankBarcodeChange (status) {
      if (status) {
        this.form.isBlankBarcode = '0'
      } else {
        this.form.isBlankBarcode = '1'
      }
    },
    searchCombo (query) {
      this.comboLoading = true
      // 节流搜索
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (query !== '') {
          let pagination = {
            page: 1,
            size: 200
          }
          let params = {
            keyword: query.trim(),
            paDeptId: '',
            paFlag: '1'
          }
          getItemByPage(pagination, params).then(({ data }) => {
            // console.log(data);
            if (data.code == 0) {
              this.comboLoading = false
              this.comboList = data.data.records
            } else {
              this.comboLoading = false
              this.$Message.error(result.message)
            }
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
      }, 300)
    },
    changeDept (e) {
      if (e) {
        this.form.boDeptId = e.value
        this.form.boDeptName = e.label
      } else {
        this.form.boDeptId = ''
        this.form.boDeptName = ''
      }
    },
    changeApplyType (e) {
      if (!e) {
        this.form.boApplyTypeId = ''
      }
    },
    comboChange (e) {
      if (!e) {
        this.form.boComboId = ''
      }
    },
    getList () {
      let reg = /^\d+$/
      let num = this.form.labelNum
      if (num && !reg.test(num)) {
        this.$Message.warning('空白标签个数输入不合法，请重新输入')
        return false
      } else if (num > 10) {
        this.$Message.warning('空白标签个数不能大于10个')
        return false
      }
      if (this.form.unitOrPersonal == '1' && (this.form.boRegisterDateEnd == '' || this.form.boRegisterDateStart == '')) {
        this.$Message.warning('请输入登记日期')
        return false
      }
      // 格式化时间
      this.form.boRegisterDateStart = this.form.boRegisterDateStart != '' ? moment(this.form.boRegisterDateStart).format('YYYY-MM-DD') : ''
      this.form.boRegisterDateEnd = this.form.boRegisterDateEnd != '' ? moment(this.form.boRegisterDateEnd).format('YYYY-MM-DD') : ''

      this.isLoading = true
      checkBarcode(this.form).then(({ data }) => {
        if (data.code == 0) {
          let arr = data.data.barcodeApplyList
          this.totalSize = data.data.barcodeTotal
          this.totalPerson = data.data.peopleTotal
          let xTable = this.$refs.barCodeTable
          xTable.reloadData(arr).then(() => {
            this.isLoading = false
            this.$refs.barCodeTable.setAllSelection(true)
          })
        } else {
          this.isLoading = false
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    print () {
      let params = this.$refs.barCodeTable.getSelectRecords()

      if (params.length == 0) {
        this.$Message.error('请选择需要打印的条码')
        return false
      }
      if (!printNotice()) return false
      this.isPrintLoading = true
      let printConfig = getPrinterConfigFromLocalstorage()
      // 如果是浏览器，请求不分割PDF接口。 如果是插件，请求分割PDF接口
      if (printConfig.browserPreview) {
        barcodePrint(params).then(({ data }) => {
          console.log(data)
          this.isPrintLoading = false
          if (data.code == 0) {
            let printParams = {
              barcodeUrl: this.$url + data.data,
              selGroup: ['printSampleCode']
            }
            printMethods(printParams.barcodeUrl, printParams)
          } else {
            this.$Message.error(data.message)
          }
        }).catch(err => {
          console.log(err)
          this.isPrintLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      } else {
        barcodePrintMore(params).then(({ data }) => {
          console.log(data)
          this.isPrintLoading = false
          if (data.code == 0) {
            let result = data.data.map(item => {
              return item = this.$url + item
            })
            console.log(result)
            let printParams = {
              barcodeUrl: result,
              selGroup: ['printSampleCode']
            }
            printMethods(printParams.barcodeUrl, printParams)
          } else {
            this.$Message.error(data.message)
          }
        }).catch(err => {
          console.log(err)
          this.isPrintLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }
    },

    // 选中需要打印的条码标签
    selectItemHandle (index) {
      let idx = this.listData.findIndex((value, idx) => idx == index)
      this.$set(this.listData[idx], 'isSelected', !this.listData[idx].isSelected)
    },

    transGroupName (tree) {
      tree.forEach(item => {
        if (item.boGroupingName !== undefined) {
          item.label = item.boGroupingName
          delete item.boGroupingName
        } else {
          this.transGroupName(item.children)
        }
      })
    },
    // 获取分组树数据
    async getTreeData () {
      let params = {
        keyword: ""
      };
      this.treeLoading = true;
      await UnitInfoTreeData(params)
        .then(({ data }) => {
          console.log("data=>", data);
          this.treeLoading = false;
          if (data.code == 0) {
            let res = data.data;
            // this.treeData = JSON.parse(JSON.stringify(res).replace(/'boUnitName'/g, 'label').replace(/'boGroupingName'/g, 'label'));
            res.map(item => {
              item.label = item.boUnitName;
              if (item.children.length > 0) {
                // item.children[0].label =
                //   "第" + Number(item.children[0].boVisitSn) + "次体检";
                let arr = item.children
                arr.forEach((v, i) => {
                  arr[i].label = "第" + Number(arr[i].boVisitSn) + "次体检"
                })
              }
            });
            this.transGroupName(res);
            let treeList = [{ label: '全部', id: 999999 }, { label: '个人', id: 888888 }].concat(res)
            this.treeData = treeList
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey('999999')
            })

          } else {
            this.treeLoading = false;
            this.$Message.error(data.message);
          }
        })
        .catch(err => {
          this.treeLoading = false;
          this.$Message.error("网络不稳定，请稍后重试");
        });
    },
    // 获取单位部门树数据
    async getTreeDeptData () {
      let params = {
        unitName: this.filterText || ''
      }
      try {
        this.treeLoading = true
        let { data } = await UnitDeptTreeData(params)
        console.log(data)
        this.treeLoading = false
        if (data.code == 0) {
          let res = this.transTreeData(data.data)
          let _arr = [{ label: '全部', id: 999999 }, { label: '个人', id: 888888 }].concat(res)
          this.treeData = _arr
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey('999999')
          })
        } else {
          this.$Message.error(data.message)
        }
      } catch (err) {
        this.treeLoading = false
        this.$Message.error(err.message)
      }
    },

    // 处理单位部门树数据
    transTreeData (tree) {
      tree.forEach(item => {
        if (item.hasOwnProperty('unitVisitSnList')) {
          item.label = item.name
          item.children = item.unitVisitSnList
          delete item.unitVisitSnList
          this.transTreeData(item.children)
        } else if (item.hasOwnProperty('departmentList')) {
          item.label = '第' + item.boUnitVisitSn + '次体检'
          item.children = item.departmentList
          delete item.departmentList
          this.transTreeData(item.children)
        } else if (item.hasOwnProperty('children')) {
          item.label = item.name
          this.transTreeData(item.children)
        } else if (item.hasOwnProperty('parentName')) {
          item.label = item.deptName
        }
      })

      return tree
    },

    // 切换分组和部门
    deptOrGroupChange () {
      if (this.treeType == 1) {
        this.treeType = 2
        this.getTreeDeptData()
      } else {
        this.treeType = 1
        this.getTreeData()
      }
      let xTable = this.$refs.barCodeTable
      xTable.reloadData([]).then(() => {
        this.$refs.barCodeTable.setAllSelection(true)
      })
    },

    // 点击个人，切换个人指引单管理
    selectPersonal () {
      this.isPersonalActive = true
    },
    // 点击某个公司，切换公司的指引单管理
    selectUnit (curNodeArr, curItem) {
      console.log(curNodeArr)
      console.log(curItem)
    },

    // 全部展开
    show () {
      console.log(this.$refs.tree.store._getAllNodes())
      this.isexpand = true
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
        }
      })
    },
    // 全部收起
    hide () {
      this.isexpand = false
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
        }
      })
    },
    // 反选
    toggleSelectHandle () {
      let selectedArr = this.$refs.barCodeTable.getSelectRecords()
      let tableObj = this.$refs.barCodeTable.getTableData()
      if (selectedArr.length == tableObj.fullData.length) {
        this.$refs.barCodeTable.clearSelection()
      } else {
        this.$refs.barCodeTable.setAllSelection(true)
        this.$refs.barCodeTable.setSelection(selectedArr, false)
      }
    },
    // 点击行选中或取消选中
    cellClickHandle ({ row, rowIndex, column, columnIndex }, event) {
      console.log(row)
      // this.$refs.barCodeTable.toggleRowSelection(row)
    },
    // 节点过滤
    filterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },

    handleNodeClick (val, node) {
      this.form.boVisitSn = ''
      this.form.boUnitId = ''
      this.form.boGroupingId = ''
      this.form.boSubDepartmentId = ''
      this.form.boDepartmentId = ''
      // 区分分组和部门树
      if (this.treeType == 1) {
        if (val.label == '个人') {
          this.form.personal = '1'
          this.form.unitOrPersonal = '2'
        } else if (val.label == '全部') {
          this.form.unitOrPersonal = '1'
          this.form.personal = ''
        } else {
          this.form.personal = ''
          this.form.unitOrPersonal = '3'
          switch (node.level) {
            case 1:
              // this.form.unit = data.boUnitName
              // this.form.boUnitId = val.boUnitId;
              break;
            case 2:
              // this.form.unit = node.parent.data.boUnitName
              this.form.boUnitId = node.parent.data.boUnitId;
              this.form.boVisitSn = val.boVisitSn;
              this.getList();
              break;
            case 3:
              // this.form.unit = node.parent.parent.data.boUnitName
              this.form.boUnitId = node.parent.parent.data.boUnitId;
              this.form.boVisitSn = node.parent.data.boVisitSn;
              // this.form.unitGroup = data.label
              this.form.boGroupingId = val.boGroupingId;
              this.getList();
              break
          }
        }
      } else {
        if (val.label == '个人') {
          this.form.personal = '1'
          this.form.unitOrPersonal = '2'
        } else if (val.label == '全部') {
          this.form.unitOrPersonal = '1'
          this.form.personal = ''
        } else {
          this.form.personal = ''
          this.form.unitOrPersonal = '3'
          switch (node.level) {
            case 1:
              // this.form.boUnitId = data.unitId
              // this.form.boVisitSn = ''
              break
            case 2:
              this.form.boUnitId = node.parent.data.unitId
              this.form.boVisitSn = val.boUnitVisitSn.toString()
              this.getList();
              break
            case 3:
              this.form.boUnitId = node.parent.parent.data.unitId
              this.form.boVisitSn = val.unitVisitSn.toString()
              this.form.boDepartmentId = val.deptId
              this.getList();
              break
            case 4:
              // deptId父级部门id，subDeptId是子部门id
              this.form.boUnitId = val.unitId
              this.form.boVisitSn = val.unitVisitSn.toString()
              this.form.boDepartmentId = val.parentId
              this.form.boSubDepartmentId = val.deptId
              this.getList();
              break
          }
        }
      }

    },
    // 格式化
    formatItem ({ cellValue, row, column }) {
      let arr = cellValue
      let str = ''
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (i < arr.length - 1) {
            str += arr[i] + '、'
          } else {
            str += arr[i]
          }
        }
      }
      return str
    },
    formatPriority ({ cellValue }) {
      return (cellValue == '' || cellValue === null ? '普通' : cellValue)
    }
  }
}
</script>
<style lang="less">
.barcode-manage-wrapper {
  width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-form-item {
    margin-bottom: 6px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-guide {
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
  .main-body-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    .main-left-part {
      width: 280px;
      height: auto;
      margin-right: 20px;
      .flex-wrapper {
        display: flex;
        height: 34px;
        justify-content: space-between;
        .ivu-input-group {
          max-width: 65%;
        }
      }
    }
    .main-right-part {
      flex: 1;
      height: auto;
      overflow: hidden;
    }
  }
  .barcode-wrapper {
    width: 100%;
    height: calc(~'100% - 200px');
    .barcode-title {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      span {
        color: #2d8cf0;
        font-weight: bold;
      }
    }
    .barcode-body {
      width: 100%;
      height: 100%;
      border: 1px solid #e8eaec;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      .empty-barcode {
        width: 100%;
        height: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #888;
        font-weight: bold;
      }
      .barcode-icon {
        width: 100%;
        img {
          width: 100%;
          height: 44px;
        }
      }
      .barcode-item {
        width: calc(~'25% - 10px');
        height: 135px;
        max-height: 150px;
        float: left;
        border: 1px solid #dcdee2;
        border-color: #e8eaec;
        margin: 5px;
        border-radius: 4px;
        font-size: 12px;
        padding: 5px 10px;
        &::after {
          content: '';
          clear: both;
          display: block;
          width: 0;
          height: 0;
          visibility: hidden;
        }
        &:hover {
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          border-color: #eee;
        }
        .exam-item-name {
          padding-right: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .icon-mark {
          display: none;
        }
      }
      .barcode-item.is-active {
        border: 2px solid #2d8cf0;
        position: relative;
        .icon-mark {
          position: absolute;
          bottom: 5px;
          right: 5px;
          display: block;
        }
      }
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
  }
  .guide-tree-wrapper {
    .search-guide-btn,
    .expand-btn,
    .guide-tree {
      width: 100%;
    }
    .expand-btn {
      margin: 10px 0;
    }
    .guide-tree {
      max-height: 660px;
      overflow-y: auto;
      .personal {
        text-indent: 1.5em;
        font-size: 12px;
        .isActive,
        li span:hover {
          background-color: #d6eaff;
        }
      }
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
  .handle-wrapper {
    margin-left: 10px;
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-form-item {
    margin-bottom: 0px !important;
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
  .vxe-table .vxe-cell {
    text-align: center;
  }
  .vxe-checkbox > input + .vxe-checkbox--icon {
    text-align: left;
  }
}
</style>
