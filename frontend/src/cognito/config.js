module.exports = {
  UserPoolId: process.env.VUE_APP_COGNITO_USER_POOL_ID || "us-west-2_3evpQGyi5",
  ClientId: process.env.VUE_APP_COGNITO_CLIENT_ID || "5oviumtu4cmhspn9qt2bvn130s",
  region: process.env.VUE_APP_COGNITO_REGION || "us-west-2"
}
