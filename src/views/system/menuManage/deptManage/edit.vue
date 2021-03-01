<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="deptManage-edit-wrapper">
      <div class="modal-body">
        <tree-table ref="treeTable"
                    :columns="columns"
                    :data="treeData"
                    :expand-type="false"
                    :selectable="false"
                    border
                    expand-key="name">
          <template slot="name"
                    slot-scope="{row}">
            <span>{{row.name}}</span>
          </template>
          <template slot="authority"
                    slot-scope="{row}">
            <CheckboxGroup @on-change='change'
                           v-model="row.authority">
              <Checkbox label="check">
                <span>查询</span>
              </Checkbox>
              <Checkbox label="add">
                <span>添加</span>
              </Checkbox>
              <Checkbox label="edit">
                <span>修改</span>
              </Checkbox>
              <Checkbox label="delete">
                <span>删除</span>
              </Checkbox>
              <Checkbox label="approve">
                <span>审批</span>
              </Checkbox>
              <Checkbox label="leadingIn">
                <span>导入</span>
              </Checkbox>
              <Checkbox label="leadingOut">
                <span>导出</span>
              </Checkbox>
            </CheckboxGroup>
          </template>
        </tree-table>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    visible: Boolean
  },
  data () {
    return {
      columns: [
        {
          title: '导航名称',
          key: 'name',
          type: 'template',
          template: 'name',
          width: 140,
          align: 'left'
        },
        {
          title: '权限分配',
          key: 'authority',
          type: 'template',
          template: 'authority',
          align: 'left'
        }
      ],
      treeData: [
        {
          name: '首页',
          authority: ['check', 'delete']
        },

        {
          name: '一级菜单',
          authority: ['check'],
          children: [
            {
              name: '二级菜单',
              authority: ['check', 'delete', 'add', 'edit']
            }
          ]
        }
      ]
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增' : '编辑')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    }
  },
  created () {
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    save () {
      this.$emit('close')
    },
    change (a) {
      console.log(a)
    }
  }
}
</script>
<style lang="less">
.deptManage-edit-wrapper{
  .modal-body {
    width: 100%;
    margin: 0 auto;
  }
}
</style>
