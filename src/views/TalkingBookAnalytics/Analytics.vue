<script setup lang="ts">
import { TabPane, Col, Statistic, Tabs, Row, Spin, Divider } from "ant-design-vue";
import { onMounted, ref } from "vue";
import UsageMap from "./components/UsageMap.vue";
import Content from "./components/Content.vue";
import Operations from "./components/Operations.vue";
import OverallUsage from "./components/OverallUsage.vue";
import UsagePerTB from "./components/UsagePerTB.vue";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  BarController,
  CategoryScale,
  BarElement,
  Colors,
  Legend,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { baseChartConfig } from "./components/chart_config";
import type { SummaryDataItem } from "./components/chart_config";
import Filters from "./components/Filters.vue";
import { useRequest } from "vue-request";
import { useAppStore } from "@/store/app.store";
import { useProgramSpecStore } from "@/store/programspec";
import { LocalStorageKeys } from "@/models/constants";

Chart.register(
  LineController,
  BarController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarElement,
  Colors,
  Legend,
  Tooltip,
  ChartDataLabels
);

const store = useTalkingBookAnalyticStore();
let chart1: Chart;
let chart2: Chart;
let chart3: Chart;
let chart4: Chart;
let chart5: Chart;
let chart6: Chart;

function updateCharts() {
  // Minute Played
  const minutesPlayed: Record<string, number> = {};
  for (const row of store.summaries?.usage ?? []) {
    const key = row.Message ?? row.Playlist;
    minutesPlayed[key] ??= 0;
    minutesPlayed[key] += +row["Total Seconds Played"] / 60;
  }

  chart1.data.datasets = [
    {
      label: "Minutes Played",
      // @ts-ignore
      data: Object.values(minutesPlayed).map((v) => v.toFixed(1)),
    },
  ];
  chart1.update();

  // Completions graph
  const completions: Record<string, number> = {};
  for (const row of store.summaries?.usage ?? []) {
    const key = row.Message ?? row.Playlist;
    completions[key] ??= 0;
    completions[key] += +row["Total Completions"];
  }

  chart2.data.datasets = [
    {
      label: "Total Completions",
      data: Object.values(completions),
    },
  ];
  chart2.update();

  // partial play
  const partialPlays: Record<
    string,
    { completions: number; 3_4: number; 1_2: number; 1_4: number; starts: number }
  > = {};
  for (const row of store.summaries.usage) {
    const key = row.Message ?? row.Playlist;
    partialPlays[key] ??= { completions: 0, 14: 0, "34": 0, "12": 0, starts: 0 };
    partialPlays[key].completions += +row["Total Completions"];
    partialPlays[key]["14"] += +row["Total 1/4 Plays"] / 60;
    partialPlays[key]["12"] += +row["Total 1/2 Plays"] / 60;
    partialPlays[key]["34"] += +row["Total 3/4 Plays"] / 60;
    partialPlays[key].starts += +row["Total Starts"] / 60;
  }

  const keys = Object.keys(minutesPlayed);
  chart3.data.datasets = [
    {
      label: "Total Completions",
      data: keys.map((k) => partialPlays[k].completions),
      // backgroundColor: ["rgba(255, 99, 132, 0.2)"],
    },
    {
      label: "Total 3/4 Plays",
      data: keys.map((k) => partialPlays[k]["34"]),
      // backgroundColor: ["rgba(153, 102, 255, 0.2)"],
    },

    {
      label: "Total 1/2 Plays",
      data: keys.map((k) => partialPlays[k]["12"]),
      // backgroundColor: ["yellow"],
    },
    {
      label: "Total 1/4 Plays",
      data: keys.map((k) => partialPlays[k]["14"]),
      // backgroundColor: ["rgba(255, 205, 86, 0.2)"],
    },

    {
      label: "Total Start",
      data: keys.map((k) => partialPlays[k].starts),
    },
  ];
  chart3.update();

  chart4.data.datasets = [
    {
      label: "Message Completions per TB",
      data: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => +(+d["Total Completions"] / d["tbs"]).toFixed(1)
      ),
    },
  ];
  chart4.update();

  chart5.data.datasets = [
    {
      label: "Message Completions per TB",
      data: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => +(+d["Total Seconds Played"] / 60 / d["tbs"]).toFixed(1)
      ),
    },
  ];
  chart5.update();

  chart6.data.datasets = [
    {
      label: "Total Completions",
      data: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => +(+d["Total Completions"] / d["tbs"]).toFixed(1)
      ), // backgroundColor: ["rgba(255, 99, 132, 0.2)"],
    },
    {
      label: "Total 3/4 Plays",
      data: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => +(+d["Total 3/4 Plays"] / d["tbs"]).toFixed(1)
      ),
    },

    {
      label: "Total 1/2 Plays",
      data: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => +(+d["Total 1/2 Plays"] / d["tbs"]).toFixed(1)
      ),
    },
    {
      label: "Total 1/4 Plays",
      data: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => +(+d["Total 1/4 Plays"] / d["tbs"]).toFixed(1)
      ),
    },

    {
      label: "Total Start",
      data: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => +(+d["Total Starts"] / d["tbs"]).toFixed(1)
      ),
    },
  ];
  chart6.update();
}

async function createCharts() {
  // Minute Played
  const minutesPlayed: Record<string, number> = {};
  console.log(store.summaries?.usage);
  for (const row of store.summaries?.usage ?? []) {
    const key = row.Message ?? row.Playlist;
    minutesPlayed[key] ??= 0;
    minutesPlayed[key] += +row["Total Seconds Played"] / 60;
  }

  // @ts-ignore
  chart1 = new Chart(document.getElementById("minutes-played"), {
    type: "bar",
    data: {
      labels: Object.keys(minutesPlayed),
      datasets: [
        {
          label: "Minutes Played",
          data: Object.values(minutesPlayed).map((v) => v.toFixed(1)),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      plugins: {
        ...baseChartConfig.plugins,
        title: {
          display: true,
          text: "Minutes Played",
        },
      },
    },
  });

  // Completions graph
  const completions: Record<string, number> = {};
  for (const row of store.summaries?.usage ?? []) {
    const key = row.Message ?? row.Playlist;
    completions[key] ??= 0;
    completions[key] += +row["Total Completions"];
  }

  // console.log(completions);
  // @ts-ignore
  chart2 = new Chart(document.getElementById("completions"), {
    type: "bar",
    data: {
      labels: Object.keys(completions),
      datasets: [
        {
          label: "Total Completions",
          data: Object.values(completions),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      plugins: {
        ...baseChartConfig.plugins,
        title: {
          display: true,
          text: "Message Completions",
          font: { weight: "bold" },
        },
      },
    },
  });

  // partial play
  const partialPlays: Record<
    string,
    { completions: number; 3_4: number; 1_2: number; 1_4: number; starts: number }
  > = {};
  for (const row of store.summaries.usage) {
    const key = row.Message ?? row.Playlist;
    partialPlays[key] ??= { completions: 0, 14: 0, "34": 0, "12": 0, starts: 0 };
    partialPlays[key].completions += +row["Total Completions"];
    partialPlays[key]["14"] += +row["Total 1/4 Plays"] / 60;
    partialPlays[key]["12"] += +row["Total 1/2 Plays"] / 60;
    partialPlays[key]["34"] += +row["Total 3/4 Plays"] / 60;
    partialPlays[key].starts += +row["Total Starts"] / 60;
  }

  const keys = Object.keys(minutesPlayed);
  // @ts-ignore
  chart3 = new Chart(document.getElementById("partial-plays"), {
    type: "bar",

    data: {
      labels: keys,
      datasets: [
        {
          label: "Total Completions",
          data: keys.map((k) => partialPlays[k].completions),
          // backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        },
        {
          label: "Total 3/4 Plays",
          data: keys.map((k) => partialPlays[k]["34"]),
          // backgroundColor: ["rgba(153, 102, 255, 0.2)"],
        },

        {
          label: "Total 1/2 Plays",
          data: keys.map((k) => partialPlays[k]["12"]),
          // backgroundColor: ["yellow"],
        },
        {
          label: "Total 1/4 Plays",
          data: keys.map((k) => partialPlays[k]["14"]),
          // backgroundColor: ["rgba(255, 205, 86, 0.2)"],
        },

        {
          label: "Total Start",
          data: keys.map((k) => partialPlays[k].starts),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        ...baseChartConfig.plugins,
        datalabels: { display: false },
        title: {
          display: true,
          text: "Message Partial Plays",
        },
      },
    },
  });

  console.log(
    store.summaries.usage.flatMap(
      (d: SummaryDataItem) => +(+d["Total Completions"] / d["tbs"]).toFixed(1)
    )
  );
  // @ts-ignore
  chart4 = new Chart(document.getElementById("completions-per-tb"), {
    type: "bar",
    data: {
      labels: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => d.Message ?? d.Playlist
      ),
      datasets: [
        {
          label: "Message Completions per TB",
          data: store.summaries.usage.flatMap(
            (d: SummaryDataItem) => +(+d["Total Completions"] / d["tbs"]).toFixed(1)
          ),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      plugins: {
        ...baseChartConfig.plugins,
        title: {
          display: true,
          text: "Message Completions per TB",
        },
      },
    },
  });

  // @ts-ignore
  chart5 = new Chart(document.getElementById("minutes-per-tb"), {
    type: "bar",
    data: {
      labels: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => d.Message ?? d.Playlist
      ),
      datasets: [
        {
          label: "Message Completions per TB",
          data: store.summaries.usage.flatMap(
            (d: SummaryDataItem) =>
              +(+d["Total Seconds Played"] / 60 / d["tbs"]).toFixed(1)
          ),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      plugins: {
        ...baseChartConfig.plugins,
        title: {
          display: true,
          text: "Minute Played Per TB",
        },
      },
    },
  });

  // @ts-ignore
  chart6 = new Chart(document.getElementById("partial-plays-per-tb"), {
    type: "bar",
    data: {
      labels: store.summaries.usage.flatMap(
        (d: SummaryDataItem) => d.Message ?? d.Playlist
      ),
      datasets: [
        {
          label: "Total Completions",
          data: store.summaries.usage.flatMap(
            (d: SummaryDataItem) => +(+d["Total Completions"] / d["tbs"]).toFixed(1)
          ), // backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        },
        {
          label: "Total 3/4 Plays",
          data: store.summaries.usage.flatMap(
            (d: SummaryDataItem) => +(+d["Total 3/4 Plays"] / d["tbs"]).toFixed(1)
          ),
        },

        {
          label: "Total 1/2 Plays",
          data: store.summaries.usage.flatMap(
            (d: SummaryDataItem) => +(+d["Total 1/2 Plays"] / d["tbs"]).toFixed(1)
          ),
        },
        {
          label: "Total 1/4 Plays",
          data: store.summaries.usage.flatMap(
            (d: SummaryDataItem) => +(+d["Total 1/4 Plays"] / d["tbs"]).toFixed(1)
          ),
        },

        {
          label: "Total Start",
          data: store.summaries.usage.flatMap(
            (d: SummaryDataItem) => +(+d["Total Starts"] / d["tbs"]).toFixed(1)
          ),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        ...baseChartConfig.plugins,
        datalabels: { display: false },
        title: {
          display: true,
          text: "Partial Plays by Message per TB",
        },
      },
    },
  });
}

async function fetchData() {
  const data = await store.getDashboardSummaries();
  // stats.value = data[0];
  console.log(data[0]);

  createCharts();
}

onMounted(() => {
  fetchData();

  // Download spec
  useRequest(useProgramSpecStore().downloadSpec, {
    defaultParams: [
      useAppStore().activeProgram.data?.program_id ??
        JSON.parse(localStorage.getItem(LocalStorageKeys.active_program) ?? "{}").id,
    ],
    onSuccess: (data) => {
      useProgramSpecStore().setSpec({
        programId: useAppStore().activeProgram.data.program_id,
        programspec: data[0],
      });
    },
  });
});
</script>

<template>
  <Spin :spinning="store.loading">
    <!-- <Tabs v-model:activeKey="activeKey" size="large" centered>
      <TabPane key="home" tab="Home">
        <div v-if="!store.loading && store.summaries != null">
          <UsageMap
            :data="store.summaries.map?.data"
            :centroid="store.summaries.map?.centroid"
          ></UsageMap>
        </div>
      </TabPane>
      <TabPane key="content" tab="Content">
        <div v-if="!store.loading && store.summaries != null">
          <Content :data="store.summaries.content"></Content>
        </div>
      </TabPane>
      <TabPane key="operations" tab="Operations">
        <div v-if="!store.loading && store.summaries != null">
          <Operations :data="store.summaries.operations"></Operations>
        </div>
      </TabPane>
      <TabPane key="ov-usage" tab="Usage (Overall)">
        <div v-if="!store.loading && store.summaries != null">
          <OverallUsage :data="store.summaries.usage"></OverallUsage>
        </div>
      </TabPane>
      <TabPane key="usage-per-tb" tab="Usage (Avg TB)">
        <div v-if="!store.loading && store.summaries != null">
          <UsagePerTB
            :data="store.summaries.usage"
            :tbs="+store.summaries.tbs"
          ></UsagePerTB>
        </div>
      </TabPane>
    </Tabs> -->

    <div class="responsive-container">
      <Filters @change="updateCharts()" />
      <Divider class="my-4 md:my-6" />

      <!-- Stats Cards - Responsive Grid -->
      <div class="stats-grid">
        <div v-for="stat in [
          { title: 'Talking Books in Project', value: store.summaries?.tbs?.project_tbs || 0 },
          { title: 'Talking Books Installed', value: store.summaries?.tbs?.installed || 0 },
          { title: 'Talking Books Reporting Statistics', value: store.summaries?.tbs?.reporting_stats || 0 },
          { title: 'Number of Messages', value: store.summaries?.tbs?.total_messages || 0 },
          { title: 'Total Minutes Played', value: (+store.summaries?.tbs?.minutes_played)?.toLocaleString() || 0 }
        ]" :key="stat.title" class="stat-card">
          <dl>
            <dt>{{ stat.title }}</dt>
            <dd>{{ stat.value }}</dd>
          </dl>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Full-width charts -->
        <div class="chart-container full-width">
          <canvas id="minutes-played"></canvas>
        </div>

        <!-- Map Section -->
        <div v-if="!store.loading && store.summaries != null" class="chart-container full-width">
          <UsageMap
            :data="store.summaries.map?.data"
            :centroid="store.summaries.map?.centroid"
          />
        </div>

        <!-- Paired charts -->
        <template v-for="(pair, index) in [
          ['completions', 'partial-plays'],
          ['completions-per-tb', 'minutes-per-tb']
        ]" :key="index">
          <div class="chart-pair">
            <div class="chart-container">
              <canvas :id="pair[0]"></canvas>
            </div>
            <div class="chart-container">
              <canvas :id="pair[1]"></canvas>
            </div>
          </div>
        </template>

        <!-- Final full-width chart -->
        <div class="chart-container full-width">
          <canvas id="partial-plays-per-tb"></canvas>
        </div>
      </div>

      <!-- Tabs Section -->
      <Tabs class="responsive-tabs" size="large" centered>
        <TabPane key="content" tab="Content">
          <div v-if="!store.loading && store.summaries != null">
            <Content :data="store.summaries.content" />
          </div>
        </TabPane>
        <TabPane key="operations" tab="Operations">
          <div v-if="!store.loading && store.summaries != null">
            <Operations :data="store.summaries.operations" />
          </div>
        </TabPane>
      </Tabs>
    </div>
  </Spin>
</template>

<style scoped>
/* Base responsive container */
.responsive-container {
  padding: 1rem;
  max-width: 1800px;
  margin: 0 auto;
}

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
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

/* Charts grid system */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.chart-container {
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.full-width {
  grid-column: 1 / -1;
}

.chart-pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .responsive-container {
    padding: 1.5rem;
  }

  .chart-pair {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-container {
    padding: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* Canvas sizing */
canvas {
  width: 100%;
  height: 400px;
}

/* Tabs styling */
.responsive-tabs {
  margin-top: 2rem;
}
</style>
