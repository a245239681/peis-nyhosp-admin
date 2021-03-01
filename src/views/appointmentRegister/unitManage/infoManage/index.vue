<template>
  <div class="info-manage-wrapper">
    <Card style="width:100%">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">单位信息管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="keyword"
                 @on-search="getUnitList()"
                 style="width: 200px"
                 placeholder="搜索单位" />
          <Button type="primary"
                  style="margin-left:10px;"
                  @click="add">新增单位</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="unitCols"
               :loading="isLoading"
               :data="tableData">
          <template slot="sort"
                    slot-scope="{row, index}">
            {{index + 1}}
          </template>
          <template slot="boStatus"
                    slot-scope="{row}">
            <Tag color="green"
                 v-if="row.boStatus == 0">启用</Tag>
            <Tag color="orange"
                 v-else>停用</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    @click="addExamHandle(row)"
                    size="small">新增体检</Button>
            <Button type="default"
                    @click="edit(row)"
                    style="margin-left: 8px;"
                    size="small">修改</Button>
            <!-- <Button type="error"
                    @click="deleteData"
                    style="margin-left: 8px;"
                    size="small">删除单位</Button> -->
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
              show-elevator
              show-total />
      </div>
    </Card>
    <!-- 弹出框 单位基本信息 -->
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getUnitList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
    <!-- 新增体检弹窗 -->
    <addExamModal :visible="addExamVisible"
                  ref="addExamWrapper"
                  :title="addExamTitle"
                  @updateList="getUnitList"
                  @close="addExamVisible = false">

    </addExamModal>
  </div>
</template>
<script>
import Edit from './edit.vue'
import NewExam from './newExam.vue'
import addExamModal from './addExam.vue'
import { UnitInfoList, addExam } from '@/api/appointmentUnitManage.js'

export default {
  name: 'infoManage',
  components: {
    Edit,
    NewExam,
    addExamModal
  },
  data () {
    return {
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      keyword: '',
      unitCols: [
        {
          type: 'expand',
          align: 'center',
          width: 50,
          render: (h, params) => {
            return h(NewExam, {
              props: {
                row: params.row
              },
              on: {
                'updateList': () => {
                  this.getUnitList()
                },
                'turnShift': () => {
                  this.addExamHandle(params.row, 1)
                }
              }
            })
          }
        },
        {
          title: '序号',
          slot: 'sort',
          align: 'center',
          minWidth: 100
        },
        {
          title: '单位名称',
          key: 'boName',
          align: 'center',
          minWidth: 180
        },
        {
          title: '类型',
          key: 'boUnitType',
          align: 'center',
          minWidth: 120
        },
        {
          title: '联系人',
          key: 'boContact',
          align: 'center',
          minWidth: 120
        },
        {
          title: '联系电话',
          key: 'boPhone',
          align: 'center',
          minWidth: 140
        },
        {
          title: '地址',
          key: 'boAddress',
          align: 'center',
          minWidth: 160
        },
        {
          title: '状态',
          slot: 'boStatus',
          align: 'center',
          minWidth: 120
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 180
        }
      ],
      tableData: [],
      editModalVisible: false,
      modalTitle: 0, // 0为新增，1为修改
      isLoading: false,
      unitTableData: [],
      addExamVisible: false,
      addExamTitle: 0 // 0为新增体检，1为转档
    }
  },
  mounted () {
    this.getUnitList()
    // console.log(123)
  },
  methods: {
    getUnitList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        keyword: this.keyword
      }
      this.isLoading = true
      UnitInfoList(pagination, params).then(({ data }) => {
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
    deleteData () {

    },
    add () {
      this.editModalVisible = true
      this.modalTitle = 0
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    edit (row) {
      console.log(row)
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    // 切换页码
    pageIndexChange (val) {
      this.getUnitList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getUnitList(1, val)
    },

    addExamHandle (row, title = 0) {
      console.log(title)
      this.addExamVisible = true
      this.addExamTitle = title
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.addExamWrapper.getItemList(params)
      })
    },
  }
}
</script>
<style lang="less">
.info-manage-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  position: relative;
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
  .ivu-table th {
    background-color: #d6eaff;
  }
  .unit-modal-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 10;
    .ivu-input {
      color: #000;
    }
  }
}
</style>
