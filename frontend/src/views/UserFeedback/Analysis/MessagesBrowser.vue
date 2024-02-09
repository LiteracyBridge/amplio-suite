<script setup lang="ts">
import {
  Card,
  Button,
  Form,
  FormItem,
  Space,
  Divider,
  Textarea,
  Table,
  TabPane,
  CheckboxGroup,
  RadioGroup,
  Checkbox,
  Radio,
  Empty,
  notification,
  PageHeader,
  Alert,
  Spin,
} from "ant-design-vue";
import { computed, h, onMounted, ref, watch } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import { UserFeedbackMessage } from "@/models/uf_message";

const feedbackStore = useFeedbackAnalysis(),
  store = useAppStore();

const columns = [
  {
    key: "actions",
  },
  {
    title: "ID",
    key: "uuid",
  },
  {
    title: "Message Title",
    key: "title",
  },
  {
    title: "Feedback",
    key: "feedback",
  },
  {
    title: "Group",
    key: "group",
  },
  {
    title: "Community",
    key: "community",
  },
  {
    title: "Location",
    key: "location",
  },
  {
    title: "Transcription",
    key: "transcription",
    elipsis: true,
  },
];

const messages = ref<UserFeedbackMessage[]>([]);

async function fetchMessages() {
  await feedbackStore.fetchSampleMessages().then((resp) => (messages.value = resp));
}

onMounted(() => {
  fetchMessages();
});
</script>

<template>
  <Table
    :columns="columns"
    :data-source="messages"
    :loading="feedbackStore.loading"
    size="small"
  >
    <template #title>
      <div class="flex justify-between">
        <span></span>
        <Button type="primary" @click="fetchMessages()" :ghost="true">
          <ReloadOutlined /> Refresh Data
        </Button>
      </div>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'actions'">
        <audio controls :src="record.url" preload="none"></audio>
        <!-- <audio id="audio1" src="http://www.guidetojapanese.org/audio/wa.mp3"></audio> -->
      </template>

      <template v-if="column.key === 'title'">
        {{ record.content_metadata?.title }}
      </template>

      <template v-if="column.key === 'uuid'">
        {{ record.message_uuid }}
      </template>

      <template v-if="column.key === 'feedback'">
        {{ record.is_useless == true ? "No" : "Yes" }}
      </template>

      <template v-if="column.key === 'group'">
        {{ record.recipient?.group_name }}
      </template>

      <template v-if="column.key === 'location'">
        {{ record.recipient?.district }}, {{ record.recipient?.community_name }}, {{ record.recipient?.region }}
      </template>

      <template v-if="column.key === 'transcription'">
        {{ record.transcription }}
      </template>
    </template>
  </Table>
</template>
