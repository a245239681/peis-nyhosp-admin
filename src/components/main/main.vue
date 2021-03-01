<template>
  <Layout style="height: 100%"
          class="main">
    <Sider hide-trigger
           collapsible
           :width="280"
           :collapsed-width="64"
           v-model="collapsed"
           class="left-sider"
           :style="{overflow: 'hidden'}">
      <side-menu accordion
                 ref="sideMenu"
                 :active-name="$route.name"
                 :collapsed="collapsed"
                 @on-select="turnToPage"
                 :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <div class="logo-wrapper"
               v-show="!collapsed"
               key="max-logo">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 1024 1024"
                   width="40"
                   height="40"
                   style="">
                <path d="M988.672 935.722667h-52.949333v52.949333h-35.328v-52.949333h-52.906667v-35.328h52.906667v-52.906667h35.328v52.906667h52.949333v35.328zM141.226667 133.12h-27.136v-27.178667h-16.298667v27.178667h-27.178667V149.333333h27.178667v27.178667h16.298667V149.333333h27.136V133.12z m66.944 313.856h215.552l-147.072-145.92a64.256 64.256 0 0 0-90.453334 0L18.773333 467.2a63.018667 63.018667 0 0 0 0 89.685333l167.424 166.101334a64.426667 64.426667 0 0 0 90.453334 0l146.517333-145.322667H208.170667v-130.688z m369.408-238.848v215.04l145.408-146.56c24.746667-24.917333 24.746667-65.450667 0-90.453333L556.928 18.773333a63.061333 63.061333 0 0 0-89.770667 0L301.098667 186.154667a64.256 64.256 0 0 0 0 90.453333l145.92 147.114667V208.128h130.56z m-131.114667 607.616v-215.04l-145.450667 146.645333a64.469333 64.469333 0 0 0 0 90.453334l166.144 167.509333c24.704 24.917333 64.896 24.917333 89.728 0l166.016-167.594667a64.256 64.256 0 0 0 0-90.453333l-145.92-146.986667v215.594667h-130.517333v-0.128z m558.848-348.714667l-167.466667-165.973333a64.469333 64.469333 0 0 0-90.453333 0l-146.56 145.322667h215.04v130.602666H600.32l147.072 145.92a64.256 64.256 0 0 0 90.453333 0l167.509334-166.144a63.232 63.232 0 0 0 0-89.728z"
                      p-id="2766"
                      style="fill: rgb(45, 140, 240);"
                      transform="matrix(1, 0, 0, 1, 0, 0)" />
              </svg>
            </div>
            <div class="logo-discript">
              <h3>和湛科技体检系统</h3>
              <p>Physical Examination</p>
            </div>
          </div>
          <svg v-show="collapsed"
               key="min-logo"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 1024 1024"
               width="40"
               height="40"
               style="">
            <path d="M988.672 935.722667h-52.949333v52.949333h-35.328v-52.949333h-52.906667v-35.328h52.906667v-52.906667h35.328v52.906667h52.949333v35.328zM141.226667 133.12h-27.136v-27.178667h-16.298667v27.178667h-27.178667V149.333333h27.178667v27.178667h16.298667V149.333333h27.136V133.12z m66.944 313.856h215.552l-147.072-145.92a64.256 64.256 0 0 0-90.453334 0L18.773333 467.2a63.018667 63.018667 0 0 0 0 89.685333l167.424 166.101334a64.426667 64.426667 0 0 0 90.453334 0l146.517333-145.322667H208.170667v-130.688z m369.408-238.848v215.04l145.408-146.56c24.746667-24.917333 24.746667-65.450667 0-90.453333L556.928 18.773333a63.061333 63.061333 0 0 0-89.770667 0L301.098667 186.154667a64.256 64.256 0 0 0 0 90.453333l145.92 147.114667V208.128h130.56z m-131.114667 607.616v-215.04l-145.450667 146.645333a64.469333 64.469333 0 0 0 0 90.453334l166.144 167.509333c24.704 24.917333 64.896 24.917333 89.728 0l166.016-167.594667a64.256 64.256 0 0 0 0-90.453333l-145.92-146.986667v215.594667h-130.517333v-0.128z m558.848-348.714667l-167.466667-165.973333a64.469333 64.469333 0 0 0-90.453333 0l-146.56 145.322667h215.04v130.602666H600.32l147.072 145.92a64.256 64.256 0 0 0 90.453333 0l167.509334-166.144a63.232 63.232 0 0 0 0-89.728z"
                  p-id="2766"
                  style="fill: rgb(45, 140, 240);"
                  transform="matrix(1, 0, 0, 1, 0, 0)" />
          </svg>
          <!-- <img v-show="collapsed"
               :src="minLogo"
               key="min-logo" /> -->
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed"
                    @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator"
                :user-name="userName" />
          <language v-if="$config.useI18n"
                    @on-lang-change="setLocal"
                    style="margin-right: 10px;"
                    :lang="local" />
          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"
                       :has-read="hasReadErrorPage"
                       :count="errorCount"></error-store>
          <fullscreen v-model="isFullscreen"
                      style="margin-right: 10px;" />
          <div style="height: 64px;">
            <Button type="text"
                  @click="openPrinterModal"
                  size="small"
                  style="margin-right: 10px;">打印配置</Button>
          </div>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <!-- 暂时不需要导航tab -->
          <!-- <div class="tag-nav-wrapper">
            <tags-nav :value="$route"
                      @input="handleClick"
                      :list="tagNavList"
                      @on-close="handleCloseTag" />
          </div> -->
          <Content class="content-wrapper">
            <keep-alive :include="cacheList" exclude="feeDayBalance">
              <router-view />
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
    <printer-modal ref="printerModal"
                  :visible="printerModalVisible"
                  @close="printerModalVisible = false"></printer-modal>
  </Layout>
</template>
<script>
import PrinterModal from './components/printer-modal/printerDiag'
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual, getHomeRoute, getMenuByRouter } from '@/libs/util'
import minLogo from '@/assets/images/ico1.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    PrinterModal,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User
  },
  data () {
    return {
      printerModalVisible: false,
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      routePath: [],
      menuList: []
    }
  },
  created () {
    this.routePath = JSON.parse(sessionStorage.getItem('menuList'))
    this.$store.commit('setHomeRoute', getHomeRoute(this.routePath))
    this.menuList = getMenuByRouter(this.routePath, ['super_admin'])
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    userName () {
      return this.$store.state.user.userName
    },
    cacheList () {

      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    // menuList () {
    //   return this.$store.getters.menuList
    // },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    openPrinterModal() {
      this.$refs.printerModal.getPrinterConfig()
      this.printerModalVisible = true
    },
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    console.log(this.cacheList)
  }
}
</script>
<style lang="less">
.logo-con {
  display: flex;
  align-items: center;
}
.main .content-wrapper {
  height: auto;
  min-height: calc(~'100% - 80px');
  display: flex;
  width: 100%;
}
.logo-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  .logo {
    width: 40px;
    height: 40px;
  }
  .logo-discript {
    margin-left: 10px;
    flex: 1;
    color: #fff;
    white-space: nowrap;
    h3 {
      font-size: 20px;
    }
    p {
      font-size: 12px;
      text-align: justify;
    }
  }
}
</style>
