<template>
  <div class="unit-transfer-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">单位转账管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="filterText"
                 style="width: 260px"
                 placeholder="搜索单位名称或收款账号"
                 @on-change="searchTable" />
          <Button type="primary"
                  style="margin-left: 10px;"
                  v-permission="['add']"
                  @click="add">添加转账单</Button>
        </div>
      </div>
      <div class="main-body">
        <div class="main-body-wrapper">
          <div class="main-left-part">
            <div class="unit-search-box">
              <Input search
                     enter-button
                     placeholder="搜索公司名称"
                     v-model='keyword'
                     @on-change="searchUnit" />
            </div>
            <Scroll :on-reach-bottom="handleReachBottom"
                    :distance-to-edge="-24"
                    height="675"
                    style="margin-top:2px">
              <ul class="unit-list">
                <li v-if="keyword == ''"
                    @click="curUnit({}, 'all')"
                    :class="{'is-actived': curActive === 'all'}">全部单位</li>
                <li :class="{'is-actived': curActive === index}"
                    @click="curUnit(item, index)"
                    v-for="(item, index) in unitList"
                    :key="index">{{item.unitName}}</li>
              </ul>
            </Scroll>
          </div>
          <div class="main-right-part">
            <div class="group-table">
              <Table :columns="columns"
                     :data="tableData"
                     class="table"
                     height="710"
                     :loading="isLoading"
                     @on-selection-change="selectChange">
                <!-- <template slot="boStatus"
                          slot-scope="{row}">
                  <Tag color="green"
                       v-if="row.boStatus == 0">启用</Tag>
                  <Tag color="orange"
                       v-else>停用</Tag>
                </template> -->
                <template slot="action"
                          slot-scope="{row}">
                  <Button type="default"
                          style="margin-right: 8px;"
                          v-permission="['edit']"
                          @click="edit(row)"
                          size="small">修改</Button>
                  <Button type="error"
                          v-permission="['del']"
                          @click="deleteData(row)"
                          size="small">删除</Button>
                </template>
              </Table>
              <div class="page-table">
                <Page :total="totalSize"
                      :page-size="pageSize"
                      :current="pageIndex"
                      :page-size-opts="[10,20,40,100]"
                      @on-page-size-change="pageSizeChange"
                      @on-change="pageIndexChange"
                      size="small"
                      show-sizer
                      show-elevator
                      show-total />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          :unitId="UnitId"
          :unitName="UnitName"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize, UnitName)"
          @close="closeModal"></Edit>
  </div>
</template>
<script>
import moment from "moment"
import Edit from './edit.vue'
import { UnitsList, getTransferList, delTransfer } from '@/api/unitTransfer.js'

export default {
  name: 'unitTransfer',
  components: {
    Edit,
  },
  data () {
    return {
      unitList: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          minWidth: 60,
          align: 'center',
        },
        {
          title: '单位名称',
          key: 'boUnitName',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '转账银行',
          key: 'boTransferBank',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '转账账号',
          key: 'boTransferAccount',
          minWidth: 190,
          align: 'center'
        },
        {
          title: '转账金额',
          key: 'boTransferAmount',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '转账时间',
          key: 'boTransferDate',
          minWidth: 170,
          align: 'center'
        },
        {
          title: '填写人',
          key: 'boFiller',
          minWidth: 120,
          align: 'center'
        },
        // {
        //   title: '启用状态',
        //   slot: 'boStatus',
        //   minWidth: 100,
        //   align: 'center'
        // },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 140,
          align: 'center'
        }
      ],
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 10,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      isLoading: false,
      selections: [], // 表格选中项
      filterText: '',
      keyword: '',
      curActive: 'all',
      unitPageIndex: 1,
      unitPageSize: 30,
      isUnitMore: false,
      isUnitListLoading: false,
      unitSearchTimer: null,
      tableSearchTimer: null,
      UnitId: '',
      UnitName: '',
    }
  },
  created () {
    this.getUnitList('all')
    this.getList()
  },
  methods: {
    //搜索表格单位转账单
    searchTable () {
      this.tableSearchTimer && clearTimeout(this.tableSearchTimer);
      this.tableSearchTimer = setTimeout(() => {
        this.getList(this.pageIndex, this.pageSize, this.filterText)
      }, 300)
    },
    //搜索单位
    searchUnit () {
      this.unitSearchTimer && clearTimeout(this.unitSearchTimer);
      this.unitSearchTimer = setTimeout(() => {
        this.isUnitMore = false
        this.unitList = []
        this.filterText = ''
        if (!this.keyword) {
          this.curActive = 'all'
          this.unitPageIndex = 1
          this.getUnitList('all')
          this.getList()
        } else {
          this.curActive = -1
          this.getUnitList(-1)
        }
      }, 300)
    },
    //公司列表到达底部加载
    handleReachBottom () {
      return new Promise(resolve => {
        setTimeout(() => {
          this.unitPageIndex++ ,
            this.getUnitList('all')
          resolve();
        }, 1000);
      });
    },
    //高亮选中公司
    curUnit (item, index) {
      console.log(item.unitName)
      console.log(item.boUnitId)
      this.curActive = index
      this.UnitId = item.boUnitId || ''
      this.UnitName = item.unitName || ''
      this.getList(this.pageIndex, this.pageSize, this.UnitName)
    },
    //获取单位列表
    getUnitList (index) {
      console.log(index)
      if (this.isUnitMore) {
        return false
      }
      //防止多次点击
      if (this.isUnitListLoading) {
        return false
      }
      let pagination = {}
      let params = {}
      if (index == 'all') {
        pagination = {
          page: this.unitPageIndex,
          size: this.unitPageSize
        }
        params = {
          unitName: ''
        }
      } else if (index == -1) {
        pagination = {
          page: 1,
          size: 30
        }
        params = {
          unitName: this.keyword.trim()
        }
      }

      this.isUnitListLoading = true
      UnitsList(pagination, params).then(({ data }) => {
        this.isUnitListLoading = false
        // console.log(data);
        if (data.code == 0) {
          if (index == -1) {
            this.unitList = []
          }
          this.unitList = this.unitList.concat(data.data.records)
          // 判断当前页数和总页数是否相等，如果相同就不需要再请求了
          this.unitPageIndex == data.data.pages ? this.isUnitMore = true : this.isUnitMore = false
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isUnitListLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    //获取表格数据
    getList (page = 1, size = 10, Name = '') {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        name: Name.trim()
      }

      //防止重复点击
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      getTransferList(pagination, params).then(({ data }) => {
        console.log(data)
        if (data.code == 0) {
          this.tableData = data.data.records
          this.tableData.forEach(item => {
            item.boTransferDate = moment(item.boTransferDate).format('YYYY-MM-DD HH:mm:ss')
          })
          this.totalSize = data.data.total
        } else {
          this.$Message.error(data.message)
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    add () {
      if (!this.UnitId) {
        this.$Message.warning('新增转账单，请先点击选择指定单位')
        return
      }
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
    deleteData (row) {
      // this.deleteModalVisible = true;
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            boId: row.boId
          }
          delTransfer(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该转账单`)

              let len = this.tableData.length - 1
              if (len > 0) {
                this.getList(this.pageIndex, this.pageSize, this.filterText)
              } else if (this.pageIndex != 1) {
                this.pageIndex = --this.pageIndex
                this.getList(this.pageIndex, this.pageSize, this.filterText)
              } else {
                this.getList(this.pageIndex, this.pageSize, this.filterText)
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
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },
    closeModal () {
      this.editModalVisible = false;
    }
  }
}
</script>
<style lang="less">
.unit-transfer-wrapper {
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
  .main-body-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    .main-left-part {
      width: 260px;
      height: auto;
      margin-right: 20px;
      .unit-search-box {
        width: 260px;
      }
      .unit-list {
        margin-top: 5px;
        li {
          padding-left: 1em;
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
          color: #252525;
          word-break: keep-all; /* 不换行 */
          white-space: nowrap; /* 不换行 */
          overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
          &:hover {
            color: #57a3f3;
            cursor: pointer;
          }
        }
        li.is-actived {
          color: #2d8cf0;
          background-color: #f0faff;
        }
      }
    }
    .main-right-part {
      flex: 1;
      overflow: hidden;
      height: auto;
    }
  }
  .main-body {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .group-table {
      width: 100%;
      text-align: center;
      .page-table {
        height: 30px;
        margin-top: 24px;
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
  .ivu-table th {
    background-color: #d6eaff;
  }
  .ivu-scroll-container {
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #eee;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-corner {
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
  }
}
</style>