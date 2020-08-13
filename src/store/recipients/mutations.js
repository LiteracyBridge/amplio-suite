// FIXME When save the data on the DB, uncomment the follow line
// import { getDefaultState } from './index'

const setDirty = (state, status) => {
  state.dirty = status
}

const requestInit = (state) => {
  // Object.assign(state, getDefaultState())
  state.status = 'loading'
}

const requestError = (state) => {
  state.status = 'error'
}

const requestSuccess = (state) => {
  state.status = 'success'
}

const setRecipients = (state, payload) => {
  state.recipients = payload
}

const setRecipientsLabelMap = (state, payload) => {
  const { key, value } = payload
  state.labelMap[key] = value
}

const setRecipientTitle = (state, payload) => {
  const { recipientIndex, title } = payload
  state.recipients[recipientIndex].title = title
}

const setRecipientDeployments = (state, payload) => {
  const { recipientIndex, deployments } = payload
  state.recipients[recipientIndex].deployments = deployments
}

const setRecipientCountry = (state, payload) => {
  const { recipientIndex, country } = payload
  state.recipients[recipientIndex].country = country
}

const setRecipientRegion = (state, payload) => {
  const { recipientIndex, region } = payload
  state.recipients[recipientIndex].region = region
}

const setRecipientDistrict = (state, payload) => {
  const { recipientIndex, district } = payload
  state.recipients[recipientIndex].district = district
}

const setRecipientCommunity = (state, payload) => {
  const { recipientIndex, community } = payload
  state.recipients[recipientIndex].community = community
}

const setRecipientGroupName = (state, payload) => {
  const { recipientIndex, groupName } = payload
  state.recipients[recipientIndex].groupName = groupName
}

const setRecipientLang = (state, payload) => {
  const { recipientIndex, langs } = payload
  state.recipients[recipientIndex].language = langs
}

const addRecipientListeningModel = (state, payload) => {
  const { recipientIndex, listeningModel } = payload
  state.recipients[recipientIndex].listeningModels.push(listeningModel)
}

const removeRecipientListeningModel = (state, payload) => {
  const { recipientIndex, modelIndex } = payload
  state.recipients[recipientIndex].listeningModels.splice(modelIndex, 1)
}

const setRecipientAgent = (state, payload) => {
  const { recipientIndex, agent } = payload
  state.recipients[recipientIndex].agent = agent
}

const setRecipientAgentGender = (state, payload) => {
  const { recipientIndex, gender } = payload
  state.recipients[recipientIndex].agentGender = gender
}

const setRecipientSuportEntity = (state, payload) => {
  const { recipientIndex, suportEntity } = payload
  state.recipients[recipientIndex].suportEntity = suportEntity
}

const setRecipientDirectBeneficiaries = (state, payload) => {
  const { recipientIndex, directBeneficiaries } = payload
  state.recipients[recipientIndex].directBeneficiaries = directBeneficiaries
}

const setRecipientNumberTalkingBooks = (state, payload) => {
  const { recipientIndex, numberTalkingBooks } = payload
  state.recipients[recipientIndex].numberTalkingBooks = numberTalkingBooks
}

const setRecipientsAdditionalFields = (state, payload) => {
  const { recipientIndex, fields } = payload
  state.recipients[recipientIndex].directBeneficiariesAdditionalFields = fields
}

const setAdditionalLabels = (state, labels) => {
  state.additionalLabelsMap = labels
}

const setAdditionalLabel = (state, payload) => {
  const { key, value } = payload
  state.additionalLabelsMap[key] = value
}

const setRecipientsIndirectBeneficiaries = (state, payload) => {
  const { recipientIndex, indirectBeneficiaries } = payload
  state.recipients[recipientIndex].indirectBeneficiaries = indirectBeneficiaries
}

export default {
  setDirty,
  requestInit,
  requestError,
  requestSuccess,
  setRecipients,

  setRecipientsLabelMap,
  setRecipientTitle,
  setRecipientDeployments,
  setRecipientCountry,
  setRecipientRegion,
  setRecipientDistrict,
  setRecipientCommunity,
  setRecipientGroupName,
  setRecipientLang,
  addRecipientListeningModel,
  removeRecipientListeningModel,
  setRecipientAgent,
  setRecipientAgentGender,
  setRecipientSuportEntity,
  setRecipientDirectBeneficiaries,
  setRecipientNumberTalkingBooks,
  setRecipientsAdditionalFields,
  setAdditionalLabels,
  setAdditionalLabel,
  setRecipientsIndirectBeneficiaries,
}
