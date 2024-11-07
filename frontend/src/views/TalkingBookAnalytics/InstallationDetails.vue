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
  TreeSelect,
  Alert,
  Menu,
} from "ant-design-vue";
import type { TreeSelectProps } from "ant-design-vue";
import { groupBy, sumBy, uniqBy } from "lodash";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import { pad } from "@/utils";
import { DateTime } from "luxon";

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
  _date_raw: DateTime;
}

const rows = ref<DataItem[]>([]);
const treeData = ref<TreeSelectProps["treeData"]>([]);
const selectedDate = ref<string>(null);

async function fetchStats(selection: string) {
  console.log(selection);
  // selectedDeployment.value = deployment.deployment;

  const recipients = await store.getRecipients();
  const dailies: Record<string, any> = {};
  // const dates: { [year: string]: { label: string; value: string; children: {[any]} } } = {};

  const _rows = (recipients.flatMap((r) => {
    return r.talkingbooks_deployed.map((tb) => {
      const date = DateTime.fromISO(tb.deployed_timestamp);
      const year = date.year;
      dailies[year] ??= { label: year, value: year.toString(), months: {} };

      const yearlies = dailies[year];
      const month = pad(date.month, 2);
      yearlies.months[month] ??= {
        label: date.monthLong,
        value: `${year}-${date.month}`,
        days: {},
      };

      const monthlies = yearlies.months[month];
      const day = pad(date.day, 2);
      monthlies.days[day] = {
        label: date.toFormat("EEEE, dd"),
        value: `${year}-${date.month}-${date.day}`,
      };

      return {
        community: r.community_name,
        component: r.component,
        group: r.group_name,
        date: date.toFormat("EEEE, MMMM d, yyyy, h:mm a"),
        deployment: tb.deployment_name,
        package: tb.content_package,
        whereUpdated: tb.location,
        updater: tb.username,
        test: tb.testing ? "Yes" : "No",
        tbId: tb.talkingbook_id,
        loaderId: tb.tbcdid,
        _date_raw: date,
      };
    });
  }) as unknown) as DataItem[];

  // Filter by date
  console.log(selection);
  if (selection === "all" || selection == null) {
    rows.value = _rows;
  } else {
    const [year, month, day] = selection.split("-");
    rows.value = _rows.filter((r) => {
      let ok = true;
      if (year != null) {
        ok = r._date_raw.year === +year;
      }
      if (month != null) {
        ok = r._date_raw.month === +month;
      }
      if (day != null) {
        ok = r._date_raw.day === +day;
      }
      return ok;
    });
  }

  // Generate date tree selection
  treeData.value = [
    { label: "All Installations", value: "all" },
    ...Object.keys(dailies).map((year) => {
      return {
        label: dailies[year].label,
        value: dailies[year].value,
        children: Object.values(dailies[year].months).map((month: any) => {
          // months sub tree
          return {
            label: month.label,
            value: month.value,
            children: Object.values(month.days).map((day: any) => {
              // days sub tree
              return {
                label: day.label,
                value: day.value,
              };
            }),
          };
        }),
      };
    }),
  ];
}

onMounted(async () => {
  await fetchStats(null);
});
</script>

<template>
  <PageHeader title="Installation Details" sub-title="Track talking book installations">
    <template #extra>
      <div style="width: 200px">
        <TreeSelect
          v-model:value="selectedDate"
          show-search
          class="w"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="Please select"
          allow-clear
          tree-default-expand-all
          :tree-data="treeData"
          tree-node-filter-prop="label"
          @change="fetchStats($event)"
        >
          <!-- <template #title="{ value: val, label }">
        <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
        <template v-else>{{ label }}</template>
      </template> -->
        </TreeSelect>
      </div>
    </template>

    <Alert type="info" :closable="true">
      <template #message>
        Installations statistics uploaded on {{ selectedDate }},
        {{ rows.length }} Deployments to TBs.
      </template>
    </Alert>
  </PageHeader>

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
