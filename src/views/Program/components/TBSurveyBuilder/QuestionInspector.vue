<template>
  <div v-if="question" class="question-inspector p-4 bg-white border-l border-gray-200 h-full overflow-y-auto flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
        <div>
          <h3 class="text-base font-bold text-gray-800 m-0 flex items-center gap-2">
            <span class="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded font-mono">
              {{ question.id }}
            </span>
            Question Details
          </h3>
          <span class="text-xs text-gray-400">Position {{ question.position }} in playlist</span>
        </div>
        <Button size="small" type="text" @click="$emit('close')">
          <CloseOutlined />
        </Button>
      </div>

      <!-- Prompt Text Input -->
      <div class="mb-5">
        <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          Audio Prompt (Message Title)
        </label>
        <Input.TextArea
          v-model:value="question.prompt"
          :rows="3"
          placeholder="Enter question prompt..."
          @change="$emit('update-prompt', { id: question.id, prompt: question.prompt })"
        />
        <div class="text-[11px] text-gray-400 mt-1">
          This corresponds to the message title in the playlist.
        </div>
      </div>

      <Divider class="my-3" />

      <!-- Hardware Action Buttons -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-xs font-semibold text-gray-700 uppercase tracking-wider m-0">
            Hardware Buttons & Actions
          </label>
          <span class="text-[11px] text-gray-400">Talking Book buttons</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="btn in HARDWARE_BUTTONS"
            :key="btn.name"
            class="p-2.5 rounded-lg border transition-colors"
            :class="isButtonActive(btn.name) ? 'bg-gray-50 border-gray-300' : 'bg-white border-dashed border-gray-200'"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span
                  class="w-3 h-3 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: btn.iconColor }"
                ></span>
                <span class="text-xs font-semibold text-gray-800">{{ btn.label }}</span>
              </div>

              <Switch
                size="small"
                :checked="isButtonActive(btn.name)"
                @change="(checked) => toggleButton(btn.name, checked as boolean)"
              />
            </div>

            <!-- Button Action Controls when enabled -->
            <div v-if="isButtonActive(btn.name)" class="mt-2.5 pt-2.5 border-t border-gray-200 space-y-2">
              <!-- Response Text -->
              <div>
                <label class="text-[11px] font-medium text-gray-600 block mb-0.5">
                  Response Label:
                </label>
                <Input
                  size="small"
                  :value="question.actions[btn.name]?.responseValue"
                  placeholder='e.g. "Yes", "No"'
                  @input="(e: any) => updateButtonValue(btn.name, e.target.value)"
                />
              </div>

              <!-- Branch destination -->
              <div>
                <label class="text-[11px] font-medium text-gray-600 block mb-0.5">
                  Navigation Jump (Branch):
                </label>
                <Select
                  size="small"
                  class="w-full"
                  :value="question.actions[btn.name]?.targetQuestionId || 'next'"
                  @change="(val) => updateButtonBranch(btn.name, val as string)"
                >
                  <Select.Option value="next">Default Next Question</Select.Option>
                  <Select.Option
                    v-for="qOption in availableQuestions"
                    :key="qOption.id"
                    :value="qOption.id"
                  >
                    Jump to {{ qOption.id }} ({{ qOption.prompt.slice(0, 20) }}...)
                  </Select.Option>
                  <Select.Option value="epilog">End Survey (Epilog)</Select.Option>
                </Select>
              </div>

              <!-- Audio Recording (Star button or open ended) -->
              <div class="flex items-center space-x-2 pt-1">
                <Checkbox
                  :checked="question.actions[btn.name]?.isRecord"
                  @change="(e) => updateButtonRecord(btn.name, e.target.checked)"
                >
                  <span class="text-xs text-amber-700 font-medium">Record open-ended audio response</span>
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer: Delete Question -->
    <div class="pt-4 border-t border-gray-200 mt-6">
      <Popconfirm
        title="Delete this question and remove its message from the playlist?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="$emit('delete-question', question.id)"
      >
        <Button danger block size="small">
          Delete Question
        </Button>
      </Popconfirm>
    </div>
  </div>

  <div v-else class="h-full flex items-center justify-center p-6 text-center text-gray-400 text-xs">
    Select a question node on the canvas to configure prompt and button actions.
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Button, Input, Switch, Select, Checkbox, Divider, Popconfirm } from "ant-design-vue";
import { CloseOutlined } from "@ant-design/icons-vue";
import {
  HARDWARE_BUTTONS,
  type HardwareButton,
  type SurveyQuestionData,
} from "./tb-survey.utils";

const props = defineProps<{
  question: SurveyQuestionData | null;
  allQuestions: SurveyQuestionData[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update-prompt", payload: { id: string; prompt: string }): void;
  (e: "update-action", payload: { id: string; button: HardwareButton; config: any }): void;
  (e: "delete-question", id: string): void;
}>();

const availableQuestions = computed(() => {
  if (!props.question) return [];
  return props.allQuestions.filter((q) => q.id !== props.question?.id);
});

function isButtonActive(button: HardwareButton): boolean {
  if (!props.question) return false;
  return props.question.actions[button] !== undefined;
}

function toggleButton(button: HardwareButton, enabled: boolean) {
  if (!props.question) return;
  const currentActions = { ...props.question.actions };

  if (enabled) {
    const defaultVal =
      button === "Tree"
        ? "Yes"
        : button === "Table"
        ? "No"
        : button === "Bowl"
        ? "No response"
        : "";

    currentActions[button] = {
      button,
      responseValue: defaultVal,
      isRecord: button === "Star",
      targetQuestionId: undefined,
    };
  } else {
    currentActions[button] = undefined;
  }

  emit("update-action", {
    id: props.question.id,
    button,
    config: currentActions[button],
  });
}

function updateButtonValue(button: HardwareButton, val: string) {
  if (!props.question || !props.question.actions[button]) return;
  const config = { ...props.question.actions[button]!, responseValue: val };
  emit("update-action", { id: props.question.id, button, config });
}

function updateButtonBranch(button: HardwareButton, targetId: string) {
  if (!props.question || !props.question.actions[button]) return;
  const config = {
    ...props.question.actions[button]!,
    targetQuestionId: targetId === "next" ? undefined : targetId,
  };
  emit("update-action", { id: props.question.id, button, config });
}

function updateButtonRecord(button: HardwareButton, isRecord: boolean) {
  if (!props.question || !props.question.actions[button]) return;
  const config = { ...props.question.actions[button]!, isRecord };
  emit("update-action", { id: props.question.id, button, config });
}
</script>

<style scoped>
.question-inspector {
  width: 340px;
}
</style>
