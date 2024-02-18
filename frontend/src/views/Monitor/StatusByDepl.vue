<template>
  <Table :columns="columns" :data-source="tableData" :loading="loading"> <!--@change="handleTableChange"-->
    <template #title>
      <div class="flex justify-between">
      <TypographyTitle :level="5"> Talking Book Deployment Activity </TypographyTitle>

        <Button type="primary" @click="fetchData('ByDepl')" :ghost="true">
          <ReloadOutlined /> Refresh Data
        </Button>
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'deploymentnumber'">
        {{ record.deploymentnumber }}
      </template>

      <template v-if="column.key === 'earliest'">
        {{ record.earliest }}
      </template>

      <template v-if="column.key === 'latest'">
        {{ record.latest }}
      </template>

      <template v-if="column.key === 'deployed'">
        {{ record.deployed }}
      </template>

      <template v-if="column.key === 'collected'">
        {{ record.collected }}
      </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRequest } from "vue-request";
import { useProgramsStore } from "@/store/programs";
import { Table, TypographyTitle, Button } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import { computed } from "vue";
import type { TableProps } from "ant-design-vue";
import { usePagination } from 'vue-request';
import axios from 'axios';

const store = useTalkingBookAnalyticStore();

const columns = [
  {
    title: "Deployment",
    key: "deploymentnumber",
  },
  {
    title: "Earliest",
    key: "earliest",
    sorter: true,
    width: '20%',
  },
  {
    title: "Latest",
    key: "latest",
    sorter: true,
    width: '20%',
  },
  {
    title: "# TBs Instaled",
    key: "deployed",
  },
  {
    title: "# TBs reporting data",
    key: "collected",
  },
];

const { loading, data: tableData, run: fetchData } = useRequest(store.getTbStatusBy, {
  defaultParams: ["ByDepl"],
});
</script>
