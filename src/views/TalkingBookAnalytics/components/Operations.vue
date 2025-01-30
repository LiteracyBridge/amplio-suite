<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Table } from "ant-design-vue";
import type { TableColumnType } from "ant-design-vue";
import { countBy, groupBy, sumBy } from "lodash";

interface DataItem {
  TB: string;
  Agent: string;
  Deployment: string;
  Region: string;
  District: string;
  Community: string;
  Message: string;
  Language: string;
  Format: string;
  Variant: string;
  Playlist: string;
  Position: string;
  "Start Date": string;
  "Install Date": string;
  "Date of Latest Stats": string;
}

const props = defineProps<{
  data: Array<DataItem>;
}>();

const rowSpans: { [tb: string]: boolean } = {};
const columns: TableColumnType[] = [
  {
    title: "Playlist",
    dataIndex: "Playlist",
    // customCell: (record, index) => {
    //     return { rowSpan: rowSpans.value[record.Playlist] ||1 };
    // },
  },
  {
    title: "Message",
    dataIndex: "Message",
    // customCell: sharedOnCell,
  },
  {
    title: "Duration (in min)",
    dataIndex: "Duration",
  },
  {
    title: "Language",
    dataIndex: "Language",
  },
  {
    title: "Format",
    dataIndex: "Format",
  },
  {
    title: "Deployment #",
    dataIndex: "Deployment",
  },
  {
    title: "Position",
    dataIndex: "Position",
  },
];

const isColRendered = computed(() => {
  return (key: string | number) => {
    if (rowSpans[key]) {
      console.log(key, rowSpans);
      return true;
    }
    rowSpans[key] = true;
    return false;
  };
});
onMounted(() => {
  // Generate table columns
  // 'Playlist' & 'Message' spans multiple rows
  // const temp1 = countBy(props.data, (d) => d.Playlist)
  // const temp2 = countBy(props.data, (d) => d.Message)
  // rowSpans.value = {...temp1, ...temp2}
  // console.log(rowSpans.value)
  // const cols = Object.keys(props.data[0])
  // const mapped = groupBy(props.data, (d) => d.Playlist)
  // for(const k in mapped){
  //   const items = mapped[k]
  //   rowSpans.value[k]=items.length
  //   mapped[k] = {
  //     playlistRowSpan: mapped[k].length,
  //     messagesRowSpan: Object.values(groupBy(mapped[k], (d) => d.Message)).length
  //   }
  // }
  // const c: Record<string, {index: number, span: number}> = {}
  // for(let i=0; i < props.data.length; i++){
  // }
  // const playlistColSpan = sumBy(props.data, (d) => d.Playlist)
});
</script>

<template>
  <div class="flex flex-col">
    <div class="-m-1.5 overflow-x-auto">
      <div class="p-1.5 min-w-full inline-block align-middle">
        <div class="overflow-hidden dark:border-neutral-700">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Talking Book
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  District
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Community
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Deployment
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Install Date
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Date of Latest Stats
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
              <template v-for="(arr1, tb) in groupBy(data, (p) => p.TB)">
                <template v-for="(arr2, district) in groupBy(arr1, (p) => p.District)">
                  <template
                    v-for="(arr3, community) in groupBy(arr2, (p) => p.Community)"
                  >
                    <template
                      v-for="(operations, deployment) in groupBy(
                        arr3,
                        (p) => p.Deployment
                      )"
                    >
                      <template v-for="(item, tIndex) of operations">
                        <tr class="hover:bg-gray-100 dark:hover:bg-neutral-200">
                          <!-- Talking book id, displayed only -->
                          <td
                            :rowspan="arr1.length"
                            v-if="!isColRendered(tb)"
                            class="text-center text-xs"
                          >
                            {{ tb }}
                          </td>

                          <!-- district title, displayed only once for each districts set -->
                          <td
                            :rowspan="arr2.length"
                            v-if="!isColRendered(`${tb}-${district}`)"
                            class="text-center text-xs"
                          >
                            {{ district }}
                          </td>

                          <td
                            :rowspan="arr3.length"
                            v-if="!isColRendered(`${tb}-${district}-${community}`)"
                            class="text-center text-xs"
                          >
                            {{ community }}
                          </td>

                          <td
                            :rowspan="operations.length"
                            v-if="
                              !isColRendered(
                                `${tb}-${district}-${community}-${deployment}`
                              )
                            "
                            class="text-center text-xs"
                          >
                            {{ deployment }}
                          </td>

                          <!-- other columns -->
                          <td class="text-center text-xs">
                            {{ item["Install Date"] }}
                          </td>
                          <td class="text-center text-xs">
                            {{ item["Date of Latest Stats"] || "null" }}
                          </td>
                        </tr>
                      </template>
                    </template>
                  </template>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  table-layout: fixed;
  width: 100%;
  overflow: scroll;
  word-wrap: none;
}
</style>
