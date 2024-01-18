<script lang="ts" setup>
import { Button, PageHeader, Table } from "ant-design-vue";
import { ref } from "vue";
import ProgramUsers from "./ProgramUsers.vue";
import { useProgramsStore } from "@/store/programs";
import { useRequest } from "vue-request";
import { RequestCacheKeys } from "@/models/constants";

const store = useProgramsStore();
const { data: programs, run, loading } = useRequest(store.getOrgPrograms, {
  cacheKey: RequestCacheKeys.org_programs,
  onSuccess: (data) => {
    store.organisationPrograms = data;
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
  },
  {
    title: "Partner",
    key: "partner",
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
</script>

<template>
  <PageHeader title="Programs" sub-title="Manage programs and program users">
  </PageHeader>

  <Table :columns="columns" :data-source="programs" :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        {{ record.project?.name }} ({{ record.program_id }})
      </template>

      <template v-else-if="column.key === 'partner'">
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
    <ProgramUsers
      :open="modal.open"
      :program-id="modal.programId"
      :name="modal.name"
      @closed="
        modal.open = false;
        modal.programId = undefined;
      "
  /></template>
</template>
