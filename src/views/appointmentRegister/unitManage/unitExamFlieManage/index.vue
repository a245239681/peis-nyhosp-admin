<template>
  <div class="unit-exam-flie-manage">
    <Card style="width:100%;">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">单位体检档案管理</span>
      </div>
      <div class="main-body page-body">
        <div class="main-body-wrapper">
          <div class="main-left-part">
            <div class="guide-tree-wrapper">
              <Input search
                     enter-button
                     placeholder="搜索公司"
                     v-model='keyWord' />
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
                <CellGroup>
                  <Cell :selected='selected==item'
                        @click.native="tab(item,index)"
                        v-for='(item,index) of Project'
                        :key="index"
                        :name='item.boUnitName'
                        :title="item.boUnitName" />
                </CellGroup>
              </div>
            </div>
          </div>
          <div class="main-right-part">
            <div class="guide-table">
              <Table :columns="columns"
                     :data="tableData"
                     :loading='isLoading'>
                <template slot="status"
                          slot-scope="{row}">
                  <Tag color="green"
                       v-if="row.boIsComplete==1">已完成</Tag>
                  <Tag color="red"
                       v-if="row.boIsComplete==0">未完成</Tag>
                </template>
                <template slot="action"
                          slot-scope="{row}">
                  <Button @click="print(row)"
                          :loading="printLoading && curPrintId == row.boId"
                          type="info"
                          ghost
                          v-permission="['print']"
                          size="small">打印团检报告</Button>
                  <Button @click="add(row)"
                          :disabled="row.boIsComplete==1"
                          type="info"
                          ghost
                          style="margin-left: 8px;"
                          :loading='buttonLoading==row.boId'
                          size="small">完成</Button>
                  <Button @click="guidang(row)"
                          type="info"
                          ghost
                          :loading="cheLoading==row.boId"
                          :disabled="row.boIsFileUp==1||!row.boIsFileUp"
                          style="margin-left: 8px;"
                          size="small">归档</Button>
                  <Button type="error"
                          ghost
                          @click="chedang(row)"
                          :disabled="row.boIsFileUp==0"
                          :loading="guiLoading==row.boId"
                          style="margin-left: 8px;"
                          size="small">撤档</Button>
                </template>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div class="page-footer">
        <Page :total="totalSize"
              :page-size="pageSize"
              :current="pageIndex"
              :page-size-opts="[10,20,40,100]"
              @on-page-size-change="pageSizeChange"
              @on-change="pageIndexChange"
              size="small"
              show-sizer
              show-elevator
              show-total />
      </div>
    </Card>
  </div>
</template>

<script>
import { getUnitList, getSerchUnitList, updateStatus, setStatus, getUnitReport, getMoreUnitReport } from '@/api/unitExamFlieManage'
// import { printNotice, printMethods } from '@/components/main/components/printer-modal/index.js'
// import { getPrinterConfigFromLocalstorage } from '@/libs/util'
import moment from 'moment'
import { debuglog } from 'util'

export default {
  name: 'unitExamFlieManage',
  computed: {
    Project () {
      let arr = []
      if (this.keyWord != '') {
        this.arr.forEach(item => {
          // console.log(item.boUnitName)
          if (item.boUnitName.indexOf(this.keyWord) >= 0) {
            arr.push(item)
          }
        })
      } else {
        arr = this.arr
      }
      // console.log(arr)
      return arr
    }
  },
  data () {
    return {
      arr: [],
      guiLoading: false,
      cheLoading: false,
      buttonLoading: false,
      columns: [
        {
          title: '体检名称',
          key: 'boName',
          minWidth: 110,
          align: 'center'
        },
        {
          title: '预约体检人数',
          key: 'boBookingNum',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '登记人数',
          key: 'boRegisterNum',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '实际体检人数',
          key: 'boCheckInNum',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '体检日期',
          key: 'boBookingDate',
          minWidth: 160,
          align: 'center'
        },
        {
          title: '体检状态',
          slot: 'status',
          minWidth: 110,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 250,
          align: 'center'
        }
      ],
      keyWord: '',
      selected: false,
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 20,
      isLoading: false,
      printLoading: false,
      status: true,
      curPrintId: '' // 当前打印数据id
    }
  },
  created () {
  },
  mounted () {
    this.getUnitList()
    console.log('mounted')
  },
  methods: {
    //  查询单位档案
    getUnitList () {
      let params = {}
      getUnitList(params).then(({ data }) => {
        if (data.code == 0) {
          this.arr = data.data
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        console.log(err)
        this.$Message.error('网络不稳定，请稍后重试')
      })
    },
    //  归档，撤档
    updateStatus (id, status) {
      let name;
      let boIsFileUp;
      status == 0 ? name = '归档' : name = '撤档'
      status == 0 ? boIsFileUp = 1 : boIsFileUp = 0
      this.$Modal.confirm({
        title: '提示',
        content: `是否${name}?`,
        onOk: () => {
          // row.boIsFileUp == 0 ? row.boIsFileUp = 1 : row.boIsFileUp = 0
          status == 1 ? this.guiLoading = id : this.cheLoading = id
          updateStatus({ boId: id, boIsFileUp: boIsFileUp }).then(({ data }) => {
            this.guiLoading = false
            this.cheLoading = false
            if (data.code == 0) {
              this.getSerchUnitList(1, 20, this.unitName)
            } else {
              this.$Message.error(data.message)
            }

          }).catch(err => {
            console.log(err)
            this.guiLoading = false
            this.cheLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
      })

    },
    //  体检状态
    setStatus (id, row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否更改体检状态为完成？`,
        onOk: () => {
          this.buttonLoading = row.boId
          setStatus({ boId: id }).then(({ data }) => {
            this.buttonLoading = false
            if (data.code == 0) {
              row.boIsComplete = 1
              this.$Message.success(data.message)
            } else {
              this.$Message.error(data.message)
            }
          }).catch(err => {
            console.log(err)
            this.buttonLoading = false
            this.$Message.error('网络不稳定，请稍后重试')
          })
        }
      })
    },
    // 单位体检记录分页查询接口
    getSerchUnitList (page = 1, size = 20, unitName = null) {
      this.pageIndex = page
      this.pageSize = size
      let pagination = {
        page: this.pageIndex,
        size: this.pageSize
      }
      let params = {
        boUnitId: unitName
      }
      this.isLoading = true

      getSerchUnitList(pagination, params).then(({ data }) => {

        this.isLoading = false
        if (data.code == 0) {
          this.tableData = data.data.records
          this.tableData.forEach(res => { if (res.boBookingDate) { res.boBookingDate = moment(res.boBookingDate).format('YYYY-MM-DD h:mm') } return res.boBookingDate })
          this.totalSize = data.data.total
        } else {
          this.$Message.error(data.message)
        }
      }).catch(err => {
        console.log(err)
        this.isLoading = false
        console.log('网络不稳定，请稍后重试')
      })
    },
    tab (item, index) {
      this.arr.forEach(item => {
        if (this.arr.indexOf(item) == index) {
          this.selected = item
        }
      })
      this.unitName = item.boUnitId
      this.getSerchUnitList(1, 20, item.boUnitId)
    },
    //  归档
    guidang (row) {
      console.log(row)
      this.updateStatus(row.boId, row.boIsFileUp)
    },
    //  撤挡
    chedang (row) {
      this.updateStatus(row.boId, row.boIsFileUp, )
    },
    //  切换状态
    add (row) {
      console.log(row.boIsComplete)
      this.setStatus(row.boId, row)
    },
    // 切换页码
    pageIndexChange (val) {
      this.pageIndex = val
      this.getSerchUnitList(val, this.pageSize, this.unitName)
    },
    //  切换显示数量
    pageSizeChange (val) {
      this.pageSize = val
      this.getSerchUnitList(this.pageIndex, val, this.unitName)
    },
    show () {
      let element = document.querySelector('.guide-tree')
      element.style.height = ''
    },
    hide () {
      let element = document.querySelector('.guide-tree')
      element.style.height = '0px'
    },
    // 打印团检报告
    print (row) {
      // if (!printNotice()) return false
      if (this.printLoading) return false
      console.log(row)
      this.curPrintId = row.boId
      let params = {
        unitId: row.boUnitId,
        unitVisitSn: row.boUnitVisitSn
      }
      this.printLoading = true
      // let printConfig = getPrinterConfigFromLocalstorage()
      getUnitReport(params).then(({ data }) => {
        console.log(data)
        if (data.code == 0) {
          let link = document.createElement('a')
          link.href = this.$url + data.data
          // link.download = '体检名单工作量统计.xls'
          link.click()
          this.$Message.success('操作成功')
        } else {
          this.$Message.error(data.message)
        }
        this.printLoading = false
      }).catch(err => {
        console.log(err)
        this.printLoading = false
        this.$Message.error('网络不稳定，请稍后重试')
      })
      // 如果是浏览器，请求不分割PDF接口。 如果是插件，请求分割PDF接口
      // if (printConfig.browserPreview) {
      //   getUnitReport(params).then(({ data }) => {
      //     console.log(data)
      //     if (data.code == 0) {
      //       let printParams = {
      //         guideUrl: this.$url + data.data,
      //         selGroup: ['printGuide']
      //       }
      //       printMethods(printParams.guideUrl, printParams)
      //     } else {
      //       this.$Message.error(data.message)
      //     }
      //     this.printLoading = false
      //   }).catch(err => {
      //     console.log(err)
      //     this.printLoading = false
      //     this.$Message.error('网络不稳定，请稍后重试')
      //   })
      // } else {
      //   getMoreUnitReport(params).then(({ data }) => {
      //     console.log(data)
      //     if (data.code == 0) {
      //       let result = data.data.map(item => {
      //         return item = this.$url + item
      //       })
      //       let printParams = {
      //         guideUrl: result,
      //         selGroup: ['printGuide'],
      //         taskName: '团检报告'
      //       }
      //       printMethods(printParams.guideUrl, printParams)
      //     } else {
      //       this.$Message.error(data.message)
      //     }
      //     this.printLoading = false
      //   }).catch(err => {
      //     console.log(err)
      //     this.printLoading = false
      //     this.$Message.error('网络不稳定，请稍后重试')
      //   })
      // }
    }
  }
}
</script>
<style lang="less">
.unit-exam-flie-manage {
  width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 80px');
  display: flex;
  .search-title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ivu-input-guide {
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
      min-width: 200px;
      height: auto;
      margin-right: 20px;
    }
    .main-right-part {
      flex: 1;
      height: auto;
      overflow: hidden;
    }
  }
  .main-body {
    display: flex;

    .guide-tree-wrapper {
      height: 100%;
      .guide-tree {
        max-height: 680px;
        overflow-y: auto;
        width: 280px;
        .ivu-cell-title {
          width: 260px;
          word-break: break-all; /* 不换行 */
          white-space: nowrap; /* 不换行 */
          overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
        }
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
    .guide-table {
      flex-grow: 1;
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
  .ivu-table th {
    background-color: #d6eaff;
  }
  .ivu-cell-item {
    color: #252525;
  }
}
</style>
