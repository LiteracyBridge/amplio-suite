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
import InvitationDrawer from "./InvitationDrawer.vue";
import { useAccountStore } from "@/store/account";
import { useRequest } from "vue-request";
import { User, UserRole } from "@/models/user";
import { RequestCacheKeys } from "@/models/constants";

import AssignRoleModal from "./AssignRoleModal.vue";

const store = useAccountStore();
const { loading } = useRequest(store.fetchUsers, {
  cacheKey: RequestCacheKeys.org_users,
  onSuccess: (data) => {
    store.users = data;
  },
});

const modal = ref({
  open: false,
});
const assignRoleModal = ref({
  open: false,
  user_id: undefined as number,
});

const columns = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Email Address",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Roles",
    dataIndex: "roles",
    key: "roles",
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
      <router-link to="/settings/roles">
        <Button>Manage Roles</Button>
      </router-link>

      <Button type="primary" @click="modal.open = true">Invitations</Button>
    </template>
  </PageHeader>

  <Table :columns="columns" :data-source="store.users" :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        {{ record.first_name }} {{ record.last_name }}
      </template>

      <template v-else-if="column.key === 'email'">
        {{ record.email }}
      </template>

      <template v-else-if="column.key === 'roles'">
        {{ store.rolesToString(record.roles) }}
      </template>

      <template v-else-if="column.key === 'action'">
        <Button
          size="small"
          @click="
            assignRoleModal.open = true;
            assignRoleModal.user_id = record.id;
          "
          >Manage Roles
        </Button>
      </template>
    </template>
  </Table>

  <InvitationDrawer :open="modal.open" @closed="modal.open = false" />

  <!-- Assign roles modal -->
  <template v-if="assignRoleModal.open">
    <AssignRoleModal
      :open="assignRoleModal.open"
      :user-id="assignRoleModal.user_id"
      @closed="
        assignRoleModal.open = false;
        assignRoleModal.user_id = undefined;
      "
    ></AssignRoleModal>
  </template>
</template>
