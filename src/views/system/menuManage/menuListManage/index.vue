<template>
  <div class="menu-list-wrapper">
    <Card style="width:100%">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">菜单列表管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 @on-search="getList"
                 style="width: 200px"
                 v-model="keyword"
                 placeholder="搜索" />
          <Button type="primary"
                  style="margin-left:10px;"
                  v-permission="['add']"
                  @click="add">添加菜单</Button>
        </div>
      </div>
      <tree-table ref="treeTable"
                  :columns="columns"
                  :data="treeData"
                  :expand-type="false"
                  :is-fold="false"
                  :selectable="false"
                  :empty-text="emptyText"
                  border
                  expand-key="poName">
        <template slot="poName"
                  slot-scope="{row}">
          <span>{{row.poName}}</span>
        </template>
        <template slot="poSort"
                  align="center"
                  slot-scope="{row}">
          <span>{{row.poSort}}</span>
        </template>
        <template slot="poPageUrl"
                  slot-scope="{row}">
          <span>{{row.poPageUrl}}</span>
        </template>
        <template slot="level"
                  slot-scope="{row}">
          <span>{{(row.level + 1) + '级菜单'}}</span>
        </template>
        <template slot="poIcon"
                  slot-scope="{row}">
          <Icon :type="row.poIcon"
                size="24" />
        </template>
        <template slot="action"
                  slot-scope="{row}">
          <Button type="default"
                  size="small"
                  v-permission="['add']"
                  @click="add(row)">新增子菜单</Button>
          <Button type="default"
                  size="small"
                  style="margin-left: 5px;"
                  v-permission="['edit']"
                  @click="edit(row)">编辑</Button>
          <Button type="error"
                  size="small"
                  style="margin-left: 5px;"
                  v-permission="['del']"
                  @click="deleteData(row.poId)">删除</Button>
        </template>
      </tree-table>
    </Card>
    <Edit ref="edit"
          :title="modalTitle"
          :visible="editModalVisible"
          @upDateList="getList"
          @close="editModalVisible = false"></Edit>
  </div>
</template>
<script>
import { getMenuList, deleteMenu } from '@/api/system_menuManage.js'

import Edit from './edit.vue'

export default {
  name: 'menvListManage',
  data () {
    return {
      columns: [
        {
          title: '菜单名称',
          key: 'poName',
          type: 'template',
          width: 240,
          template: 'poName'
        },
        {
          title: '排序',
          key: 'poSort',
          type: 'template',
          template: 'poSort',
          align: 'center',
          headerAlign: 'center'

        },
        {
          title: '链接',
          key: 'poPageUrl',
          type: 'template',
          template: 'poPageUrl',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '级别',
          key: 'level',
          type: 'template',
          template: 'level',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '图标',
          key: 'poIcon',
          type: 'template',
          template: 'poIcon',
          align: 'center',
          headerAlign: 'center'
        },
        {
          title: '操作',
          key: 'action',
          type: 'template',
          template: 'action',
          width: 220,
          align: 'center',
          headerAlign: 'center'
        }
      ],
      treeData: [],
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      emptyText: '数据加载中',
      keyword: ''
    }
  },
  components: {
    Edit
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      let params = {
        poMenuName: this.keyword.trim()
      }
      // console.log(params)
      getMenuList(params).then(({ data }) => {
        if (data.code == 0) {
          this.treeData = data.data
          console.log(this.treeData)
        } else {
          this.emptyText = '暂无数据'
          this.$Message.error(data.message)
        }
        console.log(this.treeData)
      }).catch(err => {
        // this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    edit (row) {
      this.modalTitle = 1
      this.editModalVisible = true
      this.$refs.edit.getFormData(1, row)
    },
    add (row) {
      let obj = row || {}
      this.modalTitle = 0
      this.editModalVisible = true
      this.$refs.edit.getFormData(0, obj)
    },
    deleteData (id) {
      let params = {
        id: id
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          deleteMenu(params).then((res) => {
            let data = res.data
            if (data.code == 0) {
              this.$Message.success(data.message)
              this.getList()
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            // this.isLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    }
  }
}
</script>
<style lang="less">
.menu-list-wrapper {
  width: 100%;
  height: auto;
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
  .zk-table__cell-inner {
    font-size: 14px;
    color: #252525;
  }
  .zk-table--firstProp-header-inner {
    text-align: left;
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
}
</style>
