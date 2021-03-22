import actions from './actions'
import mutations from './mutations'

export const getDefaultState = () => ({
  dirty: false,
  status: '',
  programCode: '',
  programName: '',
  active: false,
  wizardCompleted: null,
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions
}
