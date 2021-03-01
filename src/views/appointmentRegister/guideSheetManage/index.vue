<template>
  <div class="guide-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">指引单管理</span>
      </div>
      <div class="page-body">
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

              <ButtonGroup style="margin:15px 0;width:100%">
                <Button style="width: 50%"
                        @click="show"
                        type="default">
                  <Icon type="ios-arrow-down"
                        @click="show"></Icon>全部展开
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
                                :data="treeData"
                                :props="defaultProps"
                                node-key="id"
                                :highlight-current="true"
                                :default-expand-all="isexpand"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick"
                                ref="tree"></vue-selecttree>
                <!-- <tree-component :data="treeData"
                            :defaultProps="defaultProps"
                            :isExpand="isExpand"
                ref="tree"></tree-component>-->
              </div>
            </div>
          </div>
          <div class="main-right-part">
            <div class="guide-table-form-wrapper">
              <Form :model="form"
                    label-position="right"
                    ref="form"
                    inline
                    style="flex:1;margin-bottom:24px;"
                    :label-width="60">
                <FormItem label="登记流水号"
                          :label-width="90">
                  <Input v-model="form.registerCode"
                         clearable
                         ref="inputFocus"
                         @on-enter="getList()"
                         size="small" />
                </FormItem>
                <FormItem label="姓名"
                          :label-width="40"
                          prop="name">
                  <Input v-model="form.name"
                         style="width:140px"
                         size="small"
                         clearable />
                </FormItem>

                <FormItem label="体检编号"
                          prop="peId1"
                          :label-width="80">
                  <Input v-model="form.peId1"
                         style="width:120px"
                         size="small"
                         clearable></Input>
                </FormItem>

                <FormItem label="到"
                          prop="peId2"
                          :label-width="28">
                  <Input v-model="form.peId2"
                         style="width:120px"
                         size="small"
                         clearable></Input>
                </FormItem>

                <FormItem label="登记日期"
                          :label-width="80"
                          prop="boRegisterDateStart">
                  <DatePicker type="date"
                              style="width:140px"
                              v-model="form.boRegisterDateStart"
                              size="small"></DatePicker>
                </FormItem>
                <FormItem label="到"
                          :label-width="36"
                          prop="boRegisterDateEnd">
                  <DatePicker type="date"
                              style="width:140px"
                              v-model="form.boRegisterDateEnd"
                              size="small"></DatePicker>
                </FormItem>

              </Form>
              <div class="handle-wrapper">
                <Button type="primary"
                        :loading="isLoading"
                        @click="getList()">查询</Button>
                <Button type="primary"
                        :loading="printLoad"
                        style="margin-left: 8px;"
                        v-permission="['print']"
                        @click="printMany(selections)">批量打印</Button>
              </div>
            </div>
            <Table :columns="columns"
                   :loading="isLoading"
                   :data="tableData"
                   class="table"
                   height="650"
                   @on-selection-change="selectChange">
              <template slot="boResultStatus"
                        slot-scope="{row}">
                <Tag v-if="row.boResultStatus=='0'"
                     color="red">未检</Tag>
                <Tag v-if="row.boResultStatus=='1'"
                     color="blue">在检</Tag>
                <Tag v-if="row.boResultStatus=='3'"
                     color="orange">待主检</Tag>
                <Tag v-if="row.boResultStatus=='2'||row.boResultStatus=='7'"
                     color="purple">待总检</Tag>
                <Tag v-if="row.boResultStatus=='9'"
                     color="green">已总检</Tag>
                <Tag v-if="row.boPrintStatus=='1'"
                     color="cyan">已打印</Tag>
                <Tag v-if="row.boPrintStatus=='0'"
                     color="magenta">未打印</Tag>
              </template>
              <template slot="boRegisterDate"
                        slot-scope="{row}">{{ monentFormat(row) }}</template>
              <template slot="boGuidePrnDate"
                        slot-scope="{row}">{{ momentFormat(row) }}</template>
              <template slot="action"
                        slot-scope="{row,index}">
                <Button type="default"
                        :loading='curRowId == row.rowId && seachLoad'
                        style="margin-left: 8px;"
                        v-permission="['print']"
                        @click="print(row,index)"
                        size="small">打印</Button>
              </template>
            </Table>
          </div>
        </div>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40,100]"
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
  </div>
</template>
<script>
import moment from "moment";
import vueSelecttree from "@/components/vue-selecttree";
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import { UnitDeptTreeData } from '@/api/unitManage_unitDeptManage'
import { listAllByUnitId, listByName } from "@/api/personal_register.js";
import { UnitInfoTreeData } from "@/api/appointmentUnitManage.js";
import { findGuide, findGuidePrint, guideSheetPrint } from "@/api/guideSheetManage.js";
import {
  getPrinterConfigFromLocalstorage,
  setPrinterConfigLocalstorage
} from '@/libs/util'

export default {
  name: "guideSheetManage",
  components: {
    vueSelecttree
  },
  data () {
    return {
      columns: [
        {
          width: 55,
          type: "selection",
          align: "center"
        },
        {
          title: "体检编号",
          key: "boPeId",
          minWidth: 120,
          align: "center"
        },
        {
          title: "姓名",
          key: "boName",
          minWidth: 120,
          align: "center"
        },
        {
          title: "体检状态",
          slot: "boResultStatus",
          minWidth: 100,
          align: "center"
        },
        {
          title: "性别",
          key: "boSex",
          minWidth: 80,
          align: "center"
        },
        {
          title: "年龄",
          key: "boAge",
          minWidth: 80,
          align: "center"
        },
        {
          title: "单位名称",
          key: "boUnitName",
          minWidth: 150,
          align: "center"
        },
        {
          title: "登记日期",
          slot: "boRegisterDate",
          minWidth: 170,
          align: "center"
        },
        {
          title: "指引单打印日期",
          slot: "boGuidePrnDate",
          minWidth: 170,
          align: "center"
        },
        {
          title: "体检次数",
          key: "visitSn",
          minWidth: 110,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          width: 100,
          align: "center"
        }
      ],
      tableData: [
        {
          peId: "",
          name: "",
          resultStatus: "",
          sex: "",
          age: "",
          unitName: "",
          regDate: "",
          printTimes: ""
        }
      ],
      form: {
        name: "",
        peId1: "",
        peId2: "",
        unit: "",
        unitGroup: "",
        unitVisitSn: "",
        isFindAll: 1
      },
      seachLoad: false,
      printLoad: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      isLoading: false,
      selections: [], // 表格选中项
      unitsList: [],
      groupsList: [],
      unitNameLoading: false,
      isPersonalActive: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      isexpand: false,
      boVisitSn: "",
      unitName: "",
      unitId: "",
      parentId: '', // 父级部门id
      subDeptId: '', // 子部门id
      treeType: 1, // 单位树切换，1位分组，2为部门
      filterText: "",
      curRowId: '' // 记录当前选中行
    };
  },
  watch: {
    // 节点过滤
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  async mounted () {
    let curDate = moment().format('YYYY-MM-DD')

    this.$set(this.form, 'boRegisterDateStart', curDate)
    this.$set(this.form, 'boRegisterDateEnd', curDate)
    this.getList();
    this.getTreeData();

    // 聚焦文本框
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })
  },
  methods: {
    transGroupName (tree) {
      tree.forEach(item => {
        if (item.boGroupingName !== undefined) {
          item.label = item.boGroupingName;
          delete item.boGroupingName;
        } else {
          this.transGroupName(item.children);
        }
      });
    },
    // 获取树数据
    getTreeData () {
      let params = {
        keyword: this.filterText
      };
      UnitInfoTreeData(params)
        .then(({ data }) => {
          console.log("data=>", data);
          if (data.code == 0) {
            let res = data.data;
            let resCheck = [];
            // this.treeData = JSON.parse(JSON.stringify(res).replace(/'boUnitName'/g, 'label').replace(/'boGroupingName'/g, 'label'));
            res.map(item => {
              item.label = item.boUnitName;
              if (item.children.length > 0) {
                let arr = item.children;
                arr.forEach((v, i) => {
                  arr[i].label = "第" + Number(arr[i].boVisitSn) + "次体检";
                });
                // item.children[0].label =
                //   '第' + Number(item.children[0].boVisitSn) + '次体检'
                resCheck.push(item);
              }
            });
            console.log(resCheck);
            this.transGroupName(resCheck);
            let resCheckAdd = [{ label: "全部" }, { label: "个人" }].concat(resCheck);
            this.treeData = resCheckAdd;
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {
          // this.$Message.error('网络不稳定，请稍后重试')
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
          let _arr = [{ label: "全部" }, { label: "个人" }].concat(res)
          this.treeData = _arr
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
      this.tableData = []
      this.selections = []
    },

    getList (page = 1, size = 20) {
      this.pageIndex = page;
      this.pageSize = size;
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      };
      // 格式化时间
      const _startDate = this.form.boRegisterDateStart != '' ? moment(this.form.boRegisterDateStart).format('YYYY-MM-DD') : ''
      const _endDate = this.form.boRegisterDateEnd != '' ? moment(this.form.boRegisterDateEnd).format('YYYY-MM-DD') : ''
      let params = Object.assign({}, this.form)

      params.boRegisterDateEnd = _endDate
      params.boRegisterDateStart = _startDate

      this.isLoading = true
      findGuide(pagination, params)
        .then(({ data }) => {
          this.isLoading = false;
          if (data.code == 0) {
            let res = data.data;
            this.totalSize = res.total;
            this.tableData = res.records;
            // console.log(this.tableData)
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$Message.error(err.message);
        });
    },
    // 单个打印
    print (row, index) {
      console.log(row)
      if (!printNotice()) return false
      if (this.printLoad == true) {
        this.$Message.warning('批量打印中,请稍等')
        return false
      }
      this.curRowId = row.rowId
      this.seachLoad = true

      let printConfig = getPrinterConfigFromLocalstorage();
      let params;

      if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
        params = {
          zip: false,
          merge: false,
          duplex: false,
          data: [
            {
              name: row.boName,
              peId: row.boPeId,
              visitSn: row.visitSn
            }
          ]
        }
      } else {
        params = {
          zip: false,
          merge: true,
          duplex: false,
          data: [
            {
              name: row.boName,
              peId: row.boPeId,
              visitSn: row.visitSn
            }
          ]
        }
      }

      guideSheetPrint(params).then(({ data }) => {
        // console.log(data)
        this.seachLoad = false
        if (data.code == 0) {
          if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
            let resData = []
            data.data.originalFileList.forEach(item => {
              let _str = this.$url + item
              resData.push(_str)
            });
            let printParams = {
              guideUrl: resData,
              selGroup: ['printGuide'],
              taskName: '指引单'
            }
            printMethods(printParams.guideUrl, printParams)
          } else {
            let resData = []
            data.data.mergeFileList.forEach(item => {
              let _str = this.$url + item
              resData.push(_str)
            });
            let printParams = {
              guideUrl: resData,
              selGroup: ['printGuide'],
              taskName: '指引单'
            }
            printMethods(printParams.guideUrl, printParams)
          }

        }
        if (data.code == 1) {
          this.$Message.error(data.message);
        }
      }).catch(err => {
        this.seachLoad = false
        this.$Message.error(err.message)
      })
    },
    // 批量打印
    printMany (row) {
      if (!printNotice()) return false
      if (this.seachLoad) {
        this.$Message.warning('单个打印中,请稍等')
        return false
      }
      if (row.length > 0) {
        let printConfig = getPrinterConfigFromLocalstorage();
        let params;
        let _data = row.map(item => {
          return { name: item.boName, peId: item.boPeId, visitSn: item.visitSn }
        })
        if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
          params = {
            zip: false,
            merge: false,
            duplex: false,
            data: _data
          }
        } else {
          params = {
            zip: false,
            merge: true,
            duplex: false,
            data: _data
          }
        }
        this.printLoad = true
        guideSheetPrint(params).then(({ data }) => {
          this.printLoad = false
          if (data.code == 0) {
            if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
              let resData = []
              data.data.originalFileList.forEach(item => {
                let _str = this.$url + item
                resData.push(_str)
              });
              let printParams = {
                guideUrl: resData,
                selGroup: ['printGuide'],
                taskName: '指引单'
              }
              printMethods(printParams.guideUrl, printParams)
            } else {
              let resData = []
              data.data.mergeFileList.forEach(item => {
                let _str = this.$url + item
                resData.push(_str)
              });

              let printParams = {
                guideUrl: resData,
                selGroup: ['printGuide'],
                taskName: '指引单'
              }
              printMethods(printParams.guideUrl, printParams)
            }
          } else if (data.code == 1) {
            this.$Message.error(data.message);
          }
        }).catch(err => {
          this.printLoad = false
          this.$Message.error(err.message);
        });
      }
    },
    selectChange (val) {
      console.log(val);
      this.selections = val;
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val;
      this.getList(val, this.pageSize);
    },
    pageSizeChange (val) {
      this.pageSize = val;
      this.getList(this.pageIndex, val);
    },

    show () {
      this.isexpand = true;
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand;
        }
      });
    },
    hide () {
      this.isexpand = false;
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand;
        }
      });
    },

    // 节点过滤
    filterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true;
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true;
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node);
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level;
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false;
      }
      // 先取当前节点的父节点
      let parentData = node.parent;
      // 遍历当前节点的父节点
      let index = 0;
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true;
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent;
        index++;
      }
      // 没匹配到返回false
      return false;
    },

    handleNodeClick (data, node) {
      console.log(node);
      console.log(data);
      this.$refs.form.resetFields();
      // let curDate = moment().format('YYYY-MM-DD')

      // this.$set(this.form, 'boRegisterDateStart', curDate)
      // this.$set(this.form, 'boRegisterDateEnd', curDate)
      this.form.unitId = "";
      this.form.unitVisitSn = "";
      this.form.unitGroupId = "";
      this.form.boDepartmentId = "";
      this.form.boSubDepartmentId = "";
      this.form.isFindAll = 0

      if (this.treeType == 1) {
        if (data.label && data.label == "个人") {
          this.getList()
        } else if (data.label && data.label == "全部") {
          this.form.isFindAll = 1
          this.getList()
        } else {
          switch (node.level) {
            case 1:
              // this.form.unit = data.boUnitName
              this.form.unitId = data.boUnitId;
              break;
            case 2:
              // this.form.unit = node.parent.data.boUnitName
              this.form.unitId = node.parent.data.boUnitId;
              this.form.unitVisitSn = data.boVisitSn;
              break;
            case 3:
              // this.form.unit = node.parent.parent.data.boUnitName
              this.form.unitId = node.parent.parent.data.boUnitId;
              this.form.unitVisitSn = node.parent.data.boVisitSn;
              // this.form.unitGroup = data.label
              this.form.unitGroupId = data.boGroupingId;
          }
          this.getList();
        }
      } else {
        if (data.label && data.label == "个人") {
          this.getList();
        } else if (data.label && data.label == "全部") {
          this.form.isFindAll = 1
          this.getList()
        } else {
          switch (node.level) {
            case 1:
              this.form.unitId = data.unitId
              this.form.unitVisitSn = ''
              break
            case 2:
              this.form.unitId = node.parent.data.unitId
              this.form.unitVisitSn = data.boUnitVisitSn
              break
            case 3:
              this.form.unitId = node.parent.parent.data.unitId
              this.form.unitVisitSn = data.unitVisitSn
              this.form.boDepartmentId = data.deptId
              break
            case 4:
              // deptId父级部门id，subDeptId是子部门id
              this.form.unitId = data.unitId
              this.form.unitVisitSn = data.unitVisitSn
              this.form.boDepartmentId = data.parentId
              this.form.boSubDepartmentId = data.deptId
              break
          }
          this.getList();
        }

      }


    },
    monentFormat (val) {
      return moment(val.boRegisterDate).format("YYYY-MM-DD HH:mm:ss");
    },
    momentFormat (val) {
      if (val.boGuidePrnDate) {
        return moment(val.boGuidePrnDate).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "-";
      }
    },
    checkStatus (val) {
      switch (val.boResultStatus) {
        case "0":
          return "已预约";
          break;
        case "1":
          return "已执行";
          break;
        case "2":
          return "待审核";
          break;
        case "7":
          return "已初步审核";
          break;
        case "9":
          return "已最终审核";
          break;
      }
    }
  }
};
</script>
<style lang="less">
.guide-manage-wrapper {
  width: 100%;
  min-width: 1200px;
  height: auto;
  min-height: calc(~'100% - 80px');
  display: flex;
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
      max-height: 610px;
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
  .guide-table {
    width: 81%;
    text-align: center;
    .page-table {
      margin-top: 24px;
    }
  }
  .guide-table-form-wrapper {
    display: flex;
    justify-content: space-between;
    .handle-wrapper {
      width: 200px;
    }
  }
  .ivu-form-item {
    margin-bottom: 0px !important;
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
  .ivu-btn-error[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>
