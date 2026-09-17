<template>
  <div
    class="question-node rounded-lg border bg-white shadow-md p-3 w-80 transition-all hover:shadow-lg"
    :class="{ 'border-blue-500 ring-2 ring-blue-200': selected, 'border-gray-200': !selected }"
  >
    <!-- Top incoming handle -->
    <Handle
      id="target"
      type="target"
      :position="Position.Top"
      class="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
    />

    <!-- Header: Question ID and Delete Button -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
      <div class="flex items-center space-x-2">
        <span class="px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 rounded border border-blue-200">
          {{ data.id }}
        </span>
        <span class="text-xs text-gray-400 font-medium">Question {{ data.position }}</span>
      </div>

      <Popconfirm
        title="Delete question from survey and playlist?"
        ok-text="Yes"
        cancel-text="No"
        @confirm.stop="onDelete"
      >
        <button
          class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
          title="Delete Question"
          @click.stop
        >
          <DeleteOutlined class="text-xs" />
        </button>
      </Popconfirm>
    </div>

    <!-- Question Prompt -->
    <div class="text-xs font-medium text-gray-800 line-clamp-2 mb-3 min-h-[32px]">
      {{ data.prompt || "Untitled Question" }}
    </div>

    <!-- Hardware Action Buttons List -->
    <div class="space-y-1.5 pt-1 border-t border-gray-50">
      <div
        v-for="btn in activeButtons"
        :key="btn.name"
        class="relative flex items-center justify-between px-2 py-1 bg-gray-50 rounded text-[11px] border border-gray-100 group"
      >
        <div class="flex items-center space-x-1.5">
          <span
            class="w-2 h-2 rounded-full flex-shrink-0"
            :style="{ backgroundColor: btn.iconColor }"
          ></span>
          <span class="font-medium text-gray-700">{{ btn.name }}:</span>
          <span v-if="btn.isRecord" class="text-amber-600 font-semibold flex items-center gap-0.5">
            <AudioOutlined class="text-[10px]" /> record
          </span>
          <span v-else class="text-gray-600 truncate max-w-[90px]">
            "{{ btn.responseValue || 'No response' }}"
          </span>
        </div>

        <div class="flex items-center space-x-1 pr-1">
          <span
            v-if="btn.targetQuestionId && btn.targetQuestionId !== 'next'"
            class="text-[10px] font-semibold px-1 py-0.2 bg-purple-100 text-purple-700 rounded"
          >
            go({{ btn.targetQuestionId === 'epilog' ? 'exit' : btn.targetQuestionId }})
          </span>
          <span v-else class="text-[10px] text-gray-400">next</span>
        </div>

        <!-- Output handle on the right for connecting branch -->
        <Handle
          :id="`btn-${btn.name}`"
          type="source"
          :position="Position.Right"
          class="!bg-purple-500 !w-2.5 !h-2.5 !border !border-white group-hover:scale-125 transition-transform"
        />
      </div>

      <div v-if="activeButtons.length === 0" class="text-[11px] text-gray-400 italic py-1 text-center">
        No buttons assigned (click to edit)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Handle, Position } from "@vue-flow/core";
import { DeleteOutlined, AudioOutlined } from "@ant-design/icons-vue";
import { Popconfirm } from "ant-design-vue";
import {
  HARDWARE_BUTTONS,
  type SurveyQuestionData,
} from "../tb-survey.utils";

const props = defineProps<{
  id: string;
  selected?: boolean;
  data: SurveyQuestionData;
}>();

const emit = defineEmits<{
  (e: "delete-question", questionId: string): void;
}>();

const activeButtons = computed(() => {
  return HARDWARE_BUTTONS.map((hBtn) => {
    const act = props.data.actions[hBtn.name];
    if (!act) return null;
    return {
      ...hBtn,
      responseValue: act.responseValue,
      isRecord: act.isRecord,
      targetQuestionId: act.targetQuestionId,
    };
  }).filter((b): b is NonNullable<typeof b> => b !== null);
});

function onDelete() {
  emit("delete-question", props.id);
}
</script>

<style scoped>
.question-node {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
