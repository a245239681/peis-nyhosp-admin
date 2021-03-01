<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="批量领取报告"
           :width="1000"
           class="draw-report-wrapper">
      <div class="modal-body">
        <div class="screen-wrapper person-info">
          <Form :model="personInfo"
                ref="personForm"
                :rules="ruleValidate"
                style="display:flex;align-item: center;justify-content: center;"
                label-position="right">
            <FormItem label="领取人姓名"
                      prop="boRecipientName"
                      :label-width="110">
              <Input v-model.trim="personInfo.boRecipientName"
                     :disabled="!isEdit"
                     clearable
                     size="small"></Input>
            </FormItem>
            <FormItem label="联系电话"
                      prop="boRecipientPhone"
                      :label-width="80">
              <Input v-model.trim="personInfo.boRecipientPhone"
                     :disabled="!isEdit"
                     clearable
                     size="small"></Input>
            </FormItem>
            <FormItem label="身份证号码"
                      prop="boRecipientIdNo"
                      :label-width="110">
              <Input v-model.trim="personInfo.boRecipientIdNo"
                     :disabled="!isEdit"
                     clearable
                     size="small"></Input>
            </FormItem>
            <FormItem label=""
                      :label-width="10">
              <Button type="primary"
                      size="small"
                      v-if="isEdit"
                      @click="msgConfirm">录入</Button>
              <Button type="primary"
                      size="small"
                      v-else
                      @click="msgEdit">修改</Button>
            </FormItem>
            <FormItem label=""
                      :label-width="1">
              <Button type="primary"
                      :loading="readCardLoading"
                      size="small"
                      style="margin-left:10px"
                      @click="readIdCard">扫描证件</Button>
            </FormItem>
          </Form>
        </div>
        <div class="screen-wrapper">
          <Form :model="formData"
                ref="screenForm"
                style="display:flex;align-item: center;justify-content: center;"
                @submit.native.prevent
                label-position="right">
            <FormItem label="登记流水号"
                      :label-width="110">
              <Input v-model.trim="formData.registerCode"
                     ref="registerInput"
                     placeholder="请输入或使用扫码枪扫描条码"
                     style="width:200px;"
                     @on-enter="addReport()"
                     size="small"></Input>
            </FormItem>
            <FormItem label=""
                      :label-width="10">
              <Button type="primary"
                      :loading="isLoading"
                      size="small"
                      @click="addReport()">添加</Button>
            </FormItem>
          </Form>
        </div>
        <div class="table-wrapper">
          <div class="table-wrapper">
            <div class="search-info">温馨提示：单次最多只能批量领取100份，当前已添加<span>{{tableData.length}}</span>份</div>
            <vxe-table class="mytable-footer"
                       ref="workloadTable"
                       border
                       show-footer
                       :auto-resize="true"
                       highlight-hover-row
                       align="center"
                       row-class-name="table-row"
                       header-row-class-name="table-row"
                       :height="400"
                       :data="tableData"
                       :loading="isLoading">
              <vxe-table-column field="sort"
                                title="序号"
                                width="60">
                <template v-slot="{rowIndex}">
                  <span>{{rowIndex + 1}}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="boRegisterCode"
                                title="登记流水号"
                                width="140"></vxe-table-column>
              <vxe-table-column field="boName"
                                title="姓名"
                                min-width="80"></vxe-table-column>
              <vxe-table-column field="boCategory"
                                title="体检类型"
                                show-overflow="title"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="boUnitName"
                                title="单位"
                                show-overflow="title"
                                min-width="180"></vxe-table-column>
              <vxe-table-column field="boPackageName"
                                title="套餐"
                                show-overflow="tooltip"
                                min-width="140"></vxe-table-column>
              <vxe-table-column field="action"
                                title="操作"
                                width="120"
                                fixed="right">
                <template v-slot="{row}">
                  <Button type="error"
                          @click="removeHandle(row)">移除</Button>

                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="saveLoading"
                @click="save">提交领取</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getBirthAndAge } from '@/libs/tools'
import { drawReport, drawReportSave } from '@/api/examProgressManage'
import jsonp from 'jsonp'
export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    const checkIdno = (rule, value, callback) => {
      const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'))
      }
      callback()
    }

    const checkPhone = (rule, value, callback) => {
      const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/ //  带杠的电话号码
      const reg2 = /^1[3|4|5|6|7|8][0-9]{9}$/ // 手机号码
      const reg3 = /^[0-9]{11,12}$/ //  纯数字的电话号码
      if (!reg.test(value) && !reg2.test(value) && !reg3.test(value)) {
        callback(new Error('联系方式格式有误'))
      }
      callback()
    }
    return {
      personInfo: {},
      ruleValidate: {
        boRecipientName: [{ required: true, message: '请输入领取人姓名', trigger: 'blur' },
        { min: 2, max: 16, message: '姓名不得超过16个字符', trigger: 'blur' }],
        boRecipientPhone: [{ required: true, message: '请输入领取人手机号', trigger: 'blur' },
        { validator: checkPhone, required: true, trigger: 'blur' }],
        boRecipientIdNo: [{ required: true, message: '请输入领取人证件号码', trigger: 'blur' },
        { validator: checkIdno, required: true, trigger: 'blur' }],
      },
      formData: {},
      tableData: [],
      isLoading: false,
      saveLoading: false,
      readCardLoading: false,
      isEdit: true // 领取人信息是否可编辑
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
  mounted () {

  },
  methods: {
    closeModal () {
      this.personInfo = {}
      this.formData = {}
      this.tableData = []
      this.$emit('close')
    },
    save () {
      if (this.saveLoading) return
      const { boRecipientIdNo, boRecipientPhone, boRecipientName } = this.personInfo

      if (!boRecipientIdNo || !boRecipientPhone || !boRecipientName) {
        this.$Message.info('请先完善领取人信息')
        return false
      }
      if (this.tableData.length == 0) {
        this.$Message.info('请先导入要领取的报告数据')
        return false
      }
      let params = { boRecipientIdNo, boRecipientPhone, boRecipientName }
      params.patientVisitList = this.tableData

      this.saveLoading = true
      drawReportSave(params).then(({ data }) => {
        this.saveLoading = false
        if (data.code === 0) {
          this.$Message.success(data.message)
          this.$emit('updateList')
          this.closeModal()
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // 读取身份证
    readIdCard () {
      let url = `http://127.0.0.1:8989/api/ReadMsg`
      this.readCardLoading = true
      jsonp(url, { timeout: 3000 }, (_err, data) => {
        this.readCardLoading = false
        if (data != undefined && data != null) {
          if (data.retcode == '0x90 0x1') {
            this.personInfo.boRecipientIdNo = data.cardno
            this.personInfo.boRecipientName = data.name
          } else if (data.retcode == '0x41') {
            this.$Message.error('身份证读取失败，请稍后尝试')
          } else if (data.retcode == '0x1') {
            this.$Message.error('读卡器服务' + data.retmsg)
          }
        } else {
          this.$Modal.info({
            title: '和湛科技体检系统',
            content: `检测到该电脑未安装身份证读卡器驱动，请联系管理员安装相关驱动。<a href="./plugins/readIdCard3.0.9-2.zip" target="_blank" download="readIdCard3.0.9-2.zip">点击此处下载身份证读卡器驱动</a>`
          })
        }
      })
    },
    msgConfirm () {
      const { boRecipientIdNo, boRecipientPhone, boRecipientName } = this.personInfo

      this.$refs.personForm.validate((valid) => {
        if (valid) {
          this.isEdit = false
        }
      })
    },
    msgEdit () {
      this.isEdit = true
    },
    addReport () {
      if (this.tableData.length >= 100) {
        this.$Message.info('单次领取不能超过100份！')
        return false
      }

      this.isLoading = true
      drawReport(this.formData).then(({ data }) => {
        this.isLoading = false
        if (data.code === 0) {
          this.formData.registerCode = ''
          const flag = this.tableData.some(item => {
            return item.boId === data.data.boId
          })
          if (flag) {
            this.$Message.info('该数据已存在列表中')
          } else {
            this.tableData.unshift(data.data)
          }

          this.$nextTick(() => {
            this.$refs.registerInput.focus()
          })
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    removeHandle (row) {
      let _arr = this.tableData.filter(item => {
        return item.boId !== row.boId
      })
      this.tableData = _arr
    }
  }
}
</script>
<style lang="less">
.draw-report-wrapper {
  .screen-wrapper {
    padding-top: 10px;
  }
  .person-info {
    border-bottom: 2px solid #e5e5e5;
    padding-top: 0;
  }

  .table-wrapper {
    .search-info {
      line-height: 1.8;
      font-weight: bold;
      color: #ed4014;
      margin-bottom: 10px;
      span {
        color: #40a9ff;
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
