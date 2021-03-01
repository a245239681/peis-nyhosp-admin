<template>
  <div>
    <Modal class="icd10-popup modal"
           v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           width="1000">
      <div slot="header"
           class="search-title-wrapper">
        <span class="title">选择疾病</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="搜索" />
        </div>
      </div>
      <div class="main-wrapper">
        <div class="combit-item-wrapper">
          <Table :columns="columns"
                 :loading="isLoading"
                 highlight-row
                 height="540"
                 :data="tableData"
                 @on-row-click="handleRowClick">
          </Table>

        </div>
        <div class="page-footer">
          <Page :total="totalSize"
                :page-size="pageSize"
                :current="pageIndex"
                @on-change="pageIndexChange"
                @on-page-size-change="pageSizeChange"
                size="small"
                show-elevator
                show-total />
        </div>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseIcd10List } from '@/api/dict_ICD10.js'

export default {
  props: {
    title: Number,
    visible: Boolean,
    name: Number
  },
  data () {
    return {
      curActive: 'all',
      totalSize: 100,
      pageIndex: 1,
      pageSize: 10,
      keyword: '', // 搜索疾病信息输入
      columns: [
        {
          title: 'ICD10编码',
          key: 'cdCode',
          align: 'center'
        },
        {
          title: 'ICD10名称',
          key: 'cdName',
          align: 'center'
        },
        {
          title: 'ICD10附加码',
          key: 'cdCodeArrached',
          align: 'center'
        }
      ],
      tableData: [],
      isLoading: false,
      curIndex: -1, // 当前选中的表格行
      curICD10Name: '', // 当前选中的ICD10名称
      curICD10Id: '', // 当前选中的ICD10对应的id
      curICDCode: '' // 当前选中的ICD10对应的编码
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '选择体检项目' : '编辑体检项目')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    showButton () {
      return (this.name == 0)
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    closeModal () {
      this.keyword = ''
      this.getList()
      this.$emit('close')
    },
    save () {
      this.keyword = ''
      this.getList()
      this.$emit('close')
    },
    getList (page = 1, size = 10) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        searchField: this.keyword.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      baseIcd10List(pagination, params).then(({ data }) => {
        console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          let res = data.data
          this.totalSize = res.total
          this.tableData = res.records
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    nodeClick (node) {
      node.expanded = false
      console.log(node.expanded)
    },
    // 高亮选中行-蓝色
    rowClassName (row, index) {
      if (index == this.curIndex) {
        return 'click-row'
      }
    },
    // 选择疾病名称并关系当前对话框
    save () {
      this.$emit('selected', false)
      this.$emit('getICD10Name', {
        curICD10Name: this.curICD10Name,
        curICD10Id: this.curICD10Id,
        curICDCode: this.curICDCode
      })
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },
    handleRowClick (row, index) {
      this.curICD10Name = row.cdName
      this.curICD10Id = row.cdId
      this.curICDCode = row.cdCode
    }
  }
}
</script>
<style lang="less" >
.icd10-popup {
  .ivu-modal-header-inner {
    position: relative;
    padding-left: 8px;
    font-weight: bold;
    &::before {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .main-wrapper {
    display: flex;
    width: 100%;
    .combit-item-wrapper {
      width: 100%;
    }
    .ivu-modal-body {
      padding: 2px;
    }
    .page-footer {
      width: 70%;
      height: 30px;
      left: 50%;
      margin-left: 0px;
      transform: translateX(-60%);
      .ivu-modal-footer {
        border-top: 0;
      }
      .ivu-page.mini .ivu-page-options-elevator input {
        width: 50px;
      }
    }
  }

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
    font-size: 14px;
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
}
</style>
