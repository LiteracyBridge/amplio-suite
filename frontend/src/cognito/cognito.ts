// // The imports we need from both aws-sdk and the cognito js library
// import { Config, CognitoIdentityCredentials } from "aws-sdk";
// import {
//     CognitoUser,
//     CognitoUserPool,
//     AuthenticationDetails,
//     CognitoUserAttribute,
//     CognitoUserSession
// } from "amazon-cognito-identity-js";

// import config from "./config";

// // We'll want to create a class for CognitoAuth which will
// // contain all the methods we will need within our App
// export default class CognitoAuth {
//     userSession: any = {};
//     userPool: CognitoUserPool;
//     options: any;

//     // The constructor for this class will initialize our userSession
//     // as null
//     constructor() {
//         this.userSession = null;
//         this.configure({
//             UserPoolId:
//                 import.meta.env.VITE_APP_COGNITO_USER_POOL_ID ||
//                 "us-west-2_3evpQGyi5",
//             ClientId:
//                 import.meta.env.VITE_APP_COGNITO_CLIENT_ID ||
//                 "5oviumtu4cmhspn9qt2bvn130s",
//             region: import.meta.env.VITE_APP_COGNITO_REGION || "us-west-2"
//         });
//     }

//     // this will set up our app to use cognito to use
//     // the user pool that we'll be creating later on
//     configure(config: { UserPoolId: any; ClientId: any; region: any }) {
//         if (typeof config !== "object" || Array.isArray(config)) {
//             throw new Error("[CognitoAuth error] valid option object required");
//         }
//         new Config({
//             region: config.region,
//             credentials: new CognitoIdentityCredentials({
//                 IdentityPoolId: config.UserPoolId
//             })
//         });

//         this.userPool = new CognitoUserPool({
//             UserPoolId: config.UserPoolId,
//             ClientId: config.ClientId
//         });
//         // console.log(this.userPool);
//         //  = config.region;
//         // Config.credentials = new CognitoIdentityCredentials({
//         //     IdentityPoolId: config.UserPoolId
//         // });
//         this.options = config;
//     }

//     // a signup function which will allow new people
//     // to create an account in our app
//     signup(
//         username: string,
//         email: string,
//         pass: string,
//         cb: (err: any, result: any) => void
//     ) {
//         let attributeList = [
//             new CognitoUserAttribute({
//                 Name: "email",
//                 Value: email
//             })
//         ];

//         this.userPool.signUp(username, pass, attributeList, null, cb);
//     }

//     // a function that will allow existing users to
//     // authenticate with our application
//     authenticate(
//         username: string,
//         pass: any,
//         cb: {
//             (err: any, result: { getIdToken: () => any }): void;
//             (arg0: null, arg1: CognitoUserSession): void;
//         }
//     ) {
//         let authenticationData = {
//             Username: username,
//             Password: pass,
//             ValidationData: { Application: "Amplio Suite" }
//         };
//         let authenticationDetails = new AuthenticationDetails(
//             authenticationData
//         );
//         let userData = { Username: username, Pool: this.userPool };
//         let cognitoUser = new CognitoUser(userData);

//         cognitoUser.authenticateUser(authenticationDetails, {
//             onSuccess: function(result) {
//                 var logins: any = {};
//                 logins[
//                     "cognito-idp." +
//                         config.region +
//                         ".amazonaws.com/" +
//                         config.UserPoolId
//                 ] = result.getIdToken().getJwtToken();

//                 new Config({
//                     credentials: new CognitoIdentityCredentials({
//                         IdentityPoolId: config.UserPoolId,
//                         Logins: logins
//                     })
//                 });

//                 cb(null, result);
//             },
//             onFailure: function(err) {
//                 cb(err, null);
//             },
//             newPasswordRequired: function() {
//                 // newPasswordRequired: function (userAttributes, requiredAttributes) {
//                 console.log("New Password Is Required");
//             }
//         });
//     }

//     forgotPassword(
//         username: any,
//         cb: { (err: any): void; (arg0: Error, arg1: undefined): void }
//     ) {
//         let userData = { Username: username, Pool: this.userPool };
//         let cognitoUser = new CognitoUser(userData);

//         cognitoUser.forgotPassword({
//             onSuccess: function(result) {
//                 cb(null, result);
//             },
//             onFailure: function(err) {
//                 cb(err);
//             }
//         });
//     }

//     confirmPassword(
//         username: any,
//         confirmationCode: string,
//         newPassword: string
//     ) {
//         let userData = { Username: username, Pool: this.userPool };
//         let cognitoUser = new CognitoUser(userData);

//         return new Promise((resolve, reject) => {
//             cognitoUser.confirmPassword(confirmationCode, newPassword, {
//                 onSuccess() {
//                     resolve(true);
//                 },
//                 onFailure(err) {
//                     reject(err);
//                 }
//             });
//         });
//     }

//     // a helper function that allows us to
//     // get the information for the current user
//     getCurrentUser() {
//         return this.userPool.getCurrentUser();
//     }

//     // a function that allows us to confirm newly
//     // registered users of our app
//     confirmRegistration(username: string, code: string) {
//         let cognitoUser = new CognitoUser({
//             Username: username,
//             Pool: this.userPool
//         });

//         return new Promise(resolve => {
//             cognitoUser.confirmRegistration(code, true, e => {
//                 console.log(e);
//                 resolve(e);
//             });
//         });
//     }

//     // does what it says on the tin, allows users
//     // to logout if they are already logged in
//     logout() {
//         this.getCurrentUser().signOut();
//     }

//     // Retrieve the users current token if they have
//     // a session, otherwise returns null
//     getIdToken(cb: (arg0: Error, arg1: null) => void) {
//         if (this.getCurrentUser() == null) {
//             return cb(null, null);
//         }
//         this.getCurrentUser().getSession(
//             (
//                 err: Error,
//                 session: {
//                     isValid: () => any;
//                     getIdToken: () => {
//                         (): any;
//                         new (): any;
//                         getJwtToken: { (): null; new (): any };
//                     };
//                 }
//             ) => {
//                 if (err) return cb(err, null);
//                 if (session.isValid()) {
//                     return cb(null, session.getIdToken().getJwtToken());
//                 }
//                 cb(Error("Session is invalid"), null);
//             }
//         );
//     }

//     isAuthenticated(cb: {
//         (tokenOrError: any, loggedIn: any): void;
//         (arg0: null, arg1: boolean): void;
//     }) {
//         let cognitoUser = this.getCurrentUser();
//         console.log("user", cognitoUser);
//         if (cognitoUser != null) {
//             cognitoUser.getSession((err: any, session: any) => {
//                 if (err) {
//                     return cb(err, false);
//                 }
//                 return cb(session, true);
//             });
//         } else {
//             cb(null, false);
//         }
//     }

//     install(app: any, options: any) {
//         app.config.globalProperties.$cognitoAuth = null;

//         app.mixin({
//             beforeCreate() {
//                 // if (this.$options.cognitoAuth) {
//                 this.$cognitoAuth = new CognitoAuth();
//                 this.$cognitoAuth.configure({
//                     UserPoolId:
//                         import.meta.env.VITE_APP_COGNITO_USER_POOL_ID ||
//                         "us-west-2_3evpQGyi5",
//                     ClientId:
//                         import.meta.env.VITE_APP_COGNITO_CLIENT_ID ||
//                         "5oviumtu4cmhspn9qt2bvn130s",
//                     region:
//                         import.meta.env.VITE_APP_COGNITO_REGION || "us-west-2"
//                 });
//                 this.$options.$cognitoAuth = this.$cognitoAuth;
//                 app.config.globalProperties.$cognitoAuth = this.$cognitoAuth;

//                 // }
//             }
//         });
//     }
// }

// // This installed CognitoAuth into our Vue instance
// // @ts-ignore
// CognitoAuth.install = function(app, options) {
//     app.config.globalProperties.$cognitoAuth = null;

//     app.mixin({
//         beforeCreate() {
//             // if (this.$options.cognitoAuth) {
//             this.$cognitoAuth = this.$options.cognitoAuth;
//             this.$cognitoAuth.configure({
//                 UserPoolId:
//                     import.meta.env.VITE_APP_COGNITO_USER_POOL_ID ||
//                     "us-west-2_3evpQGyi5",
//                 ClientId:
//                     import.meta.env.VITE_APP_COGNITO_CLIENT_ID ||
//                     "5oviumtu4cmhspn9qt2bvn130s",
//                 region: import.meta.env.VITE_APP_COGNITO_REGION || "us-west-2"
//             });
//             // }
//         }
//     });
// };
