import Vue from 'vue'
import Vuex from 'vuex'
// import VuexReset from '@ianwalter/vuex-reset'
import user from './module/user'
import app from './module/app'
import dict from './module/dict'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [VuexReset()],
  state: {
    // message: 'Welcome!',
    // mutations: {
    //   reset: () => { }
    // }
  },
  mutations: {
    // reset: () => { }
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    dict
  }
})
