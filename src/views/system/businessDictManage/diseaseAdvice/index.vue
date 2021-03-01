<template>
  <div class="disease-advice-wrapper">
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
        <span class="title">体检疾病建议</span>
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
          @close="closeEditModal"
          @updateList="getList(pageIndex, pageSize)"
          @openDiseaseList="openDiseaseList"></Edit>
    <disease-list :visible="listVisible"
                  ref="diseasewrapper"
                  @cancel="diseaseUnselected"
                  @selected="diseaseSelected"
                  @getDiseaseName="getDiseaseName" />
  </div>
</template>

<script>
import {
  dictSuggestList,
  dictSuggestionDelete,
  dictDeptSuggestStatus
} from '@/api/busdict_diseaseAdvice.js'
import Edit from './edit'
import DiseaseList from '@/views/system/businessDictManage/components/diseaseList/index'

export default {
  name: 'diseaseAdvice',
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
          key: 'diseaseName',
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
          title: '建议内容',
          key: 'cdSuggestion',
          minWidth: 220,
          align: 'center',
          render: (h, params) => {
            let texts = ''
            if (params.row.cdSuggestion && params.row.cdSuggestion !== null) {
              console.log(params.row.inConclusion)
              if (params.row.cdSuggestion.length > 12) {
                texts = params.row.cdSuggestion.substring(0, 12) + '...'
              } else {
                texts = params.row.cdSuggestion
              }
            }
            return h(
              'Tooltip',
              {
                props: {
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
                  params.row.cdSuggestion
                )
              ]
            )
          }
        },
        {
          title: '状态',
          minWidth: 80,
          slot: 'cdStatus',
          key: 'cdStatus',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 200,
          align: 'center',
          fixed: 'right'
        }
      ],
      tableData: [],
      keyword: '',
      keywords: '',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      curActive: '',
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      editModalVisible: false,
      listVisible: false, // 疾病列表弹出框
      deleteModalVisible: false,
      selections: [], // 表格勾选项集合
      curDiseaseName: '', // 已选中的疾病名称
      curPyCode: '', // 已选中的疾病名称拼音码
      curWbCode: '', // 已选中的疾病名称五笔码
      curCdId: '', // 已选中的疾病对应的id
      deptId: '' // 当前选中科室对应的id
    }
  },
  created () { },
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
      this.curDiseaseName = row.diseaseName
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
          dictDeptSuggestStatus(params)
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
      console.log(row)
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除该条数据？',
        onOk: () => {
          let params = {
            id: row.cdId
          }
          dictSuggestionDelete(params)
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
    // 获取科室组合数据
    getComboList (item, index) {
      this.curActive = index
      this.keywords = ''
      this.pageIndex = 1
      this.pageSize = 20

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
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
      this.curDiseaseTypeId = ''
      this.$nextTick(() => {
        this.$refs.diseasewrapper.getComboList({}, 'all')
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
    },
    // 获取选中的疾病名称
    getDiseaseName (val) {
      this.curDiseaseName = val.curDisease
      this.curCdId = val.cdId
      this.curPyCode = val.curPyCode
      this.curWbCode = val.curWbCode
    }
  }
}
</script>

<style lang="less">
.disease-advice-wrapper {
  width: 100%;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  justify-content: flex-start;
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
      height: 1000px;
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
      height: calc(~'100% - 60px');
      padding-bottom: 0;
      .page-body {
        height: 100%;
        padding-bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .ivu-table-wrapper {
          position: relative;
        }
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
