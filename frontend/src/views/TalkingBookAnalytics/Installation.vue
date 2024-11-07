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
const summary = ref({ installed: 0, communities: 0, groups: 0, test_installs: 0 });
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
    // width: "60px",
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
    ellipsis: true,
  },
  {
    title: "Updated By",
    dataIndex: "agent",
    key: "agent",
    ellipsis: true,
  },
  {
    title: "TBLoader ID",
    dataIndex: "talkingbook_id",
    key: "talkingbook_id",
    with: "100%",
    // ellipsis: true,
  },
  {
    title: "# Test Installs",
    dataIndex: "test_installs",
    key: "test_installs",
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
  test_installs: number;
  children?: DataItem[];
}

const rows = ref<DataItem[]>([]);

async function fetchStats(deployment: Deployment) {
  console.log(deployment);
  selectedDeployment.value = deployment.deployment;

  const recipients = await store.getRecipients();
  const _summary = { installed: 0, communities: 0, groups: 0, test_installs: 0 };
  const table: { [community: string]: DataItem } = {}; // community->parentRow->children[]
  for (const r of recipients) {
    if (table[r.community_name] == null) {
      _summary.communities++;
    }

    let installed = 0;
    let test_installs = 0;

    // Record the (latest) installation to the Talking Book
    const sorted = (r.talkingbooks_deployed || [])
      .filter((tb) => tb.deployment_name === deployment.deployment)
      .sort((a, b) => {
        return (
          new Date(b.deployed_timestamp).getTime() -
          new Date(a.deployed_timestamp).getTime()
        );
      });

    // In case of duplicate. Should we keep the oldest or newest? It usually doesn't matter, because, usually, they'll be in the same session.
    // But if it was re-installed due to a problem, then it wasn't really fully available until the correction.
    // Keep the latest one.
    const uniqInstalls = uniqBy(sorted, (tb) => tb.talkingbook_id);
    // biome-ignore lint/complexity/noForEach: <explanation>
    uniqInstalls.forEach((tb) => {
      if (tb.testing) {
        test_installs++;
      } else {
        installed++;
      }
    });

    const parent: DataItem = table[r.community_name] ?? {
      key: Math.random() * 9999999 + 1, // use random number as id
      district: r.district,
      group_name: r.community_name,
      num_households: 0,
      num_tbs: 0,
      installed: 0,
      percent_installed: 0,
      days_to_install: 0,
      support_entity: r.support_entity,
      listening_model: r.listening_model,
      children: [],
      language: null,
      agent: null,
      talkingbook_id: null,
      test_installs: 0,
    };

    parent.num_households += r.numhouseholds;
    parent.num_tbs += r.numtbs;
    parent.installed += installed;
    parent.test_installs += test_installs;
    parent.percent_installed = Math.round((parent.installed / parent.num_tbs) * 100);
    // parent.agent = parent.agent == null ? r.agent : `${parent.agent}, ${r.agent}`;

    // if (parent.agent == null) {
    //   parent.agent = r.agent;
    // } else {
    //   parent.agent = Array.from(new Set([...parent.agent.split(","), r.agent])).join(",");
    // }

    if (parent.language == null) {
      parent.language = r.language;
    } else {
      parent.language = Array.from(
        new Set([...parent.language.split(","), r.language])
      ).join(",");
    }

    // if (parent.talkingbook_id == null) {
    //   parent.talkingbook_id = Array.from(
    //     new Set(r.talkingbooks_deployed.map((i) => i.talkingbook_id))
    //   ).join(",");
    // } else {
    //   parent.talkingbook_id = Array.from(
    //     new Set([
    //       ...parent.talkingbook_id.split(","),
    //       ...r.talkingbooks_deployed.map((i) => i.talkingbook_id),
    //     ])
    //   ).join(",");
    // }

    // Compute days to install

    // Calculate days to install since deployment start date
    // @ts-ignore
    let days_to_install = 0;

    if (sorted.length > 0) {
      // @ts-ignore
      days_to_install = Math.round(
        (new Date().getTime() - new Date(sorted[0].deployed_timestamp).getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }

    parent.days_to_install =
      parent.days_to_install > days_to_install ? parent.days_to_install : days_to_install;
    parent.children.push({
      key: r.id,
      district: "",
      group_name: r.group_name,
      num_households: r.numhouseholds,
      num_tbs: r.numtbs,
      installed: installed,
      percent_installed: Math.round((installed / r.numtbs) * 100),
      days_to_install: days_to_install,
      support_entity: "",
      listening_model: "",
      agent: r.agent,
      language: r.language,
      talkingbook_id: uniqInstalls.map((i) => i.talkingbook_id).join(","),
      test_installs: test_installs,
    });

    table[r.community_name] = parent;
    _summary.installed += installed;
  }

  // console.log(data);
  // const byGroup = groupBy(data.recipients, (d) => d.community_name);

  // const mapped = Object.keys(byGroup).map((name) => {
  //   const recipients = (byGroup[name] || []).map((r) => {
  //     // @ts-ignore
  //     r.key = r.id;

  //     // Sort tb deployed by date and pick the last one
  //     const sorted = (r.talkingbooks_deployed || []).sort((a, b) => {
  //       return (
  //         new Date(b.deployed_timestamp).getTime() -
  //         new Date(a.deployed_timestamp).getTime()
  //       );
  //     });

  //     // Calculate days to install since deployment start date
  //     // @ts-ignore
  //     r.days_to_install = 0;

  //     if (sorted.length > 0) {
  //       // @ts-ignore
  //       r.days_to_install = Math.round(
  //         (new Date().getTime() - new Date(sorted[0].deployed_timestamp).getTime()) /
  //           (1000 * 60 * 60 * 24)
  //       );
  //     }

  //     // @ts-ignore
  //     r.talkingbook_id = sorted.map((t) => t.talkingbook_id).join(", ");

  //     // @ts-ignore
  //     r.installed = r.talkingbooks_deployed.length || 0;

  //     // @ts-ignore
  //     r.percent_installed = Math.round((r.installed / r.num_tbs) * 100);
  //     return r;
  //   });

  //   if (recipients.length === 0) {
  //     return;
  //   }

  //   // @ts-ignore
  //   const community: DataItem = Object.assign({}, recipients[0]);
  //   community.key = Math.random() * 9999999 + 1; // Generates a random number between 1 and 9999999

  //   community.group_name = recipients[0].community_name;
  //   community.num_tbs = sumBy(recipients, (r) => r.numtbs);
  //   community.num_households = sumBy(recipients, (r) => r.numhouseholds);
  //   community.children = (((recipients || []) as unknown) as DataItem[]).map((r) => {
  //     r.district = "";
  //     return r;
  //   });

  //   return community;
  // });

  console.log(table);
  rows.value = Object.values(table).map((t) => {
    _summary.groups += Object.values(groupBy(t.children, (r) => r.group_name)).length;
    return t;
  });
  summary.value = _summary;
}

onMounted(async () => {
  if (selectedDeployment.value == null) {
    const count = appStore.deployments.length;
    if (count > 1) {
      // await fetchStats(appStore.deployments[count - 1]);
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
        You're viewing talking books installation for
        {{ selectedDeployment }} deployment. The Deployment has been installed to
        {{ summary.installed }} Talking Books in {{ summary.communities }} communities and
        {{ summary.groups }}
        groups.
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
