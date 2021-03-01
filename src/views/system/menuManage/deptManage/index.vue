<template>
  <div class="dept-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">部门菜单管理</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 placeholder="搜索" />
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData">
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    size="small"
                    @click="edit">权限设置</Button>
          </template>
        </Table>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40,100]"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="ModalVisible"
          @close="ModalVisible = false"></Edit>
  </div>
</template>
<script>
import Edit from './edit.vue'
export default {
  name: 'deptManage',
  components: {
    Edit
  },
  data () {
    return {
      columns: [
        {
          title: '排序',
          key: 'sort',
          align: 'center'
        },
        {
          title: '所属机构',
          key: 'organ',
          align: 'center'
        },
        {
          title: '科室名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '科室编号',
          key: 'number',
          align: 'center'
        },
        {
          title: '科室类型',
          key: 'type',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableData: [
        {
          sort: 1,
          organ: '广西区妇幼',
          name: '妇科',
          number: '001',
          type: 'test'
        }
      ],
      modalTitle: '妇科',
      ModalVisible: false,
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20
    }
  },
  mounted () {

  },
  methods: {
    edit () {
      this.ModalVisible = true
    }
  }
}
</script>
<style lang="less">
.dept-manage-wrapper {
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
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>
