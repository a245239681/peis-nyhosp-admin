<template>
  <div class="info-wrapper-Check"
       :class="{show : showFlag, hide: hideFlag}">
    <!-- <div class="toggle-btn"
         @click="showInfo">
      <i class="icon-toggle"
         :class="{show : showFlag, hide: hideFlag}"></i>
    </div>-->
    <div class="info-title">XXX的申请单</div>
    <div class="info-container">
      <div class="main">
        <div class="Card-body">
          <Card style="width: 100%">
            <Row slot="title">
              <Col span="18">
              <div class="Card-head-fone">XX医院项目检查申请单</div>
              </Col>
              <Col span="6">
              <div>
                <img src="@/assets/images/barCode.png"
                     style="width: 100%;height: 35px">
                <div style="margin-top: 5px">12345</div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              姓名：
              <span>李白</span>
              </Col>
              <Col span="6">
              性别：
              <span>男</span>
              </Col>
              <Col span="6">
              年龄：
              <span>20</span>
              </Col>
              <Col span="6">
              开单科室：
              <span>体检科</span>
              </Col>
              <Col span="12">
              体检号：
              <span>123456</span>
              </Col>
              <Col span="12">
              单位名称：
              <span>阿里巴巴</span>
              </Col>
              <Col span="24">紫管1 2ml(检测项目如下)</Col>
              <Col span="24">
              <Checkbox-group v-model="fruit"
                              @on-change="changeCheckBox">
                <Checkbox label="香蕉">香蕉</Checkbox>
                <Checkbox label="苹果">苹果</Checkbox>
                <Checkbox label="西瓜">西瓜</Checkbox>
              </Checkbox-group>
              </Col>
            </Row>
          </Card>
          <Card style="width: 100%">
            <Row slot="title">
              <Col span="18">
              <div class="Card-head-fone">XX医院项目检查申请单</div>
              </Col>
              <Col span="6">
              <div>
                <img src="@/assets/images/barCode.png"
                     style="width: 100%;height: 35px">
                <div style="margin-top: 5px">12345</div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              姓名：
              <span>李白</span>
              </Col>
              <Col span="6">
              性别：
              <span>男</span>
              </Col>
              <Col span="6">
              年龄：
              <span>20</span>
              </Col>
              <Col span="6">
              开单科室：
              <span>体检科</span>
              </Col>
              <Col span="12">
              体检号：
              <span>123456</span>
              </Col>
              <Col span="12">
              单位名称：
              <span>阿里巴巴</span>
              </Col>
              <Col span="24">紫管1 2ml(检测项目如下)</Col>
              <Col span="24">
              <Checkbox-group v-model="fruit"
                              @on-change="changeCheckBox">
                <Checkbox label="香蕉">香蕉</Checkbox>
                <Checkbox label="苹果">苹果</Checkbox>
                <Checkbox label="西瓜">西瓜</Checkbox>
              </Checkbox-group>
              </Col>
            </Row>
          </Card>
          <Card style="width: 100%">
            <Row slot="title">
              <Col span="18">
              <div class="Card-head-fone">XX医院项目检查申请单</div>
              </Col>
              <Col span="6">
              <div>
                <img src="@/assets/images/barCode.png"
                     style="width: 100%;height: 35px">
                <div style="margin-top: 5px">12345</div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              姓名：
              <span>李白</span>
              </Col>
              <Col span="6">
              性别：
              <span>男</span>
              </Col>
              <Col span="6">
              年龄：
              <span>20</span>
              </Col>
              <Col span="6">
              开单科室：
              <span>体检科</span>
              </Col>
              <Col span="12">
              体检号：
              <span>123456</span>
              </Col>
              <Col span="12">
              单位名称：
              <span>阿里巴巴</span>
              </Col>
              <Col span="24">紫管1 2ml(检测项目如下)</Col>
              <Col span="24">
              <Checkbox-group v-model="fruit"
                              @on-change="changeCheckBox">
                <Checkbox label="香蕉">香蕉</Checkbox>
                <Checkbox label="苹果">苹果</Checkbox>
                <Checkbox label="西瓜">西瓜</Checkbox>
              </Checkbox-group>
              </Col>
            </Row>
          </Card>
          <Card style="width: 100%">
            <Row slot="title">
              <Col span="18">
              <div class="Card-head-fone">XX医院项目检查申请单</div>
              </Col>
              <Col span="6">
              <div>
                <img src="@/assets/images/barCode.png"
                     style="width: 100%;height: 35px">
                <div style="margin-top: 5px">12345</div>
              </div>
              </Col>
            </Row>
            <Row>
              <Col span="6">
              姓名：
              <span>李白</span>
              </Col>
              <Col span="6">
              性别：
              <span>男</span>
              </Col>
              <Col span="6">
              年龄：
              <span>20</span>
              </Col>
              <Col span="6">
              开单科室：
              <span>体检科</span>
              </Col>
              <Col span="12">
              体检号：
              <span>123456</span>
              </Col>
              <Col span="12">
              单位名称：
              <span>阿里巴巴</span>
              </Col>
              <Col span="24">紫管1 2ml(检测项目如下)</Col>
              <Col span="24">
              <Checkbox-group v-model="fruit"
                              @on-change="changeCheckBox">
                <Checkbox label="香蕉">香蕉</Checkbox>
                <Checkbox label="苹果">苹果</Checkbox>
                <Checkbox label="西瓜">西瓜</Checkbox>
              </Checkbox-group>
              </Col>
            </Row>
          </Card>
        </div>
        <div class="page-footer">
          <!-- <Page :total="totalSize"
                @on-change="pageIndexChange"
                size="small"
                show-elevator
                show-total
          class="page"/>-->
          <Col>
          <Col span="20">
          <Button @click="showInfo">关闭</Button>
          </Col>
          <Col span="4">
          <Button @click="print">打印</Button>
          </Col>
          </Col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listByName } from '@/api/personal_appointment.js'
import {
  mainExamBasicInfoList,
  deptResultDetailsList
} from '@/api/mainExam.js'
import moment from 'moment'

export default {
  name: 'info',
  props: {
    // info: Object
  },
  data () {
    return {
      fruit: ['苹果'],
      search: '',
      isShowInfo: false,
      showFlag: false,
      hideFlag: true,
      formData: {},
      unitList: [],
      patientColumns: [
        {
          title: '体检号',
          key: 'boPeId',
          width: 90,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'boName',
          width: 100,
          align: 'center'
        },
        {
          title: '性别',
          width: 80,
          key: 'boSex',
          align: 'center'
        },
        {
          title: '年龄',
          width: 80,
          key: 'boAge',
          align: 'center'
        },
        {
          title: '身份证',
          width: 150,
          key: 'boIdNo',
          align: 'center'
        },
        {
          title: '体检次数',
          width: 100,
          sortable: true,
          sortType: 'desc',
          key: 'boVisitSn',
          align: 'center'
        },
        {
          title: '体检类别',
          width: 100,
          key: 'boCategory',
          align: 'center'
        },
        {
          title: '体检日期',
          slot: 'boActualRegisterDate',
          width: 165,
          key: 'boActualRegisterDate',
          align: 'center'
        },
        {
          title: '体检单位',
          key: 'boUnitName',
          align: 'center'
        },
        {
          title: '体检套餐',
          key: 'boPackageName',
          align: 'center'
        }
      ],
      patientTable: [],
      pageIndex: 1,
      pageSize: 10,
      totalSize: 100,
      unitNameLoading: false,
      unitsList: [],
      startTimeOptions: {}, // 开始日期设置
      endTimeOptions: {}, // 结束日期设置
      isLoading: false,
      btnLoading: false,
      otherInfo: {}, // 其他信息
      diagnosticRecords: [] // 诊断记录数据
    }
  },
  created () { },
  filters: {
    dateTime: function (value, formatString) {
      formatString = formatString || 'YYYY-MM-DD hh:mm'
      return moment(value).format(formatString)
    }
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  methods: {
    print () {
      window.print()
    },
    changeCheckBox (val) {
      console.log(val)
    },
    showInfo () {
      // this.isShowInfo = !this.isShowInfo;
      this.showFlag = !this.showFlag
      this.hideFlag = !this.hideFlag
      this.formData = {}
    },
    // 搜索病人基本信息
    handleSearch (page = 1, size = 10) {
      this.pageIndex = page
      this.pageSize = size
      console.log(this.pageIndex)
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }

      let params = {
        boPeId: this.formData.peId || '',
        boName: this.formData.name || '',
        boUnitName: this.formData.boUnitName || '',
        boActualRegisterDateS: this.formData.regStartDate || '',
        boActualRegisterDateE: this.formData.regEndtDate || '',
        boResultStatus: this.formData.resultStatus || ''
      }
      this.isLoading = true
      this.btnLoading = true
      mainExamBasicInfoList(pagination, params)
        .then(({ data }) => {
          if (data.code == 0) {
            this.isLoading = false
            this.btnLoading = false
            let res = data.data
            // console.log(patientTable)
            this.patientTable = res.records
            this.totalSize = res.total
          } else {
            this.isLoading = true
            this.btnLoading = true
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    getUnits () { },
    changeUnitName (val) { },
    // 设置开始和结束时间选择范围
    startTimeChange: function (e) {
      // 设置开始时间
      this.formData.regStartDate = e
      this.endTimeOptions = {
        disabledDate: date => {
          let startTime = this.formData.regStartDate
            ? new Date(this.formData.regStartDate).valueOf()
            : ''
          return date && date.valueOf() < startTime
        }
      }
    },
    endTimeChange: function (e) {
      // 设置结束时间
      this.formData.regEndtDate = e
      let endTime = this.formData.regEndtDate
        ? new Date(this.formData.regEndtDate).valueOf() -
        1 * 24 * 60 * 60 * 1000
        : ''
      this.startTimeOptions = {
        disabledDate (date) {
          return date && date.valueOf() > endTime
        }
      }
    },
    // 查询单位
    getUnits (query) {
      console.log(query)
      if (query !== '') {
        this.unitNameLoading = true
        let unitParam = {
          boUnitName: query
        }
        listByName(unitParam).then(res => {
          console.log(res)
          let result = res.data
          if (result.code === 0) {
            this.unitNameLoading = false
            this.unitsList = result.data
          } else {
            this.$Message.error(result.message)
          }
        })
      }
    },
    // 双击事件
    async handleDbclick (row, index) {
      // this.$emit('func', row)
      // console.log(row)
      console.log(this.userInfo)
      let params = {
        boPeId: row.boPeId,
        boVisitSn: row.boVisitSn,
        boName: row.boName
      }
      await deptResultDetailsList(params)
        .then(({ data }) => {
          // console.log(data)
          if (data.code == 0) {
            let result = data.data
            // 诊断记录数据
            let arr = result.filter(item => {
              return item.inId != -2
            })
            let len = result.length
            this.otherInfo = { ...result[len - 1] }
            // this.review= otherInfo.inContent
            // this.suggest= otherInfo.inGuideContent
            // this.uncheckedItems = otherInfo.inIsInChiefReport
            this.diagnosticRecords = [...arr]
            // console.log(this.otherInfo)
            // console.log(arr)
            this.showInfo()
            this.patientTable = []
          } else {
            this.tableData = []
            this.showInfo()
          }
        })
        .catch(err => {
          this.$Message.error('网络不稳定，请稍后重试')
        })

      let obj = {
        basicInfo: row,
        diagnosticRecords: this.diagnosticRecords,
        otherInfo: this.otherInfo,
        disabled: true
      }
      this.$emit('func', obj)
    },
    // 切换页码
    pageIndexChange (val) {
      // console.log(val)
      this.handleSearch(val, 10)
    }
  }
}
</script>
<style lang="less">
.info-wrapper-Check {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  width: 600px;
  max-width: 600px;
  background-color: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  transform: translateX(100%);
  box-shadow: -1px -1px 15px #dcdee2;
  .table-wrapper {
    padding-bottom: 60px;
  }
  &.show {
    animation: hideToshow 0.5s;
    transform: translateX(0);
  }
  &.hide {
    animation: showTohide 0.5s;
    transform: translateX(100%);
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
    background-repeat: no-repeat;
  }
  .info-title {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: bolder;
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
  .page {
    text-align: center;
    margin-top: 20px;
  }
  .Card-head-fone {
    font-weight: 900;
    font-size: x-large;
  }
  .Card-body {
    height: 600px;
    overflow: scroll;
    overflow-x: hidden;
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

@keyframes showTohide {
  from {
    transform: translateX(0);
  }
  to {
    transform: rotateY(0);
    transform: translateX(100%);
  }
}
</style>
