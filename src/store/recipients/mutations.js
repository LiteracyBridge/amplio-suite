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

const setRecipients = (state, payload) => {
  const recipients = payload.recipients.map(recipient => ({
    id: recipient.recipient_id,
    partner: recipient.partner,
    communityName: recipient.community_name,
    groupName: recipient.group_name,
    affiliate: recipient.affiliate,
    component: recipient.component,
    country: recipient.country,
    region: recipient.region,
    district: recipient.district,
    numberTalkingBooks: recipient.num_tbs,
    supportEntity: recipient.support_entity,
    language: recipient.language,
    agent: recipient.agent,
    variant: recipient.variant,
    deployments: recipient.deployments,
    listeningModel: recipient.model,
    agentGender: recipient.agent_gender,
    directBeneficiaries: recipient.direct_beneficiaries,
    directBeneficiariesAdditional: recipient.direct_beneficiaries_additional,
    indirectBeneficiaries: recipient.indirect_beneficiaries,
  }))

  state.dirty = false
  state.status = 'success'
  state.programCode = payload.program_code
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
  const { recipientIndex, listeningModel } = payload
  state.recipients[recipientIndex].listeningModel = listeningModel
}

const setRecipientAgent = (state, payload) => {
  const { recipientIndex, agent } = payload
  state.recipients[recipientIndex].agent = agent
}

const setRecipientAgentGender = (state, payload) => {
  const { recipientIndex, gender } = payload
  state.recipients[recipientIndex].agentGender = gender
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
  const { recipientIndex, numberTalkingBooks } = payload
  state.recipients[recipientIndex].numberTalkingBooks = +numberTalkingBooks
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
  setRecipients,
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
  setRecipientSupportEntity,
  setRecipientNumberTalkingBooks,
  setRecipientDirectBeneficiaries,
  setRecipientDirectBeneficiariesAdditional,
  setRecipientsIndirectBeneficiaries,
}
