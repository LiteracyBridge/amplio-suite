import { getDefaultState } from './index'

const setDirty = (state, status) => {
  state.dirty = status
}

const requestInit = (state) => {
  Object.assign(state, getDefaultState())
  state.status = 'loading'
}

const requestError = (state) => {
  state.status = 'error'
}

const requestSuccess = (state) => {
  state.status = 'success'
}

const setRecipients = (state, payload) => {
  state.dirty = false
  state.status = 'success'
  state.recipients = payload
}

const setRecipientTitle = (state, payload) => {
  const { recipientIndex, title } = payload
  state.recipients[recipientIndex].title = title
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

const setRecipientNumberTalkingBooks = (state, payload) => {
  const { recipientIndex, numberTalkingBooks } = payload
  state.recipients[recipientIndex].numberTalkingBooks = numberTalkingBooks
}

const setRecipientDBFields = (state, payload) => {
  const { recipientIndex, fields } = payload
  state.recipients[recipientIndex].directBeneficiariesFields = fields
}

export default {
  setDirty,
  requestInit,
  requestError,
  requestSuccess,
  setRecipients,

  setRecipientTitle,
  setRecipientCountry,
  setRecipientRegion,
  setRecipientDistrict,
  setRecipientCommunity,
  setRecipientGroupName,
  setRecipientNumberTalkingBooks,
  setRecipientDBFields,
}
