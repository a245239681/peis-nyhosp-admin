<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  margin: 0;
  padding: 0;
  position: relative;
}
ul,
li {
  list-style: none;
}
.ivu-message {
  font-size: 16px !important;
  font-weight: bold !important;
  color: #252525 !important;
}
#app {
  .size;
  .main .main-content-con {
    min-height: calc(~'100% - 80px');
    overflow: visible;
  }
  .main-layout-con {
    min-height: 100%;
    height: auto;
    overflow: auto;
  }
  // 全局样式，字体调整
  .ivu-card-head {
    .title {
      color: #000;
    }
  }

  .ivu-form-item-label {
    font-size: 14px;
    color: #252525;
  }
  .ivu-input {
    font-size: 14px;
    color: #252525;
  }
  .ivu-btn {
    font-size: 14px;
  }
  .ivu-btn-small {
    font-size: 14px;
  }
  .ivu-select-input {
    font-size: 14px;
    color: #252525;
  }
  .ivu-select-item {
    font-size: 14px !important;
    color: #252525;
  }
  .ivu-select-selected-value {
    font-size: 14px !important;
    color: #252525;
  }
  .ivu-radio-wrapper {
    font-size: 14px;
    color: #252525;
  }
  .ma-tree-node__label {
    font-size: 14px;
    color: #252525;
  }
  .ivu-select-small.ivu-select-single
    .ivu-select-selection
    .ivu-select-placeholder,
  .ivu-select-small.ivu-select-single
    .ivu-select-selection
    .ivu-select-selected-value {
    height: 24px;
    line-height: 24px;
  }
  .ivu-table {
    font-size: 14px;
    color: #252525;
  }
  .ivu-table-header {
    color: #000;
  }
  .ivu-tabs-mini .ivu-tabs-tab {
    font-size: 14px;
    color: #252525;
  }
  .ivu-tabs-nav .ivu-tabs-tab {
    color: #252525;
  }
  .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #2d8cf0;
  }
  .ivu-input[disabled] {
    background-color: #fff;
  }
}
.ivu-modal {
  .ivu-form-item-label {
    font-size: 14px !important;
    color: #252525 !important;
  }
  .ivu-input {
    font-size: 14px;
    color: #252525;
  }
  .ivu-btn {
    font-size: 14px;
  }
  .ivu-btn-small {
    font-size: 14px;
  }
  .ivu-select-input {
    font-size: 14px;
    color: #252525;
  }
  .ivu-select-item {
    font-size: 14px !important;
    color: #252525 !important;
  }
  .ivu-select-selected-value {
    font-size: 14px !important;
    color: #252525 !important;
  }
  .ivu-radio-wrapper {
    font-size: 14px !important;
    color: #252525 !important;
  }
  .ivu-radio-wrapper-checked {
    color: #2d8cf0 !important;
  }
  .ivu-select-small.ivu-select-single
    .ivu-select-selection
    .ivu-select-placeholder,
  .ivu-select-small.ivu-select-single
    .ivu-select-selection
    .ivu-select-selected-value {
    height: 24px;
    line-height: 24px;
  }
  .ivu-table {
    font-size: 14px;
    color: #252525;
  }
  .ivu-table-header {
    color: #000;
  }
  .ivu-input[disabled] {
    background-color: #fff;
  }
  .pop-footer {
    color: #252525;
    font-size: 14px;
  }
}
.zk-table__cell-inner {
  font-size: 14px;
  color: #252525;
}
// 底部固定布局设置
.page-body {
  width: 100%;
  padding-bottom: 80px;
}
.page-footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  height: 60px;
  font-size: 14px;
  color: #252525;
  margin-left: -16px;
  clear: both;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
