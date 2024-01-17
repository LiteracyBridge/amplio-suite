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

const store = useAccountStore();
const { data: users, run, loading } = useRequest(store.fetchUsers, {
  onSuccess: (data) => {
    console.log(data);
    store.users = data;
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

const getUserRoles = computed(() => {
  return (user: User | Record<string, any>) => {
    return user.roles.flatMap((role: UserRole) => role.role.name).join(", ");
  };
});
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

  <Table :columns="columns" :data-source="users" :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        {{ record.first_name }} {{ record.last_name }}
      </template>

      <template v-else-if="column.key === 'email'">
        {{ record.email }}
      </template>

      <template v-else-if="column.key === 'roles'">
        {{ getUserRoles(record) }}
      </template>

      <template v-else-if="column.key === 'action'">
        <span> </span>
      </template>
    </template>
  </Table>

  <InvitationDrawer :open="modal.open" @closed="modal.open = false" />
</template>
