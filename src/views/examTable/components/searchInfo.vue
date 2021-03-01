<template>
  <div class="search-wrapper"
       :class="{show : isShowInfo}">
    <div class="toggle-btn"
         @click="showInfo">
      <i class="icon-toggle"
         :class="{show : isShowInfo}"></i>
    </div>
    <div class="info-title">搜索</div>
    <div class="info-container">
      <Form :model="formData"
            label-position="right"
            :label-width="60">
        <Row :gutter="16">
          <Col span="6">
          <FormItem label="体检号"
                    :label-width="80"
                    prop="peId">
            <Input v-model="formData.peId"
                   size="small" />
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="姓名"
                    :label-width="40"
                    prop="name">
            <Input v-model="formData.name"
                   size="small" />
          </FormItem>
          </Col>
          <Col span="7">
          <FormItem label="体检单位"
                    :label-width="80">
            <Select v-model="formData.unitName"
                    filterable
                    remote
                    clearable
                    :remote-method="getUnits"
                    :loading="unitLoading"
                    placeholder="单位名称搜索"
                    size="small">
              <Option v-for="item in unitList"
                      :value="item.boUnitName"
                      :key="item.boUnitId">{{ item.boUnitName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="体检状态"
                    :label-width="80"
                    prop="resultStatus">
            <Select v-model="formData.resultStatus"
                    size="small">
              <Option value="10">全部</Option>
              <Option value="0">未检</Option>
              <Option value="1">在检</Option>
              <Option value="3">待主检</Option>
              <Option value="7">待总检</Option>
              <Option value="9">已总检</Option>
              <Option value="8">已打印报告</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="6">
          <FormItem label="登记日期"
                    :label-width="80"
                    prop="regStartDate">
            <DatePicker type="date"
                        v-model="formData.regStartDate"
                        size="small"></DatePicker>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="到"
                    :label-width="36"
                    prop="regEndDate">
            <DatePicker type="date"
                        v-model="formData.regEndDate"
                        size="small"></DatePicker>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="体检日期"
                    :label-width="80"
                    prop="examDateStart">
            <DatePicker type="date"
                        v-model="formData.examDateStart"
                        size="small"></DatePicker>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="到"
                    :label-width="36"
                    prop="examDateEnd">
            <DatePicker type="date"
                        v-model="formData.examDateEnd"
                        size="small"></DatePicker>
          </FormItem>
          </Col>
        </Row>
        <Row :gutter="16"
             type="flex"
             justify="end">
          <Button type="primary"
                  @click="search()"
                  style="margin-right:8px;"
                  :loading="loading">搜索</Button>
        </Row>
      </Form>
      <div class="table-wrapper">
        <div class="color">
          <div class="block-color">
            <div class="block-item">未检:<span style="background-color: #FFF;border:1px solid #ccc"></span></div>
            <div class="block-item">在检:<span style="background-color: #C8E6C9;"></span></div>
            <div class="block-item">待主检:<span style="background-color: #F9EFC0;"></span></div>
            <div class="block-item">待总检:<span style="background-color: #ce93d8;"></span></div>
            <div class="block-item">已总检:<span style="background-color: #FF8A80;"></span></div>
            <div class="block-item">已打印报告:<span style="background-color: #E0E0E0;"></span></div>
          </div>
        </div>
        <Table :columns="tableCols"
               :data="tableData"
               :highlight-row="true"
               :loading="tableLoading"
               :row-class-name="rowClassName"
               @on-row-dblclick="choosePatient"
               :height="screenHeight - 280"
               size="small">
          <template slot="boRegisterDate"
                    slot-scope="{row}">
            <span v-show="row.boRegisterDate">{{row.boRegisterDate | dateformat}}</span>
          </template>
          <template slot="boExamTime"
                    slot-scope="{row}">
            <span v-show="row.boExamTime">{{row.boExamTime | dateformat}}</span>
          </template>
        </Table>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              show-total
              show-elevator
              :current="pageIndex"
              @on-change="pageIndexChange"
              :page-size="pageSize"
              size="small"
              class="page" />
      </div>

    </div>
  </div>
</template>
<script>
import { searchPatient } from '@/api/record_result.js'
import { listByName } from '@/api/personal_appointment.js'
import moment from 'moment'
export default {
  name: 'searchInfo',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      isShowInfo: false,
      formData: {},
      unitList: [],
      tableCols: [
        {
          title: '体检号',
          key: 'boPeId',
          align: 'center',
          minWidth: 120,
        },
        {
          title: '姓名',
          key: 'boName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '性别',
          key: 'boSex',
          align: 'center',
          minWidth: 80
        },
        {
          title: '年龄',
          key: 'boAge',
          align: 'center',
          minWidth: 80
        },
        {
          title: '体检次数',
          key: 'boVisitSn',
          align: 'center',
          minWidth: 100
        },
        {
          title: '体检单位',
          key: 'boUnitName',
          align: 'center',
          minWidth: 180
        },
        {
          title: '体检套餐',
          key: 'boPackage',
          align: 'center',
          minWidth: 180
        },
        {
          title: '登记日期',
          slot: 'boRegisterDate',
          align: 'center',
          minWidth: 170
        },
        {
          title: '体检日期',
          slot: 'boExamTime',
          align: 'center',
          minWidth: 170
        },
      ],
      tableData: [],
      loading: false,
      tableLoading: false,
      unitLoading: false, // 单位搜索loading
      pageIndex: 1,
      pageSize: 20,
      totalSize: 0
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

    let curDate = moment().format('YYYY-MM-DD')
    // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
    this.$set(this.formData, 'examDateStart', curDate)
    this.$set(this.formData, 'examDateEnd', curDate)
    this.search()
  },
  methods: {
    showInfo () {
      this.isShowInfo = !this.isShowInfo;
      if (this.isShowInfo) {
        let that = this;
        document.onkeydown = function (event) {
          const e = event || window.event || arguments.callee.caller.arguments[0];
          // 键盘enter
          if (e && e.keyCode == 13) {
            that.search()
          }
        }
      } else {
        document.onkeydown = null
      }
    },
    //查询单位
    getUnits (query) {
      console.log(query);
      if (query !== '') {
        let unitParam = {
          boUnitName: query
        }
        this.unitLoading = true
        listByName(unitParam).then(res => {
          console.log(res)
          this.unitLoading = false
          let result = res.data;
          if (result.code === 0) {
            this.unitList = result.data;
          } else {
            this.$Message.error(result.message);
          }
        });
      }
    },
    search (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size
      //格式化时间
      let startDate = this.formData.regStartDate != '' ? moment(this.formData.regStartDate).format('YYYY-MM-DD') : '';
      let endDate = this.formData.regEndDate != '' ? moment(this.formData.regEndDate).format('YYYY-MM-DD') : '';
      let _startDate = this.formData.examDateStart != '' ? moment(this.formData.examDateStart).format('YYYY-MM-DD') : '';
      let _endDate = this.formData.examDateEnd != '' ? moment(this.formData.examDateEnd).format('YYYY-MM-DD') : '';
      //传参
      let params = {
        peId: this.formData.peId || '',
        name: this.formData.name || '',
        abbreviation: '',
        unitName: this.formData.unitName || '',
        settleStatus: (this.formData.resultStatus == '8' || this.formData.resultStatus == '10' ? '' : this.formData.resultStatus) || '',
        printStatus: (this.formData.resultStatus == '8' ? '1' : ''),
        registerDate1: startDate,
        registerDate2: endDate,
        examDateStart: _startDate,
        examDateEnd: _endDate
      }
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize,
      }
      this.loading = true;
      this.tableLoading = true;
      searchPatient(pagination, params).then(({ data }) => {
        if (data.code == 0) {
          this.loading = false;
          this.tableLoading = false;
          this.totalSize = data.data.total;
          this.tableData = data.data.records;
        } else {
          this.loading = false;
          this.tableLoading = false;
          this.$Message.error(data.message);
        }
      }).catch(err => {
        this.loading = false;
        this.tableLoading = false;
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    //表格双击某一行
    choosePatient (data, index) {
      this.showInfo();
      this.$emit("getPatientInfo", this.tableData[index]);
    },
    // 切换页码
    pageIndexChange (val) {
      this.search(val, 20)
    },
    rowClassName (row, index) {
      if (row.boResultStatus == '9' && row.boPrintStatus == '1') {
        return 'table-cyan-row'
      } else if (row.boResultStatus == '7') {
        return 'table-green-row'
      } else if (row.boResultStatus == '3') {
        return 'table-yellow-row'
      } else if (row.boResultStatus == '9') {
        return 'table-success-row'
      } else if (row.boResultStatus == '1') {
        return 'table-warning-row'
      } else if (row.boResultStatus == '0') {
        return 'table-info-row'
      }
    },
  },
}
</script>
<style lang="less">
.search-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  width: 900px;
  // height: calc(100% -1px);
  background-color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  transform: translateX(100%);
  box-shadow: -1px -1px 15px #dcdee2;
  &.show {
    animation: hideToshow 0.5s;
    transform: translateX(0);
  }
  .toggle-btn {
    position: absolute;
    top: 50%;
    left: -25px;
    width: 25px;
    margin-top: -30px;
    height: 60px;
    background-color: #1a94e6;
    border-radius: 8px 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-toggle {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    background-position: center;
    background-size: 16px 16px;
    transform: rotateY(0);
    &.show {
      animation: rotateIcon 0.5s;
      transform: rotateY(180deg);
    }
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA+klEQVRYR8XX6w3CMAwE4LsN2ARGgE3oZJQN2ABG6CgwgVGktlJfaeLGTn+7uU+RItvEwU9ETgCuJF8pR4lIqP0MtUz5aaumD38DuABoSLax80TkDuABoCXZhFo1YBb+62+hi2CH8FAyYlWAUuGqGygZng0oHZ4FsAhPBliFJwEsw3cB1uFRgEf4JsArfBXgGb4AeIdPADXCR0Ct8Dkg9OgzgC+AG8nszqZp7WM37G/BHTFpxzUQi3nAG7E6kHgiNiciL0R0JPNA7M6E1ohdQHjblogkgCUiGWCFyAJYILIBpREqQEmEGrCCyFlOnyTDrqhfTofWe3Q9/wN1T1gwYP16pAAAAABJRU5ErkJggg==');
  }
  .block-color {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-bottom: 5px;
    .block-item {
      margin-right: 20px;
      display: flex;
      align-items: center;
      color: #252525;
    }
    span {
      display: inline-block;
      width: 15px;
      height: 15px;
      background: pink;
      margin-left: 5px;
    }
  }
  // 未检-白色: #FFFFFF
  // 在检-浅绿色：#C8E6C9
  // 待主检：浅黄 #ffec40;
  // 待总检-浅紫色：#ce93d8
  // 已总检-红色：#FF8A80
  // 已打印报告-浅灰：#E0E0E0
  // boResultStatus = 0
  .ivu-table .table-info-row td {
    // background-color: #cacaca;
    background-color: #ffffff;
    color: #333;
  }
  // boResultStatus = 1
  .ivu-table .table-warning-row td {
    // background-color: #e0eefd;
    background-color: #c8e6c9;
    color: #333;
  }
  // boResultStatus = 3
  .ivu-table .table-yellow-row td {
    // background-color: #e0eefd;
    background-color: #f9efc0;
    color: #333;
  }
  // boResultStatus = 7
  .ivu-table .table-green-row td {
    // background-color: #381511;
    background-color: #ce93d8;
    color: #333;
  }
  // printStatus = 1 && boResultStatus = 9
  .ivu-table .table-cyan-row td {
    // background-color: #cffef4;
    background-color: #e0e0e0;
    color: #333;
  }

  // boResultStatus = 9
  .ivu-table .table-success-row td {
    // background-color: #fee9c5;
    background-color: #ff8a80;
    color: #333;
  }

  .info-title {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #000;
    padding: 10px 10px;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
    margin-bottom: 30px;
    &:before {
      position: absolute;
      top: 10px;
      left: 0;
      content: '';
      display: inline-block;
      width: 4px;
      height: 100%;
      background-color: #2d8cf0;
    }
  }
  .info-container {
    width: 100%;
    height: calc(~'100% - 120px');
    .table-wrapper {
      width: 100%;
      height: calc(~'100% - 138px');
    }
  }
  .page {
    text-align: center;
    margin-top: 20px;
  }
  .ivu-form-item {
    margin-bottom: 0 !important;
  }
}
// CSS3 animation
@keyframes rotateIcon {
  from {
    transform: rotateY(0);
  }
  to {
    transform: rotateY(180deg);
  }
}
@keyframes hideToshow {
  from {
    transform: translateX(100%);
  }
  to {
    transform: rotateY(0);
  }
}
</style>
