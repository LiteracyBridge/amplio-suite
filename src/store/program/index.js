import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,

  state: {
    status: '',
    codeName: '',

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
      frequency: '',
      dates: []
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
