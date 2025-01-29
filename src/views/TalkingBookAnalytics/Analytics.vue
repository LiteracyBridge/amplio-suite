<script setup lang="ts">
import { TabPane, Col, Statistic, Tabs, Row, Spin } from "ant-design-vue";
import { onMounted, ref } from "vue";
import UsageMap from "./components/UsageMap.vue";
import Content from "./components/Content.vue";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import { groupBy } from "lodash";

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
    <Tabs v-model:activeKey="activeKey" size="large">
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
      <TabPane key="3" tab="Tab 3">Content of tab 3</TabPane>
    </Tabs>
  </Spin>
</template>
