import mutations from './mutations'
import actions from './actions'

export const getDefaultState = () => ({
  dirty: false,
  status: "",
  programCode: "",
  recipients: [],
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions
}
