<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import {
  Tag,
  Tooltip,
  Table,
  PageHeader,
  TreeSelect,
  Button,
  Alert,
  SubMenu,
  MenuItem,
  Menu,
  Dropdown,
  notification,
} from "ant-design-vue";
import { onMounted, ref } from "vue";
import { DateTime } from "luxon";
import { Workbook } from "exceljs";
import { useAppStore } from "@/store/app.store";
import { DownOutlined } from "@ant-design/icons-vue";

const store = useTalkingBookAnalyticStore();
const appStore = useAppStore();

const columns = ref([]);
const rows = ref([]);

async function fetchStats(surveyName: string) {
  const data = await store.getCustomSurveyReport(surveyName);
  columns.value = Object.keys(data[0]).map((header) => {

    const fixed = ["Community", "Group", "District", "Language", "Region", "complete"].indexOf(header) > -1;
    return {
      title: header == "complete" ? "Completed" : header,
      dataIndex: header,
      key: header.replaceAll(" ", "_").toLowerCase(),
      // resizable: true,
      fixed: fixed,
      width: fixed ? 100 : 7 * 1.333 * header.length
    }
  });

  rows.value = data as any;
}


function exportToCSV() {

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Define columns
  worksheet.columns = columns.value.map((col) => ({
    header: col.title,
    key: col.dataIndex,
    width: 20,
  }));

  // Add rows
  rows.value.forEach((row) => {
    worksheet.addRow(
      // Ensure all columns are represented, even if some data is missing
      columns.value.map((col) => row[col.dataIndex] ?? "")
    );
  });

  // Make headers bold
  worksheet.getRow(1).font = { bold: true };

  // Generate CSV content
  if (rows.value.length === 0) {
    notification.warning({ message: "No data available to export." });
    return;
  }

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Custom_Survey_Report_${DateTime.now().toFormat("yyyyLLdd_HHmm")}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

// onMounted(async () => {
//   await fetchStats();
// });
</script>

<template>
  <PageHeader title="Custom Survey Report" sub-title="Download custom talking book survey report">
    <template #extra>

      <Dropdown>
        <template #overlay>
          <Menu>
            <SubMenu :key="deployment.deploymentnumber" v-for="deployment in appStore.deployments">
              <template #title>
                <span>Deployment {{ deployment.deploymentnumber }}</span>
              </template>

              <MenuItem :key="playlist.id"
                v-for="playlist in deployment.playlists.filter((i) => i.title.toLowerCase().endsWith('survey'))"
                @click="fetchStats(playlist.title)">
              <span>{{ playlist.title }}</span>
              </MenuItem>
            </SubMenu>
          </Menu>
        </template>

        <Button>
          Choose Survey
          <DownOutlined />
        </Button>
      </Dropdown>

      <Button type="primary" @click="exportToCSV">Export to Excel</Button>

    </template>

  </PageHeader>

  <Table :columns="columns" :data-source="rows" size="small" :loading="store.loading" :sticky="true"
    :scroll="{ x: '70%' }" :pagination="false"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" class="ant-table-striped">

  </Table>
</template>

<style scoped>
/* .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
} */
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>
