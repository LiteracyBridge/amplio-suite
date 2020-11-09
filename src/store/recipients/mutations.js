// Map db model to store model
const responseToRecipient = (response) => ({
  id: response.recipient_id,
  partner: response.partner,
  communityName: response.community_name,
  groupName: response.group_name,
  affiliate: response.affiliate,
  component: response.component,
  country: response.country,
  region: response.region,
  district: response.district,
  numTbs: response.num_tbs,
  supportEntity: response.support_entity,
  language: response.language,
  agent: response.agent,
  variant: response.variant,
  numHouseholds: response.num_households,
  groupSize: response.group_size,
  deployments: response.deployments,
  model: +response.model,
  agentGender: response.agent_gender,
  directBeneficiaries: response.direct_beneficiaries,
  directBeneficiariesAdditional: response.direct_beneficiaries_additional,
  indirectBeneficiaries: response.indirect_beneficiaries,
})

const setDirty = (state, status) => {
  state.dirty = status
}

const requestInit = (state) => {
  state.status = 'loading'
}

const requestError = (state) => {
  state.status = 'error'
}

const requestSuccess = (state) => {
  state.status = 'success'
}

const setSortTable = (state, column) => {
  if (state.sortTable.by === column) {
    state.sortTable.descending = !state.sortTable.descending
  } else {
    state.sortTable.by = column
    state.sortTable.descending = false
  }
}

const setFilterText = (state, text) => {
  state.filterText = text
}

const resetFilter = (state) => {
  state.filterText = ''
  state.sortTable.by = ''
  state.sortTable.descending = false
}

const setRecipients = (state, payload) => {
  const recipients = payload.recipients
    .map(recipient => responseToRecipient(recipient))

  state.dirty = false
  state.status = 'success'
  state.programCode = payload.program_code
  state.recipients = recipients
}

const setRecipient = (state, payload) => {
  const { recipient, recipientIndex } = payload
  const recipients = [...state.recipients]
  recipients[recipientIndex] = responseToRecipient(recipient)

  state.recipients = recipients
}

const addRecipient = (state, payload) => {
  const { recipients } = state
  state.recipients = [...recipients, payload]
}

const removeRecipient = (state, payload) => {
  const recipients = [...state.recipients]
  const recipientIndex = recipients.findIndex(reci => reci.id === payload.id)

  if (recipientIndex > -1) {
    recipients.splice(recipientIndex, 1)
    state.recipients = recipients
  }
}

const setRecipientId = (state, payload) => {
  const { recipientIndex, id } = payload
  state.recipients[recipientIndex].id = id
}

const setRecipientDeployments = (state, payload) => {
  const { recipientIndex, deployments } = payload
  state.recipients[recipientIndex].deployments = deployments
}

const addRecipientRegion = (state, payload) => {
  const { recipientIndex, region } = payload
  state.recipients[recipientIndex].region = region
}

const removeRecipientRegion = (state, payload) => {
  const { recipientIndex } = payload
  state.recipients[recipientIndex].region = null
}

const setRecipientDistrict = (state, payload) => {
  const { recipientIndex, district } = payload
  state.recipients[recipientIndex].district = district
}

const setRecipientCommunity = (state, payload) => {
  const { recipientIndex, community } = payload
  state.recipients[recipientIndex].communityName = community
}

const setRecipientGroupName = (state, payload) => {
  const { recipientIndex, groupName } = payload
  state.recipients[recipientIndex].groupName = groupName
}

const setRecipientLang = (state, payload) => {
  const { recipientIndex, lang } = payload
  state.recipients[recipientIndex].language = lang
}

const setRecipientListeningModel = (state, payload) => {
  const { recipientIndex, model } = payload
  state.recipients[recipientIndex].model = model
}

const setRecipientAgent = (state, payload) => {
  const { recipientIndex, agent } = payload
  state.recipients[recipientIndex].agent = agent
}

const setRecipientAgentGender = (state, payload) => {
  const { recipientIndex, gender } = payload
  state.recipients[recipientIndex].agentGender = gender
}

const setRecipientVariant = (state, payload) => {
  const { recipientIndex, variant } = payload
  state.recipients[recipientIndex].variant = variant
}

const setRecipientHouseholds = (state, payload) => {
  const { recipientIndex, numHouseholds } = payload
  state.recipients[recipientIndex].numHouseholds = numHouseholds
}

const setRecipientGroupSize = (state, payload) => {
  const { recipientIndex, groupSize } = payload
  state.recipients[recipientIndex].groupSize = groupSize
}

const setRecipientSupportEntity = (state, payload) => {
  const { recipientIndex, supportEntity } = payload
  state.recipients[recipientIndex].supportEntity = supportEntity
}

const setRecipientDirectBeneficiaries = (state, payload) => {
  const { recipientIndex, directBeneficiaries } = payload
  state.recipients[recipientIndex].directBeneficiaries = +directBeneficiaries
}

const setRecipientNumberTalkingBooks = (state, payload) => {
  const { recipientIndex, numTbs } = payload
  state.recipients[recipientIndex].numTbs = +numTbs
}

const setRecipientDirectBeneficiariesAdditional = (state, payload) => {
  const { recipientIndex, key, value } = payload
  const data = { ...state.recipients[recipientIndex].directBeneficiariesAdditional }
  data[key] = value
  state.recipients[recipientIndex].directBeneficiariesAdditional = data
}

const setRecipientsIndirectBeneficiaries = (state, payload) => {
  const { recipientIndex, indirectBeneficiaries } = payload
  state.recipients[recipientIndex].indirectBeneficiaries = +indirectBeneficiaries
}

export default {
  setDirty,
  requestInit,
  requestError,
  requestSuccess,
  setSortTable,
  setFilterText,
  resetFilter,
  setRecipients,
  setRecipient,
  addRecipient,
  removeRecipient,

  setRecipientId,
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
  setRecipientDirectBeneficiariesAdditional,
  setRecipientsIndirectBeneficiaries,
}
