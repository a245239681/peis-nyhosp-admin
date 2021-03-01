<template>
  <Modal v-model="isVisible"
         title="疾病建议"
         width="1200"
         :closable="false"
         :mask-closable="false"
         :styles="{top: '40px'}"
         class="disease-suggest-modal">
    <div class="disease-suggest-body">
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
              v-for="(item, index) in roomFilter"
              @click="getComboList(item,index)"
              :key="index">{{item.poDeptName}}</li>
        </ul>
      </div>
      <!-- </Card> -->
      <div class="disease-suggest-right">
        <!-- <Card class="disease-info-right"
            shadow
            :bordered="false"> -->
        <div class="search-title-wrapper">
          <span class="title">疾病信息</span>
          <div class="title-right-tool">
            <Input search
                   enter-button
                   v-model="keywords"
                   ref="keywordsInput"
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
                 @on-row-click="getDiseaseSuggestInfo"
                 :rowClassName="rowClassName">
            <template slot="cdIsIllness"
                      slot-scope="{row}">
              {{row.cdIsIllness == '1' ? '是' : '否'}}
            </template>
            <template slot="cdIsCommonIll"
                      slot-scope="{row}">
              {{row.cdIsCommonIll == '1' ? '是' : '否'}}
            </template>
            <template slot="cdStatus"
                      slot-scope="{row}">
              <!-- {{row.cdStatus == '0' ? '启用' : '停用'}} -->
              <Tag color="green"
                   v-if="row.cdStatus == 0">启用</Tag>
              <Tag color="orange"
                   v-else>停用</Tag>
            </template>
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
    <div slot="footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary"
              @click="selected">选择</Button>
    </div>
  </Modal>
</template>

<script>
import { dictSuggestList } from '@/api/busdict_diseaseAdvice.js'

export default {
  name: 'dicSuggestList',
  props: {
    visible: Boolean
  },
  data () {
    return {
      columns: [
        // {
        // width: 55,
        // type: 'selection',
        // align: 'center'
        // },
        {
          title: '疾病名称',
          key: 'diseaseName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '科室',
          key: 'cdDeptName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '是否疾病',
          slot: 'cdIsIllness',
          key: 'cdIsIllness',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '是否常见病',
          slot: 'cdIsCommonIll',
          key: 'cdIsCommonIll',
          minWidth: 110,
          align: 'center'
        },
        {
          title: '拼音码',
          minWidth: 90,
          key: 'cdPyCode',
          align: 'center'
        },
        {
          title: '五笔码',
          minWidth: 90,
          key: 'cdWbCode',
          align: 'center'
        },
        {
          title: '自定义码',
          key: 'cdCustCode',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '建议内容',
          key: 'cdSuggestion',
          minWidth: 200,
          align: 'center',
          tooltip: true
        },
        {
          title: '状态',
          minWidth: 100,
          slot: 'cdStatus',
          key: 'cdStatus',
          align: 'center'
        }
      ],
      tableData: [],
      curActive: '',

      keyword: '', // 搜索科室输入
      keywords: '', // 搜索疾病信息输入
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      curIndex: -1, // 当前选中的表格行
      curDisease: '', // 当前选中的疾病名称
      curCdId: '', // 当前选中的疾病对应的id
      curSuggestion: '' // // 当前选中的疾病对应的建议
    }
  },
  created () {
    this.curActive = 'all'
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
    this.getList()
  },
  computed: {
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
    roomFilter () {
      this.curActive = ''
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
    }
  },
  methods: {
    // 取消选择疾病名称并关闭当前对话框
    cancel () {
      this.$emit('close')
    },
    // 选择疾病对应的疾病建议并关系当前对话框
    selected () {
      this.$emit('close')
      this.$emit('getDiseaseSuggest', {
        cdSuggestion: this.curSuggestion,
        diseaseName: this.curDisease
      })
    },
    // 点击获取疾病名称
    getDiseaseSuggestInfo (val, index) {
      console.log(val)
      // console.log(index);
      // console.log(val.cdDiseaseName);
      this.curIndex = index
      this.curSuggestion = val.cdSuggestion
      this.curDisease = val.diseaseName
    },
    // 高亮选中行-蓝色
    rowClassName (row, index) {
      if (index === this.curIndex) {
        return 'click-row'
      }
    },

    // 右键菜单关键字搜索
    rightMenuSearch (words) {
      this.keywords = words
      this.$nextTick(() => {
        this.$refs.keywordsInput.focus()
      })
      this.getList()
    },

    getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        deptId: this.deptId,
        searchField: this.keywords.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictSuggestList(pagination, params)
        .then(({ data }) => {
          console.log(data)
          this.isLoading = false
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.tableData = res.records
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },
    // 获取科室组合数据
    getComboList (item, index) {
      this.curActive = index
      this.keywords = ''
      let page = 1
      let size = this.pageSize

      let pagination = {
        page,
        size
      }
      if (Object.keys(item).length == 0) {
        this.deptId = ''
      } else {
        this.deptId = item.poId
      }
      let params = {
        deptId: this.deptId,
        searchField: this.keywords.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictSuggestList(pagination, params)
        .then(({ data }) => {
          console.log(data)
          this.isLoading = false
          if (data.code == 0) {
            this.tableData = data.data.records
            this.totalSize = data.data.total
            console.log(this.tableData)
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
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
.disease-suggest-modal {
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

.disease-suggest-body {
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
  .disease-suggest-right {
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
