<script lang="ts" setup>
import {
  Button,
  Descriptions,
  DescriptionsItem,
  PageHeader,
  Table,
} from "ant-design-vue";
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
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
      <!-- <Button key="2">Add Staff</Button> -->
      <Button key="1" type="primary">Invoice someone</Button>
    </template>

    <Descriptions size="small" :column="3">
      <DescriptionsItem label="Created">Lili Qu</DescriptionsItem>
      <!-- <a-descriptions-item label="Association">
        <a>421421</a>
      </a-descriptions-item>
      <a-descriptions-item label="Creation Time">2017-01-10</a-descriptions-item>
      <a-descriptions-item label="Effective Time">2017-10-10</a-descriptions-item>
      <a-descriptions-item label="Remarks">
        Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
      </a-descriptions-item> -->
    </Descriptions>
  </PageHeader>

  <Table :columns="columns" :data-source="data">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          Working
          <!-- {{ tag.toUpperCase() }} -->
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span> Come here </span>
      </template>
    </template>
  </Table>
</template>
