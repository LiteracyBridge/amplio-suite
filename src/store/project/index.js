import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,

  state: {
    status: '',
    programCode: '',
    project: {
      name: '',
      active: false,
    }
  },
  mutations,
  actions
}
