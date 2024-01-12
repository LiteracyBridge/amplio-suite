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
import { onMounted, ref } from "vue";
import NewRoleDrawer from "./NewRoleDrawer.vue";
import { useRolesStore } from "@/store/roles.store";
import { useRequest } from "vue-request";
import { Role } from "@/models/role";
import { toSentenceCase, toTitleCase } from "@/utils";

const store = useRolesStore();

const roleTabKey = ref(undefined);
const newRoleDrawerVisible = ref(false);
const assignmentModal = ref({
  open: false,
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
            <Button type="primary" @click="assignmentModal.open = true"
              >Assign Users</Button
            >
          </template>

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

          <!-- TODO: implement showing assigned users  -->
          <TabPane key="2" tab="Assigned users">
            <Table :columns="columns" :data-source="roles" size="small">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                  <a> {{ record.name }} [email as subtitle] </a>
                </template>

                <template v-else-if="column.key === 'action'">
                  <span>Revoke </span>
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
    v-model:open="assignmentModal.open"
    title="Assign role to users"
    ok-text="Assign Role"
  >
    <FormItem label="Select users" class="pt-4">
      <Select mode="multiple" style="width: 100%" placeholder="Please select user">
        <SelectOption value="jack">Jack (100)</SelectOption>
        <SelectOption value="lucy">Lucy (101)</SelectOption>
      </Select>
    </FormItem>
  </Modal>
</template>
