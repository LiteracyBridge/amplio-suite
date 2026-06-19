<script setup lang="ts">
import { ref } from "vue";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";

const store = useTalkingBookAnalyticStore();
const activeTooltip = ref<string | null>(null);

const stats = [
  {
    title: 'Talking Books in Project',
    icon: 'ti-device-speaker',
    description: 'Total talking books registered under this project, across all deployments and communities.',
    get value() { return store.summaries?.tbs?.project_tbs || 0; },
  },
  {
    title: 'Talking Books Installed',
    icon: 'ti-map-pin',
    description: 'Talking books that have been physically installed and assigned to a recipient in the field.',
    get value() { return store.summaries?.tbs?.installed || 0; },
  },
  {
    title: 'Talking Books Reporting Statistics',
    icon: 'ti-chart-bar',
    description: 'Talking books that have successfully sent back usage statistics at least once.',
    get value() { return store.summaries?.tbs?.reporting_stats || 0; },
  },
  {
    title: 'Number of Messages',
    icon: 'ti-message',
    description: 'Total distinct audio messages loaded across all deployed talking books in this program.',
    get value() { return store.summaries?.tbs?.total_messages || 0; },
  },
  {
    title: 'Total Minutes Played',
    icon: 'ti-player-play',
    description: 'Cumulative minutes of audio played across all devices. Calculated from raw seconds recorded by each device.',
    get value() {
      const raw = +store.summaries?.tbs?.minutes_played;
      return isNaN(raw) ? 0 : Math.round(raw / 60).toLocaleString();
    },
  },
  {
    title: 'Total Hours Played',
    icon: 'ti-clock',
    description: 'Total hours of audio played across all devices. Equivalent to total minutes divided by 60.',
    get value() {
      const raw = +store.summaries?.tbs?.minutes_played;
      return isNaN(raw) ? 0 : (raw / 3600).toFixed(1);
    },
  },
];

function toggleTooltip(title: string) {
  activeTooltip.value = activeTooltip.value === title ? null : title;
}
</script>

<template>
  <div class="stats-grid">
    <div
      v-for="stat in stats"
      :key="stat.title"
      class="stat-card"
      @mouseenter="activeTooltip = stat.title"
      @mouseleave="activeTooltip = null"
      @click="toggleTooltip(stat.title)"
    >
      <div class="info-dot" :class="{ active: activeTooltip === stat.title }" />

      <div
        class="tooltip-box"
        :class="{ visible: activeTooltip === stat.title }"
        role="tooltip"
      >
        <p class="tooltip-title">{{ stat.title }}</p>
        <p class="tooltip-desc">{{ stat.description }}</p>
      </div>

      <dl>
        <dt>
          <i :class="['ti', stat.icon]" aria-hidden="true" />
          {{ stat.title }}
        </dt>
        <dd>{{ stat.value }}</dd>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.15s, border-color 0.15s;
  border: 1px solid transparent;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #c6f6d5;
}

/* Info dot */
.info-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e0;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: background 0.15s;
}

.info-dot.active,
.stat-card:hover .info-dot {
  background: #38a169;
}

/* Tooltip */
.tooltip-box {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  z-index: 99;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 210px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 10px 12px;
  pointer-events: none;
  transition: opacity 0.15s, visibility 0.15s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Tooltip arrow */
.tooltip-box::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #e2e8f0;
}

.tooltip-box::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: white;
  z-index: 1;
}

.tooltip-box.visible {
  visibility: visible;
  opacity: 1;
}

.tooltip-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px;
}

.tooltip-desc {
  font-size: 0.75rem;
  color: #718096;
  line-height: 1.5;
  margin: 0;
}

/* Card content */
.stat-card dt {
  font-size: 0.875rem;
  font-weight: bold;
  color: #4a5568;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-card dt .ti {
  font-size: 1rem;
  color: #38a169;
}

.stat-card dd {
  font-size: 1.875rem;
  font-weight: 600;
  color: #38a169;
  margin: 0;
}
</style>