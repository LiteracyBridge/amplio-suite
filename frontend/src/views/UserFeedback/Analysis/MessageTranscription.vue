<script setup lang="ts">
import { computed, ref } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import {
  Button,
  Drawer,
  Divider,
  Spin,
  Form,
  Textarea,
  Popconfirm,
} from "ant-design-vue";
import { UserFeedbackMessage } from "@/models/uf_message";
import AudioPlayer from "./AudioPlayer.vue";

const props = defineProps<{
  open: boolean;
  message: UserFeedbackMessage | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const store = useFeedbackAnalysis();

const submissionsList = ref<UserFeedbackMessage[]>([]);

async function save() {
  await store.fetchSubmittedMessages().then((resp) => (submissionsList.value = resp));
}

const isValid = computed(() => {
  return (
    props.message?.transcription != null &&
    props.message?.transcription != "" &&
    props.message?.transcription.trim() != ""
  );
});
</script>

<template>
  <Drawer
    :open="open"
    @close="emit('update:open', false)"
    title="Transcribe Feedback Message"
    width="700px"
  >
    <template #extra>
      <Popconfirm
        title="Are you sure to mark this message as not feedback?"
        okText="Yes"
        cancelText="No"
        @confirm="
          store.markAsNotFeedback(message.message_uuid).then(() => {
            message.is_useless = true;
            store.statistics.total_useless += 1;
            emit('update:open', false);
          })
        "
      >
        <Button :danger="true">Not Feedback</Button>
      </Popconfirm>
    </template>

    <Spin :spinning="store.loading">
      <template v-if="(message?.url != '' || message?.url != null) && open">
        <AudioPlayer :message="message" :mini="true" />
        <Divider />
      </template>

      <Form layout="vertical">
        <Form.Item
          label="Transcribe Message"
          :rules="{ required: true, message: 'Transcription is required' }"
          required
        >
          <Textarea :rows="20" v-model:value="message.transcription" />
        </Form.Item>
      </Form>
    </Spin>

    <template #footer>
      <Button
        :loading="store.loading"
        block
        @click="
          store
            .transcribeMessage({
              message_id: message.message_uuid,
              transcription: message.transcription,
            })
            .then(() => {
              emit('update:open', false);
            })
        "
        type="primary"
        size="large"
        :disabled="!isValid"
        >Save Transcription</Button
      >
    </template>
  </Drawer>
</template>
