<template>
  <Table :columns="columns" :data-source="tableData" :loading="loading">
    <template #title>
      <div class="flex justify-between">
        <TypographyTitle :level="5">
          Talking Book Stats & UF Collection Activity
        </TypographyTitle>

        <Button type="primary" @click="fetchData('ByTb')" :ghost="true">
          <ReloadOutlined /> Refresh Data
        </Button>
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'recipient'">
        {{ record.recipient }}
      </template>

      <template v-if="column.key === 'talkingbookid'">
        {{ record.talkingbookid }}
      </template>

      <template v-if="column.key === 'deployment_num'">
        {{ record.deployment_num }}
      </template>

      <template v-if="column.key === 'deployment_time'">
        {{ record.deployment_time }}
      </template>

      <template v-if="column.key === 'deployment_user'">
        {{ record.deployment_user }}
      </template>

      <template v-if="column.key === 'collection_time'">
        {{ record.collection_time }}
      </template>

      <template v-if="column.key === 'collection_user'">
        {{ record.collection_user }}
      </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRequest } from "vue-request";
import { Table, TypographyTitle, Button } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";

const store = useTalkingBookAnalyticStore();

const tableData = ref([]);
const columns = [
  { title: "Recipient", key: "recipient" },
  { title: "TB ID", key: "talkingbookid" },
  { title: "Current Content Deployment", key: "deployment_num" },
  { title: "Date of Last Content Update", key: "deployment_time" },
  { title: "User", key: "deployment_user" },
  { title: "Date of Last Data Collection", key: "collection_time" },
  { title: "User", key: "collection_user" },
];

const { loading, run: fetchData } = useRequest(store.getTbStatusBy, {
  defaultParams: ["ByTb"],
  onSuccess: (data) => {
    loading.value = true;

    // Find which recipient columns have multiple values.
    const needed: any[] = [];
    ["region", "district", "communityname", "groupname", "agent", "language"].forEach(
      (col) => {
        let v = data[0][col];
        if (data.some((row) => row[col] !== v)) {
          needed.push(col);
        }
      }
    );
    data.forEach((row) => {
      let values = needed.map((col) => row[col] || "-");
      row.recipient = values.join("/");
    });

    tableData.value = data;
    loading.value = false;
  },
});
</script>
