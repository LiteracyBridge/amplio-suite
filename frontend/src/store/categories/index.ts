import { getCategories } from "@/api/generalQueries.api";
import { defineStore } from "pinia";

export const useCategoriesStore = defineStore("categories-store", {
    state: () => ({
        status: "",
        categories: []
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
