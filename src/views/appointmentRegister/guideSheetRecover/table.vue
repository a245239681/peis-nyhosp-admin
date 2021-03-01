<template>
  <div class="guide-sheet-table-wrapper">
    <vxe-table ref="table"
               style="margin-top: 20px;"
               border
               resizable
               align="center"
               show-overflow
               show-header-overflow
               highlight-hover-row
               :row-class-name="highlightRow"
               highlight-current-row
               @cell-click="cellClickHandle"
               :height="(screenHeight - 350) <= 350 ? 500 : (screenHeight - 350)"
               :loading="isLoading">
      <vxe-table-column field="boPeId"
                        title="体检号"
                        min-width="140"></vxe-table-column>
      <vxe-table-column field="medicalName"
                        title="姓名"
                        min-width="100"></vxe-table-column>
      <vxe-table-column field="boCategory"
                        title="体检类型"
                        min-width="120"></vxe-table-column>
      <vxe-table-column field="boUnitName"
                        title="单位"
                        min-width="160"></vxe-table-column>
      <vxe-table-column field="boRegisterDate"
                        title="登记时间"
                        min-width="160">
        <template v-slot="{ row }">
          <span v-if="row.boRegisterDate">{{row.boRegisterDate | dateformat}}</span>
          <span v-else></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="boExamTime"
                        title="体检时间"
                        min-width="160">
        <template v-slot="{ row }">
          <span v-if="row.boExamTime">{{row.boExamTime | dateformat}}</span>
          <span v-else></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="boGuideRecycleUserName"
                        title="回收人"
                        min-width="100"></vxe-table-column>
      <vxe-table-column field="boGuideRecycleDate"
                        title="回收时间"
                        min-width="160">
        <template v-slot="{ row }">
          <span v-if="row.boGuideRecycleDate">{{row.boGuideRecycleDate | dateformat}}</span>
          <span v-else></span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="boGuideStatus"
                        title="回收状态"
                        min-width="80">
        <template v-slot="{ row }">
          {{(row.boGuideStatus == '0' ? '未回收' : '已回收')}}
        </template>
      </vxe-table-column>
      <vxe-table-column field="boRegisterCode"
                        title="登记流水号"
                        min-width="140"></vxe-table-column>
      <vxe-table-column field="action"
                        title="操作"
                        fixed="right"
                        min-width="120">
        <template v-slot="{ row }">
          <Button :type="(row.boGuideStatus == '0' ? 'default' : 'error')"
                  style="margin-left: 8px;"
                  v-permission="['edit']"
                  @click="guideSheetHandle(row)"
                  size="small">{{(row.boGuideStatus == '0' ? '回收' : '恢复')}}</Button>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      require: true
    },
    isLoading: {
      type: Boolean,
      require: true
    },
    screenHeight: {
      type: [String, Number],
      require: true
    }
  },
  data () {
    return {

    }
  },
  methods: {
    // 点击行选中或取消选中
    cellClickHandle ({ row, rowIndex, column, columnIndex }, event) {
      console.log(row)
      // this.$refs.barCodeTable.toggleRowSelection(row)
    },
    // 指引单操作
    guideSheetHandle (row) {
      let params;
      if (row) {
        params = {
          boRegisterCode: row.boRegisterCode,
          type: (row.boGuideStatus == '0' ? 1 : 2)
        }
        this.$Modal.confirm({
          title: '提示',
          content: `是否${row.boGuideStatus == '0' ? '回收' : '恢复'}该条数据？`,
          onOk: () => {
            this.$emit('updateList', params)
          },
          onCancel: () => { }
        })
      } else {
        params = {
          boRegisterCode: this.form.boRegisterCode,
          type: 1
        }
        this.$emit('updateList', params)
      }

    },
    // 高亮表格中的已回收颜色
    highlightRow ({ row }) {

      if (row.boGuideStatus != '0') {
        return 'table-highlight-row'
      } else {
        return 'table-row'
      }
    },
    reloadData (data) {
      console.log(data)
      let xTable = this.$refs.table
      xTable.reloadData(data).then(() => {
        this.$emit('updateLoading')
      })
    }

  },
}
</script>
<style lang="less">
.guide-sheet-table-wrapper {
  margin-top: -20px;
  .table-highlight-row {
    background-color: #e6f7ff;
  }
}
</style>