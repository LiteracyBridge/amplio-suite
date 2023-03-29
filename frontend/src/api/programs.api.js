import httpClient from './httpClient'
import store from '@/store';

const GET_PROGRAMS_URL = 'https://uomgzti07c.execute-api.us-west-2.amazonaws.com/prod';
const GET_PROGRAMS_ENDPOINT = '/getPrograms';
const END_POINT = '/program'

function makeInit(params) {
    params = params || {}
    const method = params.method || 'GET';
    const data = params.data || undefined;
    const fileData = params.fileData || undefined;
    let init = {
        method: method,
        cache: 'no-cache',
        headers: {Authorization: store.state.account.user.token.jwtToken}
    };
    if (data) {
        init.body = JSON.stringify(data);
        init.headers['Content-Type'] = 'application/json';
    } else if (fileData) {
        init.body = fileData;
        //init.headers['Content-Type'] = 'application/text';
    }
    return init;
}

/**
 * Gets a list of programs in which this user has some role.
 * {
 *   "result": {
 *     "status": "ok",
 *     "programs": {
 *       "CBCC-KE-OB": {
 *         "roles": "*,AD,PM,CO,FO",
 *         "name": "CBCC - Obulesi Bulahi",
 *         "repository": "s3"
 *       },
 *       "MEDA": {
 *         "roles": "*,AD,PM,CO,FO",
 *         "name": "MEDA"
 *       },
 *  . . .
 *      },
 *     "implicit_repository": "dbx"
 *   }
 * }
 * @returns {Promise<any>}
 */
async function getPrograms2() {
    const init = makeInit();
    const fetch_response = await fetch(`${GET_PROGRAMS_URL}${GET_PROGRAMS_ENDPOINT}`, init);
    return fetch_response.json();
}

const getPrograms = async () => {
    const response = (await httpClient()
        .get('/programs'))
        .data
    return Object.keys(response).sort()
}


const getProgram = async (programId) => (await httpClient()
    .get(END_POINT, {params: {programId}}))
    .data

const postProgram = async (program) => (await httpClient()
    .post(END_POINT, program))
    .data

const putProgram = async (program) => (await httpClient()
    .put(END_POINT, program))
    .data

const postProgramNewDeployment = async (programId) => (await httpClient()
    .post('program-next-deployment', {programId}))
    .data

export {
    getPrograms,
    getPrograms2,
    getProgram,
    postProgram,
    putProgram,
    postProgramNewDeployment
}
