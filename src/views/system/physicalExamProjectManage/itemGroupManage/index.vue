<template>
  <div class="item-group-manage-template-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">所有项目</span>
        <div class="title-right-tool">
          <Input search
                 v-model="keyword"
                 enter-button
                 style="width: 200px"
                 @on-search="searchItem(1,20,itemName)"
                 placeholder="搜索名称或科室" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add()">新增</Button>
        </div>
      </div>
      <div class='item-group-manage-body'>
        <div class='body-left'>
          <div class="room-selected-wrapper">
            <Input search
                   enter-button
                   size="small"
                   v-model="keywordLb"
                   placeholder="搜索科室" />
            <ul class="room-list-wrapper">
              <li v-if="keywordLb == ''"
                  :class="{'is-actived': curActive === 'all'}"
                  @click="targetSearchList(1,20,'all', 'all')">全部</li>
              <li :class="{'is-actived': curActive === item.poId}"
                  v-for="(item, index) in roomFilter"
                  @click="targetSearchList(1,20,item, index)"
                  :key="index">{{item.poDeptName}}</li>
            </ul>
          </div>
        </div>
        <div class="page-body body-right clearfix">
          <Table :columns="columns"
                 :data="tableData"
                 :loading="isLoading"
                 @on-selection-change="selectChange">
            <template slot="paPrice"
                      slot-scope="{row}">
              <span>{{row.paPrice}}</span>
            </template>
            <template slot="paDiscountValue"
                      slot-scope="{row}">
              <span>{{row.paDiscountValue}}</span>
            </template>
            <template slot="action"
                      slot-scope="{row}">
              <Button :type="row.paStatus == 0 ? 'default' : 'error'"
                      style="margin-left: 8px;"
                      v-permission="['edit']"
                      @click="statusChange(row)"
                      :loading="btLoading==row.paId"
                      size="small">{{row.paStatus == 0 ? '启用' : '停用'}}</Button>
              <Button type="default"
                      style="margin-left: 8px;"
                      v-permission="['edit']"
                      @click="edit(row)"
                      size="small">修改</Button>
              <Button type="error"
                      style="margin-left: 8px;"
                      v-permission="['del']"
                      :loading="delLoading==row.paId"
                      @click="deleteData(row)"
                      size="small">删除</Button>
            </template>
          </Table>
        </div>

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
          @updateList="getSearchList(pageIndex,pageSize,itemName)"
          @close="editModalVisible = false"></Edit>

  </div>
</template>

<script>
import Edit from './edit'
import { comboList } from '@/api/dict_examTestTube.js'
import { mapGetters, mapState } from 'vuex'
import { searchList, del, startOrStop } from '@/api/itemGroupManage.js'
import { constants } from 'zlib'
export default {
  name: 'itemGroupManage',
  components: {
    Edit
  },
  data () {
    return {
      delLoading: false,
      btLoading: false,
      taggle: '',
      changeSize: '',
      keshiName: '',
      className: '',
      keywordLb: '',
      keyword: '',
      isLoading: false,
      userInfo: '',
      columns: [
        {
          title: '序号',
          key: 'paSort',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '组合名称',
          key: 'paComboName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '检查科室',
          key: 'paDeptName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '总价',
          slot: 'paPrice',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '折扣（%）',
          key: 'paDiscount',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '折扣价',
          slot: 'paDiscountValue',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '五笔码',
          key: 'paWbCode',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '拼音码',
          key: 'paPyCode',
          minWidth: 100,
          align: 'center'
        },
        // {
        //   title: '启用',
        //   key: 'enable',
        //   slot: 'enable',
        //   align: 'center'
        // },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center',
          fixed: 'right'
        }
      ],
      itemName: '',
      tableData: [],
      curActive: 'all',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      result: 0,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      selections: [] // 表格勾选项集合
    }
  },
  computed: {
    ...mapGetters(['getRoomDict', 'getUserInfo']),
    showButton () {
      return (this.name == 0)
    },
    roomDict: {
      get: function () {
        return this.getRoomDict
      },
      set: function () { }
    },
    roomFilter () {
      this.curActive = ''
      if (this.keywordLb == '') {
        return this.getRoomDict
      }
      let arr = this.roomDict
      let newArr = []
      arr.forEach(item => {
        if (item.poDeptName.indexOf(this.keywordLb) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    }
  },
  mounted () {
    this.getSearchList(1, 20, 'all', 'all')
  },

  async created () {
    // this.userInfo = this.getUserInfo
    // console.log(this.userInfo)
  },
  watch: {
    keyword (newkeyword, oldkeyword) {
      if (newkeyword == '') {
        this.getSearchList(1, 20, this.itemName, 'all')
      }
    }
  },
  methods: {
    getSearchList (page = 1, size = 20, itemName, index) { // 查询项目
      this.pageIndex = page
      this.pageSize = size
      this.curActive = itemName
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let keywordText = { text: this.keyword.trim(), deptId: this.itemName == 'all' ? '' : this.itemName }
      let keshiNameText = { text: this.keshiName.trim(), deptId: this.itemName == 'all' ? '' : this.itemName }
      let textFinall
      textFinall = { text: '', deptId: this.itemName == 'all' ? '' : this.itemName }
      // let params = {
      //   searchField: this.keyword.trim()
      // }
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
    // 查询项目(列表)
    targetSearchList (page = 1, size = 20, itemName, index) {
      console.log(itemName)
      this.pageIndex = page
      this.pageSize = size
      this.curActive = itemName.poId || 'all'
      this.taggle = true
      let pagination = {
        page: this.pageIndex || 1,
        size: this.pageSize || 20
      }
      let textFinall
      this.itemName = itemName.poId
      textFinall = { text: '', deptId: itemName == 'all' ? '' : itemName.poId }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      searchList(pagination, textFinall).then(({ data }) => {
        this.isLoading = false
        // console.log(data)
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
    // 搜索项目(搜索框)
    searchItem (page = 1, size = 20, itemName, index) {
      this.taggle = false
      this.pageIndex = page
      this.pageSize = size
      console.log(this.curActive)
      let pagination = {
        page: this.pageIndex || 1,
        size: this.pageSize || 20
      }
      let keywordText = { text: this.keyword.trim(), deptId: this.itemName == 'all' ? '' : this.itemName }
      let keshiNameText = { text: this.keshiName.trim(), deptId: this.itemName == 'all' ? '' : this.itemName }
      let textFinall = keywordText.valueOf().text == '' ? keshiNameText : keywordText
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
    pageIndexChange (val) { // 页码
      this.pageIndex = val
      if (this.taggle) {
        this.getSearchList(val, this.pageSize || 20, this.itemName)
      } else {
        this.searchItem(val, this.pageSize || 20, this.itemName)
      }
    },
    // 改变每页显示数
    pageSizeChange (val) { // page-size
      this.pageSize = val
      if (this.taggle) {
        this.getSearchList(1, this.pageSize || 20, this.itemName)
      } else {
        this.searchItem(1, this.pageSize || 20, this.itemName)
      }
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
        content: `是否${msg}该项目组合？`,
        onOk: () => {
          let params = {
            paStatus: status,
            paId: row.paId
          }
          this.btLoading = row.paId
          startOrStop(params).then(({ data }) => {
            this.btLoading = false
            if (data.code == 0) {
              this.$Message.success(`已${msg}该项目组合`)
              this.getSearchList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.btLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },
    deleteData (row) {
      // this.deleteModalVisible = true;
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            paId: row.paId
          }
          this.delLoading = row.paId
          del(params).then(({ data }) => {
            this.delLoading = false
            if (data.code == 0) {
              this.$Message.success(`删除成功`)

              let len = this.tableData.length - 1
              if (len > 0) {
                this.getSearchList(this.pageIndex, this.pageSize, this.itemName)
              } else if (this.pageIndex != 1) {
                this.pageIndex = --this.pageIndex
                this.getSearchList(this.pageIndex, this.pageSize, this.itemName)
              } else {
                this.getSearchList(this.pageIndex, this.pageSize, this.itemName)
              }
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.delLoading = false
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
    }
  }
}
</script>

<style lang="less">
.item-group-manage-template-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-table th {
    background-color: #d6eaff;
  }
  .room-selected-wrapper {
    width: 200px;
    .room-list-wrapper {
      margin-top: 15px;
      max-height: 55vh;
      overflow-y: auto;
      li {
        padding-left: 10px;
        height: 32px;
        line-height: 32px;
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
    ul::-webkit-scrollbar {
      width: 5px;
      background-color: #eee;
    }
    ul::-webkit-scrollbar-button {
      display: none;
    }
    ul::-webkit-scrollbar-corner {
      display: none;
    }
    ul::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #e8e8e8;
    }
  }
  .item-group-manage-body {
    display: -webkit-flex;
    // flex: 1;
    .body-left {
      width: 220px;
    }
    .body-right {
      flex-grow: 1;
      width: 0;
      padding-left: 10px;
    }
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
<style lang='less'>
</style>
