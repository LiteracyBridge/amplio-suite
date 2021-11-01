import httpClient from './httpClient'

const END_POINT = '/recipient'

const getRecipient = async (programId) => (await httpClient()
  .get(END_POINT, { params: { programId }}))
  .data

const postRecipient = async (recipient) => (await httpClient()
  .post(END_POINT, { recipient }))
  .data.id

const putRecipient = async (recipient) => (await httpClient()
  .put(END_POINT, { recipient }))
  .data

const deleteRecipient = async (programId, recipientId) => (await httpClient()
  .delete(END_POINT, { params: { programId, recipientId }}))
  .data

const getRecipients = async (programId) => {
  let recipients
  try {
    recipients = (await httpClient()
      .get('/recipients', { params: { programId }}))
      .data
  } catch (err) {
    recipients = []
  }

  return {
    programId,
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
