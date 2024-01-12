<script lang="ts" setup>
import {
  Button,
  Descriptions,
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
  Select,
} from "ant-design-vue";
import { ref } from "vue";
import NewRoleDrawer from "./NewRoleDrawer.vue";

const newRoleDrawerVisible = ref(false);
const roleView = ref("1");
const assignmentModal = ref({
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
    title: "Actions",
    key: "action",
  },
];

const data = ["Can update TB Loader", "Can create staff"];
</script>

<template>
  <PageHeader title="Manage Roles" @back="() => $router.go(-1)"
    class="mb-8"

  >
    <template #extra>
      <Button key="3" @click="newRoleDrawerVisible = true" id="btn-new-role">New Role</Button>
      <!-- <Button key="1" type="primary">Invoice someone</Button> -->
    </template>
  </PageHeader>

  <Tabs
    activeKey="1"
    tab-position="left"
    animated
    size="large"
    :tabBarStyle="{ width: '200px' }"
  >
    <TabPane key="1" tab="Tab 1">
      <!-- <Row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }"> -->
      <!-- <Col :span="10"> -->
      <Tabs v-model:activeKey="roleView" size="large" :animated="false">
        <template #rightExtra>
          <Button type="primary" @click="assignmentModal.open = true"
            >Assign Users</Button
          >
        </template>

        <TabPane key="1" tab="Permissions">
          <List bordered :data-source="data">
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

        <TabPane key="2" tab="Assigned users">
          <Table :columns="columns" :data-source="data" size="small">
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
    <TabPane key="2" tab="Tab 2">Content of Tab 2</TabPane>
    <TabPane key="3" tab="Tab 3">Content of Tab 3</TabPane>
  </Tabs>

  <!-- User invite modal -->
  <NewRoleDrawer
    :open="newRoleDrawerVisible"
    @closed="newRoleDrawerVisible = false"
  ></NewRoleDrawer>

  <!-- User role assign modal  -->
  <Modal v-model:open="assignmentModal.open" title="Assign role to users" ok-text="Assign Role">
    <FormItem label="Select users" class="pt-4">
      <Select mode="multiple" style="width: 100%" placeholder="Please select user">
        <Option value="jack">Jack (100)</Option>
        <Option value="lucy">Lucy (101)</Option>
      </Select>
    </FormItem>
  </Modal>
</template>
