import httpClient from './httpClient'

const END_POINT = '/recipient'

const getRecipient = async (program_code) => {
  const response = await httpClient().get(END_POINT, { params: { program_code } })
  return response.data
}

const postRecipient = async (recipient) => {
  const response = await httpClient().post(END_POINT, recipient)
  return response.data.id
}

const putRecipient = async (recipient) => await httpClient().put(END_POINT, recipient)

const deleteRecipient = async (programCode, recipientId) => await httpClient().delete(END_POINT, {
  params: { program_code: programCode, recipient_id: recipientId }
})

const getRecipients = async (program_code) => {
  const response = await httpClient().get("/recipients", { params: { program_code } })
  const recipients = Array.isArray(response.data) ? response.data : []

  return {
    program_code,
    recipients,
  }
}

export {
  getRecipient,
  postRecipient,
  putRecipient,
  deleteRecipient,
  getRecipients,
}
