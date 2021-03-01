<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           :title="showTitle"
           :width="900"
           class="examTypeDict-edit-wrapper">
      <div class="modal-body">
        <div class="left-side-wrapper">
          <Form :model="formData"
                ref="form"
                :label-width="85"
                label-position="right">
            <FormItem label="序号"
                      v-if="title != 0">
              <Input v-model="formData.cdSort"
                     type="number"
                     disabled
                     size="small"></Input>
            </FormItem>
            <FormItem label="分类名称"
                      prop="cdName"
                      :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
              <Input v-model="formData.cdName"
                     @on-change="searchCode"
                     size="small"></Input>
            </FormItem>
            <FormItem label="类型编码"
                      prop="cdCode"
                      :rules="[{ required: true, message: '请输入类型编码', trigger: 'blur' }]">
              <Input v-model="formData.cdCode"
                     size="small"></Input>
            </FormItem>
            <FormItem label="拼音码"
                      prop="cdPyCode"
                      :rules="[{ required: true, message: '请输入拼音码', trigger: 'blur' }]">
              <Input v-model="formData.cdPyCode"
                     size="small"></Input>
            </FormItem>
            <FormItem label="五笔码"
                      prop="cdWbCode"
                      :rules="[{ required: true, message: '请输入五笔码', trigger: 'blur' }]">
              <Input v-model="formData.cdWbCode"
                     size="small"></Input>
            </FormItem>
            <FormItem label="查看体检报告"
                      :label-width="105"
                      style="margin-left:-20px;">
              <RadioGroup v-model="formData.cdIsViewReport"
                          type="button">
                <Radio label="0">开启</Radio>
                <Radio label="1">关闭</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="附加表打印设置"
                      :label-width="115"
                      style="margin-left:-30px;">
              <Select v-model="formData.cdGuidePrintStatus"
                      size="small">
                <Option :value="1">只打印指引单</Option>
                <Option :value="2">只打印附加表</Option>
                <Option :value="3">同时打印指引单、附加表</Option>
              </Select>
            </FormItem>
            <FormItem label="启用状态">
              <RadioGroup v-model="formData.cdStatus"
                          type="button">
                <Radio label="0">启用</Radio>
                <Radio label="1">停用</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
        <div class="right-side-wrapper">
          <div class="title-wrapper">
            <span class="title">附加表模板</span>
            <Select v-model="curAdditonList"
                    filterable
                    multiple
                    style="width: 300px;"
                    :max-tag-count="1"
                    @on-change="additionChange"
                    size="small">
              <Option v-for="item in additionDict"
                      :value="item.id"
                      :key="item.id"
                      :label="item.name">
                <span slot>{{item.name}}</span></Option>
            </Select>
          </div>
          <Table :columns="columns"
                 :height="400"
                 :data="tableData">
            <template slot="action"
                      slot-scope="{row}">
              <Button type="error"
                      style="margin-left: 8px;"
                      @click="removeAddition(row)"
                      size="small">移除</Button>
            </template>
          </Table>
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
import { dictCategorySave, additionList } from '@/api/dict_examTypeDict.js'
import { getCode } from '@/api/common.js'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      formData: {
        cdStatus: '0',
        cdIsViewReport: '0'
      },
      isLoading: false,
      columns: [
        // {
        //   width: 55,
        //   type: 'selection',
        //   align: 'center'
        // },
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '模板名称',
          key: 'name',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 120,
          align: 'center'
        }
      ],
      tableData: [],
      tableLoading: false,
      additionDict: [], // 附加表字典
      curAdditonList: [] // 当前选中附加表id
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
  mounted () {

  },
  methods: {
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, this.formData)
          params.additionIdList = this.curAdditonList

          this.isLoading = true
          dictCategorySave(params).then(({ data }) => {
            this.isLoading = false
            if (data.code == 0) {
              this.$Message.success('保存成功！')
              this.$emit('updateList')
              this.$store.dispatch('getCategoryDict', true)
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
          cdStatus: '0',
          cdIsViewReport: '0',
          cdSort: 1
        }
        this.getAdditionList()
      } else {
        this.formData = row
        this.curAdditonList = row.additionIdList
        this.getAdditionList()
      }
    },

    getAdditionList () {
      this.tableLoading = true
      additionList({}).then(({ data }) => {
        this.tableLoading = false
        if (data.code === 0) {
          this.additionDict = data.data
          if (this.curAdditonList.length > 0) {
            let _arr = [];
            for (let i = 0; i < this.curAdditonList.length; i++) {
              const arr = this.additionDict.filter(item => {
                return item.id === this.curAdditonList[i]
              })
              if (arr.length > 0) {
                _arr.push(...arr)
              }
            }
            this.tableData = _arr
          }
        } else {
          this.additionDict = []
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.tableLoading = false
        this.$Message.error(err.message)
      })
    },

    additionChange (val) {
      let _arr = []
      if (val instanceof Array && val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          const arr = this.additionDict.filter(item => {
            return item.id === val[i]
          })
          if (arr.length > 0) {
            _arr.push(...arr)
          }
        }
      }
      this.tableData = _arr
    },

    removeAddition (row) {
      const _idx1 = this.tableData.map(item => item.id).indexOf(row.id);
      const _idx2 = this.curAdditonList.indexOf(row.id);
      this.tableData.splice(_idx1, 1)
      this.curAdditonList.splice(_idx2, 1)
    },

    closeModal () {
      this.$refs.form.resetFields()
      this.formData = {}
      this.tableData = []
      this.curAdditonList = []
      this.$emit('close')
    },
    // 根据输入内容获取拼音码、五笔码
    searchCode () {
      let str = this.formData.cdName
      if (!str || str && str.trim() == '') {
        return false
      }
      let params = {
        keyword: str
      }
      getCode(params).then(({ data }) => {
        if (data.code == 0) {
          let result = data.data
          this.$set(this.formData, 'cdPyCode', result.py)
          this.$set(this.formData, 'cdWbCode', result.wb)
        }
      })
    }
  }
}
</script>
<style lang="less">
.examTypeDict-edit-wrapper {
  .modal-body {
    display: flex;
    .left-side-wrapper {
      flex: 0.4;
      padding-right: 10px;
      padding-left: 30px;
    }
    .right-side-wrapper {
      border-left: 1px solid #e6e6e6;
      padding: 0 20px 0 10px;
      flex: 0.6;
      .title-wrapper {
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          color: #2d8cf0;
        }
      }
    }
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
}
</style>
