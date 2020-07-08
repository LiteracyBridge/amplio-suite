import Vue from 'vue'
import Vuex from 'vuex'

import wizard from './wizard'
import project from './project'
import programs from './programs'
import programData from './programData'
import account from './account'
import notification from './notification'

import uiContent from './uiContent'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    wizard,
    project,
    programs,
    programData,
    account,
    notification,
    uiContent
  }
})
