<script lang="ts" setup>
import { ApiRequest } from "@/api";
import { Button, Input, Modal, PageHeader, Table } from "ant-design-vue";
import { ref, h } from "vue";
import { onMounted } from "vue";
import type { ACMCheckout } from "@/models/acm";
import { CloseOutlined } from "@ant-design/icons-vue";

function onChange(pagination: any, filters: any, sorter: any, extra: any) {
  console.log("params", pagination, filters, sorter, extra);
}

const showModal = ref(false);
const selectedACM = ref<ACMCheckout | null>(null);
// TODO: fetch the checkout data from the backend

const columns = [
  {
    title: "ACM Name",
    key: "acm_name",
  },
  {
    title: "Status",
    key: "acm_state",
  },
  {
    title: "Checked Out Date",
    key: "last_in_date",
  },
  {
    title: "Checked Out By",
    key: "now_out_name",
  },
  {
    title: "Computer Name",
    key: "now_out_computername",
  },
  {
    title: "Last Checkin Date",
    key: "last_checkin_date",
  },
  {
    title: "Last Filename",
    key: "last_filename",
  },
  {
    title: "Last Checkin Name",
    key: "last_checkin_name",
  },
];

const dataSource = ref<ACMCheckout[]>([]);

onMounted(async () => {
  fetchData();
});

async function fetchData() {
  await ApiRequest.get<ACMCheckout>("acm-checkout?action=list").then((resp) => {
    console.log(resp);
    dataSource.value = resp;
  });
}

async function confirmUncheckout() {
  await ApiRequest.get<ACMCheckout>(
    `acm-checkout?action=revokeCheckout&program=${selectedACM.value.acm_name}&key=${selectedACM.value.now_out_key}`
  ).then((resp) => {
    console.log(resp);
    // dataSource.value = resp;
  });
}
</script>

<template>
  <PageHeader title="ACMs" sub-title="ACM Checkout"></PageHeader>

  <Table :columns="columns" :data-source="dataSource" @change="onChange">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'acm_name'">
        {{ record.acm_name }}
      </template>
      <template v-if="column.key === 'acm_state'">
          <!-- v-if="record.acm_state === 'CHECKED_OUT'" -->
        <Button
          type="primary"
          shape="circle"
          :ghost="true"
          size="small"
          :icon="h(CloseOutlined)"
          @click="
            selectedACM = record as ACMCheckout
            showModal = true;
          "
        />
        {{ record.acm_state }}
      </template>
      <template v-if="column.key === 'last_in_date'">
        {{ record.last_in_date }}
      </template>
      <template v-if="column.key === 'now_out_name'">
        {{ record.now_out_name }}
      </template>
      <template v-if="column.key === 'now_out_computername'">
        {{ record.now_out_computername }}
      </template>
      <template v-if="column.key === 'last_checkin_date'">
        {{ record.last_checkin_date }}
      </template>
      <template v-if="column.key === 'last_filename'">
        {{ record.last_filename }}
      </template>
      <template v-if="column.key === 'last_checkin_name'">
        {{ record.last_checkin_name }}
      </template>
    </template>
  </Table>

  <!-- Checkout modal -->
  <Modal
    v-model:open="showModal"
    @ok="confirmUncheckout()"
    ok-text="Undo Checkout"
    @cancel="
      showModal = false;
      selectedACM = null;
    "
  >
    <template #title>
      <span class="bg-red-600 text-white">Force Undo Checkout</span>
    </template>

    <div v-if="selectedACM != null">
      <p>
        You are about to force undo checkout in database '{{ selectedACM.acm_name }}'.
      </p>
      <p>
        Checked out by user '{{ selectedACM.now_out_name }}' on
        {{ selectedACM.now_out_date?.split(".")[0] }}
        {{
          selectedACM.now_out_computername
            ? ", on computer " + selectedACM.now_out_computername + "."
            : "."
        }}
      </p>
      <p>Contact {{ selectedACM.now_out_name }} at {{ selectedACM.now_out_contact }}.</p>

      <p>
        Enter the name of this project before confirming this action (upper- vs lower-case
        ignored)
      </p>
      <Input class="w-full" type="text" />
    </div>
  </Modal>
</template>
