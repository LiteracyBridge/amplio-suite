import httpClient from './httpClient'

const getLanguages = async () => {
  const response = await httpClient().get('/languages')
  return response.data
}

export {
  getLanguages
}
