<template>
  <div>
    <Modal class="group-projects-wrapper"
           v-model="isVisible"
           :mask-closable="false"
           @on-cancel="close"
           title="复制分组项目"
           width="800">
      <Form ref="form"
            :model="form"
            label-position="left"
            autocomplete="off"
            :label-width="50">
        <Row :gutter="16">
          <Col span="10">
          <FormItem label="单位名称"
                    prop="boUnitId"
                    :label-width="80">
            <Select v-model="form.boUnitId"
                    class="unitSelect"
                    ref="unitSelectBox"
                    clearable
                    filterable
                    remote
                    size="small"
                    :label-in-value="true"
                    placeholder=" "
                    @on-change="changeUnit"
                    @on-clear="clearUnit"
                    :remote-method="getUnits"
                    :loading="unitSearchLoading">
              <Option v-for="item in unitsList"
                      :value="item.boUnitId"
                      :key="item.boUnitId">{{ item.boUnitName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="单位体检次数"
                    :label-width="100"
                    prop="unitVisitSn">
            <Select v-model="form.unitVisitSn"
                    size="small"
                    @on-change="changeUnitVisitSn"
                    clearable
                    :label-in-value="true">
              <Option v-for="item in unitVisitSnList"
                      :value="item.unitVisitSn"
                      :key="item.unitVisitSn">{{item.unitVisitSn}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="体检分组"
                    prop="boGroupId"
                    :label-width="80">
            <Select v-model="form.boGroupId"
                    size="small"
                    @on-change="changeUnitGroup"
                    clearable>
              <Option v-for="item in groupsList"
                      :value="item.groupingId"
                      :key="item.groupingId">{{ item.groupingName }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="table-left">
        <Table :columns="tableCols"
               :data="tableData"
               height="400"
               highlight-row>
          <template slot-scope="{ row, index }"
                    slot="action">
            <Tag color="green"
                 v-if="row.isAddItem == 0">套餐</Tag>
            <Tag color="orange"
                 v-else-if="row.isAddItem == 1">加做</Tag>
            <Tag color="magenta"
                 v-else-if="row.isAddItem == 2">自选</Tag>
          </template>
        </Table>
      </div>
      <div slot="footer">
        <Button @click="close">取消</Button>
        <Button type="primary"
                @click="copy">复制</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  listByName,
  searchGroupProjects,
} from '@/api/personal_register.js';
import {
  unitGroupInfo
} from '@/api/groupManage'

export default {
  name: 'selectGroupProjects',
  props: {
    visible: Boolean,
  },
  data () {
    return {
      form: {
        boUnitId: null,
        boGroupId: null,
        groupPackageId: null,
        groupPakcageCode: null,
        groupPackageName: null,
      },
      tableCols: [
        {
          title: '类型',
          slot: 'action',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '所属科室',
          minWidth: 120,
          key: 'boDeptName',
          align: 'center'
        },
        {
          title: '项目名称',
          minWidth: 220,
          key: 'boObjectName',
          align: 'center'
        },
      ],
      tableData: [],
      unitsList: [],
      unitVisitSnList: [], // 单位体检次数
      groupsList: [],
      groupAddItems: [],
      unitTimer: null,
      unitSearchLoading: false,
      searchLoading: false,
    }
  },
  computed: {
    isVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {

      }
    }
  },
  methods: {
    getUnits (query = '') {
      if (this.unitSearchLoading) return false
      this.unitSearchLoading = true
      this.unitTimer && clearTimeout(this.unitTimer)
      this.unitTimer = setTimeout(() => {
        let params = {
          boUnitName: query
        }
        listByName(params).then(({ data }) => {
          if (data.code === 0) {
            this.unitsList = data.data
          } else {
            this.$Message.error(result.message)
          }
          this.unitSearchLoading = false
        }).catch(err => {
          console.log(err)
          this.unitSearchLoading = false
          this.$Message.error('网络不稳定，请稍后重试')
        })
      }, 300)
    },
    //  选中单位后
    changeUnit (e) {
      if (e == undefined) return
      this.form.boUnitName = e.label
      this.form.boUnitId = e.value
      this.$set(this.form, 'unitVisitSn', '')
      this.getGroups()
    },
    // 更改单位体检次数
    changeUnitVisitSn (e) {
      this.groupsList = []
      if (e) {
        this.$set(this.form, 'boGroupId', '')
        const arr = this.unitVisitSnList.filter(item => {
          return item.unitVisitSn == e.value
        })
        console.log(arr)
        if (arr.length > 0) {
          this.groupsList = arr[0].groupingResultList
        }
      } else {
        this.$set(this.form, 'boGroupId', '')
        this.$set(this.form, 'unitVisitSn', '')
      }
    },

    // 查询单位分组信息
    getGroups () {
      let params = {
        boUnitId: this.form.boUnitId
      }
      unitGroupInfo(params).then(({ data }) => {
        if (data.code === 0) {
          console.log(data.data)
          this.unitVisitSnList = data.data.unitVisitSnList
        } else {
          this.$Message.error(result.Message)
        }
      })
    },

    //  清空单位后
    clearUnit () {
      this.form = {}
      this.$set(this.form, 'unitVisitSn', '')
      this.$set(this.form, 'boUnitId', '')
      this.$set(this.form, 'boUnitName', '')
      this.$set(this.form, 'unitVisitSn', '')
      this.$set(this.form, 'boGroupId', '')
      this.unitsList = []
      this.groupsList = []
      this.unitVisitSnList = []
    },
    clearData () {
      //清空表格数据
      this.tableData = [];
      this.groupAddItems = [];
      //清空查询表单
      this.$refs.form.resetFields();
    },

    copy () {
      if (JSON.stringify(this.tableData) === '[]') {
        this.$Message.error('未选择其他分组项目')
        return
      }
      let params = Object.assign({}, this.form)
      //将该分组项目复制到编辑分组弹出中已选项目
      this.$emit('importProjects', this.groupAddItems, params);
      this.clearData();
      this.clearUnit();
      this.$emit('close');
    },
    close () {
      //   this.searchLoading = false;
      this.clearData();
      this.clearUnit();
      this.$emit('close');
    },

    //更改体检分组
    async changeUnitGroup (e) {
      if (!e) return
      this.groupAddItems = []
      let params = {
        boGroupingId: e,
        sort: 3 //用于获取数据排序 - 套餐优先
      }
      try {
        let { data } = await searchGroupProjects(params);
        console.log(data)
        let hasPackage;
        if (data.code === 0) {
          this.tableData = data.data.data
          let arr = this.tableData.filter(item => {
            return item.boObjectType == 3
          })
          JSON.stringify(arr) !== '[]' ? hasPackage = true : hasPackage = false

          if (hasPackage) {
            this.tableData.forEach(item => {
              if (item.boObjectType == 3) {
                item.isAddItem = 0
                this.form.groupPakcageCode = item.boObjectCode
                this.form.groupPackageId = item.boObjectId;
                this.form.groupPackageName = item.boObjectName;
              }
              if (item.boObjectType == 2) {
                item.isAddItem = 1
                this.groupAddItems.push(item.boObjectId)
              }
            })
          } else {
            this.tableData.forEach(item => {
              item.isAddItem = 2
              this.groupAddItems.push(item.boObjectId)
            })
          }
        } else {
          this.$Message.error(data.message);
        }
      } catch (err) {
        console.log(err)
        // this.$Message.error(err)
        this.$Message.error('网络不稳定，请稍后重试')
      }
    },
  }
}
</script>

<style lang="less">
.group-projects-wrapper {
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
  .ivu-modal-body {
    padding-bottom: 0;
    .ivu-form-item {
      margin-bottom: 16px;
    }
    .ivu-table th {
      background-color: #d6eaff;
    }
    .booking-date-range {
      width: 254px;
    }
    .table-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .zk-table {
      ::-webkit-scrollbar {
        width: 5px;
        background-color: #eee;
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      ::-webkit-scrollbar-corner {
        display: none;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #e8e8e8;
      }
    }
  }
}
</style>