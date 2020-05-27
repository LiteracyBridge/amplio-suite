const makeLogin = (user, password) => {
  console.log(user, password)
  if (user === 'admin@amplio.org' && password === 'admin') {
    return 'some-token'
  }
  
  return null
}

export {
  makeLogin
}