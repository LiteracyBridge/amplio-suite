<script lang="ts" setup>
import { Button, Input, PageHeader, Table } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
import ProgramDetails from "./ProgramDetails.vue";
import { useProgramsStore } from "@/store/programs";
import { useRequest } from "vue-request";
import { RequestCacheKeys } from "@/models/constants";
import { useAccountStore } from "@/store/account";
import { Program } from "@/models/program";

const store = useProgramsStore();
const searchInput = ref();
const tableState = reactive({
  searchText: "",
  searchedColumn: "",
});

const { loading } = useRequest(store.getOrgPrograms, {
  cacheKey: RequestCacheKeys.org_programs,
  onSuccess: (data) => {
    store.setProgramsList(data);
  },
});
const {} = useRequest(useAccountStore().fetchOrganisations, {
  cacheKey: RequestCacheKeys.orgs,
  cacheTime: 50 * 60 * 1000, // 50 minutes
  onSuccess: (data) => {
    useAccountStore().organisations = data;
  },
});

const modal = ref({
  open: false,
  programId: undefined as number,
  name: undefined as string,
});

const columns = [
  {
    title: "Name",
    key: "name",
    customFilterDropdown: true,
    onFilter: (value: any, record: Program) =>
      record?.project?.name?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value?.focus();
        }, 100);
      }
    },
  },
  {
    title: "Organisations",
    key: "organisations",
  },
  {
    title: "Country",
    key: "country",
  },
  {
    title: "",
    key: "action",
  },
];

const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  tableState.searchText = selectedKeys[0];
  tableState.searchedColumn = dataIndex;
};

const handleReset = (clearFilters: any) => {
  clearFilters({ confirm: true });
  tableState.searchText = "";
};
</script>

<template>
  <PageHeader title="Programs" sub-title="Manage programs and program users">
  </PageHeader>

  <Table :columns="columns" :data-source="store.organisationPrograms" :loading="loading">
    <template
      #customFilterDropdown="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
    >
      <div style="padding: 8px">
        <Input
          ref="groupSearchInput"
          :placeholder="`Search ${column.title}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(selectedKeys, confirm, column.key)"
        />
        <Button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.key)"
        >
          <template #icon><SearchOutlined /></template>
          Search
        </Button>
        <Button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          Reset
        </Button>
      </div>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        {{ record.project?.name }} ({{ record.program_id }})
      </template>

      <template v-else-if="column.key === 'organisations'">
        {{ record.partner || "N/A" }}
      </template>

      <template v-else-if="column.key === 'country'">
        {{ record.country }}
      </template>

      <template v-else-if="column.key === 'action'">
        <Button
          size="small"
          type="primary"
          :ghost="true"
          @click="
            modal.programId = record.id;
            modal.name = record?.project?.name;
            modal.open = true;
          "
          >Manage Users</Button
        >
      </template>
    </template>
  </Table>

  <template v-if="modal.open === true">
    <ProgramDetails
      :open="modal.open"
      :program-id="modal.programId"
      :name="modal.name"
      @closed="
        modal.open = false;
        modal.programId = undefined;
      "
  /></template>
</template>
