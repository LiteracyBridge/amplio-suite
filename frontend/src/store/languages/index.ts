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
        async fetchLanguages() {
            if (
                this.status == "loading" ||
                (this.languages && this.languages.length > 0)
            ) {
                return;
            }
            this.getLanguagesRequest();

            try {
                let languages = await getLanguages();
                await this.getLanguagesSuccess(languages);
            } catch {
                this.getLanguagesError();
            }
        }
    }
});
