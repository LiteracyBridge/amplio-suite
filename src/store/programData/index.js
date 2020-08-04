import actions from './actions'
import mutations from './mutations'


export const getDefaultState = () => ({
  dirty: false,
  status: '',
  programCode: '',

  goals: [],
  listeningModels: [],

  deploymentsAmount: 0,
  deploymentsLength: '',
  deploymentsFirst: '',

  languages: [],

  feedbackFrequently: '',
  feedbackFrequentlyOther: ''
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions,
}
