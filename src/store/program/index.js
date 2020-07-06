import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export const getDefaultState = () => ({
  general: {
    dirty: false,
    programName: '',
    languages: [],
    amountOfLang: 1,

    feedbackFrequently: '',
    feedbackFrequentlyOther: ''
  },

  deploymentsConfig: {
    dirty: false,
    amount: 0,
    first: '',
    frequency: ''
  },

  deployments: {
    dirty: false,
    data: []
  },

  content: {
    dirty: false,
    goals: [],
    listeningModels: [],
  }
})

const baseState = {
  status: '',
  codeName: '',
  codeNameId: ''
}

export default {
  namespaced: true,

  state: Object.assign(baseState, getDefaultState()),
  getters,
  mutations,
  actions
}
