<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="体检预约查询"
           :width="1500"
           class="history-edit-wrapper">
      <div class="modal-body clearfix">
        <div class="screen-info-wrapper">
          <div class="screen-form">
            <Form :model="form"
                  label-position="right"
                  ref="form"
                  inline
                  class="form-wrapper"
                  :label-width="60">
              <div class="sub-wrapper"
                   style="min-width: 310px">
                <Row type="flex">
                  <FormItem label="姓名"
                            :label-width="80">
                    <Input v-model="form.boName"
                           style="width:100px"
                           size="small"
                           clearable />
                  </FormItem>
                  <FormItem label="性别"
                            :label-width="40">
                    <Select v-model="form.boSex"
                            @on-change="sexChange"
                            size="small">
                      <Option value="不限">不限</Option>
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                    </Select>
                  </FormItem>
                </Row>
                <Row type="flex">
                  <FormItem label="体检单位"
                            :label-width="80">
                    <Select v-model="form.boUnitId"
                            class="unitSelect"
                            style="width:220px"
                            ref="unitSelectBox"
                            clearable
                            filterable
                            remote
                            size="small"
                            :label-in-value="true"
                            placeholder=" "
                            @on-change="changeUnit"
                            @on-clear="clearUnit"
                            :remote-method="getUnits"
                            :loading="unitSearchLoading">
                      <Option v-for="item in unitsList"
                              :value="item.boUnitId"
                              :key="item.boUnitId">{{ item.boUnitName }}</Option>
                    </Select>
                  </FormItem>
                </Row>
              </div>
              <div class="sub-wrapper">
                <Row type="flex">
                  <FormItem label="证件号码"
                            :label-width="80">
                    <Input v-model="form.boIdNo"
                           style="width:160px"
                           size="small"
                           clearable />
                  </FormItem>
                  <FormItem label="联系电话"
                            :label-width="80">
                    <Input v-model="form.boMobile"
                           style="width:110px"
                           size="small"
                           clearable />
                  </FormItem>
                </Row>
                <Row type="flex">
                  <FormItem label="单位次数"
                            :label-width="80">
                    <Select v-model="form.boUnitVisitSn"
                            size="small"
                            style="min-width:102px"
                            @on-change="changeUnitVisitSn"
                            clearable
                            :label-in-value="true">
                      <Option v-for="item in unitVisitSnList"
                              :value="item.unitVisitSn"
                              :key="item.unitVisitSn">{{item.unitVisitSn}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="体检分组"
                            :label-width="80">
                    <Select v-model="form.groupId"
                            size="small"
                            style="width:168px"
                            @on-change="changeUnitGroup"
                            clearable>
                      <Option v-for="item in groupingResultList"
                              :value="item.groupingId"
                              :key="item.groupingId">{{ item.groupingName }}</Option>
                    </Select>
                  </FormItem>
                </Row>
              </div>
              <div class="sub-wrapper">
                <Row type="flex">
                  <FormItem label="预约时间"
                            :label-width="80">
                    <DatePicker type="date"
                                style="width:120px"
                                v-model="form.boBookingDateStart"
                                size="small"></DatePicker>
                  </FormItem>
                  <FormItem label="到"
                            :label-width="36">
                    <DatePicker type="date"
                                style="width:120px"
                                v-model="form.boBookingDateEnd"
                                size="small"></DatePicker>
                  </FormItem>
                </Row>
                <Row type="flex">
                  <FormItem label="所属部门"
                            :label-width="80">
                    <Cascader :data="deptList"
                              v-model="selectDeptArr"
                              change-on-select
                              size="small"
                              style="width:285px"
                              @on-change="deptChange"></Cascader>
                  </FormItem>
                </Row>
              </div>
              <div class="sub-wrapper">
                <Row type="flex">
                  <FormItem label="预约来源"
                            :label-width="80">
                    <Select v-model="form.boSourceId"
                            size="small"
                            style="width:120px"
                            @on-change="sourceChange"
                            clearable
                            :label-in-value="true">
                      <Option v-for="item in sourceList"
                              :value="item.cdId"
                              :key="item.cdId">{{item.cdName}}</Option>
                    </Select>
                  </FormItem>
                </Row>
                <Row type="flex">
                  <FormItem label="体检类型"
                            prop="boCategoryId"
                            :label-width="80">
                    <Select v-model="form.boCategoryId"
                            size="small"
                            style="width:120px"
                            @on-change="changeCategory"
                            clearable
                            :label-in-value="true">
                      <Option v-for="item in categoryList"
                              :value="item.cdId"
                              :key="item.cdId">{{item.cdName}}</Option>
                    </Select>
                  </FormItem>
                </Row>
              </div>
            </Form>
            <div class="handle-wrapper">
              <div><Button style="margin-left: 8px;width: 126px;margin-bottom: 8px;"
                        type="error"
                        @click="resetHandle">清空</Button></div>
              <Button style="margin-left: 8px;"
                      type="primary"
                      @click="getList()"
                      :loading="isLoading">查询</Button>
            </div>

          </div>
        </div>
        <div class="table-wrapper">
          <vxe-table class="mytable-footer"
                     ref="workloadTable"
                     border
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     align="center"
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     @cell-dblclick="confirmHandle"
                     :height="400"
                     :data="tableData"
                     :loading="isLoading">
            <vxe-table-column field="boName"
                              title="姓名"
                              width="80"></vxe-table-column>
            <vxe-table-column field="boSex"
                              title="性别"
                              width="60"></vxe-table-column>
            <vxe-table-column field="boAge"
                              title="年龄"
                              width="60"></vxe-table-column>
            <vxe-table-column field="boIdNo"
                              title="证件号"
                              show-overflow="title"
                              min-width="180"></vxe-table-column>
            <vxe-table-column field="boMobile"
                              title="联系电话"
                              width="140"></vxe-table-column>
            <vxe-table-column field="boBookingDate"
                              title="预约时间"
                              min-width="160"></vxe-table-column>
            <vxe-table-column field="boBookingStatus"
                              title="预约状态"
                              min-width="120">
              <template v-slot="{row}">
                <Tag color="blue"
                     v-if="row.boBookingStatus == '0'">预约中</Tag>
                <Tag color="green"
                     v-else-if="row.boBookingStatus == '1'">已确认</Tag>
                <Tag color="red"
                     v-else>已取消</Tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="boCategory"
                              title="体检类型"
                              show-overflow="title"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="boSource"
                              title="预约来源"
                              show-overflow="title"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="boUnitName"
                              title="体检单位"
                              show-overflow="title"
                              min-width="180"></vxe-table-column>
            <vxe-table-column field="boDepartmentName"
                              title="单位部门"
                              show-overflow="title"
                              min-width="140"></vxe-table-column>
            <vxe-table-column field="boSubDepartmentName"
                              title="子部门"
                              show-overflow="title"
                              min-width="140"></vxe-table-column>
            <vxe-table-column field="boGroupName"
                              title="单位分组"
                              show-overflow="title"
                              min-width="140"></vxe-table-column>

          </vxe-table>
          <div class="pagination-wrapper">
            <Page :total="totalSize"
                  :page-size="pageSize"
                  :current="pageIndex"
                  :page-size-opts="[10,20,40,100]"
                  @on-change="pageIndexChange"
                  @on-page-size-change="pageSizeChange"
                  size="small"
                  show-sizer
                  show-elevator
                  show-total />
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import { getDeptInfoByUnit } from "@/api/unitManage_unitPersonManage.js";
import { unitGroupInfo, bookingList, listByName } from "@/api/newPersonRegister"
import { trimRight } from 'xe-utils/methods';
import moment from 'moment'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      form: {
        boType: '3' // 预约单类型：1：全部；2：预约中、确认；3：预约中；4：确认；5：取消
      },
      isLoading: false,
      unitSearchLoading: false,
      unitTimer: null,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      tableData: [],
      unitsList: [],
      unitVisitSnList: [], // 单位体检次数列表
      groupingResultList: [], // 单位分组列表
      deptList: [], // 单位部门数据
      selectDeptArr: [] // 选择的部门数据
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    sourceList: {
      get: function () {
        return this.$store.getters.getPersonSourceDict
      },
      set: function () { }
    },
    categoryList: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
    }
  },
  mounted () {
    // 获取体检类型
    this.$store.dispatch('getCategoryDict')
    this.$store.dispatch('getPersonSourceDict')
  },
  methods: {
    // 更改人员来源
    sourceChange (e) {
      if (e != undefined) {
        // console.log(e)
        this.form.boSource = e.label
      } else {
        this.form.boSource = ''
        this.form.boSourceId = ''
      }
    },

    // 更改体检类型
    changeCategory (e) {
      if (e) {
        this.form.boCategory = e.label
      } else {
        this.form.boCategoryId = ''
        this.form.boCategory = ''
      }
    },

    // 更改性别
    sexChange (e) {
      if (!e) {
        this.form.patientSex = '不限'
      }
    },
    closeModal () {
      this.$refs.form.resetFields()
      this.form = {
        boType: '3'
      }
      this.$emit('close')
    },

    // 双击确认选择
    confirmHandle (row) {
      this.$emit('bookingImport', row.row)
      this.$emit('close')
    },

    // 获取历史预约单数据
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      this.form.boType = '3'
      const params = Object.assign({}, this.form)
      let _startDate = this.form.boBookingDateStart ? moment(this.form.boBookingDateStart).format('YYYY-MM-DD') : ''
      let _endDate = this.form.boBookingDateEnd ? moment(this.form.boBookingDateEnd).format('YYYY-MM-DD') : ''
      params.boBookingDateStart = _startDate
      params.boBookingDateEnd = _endDate
      if (params.boUnitVisitSn == '') {
        params.boUnitVisitSn = null
      }
      console.log(params)
      this.isLoading = true
      bookingList(params, pagination).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalSize = data.data.total
        } else {
          this.tableData = []
          this.totalSize = 0
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.form = {}
      } else {
        const { boName, boSex, boIdNo, boCategoryId, boCategory, boSourceId, boMobile } = row
        this.form = { boName, boSex, boIdNo, boCategoryId, boCategory, boSourceId, boMobile }

        this.getList()
      }
    },
    // 更改单位体检次数
    changeUnitVisitSn (e) {
      this.selectDeptArr = []
      this.deptList = []
      this.groupingResultList = []
      if (e) {
        this.$set(this.form, 'groupId', '')
        const arr = this.unitVisitSnList.filter(item => {
          return item.unitVisitSn == e.value
        })
        if (arr.length > 0) {
          this.groupingResultList = arr[0].groupingResultList
          this.getDeptList()
        }
      } else {
        this.$set(this.form, 'groupId', '')
        this.$set(this.form, 'boUnitVisitSn', '')
      }
    },

    // 获取单位列表
    getUnits (query = '') {
      this.unitSearchLoading = true
      this.unitTimer && clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: query
        }
        listByName(params).then(({ data }) => {
          if (data.code === 0) {
            this.unitsList = data.data
          } else {
            this.$Message.error(result.message)
          }
          this.unitSearchLoading = false
        }).catch(err => {
          console.log(err)
          this.unitSearchLoading = false
          this.$Message.error(err.message)
        })
      }, 300)
    },

    // 获取单位部门
    getDeptList () {
      const params = {
        boUnitId: this.form.boUnitId,
        boUnitVisitSn: this.form.boUnitVisitSn
      }
      getDeptInfoByUnit(params).then(({ data }) => {
        if (data.code == 0) {
          this.deptList = data.data
          this.transCascaderData(this.deptList)
          console.log(this.deptList)
        } else {
          this.$Message.error(data.message)
        }
      })
    },

    // 处理级联数据
    transCascaderData (arr) {
      arr.forEach(item => {
        item.value = item.deptId
        item.label = item.name
        if (item.children) {
          item.children.forEach(v => {
            v.value = v.deptId
            v.label = v.deptName
          })
        }
      })
      return arr
    },

    // 选择部门
    deptChange (value, selectedData) {
      if (selectedData.length == 2) {
        // 即选择了父级部门，又选择了子级部门
        this.form.boSubDepartmentName = selectedData[1].deptName
        this.form.boSubDepartmentId = selectedData[1].deptId
        this.form.boDepartmentId = selectedData[1].parentId
        this.form.boDepartment = selectedData[1].parentName
        // console.log(this.formData)
      } else if (selectedData.length == 1) {
        // 只选择了父级
        this.form.boSubDepartmentName = ''
        this.form.boSubDepartmentId = ''
        this.form.boDepartmentId = selectedData[0].deptId
        this.form.boDepartment = selectedData[0].name
      } else {
        // 什么都没有选
        this.form.boSubDepartmentName = ''
        this.form.boSubDepartmentId = ''
        this.form.boDepartmentId = ''
        this.form.boDepartment = ''

      }
    },
    // 修改单位
    changeUnit (obj) {
      if (obj) {
        this.$set(this.form, 'boUnitId', obj.value)
        this.$set(this.form, 'boUnitName', obj.label)
        this.$set(this.form, 'boUnitVisitSn', '')
        this.$set(this.form, 'groupId', '')
        this.$set(this.form, 'boDepartmentId', '')
        this.$set(this.form, 'boSubDepartmentId', '')
        this.$set(this.form, 'boSubDepartmentName', '')
        this.$set(this.form, 'boDepartment', '')
        this.deptList = []
        this.selectDeptArr = []
        this.getGroups()
      }
    },
    // 清除单位
    clearUnit () {
      this.$set(this.form, 'boUnitId', '')
      this.$set(this.form, 'boUnitName', '')
      this.$set(this.form, 'boUnitVisitSn', '')
      this.$set(this.form, 'groupId', '')
      this.$set(this.form, 'boDepartmentId', '')
      this.$set(this.form, 'boSubDepartmentId', '')
      this.$set(this.form, 'boSubDepartmentName', '')
      this.$set(this.form, 'boDepartment', '')
      this.groupingResultList = []
      this.unitVisitSnList = []
      this.deptList = []
      this.selectDeptArr = []
    },
    // 修改单位体检分组
    changeUnitGroup (val) {
      val ? this.$set(this.form, 'groupId', val) : this.$set(this.form, 'groupId', '')
    },
    // 查询单位分组信息
    getGroups () {
      let params = {
        boUnitId: this.form.boUnitId
      }
      unitGroupInfo(params).then(({ data }) => {
        if (data.code === 0) {
          this.unitVisitSnList = data.data.unitVisitSnList
        } else {
          this.$Message.error(result.Message)
        }
      })
    },
    // 重置页面信息
    resetHandle () {
      this.form = {
        boSex: '不限'
      }
      this.totalSize = 0
      this.tableData = []
      this.clearUnit()
    },
    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    },
    formatTime ({ cellValue, row, column }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}
</script>
<style lang="less">
.history-edit-wrapper {
  width: 1300px;
  .screen-info-wrapper {
    padding-bottom: 15px;
    .code-search-input {
      display: flex;
      align-items: center;
      min-width: 180px;
      flex-shrink: 0;
    }
    .screen-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ivu-form-item {
        margin-bottom: 0px !important;
      }
    }
  }
  .table-wrapper {
    .search-info {
      line-height: 1.8;
      font-weight: bold;
      color: #252525;
      margin-bottom: 10px;
      span {
        color: #40a9ff;
      }
    }
  }
  .handle-wrapper {
    width: 100px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    > div {
      display: flex;
      margin-top: 10px;
      justify-content: center;
    }
  }
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
  }
  .form-wrapper {
    display: flex;
    flex: 1;
    width: 1148px;
  }
  .sub-wrapper {
    flex-shrink: 0;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-cascader {
    line-height: 32px;
  }
}
</style>
