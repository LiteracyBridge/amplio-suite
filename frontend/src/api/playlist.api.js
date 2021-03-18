import httpClient from './httpClient'

const END_POINT = '/playlist'

const postPlaylist = async (programCode, deploymentId) => (await httpClient()
    .post(END_POINT, { programCode, deploymentId }))
    .data

const deletePlaylist = async (programCode, playlistId) => (await httpClient()
    .delete(END_POINT, { params: { programCode, playlistId }}))
    .data

const getPlaylists = async (programCode, deploymentId) => (await httpClient()
    .get(END_POINT, { params: { programCode, deploymentId }}))
    .data

const putPlaylists = async (programCode, playlists) => (await httpClient()
    .put(END_POINT, { programCode, playlists }))
    .data


export {
    postPlaylist,
    deletePlaylist,
    getPlaylists,
    putPlaylists,
}
