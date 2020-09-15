import {
  getRecipients,
  postRecipient,
  putRecipient,
  deleteRecipient,
} from '@/api/recipients.api'

const recipientTemplate = () => ({
  id: null,

  communityName: '',
  groupName: '',
  country: '',
  region: '',
  district: '',
  numberTalkingBooks: null,
  supportEntity: '',
  language: '',
  agent: '',
  households: 0,
  groupSize: 0,
  deployments: [],
  listeningModel: '',
  agentGender: '',
  directBeneficiaries: null,
  directBeneficiariesAdditional: {},
  indirectBeneficiaries: null,
  variant: '',

  // FIXME
  partner: 'fixme',
  affiliate: 'fixme',
  component: 'fixme',
})


const fetchRecipients = async ({ commit, state, rootState }) => {
  const { programCode } = rootState.program

  if (state.status === 'loading') return
  if (state.programCode === programCode && !state.dirty) return

  commit('requestInit')

  try {
    const response = await getRecipients({ program_code: programCode })
    commit('setRecipients', response)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification', {type: 'alert', text: error.toString() }, { root: true })
  }
}

const updateRecipient = async ({ commit, state, rootState }, recipientIndex) => {
  const { programCode, recipients } = state
  const { partner, affiliate } = rootState.programData
  const recipient = recipients[recipientIndex]
  let recipientId = recipient.id

  const recipientData = {
    program_code: programCode,
    recipient_id: recipientId,
    community_name: recipient.communityName,
    group_name: recipient.groupName,
    component: recipient.component,
    country: recipient.country,
    region: recipient.region,
    district: recipient.district,
    num_households: recipient.households,
    num_tbs: recipient.numberTalkingBooks,
    support_entity: recipient.supportEntity,
    model: recipient.listeningModel,
    language: recipient.language,
    agent: recipient.agent,
    deployments: recipient.deployments,
    agent_gender: recipient.agentGender,
    group_size: recipient.groupSize,
    direct_beneficiaries: recipient.directBeneficiaries,
    direct_beneficiaries_additional: recipient.directBeneficiariesAdditional,
    indirect_beneficiaries: recipient.indirectBeneficiaries,
    variant: recipient.variant,
    partner,
    affiliate,
  }

  commit('requestInit')

  try {
    // Create recipient if this dont have recipientId
    // Else update the recipient
    if (!recipientId) recipientId = await postRecipient(recipientData)
    else await putRecipient(recipientData)

    commit('setDirty', false)
    commit('requestSuccess')
    commit('setRecipientId', { recipientIndex, id: recipientId })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const addRecipient = async ({ commit, rootState }) => {
  const deployments = rootState.deployments.items
  const recipient = recipientTemplate()
  recipient.deployments = deployments.map(deplo => deplo.deploymentnumber)

  commit('addRecipient', recipient)
  commit('setDirty', true)
}

const copyRecipient = async ({ commit, state }, recipientIndex) => {
  const recipient = { ...state.recipients[recipientIndex] }
  recipient.id = null

  commit('addRecipient', recipient)
  commit('setDirty', true)
}

const removeRecipient = async ({ commit, state }, index) => {
  const recipient = state.recipients[index]

  commit('requestInit')

  try {
    await deleteRecipient(state.programCode, recipient.id)
    commit('setDirty', false)
    commit('requestSuccess')
    commit('removeRecipient', recipient)
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const discardRecipient = async ({ commit, state }, recipientIndex) => {
  const recipient = state.recipients[recipientIndex]

  commit('requestInit')

  try {
    const response = await getRecipients({ program_code: state.programCode, recipient_id: recipient.id})
    commit('setDirty', false)
    commit('requestSuccess')
    commit('setRecipient', { recipient: response.recipient, recipientIndex })
  } catch (error) {
    commit('requestError')
    commit('ui/setNotification',{ type: 'alert', text: error.toString() }, { root: true })
  }
}

const setRecipientDeployments = ({ commit }, payload) => {
  payload.deployments.sort()
  commit('setRecipientDeployments', payload)
  commit('setDirty', true)
}

const addRecipientRegion = ({ commit }, payload) => {
  commit('addRecipientRegion', payload)
  commit('setDirty', true)
}

const removeRecipientRegion = ({ commit }, payload) => {
  commit('removeRecipientRegion', payload)
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

const setRecipientVariant = ({ commit }, payload) => {
  commit('setRecipientVariant', payload)
  commit('setDirty', true)
}

const setRecipientHouseholds = ({ commit }, payload) => {
  commit('setRecipientHouseholds', payload)
  commit('setDirty', true)
}

const setRecipientGroupSize = ({ commit }, payload) => {
  commit('setRecipientGroupSize', payload)
  commit('setDirty', true)
}

const setRecipientSupportEntity = ({ commit }, payload) => {
  commit('setRecipientSupportEntity', payload)
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
  // Create a new field key with a random id
  const value = `New additional field`
  const key = `field_${Math.random().toString(36).substring(7)}`

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
  updateRecipient,
  addRecipient,
  copyRecipient,
  removeRecipient,
  discardRecipient,

  setRecipientDeployments,
  addRecipientRegion,
  removeRecipientRegion,
  setRecipientDistrict,
  setRecipientCommunity,
  setRecipientGroupName,
  setRecipientLang,
  setRecipientListeningModel,
  setRecipientAgent,
  setRecipientAgentGender,
  setRecipientVariant,
  setRecipientHouseholds,
  setRecipientGroupSize,
  setRecipientSupportEntity,
  setRecipientNumberTalkingBooks,
  setRecipientDirectBeneficiaries,
  setRecipientsAdditionalFields,
  deleteAdditionalLabel,
  setAdditionalLabel,
  setRecipientsIndirectBeneficiaries,
}
