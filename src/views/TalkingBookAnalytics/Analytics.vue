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

const activeKey = ref("home");
const store = useTalkingBookAnalyticStore();
// const stats = ref<Record<string, any>>(null);

async function fetchData() {
  const data = await store.getDashboardSummaries();
  // stats.value = data[0];
  console.log(data[0]);

  // Minute Played
  const minutesPlayed: Record<string, number> = {};
  console.log(store.summaries?.usage);
  for (const row of store.summaries?.usage ?? []) {
    const key = row.Message ?? row.Playlist;
    minutesPlayed[key] ??= 0;
    minutesPlayed[key] += +row["Total Seconds Played"] / 60;
  }

  // @ts-ignore
  new Chart(document.getElementById("minutes-played"), {
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
  new Chart(document.getElementById("completions"), {
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
  new Chart(document.getElementById("partial-plays"), {
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
  new Chart(document.getElementById("completions-per-tb"), {
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
  new Chart(document.getElementById("minutes-per-tb"), {
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
  new Chart(document.getElementById("partial-plays-per-tb"), {
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

onMounted(() => {
  fetchData();
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

    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Filters></Filters>
      <Divider></Divider>

      <div class="w-full flex justify-evenly">
        <div class="mx-auto lg:pb-2">
          <div class="grid grid-cols-6 gap-4 sm:grid-cols-12 mt-4">
            <div class="bg-white overflow-hidden shadow sm:rounded-lg col-span-2">
              <div class="px-4 sm:p-6">
                <dl>
                  <dt class="text-sm leading-5 font-bold">Talking Books in Project</dt>
                  <dd class="mt-1 text-3xl leading-9 font-semibold text-amplio-green">
                    {{ store.summaries?.tbs?.project_tbs || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
            <div class="bg-white overflow-hidden shadow sm:rounded-lg col-span-2">
              <div class="px-4 sm:p-6">
                <dl>
                  <dt class="text-sm leading-5 font-bold">Talking Books Installed</dt>
                  <dd class="mt-1 text-3xl leading-9 font-semibold text-amplio-green">
                    {{ store.summaries?.tbs?.installed || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
            <div class="bg-white overflow-hidden shadow sm:rounded-lg col-span-3">
              <div class="px-4 sm:p-6">
                <dl>
                  <dt class="text-sm leading-5 font-bold">
                    Talking Books Reporting Statistics
                  </dt>
                  <dd class="mt-1 text-3xl leading-9 font-semibold text-amplio-green">
                    {{ store.summaries?.tbs?.reporting_stats || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
            <div class="bg-white overflow-hidden shadow sm:rounded-lg col-span-2">
              <div class="px-4 py-5 sm:p-6">
                <dl>
                  <dt class="text-sm leading-5 font-bold">Number of Messages</dt>
                  <dd class="mt-1 text-3xl leading-9 font-semibold text-amplio-green">
                    {{ store.summaries?.tbs?.total_messages || 0 }}
                  </dd>
                </dl>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow sm:rounded-lg col-span-3">
              <div class="px-4 sm:p-6">
                <dl>
                  <dt class="text-sm leading-5 font-bold">Total Minutes Played</dt>
                  <dd class="mt-1 text-3xl leading-9 font-semibold text-amplio-green">
                    {{ (+store.summaries?.tbs?.minutes_played)?.toLocaleString() || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div
          class="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12"
        >
          <canvas id="minutes-played" class="max-h-104"></canvas>
        </div>

        <!-- ====== Chart One Start -->
        <!-- <include src="./partials/chart-01.html" /> -->
        <!-- ====== Chart One End -->

        <!-- ====== Chart Two Start -->
        <!-- <include src="./partials/chart-02.html" /> -->
        <!-- ====== Chart Two End -->

        <!-- ====== Chart Three Start -->
        <!-- <include src="./partials/chart-03.html" /> -->
        <!-- ====== Chart Three End -->

        <!-- ====== Map One Start -->

        <div
          v-if="!store.loading && store.summaries != null"
          class="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12"
        >
          <UsageMap
            :data="store.summaries.map?.data"
            :centroid="store.summaries.map?.centroid"
          ></UsageMap>
        </div>

        <div
          class="col-span-12 rounded-sm border border-stroke bg-white px-3 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3 xl:col-span-6"
        >
          <canvas id="completions" class="max-h-104"></canvas>
        </div>

        <div
          class="col-span-12 rounded-sm border border-stroke bg-white px-3 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3 xl:col-span-6"
        >
          <canvas id="partial-plays" class="max-h-104"></canvas>
        </div>

        <div
          class="col-span-12 rounded-sm border border-stroke bg-white px-3 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3 xl:col-span-6"
        >
          <canvas id="completions-per-tb" class="max-h-104"></canvas>
        </div>

        <div
          class="col-span-12 rounded-sm border border-stroke bg-white px-3 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3 xl:col-span-6"
        >
          <canvas id="minutes-per-tb" class="max-h-104"></canvas>
        </div>

        <div
          class="col-span-12 rounded-sm border border-stroke bg-white px-3 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3 xl:col-span-12"
        >
          <canvas id="partial-plays-per-tb" class="max-h-104"></canvas>
        </div>
      </div>
      <!-- <include src="./partials/map-01.html" /> -->
      <!-- ====== Map One End -->

      <!-- ====== Table One Start -->
      <Tabs size="large" centered>
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
      </Tabs>
      <!-- <div class="col-span-12 xl:col-span-8">
          <include src="./partials/table-01.html" />
        </div> -->
      <!-- ====== Table One End -->

      <!-- </div> -->
    </div>
  </Spin>
</template>
