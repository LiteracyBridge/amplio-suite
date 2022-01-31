import mutations from './mutations'
import actions from './actions'


export const getDefaultState = () => ({
  changed: false,
  status: "",
  programId: "",
  deployments: [],
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions
}
