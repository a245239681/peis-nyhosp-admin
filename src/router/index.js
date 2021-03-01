import Vue from 'vue'
import Router from 'vue-router'
import {
  globalRouters,
  mainRouters
} from './routers'
import store from '@/store'
import iView from 'iview'
import Main from '@/components/main'
import parentView from '@/components/parent-view'
import {
  setToken,
  getToken
} from '@/libs/util'
import {
  getUserInfo
} from '@/api/user'
// import config from '@/config'
// const {
//   homeName
// } = config

Vue.use(Router)
const createRouter = () => new Router({
  routes: globalRouters,
  mode: 'hash'
})

const router = createRouter()
// 切换账号时，重置路由权限
function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
    resetRouter()
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到登录页
    }) // 跳转
    resetRouter()
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
    resetRouter()
  } else {
    if (store.state.user.hasGetInfo) {
      // turnTo(to, store.state.user.access, next)
      next()
    } else {
      getUserInfo(token).then(res => {
        const result = res.data
        if (result.code == 0) {
          const data = result.data

          const listTree = fnAddDynamicMenuRoutes(data.menuList)
          console.log(listTree)
          listTree.push({
            path: '*',
            name: 'error_404',
            meta: {
              hideInMenu: true
            },
            component: resolve => require(['@/views/errorPage/404.vue'], resolve)
          })
          sessionStorage.setItem('menuList', JSON.stringify(globalRouters.concat(listTree) || '[]')) // 路由保存到sessionStorage
          store.commit('setAvator', 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png')
          store.commit('setUserName', data.poName)
          store.commit('setUserId', data.poId)
          store.commit('setAccess', ['super_admin'])
          store.commit('setUserInfo', data)
          store.commit('setHasGetInfo', true)
          router.addRoutes(listTree)
          next({
            ...to,
            replace: true
          })
          // if (to.matched.length === 0) {  //如果未匹配到路由

          //   from.name ? next({ name: from.name }) : next({ name: 'error_404' });   //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
          // } else {
          //   next();    //如果匹配到正确跳转
          // }
        } else {
          iView.Message.error(result.message)
          setToken('')
          next({
            name: 'login'
          })
          return false
        }
      }).catch(() => {
        iView.Message.error('获取用户信息失败，请稍后重试')
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

// 构建动态菜单

function fnAddDynamicMenuRoutes (menuList = []) {
  let temp = []
  for (let i = 0; i < menuList.length; i++) {
    let data = menuList[i]
    if (data.children && data.children.length >= 1) {
      if (data.level == 0) {
        let route = {
          path: data.poPageUrl,
          name: data.poPageUrl.replace(/^\//, ''),
          meta: {
            access: ['super_admin'],
            authority: data.authorityList,
            icon: data.poIcon,
            notCache: true,
            title: data.poName
          },
          component: Main,
          children: fnAddDynamicMenuRoutes(data.children)
        }
        temp.push(route)
      } else if (data.level == 1) {
        let route = {
          path: data.poPageUrl.replace(/^\//, ''),
          name: data.poPageUrl.replace(/^\//, ''),
          meta: {
            access: ['super_admin'],
            authority: data.authorityList,
            icon: data.poIcon,
            notCache: true,
            title: data.poName
          },
          component: parentView,
          children: fnAddDynamicMenuRoutes(data.children)
        }
        temp.push(route)
      }
    } else if (data.children && data.children.length == 0) {
      if (mainRouters[data.poPageUrl.replace(/^\//, '')]) {
        let route = {
          path: data.poPageUrl.replace(/^\//, ''),
          name: data.poPageUrl.replace(/^\//, ''),
          meta: {
            access: ['super_admin'],
            authority: data.authorityList,
            icon: data.poIcon,
            notCache: true,
            title: data.poName
          },
          component: mainRouters[data.poPageUrl.replace(/^\//, '')]
        }
        temp.push(route)
      }
    }
  }
  return temp
}

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

// 点击同一个路由，页面报错
// [NavigationDuplicated {_name: "NavigationDuplicated", name: "NavigationDuplicated"}]
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
/* 设置路由守卫后，this.$router.push(会报错Uncaught (in promise) */
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
