<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :closable="false"
           class="unit-info-popup-wrapper"
           width="810">
      <p slot="header">
        <span class="title">{{showTitle}}</span>
      </p>
      <div class="modal-body">
        <div class="form-wrapper">
          <Form :model="formData"
                :label-width="80"
                ref="form"
                label-position="right">
            <Row type="flex"
                 justify="space-between">
              <FormItem label="单位编码">
                <Input v-model="formData.boCode"
                       size="small"></Input>
              </FormItem>
              <FormItem label="单位简称"
                        prop="boAbbreviation"
                        :rules="[{ required: true, message: '请输入单位简称', trigger: 'blur' },
                        { type: 'string', max: 4, message: '单位简称不能超过4个字符', trigger: 'blur' }]">
                <Input v-model="formData.boAbbreviation"
                       size="small"></Input>
              </FormItem>
              <FormItem label="单位类别"
                        prop="boUnitTypeId"
                        :rules="[{ required: true, message: '请选择单位类别', trigger: 'change' }]">
                <Select v-model="formData.boUnitTypeId"
                        :label-in-value="true"
                        filterable
                        @on-change="unitTypeChange"
                        size="small">
                  <Option v-for="item in unitTypeDict"
                          :value="item.sdId"
                          :key="item.sdId"
                          :label="item.sdName">
                    <span slot>{{item.sdName}}</span>
                  </Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex"
                 justify="space-between">
              <FormItem label="单位名称"
                        prop="boName"
                        style="width: calc(100% - 110px);"
                        :rules="[{ required: true, message: '请输入单位名称', trigger: 'blur' }]">
                <Input v-model="formData.boName"
                       @on-change="searchCode"
                       @on-blur="isUnitRepeat"
                       size="small"></Input>
              </FormItem>
              <div class="repeat-unit-validator-wrapper">
                <span v-show="unitRepeatBtn && title == 0">该单位已存在</span>
              </div>
            </Row>
            <Row type="flex"
                 justify="space-between">
              <FormItem label="自定义码">
                <Input v-model="formData.boCustCode"
                       size="small"></Input>
              </FormItem>
              <FormItem label="拼音码"
                        prop="boPyCode"
                        :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
                <Input v-model="formData.boPyCode"
                       size="small"></Input>
              </FormItem>
              <FormItem label="五笔码"
                        prop="boWbCode"
                        :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
                <Input v-model="formData.boWbCode"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex"
                 justify="space-between">
              <FormItem label="体检性质">
                <Select v-model="formData.boPeType"
                        style="min-width: 162px;"
                        size="small">
                  <Option value="在院"
                          :key="1"
                          label="在院">
                    <span slot>在院</span>
                  </Option>
                  <Option value="外出"
                          :key="2"
                          label="外出">
                    <span slot>外出</span>
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="体检类型"
                        prop="boCategoryId"
                        :rules="[{ required: true, message: '请选择体检类别', trigger: 'change' }]">
                <Select v-model="formData.boCategoryId"
                        :label-in-value="true"
                        filterable
                        @on-change="examTypeChange"
                        size="small">
                  <Option v-for="item in categoryDict"
                          :value="item.cdId"
                          :key="item.cdId"
                          :label="item.cdName">
                    <span slot>{{item.cdName}}</span>
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="优先级"
                        prop="boPriorityId"
                        :rules="[{ required: true, message: '请选择优先级', trigger: 'change' }]">
                <Select v-model="formData.boPriorityId"
                        :label-in-value="true"
                        filterable
                        @on-change="priorityChange"
                        size="small">
                  <Option v-for="item in priorityDict"
                          :value="item.cdId"
                          :key="item.cdId"
                          :label="item.cdName">
                    <span slot>{{item.cdName}}</span>
                  </Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="费别"
                        prop="boChargeTypeId"
                        :rules="[{ required: true, message: '请选择费别', trigger: 'change' }]">
                <Select v-model="formData.boChargeTypeId"
                        :label-in-value="true"
                        filterable
                        @on-change="chargeTypeChange"
                        size="small">
                  <Option v-for="item in chargeTypeDict"
                          :value="item.cdId"
                          :key="item.cdId"
                          :label="item.cdName">
                    <span slot>{{item.cdName}}</span>
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="人员来源">
                <Select v-model="formData.boSourceId"
                        style="min-width: 180px;"
                        @on-change="unitSourcChange"
                        :label-in-value="true"
                        filterable
                        size="small">
                  <!-- <Option value="外来"
                          :key="1"
                          label="门诊">
                    <span slot>门诊</span>
                  </Option>
                  <Option value="外来"
                          :key="2"
                          label="住院">
                    <span slot>住院</span>
                  </Option>
                  <Option value="外来"
                          :key="3"
                          label="外来">
                    <span slot>外来</span>
                  </Option> -->
                  <Option v-for="item in personSourceDict"
                          :value="item.cdId"
                          :key="item.cdId"
                          :label="item.cdName">
                    <span slot>{{item.cdName}}</span>
                  </Option>
                </Select>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="联系人">
                <Input v-model="formData.boContact"
                       size="small"></Input>
              </FormItem>
              <FormItem label="联系电话">
                <Input v-model="formData.boPhone"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="单位地址"
                        style="width: 100%">
                <Input v-model="formData.boAddress"
                       size="small"></Input>
              </FormItem>
            </Row>
            <Row type="flex">
              <FormItem label="启用状态">
                <RadioGroup v-model="formData.boStatus"
                            type="button">
                  <Radio label="0">启用</Radio>
                  <Radio label="1">停用</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
          </Form>
        </div>
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
import { UnitSave, unitRepeat } from '@/api/appointmentUnitManage.js'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {},
      isLoading: false,
      unitRepeatBtn: false
    }
  },
  computed: {
    showTitle () {
      return this.title == 0 ? '新增单位基本信息' : '修改单位基本信息'
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    unitTypeDict: {
      get: function () {
        return this.$store.getters.getUnitTypeDict
      },
      set: function () { }
    },
    categoryDict: {
      get: function () {
        return this.$store.getters.getCategoryDict
      },
      set: function () { }
    },
    priorityDict: {
      get: function () {
        return this.$store.getters.getPriorityDict
      },
      set: function () { }
    },
    chargeTypeDict: {
      get: function () {
        return this.$store.getters.getChargeTypeDict
      },
      set: function () { }
    },
    personSourceDict: {
      get: function () {
        return this.$store.getters.getPersonSourceDict
      },
      set: function () { }
    }
  },

  mounted () {
    this.$store.dispatch('getUnitTypeDict')
    this.$store.dispatch('getCategoryDict')
    this.$store.dispatch('getPriorityDict')
    this.$store.dispatch('getChargeTypeDict')
    this.$store.dispatch('getPersonSourceDict')
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.selectedComboData = []
      this.comboTableData = []
      this.unitRepeatBtn = false
      this.$emit('close')
    },
    save () {
      this.$refs.form.validate(valid => {
        console.log(this.formData)
        if (valid) {
          this.isLoading = true
          UnitSave(this.formData)
            .then(({ data }) => {
              this.isLoading = false
              if (data.code == 0) {
                this.$Message.success('保存成功！')
                this.$emit('updateList')
                this.$emit('close')
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.isLoading = false
              this.$Message.error('网络不稳定，请稍后重试')
            })
        }
      })
    },
    isUnitRepeat () {
      let params = {
        name: this.formData.boName
      }

      unitRepeat(params).then(({ data }) => {
        if (data.code == 0) {
          data.data ? this.unitRepeatBtn = true : this.unitRepeatBtn = false
        }
      })
    },

    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          boStatus: '0'
        }
      } else {
        this.formData = row
      }
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.boName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'boPyCode', result.py)
          this.$set(this.formData, 'boWbCode', result.wb)
        }
      })
    },
    examTypeChange (obj) {
      if (obj) {
        this.formData.boCategory = obj.label
      }
    },
    unitTypeChange (obj) {
      if (obj) {
        this.formData.boUnitType = obj.label
      }
    },
    priorityChange (obj) {
      if (obj) {
        this.formData.boPriority = obj.label
      }
    },
    chargeTypeChange (obj) {
      if (obj) {
        this.formData.boChargeType = obj.label
      }
    },
    unitSourcChange (obj) {
      if (obj) {
        this.formData.boSource = obj.label
      }
    }
  }
}
</script>
<style lang="less">
.unit-info-popup-wrapper {
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
  .repeat-unit-validator-wrapper {
    width: 100px;
    height: 32px;
    line-height: 32px;
    color: #ed4014;
    font-size: 12px;
  }
  .modal-body {
    width: 100%;
    margin: 0 auto;
    display: flex;
    .form-wrapper {
      width: 780px;
      padding-right: 10px;
      .ivu-form-item {
        width: 33.33%;
      }
    }
    .unselected-item-wrapper {
      margin-left: 10px;
      border-left: 1px solid #e5e5e5;
      padding-left: 10px;
      flex: 1;
      .title-wrapper {
        padding: 12px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .main-wrapper {
        width: 100%;
        .ivu-btn-default {
          color: #2d8cf0;
          border-color: #2d8cf0;
        }
        .ivu-btn[disabled] {
          color: #c5c8ce;
          background-color: #f7f7f7;
          border-color: #dcdee2;
        }
      }
      .room-selected-wrapper {
        width: 200px;
        .room-list-wrapper {
          margin-top: 15px;
          max-height: 500px;
          overflow-y: auto;
          li {
            padding-left: 10px;
            height: 32px;
            line-height: 32px;
            &:hover {
              color: #57a3f3;
              cursor: pointer;
            }
          }
          li.is-actived {
            color: #2d8cf0;
            background-color: #f0faff;
          }
        }
        ul::-webkit-scrollbar {
          width: 5px;
          background-color: #eee;
        }
        ul::-webkit-scrollbar-button {
          display: none;
        }
        ul::-webkit-scrollbar-corner {
          display: none;
        }
        ul::-webkit-scrollbar-thumb {
          border-radius: 5px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #e8e8e8;
        }
      }
    }
  }
}
</style>
