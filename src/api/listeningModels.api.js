import httpClient from './httpClient'

const getListeningModels = async () => {
  const response = await httpClient.get('/listening-models')
  return response.data
}

export {
  getListeningModels
}
