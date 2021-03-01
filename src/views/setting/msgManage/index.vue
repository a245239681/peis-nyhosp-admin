<template>
  <div class="msg-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">平台消息管理</span>
        <div class="title-right-tool">
          <Form :model="formData"
                :label-width="80"
                ref="form"
                inline
                label-position="right">
            <FormItem label="消息类型">
              <Select v-model="formData.eventCode"
                      style="min-width: 160px"
                      size="small">
                <Option value="1">新增患者信息</Option>
                <Option value="2">更新患者信息</Option>
                <Option value="3">新增体检项目</Option>
                <Option value="4">减项体检项目</Option>
                <Option value="5">更新项目状态</Option>
                <Option value="6">接收检验报告数据</Option>
                <Option value="7">接收检查报告数据</Option>
                <Option value="8">作废报告</Option>
              </Select>
            </FormItem>
            <FormItem label="关键字">
              <Input v-model="formData.searchField"
                     size="small"
                     placeholder="请输入姓名、流水号、his号"></Input>
            </FormItem>
          </Form>
          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="getList()">搜索</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               @on-selection-change="selectChange">
          <template slot="eventCode"
                    slot-scope="{row}">
            <span v-if="row.eventCode == 1">新增患者信息</span>
            <span v-else-if="row.eventCode == 2">更新患者信息</span>
            <span v-else-if="row.eventCode == 3">新增体检项目</span>
            <span v-else-if="row.eventCode == 4">减项体检项目</span>
            <span v-else-if="row.eventCode == 5">更新项目状态</span>
            <span v-else-if="row.eventCode == 6">接收检验报告数据</span>
            <span v-else-if="row.eventCode == 7">接收检查报告数据</span>
            <span v-else-if="row.eventCode == 8">作废报告</span>
          </template>
          <template slot="platformStatus"
                    slot-scope="{row}">
            <Tag color="red"
                 v-if="row.platformStatus == '1'">失败</Tag>
            <Tag color="green"
                 v-if="row.platformStatus == '0'">成功</Tag>
          </template>
          <template slot="createDate"
                    slot-scope="{row}">
            <Tag color="red"
                 v-if="row.createDate">{{row.createDate | dateformat}}</Tag>
          </template>
          <template slot="medicalStatus"
                    slot-scope="{row}">
            <Tag color="red"
                 v-if="row.medicalStatus == '1'">失败</Tag>
            <Tag color="green"
                 v-if="row.medicalStatus == '0'">成功</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    @click="edit(row)"
                    v-permission="['edit']"
                    size="small">消息详情</Button>
            <Button type="default"
                    @click="retryMsgHandle(row)"
                    v-permission="['edit']"
                    style="margin-left: 8px"
                    :loading="retryLoading && row.id === curRowId"
                    v-if="row.finalStatus == 1"
                    size="small">重发消息</Button>
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
          :moduleTypeDict="moduleTypeDict"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { msgList, retryMsg } from '@/api/msgManage'
import Edit from './edit.vue'

export default {
  name: 'msgManage',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        {
          title: '体检流水号',
          key: 'registerCode',
          minWidth: 160,
          align: 'center'
        },
        {
          title: 'his号',
          key: 'patientId',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'patientName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '消息类型',
          slot: 'eventCode',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '响应状态',
          slot: 'platformStatus',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '处理时间',
          slot: 'createDate',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '消息状态',
          slot: 'medicalStatus',
          width: 140,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 220,
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
      formData: {}, // 筛选数据
      moduleTypeDict: [], // 模板类型字典
      isLoading: false,
      curRowId: '',
      retryLoading: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = { page, size }

      // 防重复提交
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      msgList(pagination, this.formData).then(({ data }) => {
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
        this.$Message.error(err.message)
      })
    },

    retryMsgHandle (row) {
      if (this.retryLoading) return
      const { id, reportData } = row
      this.curRowId = id
      const params = { id, reportData }
      this.retryLoading = true
      retryMsg(params).then(({ data }) => {
        this.retryLoading = false
        if (data.code === 0) {
          this.$Message.success('操作成功')
          this.getList()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.retryLoading = false
        this.$Message.error(err.message)
      })
    },

    edit (row) {
      this.editModalVisible = true
      this.modalTitle = 1
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.init(params)
      })
    },

    selectChange (val) {
      this.selections = val
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
.msg-manage-wrapper {
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
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
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
