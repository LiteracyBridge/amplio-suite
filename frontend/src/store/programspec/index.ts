// import mutations from "./mutations";
// import actions from "./actions";
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

//region Deployment, Playlist, Message constructors

export const useProgramSpecStore = defineStore("programspec", {
  state: () => ({
    loading: false,
    deployments: [] as Deployment[],
    recipients: [] as Recipient[],
    general: new Program(),
    programId: "",

    changed: false,
    status: "",
    filterText: "",
    sortTable: {
      by: "region",
      descending: true,
    },
  }),
  getters: {
    canPublish: (state) => {
      const hasOneMessage = (state.deployments || []).some((depl) =>
        depl.playlists.some((pl: any) => pl.messages.length > 0)
      );
      const hasOneRecipient = (state.recipients || []).length > 0;
      return hasOneMessage && hasOneRecipient && !state.changed;
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
  },
  actions: {
    filteredRecipients() {
      let recipients = [...this.recipients];

      // Sort
      const column = this.sortTable.by;
      const direction = this.sortTable.descending ? 1 : -1;
      recipients = recipients.sort(
        (a, b) =>
          direction *
          (a as any)[column]
            .toString()
            .localeCompare((b as any)[column].toString())
      );

      // Filter
      let text = this.filterText;
      recipients = recipients.filter((reci) =>
        Object.values(reci)
          .filter((val) => val !== null)
          .some((val) =>
            val.toString().toLowerCase().includes(text.toLowerCase())
          )
      );

      // return recipients.slice(0, this.recipientsToShow)
      return recipients;
    },
    directBeneficiariesLabels() {
      console.log(this.general);
      const keys = Object.keys(this.general.direct_beneficiaries_map);
      return keys.map((key: any) => ({
        key,
        value: this.general.direct_beneficiaries_map[key],
      }));
    },
    directBeneficiariesAdditionalLabels() {
      const keys = Object.keys(
        this.general.direct_beneficiaries_additional_map
      );
      return keys.map((key) => ({
        key,
        value: this.general.direct_beneficiaries_additional_map[key],
      }));
    },

    newRecipient() {
      let newRecipient: any = {
        recipientid: null,

        communityname: "",
        groupname: "",
        region: "",
        district: "",
        numtbs: null,
        supportentity: "",
        language: "",
        agent: "",
        numhouseholds: 0,
        group_size: 0,
        deployments: [],
        listening_model: "",
        agent_gender: "",
        direct_beneficiaries: null,
        direct_beneficiaries_additional: {},
        indirect_beneficiaries: null,
        variant: "",
        component: "",
      };
      return newRecipient;
    },

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
            d.deploymentnumber === payload.deploymentnumber
        );
      }
      if (
        deploymentIx === undefined &&
        payload.deployment &&
        payload.deployment.deploymentnumber !== undefined
      ) {
        deploymentIx = this.deployments.findIndex(
          (d: { deploymentnumber: any }) =>
            d.deploymentnumber === payload.deployment.deploymentnumber
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
          (p: { position: any }) => p.position === payload.playlist.position
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
          (m: { position: any }) => m.position === payload.message.position
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
      this.recipients = payload.programspec.recipients;
      this.deployments = payload.programspec.deployments;

      this.deployments.forEach((d: { playlists: any[] }) => {
        d.playlists.forEach(
          (p: { position: any; messages: any[] }, ix: number) => {
            p.position = ix + 1;
            p.messages.forEach((m: { position: any }, ix: number) => {
              m.position = ix + 1;
            });
          }
        );
      });

      this.loading = false;
    },

    //region General mutations
    //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    setProgramName(payload: any) {
      this.general.name = payload;
    },

    // setCountry(payload: any) {
    //     this.general.country = payload;
    // },

    // addRegion(region: any) {
    //     this.general.region = [...this.general.region, region];
    // },

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

      // FIXME: cannot find vuex state
      // commit("recipients/resetState", null, { root: true });
      // commit("programData/resetState", null, { root: true });
      // commit("program/resetState", null, { root: true });

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

    async setDeploymentLength(payload: any) {
      await this.setDeploymentsLength(payload);
      this.setChanged(true);
    },

    async setDeploymentsFirstDate(payload: any) {
      this.setDeploymentsFirst(payload);
      // await commit('setDeploymentsFirst', payload)
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

    // Actions
    // Fetch the content from the server. payload must have a member .programId.
    /**
     * @deprecated use downloadSpec instead
     *
     * @param   {any}  payload  [payload description]
     *
     * @return  {[type]}        [return description]
     */
    // async fetchSpec(payload: { programId: any }) {
    //   const { programId } = payload;

    //   if (this.status === "loading") return;
    //   // Not loading: '', success, or error
    //   if (this.programId === programId && !this.changed) return;

    //   console.log(`Fetching spec for ${programId}`);
    //   this.requestInit();

    //   try {
    //     const programspec = await getProgramSpec(programId);
    //     await this.setSpec({ programId, programspec });
    //     console.log(
    //       `Done fetching spec for ${programId} status is ${this.status}`
    //     );
    //   } catch (error) {
    //     this.requestError();
    //     useUIStore().setNotification({
    //       type: "alert",
    //       text: error.toString(),
    //     });
    //   }
    // },

    // async ensureSpec(payload: { programId: any }) {
    //   const { programId } = payload;
    //   if (this.status === "loading") return; // may be wrong program?
    //   if (this.programId === programId) return;

    //   console.log(`Ensure spec fetching for ${programId}`);
    //   this.requestInit();

    //   try {
    //     const programspec = await getProgramSpec(programId);
    //     await this.setSpec({ programId, programspec });
    //     console.log(
    //       `Done fetching spec for ${programId} status is ${this.status}`
    //     );
    //   } catch (error) {
    //     this.requestError();
    //     useUIStore().setNotification({
    //       type: "alert",
    //       text: error.toString(),
    //     });
    //   }
    // },

    // Update the server with any new & updated content.
    async updateSpec() {
      const { programId, general, deployments, recipients } = this.$state;
      // Make a copy of recipients, because we may modify some of the recipientids.
      const newSpec = {
        general: general,
        deployments: deployments,
        recipients: recipients.map((recip: any) => {
          let newRecip = Object.assign({}, recip);
          // If this recipient has a temporary ID, set it to null so the server can supply a proper id.
          if (newRecip.recipientid.match(TEMP_RECIPIENT_RE))
            newRecip.recipientid = null;
          return newRecip;
        }),
      };

      this.requestInit();

      try {
        console.log(`Updating spec for ${programId}`);
        const updateResult = await putProgramSpec(programId, newSpec);
        const programspec = updateResult && updateResult.updated;
        this.setSpec({ programId, programspec });
        console.log(
          `Done updating spec for ${programId} status is ${this.status}`
        );
        // commit('setChanged', false)
        // commit('requestSuccess')
      } catch (error) {
        this.requestError();
        useUIStore().setNotification({
          type: "alert",
          text: error.toString(),
        });
      }
    },

    //region toggleListening
    // addListeningModel(payload: any) {
    //     this.general.listening_models.push(payload);
    // },

    // removeListeningModel(index: any) {
    //     this.general.listening_models.splice(index, 1);
    // },
    //endregion

    setDeploymentsCount(payload: any) {
      this.general.deployments_count = payload;
    },

    setDeploymentsLength(payload: any) {
      this.general.deployments_length = payload;
    },

    setDeploymentsFirst(payload: any) {
      this.general.deployments_first = payload;
    },

    setFeedbackFrequently(payload: any) {
      this.general.feedback_frequency = payload;
    },

    setLanguages(payload: { lang: any; index: any }) {
      const languages = [...this.general.languages];
      languages[payload.index] = payload.lang;
      this.general.languages = languages;
    },

    deleteLanguage(language: any) {
      // noinspection EqualityComparisonWithCoercionJS
      this.general.languages = this.general.languages.filter(
        (lang: any) => lang != language
      );
    },

    setDirectBeneficiariesLabel(payload: { key: any; value: any }) {
      const { key, value } = payload;
      this.general.direct_beneficiaries_map[key] = value;
    },

    setDirectBeneficiariesAdditionalLabel(payload: { value: any; key: any }) {
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
        (key) => key === labelKey
      );

      if (index >= 0) {
        delete beneficiaries[labelKey];
        this.general.direct_beneficiaries_additional_map = beneficiaries;
      }
    },

    //endregion

    //region Deployment mutations
    setDeployments(payload: { deployments: any }) {
      let deployments = payload.deployments;
      // Ensure ascending deployment numbers.
      deployments.forEach(
        (d: { deploymentnumber: any }, ix: number) =>
          (d.deploymentnumber = ix + 1)
      );
      this.deployments = deployments;
    },

    addDeployment() {
      // New deployment with next deployment #.
      const previous =
        this.deployments.length > 0
          ? this.deployments[this.deployments.length - 1]
          : undefined;
      this.deployments.push(
        Deployment.create(this.deployments.length + 1, this.programId, previous)
      );
    },

    removeDeployment(payload: {
      deploymentIx: any;
      deploymentnumber: any;
      deployment: { deploymentnumber: any };
    }) {
      let deploymentIx = payload.deploymentIx;
      if (
        deploymentIx === undefined &&
        payload.deploymentnumber !== undefined
      ) {
        deploymentIx = this.deployments.findIndex(
          (d: { deploymentnumber: any }) =>
            d.deploymentnumber === payload.deploymentnumber
        );
      }
      if (
        deploymentIx === undefined &&
        payload.deployment &&
        payload.deployment.deploymentnumber !== undefined
      ) {
        deploymentIx = this.deployments.findIndex(
          (d: { deploymentnumber: any }) =>
            d.deploymentnumber === payload.deployment.deploymentnumber
        );
      }
      console.log(this.deployments);
      this.deployments.splice(deploymentIx, 1);
      console.log(this.deployments);
    },

    setDeploymentStartdate(payload: any) {
      const deployment = this.getDeployment(payload);
      deployment.startdate = payload.startdate;
    },

    setDeploymentEnddate(payload: { enddate: any }) {
      const deployment = this.getDeployment(payload);
      deployment.enddate = payload.enddate;
    },

    setDeploymentName(payload: { deploymentname: any }) {
      const deployment = this.getDeployment(payload);
      deployment.deploymentname = payload.deploymentname;
    },
    //endregion

    //region Playlist mutations
    setPlaylists(payload: { playlists: any }) {
      const deployment = this.getDeployment(payload);
      const { playlists } = payload;
      // Ensure ascending positions.
      playlists.forEach(
        (p: { position: any }, ix: number) => (p.position = ix + 1)
      );
      deployment.playlists = playlists;
    },

    addPlaylist(payload: any) {
      const deployment = this.getDeployment(payload);
      // New playlist at next position.
      deployment.playlists.push(
        Playlist.create(deployment.playlists.length + 1)
      );
    },

    removePlaylist(payload: { playlist: { position: any } }) {
      const deployment = this.getDeployment(payload);
      const playlistIx = deployment.playlists.findIndex(
        (pl: { position: any }) => pl.position === payload.playlist.position
      );
      deployment.playlists.splice(playlistIx, 1);
    },

    // , setDuplicatePlaylists(payload) {
    //   state.duplicatePlaylists = payload
    // }

    setPlaylistTitle(payload: { title: any }) {
      const playlist = this.getPlaylist(payload);
      const { title } = payload;
      playlist.title = title;
    },

    setPlaylistAudience(payload: { audience: any }) {
      const playlist = this.getPlaylist(payload);
      const { audience } = payload;
      playlist.audience = audience;
    },
    //endregion

    //region Message mutations
    setMessages(payload: { messages: any }) {
      const playlist = this.getPlaylist(payload);
      const { messages } = payload;
      // Ensure ascending positions.
      messages.forEach(
        (m: { position: any }, ix: number) => (m.position = ix + 1)
      );
      playlist.messages = messages;
    },

    addMessage(payload: any) {
      const playlist = this.getPlaylist(payload);
      const message = Message.create(playlist.messages.length + 1);
      if (playlist.messages.length > 0) {
        playlist.audience =
          playlist.messages[playlist.messages.length - 1].audience;
      }

      if (playlist.messages == null) {
        playlist.messages = [];
      }
      playlist.messages.push(message);
    },

    // , setDuplicateMessage(payload) {
    //   state.duplicateMessage = payload
    // }

    removeMessage(payload: {
      message: Message;
      playlist: Playlist;
      deployment: Deployment;
    }) {
      const playlist = this.getPlaylist(payload);

      const messageIx = (payload.playlist.messages ?? []).findIndex(
        (msg) => msg.title === payload.message.title
      );

      payload.playlist.messages.splice(messageIx, 1);
      this.$state.changed = true;
    },

    setMessageTitle(payload: {
      title: string;
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
    }) {
      const message = this.getMessage(payload);
      const { title } = payload;

      // Since the title is used as the file name, we need to remove any characters that are not allowed in file names.
      // See https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
      message.title = title.replace(/[\\\/:\*\?"<>\|]/g, "");
      this.changed = true;
    },

    addMessageLanguage(payload: {
      language: string;
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
    }) {
      console.log("addMessageLanguage");
      console.log(payload);

      // console.log("here");
      // 'languages' is a list of comma-separated language names or codes.
      // const message = this.getMessage(payload);
      const { language, message } = payload;

      // console.log("found message");
      // console.log(message);
      // if (message == null) {
      //   return;
      // }
      // let languageCode
      // if (typeof language === "string" || language instanceof String) {
      //   languageCode = language;
      // } else {
      //   languageCode = language.code;
      // }
      let languages = message.languages;
      const list = languages == null ? [] : languages.split(/[,;]/);
      if (list.indexOf(language) === -1) list.push(language);
      languages = list.join(",");
      message.languages = languages;
      this.changed = true;
    },

    getMessageLanguages(payload: {
      // language: string;
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
    }) {
      // const message = this.getMessage(payload);
      return (payload.message?.languages || "").split(/[,;]/);
    },

    removeMessageLanguage(payload: {
      language: string;
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
    }) {
      console.log(payload.language);
      // 'languages' is a list of comma-separated language names or codes.
      // const message = this.getMessage(payload);
      const { language, message } = payload;
      let languageCode;
      if (typeof language === "string") {
        languageCode = language;
      } else {
        languageCode = language;
      }
      let languages = message.languages;
      let list = languages == null ? [] : languages.split(/[,;]/);
      const ix = list.indexOf(languageCode);
      if (ix >= 0) list.splice(ix, 1);
      languages = list.join(",");
      message.languages = languages;
      this.setChanged(true);
    },

    setMessageCategory(payload: {
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
      code: string;
    }) {
      const message = this.getMessage(payload);
      message.default_category_code = payload.code;
      this.setChanged(true);
    },

    setMessageAudience(payload: {
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
      audience: any;
    }) {
      const message = this.getMessage(payload);
      const { audience } = payload;
      message.audience = audience;
    },

    setMessageVariant(payload: {
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
      variant: any;
    }) {
      const message = this.getMessage(payload);
      const { variant } = payload;
      message.variant = variant;
    },

    setMessageFormat(payload: {
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
      format: any;
    }) {
      const message = this.getMessage(payload);
      const { format } = payload;
      message.format = format;
    },

    setMessageSDGGoal(payload: {
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
      goal: any;
    }) {
      const message = this.getMessage(payload);
      const { goal } = payload;
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
      const message = this.getMessage(payload);
      const { target } = payload;
      if (target === null || target === undefined) {
        message.sdg_target_id = null;
        message.sdg_target = null;
      } else {
        const goal = message.sdg_goal;
        message.sdg_target = `${goal}.${target}`;
        message.sdg_target_id = target;
      }
    },

    setMessageKeyPoints(payload: {
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
      text: string;
    }) {
      const message = this.getMessage(payload);
      const { text } = payload;
      message.key_points = text;
    },
    //endregion

    //region Recipient mutations

    updateRecipient(payload: { recipient: any }) {
      let { recipient } = payload;
      if (!recipient.recipientid) {
        // Create a temporary recipientid for local use prior ot the assignment of a proper recipientid by the server.
        let tempId = 1;
        this.recipients.forEach((recipient) => {
          let match = recipient.recipientid.match(TEMP_RECIPIENT_RE);
          if (match) {
            let numericId = Number(match[1]);
            if (numericId >= tempId) {
              tempId = numericId + 1;
            }
          }
        });
        recipient.recipientid = TEMP_RECIPIENT_PREFIX + tempId;
        this.setChanged(true);
      }

      let ix = this.recipients.findIndex(
        (r: { recipientid: any }) => recipient.recipientid === r.recipientid
      );
      if (ix >= 0) {
        Object.assign(this.recipients[ix], recipient);
      } else {
        this.recipients.push(recipient);
      }
    },

    //endregion

    //
    // Api Request
    //
    async downloadSpec(programId: string) {
      this.loading = true;
      return ApiRequest.get(`program-spec/content?programid=${programId}`);
    },
  },
});
