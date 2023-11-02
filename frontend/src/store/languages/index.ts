import { getLanguages } from "@/api/generalQueries.api";
import { Language } from "@/models/language";
import { defineStore } from "pinia";

export const useLanguagesStore = defineStore("languages", {
  state: () => ({
    status: null as "loading" | "error" | "success",
    languages: [] as Language[]
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
    },
    generateNewLanguageCode(lang: { name: string; code: string }) {
      const genCode = (name: string, code: string) => {
        if (name.length == code.length) {
          return (
            name + String.fromCharCode(97 + Math.floor(Math.random() * 26))
          );
        }
        const length = code.length == 0 ? 2 : code.length + 1;
        return name.substring(0, length);
      };

      const codes = new Set(this.languages.map(l => l.code.toLowerCase()));

      const { name } = lang;
      let code = lang.code || "";

      if (code.length == 0) {
        code = genCode(name, code);
      }

      while (codes.has(code)) {
        code = genCode(name, code);
      }
      return code;
    }
  }
});
