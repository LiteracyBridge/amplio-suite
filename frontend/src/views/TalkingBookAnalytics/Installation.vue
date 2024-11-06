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
import { DateTime } from "luxon";

import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net";

// DataTable.use(DataTablesCore);

const data = [
  [1, 2],
  [3, 4],
];

const store = useTalkingBookAnalyticStore();
const appStore = useAppStore();
const includeTesting = ref(false);

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
  {
    title: "#Test Installs",
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

async function fetchStats2(deployment: Deployment) {
  selectedDeployment.value = deployment.deployment;

  const [data] = await store.getRecipients(deployment.deployment);

  const table: { [community: string]: { row: DataItem; days_to_install: number } } = {}; // community->parentRow->children[]
  for (const r of data.recipients) {
    const community = table[r.district] ?? ({} as any);
    let installed = 0;
    let test_installs = 0;

    // biome-ignore lint/complexity/noForEach: <explanation>
    r.talkingbooks_deployed.forEach((tb) => {
      if (tb.testing) {
        test_installs++;
      } else {
        installed++;
      }
    });

    const parent: DataItem = community?.row ?? {
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
    parent.language =
      parent.language == null ? r.language : `${parent.language}, ${r.language}`;
    parent.agent = parent.agent == null ? r.agent : `${parent.agent}, ${r.agent}`;
    if (parent.talkingbook_id == null) {
      parent.talkingbook_id = Array.from(
        new Set(r.talkingbooks_deployed.map((i) => i.talkingbook_id))
      ).join(",");
    } else {
      parent.talkingbook_id = Array.from(
        new Set([
          ...parent.talkingbook_id.split(","),
          ...r.talkingbooks_deployed.map((i) => i.talkingbook_id),
        ])
      ).join(",");
    }

    // Compute days to install
    // Sort tb deployed by date and pick the last one
    const sorted = (r.talkingbooks_deployed || []).sort((a, b) => {
      return (
        new Date(b.deployed_timestamp).getTime() -
        new Date(a.deployed_timestamp).getTime()
      );
    });

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

    community.days_to_install ??= 0;
    community.days_to_install += days_to_install;
    parent.days_to_install = community.days_to_install / (parent.children.length + 1);
    parent.children.push({
      key: r.id,
      district: "",
      group_name: r.group_name,
      num_households: r.numhouseholds,
      num_tbs: r.numtbs,
      installed: installed,
      percent_installed: Math.round((installed / r.numtbs) * 100),
      days_to_install: days_to_install,
      support_entity: r.support_entity,
      listening_model: r.listening_model,
      agent: r.agent,
      language: r.language,
      talkingbook_id: r.talkingbooks_deployed.map((i) => i.talkingbook_id).join(","),
      test_installs: test_installs,
    });

    table[r.district] = { row: parent, days_to_install };
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
  rows.value = Object.values(table).map((t) => t.row);
}

// async function fetchStats(deployment: Deployment) {
//   selectedDeployment.value = deployment.deployment;

//   const sameInMostGroupsOfACommunity = [
//     "program",
//     "country",
//     "region",
//     "district",
//     "supportentity",
//     "model",
//     "languagecode",
//   ];

//   const [data] = await store.getRecipients(deployment.deployment);

//   // All tb deployment events have been organized by recipient. Compute some per-recipient data. NOTE: this
//   // also includes extraneous recipients.
//   const recipients = data.recipients.map((r) => {
//     // let talkingbookids = Object.keys(r);
//     // @ts-ignore
//     r.num_TBsInstalled = r.talkingbooks_deployed.length;
//     (r && Object.keys(r).length) || 0;
//     // installedThisRecipient.tbsInstalled = {};
//     if (includeTesting.value) {
//       // @ts-ignore
//       r.num_TBTestsInstalled = 0;
//     }
//     let days = 0;
//     for (const tb of r.talkingbooks_deployed) {
//       if (includeTesting.value && tb.testing) {
//         // @ts-ignore
//         r.num_TBTestsInstalled += 1;
//       }
//       // let tbInstalledTimestamp = tb.deployed_timestamp;
//       const tbDaysToInstall = DateTime.fromJSDate(tb.deployed_timestamp).diff(
//         DateTime.fromISO(deployment.start_date)
//       ).days;
//       // @ts-ignore
//       r.daystoinstall = tbDaysToInstall;
//       // @ts-ignore
//       tb.daystoinstall = tbDaysToInstall;
//       // @ts-ignore
//       r.tbid = tb.talkingbook_id;
//       // move installation event from installedThisRecipient to installedThisRecipient.tbsInstalled
//       // r.tbsInstalled[tb] = r[tb];
//       // delete r[tb];
//       days += tbDaysToInstall;
//     }

//     // @ts-ignore
//     r.daystoinstall = Math.round(days / r.num_TBsInstalled);
//     return r;
//   });

//   // Aggregate the communities' groups into one line, keeping the details.
//   const communitiesByName: { [community_name: string]: Record<string, any> } = {};
//   for (const recip of recipients) {
//     let communityName = recip.community_name;
//     let community = communitiesByName[communityName];
//     if (community) {
//       community.groups.push(recip);
//       community.numGroups++;
//       community.num_HHs += recip.numhouseholds;
//       community.num_TBs += recip.numtbs;
//       // @ts-ignore
//       community.num_TBsInstalled += recip.num_TBsInstalled;
//       if (includeTesting.value) {
//         // @ts-ignore
//         community.num_TBTestsInstalled += recip.num_TBTestsInstalled;
//       }
//       // Common properties are almost always the same for all groups in a community. But that's not a hard requirement,
//       // so if they are different, include them only in the group details.
//       // biome-ignore lint/complexity/noForEach: <explanation>
//       sameInMostGroupsOfACommunity.forEach((p) => {
//         // @ts-ignore
//         if (community[p] !== recip[p]) {
//           community[p] = "";
//         }
//       });
//     } else {
//       // New community.
//       community = Object.assign({}, recip);
//       community.groups = [];
//       community.numGroups = 0;
//       if (community.groupname) {
//         community.groups.push(recip);
//         community.numGroups = 1;
//         delete community.groupname;
//         delete community.recipientid;
//         delete community.tbsInstalled;
//       }
//     }
//     communitiesByName[communityName] = community;
//   }

//   // Turn it back to an array.
//   let communitiesList = Object.keys(communitiesByName).map(
//     (name) => communitiesByName[name]
//   );

//   // Now get daystoinstall for the communities with multiple groups.
//   for (const community of communitiesList) {
//     if (community.numGroups) {
//       let days = 0;
//       // biome-ignore lint/complexity/noForEach: <explanation>
//       community.groups.forEach((group: any) => {
//         console.log(group);
//         // biome-ignore lint/complexity/noForEach: <explanation>
//         group.talkingbooks_deployed.forEach((tb) => {
//           days += tb.daystoinstall;
//         });
//       });
//       community.daystoinstall = Math.round(days / community.num_TBsInstalled);
//     }
//   }

//   // let extraneousRecipients = Object.keys(installedPerRecipient).map((recipientid) => {
//   //   // the intalledPerRecipient already has a tbsInstalled (map of talkingbookids to deployment events)
//   //   // and daystoinstall, and possibly a num_TBTestsInstalled; Just add the recipientid, and we're good.
//   //   let extraneousRecipient = installedPerRecipient[recipientid];
//   //   extraneousRecipient.recipientid = recipientid;
//   //   let recipient = allRecipients.find((elem) => elem.recipientid === recipientid);
//   //   // If we can get the community name, do so, otherwise just use the recipientid.
//   //   extraneousRecipient.communityname = recipient ? recipient.communityname : recipientid;
//   //   extraneousRecipient.supportentity = recipient ? recipient.supportentity : "";
//   //   return extraneousRecipient;
//   // });

//   const result = {
//     communities: communitiesList,
//     // deploymentInfo: deploymentInfo,
//     // extraneousRecipients: extraneousRecipients,
//     summary: {
//       num_TBs: communitiesList.reduce((s, v) => {
//         return s + v.num_TBs;
//       }, 0),
//       num_TBsInstalled: communitiesList.reduce((s, v) => {
//         return s + v.num_TBsInstalled;
//       }, 0),
//       num_communities: communitiesList.length,
//       num_groups: communitiesList.reduce((s, v) => {
//         return s + (v.numGroups || 0);
//       }, 0),
//     },
//   };
//   console.log("hhereee");
//   console.log(result);

//   // console.log(data);
//   // const byGroup = groupBy(data.recipients, (d) => d.community_name);

//   // const mapped = Object.keys(byGroup).map((name) => {
//   //   const recipients = (byGroup[name] || []).map((r) => {
//   //     // @ts-ignore
//   //     r.key = r.id;

//   //     // Sort tb deployed by date and pick the last one
//   //     const sorted = (r.talkingbooks_deployed || []).sort((a, b) => {
//   //       return (
//   //         new Date(b.deployed_timestamp).getTime() -
//   //         new Date(a.deployed_timestamp).getTime()
//   //       );
//   //     });

//   //     // Calculate days to install since deployment start date
//   //     // @ts-ignore
//   //     r.days_to_install = 0;

//   //     if (sorted.length > 0) {
//   //       // @ts-ignore
//   //       r.days_to_install = Math.round(
//   //         (new Date().getTime() - new Date(sorted[0].deployed_timestamp).getTime()) /
//   //           (1000 * 60 * 60 * 24)
//   //       );
//   //     }

//   //     // @ts-ignore
//   //     r.talkingbook_id = sorted.map((t) => t.talkingbook_id).join(", ");

//   //     // @ts-ignore
//   //     r.installed = r.talkingbooks_deployed.length || 0;

//   //     // @ts-ignore
//   //     r.percent_installed = Math.round((r.installed / r.num_tbs) * 100);
//   //     return r;
//   //   });

//   //   if (recipients.length === 0) {
//   //     return;
//   //   }

//   //   // @ts-ignore
//   //   const community: DataItem = Object.assign({}, recipients[0]);
//   //   community.key = Math.random() * 9999999 + 1; // Generates a random number between 1 and 9999999

//   //   community.group_name = recipients[0].community_name;
//   //   community.num_tbs = sumBy(recipients, (r) => r.numtbs);
//   //   community.num_households = sumBy(recipients, (r) => r.numhouseholds);
//   //   community.children = (((recipients || []) as unknown) as DataItem[]).map((r) => {
//   //     r.district = "";
//   //     return r;
//   //   });

//   //   return community;
//   // });

//   // console.log(mapped);
//   // rows.value = [...result.communities];
// }

onMounted(async () => {
  if (selectedDeployment.value == null) {
    const count = appStore.deployments.length;
    if (count > 1) {
      // await fetchStats(appStore.deployments[count - 1]);
      await fetchStats2(appStore.deployments[count - 1]);
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
              @click="fetchStats2(d)"
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

  <DataTable :data="data" class="display">
    <thead>
      <tr>
        <th>A</th>
        <th>B</th>
      </tr>
    </thead>
  </DataTable>

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
    ?:sticky="true"
    :scroll="{ x: 500 }"
  >
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
