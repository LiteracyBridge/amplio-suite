<template>
  <div class="grid grid-cols-form-2 items-center col-span-2">
    <div>
      <span class="float-right mr-4 text-right">{{ label }}</span>
      <!-- <v-tooltip
        v-if="showTooltip"
        text="This field cannot be greater than Direct Beneficiaries"
        position="left"
        class="ml-2"
      >
        <font-awesome-icon class="text-orange-600" icon="exclamation-circle" />
      </v-tooltip> -->
    </div>
    <Input
      type="number"
      :value="val"
      @change="emit('input', $event.target.value)"
      mx="mx-0 w-full"
    >
      <template #suffix>
        <Tooltip title="This field cannot be greater than Direct Beneficiaries">
          <InfoCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
        </Tooltip>
      </template>
    </Input>
  </div>
</template>

<script lang="ts" setup>
import { FormItem, Input, Tooltip } from "ant-design-vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  label: string;
  val?: number | string;
  showTooltip: boolean;
}>();

const emit = defineEmits<{
  (e: "input", value: number | string): void;
}>();
</script>
