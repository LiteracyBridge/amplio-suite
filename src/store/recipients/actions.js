import {
  getRecipients,
  postRecipients,
  putRecipients,
} from '@/api/recipients.api'


const fetchRecipients = async ({ commit, state, rootState }) => {
  const { programCode } = rootState.program

  if (state.recipients.length > 0) return

  commit('requestInit')

  try {
    const response = await getRecipients({ program_code: programCode })
    commit('setRecipients', response)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', {type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateRecipients = async ({ commit, state }) => {
  const { programCode, recipients } = state.program

  commit('requestInit')

  try {
    await putRecipients({ program_code: programCode, recipients })
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const addRecipient = async ({ commit, state }) => {
  const { programCode } = state
  const total = state.recipients.length
  let newRecipient

  commit('requestInit')

  try {
    newRecipient = await postRecipients({ program_code: programCode, total })
    commit('setDirty', false)
    commit('requestSuccess')
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }

  let recipients = [...state.recipients]
  recipients.push(newRecipient)
  commit('setRecipients', recipients)
}

const removeRecipient = ({ commit, state }, index) => {
  let recipients = [...state.recipients]
  recipients.splice(index, 1)

  commit('setRecipients', recipients)
  commit('setDirty', true)
}

const setRecipientTitle = ({ commit }, payload) => {
  commit('setRecipientTitle', payload)
  commit('setDirty', true)
}

const setRecipientDeployments = ({ commit }, payload) => {
  payload.deployments.sort()
  commit('setRecipientDeployments', payload)
  commit('setDirty', true)
}

const setRecipientCountry = ({ commit }, payload) => {
  commit('setRecipientCountry', payload)
  commit('setDirty', true)
}

const setRecipientRegion = ({ commit }, payload) => {
  commit('setRecipientRegion', payload)
  commit('setDirty', true)
}

const setRecipientDistrict = ({ commit }, payload) => {
  commit('setRecipientDistrict', payload)
  commit('setDirty', true)
}

const setRecipientCommunity = ({ commit }, payload) => {
  commit('setRecipientCommunity', payload)
  commit('setDirty', true)
}

const setRecipientGroupName = ({ commit }, payload) => {
  commit('setRecipientGroupName', payload)
  commit('setDirty', true)
}

const setRecipientLang = ({ commit }, payload) => {
  commit('setRecipientLang', payload)
  commit('setDirty', true)
}

const setRecipientListeningModel = ({ commit }, payload) => {
  commit('setRecipientListeningModel', payload)
  commit('setDirty', true)
}

const setRecipientAgent = ({ commit }, payload) => {
  commit('setRecipientAgent', payload)
  commit('setDirty', true)
}

const setRecipientAgentGender = ({ commit }, payload) => {
  commit('setRecipientAgentGender', payload)
  commit('setDirty', true)
}

const setRecipientSuportEntity = ({ commit }, payload) => {
  commit('setRecipientSuportEntity', payload)
  commit('setDirty', true)
}

const setRecipientDirectBeneficiaries = ({ commit }, payload) => {
  commit('setRecipientDirectBeneficiaries', payload)
  commit('setDirty', true)
}

const setRecipientNumberTalkingBooks = ({ commit }, payload) => {
  commit('setRecipientNumberTalkingBooks', payload)
  commit('setDirty', true)
}

const setRecipientsAdditionalFields = ({ commit, state }, payload) => {
    const { recipientIndex, key, value } = payload
    const fields = { ...state.recipients[recipientIndex].directBeneficiariesAdditionalFields }
    fields[key] = value

  commit('setRecipientsAdditionalFields', { recipientIndex, fields })
  commit('setDirty', true)
}

const addAdditionalLabel = ({ commit, state }) => {
  const total = Object.keys(state.additionalLabelsMap).length
  const value = `New field ${total}`
  const key = `field_${total}`

  const labels = { ...state.additionalLabelsMap }
  labels[key] = value

  commit('setAdditionalLabels', labels)
  commit('setDirty', true)
}

const deleteAdditionalLabel = ({ commit, state, getters }, key) => {
  const { labelUsed } = getters
  if (labelUsed[key].used) return

  const labels = { ...state.additionalLabelsMap }
  delete labels[key]

  commit('setAdditionalLabels', labels)
  commit('setDirty', true)
}

const setAdditionalLabel = ({ commit }, payload) => {
  commit('setAdditionalLabel', payload)
  commit('setDirty', true)
}

const setRecipientsIndirectBeneficiaries = ({ commit }, payload) => {
  commit('setRecipientsIndirectBeneficiaries', payload)
  commit('setDirty', true)
}

export default {
  fetchRecipients,
  updateRecipients,

  addRecipient,
  removeRecipient,

  setRecipientTitle,
  setRecipientDeployments,
  setRecipientCountry,
  setRecipientRegion,
  setRecipientDistrict,
  setRecipientCommunity,
  setRecipientGroupName,
  setRecipientNumberTalkingBooks,
  setRecipientLang,
  setRecipientListeningModel,
  setRecipientAgent,
  setRecipientAgentGender,
  setRecipientSuportEntity,
  setRecipientDirectBeneficiaries,
  setRecipientsAdditionalFields,
  addAdditionalLabel,
  deleteAdditionalLabel,
  setAdditionalLabel,
  setRecipientsIndirectBeneficiaries,
}
