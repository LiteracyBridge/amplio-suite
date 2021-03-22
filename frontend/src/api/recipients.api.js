import httpClient from './httpClient'

const END_POINT = '/recipient'

const getRecipient = async (programCode) => (await httpClient()
  .get(END_POINT, { params: { programCode }}))
  .data

const postRecipient = async (recipient) => (await httpClient()
  .post(END_POINT, { recipient }))
  .data.id

const putRecipient = async (recipient) => (await httpClient()
  .put(END_POINT, recipient))
  .data

const deleteRecipient = async (programCode, recipientId) => (await httpClient()
  .delete(END_POINT, { params: { programCode, recipientId }}))
  .data

const getRecipients = async (programCode) => {
  let recipients
  try {
    recipients = (await httpClient()
      .get('/recipients', { params: { programCode }}))
      .data
  } catch (err) {
    recipients = []
  }

  return {
    programCode,
    recipients: recipients
  }
}

export {
  getRecipient,
  postRecipient,
  putRecipient,
  deleteRecipient,
  getRecipients,
}
