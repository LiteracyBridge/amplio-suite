import { ApiRequest } from "@/api";
import { Language } from "@/models/language";
import { defineStore } from "pinia";
import { useProgramSpecStore } from "../programspec";
import { sys } from "typescript";

export const useLanguagesStore = defineStore("languages", {
  state: () => ({
    loading: false,
    loaded: false,
    languages: [] as Language[],
  }),
  actions: {
    /**
     * Map a language code to a dict of {code:language-code, name:language-name, coment:whatever}
     * If a code is not found, return {code:the-code, name:the-code, comment:the-code}
     */
    mapLanguageCodesToInfo(codes: string[]): Language[] {
      const infos = (codes || []).map((lc) => {
        let languageInfo = this.languages.find(
          (languageInfo) => languageInfo.code == lc,
        );
        if (!languageInfo) {
          languageInfo = { code: lc, name: lc, comment: lc };
        }
        return languageInfo;
      });
      return infos;
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

      const codes = new Set(this.languages.map((l) => l.code.toLowerCase()));

      const { name } = lang;
      let code = lang.code || "";

      if (code.length == 0) {
        code = genCode(name, code);
      }

      while (codes.has(code)) {
        code = genCode(name, code);
      }
      return code;
    },
    mergeWithSystemLanguages(opts: {
      newLangs: Language[], systemLanguages?: Language[]
    }) {
      const newLangs: Language[] = []
      const codes = new Set<string>((opts.systemLanguages ?? this.languages).map((i) => i.code));
      for (const l of opts.newLangs) {
        if (!codes.has(l.code)) {
          newLangs.push(l);
        }
      }

      this.languages = [...(opts.systemLanguages ?? this.languages), ...newLangs]
    },
    //
    // API calls
    //
    async fetchLanguages() {
      if (this.loaded) return

      this.loading = true
      return ApiRequest.get<Language>("languages/supported")
        .then((resp) => {
          // Merge program spec languages with system languages
          const codes = new Set<string>(resp!.map((i) => i.code));
          for (const l of useProgramSpecStore().languages) {
            if (!codes.has(l.code)) {
              resp!.push(l);
            }
          }
          this.mergeWithSystemLanguages({ systemLanguages: resp!, newLangs: useProgramSpecStore().languages });
          this.loaded = true
        }).finally(() => this.loading = false)
    },
  },
});
