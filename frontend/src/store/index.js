import Vue from 'vue'
import Vuex from 'vuex'

import ui from './ui'
import account from './account'
import wizard from './wizard'

import programs from './programs'
import programspec from './programspec'
import languages from './languages'
import categories from './categories'
import roadmap from './roadmap'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    ui,
    account,
    wizard,

    programs,
      programspec,
    languages,
    categories,
    roadmap,
  }
})
