import { ApiRequest } from "@/api";
import { Role } from "@/models/role";
import { User } from "@/models/user";
import { toSentenceCase, toTitleCase } from "@/utils";
import { defineStore } from "pinia";
import { useAccountStore } from "./account";
import { notification } from "ant-design-vue";

export const useRolesStore = defineStore("roles-store", {
  state: () => ({
    loading: false,
    template: {} as { [module: string]: { value: string; label: string }[] },
    roles: [] as Role[]
  }),
  actions: {
    // API Requests
    create(form: Role) {
      return ApiRequest.post<Role>("users/roles", form);
    },
    fetchRoles() {
      return ApiRequest.get<Role>("users/roles");
    },
    fetchTemplates() {
      this.loading = true;
      return ApiRequest.get<Role>("users/roles/template")
        .then(([resp]) => {
          const data = resp as any;

          Object.keys(data).forEach((i: string) => {
            data[i] = data[i].map((val: string) => {
              return {
                label: toTitleCase(toSentenceCase(val, true)),
                value: val
              };
            });
          });
          this.template = data;
          return data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    assignRole(form: { users: number[]; role_id: number, program_id: number }) {
      this.loading = true;

      return ApiRequest.post<User>("users/roles/assign", form)
        .then(users => {
          useAccountStore().users = users;
          // TODO: if user is self, reload app to update permissions
          notification.success({
            message: "Role assigned successfully"
          });
        })
        .catch(err => {
          notification.error({
            message: "Error assigning role",
            description: err.message
          });
          throw err;
        })
        .finally(() => (this.loading = false));
    },
    revokeRole(form: { user_id: number; role_id: number }) {
      this.loading = true;

      return ApiRequest.post<User>("users/roles/revoke", form)
        .then(users => {
          useAccountStore().users = users;
          notification.success({
            message: "Role revoked successfully"
          });
        })
        .catch(err => {
          notification.error({
            message: "Error revoking role",
            description: err.message
          });
          throw err;
        })
        .finally(() => (this.loading = false));
    },
    deleteRole(id: number) {
      this.loading = true;

      return ApiRequest.delete<Role>(`users/roles/${id}`)
        .then(roles => {
          this.roles = roles;
          notification.success({
            message: "Role deleted successfully"
          });
        })
        .catch(err => {
          notification.error({
            message: "Error deleting role",
            description: err.message
          });
          throw err;
        })
        .finally(() => (this.loading = false));
    }
  }
});
