<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           class="roomDictManage-edit-wrapper">
      <div class="modal-body">
        <Form ref="form"
              :model="formData"
              :label-width="110"
              :rules="ruleData"
              label-position="right">
          <FormItem label="序号"
                    v-if="title != 0">
            <Input v-model="formData.poSeq"
                   type="number"
                   size="small"></Input>
          </FormItem>
          <FormItem label="机构名称"
                    prop="orgName"
                    :rules="[{ required: true, message: '请输入机构名称', trigger: 'blur' }]">
            <Input v-model="formData.orgName"
                   disabled
                   size="small"></Input>
          </FormItem>
          <FormItem label="科室代码"
                    prop="poDeptCode">
            <Input v-model="formData.poDeptCode"
                   number
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
          <FormItem label="自定义码">
            <Input v-model="formData.poCustCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="体检类别"
                    prop="poDeptType"
                    :rules="[{ required: true, trigger: 'blur' }]">
            <!-- <Input v-model="formData.poDeptType" size="small"></Input> -->
            <RadioGroup v-model="formData.poDeptType">
              <Radio label="普通"></Radio>
              <Radio label="检查"></Radio>
              <Radio label="检验"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="his科室代码">
            <Input v-model="formData.poHisDeptCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="his科室名称">
            <Input v-model="formData.poHisDeptName"
                   size="small"></Input>
          </FormItem>
          <FormItem label="打印申请单"
                    prop="poIsPrtDeptRequest"
                    :rules="[{ required: true, message: '请选择是否打印申请单' ,trigger: 'blur' }]">
            <RadioGroup v-model="formData.poIsPrtDeptRequest">
              <Radio label='1'>打印</Radio>
              <Radio label="0">不打印</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="打印体检报告"
                    prop="poIsPrtReport"
                    :rules="[{ required: true, message: '请选择是否打印体检报告' ,trigger: 'blur' }]">
            <RadioGroup v-model="formData.poIsPrtReport">
              <Radio label='1'>打印</Radio>
              <Radio label="0">不打印</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="浏览图片"
                    prop="poIsViewPic"
                    :rules="[{ required: true, message: '请选择是否浏览图片' ,trigger: 'blur' }]">
            <RadioGroup v-model="formData.poIsViewPic">
              <Radio label="1">浏览</Radio>
              <Radio label="0">不浏览</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="启停状态"
                    prop="poStatus"
                    :rules="[{ required: true, message: '请选择启停状态' ,trigger: 'blur' }]">
            <RadioGroup v-model="formData.poStatus">
              <Radio label='1'>启用</Radio>
              <Radio label="0">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
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
import { dictDeptSave } from '@/api/dict_roomDictManage.js'
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
      this.$refs.form.validate(valid => {
        console.log(valid)
        if (valid) {
          console.log(123)
          this.isLoading = true
          dictDeptSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getRoomDict', true)
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
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    getItemList (row) {
      console.log(row)
      // console.log(Object.keys(row).length == 0)
      if (Object.keys(row).length == 0) {
        this.formData = {
          poStatus: '1',
          orgName: this.userInfo.orgName,
          poSeq: 1,
          poDeptType: '普通',
          poIsPrtDeptRequest: '0',
          poIsPrtReport: '0',
          poIsViewPic: '0'
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
  .modal-body {
    width: 370px;
    margin: 0 auto;
  }
}
</style>
