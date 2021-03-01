<template>
  <div class="physical-exam-mealManage-template-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检套餐管理</span>
        <div class="title-right-tool">
          <RadioGroup v-model="isWechatPackage"
                      @on-change="getSearchList(1, 20, '')">
            <Radio label="1">体检系统套餐</Radio>
            <Radio label="0">小程序套餐</Radio>
          </RadioGroup>
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keyword"
                 @on-search="getSearchList()"
                 placeholder="搜索编号或名称" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="add">添加体检套餐</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               @on-row-click="selectChange">
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    style="margin-left: 8px;"
                    v-permission="['edit']"
                    @click="edit(row)"
                    size="small">编辑</Button>
            <Button :type="row.paStatus == 0 ? 'default' : 'error'"
                    style="margin-left: 8px;"
                    v-permission="['edit']"
                    :loading="btnLoading==row.paId"
                    @click="statusChange(row)"
                    size="small">{{row.paStatus == 0 ? '启用' : '停用'}}</Button>
          </template>
        </Table>
      </div>
      <div class="page-footer">
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
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref='editwrapper'
          @updateList="getSearchList(pageIndex, pageSize, itemName)"
          @close="editModalVisible = false"></Edit>

  </div>
</template>

<script>
import Edit from './edit'
import { searchList, startOrStop, comboList } from '@/api/physicalExamMealManage.js'

export default {
  name: 'physicalExamMealManage',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          key: 'paSort',
          width: 100,
          align: 'center'
        },
        {
          title: '套餐编号',
          key: 'paPackageCode',
          width: 120,
          align: 'center'
        },
        {
          title: '套餐名称',
          key: 'paPackageName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '套餐类别',
          key: 'paCategoryName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '拼音码',
          width: 80,
          key: 'paPyCode',
          align: 'center'
        },
        {
          title: '五笔码',
          width: 100,
          key: 'paWbCode',
          align: 'center'
        },
        {
          title: '性别',
          width: 80,
          key: 'paSex',
          align: 'center'
        },
        {
          title: '套餐价格',
          key: 'paPrice',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '总价',
          key: 'paTotalAmount',
          minWidth: 80,
          align: 'center'
        },
        // {
        //   title: '折扣后总价',
        //   key: 'paDiscountAmount',
        //   minWidth: 120,
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
      btnLoading: false,
      changeSize: '',
      tableData: [],
      keyword: '',
      itemName: '',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      result: 0,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      modalTitle1: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible1: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      combo: [],
      isWechatPackage: '1' // 1为系统套餐，0位系统套餐
    }
  },
  created () {
    this.getSearchList()
  },
  mounted () {

  },

  watch: {
    keyword (newkeyword, oldkeyword) {
      if (newkeyword == '') {
        this.getSearchList()
      }
    }
  },
  methods: {
    getSearchList (page = 1, size = 20, itemName) { // 查询项目
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex || 1,
        size: this.pageSize || 20,
        text: this.keyword.trim()
      }

      let textFinall
      if (itemName) {
        this.itemName = itemName
        textFinall = { text: itemName, type: this.isWechatPackage }
      } else {
        textFinall = { text: this.keyword.trim(), type: this.isWechatPackage }
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      searchList(pagination, textFinall).then(({ data }) => {
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
      this.modalTitle = 0
      this.editModalVisible = true
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    async edit (row) {
      this.editModalVisible = true
      this.modalTitle = 1
      let meg = { packageId: row.paId }
      await comboList(meg).then(({ data }) => {
        if (data.code == 0) {
          this.combo = Object.assign({}, { comboList: data.data })
          console.log(this.combo)
        }
      })
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row, this.combo)

      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    // 切换页码
    pageIndexChange (val) { // 页码
      this.pageIndex = val
      this.getSearchList(val, this.changeSize || 20, this.itemName)
    },
    // 改变每页显示数
    pageSizeChange (val) { // page-size
      this.changeSize = val
      this.getSearchList(1, val, this.itemName)
    },
    deleteData (row) {
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
    statusChange (row) {
      let status = 0
      let msg = ''
      if (row.paStatus == 0) {
        status = 1
        msg = '启用'
      } else {
        status = 0
        msg = '停用'
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该体检套餐？`,
        onOk: () => {
          let params = {
            paStatus: status,
            paId: row.paId
          }
          this.btnLoading = row.paId
          startOrStop(params).then(({ data }) => {
            this.btnLoading = false
            if (data.code == 0) {
              this.$Message.success(`已${msg}该体检套餐`)
              this.getSearchList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.btnLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    }
  }
}
</script>

<style lang="less">
.physical-exam-mealManage-template-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-table th {
    background-color: #d6eaff;
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
