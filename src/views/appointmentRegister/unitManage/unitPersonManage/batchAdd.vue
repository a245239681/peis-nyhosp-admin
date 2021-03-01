<template>
  <div>
    <Modal class="batch-add-item-popup modal"
           v-model="isVisible"
           @on-cancel="closeBatchAddModal"
           :mask-closable="false"
           title="批量加项"
           width="900">
      <div slot="header"
           class="search-title-wrapper">
        <span class="title">选择体检项目</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keywords"
                 size="small"
                 @on-search="getList()"
                 placeholder="简码搜索" />
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
                @click="getSearchList({},'all')">全部</li>
            <li :class="{'is-actived': curActive === index}"
                v-for="(item, index) in roomFilter"
                @click="getSearchList(item,index)"
                :key="index">{{item.poDeptName}}</li>
          </ul>
        </div>
        <div class="combit-item-wrapper">
          <Table :columns="columns"
                 :loading="isLoading"
                 highlight-row
                 @on-row-click="getItemName"
                 :row-class-name="rowClassName"
                 height="540"
                 :data="tableData">
          </Table>
        </div>
      </div>
     <div slot="footer">
          <span style="margin-right:58%">已选xx项</span>
          <Button @click="closeBatchAddModal">取消</Button>
          <Button type="primary"
                  @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { itemResultsList } from '@/api/busdict_physicalExamResultsTemplate.js'

export default {
  name: 'add',
  props: {
    visible: Boolean,
  },
  data () {
    return {
      curActive: 'all',
      totalSize: 100,
      pageIndex: 1,
      pageSize: 10,
      keyword: '',  // 搜索科室输入
      keywords: '', // 搜索输入
      columns: [
        {
          width: 55,
          type: 'selection',
          align: 'center'
        },
        {
          title: '组合名称',
          key: 'paItemName',
          align: 'center'
        },
        {
          title: '项目类型',
          key: 'paDeptName',
          align: 'center'
        },
        {
          title: '组合编号',
          key: 'paPrice',
          align: 'center'
        },
        {
          title: '单价',
          key: 'paType',
          align: 'center'
        },
      ],
      tableData: [],
      isLoading: false,
      curIndex: -1, //当前选中的表格行
      curItemName: '', //当前选中的疾病名称
      curItemId: '', // 当前选中的疾病对应的id
      curDeptId: '', // 当前选中的体检项目对应的科室id
      searchDeptId: '' // 当前选中科室对应的id
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    },
    showButton () {
      return (this.name == 0 ? true : false);
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
      });
      return newArr
    },

  },
  mounted () {
    this.$store.dispatch('getRoomDict')

  },
  methods: {
    closeBatchAddModal () {
      this.$emit('close');
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
        deptId: this.searchDeptId,
        searchField: this.keywords.trim()
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
      console.log(node.expanded)
    },
    //高亮选中行-蓝色
    rowClassName (row, index) {
      if (index == this.curIndex) {
        return 'click-row';
      }
    },
    //选择疾病名称并关系当前对话框
    // save () {
    //   console.log('hello')
    //   this.$emit('selected', false);
    //   this.$emit('getItemName', {
    //     curItemName: this.curItemName,
    //     curItemId: this.curItemId,
    //     curDeptId: this.curDeptId
    //   });
    // },
    getSearchList (item, index) {
      this.curActive = index
      this.pageIndex = 1

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize

      }
      let params
      if (Object.keys(item).length == 0) {
        this.searchDeptId = ''
        params = {
          deptId: this.searchDeptId,
          searchField: this.keyword.trim()
        }
      } else {
        this.searchDeptId = item.poId
        params = {
          deptId: this.searchDeptId,
          searchField: this.keyword.trim()
        }
      }
      this.isLoading = true
      console.log(pagination)
      console.log(params)
      itemResultsList(pagination, params).then(({ data }) => {
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
    getItemName (val, index) {
      console.log(val)
      this.curIndex = index;
      this.curItemName = val.paItemName;
      this.curItemId = val.paId
      this.curDeptId = val.paDeptId
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
    },
  }
}
</script>
<style lang="less" >
.batch-add-item-popup {
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
    // .page-table {
    //   margin-top: 5px;
    //   text-align: center;
    // }
  }
  .room-selected-wrapper {
    width: 20%;
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
