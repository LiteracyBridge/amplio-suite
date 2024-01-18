<script lang="ts" setup>
import {
  Button,
  FormItem,
  Form,
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
import { computed, createVNode, onMounted, ref } from "vue";
import NewRoleDrawer from "./NewRoleDrawer.vue";
import { useRolesStore } from "@/store/roles.store";
import { useRequest } from "vue-request";
import { Role, Permission } from "@/models/role";
import { toSentenceCase, toTitleCase } from "@/utils";
import { User } from "@/models/user";
import { useAccountStore } from "@/store/account";
import { ExclamationCircleFilled } from "@ant-design/icons-vue";

const store = useRolesStore();

const roleTabKey = ref(undefined);
const newRoleDrawerVisible = ref(false);
const assignModal = ref({
  open: false,
  form: {
    role_id: undefined as number,
    program_id: undefined as number,
    users: [] as number[],
  },
  close: () => {
    assignModal.value.open = false;
    assignModal.value.form = {
      role_id: undefined,
      users: [],
      program_id: undefined,
    };
  },
});

const { loading } = useRequest(store.fetchRoles, {
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
    key: "email",
  },
  {
    title: "Actions",
    key: "action",
  },
];

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

const confirmRevoke = (user_id: number, role_id: number) => {
  Modal.confirm({
    title: "Are you sure you want to revoke this role from this user?",
    icon: createVNode(ExclamationCircleFilled),
    content:
      "The user will no longer have access to the role and its permissions on the system and will have to be assigned again!",
    onOk() {
      return store.revokeRole({ user_id, role_id });
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel() {},
  });
};

const deleteRole = (role_id: number) => {
  Modal.confirm({
    title: "Are you sure you want to delete this role?",
    icon: createVNode(ExclamationCircleFilled),
    content:
      "The role will be deleted from the system and all users assigned to it will no longer have access to the role and its permissions on the system!",
    onOk() {
      return store.deleteRole(role_id);
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel() {},
  });
};
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
        v-for="role in store.roles"
        :key="role.id"
        :tab="role.name"
        v-model:activeKey="roleTabKey"
      >
        <Tabs size="large" :animated="false">
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
                <Button
                  :danger="true"
                  class="mr-5 w-full"
                  @click="deleteRole(role.id)"
                  v-if="useAccountStore().can('*', Permission.DeleteRole)"
                  >Delete Role</Button
                >
              </template>
            </List>
          </TabPane>

          <!-- Users assigned to the select role -->
          <TabPane key="2" tab="Assigned users">
            <Table :columns="columns" :data-source="assignedUsers(role)" size="small">
              <template #bodyCell="{ column, record: user }">
                <template v-if="column.key === 'name'">
                  {{ user.first_name }} {{ user.other_names || "" }}
                  {{ user.last_name }}
                </template>

                <template v-if="column.key === 'email'">
                  <a mailto="{{ record.email }}"> {{ user.email }}</a>
                </template>

                <template v-else-if="column.key === 'action'">
                  <Button
                    type="primary"
                    title="Revoke role from user"
                    :ghost="true"
                    size="small"
                    :danger="true"
                    @click="confirmRevoke(user.id, role.id)"
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
</template>
