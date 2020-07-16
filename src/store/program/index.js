import actions from './actions'
import mutations from './mutations'
import getters from './getters'


export const getDefaultState = () => ({
  projectData: {
    dirty: false,
    status: 'success',
    project_code: 'my-test-project-1',
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

const baseState = {
  status: '',
  codeName: '',
  codeNameId: ''
}

export default {
  namespaced: true,

  state: Object.assign(baseState, getDefaultState()),
  mutations,
  actions,
  getters
}
