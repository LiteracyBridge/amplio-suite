<script lang="ts" setup>
import { ApiRequest } from "@/api";
import { Button, Input, Modal, PageHeader, Table } from "ant-design-vue";
import { ref, h } from "vue";
import { onMounted } from "vue";
import type { ACMCheckout } from "@/models/acm_checkout";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { DateTime } from "luxon";

const showModal = ref(false);
const isLoading = ref(false);
const checkoutProjectName = ref("");

const selectedACM = ref<ACMCheckout | null>(null);
const dataSource = ref<ACMCheckout[]>([]);
const dataSourceTemp = ref<ACMCheckout[]>([]);

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
    key: "now_out_date",
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
    key: "last_in_date",
  },
  {
    title: "Last Filename",
    key: "last_in_file_name",
  },
  {
    title: "Last Checkin Name",
    key: "last_in_name",
  },
];

onMounted(async () => {
  fetchData();
});

async function fetchData() {
  isLoading.value = true;
  await ApiRequest.get<ACMCheckout>("acm-checkout/list")
    .then((resp) => {
      console.log(resp);
      dataSource.value = resp;
      dataSourceTemp.value = [...resp];
    })
    .finally(() => {
      isLoading.value = false;
    });
}

async function confirmUncheckout() {
  isLoading.value = true;

  await ApiRequest.get<ACMCheckout>(
    `acm-checkout?action=revokeCheckout&program=${selectedACM.value.acm_name}&key=${selectedACM.value.now_out_key}`
  )
    .then((resp) => {
      console.log(resp);
      showModal.value = false;
      fetchData();
      // dataSource.value = resp;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

function performSearch(input: string) {
  const term = input?.trim()?.toLowerCase() ?? "";
  if (term === "") {
    dataSource.value = [...dataSourceTemp.value];
    return;
  }

  dataSource.value = dataSourceTemp.value.filter((acm) =>
    acm.acm_name.toLowerCase().includes(term)
  );
}
</script>

<template>
  <PageHeader title="ACM Checkout Status" sub-title="Manage ACM checkout"></PageHeader>

  <Table
    :columns="columns"
    :data-source="dataSource"
    size="small"
    :pagination="{ defaultPageSize: 25 }"
    :loading="isLoading"
  >
    <template #title>
      <div class="flex justify-center">
        <Input
          placeholder="Search ACM"
          class="w-3/5"
          @change="performSearch($event.target.value || '')"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </Input>

        <Button type="primary" class="ml-5" @click="fetchData()">Refresh</Button>
      </div>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'acm_name'">
        {{ record.project.name }}
      </template>
      <template v-if="column.key === 'acm_state'">
        <Button
          v-if="record.acm_state === 'CHECKED_OUT'"
          type="primary"
          shape="circle"
          :ghost="true"
          :danger="true"
          size="small"
          :icon="h(CloseOutlined)"
          @click="
            selectedACM = record as ACMCheckout
            showModal = true;
          "
        />
        {{ record.acm_state }}
      </template>
      <template v-if="column.key === 'now_out_date'">
        <span v-if="record.now_out_date">
          {{ record.now_out_date}}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'now_out_name'">
        {{ record.now_out_name }}
      </template>
      <template v-if="column.key === 'now_out_computername'">
        {{ record.now_out_computername }}
      </template>
      <template v-if="column.key === 'last_in_date'">
        <span v-if="record.last_in_date">
          {{ record.last_in_date.replace(/\.\d+/, "") }}
        </span>
        <span v-else>-</span>
      </template>
      <template v-if="column.key === 'last_in_file_name'">
        {{ record.last_in_file_name }}
      </template>
      <template v-if="column.key === 'last_in_name'">
        {{ record.last_in_name }}
      </template>
    </template>
  </Table>

  <!-- Checkout modal -->
  <Modal
    :open="showModal"
    @ok="confirmUncheckout()"
    ok-text="Undo Checkout"
    @cancel="
      showModal = false;
      selectedACM = null;
    "
    :ok-button-props="{
      disabled: checkoutProjectName.toLowerCase() !== selectedACM?.acm_name.toLowerCase(),
      danger: true,
    }"
    :confirm-loading="isLoading"
  >
    <template #title>
      <span class="text-red-500 w-full">Force Undo Checkout</span>
    </template>

    <div v-if="selectedACM != null">
      <p>
        You are about to force undo checkout in
        <span class="font-bold">{{ selectedACM.acm_name }}</span> database.
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

      <p>Enter the name of this ACM before confirming this action</p>
      <Input class="w-full mt-5" type="text" v-model:value="checkoutProjectName"></Input>
    </div>
  </Modal>
</template>
