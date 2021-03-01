<template>
  <Modal v-model="isVisible"
         title="疾病列表"
         width="1200"
         :mask-closable="false"
         :styles="{top: '40px'}"
         @on-ok="selected"
         @on-cancel="cancel"
         ok-text="选择"
         cancel-text="取消"
         class="disease-list-modal">
    <div class="disease-list-body">
      <!-- <Card class="disease-info-left"
            shadow
            :bordered="false"> -->
      <div class="disease-info-left">
        <div class="search-box">
          <Input search
                 enter-button
                 placeholder="搜索科室"
                 size="small"
                 style="width: 190px"
                 v-model="keyword" />
        </div>
        <ul class="disease-list">
          <li v-if="keyword == ''"
              :class="{'is-actived': curActive === 'all'}"
              @click="getComboList({},'all')">全部</li>
          <li :class="{'is-actived': curActive === index}"
              v-for="(item, index) in diseaseTypeFilter"
              @click="getComboList(item,index)"
              :key="index">{{item.cdDiseaseType }}</li>
        </ul>
      </div>
      <!-- </Card> -->
      <div class="disease-info-right">
        <!-- <Card class="disease-info-right"
            shadow
            :bordered="false"> -->
        <div class="search-title-wrapper">
          <span class="title">疾病信息</span>
          <div class="title-right-tool">
            <Input search
                   enter-button
                   v-model="keywords"
                   @on-search="getList()"
                   style="width: 200px"
                   placeholder="搜索"
                   size="small" />
          </div>
        </div>
        <div class="table">
          <Table :columns="columns"
                 :data="tableData"
                 height="550"
                 @on-row-click="getDiseaseNameInfo"
                 :rowClassName="rowClassName">
          </Table>
        </div>
        <div class="footer">
          <Page :total="totalSize"
                :page-size="pageSize"
                :current="pageIndex"
                :page-size-opts="[10,20,40,100]"
                @on-change="pageIndexChange"
                @on-page-size-change="pageSizeChange"
                size="small"
                show-sizer
                show-elevator
                show-total />
        </div>
        <!-- </Card> -->
      </div>
    </div>
  </Modal>
</template>

<script>
import { dictDiseaseList } from '@/api/busdict_diseaseInfo.js'

export default {
  name: 'diseaseList',
  props: {
    visible: Boolean
  },
  data () {
    return {
      columns: [
        {
          title: '疾病名称',
          key: 'cdDiseaseName',
          align: 'center'
        },
        {
          title: '疾病分类',
          key: 'diseaseType',
          align: 'center'
        },
        {
          title: '拼音码',
          key: 'cdPyCode',
          align: 'center'
        },
        {
          title: '五笔码',
          key: 'cdWbCode',
          align: 'center'
        },
        {
          title: '自定义码',
          key: 'cdCustCode',
          align: 'center'
        },
        {
          title: 'ICD编码',
          key: 'cdIcdCode',
          align: 'center'
        },
        {
          title: 'ICD名称',
          key: 'cdIcdName',
          align: 'center'
        }
      ],
      tableData: [],
      curActive: 'all',

      keyword: '', // 搜索科室输入
      keywords: '', // 搜索疾病信息输入
      totalSize: 100,
      pageIndex: 1,
      pageSize: 10,
      curIndex: -1, // 当前选中的表格行
      curDisease: '', // 当前选中的疾病名称
      curCdId: '', // 当前选中的疾病对应的id
      curDiseaseType: '', // 当前选中的疾病对应的疾病类型
      curDiseaseTypeId: '', // 当前选中的疾病对应的疾病类型id
      clickRowDiseaseTypeId: '', // 表格行选中时对应疾病类型id
      clickRowDiseaseType: '', // 表格行选中时对应疾病类型
      curPyCode: '', // 当前选中的疾病对应的拼音码
      curWbCode: '' // 当前选中的疾病对应的五笔码
    }
  },
  mounted () {
    this.$store.dispatch('getDiseaseType')
    // 获取疾病信息维护列表
    // this.getList()
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    diseaseType: {
      get: function () {
        return this.$store.getters.getDiseaseType
      },
      set: function () { }
    },
    diseaseTypeFilter () {
      this.curActive = ''
      if (this.keyword == '') {
        return this.$store.getters.getDiseaseType
      }
      let arr = this.diseaseType
      let newArr = []
      arr.forEach(item => {
        if (item.cdDiseaseType.indexOf(this.keyword) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    }
  },
  methods: {
    // 取消选择疾病名称并关闭当前对话框
    cancel () {
      this.$emit('cancel')
      this.pageIndex = 1
      this.curIndex = -1
    },
    // 选择疾病名称并关系当前对话框
    selected () {
      this.$emit('selected', false)
      this.$emit('getDiseaseName', {
        curDisease: this.curDisease,
        cdId: this.curCdId,
        curDiseaseType: this.clickRowDiseaseType,
        curDiseaseTypeId: this.clickRowDiseaseTypeId,
        curPyCode: this.curPyCode,
        curWbCode: this.curWbCode
      })
    },
    // 点击获取疾病名称
    getDiseaseNameInfo (val, index) {
      console.log(val)
      // console.log(index);
      // console.log(val.cdDiseaseName);
      this.curIndex = index
      this.curDisease = val.cdDiseaseName
      this.curCdId = val.cdId
      this.clickRowDiseaseType = val.diseaseType
      this.clickRowDiseaseTypeId = val.cdDiseaseTypeId
      this.curPyCode = val.cdPyCode
      this.curWbCode = val.cdWbCode
    },
    // 高亮选中行-蓝色
    rowClassName (row, index) {
      if (index === this.curIndex) {
        return 'click-row'
      }
    },
    getList (page = 1, size = 10) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        cdDiseaseTypeId: this.curDiseaseTypeId,
        searchField: this.keywords.trim()
      }
      console.log(params)
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictDiseaseList(pagination, params).then(({ data }) => {
        console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          let res = data.data
          this.totalSize = res.total
          this.tableData = res.records
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    // 获取科室组合数据
    getComboList (item, index) {
      console.log(item)
      this.curActive = index
      this.pageIndex = 1
      this.pageSize = 10
      let page = this.pageIndex
      let size = this.pageSize

      let pagination = {
        page,
        size
      }
      if (Object.keys(item).length == 0) {
        this.clickRowDiseaseTypeId = ''
      } else {
        this.clickRowDiseaseTypeId = item.cdId
      }
      let params = {
        cdDiseaseTypeId: this.clickRowDiseaseTypeId,
        searchField: this.keyword.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictDiseaseList(pagination, params).then(({ data }) => {
        console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalSize = data.data.total
          console.log(this.tableData)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.curIndex = -1
      this.getList(val)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    }
  }
}
</script>

<style lang="less">
.disease-list-modal {
  .ivu-modal-body {
    padding: 0;
    border: none;
    .ivu-table .click-row td {
      background-color: #2db7f5;
      color: #fff;
    }
  }
  .ivu-modal-footer {
    border: none;
  }
}

.disease-list-body {
  display: flex;
  justify-content: space-between;
  height: inherit;
  z-index: 10;
  .disease-info-left {
    background-color: #fff;
    width: 20%;

    .search-box {
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .disease-list {
      margin-top: 10px;
      max-height: 500px;
      overflow-y: auto;
      li {
        padding-left: 10px;
        text-align: center;
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #eee;
        &:hover {
          color: #57a3f3;
          cursor: pointer;
        }
      }
      li.is-actived {
        color: #2d8cf0;
        background-color: #f0faff;
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
  .disease-info-right {
    width: 80%;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .search-title-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
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
    .footer {
      margin-top: 20px;
      text-align: center;
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
}
</style>
