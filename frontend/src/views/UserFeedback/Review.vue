<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import {
  Button,
  Drawer,
  Descriptions,
  DescriptionsItem,
  Divider,
  Empty,
  PageHeader,
  Table,
  Alert,
  Popconfirm,
  Spin,
} from "ant-design-vue";
import DeploymentsLanguageDropdown from "./components/DeploymentsLanguageDropdown.vue";
import { UserFeedbackMessage } from "@/models/uf_message";
import { useRouter } from "vue-router";
import AudioPlayer from "./Analysis/AudioPlayer.vue";

const feedbackStore = useFeedbackAnalysis(),
  store = useAppStore();

const router = useRouter();

const columns = [
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
    title: "District",
    key: "district",
  },
  {
    key: "actions",
  },
];

const open = ref(false),
  selectedMessage = ref<UserFeedbackMessage>(null);

const allResponses = ref(true),
  submissionsList = ref<UserFeedbackMessage[]>([]),
  analysis = ref<Record<string, any>>(null);

async function getSubmissionsList() {
  await feedbackStore
    .fetchSubmittedMessages()
    .then((resp) => (submissionsList.value = resp));
}

async function onMessageSelected(message: UserFeedbackMessage) {
  selectedMessage.value = message;
  feedbackStore
    .fetchAnalysisReport(message.message_uuid)
    .then((resp) => {
      // The result should be a 2D array with the first row being the headers
      // and the second row being the values
      if (resp.length > 1) {
        let temp: Record<string, any> = {};

        for (let i = 0; i < resp[0].length; i++) {
          temp[resp[0][i]] = resp[1][i]; // resp[0][i] is the header, resp[1][i] is the corresponding value
        }
        analysis.value = temp;
      }
      // analysis.value = resp;
    })
    .finally(() => {
      open.value = true;
    });
}

async function deleteAnalysis() {
  await feedbackStore.deleteSubmission(selectedMessage.value.message_uuid).then(() => {
    open.value = false;
    analysis.value = null;

    submissionsList.value = submissionsList.value.filter(
      (msg) => msg.message_uuid !== selectedMessage.value.message_uuid
    );
    selectedMessage.value = null;
  });
}

onMounted(() => {
  getSubmissionsList();
});
</script>

<template>
  <PageHeader title="User Feedback Review" sub-title="Analyse user feedback messages">
    <template #extra>
      <DeploymentsLanguageDropdown @change="getSubmissionsList()" />
    </template>

    <Alert type="info" :closable="true">
      <template #message>
        <span>
          Reviewing user feedback for
          <span class="font-bold text-lg">{{ store.programName }}</span
          >, deployment
          <span class="font-bold text-lg">{{ store.userFeedback.deployment }}</span>
          and language
          <span class="font-bold text-lg">{{ store.userFeedback.language }}</span>
        </span>
      </template>
    </Alert>
  </PageHeader>

  <Table
    :columns="columns"
    :data-source="submissionsList"
    :loading="feedbackStore.loading"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'title'">
        {{ record.content_metadata?.title }}
      </template>

      <template v-if="column.key === 'uuid'">
        {{ record.message_uuid }}
      </template>

      <template v-if="column.key === 'feedback'">
        {{ record.is_useless ? "No" : "False" }}
      </template>

      <template v-if="column.key === 'group'">
        {{ record.recipient.group_name }}
      </template>

      <template v-if="column.key === 'community'">
        {{ record.recipient.community_name }}
      </template>

      <template v-if="column.key === 'district'">
        {{ record.recipient.district }}, {{ record.recipient.region }}
      </template>

      <template v-if="column.key === 'actions'">
        <Button type="link" @click="onMessageSelected(record as UserFeedbackMessage)">
          Review
        </Button>
      </template>
    </template>
  </Table>

  <Drawer v-model:open="open" title="Review Feedback" width="900px">
    <Spin :spinning="feedbackStore.loading">
      <template
        v-if="(selectedMessage?.url != '' || selectedMessage?.url != null) && open"
      >
        <AudioPlayer :message="selectedMessage" :mini="true" />
        <Divider />
      </template>

      <Empty v-if="analysis == null" description="No analysis available" />

      <Descriptions
        v-else
        layout="vertical"
        bordered
        :column="1"
        :label-style="{ fontWeight: 'normal' }"
      >
        <DescriptionsItem v-for="(value, key) of analysis" :label="key">
          {{ value || "N/A" }}</DescriptionsItem
        >
      </Descriptions>
    </Spin>

    <template #footer>
      <Popconfirm
        title="Are you sure you want to delete this analysis? The message will be available for analysis again."
        okText="Yes"
        cancelText="No"
        @confirm="deleteAnalysis()"
      >
        <Button :danger="true" block>Delete Analysis</Button>
      </Popconfirm>
    </template>
  </Drawer>
</template>
