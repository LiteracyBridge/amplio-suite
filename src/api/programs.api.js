import httpClient from './httpClient'
// import store from '@/store'

const END_POINT = '/program'

const postProgram = (program) => httpClient.post(END_POINT, program)

const getPrograms = () => {
    // const { email } = store.state.account.user
    return [{ name: 'some program name', id: '' }, { name: 'Program 2', id: '' }]
}

export {
    postProgram,
    getPrograms
}