<template>
  <div class="pop-body">
    <div class="search-demo-wrapper">
      <span class="demo-title">示例模板列表</span>
      <Input search
             enter-button
             style="width: 210px"
             v-model="keyword"
             @on-search="getDemoList()"
             placeholder="搜索示例" />
    </div>
    <Table :columns="popColumns"
           :data="tableData"
           :loading="popLoading"
           style="width: 100%;"
           height="400">
      <template slot="action"
                slot-scope="{row}">

        <Button type="default"
                @click="choseDemoHandle(row.demo)"
                size="small">选择</Button>
      </template>
    </Table>
    <div class="pop-footer">
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
  </div>
</template>
<script>
import { suggest, medicalHistory, conclusion } from '@/api/record_result'
export default {
  data () {
    return {
      popColumns: [
        {
          title: '示例',
          key: 'demo',
          align: 'left',
          minWidth: 100
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 100
        }
      ],
      poptipData: [],
      popLoading: false,
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      deptId: '', // 当前组合科室ID
      curTab: 'branchTip', // 当前tab 默认分科小结
      keyword: ''
    }
  },
  mounted () {
  },
  methods: {
    choseDemoHandle (str) {
      this.$emit('updateDemo', str)
    },
    // 获取示例列表
    getDemoList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size
      if (this.deptId == '') {
        return false
      }

      let params = {
        deptId: this.deptId,
        search: this.keyword
      }
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      this.popLoading = true
      if (this.curTab == 'branchTip') {
        conclusion(pagination, params).then(({ data }) => {
          this.popLoading = false
          if (data.code == 0) {
            let result = data.data.records
            this.totalSize = data.data.total
            let arr = []
            result.forEach(ele => {
              let obj = {}
              obj.demo = ele.cbConclusion
              obj.demoId = ele.cbId
              arr.push(obj)
            });
            this.tableData = arr
          }
        })
      } else if (this.curTab == 'branchAdvice') {
        suggest(pagination, params).then(({ data }) => {
          this.popLoading = false
          if (data.code == 0) {
            let result = data.data.records
            this.totalSize = data.data.total
            let arr = []
            result.forEach(ele => {
              let obj = {}
              obj.demo = ele.coSuggesion
              obj.demoId = ele.coId
              arr.push(obj)
            });
            this.tableData = arr
          }
        })
      } else if (this.curTab == 'branchHistory') {
        medicalHistory(pagination, params).then(({ data }) => {
          this.popLoading = false
          if (data.code == 0) {
            let result = data.data.records
            this.totalSize = data.data.total
            let arr = []
            result.forEach(ele => {
              let obj = {}
              obj.demo = ele.coMedicalHistory
              obj.demoId = ele.coId
              arr.push(obj)
            });
            this.tableData = arr
          }
        })
      } else {
        this.popLoading = false
      }
    },
    getCurTab (curTab) {
      this.curTab = curTab || 'branchTip'
      this.getDemoList(1, 20)
    },
    // 获取当前组合科室
    getCurDept (deptId) {
      this.deptId = deptId || ''
    },
    // 切换页码
    pageIndexChange (val) {
      this.getDemoList(val, 20)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getDemoList(1, val)
    },
  },
}
</script>
<style lang="less">
.pop-body {
  .search-demo-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .demo-title {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
.pop-footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>