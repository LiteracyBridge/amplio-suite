import httpClient from './httpClient'

const END_POINT = '/roadmap'

const getRoadmap = async (programCode) => (await httpClient()
  .get(END_POINT, { params: { programCode }}))
  .data

const putRoadmap = async (programCode, complted) => (await httpClient()
  .put(END_POINT, { programCode, complted }))
  .data

export {
  getRoadmap,
  putRoadmap,
}
