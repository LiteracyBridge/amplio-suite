import mutations from './mutations'
import actions from './actions'

export const getDefaultState = () => ({
  dirty: false,
  status: "",
  programCode: "",

  recipients: [],
  labelMap: {
    households:'Number of Households',
    male: 'Number Male',
    female: 'Number Famale',
    youth: 'Number Youth'
  }
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions
}
