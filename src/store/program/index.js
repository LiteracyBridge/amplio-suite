import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,

  state: {
    status: '',
    actualStep: 1,
    completedSteps: [0, 7], // First and last step all fill by default
    setupIsComplete: false,

    general: {
      dirty: false,
      programName: '',
      languages: [],
      amountOfLang: 1,

      feedbackFrequently: '',
      feedbackFrequentlyOther: ''
    },

    deployments: {
      dirty: false,
      amount: 0,
      first: '',
      frequency: ''
    },

    content: {
      dirty: false,
      goals: [],
      listeningModels: [],
    }
  },

  mutations,
  actions
}