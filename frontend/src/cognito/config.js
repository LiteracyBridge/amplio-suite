// !FIXME: update env files
export default {
    UserPoolId:
        import.meta.env.VITE_APP_COGNITO_USER_POOL_ID || "us-west-2_3evpQGyi5",
    ClientId:
        import.meta.env.VITE_APP_COGNITO_CLIENT_ID || "5oviumtu4cmhspn9qt2bvn130s",
    region: import.meta.env.VITE_APP_COGNITO_REGION || "us-west-2"
};
