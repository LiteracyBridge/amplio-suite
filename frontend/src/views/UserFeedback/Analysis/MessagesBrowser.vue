<script setup lang="ts">
import { Button, Table, Alert, Input } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { computed, h, onMounted, reactive, ref, watch } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import { UserFeedbackMessage } from "@/models/uf_message";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons-vue";
import MessageTranscription from "./MessageTranscription.vue";

const feedbackStore = useFeedbackAnalysis(),
  store = useAppStore();

const messages = ref<UserFeedbackMessage[]>([]);
const groupSearchInput = ref();
const tableState = reactive({
  searchText: "",
  searchedColumn: "",
});
const drawer = ref({
  open: false,
  message: new UserFeedbackMessage(),
});

const columns = ref<TableColumnsType>([
  {
    key: "audio",
    title: "Message",
    fixed: "left",
    width: 250,
  },
  {
    title: "ID",
    key: "uuid",
    width: 150,
  },
  {
    title: "Message Title",
    key: "title",
    resizable: true,
    width: 150,
  },
  {
    title: "Feedback",
    key: "feedback",
    width: 80,
  },
  {
    title: "Group",
    key: "group",
    width: 150,
    customFilterDropdown: true,
    onFilter: (value: any, record: UserFeedbackMessage) =>
      record?.recipient?.group_name
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          groupSearchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: "Location",
    key: "location",
    width: 170,
  },
  {
    title: "Transcription",
    key: "transcription",
    ellipsis: true,
    width: 230,
  },
  {
    key: "actions",
    width: 50,
  },
]);

const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  tableState.searchText = selectedKeys[0];
  tableState.searchedColumn = dataIndex;
};

const handleReset = (clearFilters: any) => {
  clearFilters({ confirm: true });
  tableState.searchText = "";
};

async function fetchMessages() {
  await feedbackStore.fetchSampleMessages().then((resp) => (messages.value = resp));
}

onMounted(() => {
  fetchMessages();
});
</script>

<template>
  <Alert
    type="info"
    :closable="true"
    :show-icon="true"
    description="The user feedback messages are randomly selected. Only 51% of the total messages are shown"
  />

  <Table
    :columns="columns"
    :data-source="messages"
    :loading="feedbackStore.loading"
    size="small"
    :scroll="{ x: 1500 }"
  >
    <template #title>
      <div class="flex justify-between">
        <span></span>
        <Button type="primary" @click="fetchMessages()" :ghost="true">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh Data
        </Button>
      </div>
    </template>

    <template
      #customFilterDropdown="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
    >
      <div style="padding: 8px">
        <Input
          ref="groupSearchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <Button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon><SearchOutlined /></template>
          Search
        </Button>
        <Button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          Reset
        </Button>
      </div>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'audio'">
        <audio controls :src="(record as UserFeedbackMessage).url" preload="none"></audio>
      </template>

      <template v-if="column.key === 'title'">
        {{ (record as UserFeedbackMessage).content_metadata?.title }}
      </template>

      <template v-if="column.key === 'uuid'">
        {{ (record as UserFeedbackMessage).message_uuid }}
      </template>

      <template v-if="column.key === 'feedback'">
        {{ (record as UserFeedbackMessage).is_useless == true ? "No" : "Yes" }}
      </template>

      <template v-if="column.key === 'group'">
        {{ (record as UserFeedbackMessage).recipient?.group_name }}
      </template>

      <template v-if="column.key === 'location'">
        {{ (record as UserFeedbackMessage).recipient?.district }},
        {{ (record as UserFeedbackMessage).recipient?.community_name }},
        {{ (record as UserFeedbackMessage).recipient?.region }}
      </template>

      <template v-if="column.key === 'transcription'">
        {{ (record as UserFeedbackMessage).transcription }}
      </template>

      <template v-if="column.key === 'actions'">
        <Button
          type="link"
          @click="drawer.open = true; drawer.message = record as UserFeedbackMessage"
        >
          Transcribe
        </Button>
      </template>
    </template>
  </Table>

  <MessageTranscription
    :open="drawer.open"
    :message="drawer.message"
    @update:open="
      (val) => {
        drawer.open = val;
        drawer.message = new UserFeedbackMessage();
      }
    "
  ></MessageTranscription>
</template>
