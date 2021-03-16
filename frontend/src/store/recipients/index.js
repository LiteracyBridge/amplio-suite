import mutations from './mutations'
import actions from './actions'

export const getDefaultState = () => ({
  dirty: false,
  status: "",
  programCode: "",
  filterText: '',
  sortTable: {
    by: 'region',
    descending: true
  },
  recipientsToShow: 20,
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
    filterRecipients: (state) => {
      let recipients = [...state.recipients]

      // Sort
      const column = state.sortTable.by
      const direction = state.sortTable.descending ? 1 : -1
      recipients = recipients.sort((a, b) =>
        direction * a[column].toString().localeCompare(b[column].toString())
      )

      // Filter
      let text = state.filterText
      recipients = recipients.filter(reci =>
        Object.values(reci)
          .filter(val => val !== null)
          .some(val => val.toString().toLowerCase().includes(text.toLowerCase()))
      )

      return recipients.slice(0, state.recipientsToShow)
    }
  }
}
