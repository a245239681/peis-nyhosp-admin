<template>
  <div class="physical-exam-edit2">
    <Modal class='modal'
           v-model="isVisible"
           @on-ok="selected"
           @on-cancel="closeModal"
           :title="showTitle"
           ok-text="选择"
           cancel-text="取消"
           draggable>
      <div slot="header"
           class="search-title-wrapper">
        <div class='top-header'>
          <!-- <Input search
                 v-if='showButton'
                 enter-button
                 size="small"
                 style="width: 200px" /> -->
          <span class="title"
                style='margin-left:20px'>选择体检项目</span>
        </div>
        <Input search
               enter-button
               size="small"
               v-model="keyword"
               style="width: 200px"
               placeholder="搜索" />
      </div>
      <div class='physical-exam-edit2-body'>
        <Card class='body-left'
              :bordered="false"
              shadow>
          <div class="room-selected-wrapper">
            <Input search
                   enter-button
                   size="small"
                   v-model="keywordLb"
                   placeholder="搜索科室" />
            <ul class="room-list-wrapper">
              <li v-if="keywordLb == ''"
                  :class="{'is-actived': curActive === 'all'}"
                  @click="getSearchList({},'all')">全部</li>
              <li :class="{'is-actived': curActive === index}"
                  v-for="(item, index) in roomFilter"
                  @click="getSearchList(item,index)"
                  :key="index">{{item.poDeptName}}</li>
            </ul>
          </div>
        </Card>
        <Card class='body-right'
              :bordered="false"
              shadow>
          <div class="page-body clearfix">
            <Table :columns="columns"
                    highlight-row
                    @on-row-click="getItemName"
                    :row-class-name="rowClassName"
                   :data="tableData">
              <!-- <template slot='action'
                        slot-scope="{row}">
                <Button type="primary"
                        size="small">启用</Button>
              </template> -->
            </Table>
          </div>
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
        </Card>
      </div>
    </Modal>
  </div>
</template>

<script>
import { itemResultsList } from '@/api/busdict_physicalExamResultsTemplate.js'

export default {
  props: {
    title: Number,
    visible: Boolean,
    name: Number
  },
  data () {
    return {
      curActive: 'all',
      totalSize: 100,
      pageIndex: 1,
      pageSize: 10,
      keyword: '', // 搜索疾病信息输入
      keywordLb: '', // 搜索科室输入
      columns: [
        {
          title: '项目名称',
          key: 'paItemName',
          align: 'center'
        },
        {
          title: '检查科室',
          key: 'paDeptName',
          align: 'center'
        },
        {
          title: '单价',
          key: 'paPrice',
          align: 'center'
        },
        {
          title: '临床类型',
          key: 'customCode',
          align: 'center'
        },
        {
          title: '状态',
          key: 'paStatus',
          width: 100,
          align: 'center'
        }
        // {
        //   title: 'ICD名称',
        //   key: 'ICDName',
        //   align: 'center'
        // }
      ],
      tableData: [],
      curIndex: -1, // 当前选中的表格行
      curItemName: '', // 当前选中的疾病名称
      curItemId: '', // 当前选中的疾病对应的id
      searchDeptId: '' // 当前选中科室对应的id
    }
  },
  computed: {
    showTitle () {
      return (this.title == 0 ? '选择体检项目' : '编辑体检项目')
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
    roomFilter () {
      this.curActive = ''
      if (this.keywordLb == '') {
        return this.$store.getters.getRoomDict
      }
      let arr = this.roomDict
      let newArr = []
      arr.forEach(item => {
        if (item.poDeptName.indexOf(this.keywordLb) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    }

  },
  created () {
  },
  mounted () {
    this.getList()
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    save () {
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
        searchDeptId: this.searchDeptId,
        searchField: this.keyword.trim()
      }
      this.isLoading = true
      itemResultsList(pagination, params).then(({ data }) => {
        // console.log(data)
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
      // console.log(node.expanded)
    },
    // 高亮选中行-蓝色
    rowClassName (row, index) {
      if (index == this.curIndex) {
        return 'click-row'
      }
    },
    // 选择疾病名称并关系当前对话框
    selected () {
      this.$emit('selected', false)
      this.$emit('getItemName', {
        curItemName: this.curItemName,
        curItemId: this.curItemId
      })
    },
    getSearchList (item, index) {
      this.curActive = index
      this.pageIndex = 1

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize

      }
      let params
      if (Object.keys(item).length == 0) {
        params = {
          searchDeptId: '',
          searchField: this.keyword.trim()
        }
      } else {
        this.searchDeptId = item.poId
        params = {
          searchDeptId: this.searchDeptId,
          searchField: this.keyword.trim()
        }
      }
      this.isLoading = true
      itemResultsList(pagination, params).then(({ data = pa }) => {
        // console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          this.totalSize = data.data.total
          this.tableData = data.data.records
          // console.log(this.tableData)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    getItemName (val, index) {
      console.log(val)
      this.curIndex = index
      this.curItemName = val.paItemName
      this.curItemId = val.paId
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
.ivu-modal-header-inner {
  position: relative;
  padding-left: 8px;
  font-weight: bold;
  &::before {
    content: "";
    width: 3px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #2d8cf0;
  }
}
.search-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .top-header {
    display: flex;
    align-items: center;
  }
}
.physical-exam-edit2-body {
  display: flex;
  flex: 1;
  justify-content: space-between;
  .body-left {
    width: 220px;
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
  .body-right {
    flex-grow: 1;
    padding-left: 10px;
  }
}
.title-wrapper {
  padding: 5px 0;
}
.title {
  padding-left: 8px;
  font-size: 15px;
  position: relative;
  font-weight: bold;
  &::after {
    content: "";
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

.ivu-card-body {
}

.ivu-form-item {
  margin-bottom: 12px;
}
</style>
<style lang='less' scoped>
/deep/.ivu-modal-content {
  width: 1200px !important;
}
/deep/.ivu-card-body {
  padding: 0 !important;
  margin-left: 20px;
}
/deep/.ivu-modal-body {
  padding: 0;
}
</style>
