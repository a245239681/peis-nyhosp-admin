import {
  login,
  logout
} from '@/api/user'
import router from '@/router'
import {
  setToken,
  getToken
} from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    userInfo: {}
  },
  getters: {
    getUserInfo: state => state.userInfo
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 登录
    handleLogin ({
      commit
    }, {
      userName,
      password,
      orgId
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        let params = {
          userName: userName,
          password: password,
          orgId: orgId
        }
        login(params).then(res => {
          // console.log(res)
          // const data = res.data
          // commit('setUserInfo', data)
          // commit('setToken', data.token)

          if (res.data && res.data.code == 0) {
            const data = res.data.data
            // commit('setUserInfo', data)
            commit('setToken', data.token)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        logout().then((res) => {
          // console.log(res)
          commit('setToken', '')
          commit('setAccess', [])
          commit('setHasGetInfo', false)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }

  }
}
