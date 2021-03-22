import mutations from './mutations'
import actions from './actions'

export const getDefaultState = () => ({
  dirty: false,
  status: "",
  programCode: "",
  deployments: [],
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions
}
