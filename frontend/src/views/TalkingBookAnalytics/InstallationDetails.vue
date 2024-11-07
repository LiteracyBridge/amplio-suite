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
import { groupBy, sumBy, uniqBy } from "lodash";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import type { Deployment } from "@/models/deployment";
import { DownOutlined } from "@ant-design/icons-vue";


const store = useTalkingBookAnalyticStore();
const appStore = useAppStore();

const selectedDeployment = ref(undefined);
const columns = [
  {
    title: "Talking Book",
    dataIndex: "tbId",
    key: "tbId",
  },
  {
    title: "Component",
    dataIndex: "component",
    key: "component",
  },
  {
    title: "Community",
    dataIndex: "community",
    key: "community",
  },
  {
    title: "Group",
    dataIndex: "group",
    key: "group",
  },
  {
    title: "Date and Time",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Deployment",
    dataIndex: "deployment",
    key: "deployment",
  },
  {
    title: "Package",
    dataIndex: "package",
    key: "package",
  },
  {
    title: "Where Updated",
    dataIndex: "whereUpdated",
    key: "whereUpdated",
  },
  {
    title: "Test?",
    dataIndex: "test",
    key: "test",
  },
  {
    title: "ID",
    dataIndex: "loaderId",
    key: "loaderId",
  },
];

interface DataItem {
  community: string;
  component: string;
  group: string;
  date: string;
  deployment: string;
  package: string;
  whereUpdated: string;
  updater: string;
  test: string;
  tbId: string;
  loaderId: string;
}

const rows = ref<DataItem[]>([]);

async function fetchStats(deployment: Deployment) {
  console.log(deployment);
  selectedDeployment.value = deployment.deployment;

  const recipients = await store.getRecipients();

  const _rows = recipients.flatMap((r) => {
    return r.talkingbooks_deployed.map((tb) => {
      return {
        community: r.community_name,
        component: r.component,
        group: r.group_name,
        date: tb.deployed_timestamp,
        deployment: tb.deployment_name,
        package: tb.content_package,
        whereUpdated: tb.location,
        updater: tb.username,
        test: tb.testing ? "Yes" : "No",
        tbId: tb.talkingbook_id,
        loaderId: tb.tbcdid,
      };
    });
  }) as unknown as DataItem[];

  rows.value = _rows
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
  <PageHeader title="Installation Details" sub-title="Track talking book installations">
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

    <!-- <Alert type="info" :closable="true" v-if="selectedDeployment != null">
      <template #message>
        You're viewing talking books installation for
        {{ selectedDeployment }} deployment. The Deployment has been installed to
        {{ summary.installed }} Talking Books in {{ summary.communities }} communities and
        {{ summary.groups }}
        groups.
      </template>
    </Alert> -->
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

  <Table
    :columns="columns"
    :data-source="rows"
    size="small"
    :loading="store.loading"
    :sticky="true"
    :scroll="{ x: '70%' }"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    class="ant-table-striped"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'installed'">
        <Tooltip>
          <template #title
            >The number of Talking Books reported to have been installed.</template
          >
          # Installed
        </Tooltip>
      </template>
      <template v-if="column.key === 'days_to_install'">
        <Tooltip>
          <template #title
            >The average number of days before the Talking Books were installed with the
            Deployment.</template
          >
          Days to Install
        </Tooltip>
      </template>
      <template v-if="column.key === 'agent'">
        <Tooltip>
          <template #title>Who installed the content onto the Talking Books.</template>
          Updated By
        </Tooltip>
      </template>
      <template v-if="column.key === 'talkingbook_id'">
        <Tooltip>
          <template #title
            >TB-Loader ID of the laptop/phone that performed the update of the Talking
            Books.</template
          >
          TBLoader ID
        </Tooltip>
      </template>
      <template v-if="column.key === 'test_installs'">
        <Tooltip>
          <template #title
            >Number of installations to this community / group for which the installer
            checked</template
          >
          # Test Installs
        </Tooltip>
      </template>
    </template>

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

<style scoped>
/* .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
} */
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>
