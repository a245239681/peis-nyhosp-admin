<template>
  <div class="project-maintain-wrapper">
    <Row :gutter="8">
      <Col span='15'>
      <Card style="width:100%;">
        <Tabs value="name1"
              @on-click='tabSeach'
              :animated='false'>
          <div slot="extra"
               class="search-title-wrapper">
            <span class="title1">项目对照</span>
            <div class="title-right-tool">
              <Input search
                     enter-button
                     v-model="keyword"
                     style="width: 200px"
                     @on-search="searchItem(1,20)"
                     placeholder="搜索项目名称" />
            </div>
          </div>
          <TabPane :label="TabPaneLabel[index]"
                   v-for="(item,index) of [1,2,3]"
                   :key="index"
                   :name="TabPaneName[index]">
            <div class='page-body clearfix'>

              <Table :columns="columns"
                     highlight-row
                     @on-row-click='choose'
                     :loading='isLoading'
                     :data="tableData">
                <template slot="action"
                          slot-scope="{row,index}">
                  <Button v-if="row.relevanceStatus=='未关联'">未关联</Button>
                  <Button type='error'
                          ghost
                          @click="relation(row,index)"
                          v-if="row.relevanceStatus=='已关联'">取消关联</Button>
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
          </TabPane>
        </Tabs>
      </Card>
      </Col>
      <Col span='9'>
      <Card style="width:100%;">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">HIS对照</span>
          <div class="title-right-tool">
            <Input search
                   enter-button
                   v-model="hisKeyWord"
                   style="width: 200px;margin-right:5px"
                   @on-search="searchHis()"
                   placeholder="搜索HIS项目" />
            <Button @click="getHis"
                    :loading="hisLoading"
                    type='primary'>导入his</Button>
          </div>
        </div>
        <div class='page-body clearfix'>
          <Table :columns="columns1"
                 highlight-row
                 :data="tableData1">
            <template slot="action"
                      slot-scope="{row,index}">
              <Button v-if="row.relevanceStatus=='已关联'"
                      type='error'
                      ghost
                      v-permission="['edit']"
                      disabled>取消关联</Button>
              <Button v-permission="['edit']"
                      v-if="row.relevanceStatus=='未关联'"
                      @click="statusChange(row,index)">关联</Button>
            </template>
          </Table>
        </div>
        <div class="page-footer">
          <Page :total="hisTotalSize"
                :page-size="hisPageSize"
                :current="hisPageIndex"
                :page-size-opts="[10,20,40,100]"
                @on-change="hisPageIndexChange"
                @on-page-size-change="hisPageSizeChange"
                size="small"
                show-sizer
                show-elevator
                show-total />
        </div>
      </Card>
      </col>
    </Row>

  </div>
</template>

<script>
import { getSeachAll, getHisSeachAll, relationHis, getHis } from '@/api/projectMaintain.js'

export default {
  name: 'projectMaintain',
  components: {

  },
  data () {
    return {
      columns1: [
        {
          title: 'HIS项目代码',
          key: 'hisNo',
          minWidth: 110,
          align: 'center'
        },
        {
          title: 'HIS项目名称',
          key: 'hisItemName',
          minWidth: 210,
          align: 'center'
        },
        {
          title: 'HIS项目规格',
          key: 'hisItemSpec',
          minWidth: 110,
          align: 'center'
        },
        {
          title: 'HIS项目单位',
          key: 'hisUnits',
          minWidth: 110,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          minWidth: 110,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData1: [],
      columns: [
        {
          title: '项目名称',
          key: 'paItemName',
          align: 'center',
          minWidth: 200

        },
        {
          title: '检查科室',
          key: 'paDeptName',
          align: 'center',
          minWidth: 110
        },
        {
          title: '单价',
          key: 'paPrice',
          align: 'center',
          minWidth: 110
        },
        {
          title: '临床类型',
          key: 'keshiNumber',
          align: 'center',
          minWidth: 110
        },
        {
          title: 'his代码',
          key: 'hisItemCode',
          align: 'center',
          minWidth: 110
        },
        {
          title: 'his名称',
          key: 'hisItemName',
          align: 'center',
          minWidth: 220
        },
        {
          title: '状态',
          key: 'relevanceStatus',
          align: 'center',
          minWidth: 110
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 110,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData: [],
      TabPaneName: ['name1', 'name2', 'name3'],
      TabPaneLabel: ['全部项目', '已关联', '未关联'],
      isLoading: false,
      hisLoading: false,
      hisTotalSize: 0,
      hisPageIndex: 1,
      hisPageSize: 20,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      keyword: '',
      hisKeyWord: '',
      relevanceStatus: '',
      relationParams: '',
      relationStatus: ''

    }
  },
  created () {

  },
  mounted () {
    this.getSeachAll()
    this.getHisSeachAll()
  },
  watch: {
    keyword (newkeyword, oldkeyword) {
      if (newkeyword == '') {
        this.getSeachAll(1, 20, this.relevanceStatus, '')
      }
    }
  },
  methods: {
    // 搜索His
    searchHis () {
      this.getHisSeachAll(1, this.hisPageSize, this.hisKeyWord)
    },
    // 导入his
    getHis () {
      let params = {
        pinyinCode: '',
        type: ''
      }
      this.hisLoading = true
      getHis(params).then(({ data }) => {
        this.hisLoading = false
        if (data.code == 0) {
          this.$Message.success(data.message)
          this.tableData1 = data.data.records
          this.hisTotalSize = data.data.total
          this.getHisSeachAll()
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.hisLoading = false
        this.$Message.error('网络不稳定')
      })
    },
    // 查询his项目
    getHisSeachAll (page = 1, size = 20, searchField = '') {
      this.hisPageIndex = page
      this.hisPageSize = size
      let pagination = {
        page: this.hisPageIndex,
        size: this.hisPageSize
      }
      console.log(searchField)
      let params = {
        searchField: searchField
      }
      // 防止多次加载
      if (this.hisLoading) {
        return false
      }
      this.hisLoading = true
      getHisSeachAll(params, pagination).then(({ data }) => {
        this.hisLoading = false
        if (data.code == 0) {
          this.tableData1 = data.data.records
          this.hisTotalSize = data.data.total
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.hisLoading = false
        this.$Message.error('网络不稳定')
      })
    },
    // 查询全部项目
    getSeachAll (page = 1, size = 20, relevanceStatus = '', searchField = '') {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      console.log(this.pageIndex, this.pageSize)
      let params = {
        relevanceStatus: relevanceStatus,
        searchField: searchField,
        logo: 'his'
      }
      // 防止多次加载
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      getSeachAll(params, pagination).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalSize = data.data.total
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定')
      })
    },
    // 搜索
    searchItem () {
      this.getSeachAll(1, 20, this.relevanceStatus, this.keyword)
    },
    pageIndexChange (val) {
      this.pageIndex = val
      this.getSeachAll(val, this.pageSize, this.relevanceStatus, this.keyword)
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.getSeachAll(1, val, this.relevanceStatus, this.keyword)
    },
    hisPageIndexChange (val) {
      this.hisPageIndex = val

      this.getHisSeachAll(val, this.hisPageSize, this.hisKeyWord)
    },
    hisPageSizeChange (val) {
      this.hisPageSize = val
      console.log(this.hisPageIndex, this.hisPageSize)
      this.getHisSeachAll(1, val, this.hisKeyWord)
    },
    tabSeach (name) {
      this.pageIndex = 1
      this.pageSize = 20
      if (name == 'name1') {
        this.relevanceStatus = ''
        this.getSeachAll()
      } else if (name == 'name2') {
        this.relevanceStatus = '1'
        this.getSeachAll(1, 20, this.relevanceStatus, '')
      } else if (name == 'name3') {
        this.relevanceStatus = '0'
        this.getSeachAll(1, 20, this.relevanceStatus, '')
      }
    },
    add () {
      this.modalTitle = 0
      this.editModalVisible = true
    },
    tab () {

    },
    statusChange (row, index) {
      // console.log(row)
      let status = 0
      let msg = ''
      if (row.relevanceStatus == '已关联') {
        status = 1
        msg = '取消关联'
      } else {
        status = 0
        msg = '关联'
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该单位类别？`,
        onOk: () => {
          if (status == 0) {
            let params = Object.assign({}, this.relationParams, { hisItemId: row.id, logo: 'his' })
            relationHis(params).then(({ data }) => {
              if (data.code == 0) {
                this.relationParams = ''
                this.getHisSeachAll()
                this.getSeachAll(1, 20, this.relevanceStatus, this.keyword)
                this.$Message.success(data.message)
              } else {
                if (this.relationStatus == '已关联') {
                  this.$Message.warning('该项目已有对应的关联,请重新选择项目')
                } else {
                  this.$Message.error(data.message)
                }
              }
            }).catch(err => {
              this.$Message.error('网络不稳定，请稍后重试')
            })
          }
        },
        onCancel: () => {

        }
      })
    },
    choose (row, index) {
      let relevanceOrOn = row.itemControlId != null ? '0' : '1'
      if (relevanceOrOn == '1') {
        this.relationParams = {
          itemId: row.paId,
          relevanceOrOn: relevanceOrOn
        }
      } else {

      }
      this.relationStatus = row.relevanceStatus
    },
    relation (row, index) {
      let relevanceOrOn = row.itemControlId != null ? '0' : '1'
      if (relevanceOrOn == '1') {
        this.relationParams = {
          itemId: row.paId,
          relevanceOrOn: relevanceOrOn
        }
      } else {
        this.relationParams = {
          itemId: row.paId,
          relevanceOrOn: relevanceOrOn
        }
        let params = {
          itemControlId: row.itemControlId,
          itemId: row.paId,
          relevanceOrOn: relevanceOrOn,
          logo: 'his'
        }
        this.$Modal.confirm({
          title: '提示',
          content: `是否取消关联该单位？`,
          onOk: () => {
            relationHis(params).then(({ data }) => {
              if (data.code == 0) {
                this.getSeachAll(1, 20, this.relevanceStatus, this.keyword)
                this.getHisSeachAll()
                this.$Message.success(data.message)
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
      }
    },
    edit () {
      this.modalTitle = 1
      this.editModalVisible = true
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
.project-maintain-wrapper {
  width: 100%;
  height: inherit;
  min-width: 1400px;
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
  .title1 {
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
  .ivu-page {
    text-align: center;
  }
}
</style>
<style lang='less' scoped>
/deep/.title1 {
  position: absolute;
  left: 15px;
}
/deep/.ivu-tabs-nav-container {
  left: 100px;
}
.ivu-tabs {
  position: static;
}
</style>
