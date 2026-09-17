<template>
  <Modal
    :open="open"
    title="Talking Book Survey Specification (YAML)"
    :width="700"
    :footer="null"
    @cancel="$emit('close')"
  >
    <div class="py-2">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">
          Generated Talking Book device survey format (Read-only)
        </span>
        <Button size="small" type="primary" :ghost="true" @click="copyYaml">
          <CopyOutlined /> Copy YAML
        </Button>
      </div>

      <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[500px] border border-gray-700 whitespace-pre">
{{ yamlContent }}
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Modal, Button, message } from "ant-design-vue";
import { CopyOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  open: boolean;
  yamlContent: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();

async function copyYaml() {
  try {
    await navigator.clipboard.writeText(props.yamlContent);
    message.success("Survey YAML copied to clipboard!");
  } catch (err) {
    message.error("Failed to copy YAML to clipboard");
  }
}
</script>
