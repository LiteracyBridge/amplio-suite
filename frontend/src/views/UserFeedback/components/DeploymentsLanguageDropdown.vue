<script setup lang="ts">
import {
  Button,
  Dropdown,
  MenuItem,
  SubMenu,
  Menu,
  Select,
  SelectOption,
  Modal,
  FormItem,
  Form,
} from "ant-design-vue";
import { useAppStore } from "@/store/app.store";
import { DownOutlined } from "@ant-design/icons-vue";
import { onMounted, ref } from "vue";
import { Survey } from "@/models/survey";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useSurveyBuilder } from "@/store/survey_builder.store";

const emit = defineEmits<{
  (e: "change", deployment: number | string, language: string): void;
}>();

const feedbackStore = useFeedbackAnalysis();
const store = useAppStore();

const modal = ref({
  visible: false,
  selectedSurveyId: null,
  matchedSurveys: [] as Survey[],
});

async function handleOnMounted(force: boolean = false) {
  if (!force && feedbackStore.survey?.id != null) return;

  feedbackStore.loading = true;

  await useSurveyBuilder().download();

  // Fetch surveys of the program
  const surveys = useSurveyBuilder().published;
  modal.value.matchedSurveys = surveys;

  if ((surveys || []).length == 0) {
    feedbackStore.loading = false;
    return;
  }

  // Multiple surveys were found, ask the user to select one
  if (surveys.length >= 1) {
    modal.value.visible = true;
    return;
  }

  if (surveys.length == 0 && surveys != null) {
    modal.value.visible = true;
  }
}

const onLanguageDeploymentChanged = (deployment: number, language: string) => {
  store.userFeedback ??= { deployment, language, surveyId: null };
  store.userFeedback.deployment = deployment;
  store.userFeedback.language = language;

  handleOnMounted(true);
};

function analyse(survey: Survey | number) {
  feedbackStore.loading = true;

  if (typeof survey === "number") {
    survey = useSurveyBuilder().published.find((s) => s.id == survey);
  }

  useFeedbackAnalysis().setSurvey(survey);
  emit("change", store.userFeedback.deployment, store.userFeedback.language);

  modal.value.visible = false;
  feedbackStore.loading = false;
}

onMounted(async () => {
  if (store.userFeedback.deployment == null || store.userFeedback.language == null) {
    onLanguageDeploymentChanged(
      store.deployments[0]?.deploymentnumber,
      store.languages[0]
    );
    return;
  }

  handleOnMounted(false);
});
</script>

<template>
  <Dropdown>
    <template #overlay>
      <Menu>
        <SubMenu :key="d.deploymentnumber" v-for="d in store.deployments">
          <template #title>
            <span>Deployment {{ d.deploymentnumber }}</span>
          </template>
          <MenuItem
            :key="lang"
            v-for="lang in store.languages"
            @click="onLanguageDeploymentChanged(d.deploymentnumber, lang)"
            >{{ lang }}</MenuItem
          >
        </SubMenu>
      </Menu>
    </template>

    <Button>
      Change Deployment
      <DownOutlined />
    </Button>
  </Dropdown>

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
