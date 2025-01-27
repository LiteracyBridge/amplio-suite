<script setup lang="ts">
import { TabPane, Tabs } from "ant-design-vue";
import { ref } from "vue";
import Analytics from './TalkingBookAnalytics/Analytics.vue'

const activeKey = ref("home");
</script>

<template>
  <Analytics></Analytics>
  <!-- <Tabs v-model:activeKey="activeKey" :size="large">
    <TabPane key="home" tab="Home">Content of tab 1</TabPane>
    <TabPane key="2" tab="Tab 2">Content of tab 2</TabPane>
    <TabPane key="3" tab="Tab 3">Content of tab 3</TabPane>
  </Tabs> -->
</template>
