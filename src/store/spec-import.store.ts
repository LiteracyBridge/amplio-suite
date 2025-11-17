import { defineStore } from "pinia";
import type { Language } from "@/models/language";
import type { Recipient } from "@/models/recipient";
import type { Deployment } from "@/models/deployment";
import { Playlist } from "@/models/playlist";
import type { Message } from "@/models/message";
import { notification } from "ant-design-vue";
import { groupBy, orderBy } from "lodash";
import readXlsxFile from "read-excel-file";
import { useProgramSpecStore } from "./programspec";
import { DateTime } from "luxon";

function formatParsingError(
	opts: {
		error: string;
		row: number;
		column: string;
		value?: any;
	},
	sheet: string,
) {
	return `${opts.error} at row ${opts.row}, column ${opts.column} with value '${opts.value}' in '${sheet}' sheet`;
}

export const useProgramSpecImport = defineStore("specImport", {
	state: () => ({}),
	actions: {
		async readfile(file: any) {
			// console.log(req.file);
			// console.log(req.files);

			// readSheetNames(file.buffer).then((sheetNames) => {
			//   // sheetNames === ['Sheet1', 'Sheet2']
			// })

			try {
				const {
					rows: [general],
					errors: errors1,
				} = await readXlsxFile(file, {
					schema: GENERAL_SCHEMA,
					sheet: "General",
				});
				if (errors1.length > 0) {
					throw new Error(formatParsingError(errors1[0], "General"));
				}

				const { rows: deployments, errors: errors2 } = await readXlsxFile(
					file,
					{ schema: DEPLOYMENTS_SCHEMA, sheet: "Deployments" },
				);
				if (errors2.length > 0) {
					throw new Error(formatParsingError(errors2[0], "Deployments"));
				}

				const { rows: contents, errors: err3 } = await readXlsxFile(file, {
					schema: CONTENT_SCHEMA,
					sheet: "Content",
				});
				if (err3.length > 0) {
					throw new Error(formatParsingError(err3[0], "Content"));
				}

				const { rows: recipients, errors: err4 } = await readXlsxFile(file, {
					schema: RECIPIENT_SCHEMA,
					sheet: "Recipients",
				});
				if (err4.length > 0) {
					throw new Error(formatParsingError(err4[0], "Recipients"));
				}

				const { rows: languages, errors: err5 } = await readXlsxFile(file, {
					schema: LANGUAGE_SCHEMA,
					sheet: "Languages",
				});
				if (err5.length > 0) {
					throw new Error(formatParsingError(err5[0], "Languages"));
				}

				// Save to db
				// const project = await this.findByCode(code);
				const spec = useProgramSpecStore();

				// await this.dataSource.manager.transaction(
				// 	"READ UNCOMMITTED",
				// 	async (manager) => {
				const program = spec.general;

				// Save languages
				spec.languages = languages as unknown as Language[];

				// Save program info
				spec.general.languages = spec.languages.map((l) => l.code);

				// Save deployments
				// restructure contents into {deployment_number: [contents]}
				const mappedContents = groupBy(contents, "deployment_number");

				const playlistPositions: Record<string, number> = {}; // title: index
				for (const key in mappedContents) {
					const _deploymentContents = mappedContents[key]
					let position = 0;

					for (let i = 0; i < _deploymentContents.length; i++) {
						const key = `${_deploymentContents[i].playlist_title}-${_deploymentContents[i].deployment_number}`
						if (playlistPositions[key] == null) {
							position += 1
							playlistPositions[key] = position;
						}
					}
				}

				spec.deployments = deployments.map((d: any) => {
					d.program_id = spec.general.program_id;

					const playlists: Playlist[] = [];
					const mappedPlaylists = groupBy(
						mappedContents[d.deploymentnumber as string],
						(p) => p.playlist_title,
					);

					for (const title in mappedPlaylists) {
						const playlist = new Playlist();
						playlist.title = title;
						playlist.position = playlistPositions[`${title}-${d.deploymentnumber}`];
						// @ts-ignore
						playlist.deployment_number = d.deploymentnumber as number;

						playlist.messages = mappedPlaylists[title].map((m, index) => {
							if (m.sdg_goals != null) {
								m.sdg_goal_id = (m.sdg_goals as string).split(
									",",
								)[0] as unknown as number; // pick the first goal if multiple
							}

							m.default_category_code = m.default_category as string;
							m.title = m.message_title as string;
							m.position = index + 1;
							m.sdg_target_id = m.sdg_targets as string;
							m.program_id = program.program_id;
							m.languages = (m.languages as string[]).join(",");

							playlist.audience = m.audience as string;

							return m;
						}) as unknown as Message[];

						playlists.push(playlist);
					}

					d.playlists = playlists;
					return d;
				}) as unknown as Deployment[];

				// Save recipients
				const specLanguages: Record<string, string> = {}; // {code: code, name: code}
				for (const row of languages) {
					// @ts-ignore
					specLanguages[row.code] = row.code;
					// @ts-ignore
					specLanguages[row.name] = row.code;
				}

				spec.recipients = recipients.map((row: any, index: number) => {
					row.program_id = program.program_id;
					row.groupname ??= row.group_name;
					row.numhouseholds ??= 0;
					row.support_entity ??= "";
					row.numtbs ??= 0;
					row.group_size ??= 0;
					row.direct_beneficiaries_additional ??= {};

					if (row.recipient_id == null || row.recipient_id === "") {
						delete row.recipient_id;
					}

					if (specLanguages[row.language as string] == null) {
						throw new Error(
							`Language code '${row.language}' of recipient on row '${index + 1}' not found in the 'Languages' sheet`,
						);
					}

					row.language = specLanguages[row.language as string];
					return row;
				}) as unknown as Recipient[];

				return await spec.updateSpec();
			} catch (error) {
				console.error(error);
				notification.error({
					description: error.message,
					message: "Import error",
				});
				return false;
			}
		},
	},
});

const errorMessageSuffix = "Please correct all errors and re-upload the sheet";
const parseJson = (value: string, error: string) => {
	try {
		return JSON.parse(value.replace(/'/g, '"'));
	} catch (err) {
		throw new Error(`${error}. ${errorMessageSuffix}`);
	}
};

const LANGUAGE_SCHEMA = {
	name: { prop: "name", type: String, required: true },
	code: { prop: "code", type: String, required: true },
};

const RECIPIENT_SCHEMA = {
	Country: { prop: "country", type: String, required: true },
	Region: { prop: "region", type: String, required: true },
	District: { prop: "district", type: String, required: true },
	Community: { prop: "community_name", type: String, required: false },
	Agent: { prop: "agent", type: String, required: false },
	"Language Code": { prop: "language", type: String, required: true },
	"Group Name": { prop: "group_name", type: String, required: false },
	"Group Size": { prop: "group_size", type: Number, required: false },
	"# HH": { prop: "numhouseholds", type: Number, required: false },
	"# TBs": { prop: "numtbs", type: Number, required: false },
	"Direct Beneficiaries": {
		prop: "direct_beneficiaries",
		type: Number,
		required: false,
	},
	"Indirect Beneficiaries": {
		prop: "indirect_beneficiaries",
		type: Number,
		required: false,
	},
	Variant: { prop: "variant", type: String, required: false },
	"Support Entity": { prop: "support_entity", type: String, required: false },
	"Agent Gender": { prop: "agent_gender", type: String, required: false },
	"Listening Model": { prop: "listening_model", type: String, required: false },
	"Direct Beneficiaries Additional": {
		prop: "direct_beneficiaries_additional",
		required: false,
		type: (value: any) =>
			parseJson(
				value,
				"The format of 'Direct Beneficiaries Additional' column in 'Recipients' workbook is wrong",
			),
	},
	Affiliate: { prop: "affiliate", type: String, required: false },
	Partner: { prop: "partner", type: String, required: false },
	Components: { prop: "component", type: String, required: false },
	RecipientID: { prop: "recipient_id", type: String, required: false },
	Deployments: {
		prop: "deployments",
		type: (value: any) => {
			if (Number.isInteger(value)) {
				return [+value];
			}
			return parseJson(
				value,
				"The format of 'Deployment' column in 'Recipient' workbook is wrong",
			);
		},
		required: false,
	},
};

const CONTENT_SCHEMA = {
	"Deployment #": { prop: "deployment_number", type: Number, required: true },
	"Playlist Title": { prop: "playlist_title", type: String, required: true },
	"Message Title": { prop: "message_title", type: String, required: true },
	"Key Points": { prop: "key_points", type: String, required: false },
	"Language Code": {
		required: true,
		prop: "languages",
		type: (value: any) => {
			try {
				return parseJson(
					value,
					`The format of '${value}' in 'Language Code' column of 'Content' workbook is wrong`,
				); // value in brackets; eg. ["eng", "fr"]
			} catch (error) {
				try {
					return value.split(",").map((v: string) => v.trim()); // raw strings; eg. en, fr
				} catch {
					throw new Error(`${error}. ${errorMessageSuffix}`);
				}
			}
		},
	},
	Variant: { prop: "variant", type: String, required: false },
	Format: { prop: "format", type: String, required: false },
	Audience: { prop: "audience", type: String, required: false },
	"Default Category": {
		prop: "default_category",
		type: String,
		required: false,
	},
	"SDG Goals": { prop: "sdg_goals", type: String, required: false },
	"SDG Targets": { prop: "sdg_targets", type: String, required: false },
};

const DEPLOYMENTS_SCHEMA = {
	"Deployment #": { prop: "deploymentnumber", type: Number, required: true },
	"Start Date": {
		prop: "start_date",
		type: (value: any) => {
			try {
				if (value == null || value == '') {
					throw new Error(`Start date cannot be empty`)
				}
				if (typeof value === "object") {
					// JS date of object, don't touch it
					return value;
				}
				else if (typeof value === "string") {
					// Raw date string, verify
					const date = DateTime.fromISO(value);
					if (!date.isValid) {
						throw new Error(`Start Date '${value}' is invalid. Make sure it follows the format: Year-Month-Day`)
					}
					return new Date(value);
				}
				throw new Error(`Start Date '${value}' is invalid. Make sure it follows the format: Year-Month-Day`)
			} catch (error) {
				throw new Error(`${error}. ${errorMessageSuffix}`);
			}
		},
		required: true
	}, // fixme: validate these dates
	"End Date": {
		prop: "end_date",
		type: (value: any) => {
			try {
				console.log(value)
				if (value == null || value == '') {
					throw new Error(`End date cannot be empty`)
				}
				if (typeof value === "object") {
					// JS date of object, don't touch it
					return value;
				}
				else if (typeof value === "string") {
					// Raw date string, verify
					const date = DateTime.fromISO(value);
					if (!date.isValid) {
						throw new Error(`End Date '${value}' is invalid. Make sure it follows the format: Year-Month-Day`)
					}
					return new Date(value);
				}
				throw new Error(`End Date '${value}' is invalid. Make sure it follows the format: Year-Month-Day`)
			} catch (error) {
				throw new Error(`${error}. ${errorMessageSuffix}`);
			}
		},
		required: true
	},
	"Deployment Name": { prop: "deploymentname", type: String, required: true },
};

const GENERAL_SCHEMA = {
	"Program ID": { prop: "program_id", type: String, required: true },
	Country: { prop: "country", type: String, required: true },
	Affiliate: { prop: "affiliate", type: String, required: false },
	Partner: { prop: "partner", type: String, required: false },
	Regions: {
		prop: "region",
		type: (value: string) =>
			parseJson(
				value,
				"The format of 'Regions' column in 'General' workbook is wrong",
			),
		required: true,
	},
	// "Languages": {
	//   prop: 'languages',
	//   type: (value) => parseJson(value, "The format of 'Languages' column in 'General' workbook is wrong"),
	//   required: true
	// },
	"Deployments Count": {
		prop: "deployments_count",
		type: Number,
		required: true,
	},
	"Deployments Length": {
		prop: "deployments_length",
		type: String,
		required: true,
	},
	"Deployments First": {
		prop: "deployments_first",
		type: (value: any) => {
			try {
				console.log(value)
				if (value == null || value == '') {
					throw new Error(`'Deployment First cannot be empty`)
				}
				if (typeof value === "object") {
					// JS date of object, don't touch it
					return value;
				}
				else if (typeof value === "string") {
					// Raw date string, verify
					const date = DateTime.fromISO(value);
					if (!date.isValid) {
						throw new Error(`Deployment First '${value}' is invalid. Make sure it follows the format: Year-Month-Day`)
					}
					return new Date(value);
				}
				throw new Error(`Deployment First '${value}' is invalid. Make sure it follows the format: Year-Month-Day`)
			} catch (error) {
				throw new Error(`${error}. ${errorMessageSuffix}`);
			}
		},
		required: true,
	},
	"Feedback Frequency": {
		prop: "feedback_frequency",
		type: String,
		required: false,
	},
	"Listening Models": {
		prop: "listening_models",
		type: (value: any) =>
			parseJson(
				value,
				"The format of 'Listening Models' column in 'General' workbook is wrong",
			),
		required: false,
	},
	"Sustainable Development Goals": {
		prop: "sustainable_development_goals",
		type: (value: any) =>
			parseJson(
				value,
				"The format of 'Sustainable Development Goals' column in 'General' workbook is wrong",
			),
	},
	"Direct Beneficiaries Map": {
		prop: "direct_beneficiaries_map",
		required: false,
		type: (value: any) =>
			parseJson(
				value,
				"The format of 'Direct Beneficiaries Map' column in 'General' workbook is wrong",
			),
	},
	"Direct Beneficiaries Additional Map": {
		prop: "direct_beneficiaries_additional_map",
		required: false,
		type: (value: any) =>
			parseJson(
				value,
				"The format of 'Direct Beneficiaries Additional Map' column in 'General' workbook is wrong",
			),
	},
};
