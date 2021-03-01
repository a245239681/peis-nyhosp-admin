<template>
  <div class="check-exam-child-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">检查子类别字典管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keyword"
                 @on-search="getItemList()"
                 placeholder="子类别名称、输入码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="add">添加</Button>
          <!-- <Button type="error"
                  style="margin-left: 8px;"
                  @click="deleteAllHandle"
                  :disabled="selections.length == 0">批量删除</Button> -->
        </div>
      </div>
      <div class="main-body">
        <div class="main-body-left">
          <Input search
                 enter-button
                 v-model="keywordType"
                 placeholder="搜索检查类别" />
          <ul class="child-list">
            <li v-if="keywordType == ''"
                class="child-list-item"
                :class="{'isActive': curActive === 'all'}"
                @click="changeExamType('')">全部</li>
            <li v-for="item in examTypeFilter"
                :key="item.paId"
                class="child-list-item"
                :class="{'isActive': curActive === item.paId }"
                @click="changeExamType(item.paId)">{{item.paTypeName}} ({{item.paInputCode}})</li>
          </ul>
        </div>
        <div class="main-body-right">
          <Table :columns="columns"
                 :data="tableData"
                 :loading="isLoading"
                 @on-selection-change="selectChange">
            <template slot="action"
                      slot-scope="{row}">
              <Button :type="row.paStatus == 0 ? 'error' : 'default'"
                      v-permission="['edit']"
                      @click="statusChange(row)"
                      size="small">{{row.paStatus == 0 ? '停用' : '启用'}}</Button>
              <Button type="default"
                      style="margin-left: 8px;"
                      @click="edit(row)"
                      v-permission="['edit']"
                      size="small">修改</Button>
              <Button type="error"
                      style="margin-left: 8px;"
                      v-permission="['del']"
                      @click="deleteData(row)"
                      size="small">删除</Button>
            </template>
          </Table>
          <div class="page-wrapper">
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
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getItemList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { dictExamChildTypeList, dictExamChildTypeDelete, dictExamTypeList, dictExamSubTypeStatus } from '@/api/dict_checkExamChildDict.js'
import Edit from './edit.vue'

export default {
  name: 'checkExamChildDict',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        // {
        //   width: 55,
        //   type: 'selection',
        //   align: 'center'
        // },
        {
          title: '序号',
          key: 'paSort',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '检查类别',
          key: 'examTypeName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '检查子类别名称',
          key: 'paExamSubclassName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '检查子类别别名',
          key: 'paExamClassName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '输入码',
          key: 'paInputCode',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 200,
          align: 'center'
        }
      ],
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格选中项
      keyword: '',
      isLoading: false,
      keywordType: '',
      curActive: 'all',
      curExamTypeId: ''
    }
  },
  computed: {
    examTypeDict: {
      get: function () {
        return this.$store.getters.getExamType
      },
      set: function () { }
    },
    examTypeFilter () {
      // this.curActive = ''
      if (this.keywordType == '') {
        return this.$store.getters.getExamType
      }
      let arr = this.examTypeDict
      let newArr = []
      arr.forEach(item => {
        if (item.paTypeName.indexOf(this.keywordType) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    }
  },
  watch: {
    keyword (newkeyword, oldkeyword) {
      if (newkeyword == '') {
        this.curExamTypeId = ''
        this.getItemList(1, 20)
      }
    },
    keywordType (newkeyword, oldkeyword) {
      if (newkeyword == '') {
        this.curExamTypeId = ''
        this.getItemList(1, 20)
      }
    }
  },
  mounted () {
    this.$store.dispatch('getExamType')
    this.getItemList()
  },
  methods: {
    getItemList (page = 1, size = 20) {
      console.log(this.pageIndex)
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        searchField: this.keyword.trim(),
        paExamTypeId: this.curExamTypeId
      }
      // 防重复提交
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictExamChildTypeList(pagination, params).then(({ data }) => {
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
    add () {
      this.editModalVisible = true
      this.modalTitle = 0
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    edit (row) {
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    // searchNodes () {
    //   this.$refs.tree.searchNodes(this.searchWord)
    // },
    // nodeClick (node, selected) {
    //   this.$refs.tree.nodeSelected(node:)
    // },
    deleteData (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.paId
          }
          dictExamChildTypeDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该检查子类别数据`)
              this.$store.dispatch('getExamSubTypeDict', true)

              let len = this.tableData.length - 1
              if (len > 0) {
                this.getItemList(this.pageIndex, this.pageSize)
              } else if (this.pageIndex != 1) {
                this.pageIndex = --this.pageIndex
                this.getItemList(this.pageIndex, this.pageSize)
              } else {
                this.getItemList(this.pageIndex, this.pageSize)
              }
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },
    statusChange (row) {
      let status = 0
      let msg = ''
      if (row.paStatus == 0) {
        status = 1
        msg = '停用'
      } else {
        status = 0
        msg = '启用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该检查子类别？`,
        onOk: () => {
          let params = {
            status: status,
            id: row.paId
          }
          dictExamSubTypeStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}该检查子类别`)
              this.$store.dispatch('getExamSubTypeDict', true)
              this.getItemList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },
    selectChange (val) {
      this.selections = val
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getItemList(val, this.pageSize)
    },
    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.getItemList(1, val)
    },
    deleteAllHandle () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除所选数据？',
        onOk: () => {

        },
        onCancel: () => {

        }
      })
    },
    // 更改父类菜单时
    changeExamType (examTypeId) {
      if (examTypeId) {
        this.curActive = examTypeId
        this.curExamTypeId = examTypeId
      } else {
        this.curActive = 'all'
        this.curExamTypeId = ''
      }
      this.keyword = ''
      this.getItemList(this.pageIndex, this.pageSize)
    }
  }
}
</script>
<style lang="less">
.check-exam-child-wrapper {
  width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  padding-right: 20px;
  position: relative;
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
  .main-body {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .main-body-left {
      width: 16%;
      .child-list {
        padding: 5px 0;
        font-size: 14px;
        color: #252525;
        max-height: 700px;
        overflow-y: auto;
        .isActive {
          color: #2d8cf0;
          background-color: #f0faff;
        }
        &-item {
          padding: 5px 0;
          text-indent: 1em;
          &:hover {
            color: #2d8cf0;
          }
        }
      }
    }
    .main-body-right {
      width: 83%;
      padding-bottom: 70px;
      .page-wrapper {
        position: absolute;
        bottom: 30px;
        right: 25%;
      }
    }
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
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
