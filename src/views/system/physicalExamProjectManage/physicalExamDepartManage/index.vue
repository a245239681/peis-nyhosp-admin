// <template>
  // <div class="main-live-guidance-wrapper">
    // <Card style="width:100%;">
      // <div slot="title" //
           class="search-title-wrapper">
        // <span class="title">主检生活指导</span>
        // <div class="title-right-tool">
          // <Input search //
                 enter-button //
                 style="width: 200px" //
                 placeholder="搜索" />
          // <Button type="primary" //
                  style="margin-left: 8px;" //
                  @click="add">新增</Button>
          // <Button type="error" //
                  style="margin-left: 8px;" //
                  @click="deleteAllHandle" //
                  :disabled="selections.length == 0">批量删除</Button>
          // </div>
        // </div>
      // <div class="page-body clearfix">
        // <Table :columns="columns" //
               :data="tableData" //
               @on-selection-change="selectChange">
          // <template slot="action" //
                    slot-scope="{row}">
            // <Button type="default" //
                    style="margin-left: 8px;" //
                    @click="edit" //
                    size="small">修改</Button>
            // <Button type="error" //
                    style="margin-left: 8px;" //
                    @click="deleteData" //
                    size="small">删除</Button>
            // </template>
          // </Table>
        // </div>
      // <div class="page-footer">
        //
        <Page :total="totalSize" //
              :page-size="pageSize" //
              :current="pageIndex" //
              :page-size-opts="[10,20,40,100]" //
              size="small" //
              show-sizer //
              show-elevator //
              show-total />
        // </div>
      // </Card>
    // <Edit :title="modalTitle" //
          :visible="editModalVisible" //
          @close="editModalVisible = false"></Edit>
    // </div>
  // </template>

<script>
// import Edit from './edit';

// export default {
//   name: 'mainLiveGuidance',
//   components: {
//     Edit
//   },
//   data () {
//     return {
//       columns: [
//         {
//           width: 55,
//           type: 'selection',
//           align: 'center'
//         },
//         {
//           title: '序号',
//           key: 'sort',
//           width: 80,
//           align: 'center'
//         },
//         {
//           title: '所属机构',
//           key: 'dept',
//           width: 150,
//           align: 'center'
//         },
//         {
//           title: '科室名称',
//           key: 'gudingContents',
//           align: 'center'
//         },
//         {
//           title: '科室编号',
//           key: 'keshiNumber',
//           align: 'center'
//         },
//         {
//           title: '科室类型',
//           key: 'keshiKind',
//           align: 'center'
//         },
//         {
//           title: '操作',
//           slot: 'action',
//           width: 180,
//           align: 'center',
//           fixed: 'right'
//         }
//       ],
//       tableData: [
//         {
//           sort: 1,
//           dept: '心胸科',
//           gudingContents: '开胸看心脏，其他没建议,测试数据',
//           status: '启用'
//         }
//       ],
//       totalSize: 100,
//       pageIndex: 1,
//       pageSize: 20,
//       modalTitle: 0, // 弹出框title，0为新增，1为编辑
//       editModalVisible: false,
//       deleteModalVisible: false,
//       selections: [], // 表格勾选项集合
//     }
//   },
//   created () {

//   },
//   mounted () {
//     let item = this.tableData[0];
//     for (let i = 0; i < 20; i++) {
//       this.tableData.push(item)
//     }
//   },
//   methods: {
//     add () {
//       this.modalTitle = 0;
//       this.editModalVisible = true;
//     },
//     edit () {
//       this.modalTitle = 1;
//       this.editModalVisible = true;
//     },
//     deleteData () {
//       // this.deleteModalVisible = true;
//       this.$Modal.confirm({
//         title: '提示',
//         content: '是否删除该条数据？',
//         onOk: () => {

//         },
//         onCancel: () => {

//         }
//       })
//     },
//     selectChange (val) {
//       this.selections = val
//     },
//     deleteAllHandle () {
//       this.$Modal.confirm({
//         title: '提示',
//         content: '是否删除所选数据？',
//         onOk: () => {

//         },
//         onCancel: () => {

//         }
//       })
//     }
//   }
// }
// </script>

// <style lang="less">
// .main-live-guidance-wrapper {
//   width: 100%;
//   height: inherit;
//   min-height: calc(~"100% - 80px");
//   display: flex;
//   .search-title-wrapper {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     .ivu-input-group {
//       top: 0;
//     }
//   }
//   .title-right-tool {
//     display: flex;
//     align-items: center;
//   }
//   .title {
//     padding-left: 8px;
//     position: relative;
//     font-weight: bold;
//     &::after {
//       content: "";
//       width: 3px;
//       height: 100%;
//       position: absolute;
//       left: 0;
//       top: 0;
//       background-color: #2d8cf0;
//     }
//   }
//   .ivu-btn-default {
//     color: #2d8cf0;
//     border-color: #2d8cf0;
//   }
//   .ivu-btn-error {
//     color: #ed4014;
//     border-color: #ed4014;
//     background-color: #fff;
//   }
//   .ivu-btn-error[disabled] {
//     color: #c5c8ce;
//     background-color: #f7f7f7;
//     border-color: #dcdee2;
//   }
// }
//
</style>
