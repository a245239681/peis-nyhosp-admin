<template>
  <div class="invoice-code-manage-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">发票号段管理</span>
        <div class="title-right-tool">
          领取人：
          <!-- <Input style="width: 120px;margin-right:10px;"
                 v-model="receiver"
                 size="small"/> -->
          <Select v-model="boClaimantId"
                  :label-in-value="true"
                  style="width:120px;margin-right:15px;"
                  @on-change="changeSelect"
                  filterable
                  clearable
                  size="small">
            <Option v-for="item in receiverList"
                    :value="item.doctorId"
                    :key="item.doctorId">{{item.doctorName}}</Option>
          </Select>
          起始号：
          <Input style="width: 120px;margin-right:15px;"
                 v-model="boStartNumber"
                 οnkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                 @keyup.native="provingStartNumber"
                 size="small" />
          结束号：
          <Input style="width: 120px;margin-right:15px;"
                 v-model="boEndNumber"
                 οnkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                 @keyup.native="provingEndNumber"
                 size="small" />
          使用号段：
          <Input style="width: 150px;margin-right:15px;"
                 v-model="boUseNumber"
                 οnkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode)))'
                 @keyup.native="provingUseNumber"
                 size="small" />

          <Button type="primary"
                  style="margin-left: 8px;"
                  size="small"
                  @click="getList()">筛选</Button>
          <Button type="primary"
                  size="small"
                  style="margin-left: 8px;"
                  @click="distribute">分配发票</Button>
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               @on-row-click="selectChange">
          <template slot="boStatus"
                    slot-scope="{row}">
            <Tag color="primary"
                 v-if="row.boStatus == 0">使用</Tag>
            <Tag color="warning"
                 v-if="row.boStatus == 1">停用</Tag>
            <Tag color="error"
                 v-if="row.boStatus == 9">作废</Tag>
            <!-- {{row.boStatus == 0 ? '使用 ' : row.boStatus == 1 ? '停用' : '作废'}} -->
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button type="default"
                    ghost
                    v-if="row.boStatus == 9"
                    v-permission="['edit']"
                    disabled
                    @click="cancel(row)"
                    size="small">作废</Button>
            <Button type="default"
                    v-else
                    v-permission="['edit']"
                    @click="cancel(row)"
                    size="small">作废</Button>
          </template>
        </Table>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40]"
              @on-change="pageIndexChange"
              @on-page-size-change="pageSizeChange"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
    <Edit :visible="editModalVisible"
          @updateList="getList"
          ref="editwrapper"
          @close="editModalVisible = false"></Edit>
  </div>
</template>

<script>
import Edit from './edit';
import { invoiceReceiptList, invoiceReceipt } from '@/api/balance_invoiceCodeManage.js'


export default {
  name: 'invoiceCodeManage',
  components: {
    Edit,
  },
  data () {
    return {
      columns: [
        {
          title: '使用号段',
          key: 'boUseNumber',
          align: 'center'
        },
        {
          title: '发票起始号',
          key: 'boStartNumber',
          align: 'center'
        },
        {
          title: '发票结束号',
          key: 'boEndNumber',
          align: 'center'
        },
        {
          title: '领取人',
          key: 'boClaimantName',
          align: 'center'
        },
        {
          title: '发票状态',
          key: 'boStatus',
          slot: 'boStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 180,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      editModalVisible: false,
      selections: [], // 表格勾选项集合
      boClaimantId: '',
      boClaimantName: '',
      boStartNumber: '',
      boEndNumber: '',
      boUseNumber: '',
    }
  },


  computed: {
    receiverList: {
      get: function () {
        return this.$store.getters.getExamDoctorDict;
      },
      set: function () {

      }
    },
  },
  created () {

  },
  mounted () {
    let params = {
      deptName: "财务科",
      deptId: ''
    };
    this.$store.dispatch("getExamDoctorDict", { params, btn: true })
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
      let params = {
        boClaimantId: this.boClaimantId ? this.boClaimantId : '',
        boClaimantName: this.boClaimantName ? this.boClaimantName : '',
        boStartNumber: this.boStartNumber ? this.boStartNumber.trim() : '',
        boEndNumber: this.boEndNumber ? this.boEndNumber.trim() : '',
        boUseNumber: this.boUseNumber ? this.boUseNumber.trim() : '',
      }

      console.log(params)
      this.isLoading = true

      invoiceReceiptList(pagination, params).then(({ data }) => {
        this.isLoading = false
        console.log(data)
        if (data.code == 0) {
          let res = data.data
          this.totalSize = res.total
          this.tableData = res.records
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        // this.$Message.error('网络不稳定，请稍后重试')
      })

    },

    changeSelect (e) {
      if (e != undefined) {
        this.boClaimantId = e.value
        this.boClaimantName = e.label
      }
    },


    // 分配发票
    distribute () {
      this.editModalVisible = true
      this.$nextTick(() => {
        this.$refs.editwrapper.setClaimant()
      })
    },

    // 作废
    cancel (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否作废该发票？',
        onOk: () => {
          row.boStatus = 9
          invoiceReceipt(row).then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.$Message.success(`已作废该发票`)
              this.getList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
    },

    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val;
      this.getList(val, this.pageSize);
    },
    pageSizeChange (val) {
      this.pageSize = val;
      this.getList(1, val);
    },

    selectChange () {

    },

    // 限制只能输入正整数
    // 限制只能输入正整数
    provingStartNumber () {
      this.boStartNumber = this.boStartNumber.replace(/[^\.\d]/g, '');
      this.boStartNumber = this.boStartNumber.replace('.', '');
      console.log(this.boStartNumber)
    },
    provingEndNumber () {
      this.boEndNumber = this.boEndNumber.replace(/[^\.\d]/g, '');
      this.boEndNumber = this.boEndNumber.replace('.', '');
    },
    provingUseNumber () {
      this.boUseNumber = this.boUseNumber.replace(/[^\.\d]/g, '');
      this.boUseNumber = this.boUseNumber.replace('.', '');
    },
  }
}
</script>

<style lang="less">
.invoice-code-manage-wrapper {
  width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .ivu-table th {
    background-color: #d6eaff;
  }
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
}
</style>

