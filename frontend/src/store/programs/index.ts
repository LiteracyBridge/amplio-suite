import { defineStore } from "pinia";
import { ApiRequest } from "@/api";
import { Program } from "@/models/program";
import { ProgramUser } from "@/models/user";
import { useAppStore } from "@/store/app.store";
import { sortBy } from "lodash";

export const useProgramsStore = defineStore("programs", {
  state: () => ({
    status: "",
    organisationPrograms: [] as Program[],
    programs: [],
  }),
  actions: {
    requestInit() {
      this.status = "loading";
    },

    requestError() {
      this.status = "error";
    },

    setProgramsList(data: Program[]) {
      this.organisationPrograms = sortBy(data, (p) => p.project.name);
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
