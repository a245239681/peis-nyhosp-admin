<template>
  <div>
    <Modal class="search-person-popup-wrapper"
           v-model="isVisible"
           :mask-closable="false"
           @on-cancel="close('form')"
           title="体检人员查询"
           width="1000">
      <Form ref="form"
            :model="form"
            label-position="left"
            autocomplete="off"
            :label-width="50">
        <Row :gutter="16">
          <Col span="4">
          <FormItem label="姓名"
                    prop="boName">
            <Input v-model.trim="form.boName"
                   @on-enter="searchPerson()"
                   clearable
                   size="small" />
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="流水号"
                    :label-width="60"
                    prop="boRegisterCode">
            <Input v-model.trim="form.boRegisterCode"
                   @on-enter="searchPerson()"
                   clearable
                   size="small" />
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="证件类型"
                    prop="boCertificatesType"
                    :label-width="70">
            <Select v-model="form.boCertificatesType"
                    size="small">
              <Option value="1">身份证</Option>
              <Option value="2">士兵证</Option>
              <Option value="3">军官证</Option>
              <Option value="4">警官证</Option>
              <Option value="5">护照</Option>
              <Option value="6">其他</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="7">
          <FormItem label="证件号码"
                    prop="boIdNo"
                    :label-width="70">
            <Input v-model.trim="form.boIdNo"
                   @on-enter="searchPerson()"
                   clearable
                   size="small" />
          </FormItem>
          </Col>
          <Col span="2">
          <Button type="primary"
                  @click="searchPerson()"
                  :loading="searchLoading">查询</Button>
          </Col>
        </Row>
      </Form>
      <div class="table-left">
        <!-- @on-row-click="getRecord" -->
        <Table :columns="personCols"
               :data="personTableData"
               @on-row-dblclick="dblclickRecord"
               :loading="searchLoading"
               height="400"
               highlight-row></Table>

      </div>
      <div slot="footer">
        <div class="switch-page-footer">
          <Page :total="totalSize"
                :page-size="pageSize"
                :current="pageIndex"
                @on-change="pageIndexChange"
                size="small"
                show-elevator
                show-total />
        </div>
        <!-- <Button @click="close('form')">取消</Button>
        <Button type="primary"
                @click="importHistory('form')">导入</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import { getMasterIndexByNameAndIdNo } from '@/api/personal_register.js';

export default {
  name: 'modifySearch',
  props: {
    visible: Boolean,
    boname: String,
    boRegisterCode: [Number, String],
    tableData: {
      type: Array,
      default: () => []
    },
    totalItems: [Number, String],
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        boName: '',
        boCertificatesType: '1',
        boIdNo: '',
        boRegisterCode: ''
      },
      personCols: [
        {
          title: '姓名',
          minWidth: 80,
          key: 'boName',
          align: 'center'
        },
        {
          title: '登记流水号',
          minWidth: 140,
          key: 'boRegisterCode',
          align: 'center'
        },
        {
          title: '证件类型',
          minWidth: 100,
          key: 'CertificatesType',
          align: 'center'
        },
        {
          title: '证件号码',
          minWidth: 160,
          key: 'boIdNo',
          align: 'center'
        },
        {
          title: '性别',
          minWidth: 80,
          key: 'boSex',
          align: 'center'
        },
        {
          title: '年龄',
          minWidth: 80,
          key: 'boAge',
          align: 'center'
        },
        {
          title: '个人/单位',
          minWidth: 100,
          key: 'IsUnit',
          align: 'center'
        },
        {
          title: '体检次数',
          minWidth: 100,
          key: 'boVisitSn',
          align: 'center'
        },
        {
          title: '预约套餐',
          minWidth: 120,
          key: 'boPackageName',
          align: 'center'
        },
        {
          title: '预约时间',
          minWidth: 110,
          key: 'boBookingDate',
          align: 'center'
        },
        {
          title: '单位名称',
          minWidth: 100,
          key: 'boUnitName',
          align: 'center'
        },
      ],
      personTableData: [],
      unitsList: [],
      recordIndex: -1,
      emptyText: '暂无数据',
      boBookingDataStart: '',
      boBookingDataEnd: '',
      unitNameLoading: false,
      searchLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalSize: 0,
      clickTableLoading: false,
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    }
  },
  watch: {
    boname: function (newValue, oldValue) {
      // console.log(oldValue + 'oldValue')
      // console.log(newValue + 'newValue')
      if (newValue) {
        this.autoSearchName(newValue);
      }
    },
    tableData () {
      this.personTableData = Object.assign([], this.tableData)
    },
    totalItems () {
      this.totalSize = this.totalItems
    },
    isLoading () {
      this.searchLoading = this.isLoading
    }
  },
  methods: {
    searchPerson () {
      this.$emit('searchName', this.pageIndex, this.pageSize, this.form)
    },
    //点击左边表格记录
    // getRecord (data, index) {
    //   console.log(data)
    //   //获取点击左边表格行数index
    //   this.recordIndex = index;
    // },
    clearData (form) {
      this.pageIndex = 1
      this.totalSize = 0
      //清空表格数据
      this.personTableData = [];
      //清除选中高亮效果
      this.recordIndex = -1;
      //清空查询表单
      this.$refs[form].resetFields();
    },
    //双击左边表格记录
    dblclickRecord (data, index) {
      console.log(data)
      console.log(index)
      //获取点击左边表格行数index
      this.recordIndex = index;
      this.importHistory('form', data)
    },
    importHistory (form, data) {
      if (!data) {
        this.$Message.error('请选择需要导入的数据')
        return
      }

      //将选中的记录信息导入到外面的表单中
      this.$emit('importPerson', data);
      this.clearData(form);
      this.$emit('close');
    },
    close (form) {
      this.searchLoading = false;
      this.clearData(form);
      this.$emit('close');
    },
    autoSearchName (name) {
      this.form.boName = name;
      this.searchPerson();
    },

    // 通过身份证查询
    idCardSearch (obj) {
      this.form.boIdNo = obj.boIdNo
      this.form.boCertificatesType = obj.boCertificatesType
      this.searchPerson();
    },

    //翻页
    pageIndexChange (val) {
      console.log('fanye' + val)
      this.packageData = [];
      this.pageIndex = val
      this.searchPerson()
    }
  }
}
</script>

<style lang="less">
.search-person-popup-wrapper {
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
  .ivu-modal-body {
    padding-bottom: 0;
    .ivu-form-item {
      margin-bottom: 16px;
    }
    .ivu-table th {
      background-color: #d6eaff;
    }
    .booking-date-range {
      width: 254px;
    }
    .table-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      // .switch-page-footer {
      //   position: static;
      //   bottom: 0;
      //   // margin-top: 20px;
      // }
    }
    .zk-table {
      ::-webkit-scrollbar {
        width: 5px;
        background-color: #eee;
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      ::-webkit-scrollbar-corner {
        display: none;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #e8e8e8;
      }
    }
  }
  .switch-page-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
}
</style>


