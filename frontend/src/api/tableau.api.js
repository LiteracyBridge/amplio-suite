import store from '@/store';

const URL = 'https://ce3mtumbfh.execute-api.us-west-2.amazonaws.com/prod';
const GET_JWT = '/getjwt'

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

async function getTableauJwt(programid) {
  const init = makeInit();
  let url = `${URL}${GET_JWT}`
  if (programid) {
    url += `?programid=${programid}&user=lisa@amplio.org`;
  }
  const fetch_response = await fetch(url, init);
  let result = fetch_response.json();
  console.log(result);
  console.log(programid);
  return result;
}

export {
    getTableauJwt
}
