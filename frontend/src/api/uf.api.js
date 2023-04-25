import store from '@/store';

const URL = 'https://t55bv9y1ad.execute-api.us-west-2.amazonaws.com/prod';
const GET_COUNTS = '/questionnaire/get_uf_counts'
const GET_DOWNLOAD_LINK = '/questionnaire/download'
const UPLOAD = '/questionnaire/upload'

function makeInit(params) {
  params = params || {}
  const method = params.method || 'GET';
  const data = params.data || undefined;
  let init = {
    method: method,
    cache: 'no-cache',
    headers: {Authorization: store.state.account.user.token.jwtToken}
  };
  if (data) {
    init.body = JSON.stringify(data);
    init.headers['Content-Type'] = 'application/json';
  }
  return init;
}

async function getUfCounts(programId) {
  const init = makeInit();
  let url = `${URL}${GET_COUNTS}?programid=${programId}`;
  const fetch_response = await fetch(url, init);
  let result = fetch_response.json();
  console.log(`getUfCounts for ${programId} result: ${result}`);
  return result;
}

async function getQuestionnaireDownloadLink({programId, deploymentNumber, language, filename}) {
    const init = makeInit();
    let url = `${URL}${GET_DOWNLOAD_LINK}?programid=${programId}&deploymentnumber=${deploymentNumber}&language=${language}`;
    if (filename) {
        url += `&filename=${filename}`
    }
    console.log(`fetching signed url to download questionnaire, calling: ${url}`)
    const fetch_response = await fetch(url, init);
    let result = fetch_response.json();
    console.log(`Got download link for ${programId}: ${result}`);
    return result;
}

async function questionnaireUpload({programId, deploymentNumber, language, fileData}) {
    const init = makeInit({method: 'POST', data: fileData});
    const url = `${URL}${UPLOAD}?programid=${programId}&deploymentnumber=${deploymentNumber}&language=${language}`;
    const fetch_request = new Request(url, init);
    const fetch_response = await fetch(fetch_request);
    return fetch_response.json();
}

export {
    getUfCounts,
    getQuestionnaireDownloadLink,
    questionnaireUpload,
}
