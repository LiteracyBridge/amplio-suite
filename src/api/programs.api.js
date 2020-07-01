import httpClient from './httpClient'
import store from '@/store'

const END_POINT = '/program'

const postProgram = (program) => httpClient.post(END_POINT, program)

const getPrograms = async () => {
  const { email } = store.state.account.user

  try {
    const response = await httpClient.post('programs', { email })
    return Object.keys(response.data.programs)
  }
  catch (e) {
    console.log(e)
  }
}

export {
  postProgram,
  getPrograms
}
