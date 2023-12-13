import { getCategories } from "@/api/generalQueries.api";
import { SupportedCategory } from "@/models/category";
import { defineStore } from "pinia";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    status: "",
    categories: [] as SupportedCategory[]
  }),

  actions: {
    getCategoriesRequest() {
      this.status = "loading";
    },
    getCategoriesSuccess(categories: any[]) {
      this.status = "success";
      this.categories = categories;
    },
    getCategoriesError() {
      this.status = "error";
    },
    async fetchCategories() {
      if (this.status == "loading" || this.categories.length > 0) return;

      this.getCategoriesRequest();

      try {
        let categories = await getCategories();
        await this.getCategoriesSuccess(categories);
      } catch {
        this.getCategoriesError();
      }
    }
  }
});
