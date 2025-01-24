<template>
  <div
    v-if="isOpen"
    :class="bgColor"
    class="absolute container flex items-center justify-between p-4"
  >
    <div>
      <font-awesome-icon
        v-if="type == 'alert'"
        class="mr-2"
        :icon="'exclamation-circle'"
      />
      {{ text }}
    </div>

    <button
      aria-label="Close notification"
      class="px-2 pb-1 bg-semi-transparent cursor-pointer rounded-full hover:bg-semi-transparent-darken"
      @click="closeNotification"
    >
      <font-awesome-icon icon="times" class="w-3 h-3 text-white" />
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useUIStore } from "@/store/ui";
export default {
  computed: {
    ...mapState(useUIStore, {
      isOpen: (state) => state.notification.isOpen,
      type: (state) => state.notification.type,
      text: (state) => state.notification.text,
    }),
    bgColor() {
      return this.type === "alert" ? "bg-red-200" : "bg-gray-200";
    },
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        setTimeout(() => this.closeNotification(), 10000);
      }
    },
  },
  methods: {
    ...mapActions(useUIStore, ["closeNotification"]),
  },
};
</script>
