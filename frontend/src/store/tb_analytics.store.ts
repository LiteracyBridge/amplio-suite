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
		async getRecipients() {
			this.loading = true;

			return ApiRequest.get<Recipient>(
				`tb-analytics/${useAppStore().programCode}/installations`,
			)
				.then((resp) => resp)
				.finally(() => (this.loading = false));
		},
	},
});
