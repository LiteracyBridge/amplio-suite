import actions from './actions'
import mutations from './mutations'

export const getDefaultState = () => ({
  status: '',
  programCode: '',
  program: {
    name: '',
    active: false,
  }
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions
}
