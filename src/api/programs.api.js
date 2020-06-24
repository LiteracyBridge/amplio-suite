import httpClient from './httpClient'
// import store from '@/store'

const END_POINT = '/program'

const postProgram = (program) => httpClient.post(END_POINT, program)

const getPrograms = () => {
    // const { email } = store.state.account.user
    // return ['Code Name 1', 'Other code name']
    return ['Code Name 1']
}

export {
    postProgram,
    getPrograms
}
