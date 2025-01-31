<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Table, Card, Row, Col, Tabs, TabPane } from "ant-design-vue";
import type { TableColumnType } from "ant-design-vue";
import { countBy, groupBy, sumBy } from "lodash";
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
} from "chart.js";

Chart.register(
  LineController,
  BarController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarElement,
  Colors
);

interface DataItem {
  TB: string;
  Agent: string;
  "Deployment #": string;
  Region: string;
  District: string;
  Community: string;
  Message: string;
  Language: string;
  Format: string;
  Variant: string;
  Playlist: string;
  Position: string;
  Duration: number;
  "Total Starts": string;
  "Total 1/4 Plays": string;
  "Total 1/2 Plays": string;
  "Total 3/4 Plays": string;
  "Total Completions": number;
  "Total Seconds Played": number;
  "Total Plays": string;
}

const props = defineProps<{
  data: Array<DataItem>;
}>();

const rowSpans: { [tb: string]: boolean } = {};

onMounted(() => {
  // Completions graph
  const completions: Record<string, number> = {};
  for (const row of props.data) {
    const key = row.Message ?? row.Playlist;
    completions[key] ??= 0;
    completions[key] += +row["Total Completions"];
  }

  console.log(completions);
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
      indexAxis: "y",
      elements: {
        bar: {
          borderWidth: 2,
          categoryPercentage: 1.0,
        },
      },

      responsive: true,
      scrollbar: { enabled: true },
      maintainAspectRatio: true,
      scales: {
        y: {
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Completions",
        },
      },
    },
  });

  // Minute Played
  const minutesPlayed: Record<string, number> = {};
  for (const row of props.data) {
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
          data: Object.values(minutesPlayed),
        },
      ],
    },
    options: {
      indexAxis: "y",
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      scrollbar: { enabled: true },
      maintainAspectRatio: true,
      scales: {
        x: {
        },
        y: {
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Minutes Played",
        },
      },
    },
  });

  // @ts-ignore
  new Chart(document.getElementById("partial-plays"), {
    type: "bar",
    data: {
      labels: Object.keys(minutesPlayed),
      datasets: [
        {
          label: "Minutes Played",
          data: Object.values(minutesPlayed),
        },
      ],
    },
    options: {
      indexAxis: "y",
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      scrollbar: { enabled: true },
      maintainAspectRatio: true,
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
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Minutes Played",
        },
      },
    },
  });
});
</script>

<template>
  <!-- <Row>
    <Col>
      <Card title="Completions">
        <canvas id="completions"></canvas>
      </Card>
    </Col>
  </Row> -->
  <div class="grid grid-flow-row-dense grid-cols-2 grid-rows-2">
    <div>
      <canvas id="completions"></canvas>
    </div>

    <div>
      <canvas id="minutes-played"></canvas>
    </div>
  </div>
  <!-- <Tabs size="large" centered tab-position="left">
    <TabPane key="home" tab="Home">
      <canvas
        id="completions"
        style="position: relative; height: 40vh; width: 80vw"
      ></canvas>
    </TabPane>
    <TabPane key="homde" tab="Home">
</TabPane>
  </Tabs> -->
</template>

<style scoped>
.chartWrapper {
  position: relative;
}

.chartWrapper > canvas {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

.chartAreaWrapper {
  width: 15000px;
  overflow-x: scroll;
}
</style>
