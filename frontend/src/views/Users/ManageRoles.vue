<script lang="ts" setup>
import {
  Button,
  FormItem,
  DescriptionsItem,
  PageHeader,
  List,
  ListItem,
  Modal,
  Tabs,
  TabPane,
  Row,
  Col,
  Table,
  Tag,
  SelectOption,
  Select,
  Spin,
} from "ant-design-vue";
import { computed, onMounted, ref } from "vue";
import NewRoleDrawer from "./NewRoleDrawer.vue";
import { useRolesStore } from "@/store/roles.store";
import { useRequest } from "vue-request";
import { Role } from "@/models/role";
import { toSentenceCase, toTitleCase } from "@/utils";
import { User } from "@/models/user";
import { useAccountStore } from "@/store/account";

const store = useRolesStore();

const roleTabKey = ref(undefined);
const newRoleDrawerVisible = ref(false);
const assignModal = ref({
  open: false,
  role: undefined,
  users: [],
  close: () => {
    assignModal.value.open = false;
    assignModal.value.role = undefined;
    assignModal.value.users = [];
  },
});

const { data: roles, run, loading } = useRequest(store.fetchRoles, {
  onSuccess: (data) => {
    store.roles = data;
    roleTabKey.value = data.length > 0 ? data[0].id : undefined;
  },
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
    title: "Actions",
    key: "action",
  },
];

// const data = ["Can update TB Loader", "Can create staff"];
function getRolePermissions(role: Role): string[] {
  const permissions: string[] = [];
  Object.keys(role.permissions).forEach((module: string) => {
    role.permissions[module].forEach((action: string) => {
      permissions.push(`${toTitleCase(toSentenceCase(action, true))}`);
    });
  });
  return permissions;
}

const assignedUsers = computed(() => {
  return (role: Role): User[] => {
    return useAccountStore().users.filter(
      (user) => user.roles.find((r) => r.role_id == role.id) != null
    );
  };
});

onMounted(() => {
  // run();
});
</script>

<template>
  <PageHeader title="Manage Roles" @back="() => $router.go(-1)" class="mb-8">
    <template #extra>
      <Button @click="newRoleDrawerVisible = true" id="btn-new-role">New Role</Button>
    </template>
  </PageHeader>

  <Spin :spinning="loading">
    <Tabs
      v-model:activeKey="roleTabKey"
      tab-position="left"
      animated
      size="large"
      :tabBarStyle="{ width: '200px' }"
    >
      <TabPane
        v-for="role in roles"
        :key="role.id"
        :tab="role.name"
        v-model:activeKey="roleTabKey"
      >
        <Tabs size="large" :animated="false">
          <template #rightExtra>
            <Button
              type="primary"
              @click="
                assignModal.role = role.id;
                assignModal.open = true;
              "
              >Assign Users</Button
            >
          </template>

          <!-- Permissions of the select role -->
          <TabPane key="1" tab="Permissions">
            <List bordered :data-source="getRolePermissions(role)">
              <template #renderItem="{ item }">
                <ListItem>{{ item }}</ListItem>
              </template>

              <template #header>
                <span color="success" class="w-full text-success"
                  >What this role can access</span
                >
              </template>

              <template #footer>
                <Button :danger="true" class="mr-5 w-full">Delete Role</Button>
              </template>
            </List>
          </TabPane>

          <!-- Users assigned to the select role -->
          <TabPane key="2" tab="Assigned users">
            <Table :columns="columns" :data-source="assignedUsers(role)" size="small">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                  {{ record.first_name }} {{ record.other_names || "" }}
                  {{ record.last_name }}
                </template>

                <template v-if="column.key === 'EMAIL'">
                  <a mailto="{{ record.email }}"> {{ record.email }}</a>
                </template>

                <template v-else-if="column.key === 'action'">
                  <Button type="primary" :ghost="true" size="small" :danger="true"
                    >Revoke
                  </Button>
                </template>
              </template>
            </Table>
          </TabPane>
        </Tabs>
      </TabPane>
    </Tabs>
  </Spin>

  <!-- User invite modal -->
  <NewRoleDrawer
    :open="newRoleDrawerVisible"
    @closed="newRoleDrawerVisible = false"
  ></NewRoleDrawer>

  <!-- User role assign modal  -->
  <Modal
    v-model:open="assignModal.open"
    title="Assign role to users"
    ok-text="Assign Role"
    :confirm-loading="store.loading"
    @ok="
      store
        .assignRole({ role_id: assignModal.role, users: assignModal.users })
        .then(() => assignModal.close())
    "
  >
    <Spin :spinning="store.loading">
      <FormItem label="Select users" class="pt-4">
        <Select
          v-model:value="assignModal.users"
          :show-search="true"
          mode="multiple"
          style="width: 100%"
          placeholder="Please select user(s)"
          title="Select users to assign the role to"
        >
          <SelectOption
            :value="user.id"
            :label="user.first_name"
            v-for="user in useAccountStore().users"
            >{{ user.first_name }}</SelectOption
          >
        </Select>
      </FormItem>
    </Spin>
  </Modal>
</template>
