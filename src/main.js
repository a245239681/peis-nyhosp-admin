// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import TreeTable from 'tree-table-vue'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import moment from 'moment'
// import $ from 'jquery'
// 引入树组件
import 'vue-tree-halower/dist/halower-tree.min.css'
import VTree from 'vue-tree-halower'
import MTree from 'hu-tree'

// 大数据表格
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

// Vue.prototype.$url = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
if (process.env.NODE_ENV === 'development') {
  Vue.prototype.$url = config.baseUrl.dev
} else if (process.env.VUE_APP_CURRENTMODE === 'production') {
  Vue.prototype.$url = config.baseUrl.pro
} else if (process.env.VUE_APP_CURRENTMODE === 'test') {
  Vue.prototype.$url = config.baseUrl.test
} else {
  Vue.prototype.$url = config.baseUrl.preview
}

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
// 配置全局message弹窗样式
iView.Message.config({
  top: 50,
  duration: 3
})
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VTree)
Vue.use(TreeTable)
Vue.use(MTree)
Vue.use(VXETable)

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
