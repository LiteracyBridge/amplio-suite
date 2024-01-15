<script lang="ts" setup>
import {
  Button,
  Descriptions,
  DescriptionsItem,
  PageHeader,
  Table,
  Modal,
} from "ant-design-vue";
import { ref } from "vue";
import InvitationDrawer from "./InvitationDrawer.vue";
import { useAccountStore } from "@/store/account";
import { useRequest } from "vue-request";

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
    name: "Name",
    dataIndex: "name",
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
    title: "Last Login",
    dataIndex: "lastLogin",
    key: "lastLogin",
  },
  {
    title: "Actions",
    key: "action",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
</script>

<template>
  <PageHeader class="demo-page-header" title="Title" sub-title="This is a subtitle">
    <template #extra>
      <router-link to="/users/manage-roles">
        <Button key="3">Manage Roles</Button>
      </router-link>
      <Button key="1" type="primary" @click="modal.open = true">Invitations</Button>
    </template>

    <Descriptions size="small" :column="3">
      <DescriptionsItem label="Created">Lili Qu</DescriptionsItem>
    </Descriptions>
  </PageHeader>

  <Table :columns="columns" :data-source="users" :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.first_name }} {{ record.other_names || "" }} {{ record.last_name }}
        </a>
      </template>

      <template v-else-if="column.key === 'action'">
        <span> Come here </span>
      </template>
    </template>
  </Table>

  <InvitationDrawer :open="modal.open" @closed="modal.open = false" />
</template>
