import httpClient from './httpClient'

const END_POINT = '/listening-models'

const getListeningModels = async () => (await httpClient()
  .get(END_POINT))
  .data


export {
  getListeningModels
}
