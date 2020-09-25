import httpClient from './httpClient'

const END_POINT = '/roadmap'

const getRoadmap = async (programCode) => {
  const response = await httpClient().get(END_POINT, {
    params: {
      program_code: programCode
    }
  })

  return response.data
}

const putRoadmap = async (data) => httpClient().put(END_POINT, data)

export {
  getRoadmap,
  putRoadmap
}
