import { defineStore } from "pinia";

export const useAppStore = defineStore("app-config-store", {
  state: () => ({
    sidebarVisible: false
  })
});
