<script lang="ts" setup>
import { Button, PageHeader, Table, Modal, Typography, Input } from "ant-design-vue";
import { computed, ref } from "vue";
import InvitationDrawer from "./InvitationDrawer.vue";
import { useAccountStore } from "@/store/account";
import { useRequest } from "vue-request";
import { RequestCacheKeys } from "@/models/constants";

import AssignRoleModal from "./AssignRoleModal.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { User } from "@/models/user";

const store = useAccountStore();
const users = ref<User[]>([]);

const { loading } = useRequest(store.fetchUsers, {
  cacheKey: RequestCacheKeys.org_users,
  onSuccess: (data) => {
    store.users = data;
    users.value = [...data];
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
    title: "Organisation",
    key: "org",
    // customFilterDropdown: true,
    // onFilter: (value: string, record: User) =>
    //   record.organisation?.toString().toLowerCase().includes(value.toLowerCase()),
    // onFilterDropdownOpenChange: (visible) => {
    //   if (visible) {
    //     setTimeout(() => {
    //       searchInput.value.focus();
    //     }, 100);
    //   }
    // },
  },
  {
    title: "Roles",
    key: "roles",
  },
  {
    title: "",
    key: "action",
  },
];

function performSearch(val?: string) {
  if (val == null || val === undefined || val.trim().length === 0) {
    users.value = [...store.users];
    return
  }

  const input = val.trim().toLowerCase();
  users.value = store.users.filter((recipient) => {
    return (
      recipient.organisation.name?.toLowerCase().includes(input) ||
      recipient.first_name?.toLowerCase().includes(input) ||
      recipient.last_name?.toLowerCase().includes(input) ||
      recipient.email?.toLowerCase().includes(input)
    );
  });
}
</script>

<template>
  <PageHeader title="Users" sub-title="Manage user accounts and roles">
    <template #extra>
      <router-link to="/admin/roles">
        <Button>Manage Roles</Button>
      </router-link>

      <Button type="primary" @click="modal.open = true">Invitations</Button>
    </template>
  </PageHeader>

  <Table :columns="columns" :data-source="users" :loading="loading">
    <template #title>
      <div class="flex w-full">
        <Input
          type="text"
          class="mr-10"
          placeholder="Search user or organisation"
          @change="performSearch($event.target.value)"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </Input>
      </div>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <span class="pr-4 block text-gray-900">
          {{ record.first_name }} {{ record.last_name }}
        </span>
        <Typography.Text copyable class="pl-2"> {{ record.email }}</Typography.Text>
      </template>

      <template v-else-if="column.key === 'org'">
        {{ record.organisation?.name }}
      </template>

      <template v-else-if="column.key === 'roles'">
        {{ store.rolesToString(record.roles) }}
      </template>

      <template v-else-if="column.key === 'action'">
        <Button
          type="link"
          @click="
            assignRoleModal.open = true;
            assignRoleModal.user_id = record.id;
          "
          >Assign Roles
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
