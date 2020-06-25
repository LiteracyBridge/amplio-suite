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
})

const baseState = {
  status: '',
  codeName: '',
  codeNameId: ''
}

export default {
  namespaced: true,

  state: Object.assign(baseState, getDefaultState()),
  mutations,
  actions
}
