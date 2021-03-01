// <template>
  // <div class="main-live-guidance-edit">
    // <Modal v-model="isVisible" //
           @on-cancel="closeModal" //
           :title="showTitle" //
           draggable>
      // <div class="modal-body">
        // <Form :model="formData" //
              :label-width="85" //
              label-position="left">
          // <FormItem label="科室编号">
            // <Input disabled //
                   v-model="formData.number" //
                   size="small"></Input>
            // </FormItem>
          // <FormItem label="科室名称">
            // <Input v-model="formData.name" //
                   size="small"></Input>
            //
            <!-- <Select v-model="formData.name"
//                     size="small">
//               <Option value="xxk">心胸科</Option>
//               <Option value="ek">儿科</Option>
//               <Option value="fk">妇科</Option>
//             </Select> -->
            // </FormItem>
          // <FormItem label="显示顺序">
            // <Input v-model="formData.sort" //
                   size="small"></Input>
            // </FormItem>
          // <FormItem label="科室类型">
            // <Select v-model="formData.type" //
                    size="small">
              // <Option value="xxk">心胸科</Option>
              // <Option value="ek">儿科</Option>
              // <Option value="fk">妇科</Option>
              // </Select>
            // </FormItem>
          // <FormItem label="科室汇总">
            // <Select v-model="formData.total" //
                    size="small">
              // <Option value="xxk">心胸科</Option>
              // <Option value="ek">儿科</Option>
              // <Option value="fk">妇科</Option>
              // </Select>
            // </FormItem>
          // <FormItem label="导诊顺序">
            // <Select v-model="formData.GuidanSort" //
                    size="small">
              // <Option value="xxk">1</Option>
              // </Select>
            // </FormItem>
          // <FormItem label="录入体检结果是一个项目是否会出现多个诊断:" //
                    :label-width="270">
            // <template>
              // <Select v-model="formData.show" //
                      style='width:100px'>
                // <Option value="xxk">显示</Option>
                // <Option value="xxk">不显示</Option>
                // </Select>
              // </template>
            // </FormItem>
          // <FormItem label="备注信息">
            // <Input v-model="formData.message" //
                   type="textarea" //
                   :autosize="{minRows: 5,maxRows: 5}"></Input>
            // </FormItem>
          // </Form>

        // </div>
      // <div slot="footer">
        // <Button @click="closeModal">取消</Button>
        // <Button type="primary" //
                @click="save">保存</Button>
        // </div>
      // </Modal>
    // </div>
  // </template>

<script>
// export default {
//   props: {
//     title: Number,
//     visible: Boolean
//   },
//   data () {
//     return {
//       formData: {
//         number: '',
//         name: '',
//         sort: '',
//         type: '',
//         total: '',
//         GuidanSort: '',
//         show: '',
//         message: '',
//       }
//     }
//   },
//   computed: {
//     showTitle () {
//       return (this.title == 0 ? '新增科室' : '修改科室');
//     },
//     isVisible: {
//       get: function () {
//         return this.visible;
//       },
//       set: function () {

//       }
//     }
//   },
//   created () {
//   },
//   methods: {
//     closeModal () {
//       this.$emit('close');
//     },
//     save () {
//       this.$emit('close')
//     }
//   }
// }
// </script>

// <style lang="less">
// .ivu-modal-header-inner {
//   position: relative;
//   padding-left: 8px;
//   font-weight: bold;
//   &::before {
//     content: "";
//     width: 3px;
//     height: 100%;
//     position: absolute;
//     left: 0;
//     top: 0;
//     background-color: #2d8cf0;
//   }
// }
// .ivu-form-item {
//   margin-bottom: 12px;
// }
//
</style>
