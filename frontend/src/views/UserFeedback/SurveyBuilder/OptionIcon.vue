<script setup lang="ts">
import { QuestionType } from "@/models/question";

const props = defineProps<{ type: QuestionType }>();
</script>
<template>
  <span>
    <svg
      v-if="type == QuestionType.single_choice || type == QuestionType.boolean"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    </svg>

    <svg
      v-if="type == QuestionType.multi_choice"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-app"
      viewBox="0 0 16 16"
    >
      <path
        d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4H5z"
      />
    </svg>
  </span>
</template>
