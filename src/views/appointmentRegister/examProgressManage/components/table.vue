<template>
  <Table :columns="columns"
         :data="tabelData"
         @on-selection-change='tabSelectChange'
         @on-row-dblclick='showInfo'
         :loading='loading'>
    <template slot-scope="{ row }"
              slot="status">
      <Tag v-if="row.boPatientVisitStatus=='0'"
           color="red">未检</Tag>
      <Tag v-if="row.boPatientVisitStatus=='1'"
           color="blue">在检</Tag>
      <Tag v-if="row.boPatientVisitStatus=='3'"
           color="orange">待主检</Tag>
      <Tag v-if="row.boPatientVisitStatus=='2' || row.boPatientVisitStatus=='7'"
           color="purple">待总检</Tag>
      <Tag v-if="row.boPatientVisitStatus=='9'"
           color="green">已总检</Tag>
      <Tag v-if="row.boPatientVisitStatus=='10'"
           color="cyan">已打印</Tag>
      <Tag v-if="row.boPatientVisitStatus=='11'"
           color="magenta">已装订</Tag>
      <Tag v-if="row.boPatientVisitStatus=='12'"
           color="gray">已领取</Tag>
    </template>
    <template slot-scope="{ row }"
              slot="boRegisterDate">
      <span v-show="row.boRegisterDate">{{row.boRegisterDate | dateformat}}</span>
    </template>
    <template slot-scope="{ row }"
              slot="boExamTime">
      <span v-show="row.boExamTime">{{row.boExamTime | dateformat}}</span>
    </template>
    <template slot-scope="{ row }"
              slot="boPrintDate">
      <span v-show="row.boPrintDate">{{row.boPrintDate | dateformat}}</span>
    </template>
  </Table>
</template>

<script>

export default {
  name: 'capture',
  props: ['columns', 'tabelData', 'loading'],
  data () {
    return {
      colorList: 'warning'
    }
  },
  computed: {
    // ColorList () {
    //   for (let i of this.tabelData) {
    //     if (i.boResultStatus == '未检') {
    //       this.colorList = 'warning'
    //     }
    //     if (i.boResultStatus == '在检') {
    //       this.colorList = 'primary'
    //     }
    //     if (i.boResultStatus == '待总检') {
    //       this.colorList = 'purple'
    //     }
    //     if (i.boResultStatus == '已总检') {
    //       this.colorList = 'green'
    //     }
    //     if (i.boResultStatus == '已打印报告') {
    //       this.colorList = 'success'
    //     }
    //   }
    //   return this.colorList
    // }
  },
  watch: {
    ColorList (e, a) {

    }
  },
  mounted () {

  },
  methods: {

    tabSelectChange (row) {
      this.$emit('tabSelectChange', row)
    },
    showInfo (row) {
      this.$emit('showInfo', row)
    }
  }
}
</script>

<style lang="less">
.capture-wrapper {
  .ivu-modal-body {
    display: flex;
    justify-content: space-between;
  }
}
</style>

