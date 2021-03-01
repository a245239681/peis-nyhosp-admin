<template>
  <div class="exam-query-wrapper">
    <Card style="width:100%">
      <div slot="title"
           class="search-title-wrapper">
        <span class="title">检查查询</span>
        <div class="title-right-tool">
          <Input search
                 enter-button
                 size="small"
                 style="width: 200px"
                 placeholder="搜索" />
        </div>
      </div>
      <Tabs :animated="false">
          <TabPane label="全部采样">
            <Table :columns="allSampleCols" :data="allSampleTableData"></Table>
            <Page :total="800" show-elevator show-total show-sizer size="small"/>
          </TabPane>
          <TabPane label="已采样">
            <Table :columns="sampledCols" :data="sampledTableData"></Table>
            <Page :total="700" show-elevator show-total show-sizer size="small"/>
          </TabPane>
          <TabPane label="未采样">
            <Table :columns="noSampleCols" :data="noSampleTableData"></Table>
            <Page :total="600" show-elevator show-total show-sizer size="small"/>
          </TabPane>
          <TabPane label="已签收">
            <Table :columns="signCols" :data="signTableData"></Table>
            <Page :total="500" show-elevator show-total show-sizer size="small"/>
          </TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script>

export default {
  name: 'examQuery',
  components: {

  },
  data () {
    return {
      allSampleCols: [
        {
          title: '项目代码',
          key: 'projectNo',
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'projectName',
          align: 'center'
        },
        {
          title: '检查结果',
          key: 'examResult',
          align: 'center'
        },
        {
          title: '判断结果',
          key: 'diagnosis',
          align: 'center'
        },
        {
          title: '参考值',
          key: 'refValue',
          align: 'center'
        }
      ],
      allSampleTableData:[
        {
          projectNo: 132321422,
          projectName: '乙肝项目',
          examResult: '检查结果正常',
          diagnosis: '心跳异常',
          refValue: '35.0~36.0'
        }
      ],
      sampledCols:[
        {
          title: '项目代码',
          key: 'projectNo',
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'projectName',
          align: 'center'
        },
        {
          title: '检查结果',
          key: 'examResult',
          align: 'center'
        },
        {
          title: '判断结果',
          key: 'diagnosis',
          align: 'center'
        },
        {
          title: '参考值',
          key: 'refValue',
          align: 'center'
        }
      ],
      sampledTableData:[
        {
          projectNo: 132321422,
          projectName: 'X光项目',
          examResult: '检查结果正常',
          diagnosis: '心跳异常',
          refValue: '35.0~36.0'
        }
      ],
      noSampleCols:[
        {
          title: '项目代码',
          key: 'projectNo',
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'projectName',
          align: 'center'
        },
        {
          title: '检查结果',
          key: 'examResult',
          align: 'center'
        },
        {
          title: '判断结果',
          key: 'diagnosis',
          align: 'center'
        },
        {
          title: '参考值',
          key: 'refValue',
          align: 'center'
        }
      ],
      noSampleTableData:[
        {
          projectNo: 132321422,
          projectName: '耳鼻喉项目',
          examResult: '检查结果正常',
          diagnosis: '心跳异常',
          refValue: '35.0~36.0'
        }
      ],
      signCols:[
        {
          title: '项目代码',
          key: 'projectNo',
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'projectName',
          align: 'center'
        },
        {
          title: '检查结果',
          key: 'examResult',
          align: 'center'
        },
        {
          title: '判断结果',
          key: 'diagnosis',
          align: 'center'
        },
        {
          title: '参考值',
          key: 'refValue',
          align: 'center'
        }
      ],
      signTableData:[
        {
          projectNo: 132321422,
          projectName: '心电图项目',
          examResult: '检查结果正常',
          diagnosis: '心跳异常',
          refValue: '35.0~36.0'
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
   
  },
}
</script>
<style lang="less">
.exam-query-wrapper {
  width: 100%;
  min-width: 1200px;
  height: auto;
  min-height: calc(~'100% - 80px');
  display: flex;
  position: relative;
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
    font-size: 16px;
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
  .ivu-card-head{
    border: none;
  }
  .ivu-card-body{
    position: absolute;
    width: 100%;
    height: 100%;
    top: -8px;
    .ivu-tabs{
      width: 100%;
      height: 100%;
      .ivu-tabs-nav-wrap{
        margin-left: 100px;
      }
      .ivu-tabs-content{
        height: 100%;
        .ivu-tabs-tabpane{
          position: relative;
          height: calc(~'100% - 50px');
          text-align: center;
          .ivu-page{
            position: absolute;
            bottom: 8px;
            left: 30%;
          }
        }
      }
    }
  }
  .ivu-table th {
    background-color: #d6eaff;
  }
}
</style>