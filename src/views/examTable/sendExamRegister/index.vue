<template>
  <div class="send-exam-register-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">送检登记</span>
        <!-- <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 240px"
                 v-model="keyword"
                 @on-search="getItemList()"
                 placeholder="请搜索姓名或证件号码" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  v-permission="['add']"
                  @click="add">新建档案</Button>
        </div> -->
      </div>
      <div class="page-body clearfix">
        <div class="screen-info-wrapper">
          <!-- <div class="code-search-input">
            扫码区：
            <Input v-model="codeSearch"
                   style="width:140px"
                   size="small"
                   clearable />
          </div> -->
          <div class="screen-form">
            <Form :model="form"
                  label-position="right"
                  ref="form"
                  inline
                  style="flex:1"
                  :label-width="60">
              <FormItem label="扫码区"
                        :label-width="80"
                        prop="barCode">
                <Input v-model="form.barCode"
                       style="width:160px"
                       size="small"
                       @on-enter="codeRegister()"
                       clearable />
              </FormItem>
              <FormItem label="登记日期"
                        :label-width="80">
                <DatePicker type="daterange"
                            format="yyyy-MM-dd"
                            v-model="form.registerDate"
                            split-panels
                            placeholder="选择登记日期范围"
                            placement="bottom-end"
                            style="width: 200px;"
                            @on-change="formatDate"
                            size="small"></DatePicker>
              </FormItem>
              <FormItem label="体检编号"
                        prop="peId1"
                        :label-width="80">
                <Input v-model="form.peId1"
                       style="width:120px"
                       size="small"
                       clearable></Input>
              </FormItem>

              <FormItem label="到"
                        prop="peId2"
                        :label-width="28">
                <Input v-model="form.peId2"
                       style="width:120px"
                       size="small"
                       clearable></Input>
              </FormItem>

              <FormItem label="项目名称"
                        :label-width="80"
                        prop="comboName">
                <Input v-model="form.comboName"
                       style="width:140px"
                       size="small"
                       clearable />
              </FormItem>

            </Form>
            <div class="handle-wrapper">
              <Button style="margin-left: 8px;"
                      @click="getList()"
                      type="primary">筛选</Button>
              <Button style="margin-left: 8px;"
                      @click="print()"
                      :disabled="isPrint"
                      v-permission="['print']"
                      type="primary">打印</Button>
            </div>
          </div>
        </div>
        <Table :columns="columns"
               :data="tableData"
               :height="screenHeight - 340"
               :loading="isLoading">
          <template slot-scope="{ row, index }"
                    slot="comboNameList">
            <span v-for="(item, key) in row.comboNameList"
                  :key="key">{{item}}{{(row.comboNameList.length - 1) == key ? '' : '，'}}</span>
          </template>
          <template slot-scope="{ row, index }"
                    slot="inUseOrgClass">
            <span v-if="row.inUseOrgClass">{{row.inUseOrgClass == '1' ? '总院' : '分院'}}</span>
          </template>
          <template slot="inRegisterDate"
                    slot-scope="{row}">
            <span v-if="row.inRegisterDate">{{row.inRegisterDate | dateformat}}</span>
          </template>
          <template slot="inspectionDate"
                    slot-scope="{row}">
            <span v-if="row.inspectionDate">{{row.inspectionDate | dateformat}}</span>
          </template>
          <template slot="action"
                    slot-scope="{row}">

            <!-- <Button type="default"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.cdStatus == 0 ? '停用' : '启用'}}</Button> -->
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit(row)"
                    v-permission="['edit']"
                    size="small">修改</Button>
          </template>
        </Table>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40,100,1000]"
              @on-change="pageIndexChange"
              @on-page-size-change="pageSizeChange"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
    <!-- <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          :picurl="pic"
          @updateList="getItemList"
          @close="editModalVisible = false"></Edit> -->
  </div>
</template>
<script>
import { examRegisterList, barCodeRegister, printBarcodeRegister } from '@/api/sendExamRegister.js'
import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
import moment from 'moment'
export default {
  name: 'sendExamRegister',
  data () {
    return {
      screenHeight: document.body.clientHeight,
      form: {},
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '患者姓名',
          key: 'inName',
          width: 100,
          align: 'center'
        },
        {
          title: '条码号',
          key: 'inBarcode',
          width: 170,
          align: 'center'
        },
        // {
        //   title: '体检编号',
        //   key: 'inPeId',
        //   width: 170,
        //   align: 'center'
        // },
        {
          title: '项目组合名称',
          slot: 'comboNameList',
          minWidth: 180,
          align: 'center'
        },
        {
          title: '试管分类',
          key: 'inTestTubeName',
          width: 140,
          align: 'center'
        },
        {
          title: '检验机构',
          slot: 'inUseOrgClass',
          width: 140,
          align: 'center'
        },
        {
          title: '登记人',
          key: 'inOperator',
          width: 100,
          align: 'center'
        },
        {
          title: '登记时间',
          slot: 'inRegisterDate',
          width: 180,
          align: 'center'
        },
        {
          title: '送检人',
          key: 'inspectionName',
          width: 100,
          align: 'center'
        },
        {
          title: '送检时间',
          slot: 'inspectionDate',
          width: 180,
          align: 'center'
        },
        // {
        //   title: '操作',
        //   slot: 'action',
        //   fixed: 'right',
        //   width: 100,
        //   align: 'center'
        // }
      ],
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      keyword: '',
      isLoading: false,
      isPrint: false,
      pic: '',
      codeSearch: ''
    }
  },
  watch: {
    screenHeight (val) {
      if (!this.timer) {
        this.screenHeight = val
        this.timer = true
        let that = this
        setTimeout(() => {
          that.timer = false
        }, 300);
      }
    }
  },
  mounted () {
    // 动态计算可视窗口高度
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
    let curDate = moment().format('YYYY-MM-DD')
    this.$set(this.form, 'registerDate', [curDate, curDate])
    this.form.registerDate1 = curDate
    this.form.registerDate2 = curDate
    this.getList()
  },
  methods: {
    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      //防止搜索框重复提交
      if (this.isLoading) {
        return
      }
      let params = {
        registerDate1: this.form.registerDate1 || '',
        registerDate2: this.form.registerDate2 || '',
        comboName: this.form.comboName || '',
        peId1: this.form.peId1 || '',
        peId2: this.form.peId2 || '',
        barCode: this.form.barCode || ''
      }
      this.isLoading = true
      examRegisterList(pagination,params).then(({ data }) => {
        if (data.code == 0) {
          let res = data.data.records
          this.totalSize = data.data.total
          this.tableData = res
        } else {
          this.$Message.error(data.message)
        }
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    // 扫码登记接口
    codeRegister () {
      if (!this.form.barCode || this.form.barCode.trim() == '') {
        this.form.barCode = ''
        return false
      }
      let params = {
        barCode: this.form.barCode.trim()
      }
      barCodeRegister(params).then(({ data }) => {
        this.$set(this.form, 'barCode', '')
        if (data.code == 0) {
          console.log(data)
          this.$Message.success(data.message)
          this.getList()
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    print () {
      if (this.tableData.length == 0) {
        this.$Message.error('未查询到数据')
        return false
      }
      if (!printNotice()) return false
      this.isPrint = true
      printBarcodeRegister(this.tableData).then(({ data }) => {
        this.isPrint = false
        if (data.code == 0) {
          let printParams = {
            guideUrl: this.$url + data.data,
            selGroup: ['printGuide'],
            taskName: '送检清单'
          }
          printMethods(printParams.guideUrl, printParams)
        }
      })
    },
    // 切换页码
    pageIndexChange (val) {
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList(1, val)
    },
    formatDate (val) {
      console.log(val);
      if (val[0] !== "") {
        this.form.registerDate1 = val[0]
        this.form.registerDate2 = val[1]
      } else {
        this.form.registerDate1 = ''
        this.form.registerDate2 = ''
      }
    },
    
  }
}

</script>
<style lang="less">
.send-exam-register-wrapper {
  width: 100%;
  min-width: 1300px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-group {
      top: 0;
    }
  }
  .title-right-tool {
    display: flex;
    align-items: center;
  }
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
  .screen-info-wrapper {
    padding-bottom: 15px;
    .code-search-input {
      display: flex;
      align-items: center;
      min-width: 180px;
      flex-shrink: 0;
    }
    .screen-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .ivu-form-item {
        margin-bottom: 0px !important;
      }
    }
  }
  .page-body {
    padding-bottom: 0px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-btn-error[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7;
    border-color: #dcdee2;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>
