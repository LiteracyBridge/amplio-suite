import Vue from 'vue'
import Vuex from 'vuex'

import ui from './ui'
import account from './account'
import wizard from './wizard'

import program from './program'
import programs from './programs'
import programData from './programData'
import deployments from './deployments'
import content from './content'
import content2 from './content2'
import recipients from './recipients'
import languages from './languages'
import categories from './categories'
import roadmap from './roadmap'
// import listeningModels from './listeningModels'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    ui,
    account,
    wizard,

    program,
    programs,
    programData,
    deployments,
    content,
    content2,
    recipients,
    languages,
    categories,
    // listeningModels,
    roadmap,
  }
})
