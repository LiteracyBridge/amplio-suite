// import mutations from "./mutations";
// import actions from "./actions";
import { defineStore } from "pinia";
import { useProgramSpecStore } from "../programspec";

export const getDefaultState = () => ({
  isComplete: false,
  actualStep: 1,
  completedSteps: [0], // First step is fill by default
});

export const useWizardStore = defineStore("wizard", {
  state: () => getDefaultState(),
  actions: {
    resetState() {
      Object.assign(this, getDefaultState());
    },

    setStep(payload: any) {
      this.actualStep = payload;
    },

    nextStep() {
      this.actualStep++;
    },

    prevStep() {
      this.actualStep--;
    },

    addCompletedStep(payload: any) {
      const index = this.completedSteps.indexOf(payload);
      if (index === -1) {
        this.completedSteps.push(payload);
      }
    },

    removeCompletedStep(payload: any) {
      const index = this.completedSteps.indexOf(payload);
      if (index > -1) this.completedSteps.splice(index, 1);
    },
    setIsCompleted() {
      this.isComplete = true;
    },

    // Helper
    async check(attrs: any, step: any) {
      // const result = await dispatch("programData/isCompleted", attrs, {
      //     root: true
      // });
      if (this.isComplete) this.addCompletedStep(step);
      else this.removeCompletedStep(step);
    },

    // step-program-name
    async setProgramName(payload: any) {
      const { name, step } = payload;
      const attrs = ["programName"];

      useProgramSpecStore().general.name = name;
      await this.check(attrs, step);
    },

    // step-geo
    async setCountry(payload: any) {
      const { country, step } = payload;
      const attrs = ["country", "region"];

      useProgramSpecStore().general.country = country;
      await this.check(attrs, step);
    },

    async addRegion(payload: any) {
      const { region, step } = payload;
      const attrs = ["country", "region"];

      await useProgramSpecStore().general.region.push(region);
      await this.check(attrs, step);
    },

    async removeRegion(payload: any) {
      const { region, step } = payload;
      const attrs = ["country", "region"];

      await useProgramSpecStore().removeRegion(region);
      await this.check(attrs, step);
    },

    // step-sdg
    async toggleGoal(payload: any) {
      const { goal, step } = payload;
      await useProgramSpecStore().toggleGoal(goal);
      await this.check("goals", step);
    },

    // step-listening-models
    async toggleListening(payload: any) {
      const { listeningMode, step } = payload;
      await useProgramSpecStore().general.listening_models.push(listeningMode);
      await this.check("listeningModels", step);
    },

    // step-deployments
    async setDeploymentsCount(payload: any) {
      const { count, step } = payload;
      const attrs = [
        "deploymentsCount",
        "deploymentsLength",
        "deploymentsFirst",
      ];

      await useProgramSpecStore().setDeploymentsCount(count);
      await this.check(attrs, step);
    },

    async setDeploymentsLength(payload: any) {
      const { length, step } = payload;
      const attrs = [
        "deploymentsCount",
        "deploymentsLength",
        "deploymentsFirst",
      ];

      await useProgramSpecStore().setDeploymentsLength(length);
      await this.check(attrs, step);
    },

    async setDeploymentsFirst(payload: any) {
      const { first, step } = payload;
      const attrs = [
        "deploymentsCount",
        "deploymentsLength",
        "deploymentsFirst",
      ];

      await useProgramSpecStore().setDeploymentsFirst(first);
      await this.check(attrs, step);
    },

    // step-feedback
    async setFeedbackFrequently(payload: any) {
      const { frequently, step } = payload;
      await useProgramSpecStore().setFeedbackFrequently(frequently);
      await this.check("feedbackFrequently", step);
    },

    // step-languages
    async setLanguages(payload: any) {
      const { lang, index, step } = payload;
      await useProgramSpecStore().setLanguages({ lang, index });
      await this.check("languages", step);
    },

    async deleteLanguage(payload: any) {
      const { lang, step } = payload;
      await useProgramSpecStore().deleteLanguage(lang);
      await this.check("languages", step);
    },
  },
});
