import httpClient from './httpClient'

const END_POINT = '/message'

const postMessage = async (programId, playlistId) => (await httpClient()
    .post(END_POINT, { programId, playlistId }))
    .data

const putMessage = async (programId, messages) => (await httpClient()
    .put(END_POINT, { programId, messages }))
    .data

const deleteMessage = async (programId, messageId) => (await httpClient()
    .delete(END_POINT, { params: { programId, messageId }}))
    .data

export {
    postMessage,
    putMessage,
    deleteMessage,
}
