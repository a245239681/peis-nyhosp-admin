<template>
  <div class="lis-detail-contrast-wrapper">
    <Row>
      <Col span='14'>
      <Card style="width:99%;">
        <!-- <RadioGroup v-if='tagget==1'
                    v-model="buttonSize"
                    @on-change="changeRadio"
                    type="button">
          <Radio label="1">总院</Radio>
        </RadioGroup> -->
        <RadioGroup v-model="buttonSize"
                    @on-change="changeRadio"
                    type="button">
          <Radio label="2">送往分院</Radio>
          <Radio label="1">送往总院</Radio>
        </RadioGroup>
      </Card>
      </Col>
      <Col span='10'>
      <Card style="width:99%;">
        <!-- <RadioGroup v-if='tagget==1'
                    v-model="buttonSizes"
                    @on-change="changeRadios"
                    type="button">
          <Radio label="1">总院</Radio> -->
        </RadioGroup>
        <RadioGroup v-model="buttonSizes"
                    @on-change="changeRadios"
                    type="button">
          <Radio label="2">分院lis数据</Radio>
          <Radio label="1">总院lis数据</Radio>
        </RadioGroup>

      </Card>
      </Col>
    </Row>
    <Row :gutter="10"
         style='width:100%'>
      <Col span='14'>
      <Card style="width:100%;">
        <Tabs value="name1"
              @on-click='tabSeach'
              :animated='false'>
          <div slot="extra"
               class="search-title-wrapper">
            <div style="margin-right:10px;">
              <RadioGroup v-model="useStatus"
                          @on-change="changeStatus"
                          type="button">
                <Radio label="1">启用</Radio>
                <Radio label="0">停用</Radio>
              </RadioGroup>
            </div>
            <span class="title1">lis明细项</span>
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
      <Col span='10'>
      <Card style="width:100%;">
        <div slot="title"
             class="search-title-wrapper">
          <span class="title">LIS对照</span>
          <div class="title-right-tool">
            <Input search
                   enter-button
                   v-model="lisKeyWord"
                   style="width: 200px;margin-right:5px"
                   @on-search="searchHis()"
                   placeholder="搜索LIS项目" />
            <!-- <Button @click="getHis"
                    :loading="hisLoading"
                    type='primary'>导入his</Button> -->
          </div>
        </div>
        <div class='page-body clearfix'>
          <Table :columns="columns1"
                 highlight-row
                 :loading='LispinShow'
                 :data="tableData1">
            <template slot="action"
                      slot-scope="{row,index}">
              <Button v-if="row.lisRelevanceStatus=='已关联'"
                      type='error'
                      ghost
                      v-permission="['edit']"
                      disabled>取消关联</Button>
              <Button v-permission="['edit']"
                      v-if="row.lisRelevanceStatus=='未关联'"
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
import {
  getSeachAll,
  getLisSeachAll,
  relationHis,
  getHis
} from '@/api/projectMaintain.js'

export default {
  name: 'lisDetailContrastManage',
  components: {},
  data () {
    return {
      columns1: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: 'LIS项目代码',
          key: 'paTestItemId',
          minWidth: 120,
          align: 'center'
        },
        {
          title: 'LIS项目名称',
          key: 'paTestItemName',
          minWidth: 210,
          align: 'center'
        },
        {
          title: 'LIS项目规格',
          key: 'hisItemSpec',
          minWidth: 120,
          align: 'center'
        },
        {
          title: 'LIS项目单位',
          key: 'hisUnits',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          key: 'action',
          minWidth: 120,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData1: [],
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: '项目代码',
          key: 'paItemCode',
          align: 'center',
          minWidth: 110
        },
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
          title: 'lis代码',
          key: 'lisItemCode',
          align: 'center',
          minWidth: 110
        },
        {
          title: 'lis名称',
          key: 'lisItemName',
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
      buttonSize: '2',
      buttonSizes: '2',
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
      lisKeyWord: '',
      relevanceStatus: '',
      relationParams: '',
      relationStatus: '',
      tabStatus: '2',
      LispinShow: false,
      useStatus: '1' // 默认启用
    }
  },
  created () { },
  mounted () {
    this.getSeachAll()
    this.getLisSeachAll()
  },
  watch: {
    keyword (newkeyword, oldkeyword) {
      if (newkeyword == '') {
        this.getSeachAll(1, 20, this.relevanceStatus, '')
      }
    }
  },
  computed: {
    tagget () {
      return this.$store.getters.getUserInfo.userAreaType
    }
  },
  methods: {
    // 切换总院分院
    changeRadio (e) {
      console.log(e)
      this.tabStatus = e
      this.getSeachAll()
    },
    // 切换总院分院
    changeRadios (e) {
      console.log(e)

      this.getLisSeachAll()
    },
    // 搜索His
    searchHis () {
      this.getLisSeachAll(1, 20, this.lisKeyWord)
    },
    // 导入his
    getHis () {
      let params = {
        pinyinCode: '',
        type: '',
        lisCode: '2'
      }
      this.hisLoading = true
      getHis(params)
        .then(({ data }) => {
          this.hisLoading = false
          if (data.code == 0) {
            this.$Message.success(data.message)
            this.tableData1 = data.data.records
            this.hisTotalSize = data.data.total
            this.getLisSeachAll()
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.hisLoading = false
          this.$Message.error('网络不稳定')
        })
    },
    // 查询his项目
    getLisSeachAll (page = 1, size = 20, searchField = '') {
      this.hisPageIndex = page
      this.hisPageSize = size
      let pagination = {
        page: this.hisPageIndex,
        size: this.hisPageSize
      }
      let params
      // if (this.tagget == 1) {
      //   params = {
      //     searchField: searchField,
      //     paAreaType: 1, // 总院为1
      //     status: this.useStatus
      //   }
      // } else {
      //   params = {
      //     searchField: searchField,
      //     paAreaType: this.buttonSizes, // 分院为2
      //     status: this.useStatus
      //   }
      // }
      params = {
        searchField: searchField,
        paAreaType: this.buttonSizes, // 分院为2
        status: this.useStatus,
        lisCode: '2'
      }
      if (this.LispinShow) {
        return false
      }
      this.LispinShow = true
      getLisSeachAll(params, pagination)
        .then(({ data }) => {
          this.LispinShow = false
          if (data.code == 0) {
            this.tableData1 = data.data.records
            this.hisTotalSize = data.data.total
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.LispinShow = false
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
      let params
      // if (this.tagget == 1) {
      //   params = {
      //     relevanceStatus: relevanceStatus || this.relevanceStatus,
      //     searchField: searchField,
      //     logo: 'lis',
      //     paAreaType: 1, // 总院为1
      //     status: this.useStatus
      //   }
      // } else {
      //   params = {
      //     relevanceStatus: relevanceStatus || this.relevanceStatus,
      //     searchField: searchField,
      //     logo: 'lis',
      //     paAreaType: this.tabStatus, // 分院为2
      //     status: this.useStatus
      //   }
      // }
      params = {
        relevanceStatus: relevanceStatus || this.relevanceStatus,
        searchField: searchField,
        logo: 'lis',
        paAreaType: this.tabStatus, // 分院为2
        status: this.useStatus,
        lisCode: '2'
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      getSeachAll(params, pagination)
        .then(({ data }) => {
          this.isLoading = false
          if (data.code == 0) {
            this.tableData = data.data.records
            this.totalSize = data.data.total
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
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
      this.getLisSeachAll(val, this.hisPageSize, '')
    },
    hisPageSizeChange (val) {
      this.hisPageSize = val
      this.getLisSeachAll(1, val, '')
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
    tab () { },
    statusChange (row, index) {
      if (this.buttonSize == 1 && this.buttonSizes == 2) {
        this.$Message.warning('总院只能跟总院关联,请重新选择')
        return false
      }
      if (this.buttonSize == 2 && this.buttonSizes == 1) {
        this.$Message.warning('分院只能跟分院关联,请重新选择')
        return false
      }
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
        content: `是否${msg}该lis明细？`,
        onOk: () => {
          if (status == 0) {
            let params = Object.assign({}, this.relationParams, {
              lisItemId: row.paId,
              logo: 'lis',
              paAreaType: this.tabStatus,
              lisAreaType: this.buttonSizes,
              lisCode: '2'
            })
            relationHis(params)
              .then(({ data }) => {
                if (data.code == 0) {
                  this.relationParams = ''
                  this.getLisSeachAll()
                  this.getSeachAll(1, 20, this.relevanceStatus, this.keyword)
                  this.$Message.success(data.message)
                } else {
                  if (this.relationStatus == '已关联') {
                    this.$Message.warning(
                      '该项目已有对应的关联,请重新选择项目'
                    )
                  } else {
                    this.$Message.error(data.message)
                  }
                }
              })
              .catch(err => {
                this.$Message.error('网络不稳定，请稍后重试')
              })
          }
        },
        onCancel: () => { }
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
          logo: 'lis',
          paAreaType: this.tabStatus,
          lisCode: '2'

        }
        this.$Modal.confirm({
          title: '提示',
          content: `是否取消关联该lis？`,
          onOk: () => {
            relationHis(params)
              .then(({ data }) => {
                if (data.code == 0) {
                  this.getSeachAll(1, 20, this.relevanceStatus, this.keyword)
                  this.getLisSeachAll()
                  this.$Message.success(data.message)
                } else {
                  this.$Message.error(data.message)
                }
              })
              .catch(err => {
                this.$Message.error('网络不稳定，请稍后重试')
              })
          },
          onCancel: () => { }
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
        onOk: () => { },
        onCancel: () => { }
      })
    },
    selectChange (val) {
      this.selections = val
    },
    deleteAllHandle () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除所选数据？',
        onOk: () => { },
        onCancel: () => { }
      })
    },
    // 切换使用状态
    changeStatus (e) {
      console.log(this.useStatus)
      this.getSeachAll()
      this.getLisSeachAll()
    }
  }
}
</script>

<style lang="less">
.lis-detail-contrast-wrapper {
  width: 100%;
  height: inherit;
  min-width: 1400px;
  min-height: calc(~'100% - 80px');
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
  width: 40%;
}
.ivu-tabs {
  position: static;
}
</style>
