import actions from './actions'
import mutations from './mutations'

const testData = {
  deployments: {
    dirty: false,
    status: "success",
    project_code: "my-test-project-1",
    items: [
      {
        id: "1", // field: deployment
        startDate: "2021-08-08",
        endDate: "2021-09-08",
        component: "" // empty means 'all'
      },
      {
        id: "2",
        startDate: "2021-09-08",
        endDate: "2021-10-08",
        component: ""
      },
      {
        id: "4",
        startDate: "2021-10-08",
        endDate: "2021-11-08",
        component: ""
      },
      {
        id: "6",
        startDate: "2021-11-08",
        endDate: "2022-01-08",
        component: ""
      }
    ]
  },
  content: {
    dirty: false,
    status: "success",
    project_code: "my-test-project-1",
    deployment_id: 1,
    playlists: [
      {
        title: "Introduction to Program",
        audience: null,
        messages: [
          {
            title: "Message Title 1",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          },
          {
            title: "Message Title 2",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          },
          {
            title: "Message Title 3",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          }
        ]
      },
      {
        title: "Other Playlist",
        audience: null,
        messages: [
          {
            title: "Message Title 1",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          },
          {
            title: "Message Title 2",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          },
          {
            title: "Message Title 3",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          }
        ]
      },
      {
        title: "Playlist 3",
        audience: null,
        messages: [
          {
            title: "Message Title 1",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          },
          {
            title: "Message Title 2",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          },
          {
            title: "Message Title 3",
            language: "es",
            format: "drama",
            default_category: "health",
            variant: null,
            sdg_goal: "17",
            sdg_target: "17.18"
          }
        ]
      }
    ]
  }
}

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

  ...testData
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
