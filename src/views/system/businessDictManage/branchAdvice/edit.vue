<template>
  <div>
    <Modal v-model="isVisible"
           class="branch-advice-edit"
           @on-cancel="closeModal"
           :mask-closable="false"
           :title="showTitle">
      <div class="modal-body">
        <Form :model="formData"
              ref="form"
              :label-width="85"
              label-position="left">
          <FormItem label="序号"
                    v-if="title == 1">
            <Input v-model="formData.cdSort"
                   :disabled="title == 1"
                   size="small"></Input>
          </FormItem>
          <FormItem label="科室"
                    prop="deptName"
                    :rules="[{ required: true, message: '请选择科室', trigger: 'change' }]">
            <Select v-model="formData.deptName"
                    @on-change="selectChange">
              <Option v-for="item in deptList"
                      :value="item.value"
                      :key="item.label">{{item.value}}</Option>
            </Select>
          </FormItem>
          <FormItem label="科室建议"
                    prop="cdSuggestion"
                    :rules="[{ required: true, message: '请输入科室建议', trigger: 'blur' }]">
            <Input v-model="formData.cdSuggestion"
                   type="textarea"
                   :autosize="{minRows: 5,maxRows: 5}"
                   placeholder="请输入科室建议"></Input>
          </FormItem>
          <FormItem label="启用状态"
                    prop="cdStatus"
                    :rules="[{ required: true, message: '请选择启用状态', trigger: 'change' }]">
            <RadioGroup v-model="formData.cdStatus">
              <Radio label="1">启用</Radio>
              <Radio label="0">停用</Radio>
            </RadioGroup>
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
import { dictDeptSuggestSave } from '@/api/busdict_branchAdvice.js'
import { mapActions } from 'vuex'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      deptList: [], // 科室列表
      formData: {
        cdSort: '',
        cdDeptId: '',
        cdSuggestion: '',
        cdStatus: '',
        deptName: ''
      },
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增分科建议' : '编辑分科建议')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  created () {
  },
  mounted () {
    if (this.deptList.length == 0) {
      this.$store.dispatch('getRoomDict').then((res) => {
        this.$store.getters.getRoomDict.map(item => {
          this.deptList.push({
            value: item.poDeptName,
            label: item.poId
          })
        })
      })
    }
  },
  methods: {
    selectChange (val) {
      this.deptList.map(item => {
        if (item.value === val) {
          this.formData.cdDeptId = item.label
        }
      })
    },
    closeModal () {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    save () {
      // console.log(this.formData)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          console.log(this.formData)
          dictDeptSuggestSave(this.formData).then(({ data }) => {
            console.log(data)
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              // 更新分科建议vuex状态
              let params = {
                deptId: this.userInfo.userDeptId
              }
              let btn = true
              this.$store.dispatch('getSuggestDict', { params, btn })
              this.$emit('close')
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.isLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
      })
    },
    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          cdStatus: '1'
        }
      } else {
        this.formData = row
        console.log(this.formData)
      }
    }
  }
}
</script>

<style lang="less">
.branch-advice-edit {
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
}
</style>
