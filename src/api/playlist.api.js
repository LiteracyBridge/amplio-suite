import httpClient from './httpClient'

const END_POINT = '/playlist'

const postPlaylist = async (programCode, deploymentId) => {
    const params = { program_code: programCode, deployment_id: deploymentId }
    const response = await httpClient().post(END_POINT, params)
    return response.data
}

const deletePlaylist = async (programCode, playlistId) => {
    const params = { program_code: programCode, playlist_id: playlistId }
    const response = await httpClient().delete(END_POINT, { params })
    return response.data
}

const getPlaylists = async (programCode, deploymentId) => {
    const params = { program_code: programCode, deployment_id: deploymentId }
    const response = await httpClient().get(END_POINT, { params })
    return {
        programCode,
        deploymentId,
        playlists: response.data,
    }
}

const putPlaylists = async (body) => {
    const response = await httpClient().put(END_POINT, body)
    return response.data
}


export {
    postPlaylist,
    deletePlaylist,
    getPlaylists,
    putPlaylists,
}
