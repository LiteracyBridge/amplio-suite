// import mutations from "./mutations";
// import actions from "./actions";
import { defineStore } from "pinia";
import { useUIStore } from "../ui";
import {
  getDownloadLink,
  getProgramSpec,
  publish,
  putProgramSpec,
  uploadSpec as uploadSpecFile,
  approveSpec as approveSpecFile
} from "@/api/programspec.api";
import { Language } from "@/models/language";
import { Recipient } from "@/models/recipient";
import { Deployment } from "@/models/deployment";
import { Program } from "@/models/program";
import { Playlist } from "@/models/playlist";
import { Message } from "@/models/message";

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
    youth: "Number of Youth"
  },
  direct_beneficiaries_additional_map: {},
  tableau_id: null as string | number | null
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
      descending: true
    }
  };
  return defaultState;
};

//region Deployment, Playlist, Message constructors

// function Playlist(position: any) {
//   const title = "";
//   const audience = "";
//   const messages: any[] = [];
//   return { position, title, audience, messages };
// }

// function Message(position: any) {
//   const title = "";
//   const format = "";
//   const default_category_code = "";
//   const variant = "";
//   const sdg_goal = "";
//   const sdg_target = "";
//   const key_points = "";
//   const languages = "";
//   const audience = "";
//   return {
//     position,
//     title,
//     format,
//     default_category_code,
//     variant,
//     sdg_goal,
//     sdg_target,
//     key_points,
//     languages,
//     audience
//   };
// }

export const useProgramSpecStore = defineStore("programspec", {
  state: () => getDefaultState(),

  getters: {
    labelUsed: state => {
      const labels = new Set();
      state.recipients.forEach(
        (recipient: { direct_beneficiaries_additional: {} }) => {
          const keys = Object.keys(recipient.direct_beneficiaries_additional);
          keys.forEach(label => labels.add(label));
        }
      );

      return Array.from(labels);
    },

    directBeneficiariesLabels: state => {
      const keys = Object.keys(state.general.direct_beneficiaries_map);
      return keys.map((key: any) => ({
        key,
        value: state.general.direct_beneficiaries_map[key]
      }));
    },
    directBeneficiariesAdditionalLabels: state => {
      const keys = Object.keys(
        state.general.direct_beneficiaries_additional_map
      );
      return keys.map(key => ({
        key,
        value: state.general.direct_beneficiaries_additional_map[key]
      }));
    },

    filteredRecipients: state => {
      let recipients = [...state.recipients];

      // Sort
      const column = state.sortTable.by;
      const direction = state.sortTable.descending ? 1 : -1;
      recipients = recipients.sort(
        (a, b) =>
          direction *
          (a as any)[column]
            .toString()
            .localeCompare((b as any)[column].toString())
      );

      // Filter
      let text = state.filterText;
      recipients = recipients.filter(reci =>
        Object.values(reci)
          .filter(val => val !== null)
          .some(val =>
            val
              .toString()
              .toLowerCase()
              .includes(text.toLowerCase())
          )
      );

      // return recipients.slice(0, this.recipientsToShow)
      return recipients;
    },

    newRecipient: () => {
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
        component: ""
      };
      return newRecipient;
    }
  },
  actions: {
    // Mutations

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
      this.status = "success";
      this.programId = payload.programId;
      this.general = payload.programspec.general;
      // this.general = Object.assign({}, this.general, payload.programspec.general)
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

    // toggleListeningModel(model: any) {
    //     // This is the program's listening models, not the global list of listening models.
    //     const index = this.general.listening_models.indexOf(model);

    //     if (index > -1) this.removeListeningModel(index);
    //     else this.addListeningModel(model);

    //     this.setChanged(true);
    // },

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

    // async setLanguages(payload) {
    //     await this.setLanguages(payload);
    //     this.setChanged(true);
    // },

    // async deleteLanguage(language: any) {
    //     await this.deleteLanguage(language);
    //     this.setChanged(true);
    // },

    // setDirectBeneficiariesLabel(payload: any) {
    //     this.setDirectBeneficiariesLabel(payload);
    //     this.setChanged(true);
    // },

    // setDirectBeneficiariesAdditionalLabel(payload: {
    //     value: string;
    //     key: string;
    // }) {
    //     this.setDirectBeneficiariesAdditionalLabel(payload);
    //     this.setChanged(true);
    // },

    addDirectBeneficiariesAdditionalLabel() {
      const value = "New additional field";
      const key = `field_${Math.random()
        .toString(36)
        .substring(7)}`;

      this.setDirectBeneficiariesAdditionalLabel({ value, key });
      this.setChanged(true);
    },

    // deleteDirectBeneficiariesAdditionalLabel(labelKey: any) {
    //     this.deleteDirectBeneficiariesAdditionalLabel(labelKey);
    //     this.setChanged(true);
    // },

    //endregion

    //region Deployment functions
    // //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    // async setDeployments(payload: any) {
    //     this.setDeployments(payload);
    //     this.setChanged(true);
    // },

    // Adds a deployment to the end of the list
    // async addDeployment(payload: any) {
    //     this.addDeployment(payload);
    //     this.setChanged(true);
    // },

    // async removeDeployment(payload: any) {
    //     this.removeDeployment(payload);
    //     this.setChanged(true);
    // },

    // async setDeploymentStartdate(payload: any) {
    //     this.setDeploymentStartdate(payload);
    //     this.setChanged(true);
    // },

    // async setDeploymentEnddate(payload: any) {
    //     this.setDeploymentEnddate(payload);
    //     this.setChanged(true);
    // },

    // async setDeploymentName(payload: any) {
    //     this.setDeploymentName(payload);
    //     this.setChanged(true);
    // },
    //endregion

    //region Playlist functions
    // Set the playlists for the given deployment.
    //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    // async setPlaylists(payload: any) {
    //     this.setPlaylists(payload);
    //     this.setChanged(true);
    // },

    // async addPlaylist(payload: any) {
    //     this.addPlaylist(payload);
    //     this.setChanged(true);
    // },

    // async removePlaylist(payload: any) {
    //     this.removePlaylist(payload);
    //     this.setChanged(true);
    // },

    // Edit playlists.
    // setPlaylistTitle(payload: any) {
    //     this.setPlaylistTitle(payload);
    //     this.setChanged(true);
    // },

    // setPlaylistAudience(payload: any) {
    //     this.setPlaylistAudience(payload);
    //     this.setChanged(true);
    // },
    //endregion

    //region Message functions
    //=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
    // setMessages(payload: any) {
    //     this.setMessages(payload);
    //     this.setChanged(true);
    // },

    // async addMessage(payload: any) {
    //     this.addMessage(payload);
    //     this.setChanged(true);
    // },

    // async removeMessage(payload: any) {
    //     this.removeMessage(payload);
    //     this.setChanged(true);
    // },

    // setMessageTitle(payload: any) {
    //     this.setMessageTitle(payload);
    //     this.setChanged(true);
    //     // Interesting bit of code below to find a list of duplicate titles.
    //     // const titles = state.playlists[playlistIndex].messages.map(message => message.title)
    //     // const duplicates = titles.filter((theSet => aString => theSet.has(aString) || !theSet.add(aString))(new Set))
    //     // this.setDuplicateMessages( duplicates)
    // },

    // addMessageLanguage(payload: any) {
    //     this.addMessageLanguage(payload);
    //     this.setChanged(true);
    // },

    // removeMessageLanguage(payload: any) {
    //     this.removeMessageLanguage(payload);
    //     this.setChanged(true);
    // },

    // setMessageCategory(payload: any) {
    //     this.setMessageCategory(payload);
    //     this.setChanged(true);
    // },

    // setMessageAudience(payload: any) {
    //     this.setMessageAudience(payload);
    //     this.setChanged(true);
    // },

    // setMessageVariant(payload: any) {
    //     this.setMessageVariant(payload);
    //     this.setChanged(true);
    // },

    // setMessageFormat(payload: any) {
    //     this.setMessageFormat(payload);
    //     this.setChanged(true);
    // },

    // setMessageSDGGoal(payload: any) {
    //     this.setMessageSDGGoal(payload);
    //     this.setMessageSDGTarget({ ...payload, target: null });
    //     this.setChanged(true);
    // },

    // setMessageSDGTarget(payload: any) {
    //     this.setMessageSDGTarget(payload);
    //     this.setChanged(true);
    // },

    // setMessageKeyPoints(payload: any) {
    //     this.setMessageKeyPoints(payload);
    //     this.setChanged(true);
    // },
    //endregion

    //region Recipient functions

    // updateRecipient(payload: { recipient: any }) {
    //     this.setChanged(true);
    //     this.updateRecipient({ recipient });
    // },

    // Actions
    // Fetch the content from the server. payload must have a member .programId.
    async fetchSpec(payload: { programId: any }) {
      const { programId } = payload;

      if (this.status === "loading") return;
      // Not loading: '', success, or error
      if (this.programId === programId && !this.changed) return;

      console.log(`Fetching spec for ${programId}`);
      this.requestInit();

      try {
        const programspec = await getProgramSpec(programId);
        await this.setSpec({ programId, programspec });
        console.log(
          `Done fetching spec for ${programId} status is ${this.status}`
        );
      } catch (error) {
        this.requestError();
        useUIStore().setNotification({
          type: "alert",
          text: error.toString()
        });
      }
    },

    async ensureSpec(payload: { programId: any }) {
      const { programId } = payload;
      if (this.status === "loading") return; // may be wrong program?
      if (this.programId === programId) return;

      console.log(`Ensure spec fetching for ${programId}`);
      this.requestInit();

      try {
        const programspec = await getProgramSpec(programId);
        await this.setSpec({ programId, programspec });
        console.log(
          `Done fetching spec for ${programId} status is ${this.status}`
        );
      } catch (error) {
        this.requestError();
        useUIStore().setNotification({
          type: "alert",
          text: error.toString()
        });
      }
    },

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
        })
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
          text: error.toString()
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
        ...this.general.direct_beneficiaries_additional_map
      };
      map[key] = value;

      this.general.direct_beneficiaries_additional_map = map;
    },

    deleteDirectBeneficiariesAdditionalLabel(labelKey: string) {
      const beneficiaries = {
        ...this.general.direct_beneficiaries_additional_map
      };
      const index = Object.keys(beneficiaries).findIndex(
        key => key === labelKey
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

    removeMessage(payload: { message: { position: any } }) {
      const playlist = this.getPlaylist(payload);
      const messageIx = playlist.messages.findIndex(
        (msg: { position: any }) => msg.position === payload.message.position
      );
      playlist.messages.splice(messageIx, 1);
    },

    setMessageTitle(payload: { title: any }) {
      const message = this.getMessage(payload);
      const { title } = payload;
      message.title = title;
    },

    addMessageLanguage(payload: {
      language: string;
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
    }) {
      // console.log("here");
      // 'languages' is a list of comma-separated language names or codes.
      const message = this.getMessage(payload);
      const { language } = payload;

      // let languageCode
      // if (typeof language === "string" || language instanceof String) {
      //   languageCode = language;
      // } else {
      //   languageCode = language.code;
      // }
      let languages = message.languages;
      const list = languages.split(/[,;]/);
      if (list.indexOf(language) === -1) list.push(language);
      languages = list.join(",");
      message.languages = languages;
    },

    removeMessageLanguage(payload: {
      language: string;
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
    }) {
      // 'languages' is a list of comma-separated language names or codes.
      const message = this.getMessage(payload);
      const { language } = payload;
      let languageCode;
      if (typeof language === "string") {
        languageCode = language;
      } else {
        languageCode = language;
      }
      let languages = message.languages;
      let list = languages.split(/[,;]/);
      const ix = list.indexOf(languageCode);
      if (ix >= 0) list.splice(ix, 1);
      languages = list.join(",");
      message.languages = languages;
    },

    setMessageCategory(payload: {
      deployment: Deployment;
      playlist: Playlist;
      message: Message;
      code: string;
    }) {
      const message = this.getMessage(payload);
      message.default_category_code = payload.code;
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
        this.recipients.forEach(recipient => {
          let match = recipient.recipientid.match(TEMP_RECIPIENT_RE);
          if (match) {
            let numericId = Number(match[1]);
            if (numericId >= tempId) {
              tempId = numericId + 1;
            }
          }
        });
        recipient.recipientid = TEMP_RECIPIENT_PREFIX + tempId;
      }

      let ix = this.recipients.findIndex(
        (r: { recipientid: any }) => recipient.recipientid === r.recipientid
      );
      if (ix >= 0) {
        Object.assign(this.recipients[ix], recipient);
      } else {
        this.recipients.push(recipient);
      }
    }

    //endregion
  }
});
