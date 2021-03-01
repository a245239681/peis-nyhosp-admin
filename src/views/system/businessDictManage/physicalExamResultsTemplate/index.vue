<template>
  <div class="physical-exam-results-template-wrapper">
    <Card class="disease-info-left"
          shadow>
      <div class="search-box">
        <Input search
               enter-button
               placeholder="搜索科室"
               size="small"
               style="width: 200px"
               v-model="keyword" />
      </div>
      <ul class="disease-list">
        <li v-if="keyword == ''"
            :class="{'is-actived': curActive === 'all'}"
            @click="getComboList({},'all')">全部</li>
        <li :class="{'is-actived': curActive === index}"
            v-for="(item, index) in roomFilter"
            @click="getComboList(item,index)"
            :key="index">{{item.poDeptName}}</li>
      </ul>
    </Card>
    <Card class="disease-info-right">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检项目结果录入模板</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="keywords"
                 style="width: 200px"
                 @on-search="getList()"
                 placeholder="搜索体检项目名称" />
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
          <template slot="cdStatus"
                    slot-scope="{row}">
            <!-- {{row.cdStatus == "0" ? '停用' : '启用'}} -->
            <Tag color="green"
                 v-if="row.cdStatus == 1">启用</Tag>
            <Tag color="orange"
                 v-else>停用</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button :type="row.cdStatus == 0 ? 'default' : 'error'"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.cdStatus == 0 ? '启用' : '停用'}}</Button>
            <Button type="default"
                    style="margin-left: 8px;"
                    v-permission="['edit']"
                    @click="edit(row)"
                    size="small">修改</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    v-permission="['del']"
                    @click="deleteData(row)"
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
              @on-change="pageIndexChange"
              @on-page-size-change="pageSizeChange"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          :itemName="curItemName"
          :itemId="curItemId"
          :deptName="deptName"
          :deptId="deptId"
          @updateList="getList(pageIndex, pageSize)"
          @openEdit2='openEdit2'
          @close="closeEditModal"></Edit>

    <Index :title="modalTitle1"
           :visible="editModalVisible1"
           @selected="itemSelected"
           @getItemName="getItemName"
           @close="editModalVisible1= false,editModalVisible = true"></Index>
  </div>
</template>

<script>
import { templateItemResultList, templateItemResultStatus, templateItemResultDelete } from '@/api/busdict_physicalExamResultsTemplate.js'

import Edit from './edit'
import Index from '../components/chooseList/index'

import { truncate } from 'fs'
export default {
  name: 'physicalExamResultsTemplate',
  components: {
    Edit,
    Index
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
          title: '序号',
          key: 'cdSort',
          width: 80,
          align: 'center'
        },
        {
          title: '科室',
          key: 'deptName',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '体检项目',
          key: 'itemName',
          minWidth: 150,
          align: 'center'
        },
        {
          title: '异常标志',
          minWidth: 100,
          key: 'cdDiagnosis',
          align: 'center'
        },
        {
          title: '拼音码',
          minWidth: 100,
          key: 'cdPyCode',
          align: 'center'
        },
        {
          title: '五笔码',
          minWidth: 100,
          key: 'cdWbCode',
          align: 'center'
        },
        {
          title: '诊断',
          minWidth: 150,
          key: 'cdKeyword',
          align: 'center'
        },
        {
          title: '结果描述',
          key: 'cdDescription',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '状态',
          minWidth: 90,
          slot: 'cdStatus',
          key: 'cdStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData: [],
      isLoading: false,
      curActive: 'all',
      keyword: '', // 搜索科室
      keywords: '',
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
      curItemName: '',
      curItemId: '',
      deptId: '', // 当前选中科室对应的id
      deptName: '' // 当前选中科室对应的名称
    }
  },
  computed: {
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    roomFilter () {
      this.curActive = ''
      if (this.keyword == '') {
        return this.$store.getters.getRoomDict
      }
      let arr = this.roomDict
      let newArr = []
      arr.forEach(item => {
        if (item.poDeptName.indexOf(this.keyword) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    }
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
    this.getList()
    this.$nextTick(() => {
      this.curActive = 'all'
    })
  },
  methods: {
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        deptId: this.deptId,
        searchField: this.keywords.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      templateItemResultList(pagination, params).then(({ data }) => {
        console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          this.totalSize = data.data.total
          this.tableData = data.data.records
          console.log(this.totalSize)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    // 获取科室组合数据
    getComboList (item, index) {
      this.curActive = index
      let page = 1
      let size = 20

      let pagination = {
        page,
        size
      }
      if (Object.keys(item).length == 0) {
        this.deptId = ''
        this.deptName = ''
      } else {
        this.deptId = item.poId
        this.deptName = item.poDeptName
      }
      let params = {
        deptId: this.deptId,
        searchField: this.keyword.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      templateItemResultList(pagination, params).then(({ data }) => {
        console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          console.log(this.tableData)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    add (row) {
      this.modalTitle = 0
      this.editModalVisible = true
      this.editModalVisible1 = false
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    // 关闭编辑框, 并清空编辑框的疾病名称的数据
    closeEditModal () {
      this.editModalVisible = false
      this.curItemName = ''
      this.curItemId = ''
    },
    // 打开edit2页面 隐藏edit页面
    openEdit2 () {
      this.editModalVisible = false
      this.editModalVisible1 = true
      this.modalTitle1 = 0
    },
    // 关闭体检项目列表对话框，打开体检项目录入模板编辑框
    itemSelected (listVisible) {
      this.editModalVisible1 = listVisible
      this.editModalVisible = true
    },
    edit (row) {
      this.modalTitle = 1
      this.editModalVisible = true
      this.editModalVisible1 = false
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      this.curItemName = row.itemName
      this.curItemId = row.cdItemId
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    statusChange (row) {
      let status = '0'
      let msg = ''
      if (row.cdStatus == 0) {
        status = '1'
        msg = '停用'
      } else {
        status = '0'
        msg = '启用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}？`,
        onOk: () => {
          let params = {
            cdStatus: status,
            cdId: row.cdId
          }
          templateItemResultStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}`)
              this.getList(this.pageIndex, this.pageSize)
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
    deleteData (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          templateItemResultDelete(params).then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.$Message.success(`删除成功`)

              let len = this.tableData.length - 1
              if (len > 0) {
                this.getList(this.pageIndex, this.pageSize)
              } else if (this.pageIndex != 1) {
                this.pageIndex = --this.pageIndex
                this.getList(this.pageIndex, this.pageSize)
              } else {
                this.getList(this.pageIndex, this.pageSize)
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
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
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
    // 获取选中的项目名称
    getItemName (val) {
      console.log(val)
      this.curItemName = val.curItemName
      this.curItemId = val.curItemId
    }
  }
}
</script>

<style lang="less">
.physical-exam-results-template-wrapper {
  width: 100%;
  height: 100%;
  min-height: calc(~'100% - 80px');
  display: flex;
  justify-content: flex-start;
  .disease-info-left {
    background-color: #fff;
    width: 20%;
    .ivu-card-body {
      height: 100%;
    }
    .search-box {
      width: 100%;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .disease-list {
      margin-top: 15px;
      max-height: calc(~'100% - 45px');
      height: 1000px;
      overflow-y: auto;
      li {
        padding-left: 10px;
        text-align: center;
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #eee;
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
  .disease-info-right {
    width: 80%;
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
    .ivu-card-body {
      height: calc(~'100% - 60px');
      padding-bottom: 0;
      .page-body {
        height: 100%;
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .ivu-table-wrapper {
          position: relative;
          width: 100%;
        }
        .page-footer {
          position: relative;
          bottom: 0;
        }
      }
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
</style>
