import Vue from 'vue'
import Vuex from 'vuex'

import wizard from './wizard'
import programIndex from './programIndex'
import program from './program'
import account from './account'
import notification from './notification'

import uiContent from './uiContent'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    wizard,
    programIndex,
    program,
    account,
    notification,
    uiContent
  }
})
