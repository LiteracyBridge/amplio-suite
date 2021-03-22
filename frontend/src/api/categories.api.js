import httpClient from './httpClient'

const END_POINT = '/categories'

const getCategories = async () => (await httpClient()
  .get(END_POINT))
  .data


export {
  getCategories
}
