<template>
  <div class="limit-popup-wrapper">
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           width="680"
           title="权限配置">
      <div class="modal-body"
           style="width: 100%; padding: 0 30px">
        <tree-table ref="treeTable"
                    :columns="columns"
                    :data="treeData"
                    :expand-type="false"
                    :selectable="true"
                    @checkbox-click="selectionHandle"
                    :empty-text="emptyText"
                    border
                    expand-key="poName">
          <template slot="poName"
                    slot-scope="{row}">
            <span>{{row.poName}}</span>
          </template>
          <template slot="selfMenuAuthority"
                    slot-scope="{row}">
            <CheckboxGroup v-model="row.selfMenuAuthority">
              <Checkbox :label="item.poType"
                        :key="index"
                        v-for="(item, index) in row.listMenuAuthority">
                <span v-if="item.poType == 'list'">查询</span>
                <span v-else-if="item.poType == 'add'">添加</span>
                <span v-else-if="item.poType == 'edit'">修改</span>
                <span v-else-if="item.poType == 'del'">删除</span>
                <span v-else-if="item.poType == 'approve'">审批</span>
                <span v-else-if="item.poType == 'leadingIn'">导入</span>
                <span v-else-if="item.poType == 'leadingOut'">导出</span>
                <span v-else-if="item.poType == 'print'">打印</span>
                <span v-else>显示</span>
              </Checkbox>
            </CheckboxGroup>
          </template>
        </tree-table>
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
import { getLimitMenuList, editAccountLimit } from '@/api/system_accountInfo.js'
export default {
  props: {
    visible: Boolean
  },
  data () {
    return {
      columns: [
        {
          title: '导航名称',
          key: 'poName',
          type: 'template',
          template: 'poName',
          width: 240,
          align: 'left'
        },
        {
          title: '权限分配',
          key: 'selfMenuAuthority',
          type: 'template',
          width: 220,
          template: 'selfMenuAuthority',
          align: 'left'
        }
      ],
      limitList: [],
      treeData: [],
      emptyText: '数据加载中',
      saveData: [],
      accountId: '',
      isLoading: false
    }
  },
  computed: {
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
      this.treeData = []
      this.$emit('close')
    },
    save () {
      this.saveData = []
      let params = {}
      params.poStaffId = this.accountId
      this.formatSaveData(this.$refs.treeTable.bodyData)
      params.listData = this.formatSaveData(this.$refs.treeTable.bodyData)
      // console.log(JSON.stringify(params))
      this.isLoading = true
      editAccountLimit(params).then(({ data }) => {
        this.isLoading = false
        // console.log(data)
        if (data.code == 0) {
          this.$emit('close')
          this.$Message.success('保存成功，配置账号重新登录后生效')
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    getLimitMenu (row) {
      this.accountId = row.poId
      let params = {
        poStaffId: row.poId
      }
      getLimitMenuList(params).then(({ data }) => {
        this.emptyText = '暂无数据'
        if (data.code == 0) {
          let res = data.data
          this.limitList = res
          this.treeData = this.formatData(res)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },

    // 局部全选功能
    selectionHandle (row, rowIndex, $event) {
      let arr = this.selectFormat(row)
      let isChecked = row._isChecked
      if (isChecked) {
        arr.forEach(item => {
          for (let i = 0; i < this.$refs.treeTable.bodyData.length; i++) {
            if (this.$refs.treeTable.bodyData[i].poId == item.poId) {
              let selectAuthority = []
              this.$refs.treeTable.bodyData[i].listMenuAuthority.forEach(ele => {
                selectAuthority.push(ele.poType)
              })
              this.$set(this.$refs.treeTable.bodyData[i], 'selfMenuAuthority', selectAuthority)
              break
            }
          }
        })
      } else {
        arr.forEach(item => {
          for (let i = 0; i < this.$refs.treeTable.bodyData.length; i++) {
            if (this.$refs.treeTable.bodyData[i].poId == item.poId) {
              this.$set(this.$refs.treeTable.bodyData[i], 'selfMenuAuthority', [])
              break
            }
          }
        })
      }
    },
    checkGroupChange (val, row) {
      console.log(val)
      console.log(row)
    },
    // 格式化保存权限数据
    formatSaveData (arr) {
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        let obj = {}
        if (arr[i].selfMenuAuthority && arr[i].selfMenuAuthority.length > 0) {
          obj.poMenuId = arr[i].poId
          obj.poName = arr[i].poName
          let authorityArr = []
          arr[i].listMenuAuthority.forEach(item => {
            let btn = arr[i].selfMenuAuthority.some((ele) => {
              return ele == item.poType
            })
            if (btn) {
              authorityArr.push(item)
              obj.selfMenuAuthority = authorityArr
            }
          })
          newArr.push(obj)
        }
      }
      return newArr
    },

    // 格式化树数据
    formatData (arr) {
      let new_arr = []
      arr.forEach(item => {
        let obj = {}
        obj.poId = item.poId
        obj.poName = item.poName
        if (item.selfMenuAuthority && item.selfMenuAuthority.length > 0) {
          let self_arr = []
          item.selfMenuAuthority.forEach(ele => {
            self_arr.push(ele.poType)
          })
          obj.selfMenuAuthority = self_arr
        }
        obj.listMenuAuthority = item.listMenuAuthority
        if (item.children && item.children.length > 0) {
          obj.children = this.formatData(item.children)
        }
        new_arr.push(obj)
      })
      return new_arr
    },

    // 局部选中数据处理
    selectFormat (obj) {
      let temp = []
      temp.push(obj)
      if (obj.children && obj.children.length > 0) {
        for (let i = 0; i < obj.children.length; i++) {
          let arr = this.selectFormat(obj.children[i])
          temp = temp.concat(arr)
        }
      }
      return temp
    }
  }
}
</script>
<style lang="less">
.limit-popup-wrapper {
}
</style>
