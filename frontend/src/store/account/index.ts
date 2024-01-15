// import cognitoAuth from "@/cognito";
import { defineStore } from "pinia";
import { Auth } from "aws-amplify";
import { Invitation, User } from "@/models/user";
import { ApiRequest } from "@/api";

export const useAccountStore = defineStore("account", {
  state: () => ({
    users: [] as User[],
    status: "",
    user: {
      email: "",
      name: "",
      img: "",
      token: "",
      organisation_id: null,
      roles: [],
    } as User,
    signUp: {
      send: false,
      email: "",
    },
  }),

  getters: {},

  actions: {
    authRequest() {
      this.status = "loading";
    },
    authSuccess() {
      this.status = "success";
    },
    authError() {
      this.status = "error";
    },
    setUser(payload: any) {
      this.user = payload;
    },
    setSignUp(email: string) {
      this.signUp.send = true;
      this.signUp.email = email;
    },
    clearSignUp() {
      this.signUp.send = false;
      this.signUp.email = "";
    },

    async logout() {
      this.setUser({ email: "", name: "", img: "", token: "" });
      // TODO: Logout from server & redirect user to login page

      // Auth.logout();
      // cognitoAuth.logout();
    },
    async requireAuth() {
      return Auth.currentAuthenticatedUser().then((data) => {
        // console.log(data);
        if (data && data.signInUserSession) {
          this.user.token ??= data.signInUserSession.idToken.jwtToken;
          this.user.email ??= data.attributes.email;
          this.user.name ??= data.attributes.email.split("@")[0];
          return;
          // TODO: Verify user from server
        } else {
          throw new Error("No current user");
        }
      });
    },
    //
    // API Requests
    //
    fetchUsers() {
      return ApiRequest.get<User>("users");
    },
    fetchInvitations() {
      return ApiRequest.get<Invitation>("users/invitations")
    }
  },
});
