import { defineStore } from "pinia";
import { ApiRequest } from "@/api";
import { useAppStore } from "@/store/app.store";
import { Recipient } from "@/models/recipient";
import type { Deployment } from "@/models/deployment";

export const useTalkingBookAnalyticStore = defineStore("tb-analytics", {
	state: () => ({
		loading: false,
	}),
	actions: {
		async getTbStatusBy(selector: string) {
			return ApiRequest.get<Record<string, any>>(
				`tb-analytics/${useAppStore().programCode}/status?selector=${selector}`,
			);
		},
		async getRecipients(deployment: string) {
			this.loading = true;

			return ApiRequest.get<{
				recipients: Recipient[];
				tbs_deployed: Record<string, any>[];
				deployment: Deployment;
			}>(
				`tb-analytics/${useAppStore().programCode}/installations/${deployment}`,
			)
				.then((resp) => resp)
				.finally(() => (this.loading = false));
		},
	},
});
