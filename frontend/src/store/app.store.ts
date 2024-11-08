import type { Program } from "@/models/program";
import { defineStore } from "pinia";
import { useAccountStore } from "./account";
import { message } from "ant-design-vue";
import { LocalStorageKeys } from "@/models/constants";
import type { Deployment } from "@/models/deployment";
import { orderBy } from "lodash";

export const useAppStore = defineStore("app-config-store", {
  state: () => ({
    loading: false,
    sidebarCollapsed: false,
    activeProgram: { id: undefined as number, data: undefined as Program },
    userFeedback: {
      deployment: undefined as undefined | number | string,
      language: undefined as undefined | string,
      surveyId: undefined as undefined | number,
    },
  }),
  getters: {
    programCode: (state) => {
      return state.activeProgram.data?.program_id;
    },
    programName: (state) => {
      return state.activeProgram.data?.project?.name;
    },
    deployments: (state): Deployment[] => {
      return orderBy(
        state.activeProgram.data?.project.deployments || [],
        (d) => d.deploymentnumber,
      );
    },
    languages: (state) => {
      console.log(state.activeProgram.data)
      return state.activeProgram.data?.project.languages || [];
    },
  },
  actions: {
    setActiveProgram(id: number | string) {
      const program = useAccountStore().programs.find((p) => p.id == id);

      if (program == null) {
        message.error("Program not found");
        return;
      }

      this.activeProgram.id = +id;
      this.activeProgram.data = program;

      // Save to local storage
      localStorage.setItem(
        LocalStorageKeys.active_program,
        JSON.stringify(this.activeProgram),
      );
    },
  },
});
