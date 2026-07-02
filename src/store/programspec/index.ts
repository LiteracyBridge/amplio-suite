import { defineStore } from "pinia";
import { useUIStore } from "../ui";
import {
	getDownloadLink,
	// getProgramSpec,
	publish,
	putProgramSpec,
	uploadSpec as uploadSpecFile,
	approveSpec as approveSpecFile,
} from "@/api/programspec.api";
import { Language } from "@/models/language";
import { Recipient } from "@/models/recipient";
import { Deployment } from "@/models/deployment";
import { Program } from "@/models/program";
import { Playlist } from "@/models/playlist";
import { Message } from "@/models/message";
import { ApiRequest } from "@/api";
import { notification } from "ant-design-vue";
import { orderBy } from "lodash";
import { useLanguagesStore } from "../languages";

const TEMP_RECIPIENT_PREFIX = "$$TEMP-";
const TEMP_RECIPIENT_RE = /^\$\$TEMP-([0-9]+)$/;

export const getDefaultGeneral = () => ({
	program_id: "TEST",
	name: "My Test Program",
	country: "United States of America",
	region: ["WA"],
	languages: ["en"],
	deployments_count: 1,
	deployments_length: "one_year",
	deployments_first: "2021-11-27",
	listening_models: ["Other"],
	feedback_frequency: "annually",
	sustainable_development_goals: [1],
	direct_beneficiaries_map: {
		male: "Number of Male",
		female: "Number of Female",
		youth: "Number of Youth",
	},
	direct_beneficiaries_additional_map: {},
	tableau_id: null as string | number | null,
});

export const getDefaultState = () => {
	const defaultState = {
		changed: false,
		status: "",
		programId: "",
		deployments: [] as Deployment[],
		recipients: [] as Recipient[],
		general: new Program(),
		filterText: "",
		sortTable: {
			by: "region",
			descending: true,
		},
	};
	return defaultState;
};

export const useProgramSpecStore = defineStore("programspec", {
	state: () => ({
		loading: false,
		deployments: [] as Deployment[],
		recipients: [] as Recipient[],
		general: new Program(),
		languages: [] as Language[],
		programId: "",

		changed: false,
		status: "",
		filterText: "",
		sortTable: {
			by: "region",
			descending: true,
		},
		isPublished: false,
	}),
	getters: {
		canPublish: (state) => {
			const hasOneMessage = (state.deployments || []).some((depl) =>
				depl.playlists.some((pl: any) => pl.messages.length > 0),
			);
			const hasOneRecipient = (state.recipients || []).length > 0;
			return hasOneMessage && hasOneRecipient && !state.isPublished;
		},
		labelUsed: (state) => {
			console.log(state.recipients);

			const labels = new Set();
			(state.recipients || []).forEach((r) => {
				const keys = Object.keys(r.direct_beneficiaries_additional || {});
				keys.forEach((label) => labels.add(label));
			});

			return Array.from(labels);
		},
		directBeneficiariesAdditionalLabels: (state) => {
			const keys = Object.keys(
				state.general.direct_beneficiaries_additional_map,
			);
			return keys.map((key) => ({
				key,
				value: state.general.direct_beneficiaries_additional_map[key],
			}));
		},
		directBeneficiariesLabels: (state) => {
			const keys = Object.keys(state.general.direct_beneficiaries_map);
			return keys.map((key: any) => ({
				key,
				value: state.general.direct_beneficiaries_map[key],
			}));
		},
		languageCodes: (state) => state.languages.map((l) => l.code),
	},
	actions: {
		resetState() {
			Object.assign(this, {});
		},

		setChanged(status: boolean) {
			this.changed = status;
		},
		// deprecated
		setDirty(status: boolean) {
			this.changed = status;
		},

		requestInit() {
			this.status = "loading";
		},

		requestError() {
			this.status = "error";
		},

		requestSuccess() {
			this.status = "success";
		},

		//region Access helpers for Deployment, Playlist, & Message.
		/************************************************************************************************************
		 * This helper return the deployment object from the state, given one of the deploymentIx (index in array)
		 * the deploymentnumber, or deployment object (including a copy/clone/proxy/look-alike of the deployment object).
		 * @param state
		 * @param payload with 'deploymentIx', 'deploymentnumber', or 'deployment' member
		 * @returns the deployment object from the state
		 */
		getDeployment(payload: {
			enddate?: any;
			deploymentname?: any;
			playlists?: any;
			playlist?: { position: any };
			deploymentIx?: any;
			deploymentnumber?: any;
			deployment?: any;
		}) {
			let deploymentIx = payload.deploymentIx;
			if (
				deploymentIx === undefined &&
				payload.deploymentnumber !== undefined
			) {
				deploymentIx = this.deployments.findIndex(
					(d: { deploymentnumber: any }) =>
						d.deploymentnumber === payload.deploymentnumber,
				);
			}
			if (
				deploymentIx === undefined &&
				payload.deployment &&
				payload.deployment.deploymentnumber !== undefined
			) {
				deploymentIx = this.deployments.findIndex(
					(d: { deploymentnumber: any }) =>
						d.deploymentnumber === payload.deployment.deploymentnumber,
				);
			}
			return this.deployments[deploymentIx];
		},

		/**
		 * Like getDeployment, but for Playlists.
		 */
		getPlaylist(payload: any) {
			const deployment = this.getDeployment(payload);
			let playlistIx = payload.playlistIx;
			if (
				playlistIx === undefined &&
				payload.playlist &&
				payload.playlist.position !== undefined
			) {
				playlistIx = deployment.playlists.findIndex(
					(p: { position: any }) => p.position === payload.playlist.position,
				);
			}
			return deployment.playlists[playlistIx];
		},

		getMessage(payload: any) {
			const playlist = this.getPlaylist(payload);
			let messageIx = payload.messageIx;
			if (
				messageIx === undefined &&
				payload.message &&
				payload.message.position !== undefined
			) {
				messageIx = playlist.messages.findIndex(
					(m: { position: any }) => m.position === payload.message.position,
				);
			}
			return playlist.messages[messageIx];
		},

		/*
		 * End of access helpers
		 *************************************************************************************************************/
		setSpec(payload: { programId: any; programspec: any }) {
			this.changed = false;

			this.programId = payload.programId;
			this.general = payload.programspec.general;
			this.general.name = payload.programspec.name;
			this.recipients = payload.programspec.recipients;
			this.languages = payload.programspec.languages;
			this.deployments = orderBy(
				payload.programspec.deployments,
				"deploymentnumber",
			);

			this.deployments.forEach((d: { playlists: any[] }) => {
				d.playlists.forEach(
					(
						p: {
							position: any;
							messages: { position: any; languages?: any }[];
						},
						ix: number,
					) => {
						p.position ??= ix + 1;
						p.messages.forEach(
							(m: { position: any; languages?: any }, ix: number) => {
								m.position ??= ix + 1;

								// Normalize languages to a unique, comma-separated string

								// here... when loading backend data or data from backend
								// we just convert 'arrays/objects/strings' into one format: like example "en,fr,de"
								// then using 'set' we can just remove duplicates
								if (Array.isArray(m.languages)) {
									const codes = m.languages.map((l: any) =>
										typeof l === "string" ? l : l.language_code,
									);
									m.languages = Array.from(new Set(codes)).join(",");
								} else if (typeof m.languages === "string") {
									const codes = m.languages
										.split(/[,;]/)
										.filter((l) => l !== "");
									m.languages = Array.from(new Set(codes)).join(",");
								}
							},
						);
					},
				);
			});

			this.loading = false;
			this.changed = false;
		},

		removeRegion(region: any) {
			const index = this.general.region.indexOf(region);
			if (index > -1) this.general.region.splice(index, 1);
		},

		//region toggleGoal
		addGoal(payload: any) {
			this.general.sustainable_development_goals.push(payload);
		},

		removeGoal(index: any) {
			this.general.sustainable_development_goals.splice(index, 1);
		},
		//endregion

		async getExportLink(payload: { programId: any; artifact: any }) {
			const { programId, artifact } = payload;
			if (this.status === "loading") return;
			try {
				return await getDownloadLink(programId, artifact);
			} catch (error) {
				// TODO: return an error message.
				return null;
			}
		},

		async uploadSpec(payload: { programId: any; fileData: any }) {
			const { programId, fileData } = payload;
			if (this.status === "loading") return;
			try {
				return await uploadSpecFile(programId, fileData);
			} catch (error) {
				return null;
			}
		},

		async approveSpec(payload: { programId: any; publish: any }) {
			const { programId, publish } = payload;
			if (this.status === "loading") return;
			this.resetState();

			try {
				return await approveSpecFile(programId, publish);
			} catch (error) {
				return null;
			}
		},

		async publishSpec() {
			try {
				console.log(`Calling publish(${this.programId}).`);
				await publish(this.programId);

				notification.success({
					message: "Program published successfully",
					description:
						"The program specification was successfully published to the ACM.",
				});

				return "success";
			} catch (error) {
				console.log(error);
			}
		},

		//endregion

		//region "General" (ie, Program) functions
		//=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
		toggleGoal(goal: any) {
			const index = this.general.sustainable_development_goals.indexOf(goal);

			if (index > -1) this.removeGoal(index);
			else this.addGoal(goal);

			this.setChanged(true);
		},

		async setDeploymentCount(payload: any) {
			await this.setDeploymentsCount(payload);
			this.setChanged(true);
		},

		async setFeedbackFrequency(payload: any) {
			await this.setFeedbackFrequently(payload);
			this.setChanged(true);
		},

		addDirectBeneficiariesAdditionalLabel() {
			const value = "New additional field";
			const key = `field_${Math.random().toString(36).substring(7)}`;

			this.setDirectBeneficiariesAdditionalLabel({ value, key });
			this.setChanged(true);
		},

		// Update the server with any new & updated content.
		async updateSpec() {
			const { programId, general, deployments, recipients } = this.$state;

			general.deployments_count = deployments.length;
			const newSpec = {
				general: general,
				deployments: deployments.map((depl) => {
					const dup: any = Object.assign({}, depl);

					// Renamed fields
					dup.startdate = depl.start_date;
					dup.enddate = depl.end_date;

					return dup;
				}),
				recipients: recipients.map((recip) => {
					// If this recipient has a temporary ID, set it to null so the server can supply a proper id.
					if (recip.id?.match(TEMP_RECIPIENT_RE)) {
						recip.id = null;
					}

					// Make a copy of recipients, because we may modify some of the ids.
					const newRecip: any = Object.assign({}, recip);

					// Renamed fields
					newRecip.recipientid = recip.id;
					newRecip.supportentity = recip.support_entity;
					newRecip.communityname = recip.community_name;
					newRecip.groupname = recip.group_name;
					return newRecip;
				}),
				languages: this.languages,
			};

			this.requestInit();

			this.loading = true;
			return ApiRequest.put(
				`program-spec/content?programid=${programId}`,
				newSpec,
			)
				.then(([resp]) => {
					this.setSpec({ programId, programspec: resp });
					notification.success({
						message: "Success",
						description: "Program specification updated successfully.",
					});
					return true;
				})
				.finally(() => {
					this.loading = false;
				})
				.catch((_) => {
					return false;
				});
		},

		setDeploymentsCount(payload: any) {
			this.general.deployments_count = payload;
		},

		setFeedbackFrequently(payload: any) {
			this.general.feedback_frequency = payload;
		},

		setLanguage(opts: { code: string; name?: string }) {
			const languages = new Set(this.languages.map((l) => l.code));
			if (languages.has(opts.code)) {
				return;
			}
			this.languages = [
				...this.languages,
				{
					code: opts.code,
					name:
						opts.name ??
						useLanguagesStore().languages.find((i) => i.code === opts.code)!
							.name,
				},
			];
		},

		deleteLanguage(language: string) {
			this.languages = this.languages.filter(
				(lang: any) => lang.code != language,
			);
		},

		setDirectBeneficiariesLabel(payload: { key: any; value: any }) {
			const { key, value } = payload;
			this.general.direct_beneficiaries_map[key] = value;
		},

		setDirectBeneficiariesAdditionalLabel(payload: {
			value: string;
			key: string;
		}) {
			const { key, value } = payload;
			const map = {
				...this.general.direct_beneficiaries_additional_map,
			};
			map[key] = value;

			this.general.direct_beneficiaries_additional_map = map;
		},

		deleteDirectBeneficiariesAdditionalLabel(labelKey: string) {
			const beneficiaries = {
				...this.general.direct_beneficiaries_additional_map,
			};
			const index = Object.keys(beneficiaries).findIndex(
				(key) => key === labelKey,
			);

			if (index >= 0) {
				delete beneficiaries[labelKey];
				this.general.direct_beneficiaries_additional_map = beneficiaries;
			}
		},

		//endregion

		//region Deployment mutations
		setDeployments(payload: { deployments: Deployment[] }) {
			let deployments = payload.deployments;
			// Ensure ascending deployment numbers.
			deployments.forEach((d, ix: number) => (d.deploymentnumber = ix + 1));
			this.deployments = deployments;
		},

		addDeployment() {
			// New deployment with next deployment #.
			const previous =
				this.deployments.length > 0
					? this.deployments[this.deployments.length - 1]
					: undefined;

			this.deployments = [
				...this.deployments,
				Deployment.create(
					this.deployments.length + 1,
					this.programId,
					previous,
				),
			];
		},

		removeDeployment(deployment: Deployment) {
			const index = this.deployments.findIndex(
				(d) => d.deploymentnumber === deployment.deploymentnumber,
			);

			if (index > -1) this.deployments.splice(index, 1);
		},

		//region Playlist mutations
		setPlaylists(payload: { deployment: Deployment; playlists: Playlist[] }) {
			const { playlists, deployment } = payload;
			// Ensure ascending positions.
			playlists.forEach((p, ix: number) => (p.position = ix + 1));
			deployment.playlists = playlists;
		},

		addPlaylist(payload: any) {
			const deployment = this.getDeployment(payload);
			// New playlist at next position.
			deployment.playlists.push(
				Playlist.create(deployment.playlists.length + 1, deployment),
			);
		},

		removePlaylist(payload: { playlist: Playlist; deployment: Deployment }) {
			const { playlist, deployment } = payload;

			// const deployment = this.getDeployment(payload);
			const playlistIx = deployment.playlists.findIndex(
				(pl: { position: any }) => pl.position === payload.playlist.position,
			);
			deployment.playlists.splice(playlistIx, 1);
		},

		//region Message mutations
		setMessages(payload: { messages: Message[]; playlist: Playlist }) {
			const { messages, playlist } = payload;
			// Ensure ascending positions.
			messages.forEach(
				(m: { position: any }, ix: number) => (m.position = ix + 1),
			);
			playlist.messages = messages;
		},

		addMessage(playlist: Playlist) {
			playlist.messages ??= [];
			playlist.messages.push(
				Message.create(playlist.messages.length + 1, playlist),
			);

			if (playlist.messages.length > 0) {
				playlist.audience ??=
					playlist.messages[playlist.messages.length - 1].audience;
			}
		},

		removeMessage(message: Message, playlist: Playlist) {
			const messageIx = (playlist.messages ?? []).findIndex(
				(msg) => msg._id === message._id,
			);

			playlist.messages.splice(messageIx, 1);
			this.$state.changed = true;
		},

		setMessageOrPlaylistTitle(title: string, item: Message | Playlist) {
			// Since the title is used as the file name, we need to remove any characters that are not allowed in file names.
			// See https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
			item.title = title.replace(/[^\d\w\s]/g, "");
			this.changed = true;
		},

		addMessageLanguage(payload: { language: string; message: Message }) {
			const { language, message } = payload;

			let languages: string[] = [];

			// lets convert whatever we have into an array
			if (Array.isArray(message.languages)) {
				languages = message.languages.map((l) =>
					typeof l === "string" ? l : l.language_code,
				);
			} else if (typeof message.languages === "string") {
				languages = message.languages.split(/[,;]/).filter((l) => l !== "");
			}

			// Add and deduplicate
			languages = Array.from(new Set([...languages, language]));
			message.languages = languages.join(",");
			this.changed = true;
		},

		getMessageLanguages(message: Message) {
			// const message = this.getMessage(payload);
			if (Array.isArray(message.languages)) {
				return message.languages.map((l) => l.language_code);
			}

			return (message?.languages || "").split(/[,;]/).filter((l) => l !== "");
		},

		removeMessageLanguage(language: string, message: Message) {
			let langs: string[] = [];

			if (Array.isArray(message.languages)) {
				langs = message.languages.map((l) => l.language_code);
			} else {
				langs = (message.languages || "").split(/[,;]/).filter((l) => l !== "");
			}

			const set = new Set(langs);
			set.delete(language);
			message.languages = Array.from(set).join(",");

			this.setChanged(true);
		},

		setMessageSDGGoal(payload: {
			deployment: Deployment;
			playlist: Playlist;
			message: Message;
			goal: any;
		}) {
			const { goal, message } = payload;
			message.sdg_goal_id = goal;
			message.sdg_goal = goal;

			this.setMessageSDGTarget({ ...payload, target: null });
		},

		setMessageSDGTarget(payload: {
			deployment: Deployment;
			playlist: Playlist;
			message: Message;
			target: number;
		}) {
			const { target, message } = payload;
			if (target === null || target === undefined) {
				message.sdg_target_id = null;
				message.sdg_target = null;
			} else {
				const goal = message.sdg_goal;
				message.sdg_target = `${goal}.${target}`;
				message.sdg_target_id = target;
			}
		},

		updateRecipient(payload: { recipient: Recipient }) {
			const { recipient } = payload;

			if (!recipient.id) {
				// Create a temporary id for local use prior ot the assignment of a proper id by the server.
				let tempId = 1;
				for (const recipient of this.recipients) {
					if (recipient.id != null && TEMP_RECIPIENT_RE.test(recipient.id)) {
						const match = recipient.id.match(TEMP_RECIPIENT_RE);
						const numericId = Number(match[1]);
						if (numericId >= tempId) {
							tempId = numericId + 1;
						}
					}
				}

				recipient.id = TEMP_RECIPIENT_PREFIX + tempId;
				this.setChanged(true);
			}

			let ix = this.recipients.findIndex((r) => recipient.id === r.id);
			if (ix >= 0) {
				Object.assign(this.recipients[ix], recipient);
			} else {
				this.recipients.push(recipient);
			}
		},

		//
		// Api Request
		//
		async downloadSpec(programId: string) {
			this.loading = true;
			return ApiRequest.get(`program-spec/content?programid=${programId}`);
		},
		async generateAccessCode() {
			this.loading = true;
			const res = await ApiRequest.get<{ code: string }>(
				`program-spec/generate-access-code?programid=${this.programId}`,
			);
			return res[0].code
			this.loading = false;
		},
	},
});
