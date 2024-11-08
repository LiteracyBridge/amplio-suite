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
				`tb-analytics/${useAppStore().programCode}/status?selector=${selector}`,
			);
		},
		async getRecipients() {
			this.loading = true;

			return ApiRequest.get<Recipient>(
				`tb-analytics/${useAppStore().programCode}/installations`,
			)
				.then((resp) => resp)
				.finally(() => {
					this.loading = false;
				});
		},
		async inventory() {
			this.loading = true;

			return ApiRequest.get<{
				deployment_number: string;
				community_name: number;
				deployed_tbs: number;
				deployment: string;
			}>(`tb-analytics/${useAppStore().programCode}/inventory`)
				.then((resp) => resp)
				.finally(() => {
					this.loading = false;
				});
		},
	},
});
