import store from '@/store'

const URL = 'https://v853rt57t9.execute-api.us-west-2.amazonaws.com/Prod'
const PUBLISH = '/publish'

async function publish(programid) {
  let init = {
    method: 'GET',
    headers: {'Authorization': store.state.account.user.token.jwtToken}
  };
  let fetch_response = await fetch(`${URL}${PUBLISH}?programid=${programid}`, init);
  return fetch_response.json()
}


export {
  publish,
}
