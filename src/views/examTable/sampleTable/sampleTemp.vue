<template>
  <div class="sampletemp-wrapper">
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
            :label-width="60">

        <div class="info">
          <Row :gutter="16">

            <Col span="6">
            <FormItem label="体检号"
                      prop="boPeId">
              <Input v-model="form.boPeId"
                     disabled
                     size="small" />
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="体检类型"
                      :label-width="80"
                      prop="boCategory">
              <Input v-model="form.boCategory"
                     disabled
                     size="small" />
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="体检次数"
                      :label-width="80"
                      prop="boVisitSn">
              <Input v-model="form.boVisitSn"
                     disabled
                     size="small" />
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="体检单位"
                      :label-width="80"
                      prop="boUnitName">
              <Input v-model="form.boUnitName"
                     disabled
                     size="small" />
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="16">
            <Col span="6">
            <Row :gutter="16">
              <Col span="14">
              <FormItem label="姓名"
                        prop="boName">
                <Input v-model="form.boName"
                       disabled
                       size="small" />
              </FormItem>
              </Col>
              <Col span="10">
              <FormItem label="年龄"
                        prop="boAge"
                        :lable-width="36">
                <Input v-model="form.boAge"
                       disabled
                       size="small" />
              </FormItem>
              </Col>
            </Row>
            </Col>
            <Col span="6">
            <Row :gutter="16">
              <Col span="10">
              <FormItem label="性别"
                        prop="boSex">
                <Input v-model="form.boSex"
                       disabled
                       size="small" />
              </FormItem>
              </Col>
              <Col span="14">
              <FormItem label="婚姻状态"
                        :label-width="80"
                        prop="boMaritalStatus">
                <Input v-model="form.boMaritalStatus"
                       disabled
                       size="small" />
              </FormItem>
              </Col>
            </Row>
            </Col>
            <Col span="6">
            <FormItem label="体检套餐"
                      :label-width="80"
                      prop="boPackage">
              <Input v-model="form.boPackage"
                     disabled
                     size="small" />
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="体检分组"
                      :label-width="80"
                      prop="boGroupingName">
              <Input v-model="form.boGroupingName"
                     disabled
                     size="small" />
            </FormItem>
            </Col>
          </Row>
          <Row :gutter="16">
            <Col span="6">
            <FormItem label="登记流水号"
                      :label-width="95"
                      prop="boRegisterCode">
              <Input v-model="form.boRegisterCode"
                     ref="inputFocus"
                     @on-enter="getInfoByRegister"
                     size="small" />
            </FormItem>
            </Col>
          </Row>
        </div>

      </Form>
    </div>
    <div class="body-wrapper">
      <div class="title-wrapper">
        <p class="title">
          <span>检前采样</span>
        </p>
        <div class="title-right-tool">
          <Button type="primary"
                  @click="toggleSample(true)"
                  size="small">全部留样</Button>
          <Button type="error"
                  style="margin-left: 8px;"
                  @click="toggleSample(false)"
                  size="small">取消留样</Button>
          <Button type="primary"
                  size="small"
                  style="margin-left: 8px;"
                  :loading="registerLoading"
                  @click="registerHandle()">全部采样</Button>
          <!-- <Button type="primary"
                  style="margin-left: 8px;"
                  size="small">全部打印</Button> -->
          <!-- <Button type="error"
                  style="margin-left: 8px;"
                  size="small">全部作废</Button> -->
        </div>
      </div>
      <div class="main-wrapper">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               max-height="500"
               highlight-row
               ref="table"
               @on-row-click="rowClick"
               @on-selection-change="selectChange">
          <template slot-scope="{ row, index }"
                    slot="comboNameList">
            <span v-for="(item, key) in row.comboNameList"
                  :key="key">{{item}}{{(row.comboNameList.length - 1) == key ? '' : '，'}}</span>
          </template>
          <template slot-scope="{ row, index }"
                    slot="inIsSample">
            <Checkbox v-model="row.inIsSample"
                      @on-change="bindIsSample(row, index)"></Checkbox>
          </template>
          <template slot="inStatus"
                    slot-scope="{row}">
            <Tag color="orange"
                 v-if="row.inStatus == 1 || row.inStatus == null">未采样</Tag>
            <Tag color="green"
                 v-else>已采样</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    @click="registerHandle(row)"
                    :loading="curRow.inBarcode == row.inBarcode && registerLoading"
                    v-if="row.inStatus == 1 || row.inStatus == null"
                    size="small">采样</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    @click="invalidHandle(row)"
                    :loading="curRow.inBarcode == row.inBarcode && invalidLoading"
                    v-else
                    size="small">取消采样</Button>
          </template>
        </Table>
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
        <!-- 科室待检人数：<span style="color:#2d8cf0">{{ num }}</span>人 -->
      </div>
      <!-- <div class="doctor">
        <span class="pre-title">检查医生</span>
        <Select v-model="doctorId"
                :label-in-value="true"
                filterable
                @on-change="examDoctorChange"
                size="small">
          <Option v-for="item in examDoctorDict"
                  :value="item.staffId"
                  :key="item.staffId">{{ item.staffName }}</Option>
        </Select>
      </div> -->
      <div class="operator">
        <span class="pre-title">操作员</span>
        <Input prefix="ios-contact"
               v-model="operator"
               disabled
               size="small" />
      </div>
      <!-- <div class="examDate">
        <span class="pre-title">体检日期</span>
        <DatePicker v-model="examDate"
                    :value="examDate"
                    format="yyyy-MM-dd HH:mm"
                    type="datetime"
                    size="small"
                    placement="bottom-end"
                    placeholder="请选择日期"></DatePicker>
      </div> -->
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { checkSample, patientVisitPic, sampleRegister, sampleInvalid, searchByRegister } from '@/api/sampleTable'

export default {
  data () {
    return {
      form: {},
      selections: [], // 表格选中项
      tableData: [],
      columns: [
        {
          width: 55,
          type: 'selection',
          align: 'center'
        },
        {
          title: '序号',
          width: 100,
          type: 'index',
          align: 'center'
        },
        {
          title: '条码ID',
          key: 'inBarcode',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '标本名称',
          key: 'inSpecimanName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '项目组合名称',
          slot: 'comboNameList',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '试管分类',
          key: 'inTestTubeName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '是否留样',
          slot: 'inIsSample',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '登记状态',
          slot: 'inStatus',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 120,
          align: 'center'
        },
      ],
      isLoading: false,
      tableLoading: false,
      registerLoading: false,
      doctorId: '',
      doctorName: '',
      examDate: '',
      operator: '',
      num: 255,
      dept: '',
      curRow: {}, // 当前点击采样行数据
      invalidLoading: false,
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
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.inputFocus.focus()
    })

    this.$store.dispatch('getRoomDict');
    let params = {
      deptId: ''
    }
    this.$store.dispatch('getExamDoctorDict', { params })
    this.dept = this.userInfo.userDeptId
    this.doctorId = this.userInfo.poId
    this.doctorName = this.userInfo.poName
    this.operator = this.userInfo.poName
    this.examDate = moment().format('YYYY-MM-DD HH:mm:ss')
  },
  methods: {
    selectChange (val) {
      this.selections = val
    },
    getPatientInfo (msg) {
      this.dataReset()
      this.form = msg
      this.checkSampleList(msg.boPeId, msg.boVisitSn)
      this.getPatientPic(msg.boPeId, msg.boVisitSn)
    },
    // 采样查询
    checkSampleList (id, visitSn) {
      let params = {
        inPeId: id,
        inVisitSn: visitSn
      }
      this.tableLoading = true
      checkSample(params).then(({ data }) => {
        this.tableLoading = false
        if (data.code == 0) {
          let result = data.data
          // iview checkbox控件boolean以外的数据类型双向绑定无效
          result.forEach(item => {
            if (item.inIsSample == 0) {
              item.inIsSample = true
            } else {
              item.inIsSample = false
            }
          });
          this.tableData = result
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.tableLoading = false
        this.$Message.error('获取病人采样信息失败，请稍后重试')
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
    bindIsSample (row, index) {
      this.tableData[index] = row
      // 修复勾选后是否采样复选框修改时无法同步数据的问题
      for (let i = 0; i < this.selections.length; i++) {
        if (this.selections[i].inId == row.inId) {
          this.selections[i].inIsSample = row.inIsSample
        }
      }
    },
    // 是否全部留样操作
    toggleSample (btn) {
      if (this.tableData.length == 0) {
        this.$Message.error('无留样数据')
        return false
      }

      if (btn) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.$set(this.tableData[i], 'inIsSample', true)
        }
        this.selections = []
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          this.$set(this.tableData[i], 'inIsSample', false)
        }
        this.selections = []
      }
    },
    // 选中行
    rowClick (data, index) {
      this.$refs.table.toggleSelect(index)
      this.operator = data.inOperator || this.userInfo.poName
    },
    // 修改检查医生
    examDoctorChange (obj) {
      if (obj) {
        this.doctorName = obj.label
      }
    },

    // 根据流水号查询
    getInfoByRegister () {
      console.log(this.form.boRegisterCode)
      if (!this.form.boRegisterCode) {
        return false
      }
      let params = {
        registerCode: this.form.boRegisterCode
      }
      searchByRegister(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.dataReset()
          result.barcodeList.forEach(item => {
            if (item.inIsSample == 0) {
              item.inIsSample = true
            } else {
              item.inIsSample = false
            }
          });
          this.form = result.patientInfo || {}
          this.tableData = result.barcodeList || []
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error(err)
      })
    },
    // 登记
    registerHandle (row) {
      if (this.registerLoading) return false
      let arr = []

      if (row) {
        this.curRow = row
        let isSample = '0'
        let obj = JSON.parse(JSON.stringify(row))
        if (row.inIsSample == false) {
          isSample = '1'
        }
        obj.inIsSample = isSample
        obj.inStatus = '0'
        // let obj = {
        //   'inBarcode': row.inBarcode,
        //   'inIsSample': isSample,
        //   'inStatus': '0'
        // }

        // arr.push(obj)
        arr.push(obj)
        this.registerLoading = true
      } else {
        this.selections.forEach(item => {
          let isSample = '0'
          if (item.inIsSample == false) {
            isSample = '1'
          }
          item.inIsSample = isSample
          item.inStatus = '0'
          // let obj = {
          //   'inBarcode': item.inBarcode,
          //   'inIsSample': isSample,
          //   'inStatus': '0'
          // }
          // console.log(obj)
          arr.push(item)
        })
        this.registerLoading = true
      }
      if (arr.length == 0) {
        this.registerLoading = false
        this.$Message.error('请选择需要登记的采样数据')
        return false
      }
      // let params = {
      //   'registerArr': arr,
      //   'inRegisterDate': moment(this.examDate).format('YYYY-MM-DD HH:mm:ss')
      // }
      let params = {
        'registerArr': arr
      }
      sampleRegister(params).then(({ data }) => {
        this.registerLoading = false
        if (data.code == 0) {
          this.$Message.success('登记成功')
          this.curRow = {}
          this.selections = []
          this.checkSampleList(this.form.boPeId, this.form.boVisitSn)
        } else {
          this.$Message.error(data.message)
        }

      }).catch(err => {
        this.registerLoading = false
        this.$Message.error('登记失败，请稍后重试')
      })

    },
    // 作废
    invalidHandle (row) {
      if (this.invalidLoading) return false
      this.curRow = row
      let arr = []
      arr.push(row)
      let params = {
        'registerArr': arr
      }
      this.invalidLoading = true
      sampleInvalid(params).then(({ data }) => {
        this.invalidLoading = false
        if (data.code == 0) {
          this.curRow = {}
          this.$Message.success('已成功取消采样')
          this.checkSampleList(this.form.boPeId, this.form.boVisitSn)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.invalidLoading = false
        this.$Message.error('取消失败，请稍后重试')
      })

    },
    // 清空数据
    dataReset () {
      this.tableData = []
      this.selections = []
      this.form = {}
    }
  },
}
</script>
<style lang="less">
.sampletemp-wrapper {
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
        width: 86px;
        flex-shrink: 0;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }
  }
  .body-wrapper {
    min-height: 60vh;
    flex: 1;
    .title-wrapper {
      padding: 12px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .main-wrapper {
      width: 100%;
      margin-bottom: 20px;
    }
    .title {
      font-weight: bold;
      font-size: 14px;
      padding-left: 8px;
      position: relative;
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
    .title-right-tool {
      display: flex;
      align-items: center;
    }
  }
  .record-dept {
    width: 100%;
    height: 40px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    border-radius: 5px;
    font-size: 14px;
    color: #252525;
    &-waiting {
      margin-left: 20px;
    }
    .record-dept-title {
      width: 240px;
    }
    .record-dept-waiting {
      flex: 1;
    }
    .doctor,
    .operator,
    .examDate {
      width: 220px;
      margin-left: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .pre-title {
        text-align: right;
        width: 110px;
        padding-right: 16px;
      }
    }
    .examDate {
      width: 240px;
    }
  }
  .ivu-form-item {
    margin-bottom: 0px !important;
  }
  .ivu-input[disabled] {
    color: #666;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-select-disabled .ivu-select-selection {
    color: #666;
  }
}
</style>