import mutations from './mutations'
import actions from './actions'

export const getDefaultState = () => ({
  isComplete: false,
  actualStep: 1,
  completedSteps: [0] // First step is fill by default
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions
}
