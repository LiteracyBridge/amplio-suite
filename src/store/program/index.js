import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,

  state: {
    status: '',
    programCode: '',
    program: {
      name: '',
      active: false,
    }
  },
  mutations,
  actions
}
