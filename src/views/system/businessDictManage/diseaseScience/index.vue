<template>
  <div class="disease-science-wrapper">
    <Card class="disease-info-left"
          shadow>
      <div class="search-box">
        <Input search
               enter-button
               placeholder="搜索科室"
               size="small"
               style="width: 200px"
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
    </Card>
    <Card class="disease-info-right">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">体检疾病科普字典</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 v-model="keywords"
                 style="width: 200px"
                 @on-search="getList()"
                 placeholder="搜索疾病名称" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="add">新增</Button>
          <!-- <Button type="error"
                        style="margin-left: 8px;"
                        @click="deleteAllHandle"
                        :disabled="selections.length == 0">批量删除</Button> -->
        </div>
      </div>
      <div class="page-body clearfix">
        <Table :columns="columns"
               :data="tableData"
               :loading="isLoading"
               @on-selection-change="selectChange">
          <template slot="cdType"
                    slot-scope="{row}">
            {{row.cdType == '2' ? '疾病诊断' : '阳性发现'}}
          </template>
          <template slot="cdStatus"
                    slot-scope="{row}">
            <!-- {{row.cdStatus == '0' ? '启用' : '停用'}} -->
            <Tag color="green"
                 v-if="row.cdStatus == 0">启用</Tag>
            <Tag color="orange"
                 v-else>停用</Tag>
          </template>
          <template slot="action"
                    slot-scope="{row}">
            <Button :type="row.cdStatus == 0 ? 'error' : 'default'"
                    v-permission="['edit']"
                    @click="statusChange(row)"
                    size="small">{{row.cdStatus == 0 ? '停用' : '启用'}}</Button>
            <Button type="default"
                    style="margin-left: 8px;"
                    @click="edit(row)"
                    size="small">修改</Button>
            <Button type="error"
                    style="margin-left: 8px;"
                    @click="deleteData(row)"
                    size="small">删除</Button>
          </template>
        </Table>
        <div class="page-footer">
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
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          :diseaseName="curDiseaseName"
          :cdPyCode="curPyCode"
          :cdWbCode="curWbCode"
          :curCdId="curCdId"
          :diseaseType="curDiseaseType"
          :diseaseTypeId="curDiseaseTypeId"
          @close="closeEditModal"
          @openDiseaseList="openDiseaseList"
          @updateList="getList(pageIndex, pageSize)"></Edit>
    <disease-list :visible="listVisible"
                  ref="diseaseList"
                  @cancel="diseaseUnselected"
                  @selected="diseaseSelected"
                  @getDiseaseName="getDiseaseName" />
  </div>
</template>

<script>
import {
  dictDiseaseKnowledgetList,
  dictDiseaseKnowledgeDelete,
  dictDiseaseKnowledgeStatus
} from '@/api/busdict_diseaseScience.js'
import Edit from './edit'
import DiseaseList from '@/views/system/businessDictManage/components/diseaseList/index'

export default {
  name: 'diseaseScience',
  components: {
    Edit,
    DiseaseList
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
          key: 'cdDiseaseName',
          minWidth: 300,
          align: 'center'
        },
        {
          title: '科室',
          key: 'cdDeptName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '类型',
          slot: 'cdType',
          key: 'cdType',
          minWidth: 95,
          align: 'center'
        },
        {
          title: '疾病分类',
          key: 'cdDiseaseType',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '科普知识',
          key: 'cdKnowledge',
          align: 'center',
          minWidth: 400,
          render: (h, params) => {
            let texts = ''
            if (params.row.cdKnowledge && params.row.cdKnowledge !== null) {
              if (params.row.cdKnowledge.length > 25) {
                texts = params.row.cdKnowledge.substring(0, 25) + '...'
              } else {
                texts = params.row.cdKnowledge
              }
            }
            return h(
              'Tooltip',
              {
                props: {
                  maxWidth: 500,
                  placement: 'top',
                  transfer: true
                }
              },
              [
                texts,
                h(
                  'span',
                  {
                    slot: 'content',
                    style: {
                      whiteSpace: 'normal',
                      wordBreak: 'break-all'
                    }
                  },
                  params.row.cdKnowledge
                )
              ]
            )
          }
        },
        {
          title: '状态',
          minWidth: 90,
          slot: 'cdStatus',
          key: 'cdStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          fixed: 'right',
          align: 'center'
        }
      ],
      tableData: [],
      keyword: '',
      keywords: '',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      listVisible: false, // 疾病列表弹出框
      deleteModalVisible: false,
      isLoading: false,
      selections: [], // 表格勾选项集合
      curDiseaseName: '', // 已选中的疾病名称
      curPyCode: '', // 已选中的疾病名称拼音码
      curWbCode: '', // 已选中的疾病名称五笔码
      curCdId: '', // 已选中的疾病对应的id,
      curDiseaseType: '', // 已选中的疾病对应的疾病类型
      curDiseaseTypeId: '', // 已选中的疾病对应的疾病类型Id
      curActive: 'all',
      deptId: '' // 当前选择科室的id
    }
  },
  computed: {
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
  created () { },
  mounted () {
    this.$store.dispatch('getRoomDict')
    this.getList()
    this.$nextTick(() => {
      this.curActive = 'all'
    })
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
        deptId: this.deptId,
        searchField: this.keywords.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictDiseaseKnowledgetList(pagination, params)
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
    add () {
      this.modalTitle = 0
      this.editModalVisible = true
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    edit (row) {
      this.modalTitle = 1
      this.editModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      console.log(row)
      this.curDiseaseName = row.cdDiseaseName
      this.curCdId = row.cdId
      let params = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList(params)
      })
    },
    statusChange (row) {
      let status = '0'
      let msg = ''
      if (row.cdStatus == 0) {
        status = '1'
        msg = '停用'
      } else {
        status = '0'
        msg = '启用'
      }

      this.$Modal.confirm({
        title: '提示',
        content: `是否${msg}？`,
        onOk: () => {
          let params = {
            cdStatus: status,
            cdId: row.cdId
          }
          dictDiseaseKnowledgeStatus(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$Message.success(`已${msg}`)
                this.getList(this.pageIndex, this.pageSize)
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.$Message.error('网络不稳定，请稍后重试')
            })
        },
        onCancel: () => { }
      })
    },
    deleteData (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          dictDiseaseKnowledgeDelete(params)
            .then(({ data }) => {
              if (data.code == 0) {
                this.$Message.success(`删除成功`)
                let len = this.tableData.length - 1
                if (len > 0) {
                  this.getList(this.pageIndex, this.pageSize)
                } else if (this.pageIndex != 1) {
                  this.pageIndex = --this.pageIndex
                  this.getList(this.pageIndex, this.pageSize)
                } else {
                  this.getList(this.pageIndex, this.pageSize)
                }
              } else {
                this.$Message.error(data.message)
              }
            })
            .catch(err => {
              this.$Message.error('网络不稳定，请稍后重试')
            })
        },
        onCancel: () => { }
      })
    },
    getComboList (item, index) {
      this.curActive = index
      this.keywords = ''
      let page = 1
      let size = 20
      let pagination = {
        page,
        size
      }
      let params
      if (Object.keys(item).length == 0) {
        this.deptId = ''
        params = {
          deptId: this.deptId,
          searchField: this.keywords.trim()
        }
      } else {
        this.deptId = item.poId
        params = {
          deptId: this.deptId,
          searchField: this.keywords.trim()
        }
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      dictDiseaseKnowledgetList(pagination, params)
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
    selectChange (val) {
      this.selections = val
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getList(val, this.pageSize)
    },

    // 改变每页显示数
    pageSizeChange (val) {
      this.pageSize = val
      this.getList(1, val)
    },
    deleteAllHandle () {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除所选数据？',
        onOk: () => {
          // 选中的疾病名称
          let diseaseNames = []
          this.selections.map(item => {
            diseaseNames.push(item.ICDCode)
          })
          // identifyDelete(diseaseNames).then(({ data }) => {
          //   if (data.code == 0) {
          //     this.$Message.success(`删除成功`)
          //     this.getList()
          //   } else {
          //     this.$Message.error(data.message)
          //   }
          // }).catch(err => {
          //   this.$Message.error('网络不稳定，请稍后重试')
          // })
        },
        onCancel: () => { }
      })
    },
    // 关闭编辑框, 并清空编辑框的疾病名称的数据
    closeEditModal () {
      this.editModalVisible = false
      this.curDiseaseName = ''
      this.curCdId = ''
      this.curPyCode = ''
      this.curWbCode = ''
    },
    // 打开疾病列表对话框，关闭疾病科普编辑框
    openDiseaseList (visible) {
      this.listVisible = visible
      this.editModalVisible = false
      this.$nextTick(() => {
        this.$refs.diseaseList.getComboList({}, 'all')
      })
    },
    // 关闭疾病列表对话框，打开疾病科普编辑框
    diseaseSelected (listVisible) {
      this.listVisible = listVisible
      this.editModalVisible = true
      this.curDiseaseTypeId = ''
    },
    // 疾病列表框点击取消后，返回疾病科普编辑框
    diseaseUnselected () {
      this.listVisible = false
      this.editModalVisible = true
      this.curDiseaseTypeId = ''
      // this.curDiseaseName = ''
      // this.curCdId = ''
    },
    // 获取选中的疾病名称
    getDiseaseName (val) {
      console.log(val)
      this.curDiseaseName = val.curDisease
      this.curCdId = val.cdId
      this.curDiseaseType = val.curDiseaseType
      this.curDiseaseTypeId = val.curDiseaseTypeId
      this.curPyCode = val.curPyCode
      this.curWbCode = val.curWbCode
    }
  }
}
</script>

<style lang="less">
.disease-science-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  // justify-content: flex-start;
  overflow: hidden;
  .disease-info-left {
    background-color: #fff;
    width: 20%;
    .ivu-card-body {
      height: 100%;
    }
    .search-box {
      width: 100%;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .disease-list {
      margin-top: 15px;
      max-height: calc(~'100% - 45px');
      max-height: 700px;
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
    }
  }
  .disease-info-right {
    width: 80%;
    // overflow: hidden;
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
    .ivu-card-body {
      width: 100%;
      height: calc(~'100% - 60px');
      padding-bottom: 0;
      .page-body {
        height: 100%;
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // .ivu-table-wrapper {
        //   position: relative;
        //   width: 100%;
        //   overflow: hidden;
        //   .ivu-table-column-center .ivu-table-cell {
        //     display: inline-block;
        //     margin: auto;
        //     height: 100%;
        //     vertical-align: middle;
        //   }
        //   .ivu-tooltip {
        //     height: 100%;
        //   }
        //   .ivu-tooltip-rel {
        //     height: 100%;
        //   }
        //   .ivu-table-cell-tooltip-content {
        //     height: 100%;
        //     text-align: center;
        //   }

        // }
        .page-footer {
          position: relative;
          bottom: 0;
        }
      }
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
</style>
