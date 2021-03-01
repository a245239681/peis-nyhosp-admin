<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="roomDictManage-edit-wrapper">
      <div class="modal-body">
        <Form ref="forms"
              :model="formData"
              :label-width="110"
              :rules="ruleData"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.poSeq"
                   type="number"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="机构名称"
                    prop="poOrgName"
                    :rules="[{ required: true, message: '请输入机构名称', trigger: 'blur' }]">
            <Input v-model="formData.poOrgName"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="科室代码"
                    v-if="title != 0"
                    prop="poDeptCode">
            <Input v-model="formData.poDeptCode"
                   number
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="科室名称"
                    prop="poDeptName"
                    :rules="[{ required: true, message: '请输入科室名称', trigger: 'blur' }]">
            <Input v-model="formData.poDeptName"
                   @on-change="searchCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="拼音码"
                    prop="poPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
            <Input v-model="formData.poPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="poWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.poWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="启停状态"
                    prop="poStatus"
                    :rules="[{ required: true, message: '请选择启停状态' ,trigger: 'blur' }]">
            <RadioGroup v-model="formData.poStatus">
              <Radio label='0'>启用</Radio>
              <Radio label="1">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="closeModal()">取消</Button>
        <Button type="primary"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { funcDeptSave } from '@/api/dict_funcRoomManage.js'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    // 同时对字段进行类型和必填验证时，只能使用validator
    const validateDeptCode = (rule, value, callback) => {
      let regNum = /^.{1,5}$/
      if (value === '') {
        callback(new Error('请输入科室代码'))
      } else if (!Number.isInteger(+value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      ruleData: {
        poDeptCode: [
          { required: true, validator: validateDeptCode, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showTitle () {
      return this.title == 0 ? '新增' : '编辑'
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    userInfo: {
      get: function () {
        return this.$store.getters.getUserInfo
      },
      set: function () { }
    }
  },
  created () { },
  methods: {
    save () {
      this.$refs.forms.validate(valid => {
        console.log(valid)
        if (valid) {
          console.log(123)
          this.isLoading = true
          funcDeptSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getFuncRoomDict', true)
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
    closeModal () {
      this.formData = {}
      this.$emit('close')
    },
    getItemList (row) {
      console.log(row)
      // console.log(Object.keys(row).length == 0)
      if (Object.keys(row).length == 0) {
        this.formData = {
          poStatus: '0',
          poOrgName: this.userInfo.orgName,
          poSeq: 1
        }
      } else {
        this.formData = row
      }
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.poDeptName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'poPyCode', result.py)
          this.$set(this.formData, 'poWbCode', result.wb)
        }
      })
    }
  }
}
</script>
<style lang="less">
.roomDictManage-edit-wrapper {
  .ivu-input[disabled] {
    color: #252525;
  }
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
