// import cognitoAuth from "@/cognito";
import { defineStore } from "pinia";
import { Auth } from "aws-amplify";
import { Invitation, User, UserRole } from "@/models/user";
import { ApiRequest } from "@/api";
import { Permission } from "@/models/role";
import { Organisation } from "@/models/organisation";
import { useAppStore } from "../app.store";
import { LocalStorageKeys, RequestCacheKeys } from "@/models/constants";
import { clearCache } from "vue-request";

export const useAccountStore = defineStore("account", {
  state: () => ({
    users: [] as User[],
    organisations: [] as Organisation[],
    invitations: [] as Invitation[],
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

  getters: {
    programs: (state) => {
      return state.user.programs.map((pu) => pu.program);
    },
  },
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
      Auth.signOut().then((_resp) => {
        this.setUser({ email: "", name: "", img: "", token: "" });

        // Clear local storage items
        for (const key in Object.keys(LocalStorageKeys)) {
          localStorage.removeItem(key);
        }

        // Clear vue request cache
        for (const key in Object.keys(RequestCacheKeys)) {
          clearCache(key);
        }
      });
    },
    async requireAuth() {
      return Auth.currentAuthenticatedUser().then((data) => {
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
    /**
     * Returns user roles as a comma separated string
     *
     */
    rolesToString(roles: UserRole[]) {
      return (roles || [])
        .flatMap((role: UserRole) => role.role.name)
        .join(", ");
    },
    /**
     * Returns true if the user has the given permission
     *
     * It first checks if the user has permission for the given program ID.
     * If not, it then checks if the user has a system wide permission ('*').
     *
     * @param programId The program ID to check permissions for
     * @param permission The permission to check
     */
    can(programId: string | "*", permission: Permission): boolean {
      let hasPermission = false;

      let actions = this.user.permissions[programId];
      if (this.user.permissions[programId] != null) {
        hasPermission = actions[permission] === true;
      }

      if (hasPermission) {
        return true;
      }

      actions = this.user.permissions["*"];
      if (actions != null) {
        return actions[permission] === true;
      }
      return false;
    },

    //
    // API Requests
    //
    fetchUsers() {
      return ApiRequest.get<User>("users");
    },
    fetchInvitations() {
      return ApiRequest.get<Invitation>("users/invitations");
    },
    fetchAccountInfo(token: string) {
      // NB: This is add the token to request headers
      this.user = new User();
      this.user.token = token;

      return ApiRequest.get<User>("users/me").then(([resp]) => {
        this.user = User.fromJSON({
          ...resp,
          token: token,
        });

        // Set active program
        const activeProgram = localStorage.getItem(LocalStorageKeys.active_program);
        if (activeProgram != null) {
          useAppStore().setActiveProgram(JSON.parse(activeProgram).id);
        } else if (this.user.programs.length > 0) {
          useAppStore().setActiveProgram(this.user.programs[0].program.id);
        } else {
          // TODO: user has no programs, decide what to do
        }
      });
    },
    fetchOrganisations() {
      return ApiRequest.get<Organisation>("users/organisations");
    },
  },
});
