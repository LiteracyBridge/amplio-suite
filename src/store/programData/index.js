import actions from './actions'
import mutations from './mutations'
import getters from './getters'


export const getDefaultState = () => ({
  programData: {
    dirty: false,
    status: '',
    programCode: '',
    data: {
      goals: [],
      listeningModels: []
    }
  },

  general: {
    dirty: false,
    status: '',
    projectCode: '',

    programName: '',
    languages: [],
    amountOfLang: 1,
  },

  deploymentsConfig: {
    dirty: false,
    amount: 0,
    first: '',
    length: '',
  },

  deployments: {
    dirty: false,
    status: "",
    projectCode: "",
    items: []
  },

  content: {
    dirty: false,
    status: "",
    projectCode: "",
    deploymentName: "",
    playlists: []
  }
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions,
  getters
}
