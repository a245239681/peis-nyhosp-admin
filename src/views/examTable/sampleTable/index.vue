<template>
  <div class="sample-table-wrapper">
    <Tabs type="card"
          :animated="true"
          name="sampleTab"
          ref="parrentTab"
          :value="curTabIndex"
          @on-click="curTabActive"
          @on-tab-remove="handleTabRemove">
      <TabPane v-for="(tab,index) in tabs"
               :key="tab.timeStamp"
               :label="'采样台 ' + (index + 1)"
               tab="sampleTab"
               :name="index + ''"
               :closable="index != 0">
        <SampleTemp :key="tab.timeStamp"
                    ref="sampleTemp"></SampleTemp>
      </TabPane>
      <Button @click="handleTabsAdd"
              size="small"
              slot="extra"
              :disabled="tabs.length >= 5"
              type="primary">新建采样台</Button>
    </Tabs>
    <search-info @getPatientInfo="showPatientInfo" />
  </div>
</template>
<script>
import SearchInfo from '../components/searchInfo'
import SampleTemp from './sampleTemp.vue';

export default {
  name: 'sampleTable',
  components: {
    SampleTemp,
    SearchInfo
  },
  data () {
    return {

      tabs: [
        {
          timeStamp: new Date().getTime()
        }
      ],
      curTabIndex: 0
    }
  },
  mounted () {

  },
  methods: {
    handleTabsAdd () {
      let obj = {
        timeStamp: new Date().getTime()
      }
      this.tabs.push(obj)
    },
    handleTabRemove (index) {
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
      })

    },
    curTabActive (index) {
      this.curTabIndex = index
    },
    showPatientInfo (data) {
      this.$refs.sampleTemp[this.curTabIndex].getPatientInfo(data)
    },
  },
}
</script>
<style lang="less">
.sample-table-wrapper {
  width: 100%;
  min-width: 1200px;
  height: inherit;
  min-height: calc(~'100% - 130px');
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .sample-dept {
    width: 100%;
    height: 40px;
    background-color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 20px;
    border-radius: 5px;
    &-waiting {
      margin-left: 20px;
    }
  }
  .ivu-tabs {
    width: 100%;
    min-width: 1200px;
    margin-top: 10px;
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
  }
  .ivu-tabs-bar {
    min-width: 1200px;
  }
  .ivu-tabs-nav-right {
    margin-right: 30px;
  }
  .ivu-btn-default {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
  .bottom-btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .ivu-btn {
      margin-right: 8px;
    }
  }
  .ivu-card {
    min-width: 1200px;
  }
  .ivu-card-head {
    font-size: 18px;
    line-height: 1.5;
  }
  .center-btns {
    float: right;
    .ivu-btn {
      margin-right: 8px;
    }
  }
}
</style>