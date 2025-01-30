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
  "Total Completions": string;
  "Total Plays": string;
}

const props = defineProps<{
  data: Array<DataItem>;
}>();

const rowSpans: { [tb: string]: boolean } = {};

onMounted(() => {
  // Completions graph
  // @ts-ignore
  new Chart(document.getElementById("completions"), {
    type: "bar",
    data: {
      labels: props.data.map((row) => row.Message),
      datasets: [
        {
          label: "Total Completions",
          data: props.data.map((row) => row["Total Completions"]),
        },
      ],
    },
    // options: {
    //   indexAxis: "y",
    // },
    options: {
      indexAxis: "y",
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 2,
          categoryPercentage: 1.0,
          // inflateAmount: 10,
        },
      },

      responsive: true,
      scrollbar: { enabled: true },
      maintainAspectRatio: true,
      scales: {
        // xAxis: [
        //   {
        //     ticks: {
        //       padding: 20,
        //     },
        //   },
        // ],
        // r: {
        //     ticks: {
        //       backdropPadding: {
        //           x: 10,
        //           y: 4
        //       }
        //     }
        //   }
      },
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: false,
          text: "Completions",
        },
      },
    },
  });
  // @ts-ignore
  new Chart(document.getElementById("completions2"), {
    type: "bar",
    data: {
      labels: props.data.map((row) => row.Message),
      datasets: [
        {
          label: "Total Completions",
          data: props.data.map((row) => row["Total Completions"]),
        },
      ],
    },
    // options: {
    //   indexAxis: "y",
    // },
    options: {
      indexAxis: "y",
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 2,
          categoryPercentage: 1.0,
          // inflateAmount: 10,
        },
      },

      responsive: true,
      scrollbar: { enabled: true },
      maintainAspectRatio: true,
      scales: {
        // xAxis: [
        //   {
        //     ticks: {
        //       padding: 20,
        //     },
        //   },
        // ],
        // r: {
        //     ticks: {
        //       backdropPadding: {
        //           x: 10,
        //           y: 4
        //       }
        //     }
        //   }
      },
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: false,
          text: "Completions",
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
    <canvas
      id="completions"
    ></canvas>
  </div>

  <div>
    <canvas
      id="completions2"
    ></canvas>
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
