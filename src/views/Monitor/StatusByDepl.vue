<template>
  <Table :columns="columns" :data-source="tableData" :loading="loading" @change="onChange">
    <template #title>
      <div class="flex justify-between">
        <TypographyTitle :level="5"> Talking Book Deployment Activity </TypographyTitle>

        <div class="flex gap-2">
          <Button type="primary" @click="fetchData('ByDepl')" :ghost="true">
            <ReloadOutlined /> Refresh Data
          </Button>

          <Button type="primary" @click="onExportExcel">
            Export to Excell
          </Button>

        </div>

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
import { Table, TypographyTitle, Button, notification } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import { Workbook } from "exceljs";

const store = useTalkingBookAnalyticStore();

const columns = [
  {
    title: "Deployment",
    key: "deploymentnumber",
  },
  {
    title: "Earliest",
    key: "earliest",
    width: '20%',
    sorter: (a: any, b: any) => new Date(a.earliest).valueOf() - new Date(b.earliest).valueOf(),
  },
  {
    title: "Latest",
    key: "latest",
    sorter: (a: any, b: any) => new Date(a.latest).valueOf() - new Date(b.latest).valueOf(),
    width: '20%',
  },
  {
    title: "# TBs Installed",
    key: "deployed",
    dataIndex: "deployed",
    sorter: (a: any, b: any) => a.deployed - b.deployed,
    //sorter: {
    //  compare: (a: any, b: any) => a.deployed - b.deployed,
    //  multiple: 3,
    //}
  },
  {
    title: "# TBs reporting data",
    key: "collected",
    dataIndex: "collected",
    sorter: (a: any, b: any) => a.collected - b.collected,
  },
];

function onChange(pagination: any, filters: any, sorter: any, extra: any) {
  console.log('params', pagination, filters, sorter, extra);
}

const { loading, data: tableData, run: fetchData } = useRequest(store.getTbStatusBy, {
  defaultParams: ["ByDepl"],
});


/**
 * we Exporting table data to Excel for offline use
 */
async function onExportExcel() {
  if (!tableData.value || tableData.value.length === 0) {
    notification.warning({ message: "No data available to export." });
    return;
  }

  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("TB Deployment Activity");

  // Define headers
  sheet.columns = [
    { header: "Deployment", key: "deploymentnumber", width: 20 },
    { header: "Earliest", key: "earliest", width: 20 },
    { header: "Latest", key: "latest", width: 20 },
    { header: "# TBs Installed", key: "deployed", width: 20 },
    { header: "# TBs reporting data", key: "collected", width: 25 },
  ];

  // Make headers bold
  sheet.getRow(1).font = { bold: true };

  // Add rows from tableData
  tableData.value.forEach((row: any) => {
    sheet.addRow({
      deploymentnumber: row.deploymentnumber,
      earliest: row.earliest,
      latest: row.latest,
      deployed: row.deployed,
      collected: row.collected,
    });
  });

  // Export to Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "TalkingBookDeployment.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);

  notification.success({ message: "Export successful!", description: "Excel file has been downloaded." });
}
</script>
