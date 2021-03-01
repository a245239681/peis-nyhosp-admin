<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="批量装订报告"
           :width="1000"
           class="report-bingding-wrapper">
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
              <vxe-table-column field="boRegisterCode"
                                title="登记流水号"
                                width="140"></vxe-table-column>
              <vxe-table-column field="boName"
                                title="姓名"
                                min-width="80"></vxe-table-column>
              <vxe-table-column field="boCategory"
                                title="体检类型"
                                show-overflow="title"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="boUnitName"
                                title="单位"
                                show-overflow="title"
                                min-width="180"></vxe-table-column>
              <vxe-table-column field="boPackageName"
                                title="套餐"
                                show-overflow="tooltip"
                                min-width="140"></vxe-table-column>
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
                @click="save">装订确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { bingdingReport, bingdingReportSave } from '@/api/examProgressManage'
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
        this.$Message.info('请先导入要装订的报告数据')
        return false
      }
      const params = {
        patientVisitList: this.tableData
      }
      this.saveLoading = true
      bingdingReportSave(params).then(({ data }) => {
        this.saveLoading = false
        if (data.code === 0) {
          this.$Message.success(data.message)
          this.$emit('updateList')
          this.closeModal()
        } else {
          this.$Message.error(data.message)
        }
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
      bingdingReport(this.formData).then(({ data }) => {
        this.isLoading = false
        if (data.code === 0) {
          this.formData.registerCode = ''
          const flag = this.tableData.some(item => {
            return item.boId === data.data.boId
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
        return item.boId !== row.boId
      })
      this.tableData = _arr
    }
  }
}
</script>
<style lang="less">
.report-bingding-wrapper {
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
