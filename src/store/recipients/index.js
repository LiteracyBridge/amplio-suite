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
    female: 'Number Female',
    youth: 'Number Youth'
  },
  additionalLabelsMap: {}
})

export default {
  namespaced: true,

  state: getDefaultState(),
  mutations,
  actions,

  getters: {
    labelUsed: (state) => {
      const result = {}
      const labels = Object.keys({ ...state.additionalLabelsMap })

      labels.forEach(label => {
        const recipientsFilter = state.recipients
          .filter(recipient => Object.keys(recipient.directBeneficiariesAdditionalFields).includes(label))

        result[label] = {
          used: recipientsFilter.length > 0 ? true : false,
          recipients: recipientsFilter.map(recipient => recipient.title)
        }
      })

      return result
    },
  }
}
