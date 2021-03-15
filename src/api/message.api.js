import httpClient from './httpClient'

const END_POINT = '/message'

const postMessage = async (programCode, playlistId) => {
    const params = { program_code: programCode, playlist_id: playlistId }
    const response = await httpClient().post(END_POINT, params)

    if (response.status >= 400) throw new Error(response.data.message)
    else return response.data
}

const putMessage = async (body) => {
    const response = await httpClient().put(END_POINT, body)

    if (response.status >= 400) throw new Error(response.data.message)
    else return response.data
}

const deleteMessage = async (programCode, messageId) => {
    const params = { program_code: programCode, message_id: messageId }
    const response = await httpClient().delete(END_POINT, { params })

    if (response.status >= 400) throw new Error(response.data.message)
    else return response.data
}

export {
    postMessage,
    putMessage,
    deleteMessage,
}
