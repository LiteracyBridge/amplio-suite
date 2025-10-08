<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import {
  Tag,
  Tooltip,
  Table,
  PageHeader,
  Button,
  notification,
} from "ant-design-vue";
import { onMounted, ref } from "vue";
import { Workbook } from "exceljs";

interface Column {
  title: string;
  dataIndex: string;
  key: string;
}

const store = useTalkingBookAnalyticStore();
const columns = ref<Column[]>([]);
const rows = ref<Record<string, any>[]>([]);

async function fetchStats() {
  const data = await store.inventory();
  console.log(data);

  const communities: Record<string, any> = {};
  const cols: { [key: string]: Column } = {
    community: { title: "Community", dataIndex: "name", key: "name" },
  };

  for (const r of data) {
    const com: any = communities[r.community_name] ?? {};
    com[r.deployment] = r.deployed_tbs;
    com.name = r.community_name;
    communities[r.community_name] = com;

    // update columns dynamically
    cols[r.deployment] ??= {
      title: r.deployment,
      dataIndex: r.deployment,
      key: r.deployment,
    };
  }

  columns.value = Object.values(cols);
  rows.value = Object.values(communities);
}

// Export to Excel function
function exportToExcel() {
  if (rows.value.length === 0) {
    notification.warning({ message: "No data available to export." });
    return;
  }

  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Inventory");

  // Define headers
  sheet.columns = columns.value.map((col) => ({
    header: col.title,
    key: col.dataIndex,
    width: 20,
  }));

  // Add data rows
  rows.value.forEach((row) => {
    sheet.addRow(
      columns.value.map((col) => row[col.dataIndex] ?? "")
    );
  });

  // Make headers bold
  sheet.getRow(1).font = { bold: true };

  // Auto-adjust column widths
  sheet.columns.forEach((col) => {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value ? cell.value.toString().length : 0;
      if (len > maxLength) maxLength = len;
    });
    col.width = maxLength + 2;
  });

  // Download Excel file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fileName = `Inventory_${new Date().toISOString().split("T")[0]}.xlsx`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    notification.success({
      message: "Export successful!",
      description: `${fileName} has been downloaded.`,
    });
  });
}

onMounted(async () => {
  await fetchStats();
});
</script>

<template>
  <PageHeader
    title="Inventory"
    sub-title="Talking book installations of communities across all deployments"
  >
    <template #extra>
      <!-- Added Export to Excel button -->
      <Button type="primary" @click="exportToExcel">Export to Excel</Button>
    </template>
  </PageHeader>

  <Table
    :columns="columns"
    :data-source="rows"
    size="small"
    :loading="store.loading"
    :sticky="true"
    :scroll="{ x: '70%' }"
    :pagination="false"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    class="ant-table-striped"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'group'">
        <Tooltip>
          <template #title
            >The group's name, or Support Entity's name, if there is no group. Support
            Entity names are prefixed with SE:.</template
          >
          Group
        </Tooltip>
      </template>
      <template v-if="column.key === 'whereUpdated'">
        <Tooltip>
          <template #title
            >Where did the updater indicate they were, during the installation?</template
          >
          Location
        </Tooltip>
      </template>
      <template v-if="column.key === 'loaderId'">
        <Tooltip>
          <template #title
            >The TB-Loader id of the laptop or phone that performed the
            installation.</template
          >
          ID
        </Tooltip>
      </template>
      <template v-if="column.key === 'date'">
        <Tooltip>
          <template #title
            >When was this Talking Book installed? Time is in UTC..</template
          >
          Date and Time
        </Tooltip>
      </template>
      <template v-if="column.key === 'test'">
        <Tooltip>
          <template #title
            >Was the 'Testing the Deployment' box checked on the TB-Loader?</template
          >
          Test?
        </Tooltip>
      </template>
    </template>
  </Table>
</template>

<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>
