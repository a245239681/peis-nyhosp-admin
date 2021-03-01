<template>
  <div>
    <Modal class="exam-record-popup-wrapper"
           v-model="isVisible"
           :mask-closable="false"
           @on-cancel="close('searchForm')"
           title="预约记录"
           width="1280">
      <Form ref="searchForm"
            :model="searchForm"
            label-position="left"
            autocomplete="off">
        <Row :gutter="16">
          <Col span="4">
          <FormItem label="姓名"
                    prop="boName"
                    :label-width="60">
            <Input v-model.trim="searchForm.boName"
                   @on-enter="searchHistory()"
                   clearable />
          </FormItem>
          </Col>
          <Col span="3">
          <FormItem label="性别"
                    prop="boSex"
                    :label-width="50">
            <Select v-model.trim="searchForm.boSex">
              <Option value="不限">不限</Option>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="手机"
                    prop="boMobile"
                    :label-width="40">
            <Input v-model.number="searchForm.boMobile"
                   clearable />
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="身份证"
                    prop="boIdNo"
                    :label-width="60">
            <Input v-model.trim="searchForm.boIdNo"
                   @on-enter="searchHistory()"
                   clearable />
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="个人/单位"
                    :label-width="80"
                    prop="boIsUnit">
            <RadioGroup v-model="searchForm.boIsUnit">
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
          <Col span="1">
          <Button type="primary"
                  @click="searchHistory()"
                  :loading="searchLoading">查询</Button>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="4">
          <FormItem label="体检类型"
                    prop="boCategoryId"
                    :label-width="70">
            <Select v-model="searchForm.boCategoryId">
              <Option v-for="item in categoryList"
                      :value="item.cdId"
                      :key="item.cdId">{{item.cdName}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="单位名称"
                    prop="boUnitId"
                    :label-width="70">
            <Select v-model="searchForm.boUnitId"
                    filterable
                    remote
                    clearable
                    :remote-method="getUnits"
                    :loading="unitNameLoading"
                    placeholder="搜索单位">
              <Option v-for="item in unitsList"
                      :value="item.boUnitId"
                      :key="item.boUnitId">{{ item.boUnitName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="10">
          <FormItem label="预约日期"
                    :label-width="70">
            <FormItem prop="boDateRange">
              <DatePicker type="daterange"
                          :editable="false"
                          v-model="searchForm.boDateRange"
                          format="yyyy-MM-dd"
                          @on-change="timeFormat"
                          class="booking-date-range"
                          placeholder="选择预约日期范围"
                          confirm
                          split-panels></DatePicker>
            </FormItem>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="16">
          <div class="table-left">

            <Table :columns="bookInfoCols"
                   :data="patientInfo"
                   @on-row-dblclick="dblclickRecord"
                   @on-row-click="getRecord"
                   height="524"
                   highlight-row>
              <template slot="boIsUnit"
                        slot-scope="{row}">
                <span>{{row.boIsUnit == 0 ? '个人': '单位'}}</span>
              </template>
              <template slot="boStatus"
                        slot-scope="{row}">
                <span v-if="row.boStatus == 0">预约中</span>
                <span v-if="row.boStatus == 1">已确认</span>
                <span v-if="row.boStatus == 9">取消预约</span>
              </template>
            </Table>

          </div>
          </Col>
          <Col span="8">
          <div class="table-right">
            <tree-table ref="historyTreeTable"
                        :key="Math.random()"
                        :columns="projectCols"
                        :data="projectTableData"
                        :expand-type="false"
                        :is-fold="true"
                        :selectable="false"
                        :show-row-hover="true"
                        :empty-text="emptyText"
                        expand-key="paName"
                        max-height="563"
                        border>
              <template slot="paExamType"
                        slot-scope="{row}">
                <span>{{row.paExamType}}</span>
              </template>
              <template slot="paName"
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
            </tree-table>
          </div>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <div class="switch-page-footer">
          <Page :total="totalSize"
                :page-size="pageSize"
                :current="pageIndex"
                @on-change="pageIndexChange"
                size="small"
                show-elevator
                show-total />
        </div>
        <!-- <Button @click="close('searchForm')">取消</Button>
        <Button type="primary"
                @click="importHistory('searchForm')">导入</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import { getBookingList, getBookingPackage, getComboByPackage, listByName } from '@/api/personal_appointment.js';

export default {
  name: 'bookHistory',
  props: {
    visible: Boolean,
    boname: String
  },
  data () {
    return {
      searchForm: {
        boName: '',
        boSex: '',
        boMobile: '',
        boIdNo: '',
        boIsUnit: '',
        boUnitId: '',
        boCategoryId: '',
        boBookingDataStart: '',
        boBookingDataEnd: ''
      },
      //左边预约记录表格表头格式
      bookInfoCols: [
        {
          title: '姓名',
          width: 100,
          key: 'boName',
          fixed: 'left',
          align: 'center'
        },
        {
          title: '证件号码',
          width: 200,
          key: 'boIdNo',
          align: 'center'
        },
        {
          title: '个人/单位',
          width: 100,
          slot: 'boIsUnit',
          align: 'center'
        },
        {
          title: '预约次数',
          width: 100,
          key: 'boBookingListSn',
          align: 'center'
        },
        {
          title: '体检次数',
          width: 100,
          key: 'boRegisterSn',
          align: 'center'
        },
        {
          title: '年龄',
          width: 80,
          key: 'boAge',
          align: 'center'
        },
        {
          title: '性别',
          width: 80,
          key: 'boSex',
          align: 'center'
        },
        {
          title: '手机号',
          width: 160,
          key: 'boMobile',
          align: 'center'
        },
        {
          title: '单位名称',
          width: 260,
          key: 'boUnitName',
          align: 'center'
        },
        {
          title: '体检类型',
          width: 100,
          key: 'boCategory',
          align: 'center'
        },
        {
          title: '预约时间',
          width: 110,
          key: 'boBookingDate',
          align: 'center',
          fixed: 'right',
        },
        {
          title: '预约状态',
          width: 100,
          slot: 'boStatus',
          align: 'center',
          fixed: 'right',
        }
      ],
      //右边组合项目表格表头格式
      projectCols: [
        {
          title: '项目名称',
          key: 'paName',
          template: 'paName',
          align: 'left',
          headerAlign: 'center'
        },
        // {
        //   title: '检查类别',
        //   width: 90,
        //   key: 'paExamType',
        //   template: 'paExamType',
        //   align: 'center',
        //   headerAlign: 'center'
        // },
        {
          title: '单价(元)',
          width: 88,
          key: 'paPrice',
          template: 'paPrice',
          align: 'center',
          headerAlign: 'center'
        }
      ],
      projectTableData: [],
      // personalForms: [],
      packageData: [],
      patientInfo: [],
      unitsList: [],
      recordIndex: -1,
      emptyText: '暂无数据',
      boBookingDataStart: '',
      boBookingDataEnd: '',
      unitNameLoading: false,
      searchLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalSize: 0,
      clickTableLoading: false,
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    },
    categoryList: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
    }
  },
  created () {
    this.getCategoryList();
  },
  watch: {
    boname: function (newValue, oldValue) {
      // console.log(oldValue + 'oldValue')
      // console.log(newValue + 'newValue')
      if (newValue) {
        this.autoSearchName(newValue);
      }
    }
  },
  methods: {
    //查询单位
    getUnits (query) {
      // console.log(query);
      if (query !== '') {
        this.unitNameLoading = true;
        let unitParam = {
          boUnitName: query
        }
        listByName(unitParam).then(res => {
          let result = res.data;
          if (result.code === 0) {
            this.unitNameLoading = false;
            this.unitsList = result.data;
          } else {
            this.$Message.error(result.message);
          }
        });
      }
    },
    //获取体检类型
    getCategoryList () {
      this.$store.dispatch('getCategoryDict');
    },
    searchHistory (page = 1, size = 10) {
      this.searchLoading = true;
      this.pageIndex = page
      this.pageSize = size
      //请求患者过往预约信息
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // console.log(params);
      getBookingList(pagination, this.searchForm).then((res) => {
        let result = res.data;
        if (result.code == 0) {
          console.log(result.data);
          //表单数据存入
          //HIS号码预留字段，暂无返回
          this.patientInfo = result.data.records;
          this.projectTableData = [];
          this.totalSize = result.data.total
          //保存套餐名字
          result.data.records.forEach(item => {
            this.packageData.push({
              packageID: item.boPackageId
            });
          });
          // console.log(this.packageData);
        } else {
          this.$Message.error(result.message);
        }
        this.searchLoading = false;
      }).catch(err => {
        this.searchLoading = false;
        this.$Message.error("网络不稳定，请稍后重试");
      });
    },
    //存入预约基本信息数据
    // showBookingRecord () {
    //   let bookStatus = ''
    //   //清空左边表格数据
    //   this.bookInfoTableData = [];
    //   //左边体检记录的表格数据存入     
    //   this.patientInfo.forEach(item => {
    //     if (item.boStatus == 0) {
    //       bookStatus = '预约中'
    //     } else if (item.boStatus == 1) {
    //       bookStatus = '已确认'
    //     } else if (item.boStatus == 9) {
    //       bookStatus = '取消预约'
    //     }
    //     this.bookInfoTableData.push({
    //       RegisterSn: item.boRegisterSn,
    //       BookingSn: item.boBookingListSn,
    //       boAge: item.boAge,
    //       boBookingDate: item.boBookingDate,
    //       boUnitName: item.boUnitName,
    //       boCategory: item.boCategory,
    //       boIdNo: item.boIdNo,
    //       boName: item.boName,
    //       boMobile: item.boMobile,
    //       boSex: item.boSex,
    //       boIsUnit: item.boIsUnit == 0 ? '个人' : '单位',
    //       boStatus: bookStatus
    //     });
    //   });
    // },
    //双击左边表格，导出数据
    dblclickRecord (data, index) {
      this.recordIndex = index;
      this.importHistory('searchForm')
    },
    //点击左边表格记录,查询显示对应的项目组合
    getRecord (data, index) {
      //获取点击左边表格行数index
      this.recordIndex = index;
      //点击当前行，请求查询记录对应的项目组合
      if (!this.patientInfo[index].boPackageId) return
      let comboParams = {
        paPackageId: this.patientInfo[index].boPackageId
      };
      //清空右边表格数据
      this.projectTableData = null;
      this.projectTableData = [];
      if (!this.clickTableLoading) {
        this.clickTableLoading = true;
        getComboByPackage(comboParams).then((res) => {
          let result = res.data;
          console.log(result);
          let r = [];
          if (result.code === 0) {
            //左边体检记录的表格数据存入     
            // result.data.forEach(item => {
            //   r.push({
            //     paExamType: item.paExamType,
            //     paName: item.paName,
            //     // paId: item.paId,
            //     paCode: item.paCode,
            //     paPrice: item.paPrice,
            //     children: item.children
            //   });
            // });
            // this.projectTableData = r;
            this.projectTableData = result.data;
            console.log(this.projectTableData);
            this.clickTableLoading = false;
          } else {
            this.clickTableLoading = false;
            this.$Message.error(result.message);
          }
        });
      }
    },
    clearData (form) {
      this.pageIndex = 1
      this.totalSize = 0
      //清空左边表格数据
      this.patientInfo = [];
      //清空右边表格数据
      this.projectTableData = [];
      //清除选中高亮效果
      this.recordIndex = -1;
      //清空查询表单
      this.$refs[form].resetFields();
    },
    importHistory (form) {

      if (!this.patientInfo[this.recordIndex]) {
        this.$Message.error('请选择需要导入的数据')
        return false
      }
      //将选中的记录信息导入到外面的表单中
      this.$emit('importRecord', this.patientInfo[this.recordIndex]);
      this.clearData(form);
      this.$emit('close');
    },
    close (form) {
      this.searchLoading = false;
      this.clearData(form);
      this.$emit('close');
    },
    // 格式时间
    timeFormat (e) {
      // console.log(e);
      // this.boBookingDataStart = e[0];
      // this.boBookingDataEnd = e[1];
      // this.searchForm.boDateRange = e;
      this.$set(this.searchForm, 'boBookingDataStart', e[0])
      this.$set(this.searchForm, 'boBookingDataEnd', e[1])
      this.$set(this.searchForm, 'boDateRange', e)
    },
    autoSearchName (name) {
      this.searchForm.boName = name;
      this.searchHistory();
    },
    //翻页
    pageIndexChange (val) {
      this.packageData = [];
      this.searchHistory(val, 10)
    }
  }
}
</script>

<style lang="less">
.exam-record-popup-wrapper {
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
  .ivu-modal-body {
    .ivu-form-item {
      margin-bottom: 16px;
    }
    .ivu-table th {
      background-color: #d6eaff;
    }
    // .ivu-table .click-row td {
    //   background-color: #2db7f5;
    //   color: #fff;
    // }
    .zk-table__header-row {
      background-color: #d6eaff;
    }
    .booking-date-range {
      width: 254px;
    }
    .table-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      // .switch-page-footer {
      //   position: static;
      //   bottom: 0;
      //   // margin-top: 20px;
      // }
    }

    .zk-table {
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
  .switch-page-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
}
</style>


