import httpClient from './httpClient'

const END_POINT = '/message'

const postMessage = async (programCode, playlistId) => (await httpClient()
    .post(END_POINT, { programCode, playlistId }))
    .data

const putMessage = async (programCode, messages) => (await httpClient()
    .put(END_POINT, { programCode, messages }))
    .data

const deleteMessage = async (programCode, messageId) => (await httpClient()
    .delete(END_POINT, { params: { programCode, messageId }}))
    .data

export {
    postMessage,
    putMessage,
    deleteMessage,
}
