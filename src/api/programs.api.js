import httpClient from './httpClient'
import store from '@/store'

const END_POINT = '/program'

const postProgram = (program) => httpClient.post(END_POINT, program)

const getPrograms = () => {
    const { email } = store.state.account.user

    if (email === 'franco@instedd.org') {
        return ['Code Name 1']
    } else {
        return ['Code Name 1', 'Other code name']
    }
}

export {
    postProgram,
    getPrograms
}
