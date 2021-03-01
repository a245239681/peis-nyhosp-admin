<template>
  <div class="projectTeam-maintain-wrapper">
    <Row>
      <Col span='14'>
      <Card style="width:99%;">
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
              <!-- <RadioGroup v-model="buttonSize"
                          @on-change="changeRadio"
                          type="button">
                <Radio label="2">分院</Radio>
                <Radio label="1">总院</Radio>
              </RadioGroup> -->
              <RadioGroup v-model="useStatus"
                          @on-change="changeStatus"
                          type="button">
                <Radio label="1">启用</Radio>
                <Radio label="0">停用</Radio>
              </RadioGroup>
            </div>
            <span class="title1">组合及明细</span>

            <div class="title-right-tool">
              <Input search
                     enter-button
                     v-model="keyword"
                     style="width: 200px"
                     @on-search="searchItem(1,20)"
                     placeholder="搜索组合名称" />
            </div>
          </div>
          <TabPane :label="TabPaneLabel[index]"
                   v-for="(item,index) of [1,2,3]"
                   :key="index"
                   :name="TabPaneName[index]">
            <div class='page-body clearfix'>
              <Spin fix
                    style="width: 100%;position: relative; border: 1px solid #eee;height: 1000px;"
                    v-if="spinShow"></Spin>
              <tree-table ref="treeTable"
                          v-if="!spinShow"
                          :columns="columns"
                          :data="tableData"
                          :row-class-name='fnc'
                          highlight-row
                          @cell-click='choose'
                          :expand-type="false"
                          :selectable="false">

                <template slot="paComboName"
                          slot-scope="{row}">
                  <span>{{row.paComboName}}</span>
                </template>
                <template slot="paClinicalTypeName"
                          slot-scope="{row}">
                  <span>{{row.paClinicalTypeName}}</span>
                </template>
                <template slot="paComboCode"
                          slot-scope="{row}">
                  <span>{{row.paComboCode}}</span>
                </template>
                <template slot="paDeptName"
                          slot-scope="{row}">
                  <span>{{row.paDeptName}}</span>
                </template>
                <template slot="paItemName"
                          slot-scope="{row}">
                  <span>{{row.paItemName}}</span>
                  <!-- <span>{{row.paStatus==1?'有效':row.paStatus==0?'有效':''}}</span> -->
                </template>
                <template slot="lisComboName"
                          slot-scope="{row}">
                  <span>{{row.lisComboName}}</span>
                </template>
                <template slot="lisComboCode"
                          slot-scope="{row}">
                  <span>{{row.lisComboCode}}</span>
                </template>
                <template slot="paItemCode"
                          slot-scope="{row}">
                  <span>{{row.paItemCode}}</span>
                </template>
                <template slot="lisItemName"
                          slot-scope="{row}">
                  <span>{{row.lisItemName}}</span>
                </template>
                <template slot="lisItemCode"
                          slot-scope="{row}">
                  <span>{{row.lisItemCode}}</span>
                </template>
                <template slot="action"
                          slot-scope="{row}">
                  <Button v-if="row.lisRelevanceStatus=='未关联'">未关联</Button>
                  <Button type='error'
                          ghost
                          @click="relation(row,index)"
                          v-if="row.lisRelevanceStatus=='已关联'">取消关联</Button>
                  <Tag color="blue"
                       v-if="row.lisItemRelevanceStatus=='已关联'">已关联</Tag>
                  <Tag color="red"
                       v-if="row.lisItemRelevanceStatus=='未关联'">未关联</Tag>
                </template>
              </tree-table>
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
          <span class="title">LIS组合及明细</span>

          <!-- <RadioGroup v-model="buttonSizes"
                      @on-change="changeRadios"
                      type="button">
            <Radio label="2">分院</Radio>
            <Radio label="1">总院</Radio>
          </RadioGroup> -->

          <div class="title-right-tool">
            <Input search
                   enter-button
                   v-model="LisKeyWord"
                   style="width: 200px;margin-right:5px"
                   @on-search="searchLis()"
                   placeholder="搜索Lis组合名称" />
            <Button @click="getLis"
                    :loading="hisLoading"
                    type='primary'>导入Lis</Button>
          </div>
        </div>
        <div class='page-body clearfix'>
          <Spin fix
                style="width: 100%;position: relative; border: 1px solid #eee;height: 1000px;"
                v-if="LispinShow"></Spin>
          <tree-table ref="treeTable"
                      v-if="!LispinShow"
                      :columns="columns1"
                      :data="tableData1"
                      highlight-row
                      :expand-type="false"
                      :selectable="false">
            <template slot="chargeItemName"
                      slot-scope="{row}">
              <span>{{row.chargeItemName}}</span>
            </template>
            <template slot="groupName"
                      slot-scope="{row}">
              <span>{{row.groupName}}</span>
            </template>
            <template slot="chargeItemId"
                      slot-scope="{row}">
              <span>{{row.chargeItemId}}</span>
            </template>
            <template slot="hisId"
                      slot-scope="{row}">
              <span>{{row.hisId}}</span>
            </template>
            <template slot="charge"
                      slot-scope="{row}">
              <span>{{row.charge}}</span>
            </template>
            <template slot="paTestItemName"
                      slot-scope="{row}">
              <span>{{row.paTestItemName}}</span>
              <!-- <span>{{row.paStatus==1?'有效':row.paStatus==0?'有效':''}}</span> -->
            </template>
            <template slot="paTestItemId"
                      slot-scope="{row}">
              <span>{{row.paTestItemId}}</span>
            </template>
            <template slot="action"
                      slot-scope="{row,index}">
              <Button v-if="row.lisRelevanceStatus=='已关联'"
                      type='error'
                      ghost
                      disabled>取消关联</Button>
              <Button v-if="row.lisRelevanceStatus=='未关联'"
                      @click="statusChange(row,index)">关联</Button>
            </template>
          </tree-table>
        </div>
        <div class="page-footer">
          <Page :total="LisTotalSize"
                :page-size="LisPageSize"
                :current="LisPageIndex"
                :page-size-opts="[10,20,40,100]"
                @on-change="LisPageIndexChange"
                @on-page-size-change="LisPageSizeChange"
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
  relationLis,
  importLis
} from '@/api/projectTeamMaintain.js'

export default {
  name: 'projectTeamMaintain',
  components: {},
  data () {
    return {
      columns1: [
        {
          title: 'lis组合名称',
          key: 'chargeItemName',
          type: 'template',
          width: 170,
          template: 'chargeItemName',
          headerAlign: 'left',
          align: 'left'
        },
        {
          title: 'lis分组',
          key: 'groupName',
          type: 'template',
          width: 110,
          template: 'groupName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis组合编码',
          key: 'chargeItemId',
          type: 'template',
          width: 110,
          template: 'chargeItemId',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '组合编码',
          key: 'hisId',
          type: 'template',
          width: 110,
          template: 'hisId',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis组合价格',
          key: 'charge',
          type: 'template',
          width: 110,
          template: 'charge',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis细项名称',
          key: 'paTestItemName',
          type: 'template',
          width: 110,
          template: 'paTestItemName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis细项编码',
          key: 'paTestItemId',
          type: 'template',
          width: 110,
          template: 'paTestItemId',
          headerAlign: 'center',
          align: 'center'
        },

        {
          title: '操作',
          key: 'action',
          type: 'template',
          width: 110,
          template: 'action',
          headerAlign: 'center',
          align: 'center'
        }
      ],
      tableData1: [],
      columns: [
        {
          title: '组合名称',
          key: 'paComboName',
          type: 'template',
          width: 180,
          template: 'paComboName',
          headerAlign: 'left',
          align: 'left'
        },
        {
          title: '分组',
          key: 'paClinicalTypeName',
          type: 'template',
          width: 110,
          template: 'paClinicalTypeName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '组合编码',
          key: 'paComboCode',
          type: 'template',
          template: 'paComboCode',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '科室',
          key: 'paDeptName',
          type: 'template',
          template: 'paDeptName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis组合名称',
          key: 'lisComboName',
          type: 'template',
          width: 110,
          template: 'lisComboName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis组合编码',
          key: 'lisComboCode',
          width: 110,
          type: 'template',
          template: 'lisComboCode',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '明细名称',
          key: 'paItemName',
          type: 'template',
          width: 110,
          template: 'paItemName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '明细代码',
          key: 'paItemCode',
          type: 'template',
          width: 110,
          template: 'paItemCode',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis明细名称',
          key: 'lisItemName',
          type: 'template',
          width: 110,
          template: 'lisItemName',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: 'lis明细代码',
          key: 'lisItemCode',
          type: 'template',
          width: 110,
          template: 'lisItemCode',
          headerAlign: 'center',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          type: 'template',
          width: 110,
          template: 'action',
          headerAlign: 'center',
          align: 'center'
        }
      ],
      buttonSize: '2',
      buttonSizes: '2',
      useStatus: '1', // 默认启用
      color: 'color',
      tabStatus: '2',
      chooseId: '',
      tableData: [],
      emptyText: '暂无数据',
      TabPaneName: ['name1', 'name2', 'name3'],
      TabPaneLabel: ['全部项目', '已关联', '未关联'],
      isLoading: false,
      LisLoading: false,
      LisTotalSize: 0,
      LisPageIndex: 1,
      LisPageSize: 20,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      keyword: '',
      LisKeyWord: '',
      relevanceStatus: '',
      relationParams: '',
      relationStatus: '',
      spinShow: false,
      LispinShow: false,
      hisLoading: false
    }
  },
  created () { },
  mounted () {
    this.getSeachAll()
    // this.getHisSeachAll()
    this.getLisSeachAll()
  },
  watch: {
    keyword (newkeyword, oldkeyword) {
      if (newkeyword == '') {
        this.getSeachAll(1, 20, this.relevanceStatus, '')
      }
    }
  },
  methods: {
    fnc (row) {
      if (row.paId == this.chooseId) {
        return this.color
      }
    },
    // 切换总院分院
    changeRadio (e) {
      console.log(e)
      this.tabStatus = e
      this.getSeachAll()
    },
    // 切换总院分院
    changeRadios (e) {
      this.buttonSizes = e
      this.getLisSeachAll()
    },
    // 切换使用状态
    changeStatus (e) {
      console.log(this.useStatus)
      this.getSeachAll()
      this.getLisSeachAll()
    },
    // 导入Lis
    getLis () {
      let params = {
        areaType: this.buttonSizes, // 分院为2
        lisCode: '2'
      }
      this.hisLoading = true
      importLis(params)
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
    // 搜索Lis
    searchLis () {
      this.getLisSeachAll(1, 20, this.LisKeyWord)
    },
    // 查询Lis
    getLisSeachAll (page = 1, size = 20, searchField = '') {
      this.LisPageIndex = page,
        this.LisPageSize = size
      let pagination = {
        page: this.LisPageIndex,
        size: this.LisPageSize
      }
      let params = {
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
            // this.$Message.success(data.message)
            this.LisTotalSize = data.data.total
            this.tableData1 = data.data.records
            for (let i of this.tableData1) {
              i.children = i.lisGroupProjectsList
            }
            // console.log(data);
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.LispinShow = false
          this.$Message.error('网络不稳定')
        })
    },
    // 查询his项目
    // getHisSeachAll (page = 1, size = 20, searchField = '') {
    //   let pagination = {
    //     page: this.hisPageIndex,
    //     size: this.hisPageSize
    //   }
    //   let params = {
    //     searchField: searchField,
    //   }
    //   getHisSeachAll(params, pagination).then(({ data }) => {

    //     if (data.code == 0) {
    //       this.tableData1 = data.data.records
    //       this.hisTotalSize = data.data.total

    //     } else {
    //       this.$Message.error(data.message)
    //     }
    //   }).catch(err => {
    //     this.$Message.error('网络不稳定')
    //   })
    // },
    // 查询全部项目
    getSeachAll (
      page = 1,
      size = 20,
      lisRelevanceStatus = '',
      searchField = ''
    ) {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        lisRelevanceStatus: this.lisRelevanceStatus,
        searchField: searchField,
        logo: 'lis',
        paAreaType: this.tabStatus, // 分院为2
        status: this.useStatus,
        lisCode: '2' // 2为博凡 1为智方
      }
      if (this.spinShow) {
        return false
      }
      this.spinShow = true
      getSeachAll(params, pagination)
        .then(({ data }) => {
          this.spinShow = false
          if (data.code == 0) {
            this.tableData = data.data.records
            this.totalSize = data.data.total
            for (let i of this.tableData) {
              if (i.itemList) {
                i.children = i.itemList
              }
            }
            // console.log(this.tableData);
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.spinShow = false
          this.$Message.error('网络不稳定')
        })
    },
    // 搜索组合
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
    LisPageIndexChange (val) {
      this.LisPageIndex = val
      this.getLisSeachAll(val, this.LisPageSize, '')
    },
    LisPageSizeChange (val) {
      this.LisPageSize = val
      this.getLisSeachAll(1, val, '')
    },
    async tabSeach (name) {
      this.pageIndex = 1
      this.pageSize = 20
      if (this.spinShow) {
        return false
      }
      if (name == 'name1') {
        this.lisRelevanceStatus = ''
        await this.getSeachAll()
      } else if (name == 'name2') {
        this.lisRelevanceStatus = '1'
        await this.getSeachAll(1, 20, this.relevanceStatus, '')
      } else if (name == 'name3') {
        this.lisRelevanceStatus = '0'
        await this.getSeachAll(1, 20, this.lisRelevanceStatus, '')
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
      // console.log(row);
      let status = 0
      let msg = ''
      if (row.lisRelevanceStatus == '已关联') {
        status = 1
        msg = '取消关联'
      } else {
        status = 0
        msg = '关联'
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}该体检组合？`,
        onOk: () => {
          if (status == 0) {
            let params = Object.assign({}, this.relationParams, {
              lisComboId: row.id,
              logo: 'lis',
              paAreaType: this.tabStatus,
              lisAreaType: this.buttonSizes,
              lisCode: '2'
            })

            relationLis(params)
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
      if (row.children) {
        // console.log(row);
        this.chooseId = row.paId
        let relevanceOrOn = row.lisRelevanceStatus
        if (relevanceOrOn == '未关联') {
          this.relationParams = {
            comboId: row.paId,
            relevanceOrOn: '1'
          }
        } else {
        }
        this.relationStatus = row.lisRelevanceStatus
      }
    },
    relation (row, index) {
      // console.log("取消关联");
      let relevanceOrOn = row.lisRelevanceStatus
      // console.log(row);
      // console.log(relevanceOrOn);
      if (relevanceOrOn == '已关联') {
        this.relationParams = {
          itemId: row.paId,
          relevanceOrOn: '0'
        }
      } else {
        this.relationParams = {
          itemId: row.paId,
          relevanceOrOn: 1
        }
      }
      let params = {
        lisComboControlId: row.lisComboControlId,
        comboId: row.paId,
        relevanceOrOn: '0',
        logo: 'lis',
        paAreaType: this.tabStatus,
        lisCode: '2'

      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否取消关联该体检组合？`,
        onOk: () => {
          relationLis(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$Message.success(data.message)
                this.getSeachAll(1, 20, this.relevanceStatus, this.keyword)
                this.getLisSeachAll()
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
    }
  }
}
</script>

<style lang="less">
.projectTeam-maintain-wrapper {
  width: 100%;
  height: inherit;
  min-width: 1400px;
  min-height: calc(~'100% - 80px');
  .zk-table__header-row {
    background: #d6eaff;
  }
  // /deep/.zk-table__body-wrapper {
  //   height: 750px !important;
  //   overflow: auto;
  // }
  .color {
    background: #ebf7ff;
  }
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
