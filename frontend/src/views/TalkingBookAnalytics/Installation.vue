<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import { Tag, Row, Tooltip, Table } from "ant-design-vue";
import { groupBy, sumBy } from "lodash";

import { onMounted, ref } from "vue";

const store = useTalkingBookAnalyticStore();
const columns = [
  {
    title: "District",
    dataIndex: "district",
    key: "district",
  },
  {
    title: "Community/Group",
    dataIndex: "group_name",
    key: "group_name",
    // width: "12%",
  },
  {
    title: "# HHs",
    dataIndex: "num_households",
    // width: "30%",
    key: "num_households",
  },
  {
    title: "# TBs",
    dataIndex: "num_tbs",
    // width: "30%",
    key: "num_tbs",
  },
  {
    title: "# Installed",
    dataIndex: "installed",
    // width: "30%",
    key: "installed",
  },
];

interface DataItem {
  key: number;
  name: string;
  age: number;
  address: string;
  children?: DataItem[];
}

interface Item {
  key: string | number;
  district: string;
  group_name: string;
  num_households: number;
  num_tbs: number;
  installed: number;
  percent_installed: number;
  days_to_install: number;
  support_entity: string;
  model: string;
  language: string;
  updated_by: string;
  tbloader_id: string;
  children: Item[];
}

const rows = ref<Item[]>([]);

onMounted(async () => {
  const data = await store.getRecipients();

  const byGroup = groupBy(data, "community_name");

  const temp: Item[] = [];
  const mapped = Object.keys(byGroup).map((name) => {
    const recipients = byGroup[name].map((r) => {
      r.key = r.id;
      return r;
    });

    if (recipients.length == 0) {
      // TODO: handle this case
      return;
    }

    // @ts-ignore
    const community: Item = Object.assign({}, recipients[0]);
    community.key = Math.random() * 9999999 + 1; // Generates a random number between 1 and 9999999
    community.group_name = recipients[0].community_name;
    community.num_tbs = sumBy(recipients, "num_tbs");
    community.num_households = sumBy(recipients, "num_households");
    community.children = ((recipients || []) as Item[]).map((r) => {
      r.district = "";
      return r;
    });
    // TODO: calculate percent installed

    return community;
  });

  console.log(mapped);

  rows.value = [...mapped];
});
const data: DataItem[] = [
  {
    key: 1,
    name: "John Brown sr.",
    age: 60,
    address: "New York No. 1 Lake Park",
    children: [
      {
        key: 11,
        name: "John Brown",
        age: 42,
        address: "New York No. 2 Lake Park",
      },
      {
        key: 12,
        name: "John Brown jr.",
        age: 30,
        address: "New York No. 3 Lake Park",
        children: [
          {
            key: 121,
            name: "Jimmy Brown",
            age: 16,
            address: "New York No. 3 Lake Park",
          },
        ],
      },
      {
        key: 13,
        name: "Jim Green sr.",
        age: 72,
        address: "London No. 1 Lake Park",
        children: [
          {
            key: 131,
            name: "Jim Green",
            age: 42,
            address: "London No. 2 Lake Park",
            children: [
              {
                key: 1311,
                name: "Jim Green jr.",
                age: 25,
                address: "London No. 3 Lake Park",
              },
              {
                key: 1312,
                name: "Jimmy Green sr.",
                age: 18,
                address: "London No. 4 Lake Park",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];

const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: Item[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
  },
  onSelect: (record: Item, selected: boolean, selectedRows: Item[]) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected: boolean, selectedRows: Item[], changeRows: Item[]) => {
    console.log(selected, selectedRows, changeRows);
  },
});

// const columns = [
//   { title: "Name", dataIndex: "name", key: "name", fixed: true },
//   { title: "Age", dataIndex: "age", key: "age" },
//   { title: "Address", dataIndex: "address", key: "address" },
//   { title: "Action", key: "action" },
// ];

// const data = [
//   {
//     key: 1,
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//     description:
//       "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
//   },
//   {
//     key: 2,
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//     description:
//       "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
//   },
//   {
//     key: 3,
//     name: "Joe Black",
//     age: 32,
//     address: "Sidney No. 1 Lake Park",
//     description:
//       "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.",
//   },
// ];
</script>

<template>
  <Row>
    <Tooltip>
      <template #title
        >An excess of Talking Books seem to have been installed. This may be fine, but
        needs explanation.</template
      >
      <Tag color="purple"> &gt;100% Excess </Tag>
    </Tooltip>
    <Tooltip>
      <template #title>Perfect!</template>
      <Tag color="pink">100% Great! </Tag>
    </Tooltip>
    <Tooltip>
      <template #title
        >Acceptable, provided there is a good rationale for missing
        installations.</template
      >
      <Tag color="orange">85 - 99% Acceptable</Tag>
    </Tooltip>
    <Tooltip>
      <template #title
        >Unacceptable performance against contractual obligations.</template
      >
      <Tag color="green">60 - 84% Unacceptable</Tag>
    </Tooltip>
    <Tooltip>
      <template #title>This is a failure to meet our contractual obligations.</template>
      <Tag color="cyan">21 - 59% Failed</Tag>
    </Tooltip>
    <Tooltip>
      <template #title
        >Is the community / group still participating in the Program?</template
      >
      <Tag color="blue">0 - 20% Dead</Tag>
    </Tooltip>
  </Row>

  <!-- <Table :columns="columns" :data-source="data">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <a>Delete</a>
      </template>
    </template>

    <template #expandedRowRender="{ record, index, indent, expanded }">
      <p>{{ indent }}</p>

      <p style="margin: 0">
        {{ record.description }}
      </p>
    </template>
    <template #expandColumnTitle>
      <span style="color: red">More</span>
    </template>
  </Table> -->

  <Table :columns="columns" :data-source="rows" :row-selection="rowSelection" />
</template>
