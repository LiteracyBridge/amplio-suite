<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Table, Card, Row, Col, Tabs, TabPane } from "ant-design-vue";
import { Chart } from "chart.js";
import { baseChartConfig, type DataItem } from "./chart_config";
import Filters from "./Filters.vue";


const props = defineProps<{
  data: Array<DataItem>;
  tbs: number;
}>();

onMounted(() => {
  // @ts-ignore
  new Chart(document.getElementById("completions-per-tb"), {
    type: "bar",
    data: {
      labels: props.data.flatMap((d) => d.Message ?? d.Playlist),
      datasets: [
        {
          label: "Message Completions per TB",
          data: props.data.flatMap(
            (d) => +(+d["Total Completions"] / d["tbs"]).toFixed(1)
          ),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      plugins: {
        legend: {
          position: "right",
          display: true,
        },
        title: {
          display: true,
          text: "Message Completions per TB",
        },
        datalabels: {
          anchor: "center",
          align: "end",
          font: {
            weight: "bold",
          },
        },
      },
    },
  });

  // @ts-ignore
  new Chart(document.getElementById("minutes-per-tb"), {
    type: "bar",
    data: {
      labels: props.data.flatMap((d) => d.Message ?? d.Playlist),
      datasets: [
        {
          label: "Message Completions per TB",
          data: props.data.flatMap(
            (d) => +(+d["Total Seconds Played"] / 60 / d["tbs"]).toFixed(1)
          ),
        },
      ],
    },
    options: {
      ...baseChartConfig,
      plugins: {
        legend: {
          position: "right",
          display: true,
        },
        title: {
          display: true,
          text: "Minute Played Per TB",
        },
        datalabels: {
          anchor: "center",
          align: "end",
          font: {
            weight: "bold",
          },
          formatter: (value: any, _context: any) => {
            return value;
          },
        },
      },
    },
  });

  // @ts-ignore
  new Chart(document.getElementById("partial-plays-per-tb"), {
    type: "bar",
    data: {
      labels: props.data.flatMap((d) => d.Message ?? d.Playlist),
      datasets: [
        {
          label: "Total Completions",
          data: props.data.flatMap(
            (d) => +(+d["Total Completions"] / d["tbs"]).toFixed(1)
          ), // backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        },
        {
          label: "Total 3/4 Plays",
          data: props.data.flatMap((d) => +(+d["Total 3/4 Plays"] / d["tbs"]).toFixed(1)),
        },

        {
          label: "Total 1/2 Plays",
          data: props.data.flatMap((d) => +(+d["Total 1/2 Plays"] / d["tbs"]).toFixed(1)),
        },
        {
          label: "Total 1/4 Plays",
          data: props.data.flatMap((d) => +(+d["Total 1/4 Plays"] / d["tbs"]).toFixed(1)),
        },

        {
          label: "Total Start",
          data: props.data.flatMap((d) => +(+d["Total Starts"] / d["tbs"]).toFixed(1)),
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
        datalabels: { display: false },
        legend: {
          position: "right",
          display: true,
          labels: {
            color: "rgb(255, 99, 132)",
          },
        },
        tooltip: {
          // callbacks: {
          //   label: (context) => {
          //     console.log(context);
          //     // console.log(context.dataset.label)
          //     const record = props.data.find(
          //       (i) => i.Message === context.label || i.Playlist === context.label
          //     );
          //     console.log(record);
          //     let label = context.dataset.label || "";
          //     label += `Message: ${record.Message}\n`;
          //     label += `Playlist: ${record.Playlist}\n`;
          //     // if (label) {
          //     //   label += ": ";
          //     // }
          //     // if (context.parsed.y !== null) {
          //     //   label += new Intl.NumberFormat("en-US", {
          //     //     style: "currency",
          //     //     currency: "USD",
          //     //   }).format(context.parsed.y);
          //     // }
          //     return [label,'',`Total Plays: ${record.Playlist}\n`, `Minutes Played: ${record.Playlist}\n`];
          //   },
          // },
        },
        title: {
          display: true,
          text: "Partial Plays by Message per TB",
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
  <Filters></Filters>
  <div class="grid grid-flow-row-dense grid-cols-1 grid-rows-1">
    <Card class="mb-3" title="Message Completions per TB">
      <canvas id="completions-per-tb"></canvas>
    </Card>
    <Card class="mb-3" title="Minute Played Per TB">
      <canvas id="minutes-per-tb"></canvas>
    </Card>
    <Card class="mb-3" title="Partial Plays by Message per TB">
      <canvas id="partial-plays-per-tb"></canvas>
    </Card>

    <!-- <div>
      <canvas id="minutes-played"></canvas>
    </div>
    <div>
      <canvas id="partial-plays"></canvas>
    </div> -->
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

<style scoped></style>
