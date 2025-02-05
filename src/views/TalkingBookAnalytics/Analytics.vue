<script setup lang="ts">
import { TabPane, Col, Statistic, Tabs, Row, Spin } from "ant-design-vue";
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
const stats = ref<Record<string, any>>(null);

async function fetchData() {
  const data = await store.summaries();
  stats.value = data[0];
  console.log(data[0]);
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <Spin :spinning="store.loading">
    <Tabs v-model:activeKey="activeKey" size="large" centered>
      <TabPane key="home" tab="Home">
        <Row :justify="'space-around'">
          <Col :span="12">
            <Statistic
              title="Number of Talking Books in Project"
              :value="112893"
              size="large"
            />
          </Col>
          <Col :span="12">
            <Statistic title="Total Minutes Played" :value="112893" />
          </Col>
        </Row>

        <div v-if="!store.loading && stats != null">
          <UsageMap :data="stats.map?.data" :centroid="stats.map?.centroid"></UsageMap>
        </div>
      </TabPane>
      <TabPane key="content" tab="Content">
        <div v-if="!store.loading && stats != null">
          <Content :data="stats.content"></Content>
        </div>
      </TabPane>
      <TabPane key="operations" tab="Operations">
        <div v-if="!store.loading && stats != null">
          <Operations :data="stats.operations"></Operations>
        </div>
      </TabPane>
      <TabPane key="ov-usage" tab="Usage (Overall)">
        <div v-if="!store.loading && stats != null">
          <OverallUsage :data="stats.usage"></OverallUsage>
        </div>
      </TabPane>
      <TabPane key="usage-per-tb" tab="Usage (Avg TB)">
        <div v-if="!store.loading && stats != null">
          <UsagePerTB :data="stats.usage" :tbs="+stats.tbs"></UsagePerTB>
        </div>
      </TabPane>
    </Tabs>
  </Spin>
</template>
