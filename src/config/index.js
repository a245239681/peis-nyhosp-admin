export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 7,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   * 外网：http://117.141.4.40:28087
   * 内网：http://192.168.3.70:8087
   * 测试：http://117.141.4.40:28782
   * 生产：https://192.168.5.15:8090/n1_ld_tijian
   * 生产内网：https://tjapi-ld-qzj-n1hosp.healthan.net:8090/n1_ld_tijian
   * 生产外网：https://tjapi-ld-qzj-n1hosp.healthan.net:22392/n1_ld_tijian
   * 迁移生产外网：https://wapplets-tj-n1hosp.healthan.net:22436/8007
   * 迁移生产内网：https://tjapi-ld-qzj-n1hosp.healthan.net/8007
   * 国际壮医测试：http://tijian.office.demo.healthan.com.cn:7780/48782
   */
  baseUrl: {
    dev: 'http://117.141.4.40:28782',
    preview: 'http://117.141.4.40:28087',
    test: 'http://117.141.4.40:28782',
    pro: 'https://wapplets-tj-n1hosp.healthan.net:22436/8007'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /** 
   * @description 机构配置 （废弃）
   */
  orgConfig: {
    '6AAE0EE975824952B4171858AA982880': {
      'isMainExam': true
    },
    '7AEB145528014DE29521426BBE85CDAB': {
      'isMainExam': true
    }
  },
  /**
   * @description 需要加载的插件
   */
  plugin: {
    // 'error-store': {
    //   showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
    //   developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    // }
  }
}
