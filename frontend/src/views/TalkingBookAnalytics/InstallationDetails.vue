<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import {
  Tag,
  Tooltip,
  Table,
  PageHeader,
  TreeSelect,
  Alert,
} from "ant-design-vue";
import type { TreeSelectProps } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { pad } from "@/utils";
import { DateTime } from "luxon";

const store = useTalkingBookAnalyticStore();
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
const recipients = ref<DataItem[]>([]);
const treeData = ref<TreeSelectProps["treeData"]>([]);
const selectedDate = ref<string>(null);

async function fetchStats() {
  const data = await store.getRecipients();
  const dailies: Record<string, any> = {};
  let latestDeployment: DateTime = null;

  const _rows = (data.flatMap((r) => {
    return r.talkingbooks_deployed.map((tb) => {
      const date = DateTime.fromISO(tb.deployed_timestamp);
      if (latestDeployment == null) {
        latestDeployment = date;
      } else if (date > latestDeployment) {
        latestDeployment = date;
      }

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

  recipients.value = _rows;

  selectedDate.value = latestDeployment?.toFormat("yyyy-mm-dd");
  onDateChanged(selectedDate.value);

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

async function onDateChanged(selection: string) {
  console.log(selection);

  if (selection === "all" || selection == null) {
    rows.value = [...recipients.value];
  } else {
    const [year, month, day] = selection.split("-");
    rows.value = recipients.value.filter((r) => {
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
}

onMounted(async () => {
  await fetchStats();
});
</script>

<template>
  <PageHeader title="Installation Details" sub-title="Track talking book installations">
    <template #extra>
      <span>Filter by Date:</span>
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
          @change="onDateChanged($event)"
        >
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
      <template v-if="column.key === 'group'">
        <Tooltip>
          <template #title
            >The group's name, or Support Entity's name, if there is no group. Support
            Entity names are prefixed with SE:.</template
          >
          Group
        </Tooltip>
      </template>
      <template v-if="column.key === 'whereUpdated'">
        <Tooltip>
          <template #title
            >Where did the updater indicate they were, during the installation?</template
          >
          Location
        </Tooltip>
      </template>
      <template v-if="column.key === 'loaderId'">
        <Tooltip>
          <template #title
            >The TB-Loader id of the laptop or phone that performed the
            installation.</template
          >
          ID
        </Tooltip>
      </template>
      <template v-if="column.key === 'date'">
        <Tooltip>
          <template #title
            >When was this Talking Book installed? Time is in UTC..</template
          >
          Date and Time
        </Tooltip>
      </template>
      <template v-if="column.key === 'test'">
        <Tooltip>
          <template #title
            >Was the 'Testing the Deployment' box checked on the TB-Loader?</template
          >
          Test?
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
