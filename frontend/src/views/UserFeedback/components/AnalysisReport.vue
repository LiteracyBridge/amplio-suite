<script setup lang="ts">
import { useAccountStore } from "@/store/account";
import { useAppStore } from "@/store/app.store";
import { Workbook } from "exceljs";
import { ref } from "vue";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { Button } from "ant-design-vue";

const store = useAppStore();
const loading = ref(false);

async function downloadReport() {
  const workbook = new Workbook();
  workbook.creator = useAccountStore().user?.name || useAccountStore().email;
  workbook.lastModifiedBy = workbook.creator;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  const sheet = workbook.addWorksheet("Feedback Analysis Report");
  sheet.columns = [
    { header: "Id", key: "id", width: 10 },
    { header: "Name", key: "name", width: 32 },
    { header: "D.O.B.", key: "DOB", width: 10, outlineLevel: 1 },
  ];

  // Add an array of rows
  const rows = [
    [5, "Bob", new Date()], // row by array
    { id: 6, name: "Barbara", dob: new Date() },
  ];
  // add new rows and return them as array of row objects
  const newRows = sheet.addRows(rows);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Feedback Analysis Report.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
}
</script>

<template>
  <Button type="primary" :ghost="true" @click="downloadReport()" :loading="loading">
    <template #icon>
      <DownloadOutlined />
    </template>
    Download Report</Button
  >
</template>
