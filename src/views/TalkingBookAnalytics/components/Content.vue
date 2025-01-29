<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Table } from "ant-design-vue";
import type { TableColumnType } from "ant-design-vue";
import { countBy, groupBy, sumBy } from "lodash";

interface DataItem {
  TB: string;
  Agent: string;
  "Deployment #": string;
  Region: string;
  District: string;
  Community: string;
  Message: string;
  Language: string;
  Format: string;
  Variant: string;
  Playlist: string;
  Position: string;
  Duration: number;
  "Total Starts": string;
  "Total 1/4 Plays": string;
  "Total 1/2 Plays": string;
  "Total 3/4 Plays": string;
  "Total Completions": string;
  "Total Plays": string;
}

const props = defineProps<{
  data: Array<DataItem>;
}>();

const rowSpans: { [playlistOrMessage: string]: boolean } = {};
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

const isPlaylistRendered = computed(() => {
  return (playlist: string | number) => {
    if (rowSpans[playlist]) {
      console.log(playlist, rowSpans);
      return true;
    }
    rowSpans[playlist] = true;
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
                  Playlist
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Message
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Duration (in min)
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Language
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Format
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Deployment #
                </th>
                <th
                  scope="col"
                  class="text-center text-xs font-bold uppercase text-black"
                >
                  Position
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
              <template
                v-for="(messages, playlist, pIndex) in groupBy(data, (p) => p.Playlist)"
              >
                <template
                  v-for="(items, title, mIndex) in groupBy(messages, (p) => p.Message)"
                >
                  <template v-for="(item, tIndex) of items">
                    <tr class="hover:bg-gray-100 dark:hover:bg-neutral-200">
                      <!-- playlist title, displayed only -->
                      <td
                        :rowspan="messages.length"
                        v-if="!isPlaylistRendered(playlist)"
                        class="py-1 text-center text-sm"
                      >
                        {{ playlist }}
                      </td>

                      <!-- message title, displayed only once for each messages set -->
                      <td
                        :rowspan="items.length"
                        v-if="tIndex == 0"
                        class="py-1 text-center text-sm"
                      >
                        {{ title }}
                      </td>

                      <!-- other columns -->
                      <td class="py-1 text-center text-sm">
                        <!-- rounded to 2dp -->
                        {{
                          Math.round(((item.Duration || 0) / 60 + Number.EPSILON) * 10) /
                          10
                        }}
                      </td>
                      <td class="py-1 text-center text-sm">
                        {{ item.Language }}
                      </td>
                      <td class="py-1 text-center text-sm">
                        {{ item.Format }}
                      </td>
                      <td class="py-1 text-center text-sm">
                        {{ item["Deployment #"] }}
                      </td>
                      <td class="py-1 text-center text-sm">
                        {{ item.Position }}
                      </td>
                    </tr>
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
