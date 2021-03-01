<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :closable="false"
           class="speciman-popup-wrapper"
           width="1200">
      <p slot="header">
        <span class="title">{{showTitle}}</span>
      </p>
      <div class="modal-body">
        <div class="form-wrapper">
          <Form :model="formData"
                :label-width="80"
                ref="form"
                :rules="rules"
                label-position="right">
            <FormItem label="编号"
                      v-if="title != 0">
              <Input v-model="formData.paCode"
                     type="number"
                     disabled
                     size="small"></Input>
            </FormItem>
            <FormItem label="试管名称"
                      prop="paName">
              <Input v-model="formData.paName"
                     size="small"></Input>
            </FormItem>
            <FormItem label="试管颜色">
              <Input v-model="formData.paColor"
                     size="small"></Input>
            </FormItem>
            <FormItem label="试管规格">
              <Input v-model="formData.paSpecification"
                     size="small"></Input>
            </FormItem>
            <FormItem label="检查类型"
                      prop="paExamTypeId">
              <Select v-model="formData.paExamTypeId"
                      :label-in-value="true"
                      filterable
                      @on-change="examTypeChange"
                      size="small">
                <Option v-for="item in examDict"
                        :value="item.paId"
                        :key="item.paId"
                        :label="item.paTypeName">
                  <span slot>{{item.paTypeName}}</span></Option>
              </Select>
            </FormItem>
            <FormItem label="标本类型"
                      prop="paSpecimanId">
              <Select v-model="formData.paSpecimanId"
                      :label-in-value="true"
                      filterable
                      @on-change="specimanChange"
                      size="small">
                <Option v-for="item in specimanDict"
                        :value="item.paId"
                        :key="item.paId"
                        :label="item.paSpecimanName">
                  <span slot>{{ item.paSpecimanName }}</span></Option>
              </Select>
            </FormItem>
            <FormItem label="序号"
                      v-show="title != 0"
                      prop="paSort">
              <Input v-model="formData.paSort"
                     @on-change="sortChange"
                     size="small"></Input>
            </FormItem>
            <FormItem label="是否本院"
                      style="flex:1;"
                      prop="paUseType">
              <RadioGroup v-model="formData.paUseType"
                          @on-change="useTypeChange">
                <Radio label="1">是</Radio>
                <Radio label="2">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="检验机构"
                      v-show="formData.paUseType == '1'"
                      prop="paUseOrgId">
              <Select v-model="formData.paUseOrgId"
                      filterable
                      size="small">
                <Option v-for="item in orgDict"
                        :value="item.sdId"
                        :key="item.sdId"
                        :label="item.sdName">
                  <span slot>{{ item.sdName }}</span></Option>
              </Select>
            </FormItem>
            <FormItem label="备注">
              <Input v-model="formData.paRemark"
                     type="textarea"
                     :rows="4"
                     size="small"></Input>
            </FormItem>
          </Form>
        </div>
        <div class="selected-item-wrapper">
          <h3 class="selected-title">包含组合项目组</h3>
          <ul>
            <li v-if="selectedComboData.length == 0"><span style="margin: 0 auto;">暂无数据</span></li>
            <li v-for="(item, index) in selectedComboData"
                :key="index">
              <span style="min-width:120px;">{{item.comboName}}</span>
              <Tag v-if="item.comboStatus == 1"
                   color="green">启用</Tag>
              <Tag color="orange"
                   v-else>停用</Tag>
              <Button ghost
                      size="small"
                      type="error"
                      @click="removeCombo(item)">移除</Button>
            </li>
          </ul>
        </div>
        <div class="unselected-item-wrapper">
          <div class="title-wrapper">
            <p class="title">
              <span>未选项目组合</span>
            </p>
            <div class="title-right-tool">
              <Input search
                     enter-button
                     style="width: 200px"
                     v-model="comboWord"
                     @on-search="getComboList({}, 1)"
                     placeholder="组合名称" />
            </div>
          </div>
          <div class="main-wrapper">
            <div class="room-selected-wrapper">
              <Input search
                     enter-button
                     size="small"
                     v-model="keyword"
                     placeholder="搜索科室" />
              <ul class="room-list-wrapper">
                <li v-if="keyword == ''"
                    :class="{'is-actived': curActive === 'all'}"
                    @click="getComboList({}, 0)">全部</li>
                <li :class="{'is-actived': curActive === item.poId}"
                    v-for="(item, index) in roomFilter"
                    @click="getComboList(item, 0)"
                    :key="index">{{item.poDeptName}}</li>
              </ul>
            </div>
            <div class="combit-item-wrapper">
              <Table :columns="columns"
                     :loading="isLoading"
                     height="540"
                     :data="comboTableData">
                <template slot="comboStatus"
                          slot-scope="{row}">
                  <Tag color="green"
                       v-if="row.comboStatus == 1">启用</Tag>
                  <Tag color="orange"
                       v-else>停用</Tag>
                </template>
                <template slot="action"
                          slot-scope="{row}">
                  <Button type="default"
                          @click="addCombo(row)"
                          :disabled="caculateCombo(row.comboId) == '已添加'"
                          size="small">{{caculateCombo(row.comboId)}}</Button>
                </template></Table>
            </div>
          </div>
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
import { comboList, testTubeSave } from '@/api/dict_examTestTube.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    const orgRequire = (rule, value, callback) => {
      if (!value && this.orgFlag) {
        callback(new Error('请选择机构'))
      } else {
        callback()
      }
    }
    const sortRequire = (rule, value, callback) => {
      if (!value && this.title != 0) {
        callback(new Error('请输入序号'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        paName: ''
      },
      columns: [
        {
          title: '编号',
          key: 'comboCode',
          width: 80,
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'comboName',
          width: 140,
          align: 'center'
        },
        {
          title: '状态',
          slot: 'comboStatus',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 80,
          align: 'center'
        }
      ],
      rules: {
        paName: [{ required: true, message: '请输入试管名称', trigger: 'blur' }],
        paExamTypeId: [{ required: true, message: '请选择检查类型', trigger: 'change' }],
        paSpecimanId: [{ required: true, message: '请选择标本类型', trigger: 'change' }],
        paUseType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
        paUseOrgId: [{ required: true, validator: orgRequire, trigger: 'change' }],
        paSort: [{ required: true, type: 'number', validator: sortRequire, trigger: 'blur' }]
      },
      comboTableData: [], // 组合列表
      keyword: '',
      selectedComboData: [], // 已选组合
      isLoading: false,
      comboWord: '', // 搜索科室组合关键字
      curDeptId: '', // 当前选中组合科室id
      curActive: '', // 当前选中科室
      orgFlag: true // 默认必填机构列表
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '添加体检试管' : '修改体检试管')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    roomDict: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () { }
    },
    examDict: {
      get: function () {
        return this.$store.getters.getExamType
      },
      set: function () { }
    },
    specimanDict: {
      get: function () {
        return this.$store.getters.getSpeciman
      },
      set: function () { }
    },
    orgDict: {
      get: function () {
        return this.$store.getters.getOrgDict
      },
      set: function () { }
    },
    roomFilter () {
      if (this.keyword == '') {
        return this.$store.getters.getRoomDict
      }
      let arr = this.roomDict
      let newArr = []
      arr.forEach(item => {
        if (item.poDeptName.indexOf(this.keyword) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    },
    caculateCombo () {
      return function (val) {
        let selectedArr = this.selectedComboData
        let tip = '添加'

        for (let i = 0; i < selectedArr.length; i++) {
          if (selectedArr[i].comboId == val) {
            tip = '已添加'
          }
        }
        return tip
      }
    }
  },

  mounted () {
    this.$store.dispatch('getRoomDict')
    this.$store.dispatch('getExamType')
    this.$store.dispatch('getSpecimanDict')
    this.$store.dispatch('getOrgDict')
  },
  methods: {
    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.selectedComboData = []
      this.comboTableData = []
      this.curActive = ''
      this.comboWord = ''
      this.$emit('close')
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formData.comboList = this.selectedComboData
          this.isLoading = true
          testTubeSave(this.formData).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getTestTubeDict', true)
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

    // 已选组合数据
    addCombo (row) {
      this.selectedComboData.push(row)
    },

    // 移除选中组合数据
    removeCombo (row) {
      for (let i = 0; i < this.selectedComboData.length; i++) {
        if (row.comboId == this.selectedComboData[i].comboId) {
          this.selectedComboData.splice(i, 1)
          break
        }
      }
    },

    // 获取科室组合数据
    getComboList (item, flag) {
      // flag为1表示按搜索查询，为0按科室查询
      if (flag == 0) {
        console.log(item)
        if (Object.keys(item).length == 0) {
          this.curDeptId = ''
          this.curActive = 'all'
        } else {
          this.curDeptId = item.poId
          this.curActive = item.poId
        }
      }

      let params = {
        deptId: this.curDeptId,
        searchField: this.comboWord
      }
      this.isLoading = true
      comboList(params).then(({ data }) => {
        this.isLoading = false
        if (data.code == 0) {
          this.comboTableData = data.data
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },

    getItemList (row) {
      if (Object.keys(row).length == 0) {
        this.formData = {
          paSort: null,
          paUseType: '1',
          paName: ''
        }
        this.selectedComboData = []
      } else {
        this.formData = row
        console.log(row)
        this.selectedComboData = row.comboList ? row.comboList : []
        // console.log(this.selectedComboData)
      }
    },
    examTypeChange (obj) {
      if (obj) {
        this.formData.paExamType = obj.label
      }
    },
    specimanChange (obj) {
      if (obj) {
        this.formData.paSpeciman = obj.label
      }
    },
    useTypeChange () {
      if (this.formData.paUseType == '2') {
        this.orgFlag = false
      } else {
        this.orgFlag = true
      }
    },
    sortChange (e) {
      let _sort = this.formData.paSort.toString()
      let str
      if (_sort.length == 1) {
        str = _sort.replace(/[^1-9]/gi, '')
      } else {
        str = _sort.replace(/[^0-9]/gi, '')
        str = str.replace(/^[0]+/, '')
      }
      this.$nextTick(() => {
        this.$set(this.formData, 'paSort', Number(str))
      })
    }
  }
}
</script>
<style lang="less">
.speciman-popup-wrapper {
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
  .modal-body {
    width: 100%;
    margin: 0 auto;
    display: flex;
    .form-wrapper {
      width: 280px;
      border-right: 1px solid #e5e5e5;
      padding-right: 10px;
    }
    .selected-item-wrapper {
      width: 280px;
      margin-left: 10px;
      border-radius: 4px;
      border: 1px solid #e6e6e6;
      .selected-title {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #000;
        background-color: #d6eaff;
        padding-left: 10px;
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
      ul {
        max-height: 600px;
        overflow-y: auto;
      }
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 48px;
        color: #252525;
        font-size: 14px;
        padding: 0 10px;
        border-bottom: 1px solid #e6e6e6;
        .ivu-tag {
          flex-shrink: 0;
        }
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
        display: flex;
        width: 100%;
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
            font-size: 14px;
            color: #252525;
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
      .combit-item-wrapper {
        flex: 1;
        margin-left: 10px;
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
    }
  }
}
</style>
