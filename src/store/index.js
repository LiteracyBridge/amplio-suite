import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import wizard from './wizard'
import uiSettings from './uiSettings'
import notification from './notification'

import program from './program'
import programs from './programs'
import programData from './programData'
import deployments from './deployments'
import content from './content'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    account,
    wizard,
    uiSettings,
    notification,

    program,
    programs,
    programData,
    deployments,
    content,
  }
})
