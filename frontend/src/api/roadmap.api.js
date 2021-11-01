import httpClient from './httpClient'

const END_POINT = '/roadmap'

const getRoadmap = async (programId) => (await httpClient()
  .get(END_POINT, { params: { programId }}))
  .data

const putRoadmap = async (programId, complted) => (await httpClient()
  .put(END_POINT, { programId, complted }))
  .data

export {
  getRoadmap,
  putRoadmap,
}
