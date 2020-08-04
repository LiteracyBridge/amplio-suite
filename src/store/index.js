import Vue from 'vue'
import Vuex from 'vuex'

import ui from './ui'
import account from './account'
import wizard from './wizard'
import uiSettings from './uiSettings'

import program from './program'
import programs from './programs'
import programData from './programData'
import deployments from './deployments'
import content from './content'
import languages from './languages'
import categories from './categories'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    ui,
    account,
    wizard,
    uiSettings,

    program,
    programs,
    programData,
    deployments,
    content,
    languages,
    categories,
  }
})
