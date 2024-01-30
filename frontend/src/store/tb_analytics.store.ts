import { defineStore } from "pinia";
import { ApiRequest } from "@/api";
import { Program } from "@/models/program";
import { ProgramUser, User } from "@/models/user";
import { useAppStore } from "@/store/app.store";
import { sortBy } from "lodash";
import { notification } from "ant-design-vue";

export const useTalkingBookAnalyticStore = defineStore("tb-analytics", {
  state: () => ({
    loading: false,
  }),
  actions: {
    async getTbStatusBy(selector: string) {
      return ApiRequest.get<Record<string, any>>(
        `dashboard-queries/${useAppStore().programCode
        }/status?selector=${selector}`
      );
    },
    async getRecipients() {
      this.loading = true;

      return ApiRequest.get<Record<string, any>>(
        `dashboard-queries/${useAppStore().programCode
        }/recipients`
      ).then((resp) => resp)
        .finally(() => this.loading = false);
    }
  },
});
