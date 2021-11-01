import httpClient from './httpClient'

const END_POINT = '/playlist'

const postPlaylist = async (programId, deploymentId) => (await httpClient()
    .post(END_POINT, { programId, deploymentId }))
    .data

const deletePlaylist = async (programId, playlistId) => (await httpClient()
    .delete(END_POINT, { params: { programId, playlistId }}))
    .data

const getPlaylists = async (programId, deploymentId) => (await httpClient()
    .get(END_POINT, { params: { programId, deploymentId }}))
    .data

const putPlaylists = async (programId, playlists) => (await httpClient()
    .put(END_POINT, { programId, playlists }))
    .data


export {
    postPlaylist,
    deletePlaylist,
    getPlaylists,
    putPlaylists,
}
