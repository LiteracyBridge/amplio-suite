<template>
  <div class="epilog-node rounded-lg border-2 border-indigo-500 bg-white shadow-md p-4 w-72">
    <!-- Target handle receiving terminal flows -->
    <Handle
      id="epilog-in"
      type="target"
      :position="Position.Top"
      class="!bg-indigo-500 !w-3 !h-3 !border-2 !border-white"
    />

    <div class="flex items-center space-x-2 text-indigo-700 font-semibold text-sm mb-1">
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
      <span>Epilog (End)</span>
    </div>
    <div class="text-xs text-gray-500 italic">
      {{ data.text || "Thank you for your participation" }}
    </div>
    <div class="text-[10px] text-gray-400 mt-2 flex justify-between items-center">
      <span>Survey terminates here</span>
      <span class="text-indigo-600 font-medium">Exit</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";

defineProps<{
  data: {
    title: string;
    text: string;
  };
}>();
</script>

<style scoped>
.epilog-node {
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.15), 0 2px 4px -2px rgba(99, 102, 241, 0.1);
}
</style>
