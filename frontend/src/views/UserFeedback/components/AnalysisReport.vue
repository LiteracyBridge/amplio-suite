<script setup lang="ts">
import { useAccountStore } from "@/store/account";
import { Workbook } from "exceljs";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { Button, notification } from "ant-design-vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";

const store = useFeedbackAnalysis();

async function downloadReport() {
  store.loading = true;
  notification.info({
    message: "Downloading Report",
    description: "Please wait while we prepare the report for you.",
  });

  // Fetch report from server
  const data = await store.fetchAnalysisReport();
  if (data.length == 0) {
    notification.error({
      message: "No Data Found",
      description: "No analysis data found to generate report!",
    });
    store.loading = false;
    return;
  }

  const workbook = new Workbook();
  workbook.creator = useAccountStore().user?.name || useAccountStore().email;
  workbook.lastModifiedBy = workbook.creator;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();

  const sheet = workbook.addWorksheet("Feedback Analysis Report");

  sheet.columns = data[0].headers;
  sheet.addRows(data[0].rows);

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

  store.loading = false;
  notification.success({
    message: "Download Complete",
    description: "Your report has been downloaded successfully.",
  });
}
</script>

<template>
  <Button type="primary" :ghost="true" @click="downloadReport()" :loading="store.loading">
    <template #icon>
      <DownloadOutlined />
    </template>
    Download Report</Button
  >
</template>
