<template>
  <Table :columns="columns" :data-source="tableData" :loading="loading" @change="onChange">
    <template #title>
      <div class="flex justify-between">
        <TypographyTitle :level="5">
          Talking Book Stats & UF Collection Activity
        </TypographyTitle>

        <Button type="primary" @click="fetchData('ByTb')" :ghost="true">
          <ReloadOutlined /> Refresh Data
        </Button>
      </div>
    </template>
    <template #headerCell="{ column }">
      <template v-if="column.key === 'recipient'">
        <span>Recipient</span>
      </template>
    </template>
    <template
      #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      <div style="padding: 8px">
        <Input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
        <Button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)">
          <template #icon><SearchOutlined /></template>
          Search
      </Button>
        <Button size="small" style="width: 90px" @click="handleReset(clearFilters)">Reset</Button>
      </div>
    </template>
    <template #customFilterIcon="{ filtered }">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
    </template>
    <template #bodyCell="{ column, record }"> <!--   -->
      <span v-if="state.searchText && state.searchedColumn === record.dataIndex">
        <template
          v-for="(fragment, i) in column
            .toString()
            .split(new RegExp(`(?<=${state.searchText})|(?=${state.searchText})`, 'i'))">
          <mark
            v-if="fragment.toLowerCase() === state.searchText.toLowerCase()"
            :key="i"
            class="highlight">
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
      <template v-if="column.key === 'recipient'">
        {{ record.recipient }}
      </template>

      <template v-if="column.key === 'talkingbookid'">
        {{ record.talkingbookid }}
      </template>

      <template v-if="column.key === 'deployment_num'">
        {{ record.deployment_num }}
      </template>

      <template v-if="column.key === 'deployment_time'">
        {{ record.deployment_time }}
      </template>

      <template v-if="column.key === 'deployment_user'">
        {{ record.deployment_user }}
      </template>

      <template v-if="column.key === 'collection_time'">
        {{ record.collection_time }}
      </template>

      <template v-if="column.key === 'collection_user'">
        {{ record.collection_user }}
      </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRequest } from "vue-request";
import { Table, TypographyTitle, Button, Input } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import { SearchOutlined } from "@ant-design/icons-vue";
import { table } from "console";

const store = useTalkingBookAnalyticStore();
const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();

const tableData = ref([]);
const columns = [
  { 
    title: "Recipient",
    key: "recipient",
    dataIndex: "recipient",
    customFilterDropdown: true,
    onFilter: (value: any, record: any) => record.recipient.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  { title: "TB ID", key: "talkingbookid", dataIndex: "talkingbookid" },
  { 
    title: "Current Content Deployment",
    key: "deployment_num",
    dataIndex: "deployment_num",
    defaultSortOrder: "descend",
    sorter: (a: any, b: any) => a.deployment_num - b.deployment_num,
    //sorter: {
    //  compare: (a: any, b: any) => a.deployment_num - b.deployment_num,
    //  multiple: 3,
    //},
  },
  { title: "Date of Last Content Update", key: "deployment_time", dataIndex: "deployment_time", },
  { title: "User", key: "deployment_user", dataIndex: "deployment_user" },
  { title: "Date of Last Data Collection", key: "collection_time", dataIndex: "collection_time" },
  { title: "User", key: "collection_user", dataIndex: "collection_user" },
];

const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
}

const handleReset = (clearFilters: any) => {
  clearFilters({ confirm: true });
  state.searchText = '';
}

function onChange(pagination: any, filters: any, sorter: any, extra: any) {
  console.log('params', pagination, filters, sorter, extra);
}

const { loading, run: fetchData } = useRequest(store.getTbStatusBy, {
  defaultParams: ["ByTb"],
  onSuccess: (data) => {
    loading.value = true;

    // Find which recipient columns have multiple values.
    const needed: any[] = [];
    ["region", "district", "communityname", "groupname", "agent", "language"].forEach(
      (col) => {
        let v = data[0][col];
        if (data.some((row) => row[col] !== v)) {
          needed.push(col);
        }
      }
    );
    data.forEach((row) => {
      let values = needed.map((col) => row[col] || "-");
      row.recipient = values.join("/");
    });

    tableData.value = data;
    loading.value = false;
  },
});
</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
