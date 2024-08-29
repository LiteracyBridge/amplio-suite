import { defineStore } from "pinia";
import { ApiRequest } from "@/api";
import { useAppStore } from "@/store/app.store";
import { Recipient } from "@/models/recipient";

export const useTalkingBookAnalyticStore = defineStore("tb-analytics", {
  state: () => ({
    loading: false,
  }),
  actions: {
    async getTbStatusBy(selector: string) {
      return ApiRequest.get<Record<string, any>>(
        `dashboard-queries/${
          useAppStore().programCode
        }/status?selector=${selector}`,
      );
    },
    async getRecipients(deployment: string) {
      this.loading = true;

      return ApiRequest.get<Recipient>(
        `dashboard-queries/${
          useAppStore().programCode
        }/recipients/${deployment}`,
      )
        .then((resp) => resp)
        .finally(() => (this.loading = false));
    },
  },
});
