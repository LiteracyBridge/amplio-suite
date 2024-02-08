import { defineStore } from "pinia";
import { getUfCounts, questionnaireUpload } from "@/api/uf.api";

export const useUserFeedbackStore = defineStore("uf", {
  state: () => ({
    status: "",
    programId: "",
    counts: {}
  }),

  actions: {
    getCountsRequest() {
      this.status = "loading";
    },
    getCountsSuccess(counts: {}, programId: string) {
      this.status = "success";
      this.counts = counts;
      this.programId = programId;
    },
    getCountsError() {
      this.status = "error";
    },
    async fetchCounts(payload: { programId: any; refresh: any }) {
      // Get the count of UF questions, choices, answers, and messages, by deployment # and language.
      const { programId, refresh } = payload;
      if (this.status === "loading") return;
      if (this.programId === programId && !refresh) return;

      this.getCountsRequest();

      try {
        let counts = await getUfCounts(programId);
        await this.getCountsSuccess(counts, programId);
        console.log(`Got counts for ${programId}: ${counts}`);
      } catch {
        this.getCountsError();
      }
    },

    async uploadQuestionnaire(payload: {
      programId: any;
      deploymentnumber: any;
      language: any;
      fileData: any;
    }) {
      const { programId, deploymentnumber, language, fileData } = payload;
      try {
        return await questionnaireUpload({
          programId,
          deploymentNumber: deploymentnumber,
          language,
          fileData,
          clearAnswers: false
        });
      } catch (error) {
        return null;
      }
    }
  }
});
