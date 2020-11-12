module.exports = {
  UserPoolId: process.env.VUE_APP_COGNITO_USER_POOL_ID || "us-west-2_05cdu7ShB",
  ClientId: process.env.VUE_APP_COGNITO_CLIENT_ID || "7lkvnvm5c4i5mshov16jg67ori",
  region: process.env.VUE_APP_COGNITO_REGION || "us-west-2"
}
