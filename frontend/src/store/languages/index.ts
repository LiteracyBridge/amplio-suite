import { getLanguages } from "@/api/generalQueries.api";
import { defineStore } from "pinia";

export const useLanguagesStore = defineStore("languages", {
    state: () => ({
        status: "",
        languages: []
    }),
    actions: {
        getLanguagesRequest() {
            this.status = "loading";
        },

        getLanguagesSuccess(languages: any[]) {
            this.status = "success";
            this.languages = languages;
        },

        getLanguagesError() {
            this.status = "error";
        },
        async fetchLanguages(programId?: string) {
            if ((this.languages || []).length > 0) {
                return;
            }
            this.getLanguagesRequest();

            try {
                let languages = await getLanguages(programId);
                await this.getLanguagesSuccess(languages);
            } catch (err) {
                console.log(err);
                this.getLanguagesError();
            }
        }
    }
});
