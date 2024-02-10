<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import { Button, Drawer, Divider, Spin, Form, Textarea } from "ant-design-vue";
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
const form = reactive({ transcription: null });

const allResponses = ref(true),
  submissionsList = ref<UserFeedbackMessage[]>([]),
  analysis = ref<Record<string, any>>(null);

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
