import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import account from './account'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    actualStep: 1,
    completedSteps: [0],

    programName: '',
    goals: [],
    listeningModels: [],
    deployments: 0,
    deploymentFrequency: '',
    deploymentInit: '',
    feedbackFrequently: '',
    feedbackFrequentlyOther: '',
    languages: [''],
    amountOfLang: 1
  },
  mutations,
  actions,

  modules: {
    account
  }
})
