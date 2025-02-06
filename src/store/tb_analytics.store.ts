import { defineStore } from "pinia";
import { ApiRequest } from "@/api";
import { useAppStore } from "@/store/app.store";
import { Recipient } from "@/models/recipient";

export const useTalkingBookAnalyticStore = defineStore("tb-analytics", {
	state: () => ({
		loading: false,
		summaries: null as Record<string, any>
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
		async getDashboardSummaries(opts?: {
			deployment: string;
			district: string;
			community: string;
			language: string;
			playlist: string;
		}) {
			this.loading = true;
			const query = []
			if (opts?.deployment) {
				query.push(`deployment=${opts.deployment}`)
			}

			if (opts?.district) {
				query.push(`district=${opts.district}`)
			}

			if (opts?.community) {
				query.push(`community=${opts.community}`)
			}

			if (opts?.language) {
				query.push(`language=${opts.language}`)
			}

			if (opts?.playlist) {
				query.push(`playlist=${opts.playlist}`)
			}

			return ApiRequest.get<any>(`tb-analytics/${useAppStore().programCode}/summaries?${query.join('&')}`)
				.then((resp) => {
					this.summaries = resp[0]
					return resp
				})
				.finally(() => {
					this.loading = false;
				});
		},
		async getUsage(opts: {
			deployment: number;
			columns: string;
			group: string;
			date?: string;
		}) {
			this.loading = true;

			return ApiRequest.get<Record<string, any>>(
				`tb-analytics/${useAppStore().programCode}/usage?deployment=${opts.deployment}&columns=${opts.columns}&group=${opts.group}&date=${opts.date}`,
			)
				.then((resp) => resp)
				.finally(() => {
					this.loading = false;
				});
		},
		async getDeploymentDates(deployment?: number) {
			this.loading = true;

			return ApiRequest.get<{ date: string }>(
				`tb-analytics/${useAppStore().programCode}/deployment-dates?deployment=${deployment}`,
			)
				.then((resp) => resp)
				.finally(() => {
					this.loading = false;
				});
		},
	},
});
