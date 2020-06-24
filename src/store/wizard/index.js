import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,

  state: () => ({
    isComplete: false,
    actualStep: 1,
    completedSteps: [0] // First step is fill by default
  }),

  mutations,
  actions
}
