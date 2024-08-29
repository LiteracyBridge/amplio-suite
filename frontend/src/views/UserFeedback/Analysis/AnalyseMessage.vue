<script setup lang="ts">
import {
  Card,
  Button,
  Form,
  FormItem,
  Space,
  Divider,
  Textarea,
  Tabs,
  TabPane,
  CheckboxGroup,
  RadioGroup,
  Checkbox,
  Radio,
  Empty,
  notification,
  PageHeader,
  Alert,
  Row,
  Col,
  Spin,
} from "ant-design-vue";
import { computed, h, onMounted, ref, watch } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import AudioPlayer from "./AudioPlayer.vue";
import { useSurveyBuilder } from "@/store/survey_builder.store";
import type { Analysis } from "@/models/analysis";
import { type QuestionChoice, QuestionType } from "@/models/question";
import { useAppStore } from "@/store/app.store";
import { ApiRequest } from "@/api";
import { UserFeedbackMessage } from "@/models/uf_message";
import Stats from "./Stats.vue";

const props = defineProps<{
  deploymentChanged: string;
}>();

const feedbackStore = useFeedbackAnalysis();
const store = useAppStore();

const config = ref({
  activeSection: "transcription",
  noMessages: false,
});

const current_message_uuid = ref("");
const message = ref<UserFeedbackMessage>(new UserFeedbackMessage());
const audioKey = ref(0);
const nextUUID = ref<string>();
const startTime = ref<Date>(null);
const transcription = ref(null);

function updateUrl(skipMessage: boolean = false) {
  if (store.userFeedback?.deployment == null || store.userFeedback?.language == null) {
    notification.error({
      message: "Error",
      description: "Please select a deployment and language!",
    });
  }

  feedbackStore.loading = true;
  transcription.value = null;

  return ApiRequest.get<UserFeedbackMessage>(
    `user-feedback/messages/${store.programCode}?deployment=${
      store.userFeedback.deployment
    }&language=${store.userFeedback.language}&message_id=${
      skipMessage ? null : current_message_uuid.value || null
    }&skipped_messages=${feedbackStore.skipped_messages.join(",")}`
  )
    .then(([msg]) => {
      // TODO: check for not empty response [when there are no messages ]
      // if (msg == null) return;

      current_message_uuid.value = msg?.message_uuid;
      message.value = msg || new UserFeedbackMessage();
      startTime.value = new Date();

      if (msg?.transcription != null) {
        transcription.value = msg.transcription;
      }
    })
    .catch((err) => {
      console.log(`caught:${err}`);
      current_message_uuid.value = "";
    })
    .finally(() => {
      feedbackStore.loading = false;
    });
}

const skipCurrentMessage = () => {
  feedbackStore.skipped_messages = [
    ...feedbackStore.skipped_messages,
    current_message_uuid.value,
  ];
  updateUrl(true);
};

function validateResponse(feedback: Analysis) {
  let isValid = true;

  if (!feedback.show) return isValid;

  // Reset error
  feedback.error = null;

  if (feedback.question.required) {
    if (
      feedback.question.type === QuestionType.open_ended &&
      (feedback.response == null || feedback.response === "")
    ) {
      feedback.error = "This question is required!";
      isValid = false;
    }

    if (
      feedback.question.type === QuestionType.multi_choice &&
      (feedback.choices || []).length === 0
    ) {
      feedback.error = "This question is required!";
      isValid = false;
    }

    if (
      feedback.question.type === QuestionType.single_choice &&
      feedback.single_choice?.value == null
    ) {
      feedback.error = "This question is required!";
      isValid = false;
    }
  }
  return isValid;
}

function save(is_useless: boolean = false) {
  // Validate response
  if (is_useless === false) {
    let isValid = true;
    for (const feedback of feedbackStore.questions) {
      isValid = validateResponse(feedback);
    }

    if (!isValid) {
      notification.error({
        message: "Error",
        description: "Please answer all required questions!",
      });
      return;
    }
  }

  feedbackStore
    .saveChanges({
      message_uuid: current_message_uuid.value,
      is_useless,
      start_time: startTime.value,
      transcription: transcription.value,
    })
    .then(() => updateUrl(true));
}

const isOptionOther = computed(() => {
  return (choices: QuestionChoice[], option_id: number | string) => {
    // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
    const option = choices.find((c) => c.choice_id == option_id);

    if (option == null) return false;

    return option.is_other;
  };
});

watch(nextUUID, (newUUID) => {
  current_message_uuid.value = newUUID;
  if (newUUID !== "") {
    updateUrl();
  } else {
    message.value.url = "";
  }
});

watch(
  props,
  (newProps, _oldProps) => {
    console.log(newProps);
    updateUrl(true);
  },
  { deep: true }
);

onMounted(() => {
  updateUrl();
});
</script>

<template>
  <Spin :spinning="feedbackStore.loading">
    <Empty
      v-if="(useSurveyBuilder().published || []).length == 0 && !feedbackStore.loading"
    >
      <template #description>
        <span> You do not have any surveys </span>
      </template>

      <RouterLink to="/user-feedback/surveys">
        <Button type="primary" :ghost="false"> Create Survey</Button>
      </RouterLink>
    </Empty>

    <div v-else>
      <!-- No feedback messages -->
      <Empty class="mt-10" v-if="message.url == null || message.url == ''">
        <template #description>
          <span class="text-lg">There are no user feedback messages to analyse </span>
        </template>
      </Empty>

      <div v-else>
        <Row v-if="message.url != '' || message.url != null" :gutter="5">
          <Col :span="20">
            <AudioPlayer
              :key="audioKey"
              @srcError="updateUrl"
              @next="skipCurrentMessage"
              @useless="save($event)"
              :message="message"
              :mini="false"
            />
          </Col>
          <Col :span="4">
            <Stats class="h-full" />
          </Col>
        </Row>

        <Form layout="vertical" class="mt-5 block">
          <div class="flex justify-center">
            <div class="grid grid-cols-1 gap-4 content-center">
              <Tabs
                v-model:activeKey="config.activeSection"
                :bordered="true"
                tab-position="left"
              >
                <TabPane key="transcription" tab="Transcription">
                  <Card type="inner" size="small" class="mb-6" style="width: 58vw">
                    <FormItem
                      key="field-transcription"
                      label="Feedback Message Transcription"
                    >
                      <Textarea
                        class="my-2"
                        :rows="20"
                        placeholder="Transcription..."
                        v-model:value="transcription"
                      ></Textarea>
                    </FormItem>
                  </Card>
                </TabPane>

                <TabPane
                  :key="section.id"
                  :tab="section.name"
                  v-for="section in feedbackStore.sections"
                >
                  <Card type="inner" size="small" class="mb-6" style="width: 58vw">
                    <template v-for="(analysis, index) in feedbackStore.questions">
                      <FormItem
                        :key="analysis.id"
                        :required="analysis.question.required"
                        v-if="analysis.show"
                        @change="
                          feedbackStore.updateQuestionConditions(analysis.question_id);
                          validateResponse(analysis);
                        "
                      >
                        <template #label>
                          {{ index + 1 }}. {{ analysis.question.question_label }}
                        </template>

                        <!-- Open Ended Question -->
                        <div v-if="analysis.question.type === QuestionType.open_ended">
                          <Textarea
                            class="my-2"
                            placeholder="Open ended response..."
                            v-model:value="
                              feedbackStore.questions[
                                feedbackStore.getQuestionIndexById(analysis.question_id)
                              ].response
                            "
                            @change="
                              feedbackStore.updateQuestionConditions(
                                analysis.question_id
                              );
                              validateResponse(analysis);
                            "
                            :required="analysis.question.required"
                          ></Textarea>
                        </div>

                        <!-- Multi Choice Question -->
                        <div v-if="analysis.question.type === QuestionType.multi_choice">
                          <CheckboxGroup
                            v-model:value="analysis.choices"
                            style="width: 100%; display: block"
                          >
                            <div v-for="option in analysis.question.choices">
                              <Checkbox
                                :value="option.choice_id"
                                @change="
                                  () => {
                                    if (
                                      feedbackStore.selectedChoice[option.choice_id] ==
                                      null
                                    ) {
                                      feedbackStore.selectedChoice[option.choice_id] = {
                                        selected: true,
                                        sub: option.sub_options || [],
                                      };
                                    } else {
                                      feedbackStore.selectedChoice[option.choice_id] = {
                                        selected: !feedbackStore.selectedChoice[
                                          option.choice_id
                                        ].selected,
                                        sub: option.sub_options || [],
                                      };
                                    }
                                  }
                                "
                                >{{ option.value }}</Checkbox
                              >

                              <!-- Sub options -->
                              <div class="ml-10">
                                <div v-for="sub in option.sub_options || []">
                                  <Checkbox
                                    :value="sub.choice_id"
                                    v-if="
                                      feedbackStore.selectedChoice[option.choice_id]
                                        ?.selected == true
                                    "
                                    >{{ sub.value }}</Checkbox
                                  >
                                </div>
                              </div>
                            </div>
                          </CheckboxGroup>

                          <!-- TODO: show sub options -->
                        </div>

                        <!-- Single choice -->
                        <div v-if="analysis.question.type === QuestionType.single_choice">
                          <RadioGroup
                            v-model:value="analysis.single_choice.value"
                            @change=""
                            style="width: 100%; display: block"
                          >
                            <!-- TODO: add onchange event -->
                            <div v-for="option in analysis.question.choices">
                              <Radio :value="option.choice_id">{{ option.value }}</Radio>

                              <!-- Sub options -->
                              <div>
                                <RadioGroup
                                  v-if="analysis.single_choice.value == option.choice_id"
                                  class="ml-10"
                                  v-model:value="analysis.single_choice.sub_choice"
                                  @change=""
                                  style="width: 100%; display: block"
                                >
                                  <div v-for="sub in option.sub_options || []">
                                    <Radio :value="sub.choice_id">{{ sub.value }}</Radio>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>

                            <div
                              class="ml-10"
                              v-if="
                                isOptionOther(
                                  analysis.question.choices,
                                  analysis.single_choice.value
                                )
                              "
                            >
                              <Textarea
                                class="my-2"
                                v-model:value="
                                  feedbackStore.questions[
                                    feedbackStore.getQuestionIndexById(
                                      analysis.question_id
                                    )
                                  ].response
                                "
                                :required="true"
                              ></Textarea>
                            </div>
                          </RadioGroup>
                        </div>

                        <!-- Error message -->
                        <div class="text-red-500">{{ analysis.error || "" }}</div>
                      </FormItem>
                    </template>
                  </Card>
                </TabPane>
              </Tabs>
            </div>
          </div>

          <Divider />
          <div class="flex items-end justify-center my-4 mx-3">
            <Space>
              <Button type="primary" size="large" @click="save()"
                >Submit and Continue</Button
              >
              <Button
                size="large"
                type="primary"
                :ghost="true"
                :danger="true"
                @click="feedbackStore.resetResponses()"
                >Reset</Button
              >
            </Space>
          </div>
        </Form>
      </div>
    </div>
  </Spin>
</template>
