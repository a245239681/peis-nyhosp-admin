<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="体检档案"
           :width="800"
           class="profile-edit-wrapper">
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
                   @cell-dblclick="confirmHandle"
                   :height="400"
                   :data="tableData"
                   :loading="isLoading">
          <vxe-table-column field="boPeId"
                            title="体检号"
                            min-width="80"></vxe-table-column>
          <vxe-table-column field="boName"
                            title="姓名"
                            min-width="80"></vxe-table-column>
          <vxe-table-column field="boSex"
                            title="性别"
                            min-width="60"></vxe-table-column>
          <vxe-table-column field="boAge"
                            title="年龄"
                            min-width="60"></vxe-table-column>
          <vxe-table-column field="boIdNo"
                            title="证件号"
                            show-overflow="title"
                            min-width="180"></vxe-table-column>
          <vxe-table-column field="boMobile"
                            title="联系电话"
                            width="140"></vxe-table-column>

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
      <div slot="footer">
        <Button @click="closeModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { profileList } from '@/api/newPersonRegister'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      isLoading: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      tableData: [],
      params: {}
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
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    confirmHandle (row) {
      this.$emit('profileImport', row.row)
      this.$emit('close')
    },
    getItemList (row) {
      const obj = {
        boName: row.boName.trim()
      }
      this.params = obj
      this.getList()
    },

    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      this.isLoading = true
      profileList(this.params, pagination).then(({ data }) => {
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

    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    }
  }
}
</script>
<style lang="less">
.profile-edit-wrapper {
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
  }
}
</style>
