<template>
  <div class="branch-summary-wrapper">
    <Card class="branch-summary-left"
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
    <Card class="branch-summary-right">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">常用分科小结</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="keywords"
                 style="width: 200px"
                 @on-search="getList()"
                 placeholder="搜索分科小结" />
          <Button type="primary"
                  style="margin-left: 8px;"
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
          <template slot="cdIsDefault"
                    slot-scope="{row}">
            {{row.cdIsDefault == '0' ? '否' : '是'}}
          </template>
          <template slot="cdStatus"
                    slot-scope="{row}">
            <!-- {{row.cdStatus == '0' ? '停用' : '启用'}} -->
            <Tag color="green"
                 v-if="row.cdStatus == 1">启用</Tag>
            <Tag color="orange"
                 v-else>停用</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    @click="defaultStatusChange(row)"
                    size="small">{{row.cdIsDefault == 0 ? '设为默认' : '取消默认'}}</Button>
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit(row)"
                    size="small">修改</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    @click="deleteData(row)"
                    size="small">删除</Button>
          </template>
        </Table>
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
      </div>

    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          @updateList="getList(pageIndex, pageSize)"
          @close="editModalVisible = false"></Edit>
  </div>
</template>

<script>
import { dictDeptConclusiontList, dictDeptConclusionDelete, dictDeptConclusionStatus } from '@/api/busdict_branchSummary.js'
import Edit from './edit'

export default {
  name: 'branchSummary',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        // {
        // width: 55,
        // type: 'selection',
        // align: 'center'
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
          title: '是否默认',
          slot: 'cdIsDefault',
          key: 'cdIsDefault',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '科室小结',
          key: 'cdConclusion',
          minWidth: 450,
          align: 'center'
        },
        {
          title: '状态',
          minWidth: 80,
          slot: 'cdStatus',
          key: 'cdStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 220,
          align: 'center',
          fixed: 'right'
        }
      ],
      isLoading: false,
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      keyword: '',
      keywords: '',
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      curActive: '',
      deptId: '' // 当前选中科室对应的id
    }
  },
  computed: {
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    },
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
      dictDeptConclusiontList(pagination, params).then(({ data }) => {
        console.log(data)
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

    // 获取科室组合数据
    getComboList (item, index) {
      this.curActive = index
      this.keywords = ''
      let page = 1
      let size = 20

      let pagination = {
        page,
        size
      }
      if (Object.keys(item).length == 0) {
        this.deptId = ''
      } else {
        this.deptId = item.poId
      }
      let params = {
        deptId: this.deptId,
        searchField: this.keywords.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictDeptConclusiontList(pagination, params)
        .then(({ data }) => {
          console.log(data)
          this.isLoading = false
          if (data.code == 0) {
            this.tableData = data.data.records
            this.totalSize = data.data.total
            console.log(this.tableData)
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
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
      this.modalTitle = 1
      this.editModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    defaultStatusChange (row) {
      console.log(row)
      let cdIsDefault = '0'
      let msg = ''
      if (row.cdIsDefault == 1) {
        cdIsDefault = '0'
        msg = '取消默认'
      } else {
        cdIsDefault = '1'
        msg = '设为默认'
      }
      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}`,
        onOk: () => {
          let params = {
            cdOrgId: row.cdOrgId,
            cdDefaultVal: cdIsDefault,
            cdId: row.cdId
          }
          console.log(params)
          dictDeptConclusionStatus(params).then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.$Message.success(`${msg}成功`)
              // 更新科室小结vuex状态
              let params = {
                deptId: this.userInfo.userDeptId
              }
              let btn = true
              this.$store.dispatch('getConclusionDict', { params, btn })
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
      // this.deleteModalVisible = true;
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          dictDeptConclusionDelete(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已删除该条科室小结`)
              // 更新科室小结vuex状态
              let params = {
                deptId: this.userInfo.userDeptId
              }
              let btn = true
              this.$store.dispatch('getConclusionDict', { params, btn })

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
          // 选中的疾病名称
          let diseaseNames = []
          this.selections.map(item => {
            diseaseNames.push(item.ICDCode)
          })
          // identifyDelete(diseaseNames).then(({ data }) => {
          //   if (data.code == 0) {
          //     this.$Message.success(`删除成功`)
          //     this.getList()
          //   } else {
          //     this.$Message.error(data.message)
          //   }
          // }).catch(err => {
          //   this.$Message.error('网络不稳定，请稍后重试')
          // })
        },
        onCancel: () => {

        }
      })
    }
  }
}
</script>

<style lang="less">
.branch-summary-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  justify-content: flex-start;
  .branch-summary-left {
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
  .branch-summary-right {
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
