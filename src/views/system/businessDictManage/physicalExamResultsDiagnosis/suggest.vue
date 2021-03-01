<template>
  <div>
    <Modal class="disease-diagnosis-wrapper modal"
           v-model="isVisible"
           @on-cancel="closeModal"
           :title="showTitle"
           width="1400"
           :mask-closable="false"
           >
      <div slot="header"
           class="search-title-wrapper">
        <span class="title">选择疾病诊断</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="keywords"
                 @on-search="getList()"
                 style="width: 200px"
                 placeholder="搜索" />
        </div>
      </div>
      <div class="main-wrapper">
        <div class="room-selected-wrapper">
          <Input search
                 enter-button
                 size="small"
                 v-model="keyword"
                 placeholder="搜索疾病分类" />
          <ul class="room-list-wrapper">
            <li v-if="keyword == ''"
                  :class="{'is-actived': curActive === 'all'}"
                  @click="getSearchList({},'all')">全部</li>
            <li :class="{'is-actived': curActive === index}"
                v-for="(item, index) in diseaseTypeFilter"
                @click="getSearchList(item,index)"
                :key="index">{{item.cdDiseaseType }}</li>
          </ul>
        </div>
        <div class="combit-item-wrapper">
          <Table :columns="columns"
                 :loading="isLoading"
                  highlight-row
                  @on-row-click="getDiagnosisName"
                  :row-class-name="rowClassName"
                 height="540"
                 :data="tableData">
            <template slot="action"
                      slot-scope="{row}">
              <Button type="default"
                      size="small">button</Button>
            </template>
          </Table>
          <div class="page-footer">
              <Page :total="totalSize"
                    :page-size="pageSize"
                    :current="pageIndex"
                    @on-change="pageIndexChange"
                    @on-page-size-change="pageSizeChange"
                    size="small"
                    show-elevator
                    show-total />
          </div>
        </div>

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
import { dictDiseaseAndSuggestionList } from '@/api/busdict_physicalExamResultsDiagnosis.js'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      curActive: 'all',
      totalSize: 100,
      pageIndex: 1,
      pageSize: 10,
      keyword: '', // 搜索疾病分类信息输入
      keywords: '', // 搜索输入
      columns: [
        {
          title: '疾病名称',
          key: 'cdDiseaseName',
          width: 200,
          align: 'center'
        },
        {
          title: '疾病分类',
          key: 'diseaseType',
          width: 200,
          align: 'center'
        },
        {
          title: '科室',
          key: 'deptName',
          width: 150,
          align: 'center'
        },
        {
          title: '疾病建议',
          key: 'suggestion',
          tooltip: true,
          align: 'center'
        }

      ],
      tableData: [],
      isLoading: false,
      curIndex: -1, // 当前选中的表格行
      curItemName: '', // 当前选中的疾病名称
      curItemId: '', // 当前选中的疾病对应的id
      curDiagnosisName: '', // 当前选中的疾病诊断名称
      curDiagnosisId: '', // 当前选中的疾病诊断对应的id
      cdDiseaseTypeId: '', // 当前选中疾病分类对应的id
      curSuggestion: '' // 当前选中的疾病诊断的疾病建议
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '选择诊断名称' : '编辑诊断名称')
    },
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    showButton () {
      return (this.name == 0)
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
  mounted () {
    this.$store.dispatch('getDiseaseType')
    this.getList()
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    getList (page = 1, size = 10) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        cdDiseaseTypeId: this.cdDiseaseTypeId,
        searchField: this.keywords.trim()
      }
      this.isLoading = true
      dictDiseaseAndSuggestionList(pagination, params).then(({ data }) => {
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
    nodeClick (node) {
      node.expanded = false
      console.log(node.expanded)
    },
    // 高亮选中行-蓝色
    rowClassName (row, index) {
      if (index == this.curIndex) {
        return 'click-row'
      }
    },
    // 选择疾病名称并关系当前对话框
    save () {
      this.$emit('selected', false)
      this.$emit('getDiagnosisName', {
        curDiagnosisName: this.curDiagnosisName,
        curDiagnosisId: this.curDiagnosisId,
        curSuggestion: this.curSuggestion
      })
      this.$emit('close')
    },
    getSearchList (item, index) {
      console.log(item)
      this.curActive = index
      this.pageIndex = 1

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize

      }
      if (Object.keys(item).length == 0) {
        this.cdDiseaseTypeId = ''
      } else {
        this.cdDiseaseTypeId = item.cdId
      }
      let params = {
        cdDiseaseTypeId: this.cdDiseaseTypeId,
        searchField: this.keywords.trim()
      }
      this.isLoading = true
      dictDiseaseAndSuggestionList(pagination, params).then(({ data }) => {
        console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          this.totalSize = data.data.total
          this.tableData = data.data.records
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    getDiagnosisName (val, index) {
      console.log(val)
      this.curIndex = index
      this.curDiagnosisName = val.cdDiseaseName
      this.curDiagnosisId = val.cdId
      this.curSuggestion = val.suggestion
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
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
<style lang="less" >
.disease-diagnosis-wrapper {
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
  .main-wrapper {
    display: flex;
    width: 100%;
    .page-footer {
      width: auto;
      height: 30px;
      left: 50%;
      margin-left: 30px;
      transform: translateX(-50%);
    }
  }
  .room-selected-wrapper {
    width: auto;
    .room-list-wrapper {
      margin-top: 15px;
      max-height: 500px;
      overflow-y: auto;
      li {
        padding-left: 10px;
        height: 32px;
        line-height: 32px;
        text-align: center;
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
    font-size: 14px;
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
  .middle-side {
    margin-left: 5px;

    .items-wrapper {
      flex: 1;
    }
    .physical-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 5px;
      &:nth-child(odd) {
        background-color: rgba(45, 140, 240, 0.2);
      }
    }
  }
}
</style>
