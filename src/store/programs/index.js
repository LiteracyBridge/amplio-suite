import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,

  state: () => ({
    status: '',
    programs: [],
  }),

  mutations,
  actions
}
