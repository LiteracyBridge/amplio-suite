import { getRoadmap, putRoadmap } from "@/api/generalQueries.api";
import { defineStore } from "pinia";
import { useUIStore } from "../ui";

export const useRoadmapStore = defineStore("roadmap", {
  state: () => ({
    changed: false,
    status: "",
    programId: "",

    roadmap: [] as any[],
  }),

  actions: {
    setChanged(changed: boolean) {
      this.changed = changed;
    },
    getRoadmapRequest() {
      this.status = "loading";
    },
    getRoadmapSuccess(payload: {
      completed: any[];
      program_code: any;
      program_id: any;
    }) {
      this.status = "success";
      this.changed = false;
      this.roadmap = payload.completed;
      this.programId = payload.program_code || payload.program_id;
    },
    getRoadmapError() {
      this.status = "error";
    },
    addStep(payload: any) {
      this.roadmap.push(payload);
    },
    removeStep(index: number) {
      this.roadmap.splice(index, 1);
    },
    async fetchRoadmap(programId: string) {
      if (this.status == "loading") return;
      if (this.programId === programId && !this.changed) return;

      this.getRoadmapRequest();

      try {
        const response = await getRoadmap(programId);
        await this.getRoadmapSuccess(response);
      } catch {
        this.getRoadmapError();
      }
    },
    async updateRoadmap() {
      const { programId, roadmap } = this.$state;
      if (!this.changed) return;

      try {
        await putRoadmap(programId, roadmap);
        this.setChanged(false);
      } catch (error) {
        // commit("requestError");
        useUIStore().setNotification({
          type: "alert",
          text: error.toString(),
        });
      }
    },
    toggleStep(stepId: any) {
      const index = this.roadmap.indexOf(stepId);

      if (index > -1) this.removeStep(index);
      else this.addStep(stepId);

      this.setChanged(true);
    },
  },
});
