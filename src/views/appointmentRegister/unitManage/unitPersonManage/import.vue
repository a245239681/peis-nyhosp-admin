<template>
  <div>
    <Modal class="batch-import-popup modal"
           v-model="isVisible"
           width="1100"
           :mask-closable="false"
           @on-ok="handleImport"
           @on-cancel="closeBatchImportModal">
      <div>
        <Tabs value="record"
              ref="tabs"
              @on-click="clickTab">
          <TabPane label="从体检记录导入"
                   name="record">
            <div class="record-import-wrapper">
              <!-- <div class="left-wrapper">
                        <tree-component :data="treeData"
                                        :defaultProps="defaultProps"
                                        :isExpand="isExpand"
                                        ref="tree"
                                        @node-click="handleNodeClick"></tree-component>
                    </div> -->
              <div class="left-wrapper">
                <!-- <Input search
                       enter-button
                       placeholder="搜索公司"
                       v-model="filterText" /> -->
                <ButtonGroup style='margin:15px 0;width:100%'>
                  <Button style="width: 50%"
                          @click="show"
                          type="default">
                    <Icon type="ios-arrow-down"
                          @click="show"></Icon>
                    全部展开
                  </Button>
                  <Button style="width: 50%"
                          @click="hide"
                          type="default">
                    全部收起
                    <Icon type="ios-arrow-up"
                          @click="hide"></Icon>
                  </Button>
                </ButtonGroup>
                <div class="guide-tree">
                  <m-tree class="filter-tree"
                          :data="treeData"
                          :props="defaultProps"
                          node-key="id"
                          :default-expand-all="isexpand"
                          :filter-node-method="filterNode"
                          @node-click="handleNodeClick"
                          ref="tree"></m-tree>
                </div>
              </div>
              <div class="right-wrapper">
                <div class="tools-wrapper">
                  <Input search
                         enter-button
                         style="width: 235px"
                         v-model="searchName"
                         @on-search="handleNodeClick(curNodeData)"
                         placeholder="姓名" />
                </div>
                <Table :columns="recordImportcolumns"
                       :data="recordImportTableData"
                       height="400"
                       ref="recordImportTable"
                       :loading="loading"
                       @on-select="handleSelectRow"
                       @on-select-cancel="handleCancelRow"
                       @on-select-all="handleSelectAll"
                       @on-select-all-cancel="handleSelectAll">
                </Table>
                <Page :total="totalSize"
                      :page-size="pageSize"
                      :current="pageIndex"
                      @on-change="pageIndexChange"
                      size="small"
                      show-elevator
                      show-total />
              </div>
            </div>
          </TabPane>
          <TabPane label="从excel导入"
                   name="excel">
            <div class="excel-btn-group">
              <!-- <Button type="primary" size="small">下载excel模板</Button>
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                        <Button icon="ios-cloud-upload-outline" >导入Excel</Button>
                    </Upload> -->
              <div style="width:60px;margin-bottom:10px;">

                <Button type="primary"
                        size="small"
                        @click="downTemplate">下载模板</Button>
              </div>
              <form ref="form"
                    class="upload">
                <input type="file"
                       name="file"
                       id="uploadFile"
                       ref="uploadFile"
                       accept=".xls,.xlsx"
                       @change="update($event)">
                <Button type="primary"
                        size="small"
                        :loading="importLoading"
                        style="margin:0 10px;"
                        @click="importExcel">导入Excel</Button>
                <Button type="error"
                        ghost
                        size="small"
                        style="margin:0 10px;float:right"
                        @click="removeSelecteds">删除选中行</Button>
                <Button type="primary"
                        size="small"
                        style="margin:0 10px;float:right"
                        @click="handleFile">关联选中行历史档案</Button>
                <Button type="primary"
                        size="small"
                        style="margin:0 10px;float:right"
                        @click="selectedNewFile">设选中行为新档案</Button>
              </form>
              <!-- <Upload
                        type="drag"
                        :show-upload-list="false"
                        @on-success="handleSuccess"
                        action="//jsonplaceholder.typicode.com/posts/">
                        <div style="padding: 20px 0">
                            <Icon type="md-folder-open" size="52" style="color: #3399ff"></Icon>
                            <p>点击或将文件拖拽到这里上传</p>
                            <p style="color:#c5c8ce">支持扩展名：.xls .xlsx</p>
                        </div>
                    </Upload> -->
            </div>

            <vxe-table class="mytable-style"
                       :row-class-name="rowClassName"
                       resizable
                       highlight-hover-row
                       highlight-current-row
                       ref="xTable"
                       height="440"
                       size="small"
                       align="center"
                       :data="importExcelData"
                       :checkbox-config="{trigger: 'row'}"
                       :edit-config="{trigger: 'manual', mode: 'row'}">
              <vxe-table-column type="checkbox"
                                fixed="left"
                                width="60"></vxe-table-column>
              <vxe-table-column type="index"
                                title="序号"
                                width="80"></vxe-table-column>
              <vxe-table-column field="boName"
                                title="姓名"
                                min-width="100"></vxe-table-column>
              <vxe-table-column field="boSex"
                                title="性别"
                                min-width="80"></vxe-table-column>
              <vxe-table-column field="boAge"
                                title="年龄"
                                min-width="80"></vxe-table-column>
              <vxe-table-column field="boMaritalStatus"
                                title="婚姻状况"
                                min-width="100"></vxe-table-column>
              <vxe-table-column field="boGroupName"
                                title="分组"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="boDepartment"
                                title="部门"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="boSubDepartment"
                                title="子部门"
                                min-width="120"></vxe-table-column>
              <vxe-table-column field="boIdNo"
                                title="身份证号"
                                min-width="180"></vxe-table-column>
              <vxe-table-column field="boMobile"
                                title="手机号"
                                min-width="140"></vxe-table-column>
              <vxe-table-column field="status"
                                min-width="150"
                                title="状态">
                <template v-slot="{ row }">
                  <Tag color="green"
                       v-if="row.boPeId && row.repeat == 1">已关联</Tag>
                  <Tag color="blue"
                       v-else-if="row.relation == 1">已设为新档案</Tag>
                </template>
              </vxe-table-column>

            </vxe-table>

            <!-- 关联弹窗 -->
            <Modal width="1000"
                   :closable="false"
                   :mask-closable="false"
                   v-model="showModal"
                   title="选择关联">
              <Table :columns="fileColumns"
                     　:data="fileData"
                     height="500"
                     :loading="fileLoading">
                <template slot="action"
                          slot-scope="{row}">
                  <Button type="primary"
                          style="margin-left: 8px;"
                          v-permission="['edit']"
                          @click="relevanceFile(row)"
                          v-if="row.showBtn==0"
                          size="small">关联档案</Button>
                  <Button type="error"
                          v-else
                          style="margin-left: 8px;"
                          v-permission="['edit']"
                          @click="cancelRelevanceFile(row)"
                          size="small">取消关联</Button>
                </template>

              </Table>
              <div slot="footer">
                <Button @click="cancelModal">取消</Button>
                <Button type="primary"
                        @click="closeModal">确认</Button>
              </div>
            </Modal>
            <!-- <vxe-modal v-model="showModal" title="选择关联" width="800" height="300" resize>
              <template>123</template>
            </vxe-modal> -->

            <!-- <Table
              :columns="excelImportcolumns"
              :data="importExcelData"
              height="440"
              style="width: 100%;margin-top:20px;"
            >
              <template
                slot="action"
                slot-scope="{row, index}"
              >

                <Button
                  type="error"
                  style="margin-left: 8px;"
                  v-permission="['del']"
                  @click="deleteData(row, index)"
                  size="small"
                >删除</Button>
              </template>
            </Table> -->
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <span v-if="showTooltips"
              style="margin-right:20px;font-size:18px;color:#333;">
          提示：当前名单重名{{ repeatNum }}人 未确认{{ unconfirmedNum }}人 已确认{{confirmNum}}人
        </span>
        <Button @click="closeBatchImportModal">取消</Button>
        <Button type="primary"
                :loading="isLoading"
                @click="handleImport">导入</Button>
      </div>
    </Modal>
    <Modal v-model="confirmModal"
           width="400">
      <p slot="header"
         style="color:#f60;text-align:center">
        <span>确认导入</span>
      </p>
      <div style="text-align:center">
        <span style="margin-right:10px;">是否将已选人员导入</span>
        <Select v-model="groupSelect"
                style="width:200px"
                @on-change="selectChange">
          <Option v-for="item in groupList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div slot="footer">
        <Button type="primary"
                size="large"
                long
                :loading="modal_loading"
                @click="confirmImport">确定导入</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {

  UnitAllInfoTreeData
} from '@/api/appointmentUnitManage.js'
import {
  unitPersonMasterList1,
  saveMasterIndexBatch,
  downExcelTemplate,
  importExcel,
  importData,
  getFileListByName
} from '@/api/unitManage_unitPersonManage.js'
import { archivesList } from '@/api/archives_manage.js'

import vueSelecttree from '@/components/vue-selecttree'
import { mapState } from 'vuex'

export default {
  name: 'import',
  props: {
    visible: Boolean,
    boUnitName: String,
    boUnitId: String,
    boVisitSn: [Number, String],
    boGroupId: String,
    grouplist: {
      type: Array,
      default: () => []
    }
  },
  components: {
    vueSelecttree
  },
  data () {
    return {
      treeData: [],
      isLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isexpand: false,
      recordImportcolumns: [
        {
          width: 55,
          type: 'selection',
          align: 'center'
        },
        {
          title: '体检号',
          key: 'boPeId',
          width: 120,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'boName',
          width: 80,
          align: 'center'
        },
        {
          title: '体检次数',
          key: 'poGroupName',
          width: 100,
          align: 'center'
        },
        {
          title: '性别',
          key: 'boSex',
          width: 80,
          align: 'center'
        },
        {
          title: '婚姻状况',
          key: 'boMaritalStatus',
          width: 100,
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'boIdNo',
          align: 'center'
        }
      ],
      recordImportTableData: [],
      // excelImportcolumns: [
      //   {
      //     width: 55,
      //     type: 'selection',
      //     align: 'center'
      //   },
      //   { type: 'index', title: '序号', minWidth: 65 },
      //   {
      //     field: 'boName',
      //     title: '姓名',
      //     minWidth: 80
      //   },
      //   {
      //     field: 'boSex',
      //     title: '性别',
      //     minWidth: 80
      //   },
      //   {
      //     field: 'boAge',
      //     title: '年龄',
      //     minWidth: 80
      //   },
      //   {
      //     field: 'boMaritalStatus',
      //     title: '婚姻状况',
      //     minWidth: 100
      //   },
      //   {
      //     field: 'boGroupName',
      //     title: '分组',
      //     minWidth: 100
      //   },
      //   {
      //     field: 'boDepartment',
      //     title: '部门',
      //     minWidth: 100
      //   },
      //   {
      //     field: 'boSubDepartment',
      //     title: '子部门',
      //     minWidth: 100
      //   },
      //   {
      //     field: 'boIdNo',
      //     title: '身份证号',
      //     minWidth: 180
      //   },
      //   {
      //     field: 'boMobile',
      //     title: '手机号',
      //     minWidth: 140
      //   },
      //   {
      //     field: 'boAddress',
      //     title: '通讯地址',
      //     minWidth: 140
      //   },
      //   // {
      //   //   title:'状态',
      //   //   field: 'action',
      //   //   fixed: 'right',
      //   //   minWidth: 120,
      //   //   slots: {
      //   //     default: ({row}, h) => {
      //   //       console.log(row)
      //   //       return h('Tag', '已关联')
      //   //       // 重名且进行关联档案操作，
      //   //       // if(row.boPeId && row.repeat==1) {
      //   //       // debugger

      //   //       // }
      //   //     }
      //   //   }
      //   // },
      //   {
      //     field: 'action',
      //     title: '状态',
      //     minWidth: 150,
      //     // fixed: 'right',
      //     slots: {
      //       default: ({ row }, h) => {
      //         // console.log(row)
      //         if (row.boPeId && row.repeat == 1) {
      //           return [
      //             h('Tag', {
      //               props: {
      //                 color: 'green',
      //                 size: 'small'
      //               }
      //             }, '已关联')
      //           ]
      //         } else if (row.relation == 1) {
      //           // console.log(row.repeat)
      //           return [
      //             h('Tag', {
      //               props: {
      //                 color: 'blue',
      //                 size: 'small'
      //               }
      //             }, '已设为新档案')
      //           ]
      //         }
      //       }
      //     }
      //   },
      // ],
      importExcelData: [],
      file: null, // 导入的文件
      pageIndex: 1,
      pageSize: 20,
      totalSize: 0,
      loading: false,
      selections: [], // 表格选中项
      multipleSelections: [], // 所有选中的数据包含跨页数据
      selectedIds: new Set(), // 选中的合并项的id
      selectedSum: 0, // 选中的总数量
      confirmModal: false, // 确认弹框
      modal_loading: false,
      groupSelect: '',
      filterText: '',
      importLoading: false,
      finalImportTableData: [],
      showModal: false,
      showTooltips: false,
      fileColumns: [
        {
          title: '姓名',
          key: 'boName',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '性别',
          key: 'boSex',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'boIdNo',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '单位名称',
          key: 'boUnitName',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 180,
          align: 'center'
        }

      ],
      fileData: [],
      fileLoading: false,
      selectName: '',
      modalQueue: [], // 弹窗队列
      indexArr: [], // 弹窗队列在表格中对应的索引数组
      curNodeData: {}, // 当前选中节点数据
      searchName: '' // 体检记录导入数据搜索框
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible
      },
      set: function () { }
    },
    unitName () {
      return this.boUnitName
    },
    unitId () {
      return this.boUnitId
    },
    groupId () {
      return this.boGroupId
    },
    visitSn () {
      return this.boVisitSn
    },
    groupList () {
      this.grouplist.forEach(item => {
        item.value = item.boGroupingId
      })
      return this.grouplist
    },
    repeatNum () {
      let arr = this.$refs.xTable.getTableData().fullData
      return arr.filter(item => item.repeat == 1).length
    },

    confirmNum () {
      let arr = this.$refs.xTable.getTableData().fullData.filter(item => item.repeat == 1)
      return arr.filter(item => item.boPeId || item.relation == 1).length
    },
    unconfirmedNum () {
      return this.repeatNum - this.confirmNum
    }
  },
  watch: {
    // 节点过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    'modalQueue': {
      handler: function (val) {
        console.log(val)
        if (val.length) {
          // val[0].show = true
          this.showModal = true
          this.finalImportTableData = this.$refs.xTable.getTableData().fullData
          // this.showModal({...val[0]}) //有变化就出队
          let pagination = {
            page: 1,
            size: 20
          }

          let params = {
            name: val[0].name.trim(),
            registerCode: '',
            createDateS: '',
            createDateE: ''
          }

          this.fileLoading = true
          archivesList(pagination, params).then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.fileLoading = false
              let res = data.data
              if (!res.records.length) {
                this.closeModal()
                return false
              }
              this.fileData = res.records
              // 如果重复档案只有一项且生日相同，直接关联
              if (res.total == 1 && res.records[0].boBirthday == val[0].birthday) {
                // item.showBtn = 1
                res.records[0].showBtn = 1
                // this.closeModal()
                let selectRecords = this.$refs.xTable.getSelectRecords()
                selectRecords[this.indexArr[0]].boPeId = res.records[0].boPeId
              } else {
                this.fileData.forEach(item => {
                  if (item.boPeId == val[0].peId) {
                    item.showBtn = 1
                  } else {
                    item.showBtn = 0
                  }
                })
              }
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            this.fileLoading = false
            this.$Message.error('网络不稳定，请稍后重试，asdasd')
          })
        }
      },
      deep: true
    }
  },
  mounted () {
    this.$refs.tabs.activeKey = 'record'
    // console.log(this.modalQueue)
  },
  methods: {
    transGroupName (tree) {
      tree.forEach(item => {
        if (item.boGroupingName !== undefined) {
          item.label = item.boGroupingName
          delete item.boGroupingName
        } else {
          this.transGroupName(item.children)
        }
      })
      return tree
    },
    // 获取树数据
    getTreeData () {
      let params = {
        keyword: ''
      }
      UnitAllInfoTreeData(params)
        .then(({ data }) => {
          if (data.code == 0) {
            let res = data.data
            // console.log(this.unitId)
            console.log(res)
            let result = res.filter(item => item.boUnitId === this.unitId)
            console.log(result)
            // result.forEach( item => {
            //   item.children.pop()
            // })
            // console.log(result)

            result.map(item => {
              item.label = item.boUnitName
              if (item.children.length > 0) {
                // item.children[0].label = '第' + Number(item.children[0].boVisitSn) + '次体检'
                item.children.forEach(v => {
                  v.label = '第' + Number(v.boVisitSn) + '次体检'
                })
              }
            })
            this.transGroupName(result)
            this.treeData = result
            console.log(this.treeData)
            this.groupSelect = this.boGroupId
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },

    async getList (page = 1, size = 20) {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        unitId: this.unitId,
        groupId: this.groupId,
        visitSn: this.visitSn
      }
      this.isLoading = true

      await unitPersonMasterList1(pagination, params)
        .then(({ data }) => {
          this.isLoading = false
          // console.log(data)
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.recordImportTableData = res.records
            this.$nextTick(() => {
              this.setChecked()
            })
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },

    show () {
      this.isexpand = true
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
        }
      })
    },
    hide () {
      this.isexpand = false
      this.$nextTick(() => {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
        }
      })
    },

    // 节点过滤
    filterNode (value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode (value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },

    // 切换页码
    pageIndexChange (val) {
      this.getList(val)
      // 要在table将数据渲染完毕后执行，否则报错
      console.log(this.selectedIds)
    },

    closeBatchImportModal () {
      this.selectedIds = new Set()
      this.treeData = []
      this.recordImportTableData = []
      this.importExcelData = []
      this.$refs.uploadFile.value = null
      this.$emit('close')
    },
    async handleImport () {
      // this.$emit('close')
      // 判断是体检记录导入，还是excel导入
      if (this.$refs.tabs.activeKey == 'record') {
        this.confirmModal = true
        // console.log([...this.selectedIds]);
      } else {
        if (this.importExcelData.length == 0) {
          this.$Message.warning('请选择导入文件')
          return
        }
        // 获取删除后的表格数据
        this.finalImportTableData = this.$refs.xTable.getTableData().fullData
        let params = {
          boUnitId: this.unitId,
          data: this.finalImportTableData,
          boVisitSn: this.visitSn
        }
        // console.log(params)
        try {
          this.isLoading = true
          const { data } = await importData(params)
          this.isLoading = false
          // console.log(data);
          if (data.code == 0) {
            this.confirmModal = false
            this.treeData = []
            this.recordImportTableData = []
            this.importExcelData = []
            this.$emit('close')
            this.$emit('updateList')
            this.$refs.uploadFile.value = null
            this.$Message.success('导入成功')
          } else {
            this.$Message.error(data.message)
          }
        } catch (err) {
          console.log(err)
        } finally {
          this.isLoading = false
        }
      }
    },

    //  全选和取消全选时触发
    handleSelectAll (selection) {
      // console.log(selection);
      // 取消全选 数组为空
      if (selection.length === 0) {
        // 若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
        // 当前页的table数据

        let data = this.$refs.recordImportTable.data
        data.forEach(item => {
          if (this.selectedIds.has(item.boPeId)) {
            this.selectedIds.delete(item.boPeId)
          }
        })
      } else {
        console.log(this.$refs.recordImportTable)
        selection.forEach(item => {
          this.selectedIds.add(item.boPeId)
        })
      }
      // 同步
      this.selectedSum = this.selectedIds.size
      console.log(this.selectedIds)
    },

    // 每次翻页加载时将以前选中的row勾选上的效果
    // 给跨页丢失的选中行重新添加选中状态
    setChecked () {
      if (!this.selectedIds || this.selectedIds.length <= 0) {
        return
      }
      // 找到绑定的table的ref对应的dom，找到table的objData对象，objData保存的是当前页的数据
      let objData = this.$refs.recordImportTable.objData
      for (let index in objData) {
        if (this.selectedIds.has(objData[index].boPeId)) {
          // this.$refs.recordImportTable.toggleRowSelection(this.recordImportTable[index], true)
          objData[index]._isChecked = true
        }
      }
    },

    //  选中某一行
    handleSelectRow (selection, row) {
      // console.log(row);
      this.selectedIds.add(row.boPeId)
      // console.log(this.selectedIds);
    },
    //  取消某一行
    handleCancelRow (selection, row) {
      this.selectedIds.delete(row.boPeId)
      console.log(this.selectedIds)
    },

    handleSuccess (res, file) {
      console.log('上传成功')
      console.log('file', file)
    },
    handleNodeClick (data, node) {
      let params = null
      console.log(data)
      console.log(node)
      if (Object.keys(data).length <= 0) {
        return false
      }
      this.curNodeData = data
      if (data.boUnitId) {
        params = {
          unitId: this.unitId,
          groupId: '',
          visitSn: '',
          keyword: this.searchName
        }
      }
      if (data.boVisitSn) {
        params = {
          unitId: this.unitId,
          groupId: '',
          visitSn: data.boVisitSn,
          keyword: this.searchName
        }
      }
      if (data.boGroupingId) {
        params = {
          unitId: this.unitId,
          groupId: data.boGroupingId,
          visitSn: data.boUnitVisitSn,
          keyword: this.searchName
        }
      }
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      console.log(params)
      unitPersonMasterList1(pagination, params)
        .then(({ data }) => {
          console.log(data)
          if (data.code == 0) {
            let res = data.data
            this.totalSize = res.total
            this.recordImportTableData = res.records
            // 点击节点，先清空选中项selectedIds
            this.selectedIds = new Set()
          } else {
            this.$Message.error(data.message)
          }
        })
        .catch(err => {
          this.$Message.error('网络不稳定，请稍后重试')
        })
    },

    // 下载excel模板
    async downTemplate () {
      let params = {
        boUnitId: this.unitId,
        boUnitVisitSn: this.visitSn
      }
      // console.log(params)
      try {
        const { data, headers } = await downExcelTemplate(params)

        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        console.log(decodeURI(escape(headers.filename)))
        link.download = decodeURI(escape(headers.filename))
        link.click()
      } catch (err) {
      } finally {
      }
    },

    // 监听input获取需要上传的文件
    update (e) {
      console.log(e)
      this.file = e.target.files[0]
    },
    // 导入Excel
    async importExcel () {
      if (!this.$refs.uploadFile.value) {
        this.$Message.warning('请选择导入文件')
        return
      }
      // 创建form对象
      let formData = new FormData()
      // 通过append向form对象添加数据
      formData.append('file', this.file)
      let config = {
        boUnitId: this.unitId,
        boUnitName: this.unitName
      }
      this.importLoading = true
      importExcel(config, formData).then(({ data }) => {
        this.importLoading = false
        if (data.code == 0) {
          this.importExcelData = data.data
          console.log(this.importExcelData)
          if (this.$refs.xTable) {
            this.$refs.xTable.loadData(this.importExcelData)
          }
          // console.log(this.finalImportTableData.filter(item => item.repeat == 1).length)
        } else {
          this.$Message.error(data.message)
        }
      }).catch(error => {
        this.importLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
      // try {
      //   const { data } = await importExcel(config, formData);
      //   console.log(data);
      //   if (data.code == 0) {
      //     this.importExcelData = data.data;

      //   } else {
      //     this.$Message.error(data.message);
      //   }
      // } catch (err) {
      // } finally {
      // }
      // axios.post('/gxims/userSer/importExcel', formData, config).then(res => {
      //     if (res.data.success === true || res.success === 'true') {
      //       this.$Message.success('导入成功！')
      //         this.handleQueryUserList()
      //     } else {
      //       this.$Message.warning('导入失败！')
      //     }
      // }).catch(error => {
      //     console.log(error)
      // })
    },

    // 删除
    deleteData (row, index) {
      // console.log(row);
      // console.log(index)
      this.importExcelData.splice(index, 1)
      console.log(this.importExcelData)
    },

    selectChange (val) {
      // console.log(this.groupSelect)
    },

    // 点击tab标签
    clickTab (name) {
      // console.log(name);
      if (name == 'excel') {
        this.showTooltips = true
      } else {
        this.showTooltips = false
      }
    },

    // 确定导入
    confirmImport () {
      if ([...this.selectedIds].length == 0) {
        this.$Message.warning('请选择需要导入的人员')
        return
      }
      let params = {
        boGroupId: this.groupSelect,
        boUnitId: this.unitId,
        peIds: [...this.selectedIds]
      }
      // console.log(params);
      this.modal_loading = true
      saveMasterIndexBatch(params).then(({ data }) => {
        // console.log(data);
        this.modal_loading = false
        if (data.code == 0) {
          this.confirmModal = false
          this.treeData = []
          this.recordImportTableData = []
          this.importExcelData = []
          this.$emit('close')
          this.$emit('updateList')
          this.$Message.success('导入成功')
        } else {
          this.$Message.error(data.message)
        }
      })

      // this.$emit('close')
    },
    rowClassName ({ row, rowIndex }) {
      if (row.repeat == 1 && !row.boPeId && row.relation !== 1) {
        return 'row-yellow'
      }
    },

    // 删除选中行
    removeSelecteds () {
      this.$refs.xTable.removeSelecteds()
      // console.log(this.$refs.xTable.getTableData().fullData)
    },

    handleFile () {
      let selectRecords = this.$refs.xTable.getSelectRecords()
      console.log(selectRecords)
      // let flag = selectRecords.every(item => {
      //   return item.repeat == 0
      // })
      // if(flag) {
      //   this.$Message.warning("选中的人都是不需要关联历史档案的人员");
      //   return false
      // }
      let isShowModal = selectRecords.some(v => {
        return v.repeat == 1
      })
      if (isShowModal) {
        selectRecords.forEach((item, index) => {
          if (item.repeat == 1) {
            this.modalQueue.push({
              name: item.boName,
              peId: item.boPeId,
              birthday: item.boBirthday
            })
            this.indexArr.push(index)
          }
        })
      } else {
        this.$Message.warning('选中的人都是不需要关联历史档案的人员')
        return false
      }
      console.log(this.modalQueue)
      if (selectRecords.length == 0) {
        this.$Message.warning('请先选上需要关联的人员')
        return false
      }
      // if(!selectRecords[0].boPeId && !!selectRecords[0].repeat) {
      //   this.$Message.warning("该人已设为新档案，不能");
      // }
      // 选中一个需要关联的selectRecords[0].boName，
    },

    getItemList () {
      let pagination = {
        page: 1,
        size: 20
      }

      let params = {
        keyword: this.selectName.trim(),
        registerCode: '',
        createDateS: '',
        createDateE: ''
      }

      this.fileLoading = true
      archivesList(pagination, params).then(({ data }) => {
        if (data.code == 0) {
          let res = data.data
          this.fileData = res.records
        } else {
          this.$Message.error(data.message)
        }
        this.fileLoading = false
      }).catch(err => {
        this.fileLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },

    // 关闭弹窗
    closeModal () {
      this.showModal = false
      this.modalQueue.shift()
      this.indexArr.shift()
      // console.log(this.finalImportTableData)
      // console.log(this.$refs.xTable.getTableData().fullData)
      this.importExcelData = this.finalImportTableData ? this.finalImportTableData : this.$refs.xTable.getTableData().fullData
      // console.log(this.importExcelData)
    },

    // 取消弹窗
    cancelModal () {
      this.showModal = false
      this.modalQueue = []
      this.indexArr = []
    },

    // 选择关联，对表格中选中行进行boPeId赋值
    relevanceFile (row) {
      // console.log(row)
      console.log(this.fileData)
      let cloneData = JSON.parse(JSON.stringify(this.fileData))
      let flag = cloneData.some(item => {
        return item.showBtn == 1
      })
      // console.log(flag)
      if (flag) {
        this.$Message.warning('请先取消关联，然后再进行关联操作')
        return false
      }
      cloneData[row._index].showBtn = 1
      this.fileData = cloneData
      console.log(this.fileData)

      // 点击关联档案时，用fullData，这个是最后导入的数据，在这个基础上进行修改筛选
      // this.finalImportTableData = this.$refs.xTable.getTableData().fullData
      // console.log(this.finalImportTableData)
      let selectRecords = this.$refs.xTable.getSelectRecords()
      selectRecords[this.indexArr[0]].boPeId = row.boPeId
      // this.finalImportTableData.forEach( item => {
      //   if(item.boName == row.boName ) {
      //     item.boPeId = row.boPeId
      //   }
      // })
    },

    // 取消关联
    cancelRelevanceFile (row) {
      // console.log(row)
      let cloneData = JSON.parse(JSON.stringify(this.fileData))
      cloneData[row._index].showBtn = 0
      this.fileData = cloneData
      this.finalImportTableData.forEach(item => {
        if (item.boName == row.boName) {
          delete item.boPeId
          this.$set(item, 'relation', 1) // relation=1 状态已设为新档案，不要用空字符
        }
      })
    },

    // 设置选中行为新档案
    selectedNewFile () {
      console.log(this.$refs.xTable.getTableData().fullData)
      let selectRecords = this.$refs.xTable.getCheckboxRecords()
      console.log(selectRecords)
      this.finalImportTableData = this.$refs.xTable.getTableData().fullData
      if (selectRecords.length > 0) {
        selectRecords.forEach(ele => {
          let idx = this.finalImportTableData.findIndex(item => {
            return ele.id == item.id
          })
          console.log(idx)
          if (idx > -1) {
            this.finalImportTableData[idx].relation = 1
            delete this.finalImportTableData[idx].boPeId
          }
        })
      }
      // this.finalImportTableData.forEach(item => {
      //   if (item.checked) {
      //     delete item.boPeId
      //     this.$set(item, 'relation', 1) // relation=1 状态已设为新档案，不要用空字符
      //   } else {
      //     return
      //   }
      // })
      this.importExcelData = this.finalImportTableData
    }
  }
}
</script>

<style lang="less">
.batch-import-popup {
  .ivu-modal-body {
    padding: 10px 0;
    .ivu-tabs-bar {
      margin-bottom: 5px;
    }
  }
  .record-import-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    height: 500px;
    .left-wrapper {
      min-width: 250px;
      padding: 0 5px;
      box-sizing: border-box;
      margin-left: 15px;
      .search-group-btn,
      .expand-btn,
      .group-tree {
        width: 100%;
      }
      .search-group-btn {
        padding: 0 5px 5px 5px;
        box-sizing: border-box;
      }
      .group-tree {
        max-height: 500px;
        padding: 0 5px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 5px;
          background-color: #eee;
        }
        &::-webkit-scrollbar-button {
          display: none;
        }
        &::-webkit-scrollbar-corner {
          display: none;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          background-color: #e8e8e8;
        }
      }
    }
    .right-wrapper {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      padding: 0 20px;
      .tools-wrapper {
        display: flex;
        justify-content: flex-end;
        padding: 0 20px;
      }
      .ivu-page {
        text-align: center;
      }
    }
  }
  .excel-btn-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px;
    margin-bottom: 10px;
    #uploadFile {
      width: 300px;
    }
  }
  .m-tree-node__label {
    color: #252525;
    font-size: 14px;
  }

  .mytable-style .vxe-body--row.row-yellow {
    background-color: rgb(250, 236, 216);
    color: #252525;
  }
  .vxe-table .vxe-body--row .vxe-body--column {
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
}
</style>
