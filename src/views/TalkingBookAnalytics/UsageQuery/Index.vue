<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import {
  Table,
  PageHeader,
  Button,
  Dropdown,
  MenuItem,
  Menu,
  notification,
} from "ant-design-vue";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import { DownOutlined } from "@ant-design/icons-vue";
import QueryBuilder from "./QueryBuilder.vue";
import { Workbook } from "exceljs";
import { DateTime } from "luxon";

const store = useTalkingBookAnalyticStore();
const appStore = useAppStore();

const selectedDeployment = ref(undefined);
const query = ref<{ query: string; group: string }>(null);
const columns = ref([]);
const rows = ref<Record<string, any>[]>([]);
const deploymentDates = ref<string[]>([]);
const selectedDate = ref<string>();

const reports = [
  {
    key: "district-cat",
    title: "Usage by Playlist Category",
    query:
      'deploymentnumber AS "Deployment", category AS "Category", SUM(completions) AS "Completions", SUM(played_seconds) AS "Played Seconds"',
    group: "category,deploymentnumber",
  },
  {
    key: "district",
    title: "Usage by District",
    query: `deploymentnumber  AS "Deployment", district AS "District", SUM(completions) AS "Completions", SUM(played_seconds) AS "Played Seconds"`,
    group: "deploymentnumber,district",
  },
  {
    key: "msg",
    title: "Usage by Message",
    query: `deploymentnumber  AS "Deployment", title AS "Title", SUM(completions) AS "Completions", SUM(played_seconds) AS "Played Seconds"`,
    group: "deploymentnumber,title",
  },
  {
    key: "msg-in-district",
    title: "Usage by Message in District",
    query: `deploymentnumber  AS "Deployment", district AS "District", title AS "Title", SUM(completions) AS "Completions", SUM(played_seconds) AS "Played Seconds"`,
    group: "deploymentnumber,title,district",
  },
  {
    key: "lang-in-district",
    title: "Usage by Language in District",
    query: `deploymentnumber  AS "Deployment", district AS "District", language AS "Language", SUM(completions) AS "Completions", SUM(played_seconds) AS "Played Seconds"`,
    group: "deploymentnumber,district,language",
  },
  {
    key: "playlist-in-district",
    title: "Usage by Playlist in District",
    query: `deploymentnumber  AS "Deployment", district AS "District", category AS "Category", SUM(completions) AS "Completions", SUM(played_seconds) AS "Played Seconds"`,
    group: "deploymentnumber,district,category",
  },
  { key: "custom", title: "Custom Report", query: "" },
];
const modalVisible = ref(false);

async function fetchStats(q: string, group: string) {
  if (selectedDeployment.value == null) {
    return notification.error({
      message: "Error",
      description: "Please select a deployment to view",
    });
  }

  const results = await store.getUsage({
    deployment: selectedDeployment.value === "all" ? null : selectedDeployment.value,
    columns: q,
    group,
    date: selectedDate.value,
  });

  // Update table
  if (results.length === 0) return;

  columns.value = Object.keys(results[0]).map((k) => ({
    title: k,
    dataIndex: k,
    key: k,
  }));
  rows.value = results;
}

async function exportReport() {
  notification.info({
    message: "Downloading Usage Query",
  });

  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Report");
  sheet.columns = Object.keys(rows.value[0]).map((k) => ({
    header: k,
    key: k,
  }));
  sheet.addRows(rows.value);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `usage_query_report_${DateTime.now()
    .toLocaleString(DateTime.DATE_FULL)
    .replace(",", "_")}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);

  notification.success({
    description: "Usage query report exported successfully.",
    message: "Success",
  });
}

async function fetchTimestamps() {
  const d = selectedDeployment.value;
  store.getDeploymentDates(d === "all" ? null : d).then((resp) => {
    if (resp.length === 0) {
      deploymentDates.value = [];
      selectedDate.value = null;
    } else {
      deploymentDates.value = resp.flatMap((r) => DateTime.fromISO(r.date).toISODate());
    }
  });
}

async function onDeploymentChange() {
  fetchTimestamps();
  fetchStats(query.value.query, query.value.group);
}

onMounted(async () => {
  const rpt = reports.find((r) => r.key === "msg");

  selectedDeployment.value = "all";
  query.value = { query: rpt.query, group: rpt.group };

  fetchTimestamps();
  fetchStats(rpt.query, rpt.group);
});
</script>

<template>
  <PageHeader title="Usage Query" sub-title="">
    <template #extra>
      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem key="all" @click="selectedDeployment = 'all'">
              <span>All Deployments</span>
            </MenuItem>
            <MenuItem
              :key="d.deploymentnumber"
              v-for="(d, idx) in appStore.deployments"
              @click="
                selectedDeployment = d.deploymentnumber;
                onDeploymentChange();
              "
            >
              <span>#{{ idx + 1 }} {{ d.start_date }} - {{ d.end_date }}</span>
            </MenuItem>
          </Menu>
        </template>
        <Button>
          <span v-if="selectedDeployment == null">Choose Deployment</span>
          <span v-if="selectedDeployment == 'all'">All Deployments</span>
          <span v-else>Deployment {{ selectedDeployment }}</span>
          <DownOutlined />
        </Button>
      </Dropdown>

      <Dropdown v-if="deploymentDates.length > 0">
        <template #overlay>
          <Menu>
            <MenuItem
              key="all"
              @click="
                selectedDate = null;
                onDeploymentChange();
              "
            >
              <span>All Dates</span>
            </MenuItem>
            <MenuItem
              :key="t"
              v-for="t in deploymentDates"
              @click="
                selectedDate = t;
                onDeploymentChange();
              "
            >
              <span>{{ DateTime.fromISO(t).toLocaleString(DateTime.DATE_MED) }}</span>
            </MenuItem>
          </Menu>
        </template>
        <Button>
          <span v-if="selectedDate == null">Choose Deployment Date</span>
          <span v-else>{{ selectedDate }}</span>
          <DownOutlined />
        </Button>
      </Dropdown>

      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem
              :key="r.key"
              v-for="r in reports"
              @click="
                () => {
                  if (r.key == 'custom') {
                    modalVisible = true;
                  } else {
                    query = { query: r.query, group: r.group };
                    fetchStats(r.query, r.group);
                  }
                }
              "
            >
              <span> {{ r.title }}</span>
            </MenuItem>
          </Menu>
        </template>
        <Button>
          <span v-if="query == null">Choose Report</span>
          <span v-else>{{ reports.find((r) => r.query == query.query).title }}</span>
          <DownOutlined />
        </Button>
      </Dropdown>
    </template>
    <!--
    <Alert type="info" :closable="true" v-if="selectedDeployment != null">
      <template #message>
        You're viewing talking books installation for
        {{ selectedDeployment }} deployment. The Deployment has been installed to
        {{ summary.installed }} Talking Books in {{ summary.communities }} communities and
        {{ summary.groups }}
        groups.
      </template>
    </Alert> -->
  </PageHeader>

  <Table
    :columns="columns"
    :data-source="rows"
    size="small"
    :loading="store.loading"
    :sticky="true"
    :scroll="{ x: '70%' }"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    class="ant-table-striped"
  >
    <template #title>
      <Button :disabled="rows.length === 0" @click="exportReport()" ghost type="primary"
        >Download Report</Button
      >
    </template>
  </Table>

  <div v-if="modalVisible">
    <QueryBuilder
      :visible="modalVisible"
      @save="(q, g) => fetchStats(q, g)"
      @close="modalVisible = false"
    />
  </div>
</template>
