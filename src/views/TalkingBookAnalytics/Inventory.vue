<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
import { Tag, Tooltip, Table, PageHeader } from "ant-design-vue";
import { onMounted, ref } from "vue";

interface Column {
  title: string;
  dataIndex: string;
  key: string;
}

const store = useTalkingBookAnalyticStore();
const columns = ref<Column[]>([]);
const rows = ref<Record<string, any>[]>([]);

async function fetchStats() {
  const data = await store.inventory();
  console.log(data);

  const communities: Record<string, any> = {};
  const cols: {
    [key: string]: Column;
  } = { community: { title: "Community", dataIndex: "name", key: "name" } };
  for (const r of data) {
    const com: any = communities[r.community_name] ?? {};
    com[r.deployment] = r.deployed_tbs;
    com.name = r.community_name;
    communities[r.community_name] = com;

    // update columns
    cols[r.deployment] ??= {
      title: r.deployment,
      dataIndex: r.deployment,
      key: r.deployment,
    };
  }

  console.log(communities);
  columns.value = Object.values(cols);
  rows.value = Object.values(communities);
}

onMounted(async () => {
  await fetchStats();
});
</script>

<template>
  <PageHeader
    title="Inventory"
    sub-title="Talking book installations of communities across all deployments"
  >
  </PageHeader>

  <Table
    :columns="columns"
    :data-source="rows"
    size="small"
    :loading="store.loading"
    :sticky="true"
    :scroll="{ x: '70%' }"
    :pagination="false"
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
