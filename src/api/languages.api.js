import httpClient from './httpClient'

const getLanguages = async () => {
  try {
    const response = await httpClient.get('/languages')
    return response.data.languages
  }
  catch (e) {
    console.log(e)
  }
}

export {
  getLanguages
}
