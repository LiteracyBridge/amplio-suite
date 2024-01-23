<template>
  <div class="grid grid-cols-form-2 items-center col-span-2">
    <div>
      <span class="float-right mr-4 text-right">{{ label }}</span>
      <v-tooltip
        v-if="showTooltip"
        text="This field cannot be greater than Direct Beneficiaries"
        position="left"
        class="ml-2"
      >
        <font-awesome-icon class="text-orange-600" icon="exclamation-circle" />
      </v-tooltip>
    </div>
    <v-input
      class="recipient-number-value"
      type="number"
      :value="val"
      @input="emit('input', $event.target.value)"
      mx="mx-0 w-full"
    />
  </div>
</template>

<script lang="ts" setup>
import VInput from "@/components/VInput.vue";
import VTooltip from "@/components/VTooltip.vue";

const props = defineProps<{
  label: string;
  val?: number | string;
  showTooltip: boolean;
}>();

const emit = defineEmits<{
  (e: "input", value: number): void;
}>();
</script>
