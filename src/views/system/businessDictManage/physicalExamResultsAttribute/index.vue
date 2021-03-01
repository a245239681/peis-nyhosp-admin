<template>
  <div class="physical-exam-results-attribute-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检项目结果</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 placeholder="搜索" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新增</Button>
          <!-- <Button type="error"
                  style="margin-left: 8px;"
                  @click="deleteAllHandle"
                  :disabled="selections.length == 0">批量删除</Button> -->
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               @on-selection-change="selectChange">
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit"
                    v-permission="['edit']"
                    size="small">修改</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    v-permission="['del']"
                    @click="deleteData"
                    size="small">删除</Button>
          </template>
        </Table>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40,100]"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          @openEdit2="openEdit2"
          @close="editModalVisible = false"></Edit>
    <Edit2 :title="modalTitle1"
           :name='results'
           :visible="editModalVisible1"
           @close="editModalVisible1 = false,editModalVisible = true"></Edit2>
  </div>
</template>

<script>
import Edit from './edit'
import Edit2 from '../components/chooseList/index'
export default {
  name: 'physicalExamResultsAttribute',
  components: {
    Edit,
    Edit2
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
          title: '疾病名称',
          key: 'diseaseName',
          width: 150,
          align: 'center'
        },
        {
          title: '类型',
          key: 'dept',
          width: 150,
          align: 'center'
        },
        {
          title: '拼音码',
          width: 80,
          key: 'pyCode',
          align: 'center'
        },
        {
          title: '五笔码',
          width: 80,
          key: 'wbCode',
          align: 'center'
        },
        {
          title: '自定义码',
          width: 150,
          key: 'customCode',
          align: 'center'
        },
        {
          title: '建议内容',
          key: 'knowledge',
          align: 'center'
        },
        // {
        //   title: '异常标志',
        //   width: 80,
        //   key: 'exceptionFlags',
        //   align: 'center'
        // },
        // {
        //   title: '状态',
        //   width: 80,
        //   key: 'status',
        //   align: 'center'
        // },
        {
          title: '操作',
          slot: 'action',
          width: 180,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData: [
        {
          diseaseName: '破伤风',
          dept: '皮肤科',
          pyCode: 'pfk',
          wbCode: 'ps',
          customCode: 'miaomiao',
          knowledge: '不要碰生锈的东西',
          exceptionFlags: '阳性发现',
          status: '停用'
        }
      ],
      isLoading: false,
      results: 1,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      modalTitle1: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible1: false,
      deleteModalVisible: false,
      selections: [] // 表格勾选项集合
    }
  },
  created () {

  },
  mounted () {
    let item = this.tableData[0]
    for (let i = 0; i < 6; i++) {
      this.tableData.push(item)
    }
  },
  methods: {
    add () {
      this.modalTitle = 0
      this.editModalVisible = true
    },
    edit () {
      this.modalTitle = 1
      this.editModalVisible = true
    },
    openEdit2 () { // 打开edit2页面 隐藏edit页面
      this.editModalVisible = false
      this.editModalVisible1 = true
      this.modalTitle1 = 0
    },
    deleteData () {
      // this.deleteModalVisible = true;
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {

        },
        onCancel: () => {

        }
      })
    },
    selectChange (val) {
      this.selections = val
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
    }
  }
}
</script>

<style lang="less">
.physical-exam-results-attribute-wrapper {
  width: 100%;
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
