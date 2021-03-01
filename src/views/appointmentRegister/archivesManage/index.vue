<template>
  <div class="archives-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检档案管理</span>
        <div class="title-right-tool">
          <!-- @on-change="searchByRegisterCode" -->
          <Input style="width: 200px;margin-right: 12px;"
                 clearable
                 v-model="registerCode"
                 @on-enter="searchByRegisterCode"
                 show-word-limit
                 placeholder="请输入登记流水号" />
          <DatePicker type="daterange"
                      split-panels
                      placement="bottom-end"
                      placeholder="请选择档案创建时间范围"
                      @on-change="searchByDaterange"
                      style="width: 200px;margin-right: 12px;"></DatePicker>
          <Input search
                 enter-button
                 style="width: 240px;margin-right: 12px;"
                 v-model="keyword"
                 @on-search="getList()"
                 placeholder="请搜索姓名或证件号码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新建档案</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               @on-row-dblclick="edit">
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit(row)"
                    v-permission="['edit']"
                    size="small">修改</Button>
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
          ref="editwrapper"
          :picurl="pic"
          @updateList="getList(pageIndex,pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { archivesList, archivesSave, archivesDelete } from '@/api/archives_manage.js'

import Edit from './edit.vue'

export default {
  name: 'archivesManage',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        {
          title: '姓名',
          key: 'boName',
          width: 140,
          align: 'center'
        },
        {
          title: '性别',
          key: 'boSex',
          width: 80,
          align: 'center'
        },
        {
          title: '证件号码',
          key: 'boIdNo',
          width: 180,
          align: 'center'
        },
        {
          title: '手机号码',
          key: 'boMobile',
          width: 140,
          align: 'center'
        },
        {
          title: '体检号',
          key: 'boPeId',
          width: 160,
          align: 'center'
        },
        {
          title: '联系地址',
          key: 'boAddress',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 100,
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
      selections: [], // 表格勾选项集合
      keyword: '',  // 关键字
      registerCode: '',  // 登记流水号
      createDateS: '',  //  档案创建时间 - 开始
      createDateE: '',  //  档案创建时间 - 结束
      isLoading: false,
      pic: ''
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // searchByRegisterCode(e) {
    //   console.log(e)
    //   console.log(this.registerCode)
    //   if (this.registerCode.length >= 12 && this.registerCode.length <= 16) {
    //     this.getItemList()
    //   }
    // },
    searchByRegisterCode (e) {
      console.log(e)
      console.log(this.registerCode)
      if (this.registerCode.length >= 12 && this.registerCode.length <= 16) {
        this.getList()
      }
    },
    searchByDaterange (daterange) {
      console.log(daterange)
      this.createDateS = daterange[0]
      this.createDateE = daterange[1]
      this.getList()
    },
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      // console.log('执行'+this.registerCode.length)
      let len = this.registerCode.length
      if (len == 0 || (len >= 12 && len <= 16)) {
        let params = {
          keyword: this.keyword.trim(),
          registerCode: this.registerCode,
          createDateS: this.createDateS,
          createDateE: this.createDateE
        }
        //防止搜索框重复提交
        if (this.isLoading) {
          return
        }
        this.isLoading = true

        archivesList(pagination, params).then(({ data }) => {
          if (data.code == 0) {
            let res = data.data
            this.tableData = res.records
            this.totalSize = res.total
          } else {
            this.$Message.error(data.message)
          }
          this.isLoading = false
        }).catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      };
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
.archives-manage-wrapper {
  width: 100%;
  min-width: 1200px;
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
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>
