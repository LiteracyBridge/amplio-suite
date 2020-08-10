import {
  getRecipients,
  postRecipients,
  putRecipients,
} from '@/api/recipients.api'


const fetchRecipients = async ({ commit, rootState }) => {
  const { programCode } = rootState.program

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

const setRecipientNumberTalkingBooks = ({ commit }, payload) => {
  commit('setRecipientNumberTalkingBooks', payload)
  commit('setDirty', true)
}

const setRecipientDBFields = ({ commit, state }, payload) => {
  const { recipientIndex, fieldIndex, value } = payload
  let fields = state.recipients[recipientIndex].directBeneficiariesFields.map(ele => ({ ...ele }))
  fields[fieldIndex].value = value

  commit('setRecipientDBFields', { recipientIndex, fields })
  commit('setDirty', true)
}

export default {
  fetchRecipients,
  updateRecipients,

  addRecipient,
  removeRecipient,

  setRecipientTitle,
  setRecipientCountry,
  setRecipientRegion,
  setRecipientDistrict,
  setRecipientCommunity,
  setRecipientGroupName,
  setRecipientNumberTalkingBooks,
  setRecipientLang,
  setRecipientDBFields,
}
