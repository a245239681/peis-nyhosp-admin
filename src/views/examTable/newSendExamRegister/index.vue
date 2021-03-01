<template>
  <div class="new-send-exam-register-page-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">送检登记</span>
      </div>
      <div class="page-body clearfix">
        <div class="screen-info-wrapper">
          <div class="screen-form">
            <div class="scan-code-input-wrapper">
              <div class="label">扫码区域&nbsp;</div>
              <Input v-model="registerCode"
                     clearable
                     ref="inputFocus"
                     @on-enter="codeRegister()"
                     size="small" />
            </div>
            <Form :model="form"
                  label-position="right"
                  ref="form"
                  inline
                  style="flex:1;max-width: 1300px;"
                  :label-width="60">
              <FormItem label="项目试管"
                        prop="testTubeId"
                        :label-width="80">
                <Select v-model="form.testTubeId"
                        filterable
                        clearable
                        @on-change="changeApplyType"
                        style="width:140px"
                        size="small">
                  <Option v-for="item in testTubeDict"
                          :value="item.paId"
                          :key="item.paId">{{
                    (item.paName ? item.paName : '') + (item.paSpecification ? '-' + item.paSpecification : '') +
                    (item.paColor ? '-' + item.paColor : '') }}</Option>
                </Select>
              </FormItem>
              <FormItem label="姓名"
                        prop="medicalName">
                <Input v-model="form.medicalName"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="送检人"
                        :label-width="70"
                        prop="inspectName">
                <Input v-model="form.inspectName"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="项目名称"
                        :label-width="80"
                        prop="comboName">
                <Input v-model="form.comboName"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>
              <FormItem label="送检时间"
                        :label-width="80"
                        prop="inspectStartDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.inspectStartDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="到"
                        :label-width="36"
                        prop="inspectEndDate">
                <DatePicker type="date"
                            style="width:140px"
                            v-model="form.inspectEndDate"
                            size="small"></DatePicker>
              </FormItem>
            </Form>
            <div class="handle-wrapper">
              <div><Button style="margin-left: 8px;width: 126px;"
                        type="primary"
                        v-permission="['leadingOut']"
                        :loading="leadoutLoading"
                        @click="leadoutExcelHandle">导出为表格</Button></div>
              <div>
                <Button style="margin-left: 8px;"
                        type="default"
                        @click="resetHandle">重置</Button>
                <Button style="margin-left: 8px;"
                        type="primary"
                        @click="getList()"
                        :loading="isLoading">查询</Button>
              </div>
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
                     :height="(screenHeight - 340) <= 350 ? 350 : (screenHeight - 340)"
                     :data="tableData"
                     :loading="isLoading">
            <vxe-table-column field="sort"
                              title="序号"
                              width="80">
              <template v-slot="{ row, rowIndex }">
                <span>{{curPage === 1 ? (rowIndex + 1) : pageSize*(curPage - 1) + (rowIndex + 1)}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="inName"
                              title="姓名"
                              min-width="80"></vxe-table-column>
            <vxe-table-column field="inBarcode"
                              title="条码"
                              min-width="140"></vxe-table-column>
            <vxe-table-column field="comboName"
                              title="项目组合名称"
                              min-width="180"></vxe-table-column>
            <vxe-table-column field="inTestTubeName"
                              title="项目试管"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="useOrgClassName"
                              title="检验机构"
                              min-width="80"></vxe-table-column>
            <vxe-table-column field="inspectionName"
                              title="送检人"
                              show-overflow="title"
                              min-width="80"></vxe-table-column>
            <vxe-table-column field="inInspectionDate"
                              title="送检时间"
                              width="160"
                              :formatter="formatTime"></vxe-table-column>
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
    </Card>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import { registerByCode, examRegisterList, barcodeRegisterLeadOut } from '@/api/newSendExamRegister'
import moment from 'moment'

export default {
  name: 'newSendExamRegister',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {},
      tableData: [],
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      registerCode: '', // 登记流水号
      curPage: 1, // 当前页码
      leadoutLoading: false, // 导出loading
      sendLoading: false, // 送检请求btn
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
        }, 300)
      }
    }
  },
  computed: {
    testTubeDict: {
      get: function () {
        return this.$store.getters.getTestTubeDict
      },
      set: function () { }
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
    this.$store.dispatch('getTestTubeDict')
    let curDate = moment().format('YYYY-MM-DD')

    this.$set(this.form, 'inspectStartDate', curDate)
    this.$set(this.form, 'inspectEndDate', curDate)
  },
  methods: {
    // 获取总检医生工作量统计列表
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // 格式化时间
      this.form.inspectStartDate = this.form.inspectStartDate != '' ? moment(this.form.inspectStartDate).format('YYYY-MM-DD') : ''
      this.form.inspectEndDate = this.form.inspectEndDate != '' ? moment(this.form.inspectEndDate).format('YYYY-MM-DD') : ''
      this.isLoading = true
      examRegisterList(pagination, this.form).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalSize = data.data.total
          this.curPage = data.data.current
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

    // 选择试管
    changeApplyType (e) {
      if (!e) {
        this.form.testTubeId = ''
      }
    },

    // 导出为Excel表格
    async leadoutExcelHandle () {
      if (this.leadoutLoading) return
      if (this.tableData.length <= 0) {
        this.$Message.warning('没有需要导出的数据')
        return false
      }

      this.leadoutLoading = true
      try {
        const { data } = await barcodeRegisterLeadOut(this.form)
        this.leadoutLoading = false
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '送检报表统计.xlsx'
        link.click()
        this.$Message.success('操作成功')
      } catch (err) {
        this.leadoutLoading = false
        this.$Message.error(err.message)
      } finally {
      }
    },

    // 扫码登记接口
    codeRegister (btn) {
      if (this.sendLoading) return false
      if (!this.registerCode || this.registerCode.trim() == '') {
        this.registerCode = ''
        return false
      }
      let params = {
        barCode: this.registerCode.trim(),
        isUpdate: btn || '1'
      }
      this.sendLoading = true
      registerByCode(params).then(({ data }) => {
        this.sendLoading = false
        if (data.code == 0) {
          this.registerCode = ''
          this.$Message.success(data.message)
          this.getList()
        } else if (data.code == 2) {
          this.$Modal.confirm({
            title: '确认再次送检？',
            okText: '更新',
            content: `${data.message}是否再次送检并更新送检时间？`,
            onOk: () => {
              this.codeRegister('0')
            },
            onCancel: () => {
              this.registerCode = ''
            }
          })
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.sendLoading = false
        this.$Message.error(err.message)
      })
    },

    // 重置
    resetHandle () {
      this.form = {}
      this.registerCode = ''
      let curDate = moment().format('YYYY-MM-DD')
      // let yesDate = moment().add(1, 'days').format('YYYY-MM-DD')
      this.$set(this.form, 'inspectStartDate', curDate)
      this.$set(this.form, 'inspectEndDate', curDate)
      this.tableData = []
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
.new-send-exam-register-page-wrapper {
  width: 100%;
  min-width: 1300px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
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
  .screen-info-wrapper {
    padding-bottom: 15px;
    .scan-code-input-wrapper {
      display: flex;
      padding: 10px 5px;
      border: 2px dotted #2d8cf0;
      border-radius: 8px;
      .label {
        width: 80px;
        flex-shrink: 0;
        font-size: 16px;
        color: #2d8cf0;
        font-weight: bold;
      }
      input {
        max-width: 160px;
        font-weight: bold;
        font-size: 16px !important;
        color: #252525;
      }
    }
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
    width: 200px;
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
  .table-row {
    color: #252525;
  }
  .page-body {
    padding-bottom: 0px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-cascader {
    line-height: 32px;
  }
  .ivu-input[disabled] {
    background-color: #f3f3f3 !important;
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
}
</style>
