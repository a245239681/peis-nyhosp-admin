<template>
  <Table :columns="columns"
         :data="tabelData"
         @on-selection-change='tabSelectChange'
         :loading='loading'>
    <template slot-scope="{ row }"
              slot="status">
      <Tag v-if="row.boResultStatus=='未检'"
           color="red">{{ row.boResultStatus }}</Tag>
      <Tag v-if="row.boResultStatus=='在检'"
           color="blue">{{ row.boResultStatus }}</Tag>
      <Tag v-if="row.boResultStatus=='待主检'"
           color="orange">{{ row.boResultStatus }}</Tag>
      <Tag v-if="row.boResultStatus=='待总检'"
           color="purple">{{ row.boResultStatus }}</Tag>
      <Tag v-if="row.boResultStatus=='已总检'"
           color="green">{{ row.boResultStatus }}</Tag>
      <Tag v-if="row.boResultStatus=='已打印'"
           color="cyan">{{ row.boResultStatus }}</Tag>
    </template>
    <template slot-scope="{ row }"
              slot="importStatus">
      <Tag v-if="row.importStatus=='未导入'"
           color="red">{{ row.importStatus }}</Tag>
      <Tag v-if="row.importStatus=='已导入'"
           color="green">{{ row.importStatus }}</Tag>
      <Tag v-if="row.importStatus=='导入中'"
           color="cyan">{{ row.importStatus }}</Tag>
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

