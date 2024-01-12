import { ApiRequest } from "@/api";
import { Role } from "@/models/role";
import { toSentenceCase, toTitleCase } from "@/utils";
import { defineStore } from "pinia";

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
    }
  }
});
