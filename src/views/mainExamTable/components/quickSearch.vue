<template>
  <div>
    <Modal v-model="isVisible"
           :mask-closable="false"
           @on-cancel="closeModal"
           title="快捷搜索疾病"
           :width="1200"
           class="quick-search-wrapper">
      <div class="modal-body">
        <div class="left-side-wrapper">
          <div class="search-box">
            <Input search
                   enter-button
                   placeholder="搜索疾病分类"
                   size="small"
                   v-model="deptKeyword" />
          </div>
          <ul class="dept-list-wrapper">
            <li v-if="deptKeyword == ''"
                :class="{'is-actived': curActive === 'all'}"
                @click="getList('')">全部</li>
            <li :class="{'is-actived': curActive === item.poId}"
                v-for="(item, index) in roomFilter"
                @click="getList(item)"
                :key="index">{{item.poDeptName }}</li>
          </ul>
        </div>
        <div class="right-side-wrapper">
          <div class="disease-search-wrapper">
            <Input search
                   enter-button
                   style="width: 200px"
                   v-model="diseaseKeyWord"
                   @on-search="getList('')"
                   placeholder="搜索疾病名称" />
          </div>
          <vxe-table class="mytable-footer"
                     border
                     align="center"
                     show-footer
                     :auto-resize="true"
                     highlight-hover-row
                     row-class-name="table-row"
                     header-row-class-name="table-row"
                     :height="350"
                     :data="tableData"
                     :loading="isLoading">
            <vxe-table-column field="cdDiseaseName"
                              title="疾病名称"
                              show-overflow="title"
                              width="160"></vxe-table-column>
            <vxe-table-column field="deptName"
                              title="科室"
                              show-overflow="title"
                              width="120"></vxe-table-column>
            <vxe-table-column field="suggestion"
                              title="疾病建议"
                              show-overflow="title"
                              min-width="180"></vxe-table-column>
            <vxe-table-column field="knowledge"
                              title="疾病科普"
                              show-overflow="title"
                              min-width="180"></vxe-table-column>
            <vxe-table-column field="cdStatus"
                              title="状态"
                              width="100">
              <template v-slot="{row}">
                <Tag color="green"
                     v-if="row.cdStatus == 0">启用</Tag>
                <Tag color="orange"
                     v-else>停用</Tag>
              </template>
            </vxe-table-column>
            <vxe-table-column field="action"
                              title="操作"
                              fixed="right"
                              width="100">
              <template v-slot="{row}">
                <Button type="primary"
                        style="margin-left: 8px;"
                        @click="add(row)"
                        size="small">添加</Button>
              </template>
            </vxe-table-column>
          </vxe-table>
          <div class="pagination-wrapper">
            <Page :total="totalSize"
                  :page-size="pageSize"
                  :current="pageIndex"
                  @on-change="pageIndexChange"
                  size="small"
                  show-elevator
                  show-total />
          </div>
          <div class="bottom-wrapper">
            <div class="bottom-content-wrapper">
              <div class="header">本次添加的建议内容</div>
              <div class="cont">
                <Input v-model="suggestCont"
                       type="textarea"
                       style="width: 100%;"
                       :autosize="{minRows: 6,maxRows: 6}"
                       placeholder="" />
              </div>
            </div>
            <div class="bottom-content-wrapper">
              <div class="header">本次添加的科普内容</div>
              <div class="cont">
                <Input v-model="knowledgeCont"
                       type="textarea"
                       style="width: 100%;"
                       :autosize="{minRows: 6,maxRows: 6}"
                       placeholder="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="closeModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="save">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { dictDiseaseList } from '@/api/busdict_diseaseInfo'

export default {
  props: {
    title: Number,
    visible: Boolean
  },
  data () {
    return {
      isLoading: false,
      curActive: 'all', // 当前选中科室
      deptKeyword: '',
      diseaseKeyWord: '',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      tableData: [],
      suggestCont: '',
      knowledgeCont: ''
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () {

      }
    },
    roomFilter () {
      if (this.deptKeyword == '') {
        return this.$store.getters.getRoomDict
      }
      let arr = this.roomDict
      let newArr = []
      arr.forEach(item => {
        if (item.poDeptName.indexOf(this.deptKeyword) >= 0) {
          newArr.push(item)
        }
      })
      return newArr
    }
  },
  mounted () {
    this.$store.dispatch('getRoomDict')
    this.getList('')
  },
  methods: {
    closeModal () {
      this.suggestCont = ''
      this.knowledgeCont = ''
      this.curActive = 'all'
      this.deptKeyword = ''
      this.diseaseKeyWord = ''
      this.tableData = []
      this.totalSize = 0
      this.pageSize = 20
      this.pageIndex = 1
      this.$emit('close')
    },
    save () {
      const obj = {
        suggestCont: this.suggestCont,
        knowledgeCont: this.knowledgeCont
      }
      this.$emit('upDateData', obj)
      this.closeModal()
    },
    init (val) {
      this.diseaseKeyWord = val
      this.getList('')
    },

    // 获取疾病数据
    getList (obj, page = 1, size = 20) {
      if (this.isLoading) return false

      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params;

      if (obj === '') {
        this.curActive = 'all'
        params = {
          cdDiseaseTypeId: '',
          cdDeptId: '',
          searchField: this.diseaseKeyWord.trim()
        }
      } else {
        this.curActive = obj.poId
        params = {
          cdDiseaseTypeId: obj.cdId,
          cdDeptId: obj.poId,
          searchField: this.diseaseKeyWord.trim()
        }
      }
      this.isLoading = true

      dictDiseaseList(pagination, params).then(({ data }) => {
        // console.log(data)
        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.totalSize = data.data.total
        } else {
          this.tableData = []
          this.totalSize = 0
          this.$Message.error(data.message)
        }
      }).catch(err => {
        this.isLoading = false
        this.$Message.error(err.message)
      })
    },

    // 添加数据
    add (row) {
      if (row.suggestion) {
        this.suggestCont = '*' + row.cdDiseaseName + '：' + row.suggestion + '\n\n' + this.suggestCont
      }
      if (row.knowledge) {
        this.knowledgeCont = '*' + row.cdDiseaseName + '：' + row.knowledge + '\n\n' + this.knowledgeCont
      }
    },

    // 切换页码
    pageIndexChange (val) {
      this.getList('', val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.getList('', 1, val)
    }
  }
}
</script>
<style lang="less">
.quick-search-wrapper {
  .modal-body {
    width: 100%;
    height: auto;
    display: flex;
    .left-side-wrapper {
      margin-right: 15px;
      height: auto;
      .search-box {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .ivu-input-wrapper {
          width: inherit;
        }
      }
      .dept-list-wrapper {
        margin-top: 15px;
        max-height: calc(~'100% - 45px');
        height: 610px;
        overflow-y: auto;
        li {
          white-space: nowrap;
          padding-left: 10px;
          text-align: center;
          height: 30px;
          color: #252525;
          line-height: 30px;
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
    .right-side-wrapper {
      flex: 1;
      overflow: hidden;
      height: auto;
      .disease-search-wrapper {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 12px;
      }
      .pagination-wrapper {
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: center;
        margin-top: 12px;
      }
      .bottom-wrapper {
        width: 100%;
        height: auto;
        display: flex;
        border-top: 1px solid #e6e6e6;
        padding-top: 10px;
        .bottom-content-wrapper {
          flex: 1;
          .header {
            color: #2d8cf0;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
          }
        }
        .bottom-content-wrapper:last-child {
          margin-left: 10px;
        }
      }
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
