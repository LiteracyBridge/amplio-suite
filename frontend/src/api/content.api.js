import store from '@/store'

const URL = 'https://v853rt57t9.execute-api.us-west-2.amazonaws.com/Prod'
const PUBLISH = '/publish'
const GET_CONTENT = '/get_content'
const PUT_CONTENT = '/put_content'

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

async function publish(programid) {
  const init = makeInit();
  const fetch_response = await fetch(`${URL}${PUBLISH}?programid=${programid}`, init);
  return fetch_response.json()
}

async function getContent(programid) {
  const init = makeInit();
  const fetch_response = await fetch(`${URL}${GET_CONTENT}?programid=${programid}`, init);
  return fetch_response.json()
}

async function putContent(programid, deployments) {
  console.log(deployments);
  let init = makeInit({method:'POST', data:deployments});
  let fetch_response = await fetch(`${URL}${PUT_CONTENT}?programid=${programid}`, init);
  console.log(fetch_response);
}

export {
  publish,
  getContent,
  putContent,
}
