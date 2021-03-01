<template>
  <div class="record-result-wrapper">
    <!-- <Tabs type="card"
          :animated="true"
          name="recordTab"
          ref="parrentTab"
          :value="curTabIndex"
          @on-click="curTabActive"
          @on-tab-remove="handleTabRemove">
      <TabPane v-for="(tab,index) in tabs"
               :key="tab.timeStamp"
               :label="'录入台 ' + (index + 1)"
               tab="recordTab"
               :name="index + ''"
               :closable="index != 0">
        <ResultTemp :key="tab.timeStamp"
                    ref="resultTemp"></ResultTemp>
      </TabPane>
      <Button @click="handleTabsAdd"
              size="small"
              slot="extra"
              :disabled="tabs.length >= 5"
              type="primary">新建录入台</Button>
    </Tabs> -->
    <Card style="width:100%;">
      <div class="page-body clearfix"
           style="padding-bottom:0;">
        <ResultTemp ref="resultTemp"></ResultTemp>
      </div>
    </Card>
    <search-info @getPatientInfo="showPatientInfo" />
  </div>
</template>
<script>
import SearchInfo from '../components/searchInfo'
import ResultTemp from './resultTemp'
import { getSingleItem, getCombo, resultContrast } from '@/api/record_result'

export default {
  name: 'recordResult',
  components: {
    SearchInfo,
    ResultTemp
  },
  data () {
    return {
      tabs: [
        {
          timeStamp: new Date().getTime()
        }
      ],
      comboList: [
        {
          comboId: 1,
          comboName: '乙肝三项'
        },
        {
          comboId: 2,
          comboName: '梅毒二项'
        },
        {
          comboId: 3,
          comboName: '血常规'
        },
      ],
      tableCols: [
        {
          title: '项目代码',
          key: 'paItemCode',
          align: 'center',
          width: 100
        },
        {
          title: '明细项目',
          key: 'paItemName',
          align: 'center'
        },
        {
          title: '检查结果',
          slot: 'paResult',
          align: 'center'
        },
        {
          title: '单位',
          key: 'paUnit',
          align: 'center',
          width: 60
        },
        {
          title: '是否阳性',
          slot: 'paIsAbnormal',
          width: 90,
          align: 'center'
        },
        {
          title: '诊断结果',
          slot: 'paContent',
          align: 'center'
        },
        {
          title: '参考值',
          key: 'refValue',
          align: 'center',
          width: 120
        },
        {
          title: '历年对比',
          slot: 'action',
          align: 'center',
          width: 100
        }
      ],
      curTabIndex: '0'
    }
  },
  computed: {
    roomList: {
      get: function () {
        return this.$store.getters.getRoomDict
      },
      set: function () {
      }
    }
  },
  mounted () {
    this.$store.dispatch('getRoomDict');
  },
  methods: {
    handleTabsAdd () {
      let obj = {
        timeStamp: new Date().getTime()
      }
      this.tabs.push(obj)
    },
    handleTabRemove (index) {
      // this.tabs.splice(index, 1)
      this.$delete(this.tabs, index)
      this.$nextTick(() => {
        let actIdx = this.$refs.parrentTab.activeKey
        if (this.tabs.length == actIdx) {
          this.curTabIndex = (Number(actIdx) - 1).toString()
          this.$refs.parrentTab.activeKey = this.curTabIndex
        } else {
          this.curTabIndex = actIdx
          this.$refs.parrentTab.activeKey = this.curTabIndex
        }
        console.log(this.curTabIndex)
      })

      console.log(this.$refs.parrentTab)
    },
    showPatientInfo (data) {
      // this.$refs.resultTemp[this.curTabIndex].getPatientInfo(data)
      this.$refs.resultTemp.getPatientInfo(data)
    },
    curTabActive (index) {
      this.curTabIndex = index
      console.log(this.curTabIndex)
    }
  }
}
</script>
<style lang="less">
.record-result-wrapper {
  width: 100%;
  min-width: 1300px;
  height: 100%;
  min-height: calc(~'100% - 80px');
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  .silde-btn {
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 10;
    width: 30px;
    height: 40px;
    line-height: 40px;
    border-radius: 50% 0 0 50%;
    background-color: #5cadff;
    cursor: pointer;
    .slide-icon {
      text-align: center;
      font-size: 30px;
      color: #fff;
    }
  }
  .record-dept {
    width: 100%;
    height: 40px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    border-radius: 5px;
    &-waiting {
      margin-left: 20px;
    }
    .record-dept-title {
      width: 240px;
    }
    .record-dept-waiting {
      flex: 1;
    }
    .doctor,
    .operator,
    .examDate {
      width: 200px;
      margin-left: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .pre-title {
        text-align: right;
        width: 110px;
        padding-right: 16px;
      }
    }
    .examDate {
      width: 240px;
    }
  }
  .ivu-tabs {
    width: 100%;
    // min-width: 1200px;
    margin-top: 10px;
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
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
  .ivu-input:focus {
    box-shadow: none;
  }
  .ivu-btn-error {
    color: #ed4014;
    border-color: #ed4014;
    background-color: #fff;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
  .ivu-input[disabled] {
    color: #333;
  }
  .ivu-select-disabled .ivu-select-selection {
    color: #333;
  }
  .ivu-form-item {
    margin-bottom: 0px !important;
  }
  .selected-item-wrapper,
  .poptip-selected-item-wrapper {
    width: 100%;
    height: 115px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    overflow: hidden;
    &:hover {
      border: 1px solid #57a3f3;
    }
    .ivu-input {
      border: none;
      resize: none;
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
    ul {
      max-height: 115px;
      overflow-y: auto;
    }
    li {
      display: flex;
      label {
        max-width: 120px;
        min-width: 80px;
        justify-content: flex-end;
        display: flex;
        padding-top: 6px;
      }
    }
  }
  .poptip-selected-item-wrapper {
    border: none;
    height: auto;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 48px;
      padding: 0 10px;
      border-bottom: 1px solid #dcdee2;
    }
    &:hover {
      border: none;
    }
  }
  .result-wrapper {
    margin-top: 10px;
    padding: 10px 0;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    .ivu-tabs {
      padding: 10px 10px;
    }

    .ivu-poptip-body-content {
      max-height: 330px;
    }
    .aside {
      width: 300px;
      flex-shrink: 0;
      border: 1px solid #dcdee2;
      .combo-title {
        width: 100%;
        padding: 7px 0;
        background-color: #d6eaff;
        text-align: center;
        font-weight: bold;
        color: #000;
        font-size: 14px;
      }
      .combo-list {
        width: 100%;
        overflow-y: auto;
        font-size: 14px;
        color: #252525;
        .combo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          &:hover {
            background-color: #ebf7ff;
          }
        }
        .combo-name {
          display: flex;
          align-items: center;
          padding-left: 10px;
          word-break: break-all;
        }
        .combo-handle {
          padding: 0 10px;
        }
        .combo-handle.is-refuse .ivu-btn-error {
          color: #c5c8ce;
          background-color: #fff;
          border-color: #dcdee2;
        }
      }
    }
    .main {
      width: calc(~'100% - 310px');
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      // align-items: center;
      &-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .summary {
          position: relative;
          width: 49%;
          .summary-sel-btn {
            position: absolute;
            top: 22px;
            right: 24px;
          }
        }
        .diagList {
          width: 49%;
          margin-top: 10px;
          padding: 8px 0;
          &-title {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            padding-bottom: 8px;
            padding-top: 2px;
            align-items: center;
            border-bottom: 1px solid #dcdee2;
            margin-bottom: 15px;
            color: #2d8cf0;
            .diagList-sel-btn {
              position: absolute;
              top: 3px;
              right: 8px;
            }
          }
          &-content {
            .diagList-del-btn {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
}
.ivu-poptip-body {
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
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
</style>