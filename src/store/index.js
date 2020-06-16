import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import account from './account'
import notification from './notification'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    actualStep: 1,
    completedSteps: [0, 7], // First and last step all fill by default

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
    account,
    notification
  }
})
