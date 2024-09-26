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
  Spin,
} from "ant-design-vue";
import { computed, h, onMounted, ref, watch } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import AudioPlayer from "./AudioPlayer.vue";
import Stats from "./Stats.vue";
import { useSurveyBuilder } from "@/store/survey_builder.store";
import { Analysis, Progress } from "@/models/analysis";
import { QuestionChoice, QuestionType } from "@/models/question";
import { useAppStore } from "@/store/app.store";
import { ApiRequest } from "@/api";
import AnalysisReport from "../components/AnalysisReport.vue";
import DeploymentsLanguageDropdown from "../components/DeploymentsLanguageDropdown.vue";
import { useRouter } from "vue-router";
import { UserFeedbackMessage } from "@/models/uf_message";
import AnalyseMessage from "./AnalyseMessage.vue";
import MessagesBrowser from "./MessagesBrowser.vue";

const feedbackStore = useFeedbackAnalysis(),
  store = useAppStore();

const activeTab = ref("analyse");
const deploymentChanged = ref("");
</script>

<template>
  <PageHeader sub-title="Analyse user feedback messages" @back="() => $router.go(-1)">
    <template #title>
      <span> {{ feedbackStore.survey?.name || "" }} Analysis </span>
    </template>

    <template #extra>
      <AnalysisReport v-if="feedbackStore.survey != null" class="mr-5" />

      <DeploymentsLanguageDropdown
        @change="(d, l) => (deploymentChanged = d.toString() + '_' + l.toString())"
      />
    </template>

    <!-- <Alert type="info" :closable="true">
      <template #message>
        <span>
          Analysing user feedback for
          <span class="font-bold text-lg">{{ store.programName }}</span
          >, deployment
          <span class="font-bold text-lg">{{ store.userFeedback.deployment }}</span>
          and language
          <span class="font-bold text-lg">{{ store.userFeedback.language }}</span>
        </span>
      </template>
    </Alert> -->
  </PageHeader>

  <Tabs v-model:activeKey="activeTab" centered size="large">
    <TabPane key="analyse" tab="Analyse Feedback">
      <AnalyseMessage :deployment-changed="deploymentChanged"></AnalyseMessage>
    </TabPane>

    <TabPane key="browser" tab="Browse Feedback Messages">
      <MessagesBrowser></MessagesBrowser>
    </TabPane>
  </Tabs>
</template>
