<template>
  <div class="prolog-node rounded-lg border-2 border-emerald-500 bg-white shadow-md p-4 w-72">
    <div class="flex items-center space-x-2 text-emerald-700 font-semibold text-sm mb-1">
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
      <span>Prolog (Start)</span>
    </div>
    <div class="text-xs text-gray-500 italic">
      {{ data.text || "Welcome to the talking book satisfaction survey" }}
    </div>
    <div class="text-[10px] text-gray-400 mt-2 flex justify-between items-center">
      <span>Plays at survey start</span>
      <span class="text-emerald-600 font-medium">Auto-advances to q1</span>
    </div>

    <!-- Source handle connecting to first question -->
    <Handle
      id="prolog-out"
      type="source"
      :position="Position.Bottom"
      class="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
    />
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
.prolog-node {
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.15), 0 2px 4px -2px rgba(16, 185, 129, 0.1);
}
</style>
