import httpClient from './httpClient'

const getSustainableDevelopments = async () => {
  const response = await httpClient().get('/sustainable-developments')
  return response.data
}

export {
  getSustainableDevelopments
}
