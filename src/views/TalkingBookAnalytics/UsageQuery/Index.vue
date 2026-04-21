<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import {
  Table,
  PageHeader,
  Button,
  Dropdown,
  MenuItem,
  Menu,
  SubMenu,
  notification,
  Select,
  SelectOption,
  RangePicker,
} from "ant-design-vue";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import { DownOutlined } from "@ant-design/icons-vue";
import QueryBuilder from "./QueryBuilder.vue";
import { Workbook } from "exceljs";
import { DateTime } from "luxon";
import dayjs from 'dayjs';
const store = useTalkingBookAnalyticStore();
const appStore = useAppStore();

const selectedDeployment = ref(undefined);
const query = ref<{ query: string; group: string }>(null);
const columns = ref([]);
const rows = ref<Record<string, any>[]>([]);
const selectedDate = ref<[dayjs.Dayjs, dayjs.Dayjs]>();
const selectedReportKey = ref<string>('msg');
const report = ref(false);
const data = ref({ headers: [], rows: [] });

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

  {
    key: "full-playtime-seconds",
    title: "Full playtime - seconds",
    query: `
    region AS "Region",
    district AS "District",
    communityname AS "Community",
    groupname AS "Group Name",
    title AS "Message Title",
    SUM(played_seconds) AS "Played Seconds",
    SUM(completions) AS "Completions"
  `,
    group: "region, district, communityname, groupname, title"
  },

  {
    key: "full-playtime-minutes",
    title: "Full playtime - Minutes",
    query: `
    region AS "Region",
    district AS "District",
    communityname AS "Community",
    groupname AS "Group Name",
    title AS "Message Title",
    ROUND(SUM(played_seconds)::numeric / 60, 0) AS "Played Minutes",
    SUM(completions) AS "Completions"
  `,
    group: "region, district, communityname, groupname, title"
  },

  {
    key: "full-playtime-hours",
    title: "Full playtime Hours",
    query: `
    region AS "Region",
    district AS "District",
    communityname AS "Community",
    groupname AS "Group Name",
    title AS "Message Title",
    ROUND(SUM(played_seconds)::numeric / 3600, 0) AS "Played Hours",
    SUM(completions) AS "Completions"
  `,
    group: "region, district, communityname, groupname, title"
  },


  { key: "custom", title: "Custom Report", query: "" },
];
const fullPlaytimeReportKeys = [
  "full-playtime-seconds",
  "full-playtime-minutes",
  "full-playtime-hours",
];
const standardReports = reports.filter((r) => !fullPlaytimeReportKeys.includes(r.key));
const fullPlaytimeReports = reports.filter((r) => fullPlaytimeReportKeys.includes(r.key));
const modalVisible = ref(false);

function onReportSelect(r: { key: string; query: string; group?: string }) {
  if (r.key == "custom") {
    modalVisible.value = true;
    return;
  }

  selectedReportKey.value = r.key;
  query.value = { query: r.query, group: r.group };
  fetchStats(r.query, r.group);
}

async function fetchStats(q: string, group: string) {
  if (!selectedDeployment.value) {
    notification.error({ message: "Error", description: "Select a deployment first" });
    return;
  }

  const results = await store.getUsage({
    deployment: selectedDeployment.value === "all" ? null : selectedDeployment.value,
    columns: q,
    group,
    date: selectedDate.value?.map(v => v.toISOString()),
  });

  const queryKeys = ['full-playtime-seconds', 'full-playtime-minutes', 'full-playtime-hours'];

  if (queryKeys.includes(selectedReportKey.value) && results.length > 0) {
    const pivoted = groupMessageData(results);
    data.value = pivoted;
    report.value = true;

    columns.value = pivoted.headers.map((h, idx) => ({
      title: h,
      dataIndex: h,
      key: h,
      width: idx < 4 ? 140 : 130,
      align: idx >= 4 ? 'right' : 'left',
      fixed: idx < 4 ? 'left' : undefined,
    }));
    rows.value = pivoted.rows;

  } else {
    report.value = false;
    data.value = { headers: [], rows: [] };

    if (results.length > 0) {
      columns.value = Object.keys(results[0]).map(k => ({
        title: k,
        dataIndex: k,
        key: k,
        align: ['Played Seconds', 'Played Minutes', 'Played Hours', 'Completions'].includes(k) ? 'right' : 'left',
      }));
      rows.value = results;
    } else {
      columns.value = [];
      rows.value = [];
    }
  }
}

async function exportReport() {
  notification.info({
    message: "Downloading Usage Query",
  });

  let dataToExport = rows.value;
  let headers: string[] = [];

  if (['group-message-detail', 'full-playtime-seconds', 'full-playtime-minutes', 'full-playtime-hours']
    .includes(selectedReportKey.value)) {
    const pivot = data.value;
    dataToExport = pivot.rows;
    headers = pivot.headers;
  } else if (rows.value.length > 0) {
    headers = Object.keys(rows.value[0]);
    dataToExport = rows.value;
  }

  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Report");

  if (headers.length > 0) {
    sheet.columns = headers.map(h => ({ header: h, key: h }));
  }
  sheet.addRows(dataToExport);

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

function groupMessageData(flatRows: Record<string, any>[]) {
  if (!flatRows?.length) return { headers: [], rows: [] };

  // Detect which time column we are pivoting (based on report)
  let timeColumn = 'Played Seconds';
  if (selectedReportKey.value === 'full-playtime-minutes') timeColumn = 'Played Minutes';
  if (selectedReportKey.value === 'full-playtime-hours') timeColumn = 'Played Hours';

  const groupMap = new Map<string, {
    Region: string;
    District: string;
    Community: string;
    'Group Name': string;
    values: Record<string, number>;
    total: number;
  }>();
  const messageSet = new Set<string>();

  flatRows.forEach(row => {
    const groupKey = [
      row.Region || '',
      row.District || '',
      row.Community || '',
      row['Group Name'] || ''
    ].join('|');

    const message = row['Message Title'] || '';
    if (message) messageSet.add(message);

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, {
        Region: row.Region || '',
        District: row.District || '',
        Community: row.Community || '',
        'Group Name': row['Group Name'] || '',
        values: {},
        total: 0
      });
    }

    const g = groupMap.get(groupKey);
    const value = Number(row[timeColumn] || 0);
    g.values[message] = (g.values[message] || 0) + value;
    g.total += value;
  });

  const messages = [...messageSet].sort();

  const pivotRows: Array<Record<string, string | number>> = [];
  groupMap.forEach(g => {
    const row: Record<string, string | number> = {
      Region: g.Region,
      District: g.District,
      Community: g.Community,
      'Group Name': g['Group Name']
    };

    messages.forEach((msg) => {
      row[msg] = g.values[msg] ?? 0;
    });

    row['Total'] = Math.round(g.total);

    pivotRows.push(row);
  });

  const headers = ['Region', 'District', 'Community', 'Group Name', ...messages, 'Total'];

  return { headers, rows: pivotRows };
}
async function onDeploymentChange() {
  fetchStats(query.value.query, query.value.group);
}

onMounted(async () => {
  const rpt = reports.find((r) => r.key === "msg");

  selectedDeployment.value = "all";
  query.value = { query: rpt.query, group: rpt.group };

  fetchStats(rpt.query, rpt.group);
});
</script>

<template>
  <PageHeader title="Usage Query" sub-title="">
    <template #extra>
      <span>Deployment:</span>
      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem key="all" @click="selectedDeployment = 'all'">
            <span>All Deployments</span>
            </MenuItem>
            <MenuItem :key="d.deploymentnumber" v-for="(d, idx) in appStore.deployments" @click="
              selectedDeployment = d.deploymentnumber;
            onDeploymentChange();
            ">
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

      <span class="ms-5">Collection Date:</span>
      <RangePicker v-model:value="selectedDate" @change="onDeploymentChange();" />

      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem :key="r.key" v-for="r in standardReports" @click="onReportSelect(r)">
            <span> {{ r.title }}</span>
            </MenuItem>
            <SubMenu key="full-playtime-group" title="Full playtime">
              <MenuItem :key="r.key" v-for="r in fullPlaytimeReports" @click="onReportSelect(r)">
                <span>{{ r.title }}</span>
              </MenuItem>
            </SubMenu>
          </Menu>
        </template>
        <Button>
          <span v-if="query == null">Choose Report</span>
          <span v-else>{{reports.find((r) => r.query == query.query).title}}</span>
          <DownOutlined />
        </Button>
      </Dropdown>
    </template>

  </PageHeader>

  <Table :columns="columns" :data-source="rows" size="small" :loading="store.loading" :sticky="true"
    :scroll="{ x: '70%' }" :pagination="false"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" class="ant-table-striped">
    <template #title>
      <Button :disabled="rows.length === 0" @click="exportReport()" ghost type="primary">Download Report</Button>
    </template>
  </Table>

  <div v-if="modalVisible">
    <QueryBuilder :visible="modalVisible" @save="(q, g) => fetchStats(q, g)" @close="modalVisible = false" />
  </div>
</template>
