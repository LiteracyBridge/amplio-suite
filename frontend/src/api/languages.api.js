import httpClient from './httpClient'

const END_POINT = '/languages'

const getLanguages = async () => (await httpClient()
  .get(END_POINT))
  .data


export {
  getLanguages
}
