<template>
  <div class="disease-info-wrapper">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">疾病信息维护</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 style="width: 200px"
                 v-model="keywords"
                 @on-search="getList()"
                 placeholder="搜索疾病名称" />
          <Button type="primary"
                  style="margin-left: 8px;"
                  @click="add">新增疾病</Button>
        </div>
      </div>
      <div class="main-body">
        <div class="main-body-wrapper">
          <div class="main-left-part">
            <div class="search-box">
              <Input search
                     enter-button
                     placeholder="搜索疾病分类"
                     size="small"
                     v-model="keyword" />
            </div>
            <ul class="disease-list">
              <li v-if="keyword == ''"
                  :class="{'is-actived': curActive === 'all'}"
                  @click="getComboList({},'all')">全部</li>
              <li :class="{'is-actived': curActive === item.poId}"
                  v-for="(item, index) in roomFilter"
                  @click="getComboList(item)"
                  :key="index">{{item.poDeptName }}</li>
            </ul>
          </div>
          <div class="main-right-part">
            <vxe-table class="mytable-footer"
                       border
                       align="center"
                       show-footer
                       :auto-resize="true"
                       highlight-hover-row
                       row-class-name="table-row"
                       header-row-class-name="table-row"
                       :height="(screenHeight - 320) <= 500 ? 500 : (screenHeight - 320)"
                       :data="tableData"
                       :loading="isLoading">
              <vxe-table-column field="cdDiseaseName"
                                title="疾病名称"
                                show-overflow="tooltip"
                                width="160"></vxe-table-column>
              <vxe-table-column field="deptName"
                                title="科室"
                                width="120"></vxe-table-column>
              <vxe-table-column field="suggestion"
                                title="疾病建议"
                                show-overflow="tooltip"
                                min-width="180"></vxe-table-column>
              <vxe-table-column field="knowledge"
                                title="疾病科普"
                                show-overflow="tooltip"
                                min-width="180"></vxe-table-column>
              <vxe-table-column field="cdStatus"
                                title="状态"
                                width="120">
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
                                width="200">
                <template v-slot="{row}">
                  <Button :type="row.cdStatus == 1 ? 'default' : 'error'"
                          v-permission="['edit']"
                          @click.stop="statusChange(row)"
                          size="small">{{row.cdStatus == 1 ? '启用' : '停用'}}</Button>
                  <Button type="default"
                          style="margin-left: 8px;"
                          v-permission="['edit']"
                          @click.stop="edit(row)"
                          size="small">修改</Button>
                  <Button type="error"
                          style="margin-left: 8px;"
                          v-permission="['del']"
                          @click.stop="deleteData(row)"
                          size="small">删除</Button>
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
          </div>
        </div>
      </div>
    </Card>
    <Edit :title="modalTitle"
          :visible="editModalVisible"
          ref="editwrapper"
          :ICD10Name="curICD10Name"
          :ICD10Id="curICD10Id"
          :ICD10Code="curICD10Code"
          @openICD10List="openICD10List"
          @close="closeEditModal"
          @updateList="getList(pageIndex, pageSize)"></Edit>
    <Icd10-list :visible="ICD10Visible"
                @cancel="ICD10Unselected"
                @selected="ICD10Selected"
                @getICD10Name="getICD10Name"
                @close="closeICD10Modal"></Icd10-list>
  </div>
</template>

<script>
import { dictDiseaseList, dictDiseaseDelete, dictDiseaseStatus, dictDiseaseInfo } from '@/api/busdict_diseaseInfo.js'
import Edit from './edit'
import Icd10List from './ICD10List'

export default {
  name: 'diseaseInfo',
  components: {
    Edit,
    Icd10List
  },
  data () {
    return {
      screenHeight: document.body.clientHeight,
      tableData: [],
      curActive: '',
      totalSize: 0,
      pageIndex: 1,
      pageSize: 10,
      modalTitle: 0, // 弹出框title，0为新增，1为编辑
      listVisible: false, // 疾病列表弹出框
      editModalVisible: false,
      deleteModalVisible: false,
      isLoading: false,
      keyword: '', // 搜索疾病分类输入
      keywords: '', // 搜索疾病信息输入
      curCdId: '',
      ICD10Visible: false,
      curICD10Name: '',
      curICD10Id: '',
      curICD10Code: '',
      curDeptId: '', // 当前选中科室id
    }
  },
  watch: {
    screenHeight (val) {
      if (!this.timer) {
        this.screenHeight = val
        this.timer = true
        let that = this
        setTimeout(() => {
          that.timer = false
        }, 300)
      }
    }
  },
  computed: {
    diseaseType: {
      get: function () {
        return this.$store.getters.getDiseaseType
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
    // 动态计算可视窗口高度
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
    this.$store.dispatch('getRoomDict')
    this.$store.dispatch('getDiseaseType')
    // 获取疾病信息维护列表
    this.getList()
    this.$nextTick(() => {
      this.curActive = 'all'
    })
  },
  methods: {
    getList (page = 1, size = 20) {
      this.curCdId = ''
      this.pageIndex = page
      this.pageSize = size

      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        cdDiseaseTypeId: this.cdDiseaseTypeId,
        cdDeptId: this.curDeptId,
        searchField: this.keywords.trim()
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      console.log(params)
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
    add () {
      this.modalTitle = 0
      this.editModalVisible = true
      this.curICD10Name = ''
      this.curICD10Id = ''
      this.$nextTick(() => {
        this.$refs.editwrapper.getItemList({})
      })
    },
    edit (row) {
      this.modalTitle = 1
      this.editModalVisible = true
      // 必须对row做拷贝，否则修改弹窗的表单会对row的数据有影响
      this.curICD10Name = row.cdIcdName
      this.curICD10Id = row.cdId
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
          dictDiseaseStatus(params).then(({ data }) => {
            if (data.code == 0) {
              this.$Message.success(`已${msg}`)
              this.getList(this.pageIndex, this.pageSize)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
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
          dictDiseaseDelete(params).then(({ data }) => {
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
          }).catch(err => {
            this.$Message.error('网络不稳定，请稍后重试')
          })
        },
        onCancel: () => {

        }
      })
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

    // 获取科室组合数据
    getComboList (item, index) {
      this.curActive = index || item.poId
      this.keywords = ''
      this.pageIndex = 1
      let page = this.pageIndex
      let size = this.pageSize

      let pagination = {
        page,
        size
      }
      let params
      if (Object.keys(item).length == 0) {
        this.cdDiseaseTypeId = ''
        this.curCdId = ''
        this.curDeptId = ''
        // console.log('点击的全部')
        params = {
          cdDiseaseTypeId: this.cdDiseaseTypeId,
          cdDeptId: this.curDeptId,
          searchField: this.keywords.trim()
        }
      } else {
        this.cdDiseaseTypeId = item.cdId
        this.curDeptId = item.poId
        params = {
          cdDiseaseTypeId: this.cdDiseaseTypeId,
          cdDeptId: this.curDeptId,
          searchField: this.keywords.trim()
        }
      }
      if (this.isLoading) {
        return false
      }
      this.isLoading = true
      console.log(params)
      dictDiseaseList(pagination, params).then(({ data }) => {
        // console.log(data)
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

    // 关闭编辑框, 并清空编辑框的疾病名称的数据
    closeEditModal () {
      this.editModalVisible = false
      this.curICD10Id = ''
      this.curICD10Code = ''
    },

    // 点击取消，关闭ICD10列表框，返回编辑框
    ICD10Unselected () {
      this.ICD10Visible = false
      this.editModalVisible = true
      this.curICD10Name = ''
      this.curICD10Id = ''
      this.curICD10Code = ''
    },
    // 点击选择，关闭ICD10列表框，打开编辑框
    ICD10Selected (visible) {
      this.ICD10Visible = visible
      this.editModalVisible = true
    },
    // 获取选中的疾病名称
    getICD10Name (val) {
      console.log(val)
      this.curICD10Name = val.curICD10Name
      this.curICD10Id = val.curICD10Id
      this.curICD10Code = val.curICDCode
    },
    // 打开ICD10列表对话框，关闭编辑框
    openICD10List (visible) {
      this.ICD10Visible = visible
      this.editModalVisible = false
    },
    closeICD10Modal () {
      this.ICD10Visible = false,
        this.editModalVisible = true
    }
  }
}
</script>

<style lang="less">
.disease-info-wrapper {
  width: 100%;
  min-width: 1200px;
  display: flex;
  height: inherit;
  max-height: calc(~'100% - 80px');
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
  .main-body-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    .main-left-part {
      margin-right: 10px;
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
      .disease-list {
        margin-top: 15px;
        max-height: calc(~'100% - 45px');
        height: 610px;
        overflow-y: auto;
        li {
          white-space: nowrap;
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
    .main-right-part {
      flex: 1;
      overflow: hidden;
      height: auto;
      .pagination-wrapper {
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: center;
        margin-top: 24px;
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
}
</style>
