import httpClient from './httpClient'

const END_POINT = '/roadmap'

const getRoadmap = async (programCode) => (await httpClient()
  .get(END_POINT, { params: { programCode }}))
  .data

const putRoadmap = async (data) => (await httpClient()
  .put(END_POINT, data))
  .data

export {
  getRoadmap,
  putRoadmap,
}
