import store from '@/store';

const URL = 'https://l0im73yun2.execute-api.us-west-2.amazonaws.com/prod';
const SUPPORTED_LANGUAGES = '/supported_languages'

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

async function getLanguages(programid) {
  const init = makeInit();
  let url = `${URL}${SUPPORTED_LANGUAGES}`
  if (programid) {
    url += `?programid=${programid}`
  }
  const fetch_response = await fetch(url, init);
  let result = fetch_response.json();
  console.log(result);
  console.log(programid);
  return result;
}

export {
  getLanguages
}
