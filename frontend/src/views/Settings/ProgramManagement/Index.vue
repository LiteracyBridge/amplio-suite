<script lang="ts" setup>
import {
  Button,
  Descriptions,
  DescriptionsItem,
  PageHeader,
  Table,
  Modal,
} from "ant-design-vue";
import { computed, ref } from "vue";
// import InvitationDrawer from "./InvitationDrawer.vue";
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
  <PageHeader title="Users" sub-title="Manage user accounts and roles">
    <template #extra>
      <router-link to="/users/manage-roles">
        <Button>Manage Programs</Button>
      </router-link>

      <Button type="primary" @click="modal.open = true">Invitations</Button>
    </template>
  </PageHeader>

  <Table :columns="columns" :data-source="programs" :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        {{ record.project?.name }} ({{ record.program_id }})
      </template>

      <template v-else-if="column.key === 'partner'">
        {{ record.partner || 'N/A' }}
      </template>

      <template v-else-if="column.key === 'country'">
        {{ record.country }}
      </template>

      <template v-else-if="column.key === 'action'">
        <span> </span>
      </template>
    </template>
  </Table>

  <!-- <InvitationDrawer :open="modal.open" @closed="modal.open = false" /> -->
</template>
