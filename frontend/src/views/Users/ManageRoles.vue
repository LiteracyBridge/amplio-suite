<script lang="ts" setup>
import {
  Button,
  Descriptions,
  DescriptionsItem,
  PageHeader,
  List,
  ListItem,
  Tabs,
  TabPane,
  Row,
  Col,
  Table,
  Tag,
} from "ant-design-vue";
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import NewRoleDrawer from "./NewRoleDrawer.vue";
const newRoleDrawerVisible = ref(false);

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

const data = ["Can update TB Loader", "Can create staff"];
</script>

<template>
  <PageHeader title="Manage Roles" @back="() => $router.go(-1)">
    <template #extra>
      <Button key="3" @click="newRoleDrawerVisible = true">New Role</Button>
      <!-- <Button key="1" type="primary">Invoice someone</Button> -->
    </template>

    <!-- <Descriptions size="small" :column="3">
      <DescriptionsItem label="Created">Lili Qu</DescriptionsItem>
    </Descriptions> -->
  </PageHeader>

  <!-- <h3 :style="{ margin: '16px 0' }">Small Size</h3> -->

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
      <List bordered :data-source="data">
        <template #renderItem="{ item }">
          <ListItem>{{ item }}</ListItem>
        </template>
        <template #header>
          <span color="success" class="w-full text-success"
            >What this role can access</span
          >
        </template>
      </List>
      <!-- </Col> -->
      <!-- <Col :span="10">
          <List size="small" bordered :data-source="data">
            <template #renderItem="{ item }">
              <ListItem>{{ item }}</ListItem>
            </template>
            <template #header>
              <Tag color="error"> What this role cannot access </Tag>
            </template>
          </List>
        </Col> -->
      <!-- </Row> -->
    </TabPane>
    <TabPane key="2" tab="Tab 2">Content of Tab 2</TabPane>
    <TabPane key="3" tab="Tab 3">Content of Tab 3</TabPane>
  </Tabs>

  <NewRoleDrawer
    :open="newRoleDrawerVisible"
    @closed="newRoleDrawerVisible = false"
  ></NewRoleDrawer>
</template>
