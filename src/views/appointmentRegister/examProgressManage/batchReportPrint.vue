<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="批量打印报告"
           :width="1000"
           class="batch-report-print-wrapper">
      <div class="modal-body">
        <div class="screen-wrapper">
          <Form :model="formData"
                ref="form"
                style="display:flex;align-item: center;justify-content: center;"
                @submit.native.prevent
                label-position="right">
            <FormItem label="登记流水号"
                      :label-width="110">
              <Input v-model.trim="formData.registerCode"
                     ref="registerInput"
                     placeholder="请输入或使用扫码枪扫描条码"
                     style="width:200px;"
                     @on-enter="addReport()"
                     size="small"></Input>
            </FormItem>
            <FormItem label=""
                      :label-width="10">
              <Button type="primary"
                      :loading="isLoading"
                      size="small"
                      @click="addReport()">添加</Button>
            </FormItem>
          </Form>
        </div>
        <div class="table-wrapper">
          <div class="table-wrapper">
            <div class="search-info">温馨提示：单次最多只能批量提交100份，当前已添加<span>{{tableData.length}}</span>份</div>
            <vxe-table class="mytable-footer"
                       ref="workloadTable"
                       border
                       show-footer
                       :auto-resize="true"
                       highlight-hover-row
                       align="center"
                       row-class-name="table-row"
                       header-row-class-name="table-row"
                       :height="400"
                       :data="tableData"
                       :loading="isLoading">
              <vxe-table-column field="sort"
                                title="序号"
                                width="60">
                <template v-slot="{rowIndex}">
                  <span>{{rowIndex + 1}}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="inRegisterCode"
                                title="登记流水号"
                                width="140"></vxe-table-column>
              <vxe-table-column field="inName"
                                title="姓名"
                                min-width="80"></vxe-table-column>
              <vxe-table-column field="inCategory"
                                title="体检类型"
                                show-overflow="title"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="inUnitName"
                                title="单位"
                                show-overflow="title"
                                min-width="180"></vxe-table-column>
              <vxe-table-column field="inPackageName"
                                title="套餐"
                                show-overflow="tooltip"
                                min-width="140"></vxe-table-column>
              <vxe-table-column field="inMainExamDoctorName"
                                title="总检医生"
                                show-overflow="title"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="inFinalReviewDoctor"
                                title="总检审核医生"
                                show-overflow="title"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="action"
                                title="操作"
                                width="120"
                                fixed="right">
                <template v-slot="{row}">
                  <Button type="error"
                          @click="removeHandle(row)">移除</Button>

                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="saveLoading"
                @click="save">打印确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { batchReport, reportPrint } from '@/api/examProgressManage'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import {
  getPrinterConfigFromLocalstorage
} from '@/libs/util'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      tableData: [],
      isLoading: false,
      saveLoading: false
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  mounted () {

  },
  methods: {
    closeModal () {
      this.formData = {}
      this.tableData = []
      this.$emit('close')
    },
    save () {
      if (this.saveLoading) return
      if (this.tableData.length == 0) {
        this.$Message.info('请先导入要打印的报告数据')
        return false
      }
      let _data = []
      this.tableData.map(item => {
        const { inPeId, inVisitSn, inRegisterCode } = item
        const obj = { inPeId, inVisitSn, inRegisterCode }
        _data.push(obj)
      })
      let printConfig = getPrinterConfigFromLocalstorage();
      let params;

      if (Object.keys(printConfig).length > 0 && printConfig.multiLodopPrint) {
        params = {
          zip: false,
          merge: false,
          duplex: false,
          mainExam: true,
          data: _data
        }
      } else {
        params = {
          zip: false,
          merge: true,
          duplex: false,
          mainExam: true,
          data: _data
        }
      }

      this.saveLoading = true
      reportPrint(params)
        .then(({ data }) => {
          this.saveLoading = false;
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
                taskName: '体检报告'
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
                taskName: '体检报告'
              }
              printMethods(printParams.guideUrl, printParams)
            }
            this.$Message.success(data.message)
            this.$emit('updateList')
            this.closeModal()
          } else {
            this.$Message.error(data.message);
          }
        })
        .catch(err => {
          this.saveLoading = false;
          this.$Message.error(err.message);
        })
    },
    getItemList () {
      this.$nextTick(() => {
        this.$refs.registerInput.focus()
      })
    },
    addReport () {
      if (this.tableData.length >= 100) {
        this.$Message.info('单次装订不能超过100份！')
        return false
      }

      this.isLoading = true
      batchReport(this.formData).then(({ data }) => {
        this.isLoading = false
        if (data.code === 0) {
          this.formData.registerCode = ''
          const flag = this.tableData.some(item => {
            return item.inId === data.data.inId
          })
          if (flag) {
            this.$Message.info('该数据已存在列表中')
          } else {
            this.tableData.unshift(data.data)
          }

          this.$nextTick(() => {
            this.$refs.registerInput.focus()
          })
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    removeHandle (row) {
      let _arr = this.tableData.filter(item => {
        return item.inId !== row.inId
      })
      this.tableData = _arr
    }
  }
}
</script>
<style lang="less">
.batch-report-print-wrapper {
  .table-wrapper {
    .search-info {
      line-height: 1.8;
      font-weight: bold;
      color: #ed4014;
      margin-bottom: 10px;
      span {
        color: #40a9ff;
      }
    }
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
}
</style>
