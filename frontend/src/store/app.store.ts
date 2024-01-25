import { Program } from "@/models/program";
import { defineStore } from "pinia";
import { useAccountStore } from "./account";
import { message } from "ant-design-vue";
import { LocalStorageKeys } from "@/models/constants";

export const useAppStore = defineStore("app-config-store", {
  state: () => ({
    sidebarVisible: false,
    activeProgram: { id: undefined as number, data: undefined as Program },
  }),
  getters: {
    programCode: (state) => {
      return state.activeProgram.data?.program_id;
    },
    programName: (state) => {
      return state.activeProgram.data?.project?.name;
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
        JSON.stringify(this.activeProgram)
      );
    },
  },
});
