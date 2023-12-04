import { defineStore } from "pinia";
import { getPrograms } from "@/api/generalQueries.api";
import { useUIStore } from "../ui";

export const useProgramsStore = defineStore("programs", {
  state: () => ({
    status: "",
    programs: [],
    programNames: {}
  }),
  actions: {
    requestInit() {
      this.status = "loading";
    },

    requestError() {
      this.status = "error";
    },

    setProgramsList(values: { programIds: any; programNames: any }) {
      this.status = "success";
      this.programs = values.programIds;
      this.programNames = values.programNames;
    },
    async getProgramsList() {
      if (this.status === "loading") return;

      await this.requestInit();

      try {
        const getProgramsResult = await getPrograms();

        console.log(getProgramsResult);

        const programsList = getProgramsResult["result"]["programs"];
        const programIdsList = Object.keys(programsList).sort();
        let programNamesMap: Record<string, any> = {};
        programIdsList.forEach(id => {
          programNamesMap[id] = programsList[id].name;
        });
        await this.setProgramsList({
          programIds: programIdsList,
          programNames: programNamesMap
        });
      } catch (error) {
        this.requestError();
        useUIStore().setNotification({
          type: "alert",
          text: error.toString()
        });
      }
    }
  }
});
