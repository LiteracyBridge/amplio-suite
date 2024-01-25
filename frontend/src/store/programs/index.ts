import { defineStore } from "pinia";
import { ApiRequest } from "@/api";
import { Program } from "@/models/program";
import { ProgramUser } from "@/models/user";
import { useAppStore } from "@/store/app.store";

export const useProgramsStore = defineStore("programs", {
  state: () => ({
    status: "",
    organisationPrograms: [] as Program[],
    programs: [],
    programNames: {},
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
    //
    // API Requests
    //
    /**
     * @deprecated
     * TODO: remove this function
     */
    async getProgramsList() {
      return;
      // if (this.status === "loading") return;

      // await this.requestInit();

      // try {
      //   const getProgramsResult = await getPrograms();

      //   console.log(getProgramsResult);

      //   const programsList = getProgramsResult["result"]["programs"];
      //   const programIdsList = Object.keys(programsList).sort();
      //   let programNamesMap: Record<string, any> = {};
      //   programIdsList.forEach((id) => {
      //     programNamesMap[id] = programsList[id].name;
      //   });
      //   await this.setProgramsList({
      //     programIds: programIdsList,
      //     programNames: programNamesMap,
      //   });
      // } catch (error) {
      //   this.requestError();
      //   useUIStore().setNotification({
      //     type: "alert",
      //     text: error.toString(),
      //   });
      // }
    },
    async getOrgPrograms() {
      return ApiRequest.get<Program>(`programs/all`);
    },
    async getProgramUsers(id: string | number) {
      return ApiRequest.get<ProgramUser>(`programs/${id}/users`);
    },
    async getTbStatusBy(selector: string) {
      return ApiRequest.get<Record<string, any>>(
        `dashboard-queries/${
          useAppStore().programCode
        }/status?selector=${selector}`
      );
    },
  },
});
