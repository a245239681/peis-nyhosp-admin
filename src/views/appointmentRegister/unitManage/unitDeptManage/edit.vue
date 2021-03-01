<template>
  <div>
    <Modal v-model="isVisible"
           @on-cancel="closeModal"
           class="unit-dept-manage-edit"
           :styles="{top: '150px'}"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="85"
              label-position="left">
          <FormItem label="姓名">
            <Input v-model="formData.boName"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="单位名称">
            <Input v-model="formData.boUnitName"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="部门">
            <Cascader :data="deptList"
                      v-model="selectValue"
                      change-on-select
                      @on-change="handleChange"></Cascader>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { unitDeptUpdate } from '@/api/unitManage_unitDeptManage.js'
export default {
  props: {
    title: Number,
    visible: Boolean,
    data: Array
  },
  data () {
    return {
      formData: {
      },
      isLoading: false,
      doctorLoading: false,
      selectValue: []
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '添加部门人员信息' : '编辑部门人员信息')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    deptList: {
      get: function () {
        return this.data
      },
      set: function () { }
    }

  },
  mounted () {

  },
  methods: {
    handleChange (value, selectedData) {
      console.log(selectedData)
      // selectedData[0]是父级部门的相关信息
      // selectedData[1]是子部门的相关信息
      // console.log(selectedData)
      // this.formData.selectValue = value
      if (selectedData.length == 2) {
        // 即选择了父级部门，又选择了子级部门
        this.formData.boDeptName = selectedData[1].deptName
        this.formData.boId = selectedData[1].deptId
        this.formData.boParentId = selectedData[1].parentId
        this.formData.boParentName = selectedData[1].parentName
        // console.log(this.formData)
      } else if (selectedData.length == 1) {
        // 只选择了父级
        this.formData.boDeptName = ''
        this.formData.boId = ''
        this.formData.boParentId = selectedData[0].deptId
        this.formData.boParentName = selectedData[0].name
      } else {
        // 什么都没有选
        this.formData.boDeptName = ''
        this.formData.boId = ''
        this.formData.boParentId = 0
        this.formData.boParentName = ''

      }
    },

    closeModal () {
      this.$emit('close')
    },
    async save () {
      // console.log(this.formData)
      console.log('save')
      console.log(this.formData)
      let { data } = await unitDeptUpdate(this.formData)
      console.log(data)
      if (data.code == 0) {
        this.$Message.success(data.message);
        this.$emit('close')
        this.$emit('updateList')
        this.formData = {}
        this.selectValue = []
      } else {
        this.$Message.error(data.message);
      }

    },
    getItemList (row) {
      console.log(row)
      if (Object.keys(row).length == 0) {
        this.formData = {}
      } else {
        // 修改
        this.formData = {
          boPeId: row.boPeId,
          boName: row.boName,
          boUnitId: row.boUnitId,
          boUnitName: row.boUnitName,
          boUnitVisitSn: row.boUnitVisitSn,
          boDeptName: row.boSubDepartmentName,
          boId: row.boSubDepartmentId,
          boParentId: row.boDepartmentId,
          boParentName: row.boDepartment
        }
        if (row.boDepartmentId == '0') {
          row.boDepartmentId = Number(row.boDepartmentId)
        }
        let parentDeptId = row.boDepartmentId
        let subDeptId = row.boSubDepartmentId
        // console.log(this.deptList)
        // 父级部门和子部门都为null的时候
        // console.log('1', !row.boDepartmentId && !row.boSubDepartmentId)
        if (!row.boDepartmentId && !row.boSubDepartmentId) {
          this.selectValue = []
          return
        }
        // 父级部门不为空，子部门为null的时候
        // console.log('2', row.boDepartmentId && !row.boSubDepartmentId)
        if (row.boDepartmentId && !row.boSubDepartmentId) {
          console.log('父级部门不为空，子部门为null的时候')
          let arr = this.deptList.filter(item => item.deptId == parentDeptId)
          console.log(this.deptList)
          this.selectValue = [arr[0].value]
          return
        }

        // 父级部门和子部门都不为null的时候
        if (row.boDepartmentId && row.boSubDepartmentId) {
          if (this.deptList.length > 0) {
            let arr = this.deptList.filter(item => item.deptId == parentDeptId)
            // console.log(arr[0].children.length>0)
            console.log(arr)
            if (arr[0].children && arr[0].children.length > 0) {
              arr[0].children.forEach(v => {
                console.log(v)
                // console.log(v.deptName)
                // console.log(subDeptName)
                if (v.deptId == subDeptId) {
                  // 判断v.__value是字符串还是数组，浏览器版本不同返回的v.__value不同
                  if ((typeof v.__value == 'string') && v.__value.constructor == String) {
                    this.selectValue = v.__value.split(",")
                  } else {
                    this.selectValue = v.__value
                  }
                } else {
                  this.selectValue = [v.parentId]
                }
              })
            }

          } else {
            return
          }
        }

        // console.log(this.selectValue)
      }
    }
  }
}
</script>

<style lang="less">
.unit-dept-manage-edit {
  .ivu-modal-header-inner {
    position: relative;
    padding-left: 8px;
    font-weight: bold;
    &::before {
      content: '';
      width: 3px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: #2d8cf0;
    }
  }
  .ivu-form-item {
    margin-bottom: 24px;
  }
  .ivu-cascader-menu-item {
    font-size: 15px !important;
  }
}
</style>

