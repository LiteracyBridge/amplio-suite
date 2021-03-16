import actions from './actions'
import mutations from './mutations'


export const getDefaultState = () => ({
  dirty: false,
  status: '',
  programCode: '',

  country: '',
  region: [],

  goals: [],
  listeningModels: [],

  deploymentsCount: 0,
  deploymentsLength: '',
  deploymentsFirst: '',

  languages: [],

  feedbackFrequently: '',
  partner: '',
  affiliate: '',

  directBeneficiariesMap: {},
  directBeneficiariesAdditionalMap: {},
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions,
}
