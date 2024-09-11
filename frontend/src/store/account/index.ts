import { defineStore } from "pinia";
// import { Auth } from "aws-amplify";
import { type Invitation, User, type UserRole } from "@/models/user";
import { ApiRequest } from "@/api";
import type { Permission } from "@/models/role";
import type { Organisation } from "@/models/organisation";
import { useAppStore } from "../app.store";
import { LocalStorageKeys, RequestCacheKeys } from "@/models/constants";
import { clearCache } from "vue-request";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

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
      return (state.user.programs || []).map((pu) => pu.program);
    },
    email: (state) => state.user.email,
    isAmplioStaff: (state) => state.user.email.split("@")[1] === "amplio.org",
    fullName: (state) =>
      `${state.user.first_name || ""} ${state.user.last_name || ""}`,
  },
  actions: {
    setSignUp(email: string) {
      this.signUp.send = true;
      this.signUp.email = email;
    },
    clearSignUp() {
      this.signUp.send = false;
      this.signUp.email = "";
    },
    async logout() {
      return signOut().then((_resp) => {
        this.user = new User()

        // Clear local storage items
        for (const key in Object.keys(LocalStorageKeys)) {
          localStorage.removeItem(key);
        }

        // Clear vue request cache
        for (const key in Object.keys(RequestCacheKeys)) {
          clearCache(key);
        }

        return true
      });
    },
    async requireAuth() {
      return this.user.token != null && this.user.token !== ''
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
     * @param action The permission to check
     */
    can(action: Permission | Permission[]): boolean {
      if (Array.isArray(action)) {
        return action.some(p => this.can(p));
      }

      if(this.$state.user.permissions == null) {
        return false
      }

      if(this.$state.user.permissions[action] == null) {
        return false
      }

      try {
        return this.$state.user?.permissions[action] === true;
      } catch (error) {
        return false;
      }
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
        const activeProgram = localStorage.getItem(
          LocalStorageKeys.active_program,
        );
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
