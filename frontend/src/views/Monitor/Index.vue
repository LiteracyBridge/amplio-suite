<template>
  <PageHeader
    title="Talking Book Monitoring Center"
    sub-title="View progress of deployments in the Monitoring Center."
  >
    <template #footer>
      <Tabs v-model:activeKey="activeKey" centered size="large">
        <TabPane key="deployments" tab="Deployments Status">
          <StatusByDepl :program-id="store.programCode"></StatusByDepl>
        </TabPane>

        <TabPane key="collections" tab="Collections Status">
          <StatusByTb :program-id="store.programCode"></StatusByTb>
        </TabPane>
      </Tabs>
    </template>
  </PageHeader>

</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { PageHeader, TabPane, Tabs } from "ant-design-vue";
import { ref } from "vue";
import StatusByDepl from "./StatusByDepl.vue";
import StatusByTb from "./StatusByTb.vue";


const store = useAppStore();

const activeKey = ref("deployments");
</script>
