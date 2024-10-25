<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import {
  Tag,
  Row,
  Tooltip,
  Table,
  PageHeader,
  Divider,
  Button,
  Dropdown,
  MenuItem,
  Alert,
  Menu,
} from "ant-design-vue";
import { groupBy, sumBy } from "lodash";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import type { Deployment } from "@/models/deployment";
import { DownOutlined } from "@ant-design/icons-vue";

const store = useTalkingBookAnalyticStore();
const appStore = useAppStore();

const selectedDeployment = ref(undefined);
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
  {
    title: "% Installed",
    dataIndex: "percent_installed",
    key: "percent_installed",
  },
  {
    title: "Days to Install",
    dataIndex: "days_to_install",
    key: "days_to_install",
  },
  {
    title: "Support Entity",
    dataIndex: "support_entity",
    key: "support_entity",
  },
  {
    title: "Listening Model",
    dataIndex: "listening_model",
    key: "listening_model",
  },
  {
    title: "Language",
    dataIndex: "language",
    key: "language",
  },
  {
    title: "Updated By",
    dataIndex: "agent",
    key: "agent",
  },
  {
    title: "TBLoader ID",
    dataIndex: "talkingbook_id",
    key: "talkingbook_id",
    ellipsis: true,
  },
];

interface DataItem {
  key: string | number;
  district: string;
  group_name: string;
  num_households: number;
  num_tbs: number;
  installed: number;
  percent_installed: number;
  days_to_install: number;
  support_entity: string;
  listening_model: string;
  language: string;
  agent: string;
  talkingbook_id: string;
  children: DataItem[];
}

const rows = ref<DataItem[]>([]);

async function fetchStats(deployment: Deployment) {
  selectedDeployment.value = deployment.deployment;

  const data = await store.getRecipients(deployment.deployment);

  console.log(data);
  const byGroup = groupBy(data, (d) => d.community_name);

  const mapped = Object.keys(byGroup).map((name) => {
    const recipients = (byGroup[name] || []).map((r) => {
      // @ts-ignore
      r.key = r.id;

      // Sort tb deployed by date and pick the last one
      const sorted = (r.talkingbooks_deployed || []).sort((a, b) => {
        return (
          new Date(b.deployed_timestamp).getTime() -
          new Date(a.deployed_timestamp).getTime()
        );
      });

      // Calculate days to install since deployment start date
      // @ts-ignore
      r.days_to_install = 0;

      if (sorted.length > 0) {
        // @ts-ignore
        r.days_to_install = Math.round(
          (new Date().getTime() - new Date(sorted[0].deployed_timestamp).getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }

      // @ts-ignore
      r.talkingbook_id = sorted.map((t) => t.talkingbook_id).join(", ");

      // @ts-ignore
      r.installed = r.talkingbooks_deployed.length || 0;

      // @ts-ignore
      r.percent_installed = Math.round((r.installed / r.num_tbs) * 100);
      return r;
    });

    if (recipients.length === 0) {
      return;
    }

    // @ts-ignore
    const community: DataItem = Object.assign({}, recipients[0]);
    community.key = Math.random() * 9999999 + 1; // Generates a random number between 1 and 9999999

    community.group_name = recipients[0].community_name;
    community.num_tbs = sumBy(recipients, (r) => r.numtbs);
    community.num_households = sumBy(recipients, (r) => r.numhouseholds);
    community.children = (((recipients || []) as unknown) as DataItem[]).map((r) => {
      r.district = "";
      return r;
    });

    return community;
  });

  console.log(mapped);
  rows.value = [...mapped];
}

onMounted(async () => {
  if (selectedDeployment.value == null) {
    const count = appStore.deployments.length;
    if (count > 1) {
      await fetchStats(appStore.deployments[count - 1]);
    }
  }
});
</script>

<template>
  <PageHeader title="TB Installations" sub-title="Track talking book installations">
    <template #extra>
      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem
              :key="d.deploymentnumber"
              v-for="d in appStore.deployments"
              @click="fetchStats(d)"
            >
              <span>Deployment {{ d.deploymentnumber }}</span>
            </MenuItem>
          </Menu>
        </template>
        <Button>
          Change Deployment
          <DownOutlined />
        </Button>
      </Dropdown>
    </template>

    <Alert type="info" :closable="true" v-if="selectedDeployment != null">
      <template #message>
        You'r viewing talking books installation for
        {{ selectedDeployment }} deployment
      </template>
    </Alert>
  </PageHeader>

  <!-- <Divider></Divider> -->
  <Row class="my-5">
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

  <Table :columns="columns" :data-source="rows" size="small" :loading="store.loading">
    <template #bodyCell="{ record, column }">
      <template v-if="column.key === 'percent_installed'">
        <Tag
          class="w-full text-center"
          v-if="record.percent_installed > 100"
          color="purple"
        >
          {{ record.installed }}
        </Tag>
        <Tag
          class="w-full text-center"
          v-else-if="record.percent_installed == 100"
          color="pink"
        >
          {{ record.installed }}
        </Tag>
        <Tag
          class="w-full text-center"
          v-else-if="record.percent_installed >= 85 && record.percent_installed <= 99"
          color="orange"
        >
          {{ record.installed }}
        </Tag>
        <Tag
          class="w-full text-center"
          v-else-if="record.percent_installed >= 60 && record.percent_installed <= 84"
          color="green"
        >
          {{ record.installed }}
        </Tag>
        <Tag
          class="w-full text-center"
          v-else-if="record.percent_installed >= 21 && record.percent_installed <= 59"
          color="cyan"
        >
          {{ record.installed }}
        </Tag>
        <Tag class="w-full text-center" v-else color="blue">
          {{ record.installed }}
        </Tag>
      </template>
    </template>
  </Table>
</template>
