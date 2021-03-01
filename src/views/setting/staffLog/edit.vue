<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="删除详情"
           width="800px"
           class="staff-log-detial-wrapper">
      <div class="modal-body">
        <vxe-table class="mytable-footer"
                   ref="workloadTable"
                   border
                   show-footer
                   :auto-resize="true"
                   highlight-hover-row
                   align="center"
                   row-class-name="table-row"
                   header-row-class-name="table-row"
                   :height="500"
                   :data="tableData"
                   :loading="isLoading">
          <vxe-table-column field="boDeptName"
                            title="科室"
                            width="140"></vxe-table-column>
          <vxe-table-column field="boComboName"
                            title="组合名称"
                            min-width="160"></vxe-table-column>
          <vxe-table-column field="action"
                            title="操作"
                            width="150">
            <template slot-scope="scope">
              <Button type="default"
                      @click="buildSql(scope.row)">生成插入语句</Button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <div slot="footer">
        <Button @click="closeModal">关闭</Button>
      </div>
    </Modal>
    <!-- sql语句弹窗 start -->
    <Sql :visible="sqlModalVisible"
         ref="sqlwrapper"
         :inputValue="sqlValue"
         @close="sqlModalVisible = false"></Sql>
    <!-- sql语句弹窗 end -->
  </div>
</template>
<script>
import Sql from './sql'
import { delLogInfo, sqlSentence } from '@/api/setting'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  components: {
    Sql
  },
  data () {
    return {
      isLoading: false,
      tableData: [],
      sqlModalVisible: false,
      sqlValue: ''
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
  created () {
  },
  methods: {
    closeModal () {
      this.tableData = []
      this.$emit('close')
    },

    // 获取删除日志详情
    getLogInfo (id) {
      const params = { id }
      this.isLoading = true
      delLogInfo(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data
        } else {
          this.tableData = []
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 生成插入sql语句
    buildSql (row) {
      const { id, boPersonalItemId } = row
      const params = { id, boPersonalItemId }
      sqlSentence(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.sqlCheck(data.data)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    init (row) {
      if (Object.keys(row).length == 0) {
        this.tableData = []
      } else {
        this.getLogInfo(row.id)
      }
    },

    // 查看sql语句
    sqlCheck (val) {
      this.sqlModalVisible = true
      this.sqlValue = val
    },
  }
}
</script>
<style lang="less">
.staff-log-detial-wrapper {
}
</style>
