<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";

const store = useTalkingBookAnalyticStore();
</script>

<template>
  <div class="stats-grid">
    <div
      v-for="stat in [
        {
          title: 'Talking Books in Project',
          value: store.summaries?.tbs?.project_tbs || 0,
        },
        {
          title: 'Talking Books Installed',
          value: store.summaries?.tbs?.installed || 0,
        },
        {
          title: 'Talking Books Reporting Statistics',
          value: store.summaries?.tbs?.reporting_stats || 0,
        },
        {
          title: 'Number of Messages',
          value: store.summaries?.tbs?.total_messages || 0,
        },
        {
          title: 'Total Minutes Played',
          value: (+store.summaries?.tbs?.minutes_played)?.toLocaleString() || 0,
        },
      ]"
      :key="stat.title"
      class="stat-card"
    >
      <dl>
        <dt>{{ stat.title }}</dt>
        <dd>{{ stat.value }}</dd>
      </dl>
    </div>
  </div>
</template>

<style scoped>
/* Stats grid - responsive columns */
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
}

.stat-card dt {
  font-size: 0.875rem;
  font-weight: bold;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.stat-card dd {
  font-size: 1.875rem;
  font-weight: 600;
  color: #38a169; /* amplio-green */
}
</style>
