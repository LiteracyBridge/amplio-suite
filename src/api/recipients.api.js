import httpClient from './httpClient'

const END_POINT = '/recipient'

const getRecipients = async (params) => {
  const response = await httpClient().get(END_POINT, { params })

  if (response.data.status == 200) {
    return response.data
  } else {
    return {
      program_code: params.program_code,
      recipients: []
    }
  }
}

const postRecipient = async (recipient) => {
  const response = await httpClient().post(END_POINT, recipient)
  return response.data.recipientId
}

const putRecipient = async (recipient) => await httpClient().put(END_POINT, recipient)

const deleteRecipient = async (programCode, recipientId) => await httpClient().delete(END_POINT, {
  params: { program_code: programCode, recipient_id: recipientId }
})

export {
  getRecipients,
  postRecipient,
  putRecipient,
  deleteRecipient
}
