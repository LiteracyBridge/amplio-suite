<script setup lang="ts">
import {
  Card,
  Button,
  Form,
  FormItem,
  Space,
  Divider,
  Textarea,
  Modal,
  Tabs,
  TabPane,
  CheckboxGroup,
  RadioGroup,
  Checkbox,
  Radio,
  Empty,
  Select,
  SelectOption,
  notification,
} from "ant-design-vue";
import NavBar from "@/components/NavBar.vue";
import { computed, h, onMounted, ref, watch } from "vue";
import { QuestionType, Survey, Progress, QuestionChoice, Analysis } from "../types";
import { useFeedbackAnalysis } from "@/stores/feedback_analysis.store";
import { AudioMetadata } from "../types";
import AudioPlayer from "./AudioPlayer.vue";
import { useGlobalStore } from "@/stores/app.store";
import { storeToRefs } from "pinia";
import Stats from "./Stats.vue";
import { useSurveyBuilder } from "@/stores/survey_builder.store";
import { ApiRequest, API_URL } from "@/helpers/api";

const feedbackStore = useFeedbackAnalysis(),
  globalStore = useGlobalStore(),
  surveyStore = useSurveyBuilder(),
  { context: globalContext } = storeToRefs(globalStore);

const config = ref({
  activeSection: "transcription",
  loading: true,
  noMessages: false,
});

const modal = ref({
  visible: false,
  selectedSurveyId: null,
  matchedSurveys: [] as Survey[],
});

const uuid = ref(""),
  previousSubmission = ref(false),
  audioMetadata = ref<AudioMetadata>(new AudioMetadata()),
  progress = ref(new Progress()),
  audioKey = ref(0),
  audio = ref(),
  checkboxes = ref([]),
  nextUUID = ref<string>(),
  store = useGlobalStore(),
  startTime = ref<Date>(null),
  transcription = ref(null),
  selectedChoice = ref<Record<string, { selected: boolean; sub: QuestionChoice[] }>>({});

// const isChoiceSelected = computed(() => {
//   return (choiceId: string | number) => {
//     return selectedChoice.value[choiceId] == true;
//   };
// });

const skipCurrentMessage = () => {
  feedbackStore.skipped_messages = [...feedbackStore.skipped_messages, uuid.value];
  updateUrl(true);
};

function updateUrl(uuidSkip?: boolean) {
  transcription.value = null;

  return ApiRequest.get("messages", {
    email: store.email,
    program: store.context.selectedProgramCode,
    deployment: store.context.selectedDeployment,
    language: store.context.selectedLanguageCode,
    uuid: uuid.value || uuidSkip || "",
    skipped_messages: feedbackStore.skipped_messages,
  })
    .then(([response]: any) => {
      // TODO: check for not empty response [when there are no messages ]

      console.log(response);

      uuid.value = response.audioMetadata.uuid;
      audioMetadata.value = response.audioMetadata;
      progress.value = response.progress;

      if (response.transcription != null) {
        transcription.value = response.transcription;
      }

      if (audioMetadata.value.url != "") {
        let filename = unescape(
          audioMetadata.value.url.substring(audioMetadata.value.url.lastIndexOf("/") + 1)
        );
        audioMetadata.value.filename = filename;
        if (audioMetadata.value.submission) {
          previousSubmission.value = true;
        }
      }

      startTime.value = new Date();
      console.log("new URL:" + audioMetadata.value.url);
      return audioMetadata.value.url;
    })
    .catch((err) => {
      console.log("caught:" + err);
      uuid.value = "";
      store.connected = false;
    });
}

function setCheckboxes(list: any[]) {
  // this is used to pass to lambda fct when requesting a specific uuid form submission
  // some fields need to be in an array (checkboxes); while others should not (select boxes)
  checkboxes.value = list;
}

function updateConnected(isConnected: boolean) {
  store.connected = isConnected;
}

const showNoAudios = computed(() => {
  let message = "NONE";
  if (uuid.value == "" || uuid.value == null) {
    // Must be in Responses.vue, which is telling us that we are at the end of the list.
    return "Finished!  There are no more responses to review.";
  }
  if (progress.value.totalReceivedMessages != -1) {
    // -1 indicated that this number hasn't been loaded yet.
    if (progress.value.totalReceivedMessages == 0) {
      message = "No messages are ready to process yet.";
    } else {
      let remaining =
        progress.value.totalReceivedMessages -
        (progress.value.others_recordings + progress.value.users_recordings);
      if (remaining == 0) {
        message = "Finished! There are no more messages to process!";
      } else {
        var isAre;
        var itThey;
        if (remaining == 1) {
          isAre = "is ";
          itThey = "It ";
        } else {
          isAre = "are ";
          itThey = "They ";
        }
        message =
          "There " +
          isAre +
          String(remaining) +
          " remaining message" +
          (remaining > 1 ? "s" : "") +
          " still being processed by others.<BR/>" +
          itThey +
          "will be available for you to process within 5 minutes.";
      }
    }
  }
  return message;
});

watch(nextUUID, (newUUID) => {
  uuid.value = newUUID;
  if (newUUID != "") {
    updateUrl();
  } else {
    audioMetadata.value.url = "";
  }
});

watch(
  globalContext,
  (_newContext) => {
    // FIXME: this is wrong. we should refresh page if program changes
    // Program changed, reload page to get the program surveys
    handleOnMounted();
  },
  { deep: true }
);

function analyse(survey: Survey | number) {
  config.value.loading = true;

  if (typeof survey === "number") {
    survey = useSurveyBuilder().published.find((s) => s.id == survey);
  }

  useFeedbackAnalysis().setSurvey(survey);
  uuid.value = nextUUID.value;
  updateUrl();

  modal.value.visible = false;
  config.value.loading = false;
}

async function handleOnMounted() {
  await useSurveyBuilder().download();

  // Fetch surveys of the program
  const surveys = useSurveyBuilder().published;

  if ((surveys || []).length == 0) {
    config.value.loading = false;
    return;
  }

  // Look for survey that matches the current deployment and language
  const results =
    surveys.filter(
      (s) => s.deployment.deployment == globalContext.value.selectedDeployment
    ) || [];

  // Only 1 survey was found
  if (results.length == 1) {
    analyse(results[0]);
    return;
  }

  // Multiple surveys were found, ask the user to select one
  if (results.length > 1) {
    modal.value.matchedSurveys = results;
    modal.value.visible = true;
    return;
  }
  if (results.length == 0 && surveys != null) {
    modal.value.matchedSurveys = surveys;
    modal.value.visible = true;
  }
}

onMounted(async () => {
  surveyStore.download().then(() => {
    config.value.loading = true;

    handleOnMounted();
  });
  // handleOnMounted();
});

function validateResponse(feedback: Analysis) {
  let isValid = true;

  if (!feedback.show) return isValid;

  // Reset error
  feedback.error = null;

  if (feedback.question.required) {
    if (
      feedback.question.type == QuestionType.open_ended &&
      (feedback.response == null || feedback.response == "")
    ) {
      feedback.error = "This question is required!";
      isValid = false;
    }

    if (
      feedback.question.type == QuestionType.multi_choice &&
      (feedback.choices || []).length == 0
    ) {
      feedback.error = "This question is required!";
      isValid = false;
    }

    if (
      feedback.question.type == QuestionType.single_choice &&
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
  if (is_useless == false) {
    let isValid = true;
    for (const feedback of feedbackStore.questions) {
      isValid = validateResponse(feedback);
    }

    if (!isValid) {
      notification.error({
        message: `Error`,
        description: "Please answer all required questions!",
      });
      return;
    }
  }

  feedbackStore
    .saveChanges({
      message_uuid: uuid.value,
      is_useless,
      start_time: startTime.value,
      transcription: transcription.value,
    })
    .then(() => updateUrl(true));
}
const isOptionOther = computed(() => {
  return (choices: QuestionChoice[], option_id: number | string) => {
    const option = choices.find((c) => c.choice_id == option_id);

    if (option == null) return false;

    return option.is_other;
  };
});

const isLoading = computed(() => {
  return config.value.loading || feedbackStore.loading || surveyStore.loading;
});

const getReportUrl = computed(() => {
  if (feedbackStore.survey == null) return null;
  return `${API_URL}/reports/${feedbackStore.survey.id}?deployment=${globalContext.value.selectedDeployment}&language=${globalContext.value.selectedLanguageCode}`;
});
</script>

<template>
  <!-- <NavBar /> -->

  <Empty v-if="(useSurveyBuilder().published || []).length == 0 && !isLoading">
    <template #description>
      <span> You do not have any surveys </span>
    </template>

    <RouterLink to="/surveys">
      <Button type="primary" :ghost="false"> Create Survey</Button>
    </RouterLink>
  </Empty>

  <Card
    :title="(feedbackStore.survey?.name || '') + ' Analysis'"
    v-else
    :loading="isLoading"
  >
    <!-- <template #extra>
      <Button type="primary" :ghost="true" @click="feedbackStore.saveChanges(uuid)">
        Save Changes
      </Button>
    </template> -->
    <template #extra>
      <a :href="getReportUrl" target="_top">
        <Button type="link" @click="">Download Analysis Report</Button>
      </a>
    </template>

    <div class="mx-20">
      <Stats />
    </div>

    <div class="flex justify-center">
      <!-- <div
        v-if="!connected"
        style="
          color: red;
          font-size: 1.5em;
          font-weight: bolder;
          text-align: center;
          padding: 0px;
        "
      >
        No Connection!
      </div> -->
      <!-- <div class="my-4">
        <Stats />
      </div> -->
      <div v-if="audioMetadata.url != ''" class="mt-5">
        <AudioPlayer
          :key="audioKey"
          @srcError="updateUrl"
          @network="updateConnected"
          @next="skipCurrentMessage"
          @useless="save($event)"
          ref="audio"
          :audioMetadata="audioMetadata"
        />
      </div>
    </div>

    <br />
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
                          feedbackStore.updateQuestionConditions(analysis.question_id);
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
                                if (selectedChoice[option.choice_id] == null) {
                                  selectedChoice[option.choice_id] = {
                                    selected: true,
                                    sub: option.sub_options || [],
                                  };
                                } else {
                                  selectedChoice[option.choice_id] = {
                                    selected: !selectedChoice[option.choice_id].selected,
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
                                v-if="selectedChoice[option.choice_id]?.selected == true"
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
                                feedbackStore.getQuestionIndexById(analysis.question_id)
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

              <!-- <div class="flex justify-center items-center mt-5 mb-10">
                <Button type="primary" :ghost="true"> Save </Button>
              </div> -->
            </TabPane>
          </Tabs>
        </div>
      </div>

      <Divider />
      <div class="flex items-end justify-center my-4 mx-3">
        <Space>
          <Button type="primary" @click="save()">Submit and Continue</Button>
          <Button
            type="primary"
            :ghost="true"
            :danger="true"
            @click="feedbackStore.resetResponses()"
            >Reset</Button
          >
        </Space>
      </div>
    </Form>
  </Card>

  <!-- Survey selection modal Modal -->
  <Modal
    title="Choose survey for analysis"
    v-model:open="modal.visible"
    :closable="false"
    :mask-closable="false"
  >
    <template #footer>
      <Button
        type="primary"
        @click="analyse(modal.selectedSurveyId)"
        :disabled="modal.selectedSurveyId == null"
        >Analyse
      </Button>
    </template>

    <Form layout="vertical">
      <FormItem label="Select Survey" :required="true">
        <Select v-model:value="modal.selectedSurveyId">
          <SelectOption v-for="s in modal.matchedSurveys" :value="s.id" :key="s.id">
            {{ s.name }}
          </SelectOption>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped>
body {
  overflow-x: hidden;
}
</style>
