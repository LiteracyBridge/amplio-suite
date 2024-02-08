import { ApiRequest } from "@/api";
import { SupportedCategory } from "@/models/category";
import { defineStore } from "pinia";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    loading: false,
    categories: [] as SupportedCategory[]
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      return ApiRequest.get<SupportedCategory>("categories/supported");
    }
  }
});
