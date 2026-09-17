<template>
  <span
    class="tb-survey-button-icon inline-flex items-center justify-center flex-shrink-0"
    :style="{
      width: `${iconSize}px`,
      height: `${iconSize}px`,
      color: iconColor,
    }"
  >
    <!-- Tree: Green conifer tree symbol with canopy tiers and trunk -->
    <svg
      v-if="button === 'Tree'"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 448 512"
      fill="currentColor"
      aria-label="Tree Button"
    >
      <path
        d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208l24.9 0L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320L80 320 5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5L192 448l0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 168.5 0c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320l33.4 0c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208l24.9 0c12.7 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"
      />
    </svg>

    <!-- Table: Dining table with a flat horizontal surface top and 4 distinct legs -->
    <svg
      v-else-if="button === 'Table'"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="Table Button"
    >
      <!-- Flat tabletop surface (perspective plane) -->
      <polygon points="3.5,6.5 20.5,6.5 22.5,9.5 1.5,9.5" />
      <!-- Tabletop front apron edge -->
      <rect x="1.5" y="9.5" width="21" height="2" rx="0.5" />
      <!-- Back-left leg (distinctly visible, inset) -->
      <rect x="6" y="10.5" width="1.8" height="6.5" rx="0.4" opacity="0.8" />
      <!-- Back-right leg (distinctly visible, inset) -->
      <rect x="16.2" y="10.5" width="1.8" height="6.5" rx="0.4" opacity="0.8" />
      <!-- Front-left leg -->
      <rect x="3" y="11.5" width="2.2" height="8.5" rx="0.5" />
      <!-- Front-right leg -->
      <rect x="18.8" y="11.5" width="2.2" height="8.5" rx="0.5" />
    </svg>

    <!-- Bowl: Blue curved basin with flat rim and base foot -->
    <svg
      v-else-if="button === 'Bowl'"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 210 512 300"
      fill="currentColor"
      aria-label="Bowl Button"
    >
      <path
        d="M0 283.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z"
      />
    </svg>

    <!-- Star: Gold five-point star (record button) -->
    <svg
      v-else-if="button === 'Star'"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 576 512"
      fill="currentColor"
      aria-label="Star Button"
    >
      <path
        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      />
    </svg>

    <!-- Right Hand: Raised hand where thumb is the first finger from the right -->
    <svg
      v-else-if="button === 'Right Hand'"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 512 512"
      fill="currentColor"
      aria-label="Right Hand Button"
    >
      <g transform="translate(512, 0) scale(-1, 1)">
        <path
          d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 272c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64l19.2 0c97.2 0 176-78.8 176-176l0-208c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 176c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208z"
        />
      </g>
    </svg>

    <!-- Left Hand: Raised hand where thumb is the last finger from the right (on the left) -->
    <svg
      v-else-if="button === 'Left Hand'"
      :width="iconSize"
      :height="iconSize"
      viewBox="0 0 512 512"
      fill="currentColor"
      aria-label="Left Hand Button"
    >
      <path
        d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 272c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64l19.2 0c97.2 0 176-78.8 176-176l0-208c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-176c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 176c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208z"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { HardwareButton } from "./tb-survey.utils";

const BUTTON_COLORS: Record<HardwareButton, string> = {
  Tree: "#16a34a",
  Table: "#d97706",
  Bowl: "#2563eb",
  Star: "#ca8a04",
  "Right Hand": "#8b5cf6",
  "Left Hand": "#ec4899",
};

const props = withDefaults(
  defineProps<{
    button: HardwareButton;
    size?: number | string;
    colored?: boolean;
  }>(),
  {
    size: 14,
    colored: true,
  }
);

const iconSize = computed(() => {
  if (typeof props.size === "string") {
    return parseInt(props.size, 10) || 14;
  }
  return props.size || 14;
});

const iconColor = computed(() => {
  if (!props.colored) return "currentColor";
  return BUTTON_COLORS[props.button] || "currentColor";
});
</script>

<style scoped>
.tb-survey-button-icon {
  display: inline-flex;
  vertical-align: middle;
  line-height: 1;
}
</style>
