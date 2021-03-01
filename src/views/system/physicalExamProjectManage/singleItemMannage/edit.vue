<template>
  <div class='singleitem-edit'>
    <Modal v-model="isVisible"
           :mask-closable='false'
           @on-cancel="closeModal"
           :title="showTitle"
           class="single-item-manage-edit">
      <div class="modal-body"
           style='margin:0 auto;width:580px'>
        <Form :model="formData"
              :label-width="90"
              ref="form"
              label-position="right"
              inline>
          <FormItem label="序号"
                    prop='paSort'
                    :rules="[{ required: true,type:'number', message: '请输入数字' }]">
            <Input v-model="formData.paSort"
                   number
                   size="small"></Input>
          </FormItem>
          <FormItem label="项目名称"
                    prop="paItemName"
                    :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]">
            <Input v-model="formData.paItemName"
                   @on-change="searchCode"
                   size="small"></Input>
            <!-- <Select v-model="formData.name"
                    size="small">
              <Option value="xxk">心胸科</Option>
              <Option value="ek">儿科</Option>
              <Option value="fk">妇科</Option>
            </Select> -->
          </FormItem>
          <FormItem label="项目编码">
            <Input v-model="formData.paItemCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="his收费名称">
            <Input v-model="formData.hisName"
                   size="small"></Input>
          </FormItem>
          <FormItem label="his编码">
            <Input v-model="formData.hisCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="拼音码"
                    prop="paPyCode"
                    :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
            <Input v-model="formData.paPyCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="五笔码"
                    prop="paWbCode"
                    :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
            <Input v-model="formData.paWbCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="检查科室"
                    prop='paDeptId'
                    :rules="[{ required: true, message: '请输入科室', trigger: 'change' }]">
            <Select style="width:186px"
                    v-model="formData.paDeptId"
                    size="small"
                    :label-in-value="true"
                    @on-change="select">
              <Option v-for='(item,index) of ksDate'
                      :key='index'
                      :value="item.poId">{{item.poDeptName}}</Option>
            </Select>
            <!-- <Input v-model="formData.paDeptName,ksDate"
                   size="small"></Input> -->
          </FormItem>
          <FormItem label="性别范围"
                    prop="paSex"
                    :rules="[{ required: true, message: '请输入性别', trigger: 'change' }]">
            <Select v-model="formData.paSex"
                    style="width:186px"
                    size="small">
              <Option value='不限'>不限</Option>
              <Option value='男'>男</Option>
              <Option value='女'>女</Option>
            </Select>
          </FormItem>
          <FormItem label="结果单位">
            <Input v-model="formData.paUnit"
                   size="small"></Input>
          </FormItem>
          <FormItem label="项目单价"
                    prop='paPrice'
                    :rules="[{ required: true, type: 'number', message: '请输入数字类型单价', trigger: 'blur' }]">
            <Input v-model="formData.paPrice"
                   :number='true'
                   size="small"></Input>
          </FormItem>
          <FormItem label="正常结果">
            <Input v-model="formData.paRecord"
                   size="small"></Input>
          </FormItem>
          <FormItem label="费用类型"
                    prop="paFeeTypeId">
            <Select v-model="formData.paFeeTypeId"
                    :label-in-value="true"
                    style="width:186px"
                    filterable
                    clearable
                    size="small">
              <Option v-for="item in expenseTypeDict"
                      :value="item.paId"
                      :key="item.paId"
                      :label="item.paName">
                <span slot>{{item.paName}}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem label="结果类型">
            <RadioGroup v-model="formData.paRecordType"
                        style="width:186px">
              <Radio label="0">字符</Radio>
              <Radio label="1">数字</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="最小极限值">
            <Input v-model="formData.paRecordMin"
                   size="small"></Input>
          </FormItem>
          <FormItem label="最大极限值">
            <Input v-model="formData.paRecordMax"
                   size="small"></Input>
          </FormItem>
          <FormItem label="标本代码"
                    prop='paSpecimanId'>
            <Select v-model="formData.paSpecimanId"
                    style="width:186px"
                    clearable
                    @on-change="specimanChange"
                    size="small">
              <Option v-for='(item,index) of TjDict'
                      :key='index'
                      :value="item.paId">{{item.paSpecimanName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="规格">
            <Input v-model="formData.paSpecification"
                   size="small"></Input>
          </FormItem>
          <FormItem label="医保类型"
                    prop='paSpecimanId'>
            <Select v-model="formData.paMedicalName"
                    style="width:186px"
                    clearable
                    @on-change="mediacallChange"
                    size="small">
              <Option v-for='(item,index) of MedicallDict'
                      :key='index'
                      :value="item.paMedicalName">{{item.paMedicalName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="收费编码">
            <Input v-model="formData.paChargingCode"
                   size="small"></Input>
          </FormItem>
          <FormItem label="标准价格">
            <Input v-model="formData.paStandardPrice"
                   size="small"></Input>
          </FormItem>
          <FormItem label="产品类型">
            <RadioGroup v-model="formData.paProductType"
                        style="width:186px">
              <Radio label="0">国产</Radio>
              <Radio label="1">进口</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="生产厂家">
            <Input v-model="formData.paManufacturer"
                   size="small"></Input>
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
import { save, sortByDeptId } from '@/api/singleItemMannage.js'
import { debuglog } from 'util'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      isLoading: false
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '新增项目' : '修改项目')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    TjDict: {
      get: function () {
        return this.$store.getters.getSpeciman
      },
      set: function () { }
    },
    MedicallDict: {
      get: function () {
        console.log(this.$store.getters.getMedicalInsuranceDict)
        return this.$store.getters.getMedicalInsuranceDict
      },
      set: function () { }
    },
    expenseTypeDict: {
      get: function () {
        return this.$store.getters.getExpenseTypeDict
      },
      set: function () { }
    },
    ksDate: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    }
  },
  created () {
    this.userInfo = this.$store.getters.getUserInfo
    this.$store.dispatch('getMedicalInsuranceDict')
    this.$store.dispatch('getExpenseTypeDict', true)
    this.$store.dispatch('getSpecimanDict')
    this.$store.dispatch('getRoomDict')
  },
  mounted () {

  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.$emit('close')
    },
    select (value) {
      console.log(this.showTitle)
      if (value) {
        this.formData.paDeptId = value.value
        this.formData.paDeptName = value.label
      }
      if (this.showTitle == '新增项目' && value) {
        sortByDeptId({ deptId: value.value }).then(({ data }) => {
          if (data.code == 0) {
            console.log(data)
            this.$set(this.formData, 'paSort', data.data.sort)
          } else {
            this.$Message.error(data.message)
          }
        }).catch(err => {
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          save(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.closeModal()
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
          paSort: '',
          paRecordType: '0',
          paProductType: '0'
        }
      } else {
        this.formData = row
      }
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.paItemName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'paPyCode', result.py)
          this.$set(this.formData, 'paWbCode', result.wb)
        }
      })
    },
    specimanChange (obj) {
      if (!obj) {
        this.$set(this.formData, 'paSpecimanId', '')
      }
    },
    mediacallChange (obj) {
      if (!obj) {
        this.$set(this.formData, 'paMedicalName', '')
      }
    }
  }
}
</script>

<style lang="less">
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
.single-item-manage-edit {
  .ivu-modal-wrap {
    .ivu-modal {
      width: 720px !important;
    }
  }
  .modal-body {
    .ivu-input-small {
      width: 186px !important;
    }
  }
}
</style>
<style lang='less' scoped>
.modal-body {
  width: 370px;
  margin: 0 auto;
}
</style>
