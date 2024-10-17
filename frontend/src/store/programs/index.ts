import { defineStore } from "pinia";
import { ApiRequest } from "@/api";
import { Program } from "@/models/program";
import { ProgramUser, User } from "@/models/user";
import { useAppStore } from "@/store/app.store";
import { sortBy } from "lodash";
import { notification } from "ant-design-vue";

export const useProgramsStore = defineStore("programs", {
  state: () => ({
    loading: false,
    organisationPrograms: [] as Program[],
    programs: [],
  }),
  actions: {
    // requestInit() {
    //   this.status = "loading";
    // },

    // requestError() {
    //   this.status = "error";
    // },

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
    //
    // API Requests
    //
    async getOrgPrograms() {
      return ApiRequest.get<Program>("programs");
    },
    async fetchOrgUsers(programId: string | number) {
      return ApiRequest.get<User>(`programs/${programId}/users`);
    },
    async addOrganisationToProgram(form: {
      organisation_id: number;
      program_id: number;
    }) {
      this.loading = true;
      return ApiRequest.post<Program>("programs/organisations", form)
        .then((resp) => {
          this.organisationPrograms = resp;
        })
        .finally(() => (this.loading = false));
    },
    async removeOrganisationFromProgram(opts: {
      organisationId: number;
      programId: number;
    }) {
      this.loading = true;

      return ApiRequest.delete<Program>(
        `programs/${opts.programId}/organisations/${opts.organisationId}`,
      )
        .then(async (resp) => {
          this.organisationPrograms = resp;
          notification.success({
            message: "Organisation Removed!",
            description: `The organisation has been removed from the program.`,
          });
          return resp;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async removeUserFromProgram(opts: { programId: number; userId: number }) {
      this.loading = true;
      return ApiRequest.delete<Program>(
        `programs/${opts.programId}/users?user_id=${opts.userId}`,
      )
        .then(async (resp) => {
          this.organisationPrograms = resp;
          notification.success({
            message: "User Remove!",
            description: `The user has been removed from the program.`,
          });
          return resp;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
