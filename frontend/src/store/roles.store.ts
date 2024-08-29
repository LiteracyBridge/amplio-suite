import { ApiRequest } from "@/api";
import { Role } from "@/models/role";
import { User } from "@/models/user";
import { toSentenceCase, toTitleCase } from "@/utils";
import { defineStore } from "pinia";
import { useAccountStore } from "./account";
import { message, notification } from "ant-design-vue";
import { Program } from "@/models/program";
import { useProgramsStore } from "./programs";

export const useRolesStore = defineStore("roles-store", {
  state: () => ({
    loading: false,
    template: {} as { [module: string]: { value: string; label: string }[] },
    roles: [] as Role[],
  }),
  actions: {
    // API Requests
    create(form: Partial<Role>) {
      this.$state.loading = true;
      return ApiRequest.post<Role>("users/roles", form)
        .then((roles) => {
          this.$state.roles = roles;
          message.success({
            content: "Role created successfully",
          });
        })
        .finally(() => (this.$state.loading = false));
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
                value: val,
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
    assignRole(form: {
      user_id: number;
      roles: number[];
      program_id?: number;
    }) {
      this.loading = true;

      const path =
        form.program_id != null ? `programs/users` : `users/roles/assign`;
      return ApiRequest.post<User | Program>(path, form)
        .then((resp) => {
          if (form.program_id != null) {
            useProgramsStore().organisationPrograms = resp as Program[];
          } else {
            useAccountStore().users = resp as User[];
          }

          notification.success({
            message: `${form.program_id ? "Program added" : "Role assigned"
              } successfully`,
          });
        })
        .catch((err) => {
          notification.error({
            message: "Error assigning role",
            description: err.message,
          });
          throw err;
        })
        .finally(() => (this.loading = false));
    },
    revokeRole(form: { user_id: number; role_id: number }) {
      this.loading = true;

      return ApiRequest.post<User>("users/roles/revoke", form)
        .then((users) => {
          useAccountStore().users = users;
          notification.success({
            message: "Role revoked successfully",
          });
        })
        .catch((err) => {
          notification.error({
            message: "Error revoking role",
            description: err.message,
          });
          throw err;
        })
        .finally(() => (this.loading = false));
    },
    deleteRole(id: number) {
      this.loading = true;

      return ApiRequest.delete<Role>(`users/roles/${id}`)
        .then((roles) => {
          this.roles = roles;
          notification.success({
            message: "Role deleted successfully",
          });
        })
        .catch((err) => {
          notification.error({
            message: "Error deleting role",
            description: err.message,
          });
          throw err;
        })
        .finally(() => (this.loading = false));
    },
  },
});
