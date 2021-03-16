import httpClient from './httpClient'

const getCategories = async () => {
  const response = await httpClient().get('/categories')
  return response.data
}

export {
  getCategories
}
