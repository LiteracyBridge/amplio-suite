import httpClient from './httpClient'

const END_POINT = '/program'

const postProgram = (program) => httpClient.post(END_POINT, program)

export {
    postProgram
}