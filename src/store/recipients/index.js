import mutations from './mutations'
import actions from './actions'

export const getDefaultState = () => ({
  dirty: false,
  status: "",
  programCode: "",
  sortTable: {
    by: '',
    descending: false
  },
  recipients: [],
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions,

  getters: {
    labelUsed: (state) => {
      const labels = new Set()
      state.recipients.forEach(recipient => {
        const keys = Object.keys(recipient.directBeneficiariesAdditional)
        keys.forEach(label => labels.add(label))
      })

      return Array.from(labels)
    },
  }
}
