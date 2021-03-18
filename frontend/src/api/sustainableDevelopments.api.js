import httpClient from './httpClient'

const END_POINT = '/sustainable-developments'

const getSustainableDevelopments = async () => (await httpClient()
  .get(END_POINT))
  .data

export {
  getSustainableDevelopments,
}
