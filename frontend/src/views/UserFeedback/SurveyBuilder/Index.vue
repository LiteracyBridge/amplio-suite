<script setup lang="ts">
import {
  Card,
  Button,
  Dropdown,
  Menu,
  Form,
  FormItem,
  Input,
  TabPane,
  Textarea,
  Modal,
  Collapse,
  CollapsePanel,
  Select,
  SelectOption,
  CardMeta,
  Spin,
  message,
  PageHeader,
  Empty,
  Tabs,
  Skeleton,
} from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import { computed, h, onMounted, ref } from "vue";
import { useSurveyBuilder } from "@/store/survey_builder.store";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/app.store";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import SurveyItemCard from "./SurveyItemCard.vue";
import { Survey } from "@/models/survey";

const store = useSurveyBuilder(),
  appStore = useAppStore(),
  router = useRouter();

const formInstance = ref<FormInstance>(null);
const newSurveyModal = ref({
    visible: false,
    form: new Survey(),
    close: () => {
      newSurveyModal.value.visible = false;
      newSurveyModal.value.form = new Survey();
    },
  }),
  activeTab = ref("draft");

// const deployments = computed(() => {
//   return Array.from(Array(appStore.deployments || 0).keys());
// });

// const languages = computed(() => {
//   return [];
//   // TODO: implement this
//   // const program = appStore.defaultProgram;

//   // const languageCodes =
//   //   program.deployments.find((d: any) => d.number == appStore.context.selectedDeployment)
//   //     ?.languages || [];

//   // const languages = program.languages.filter((l: any) => languageCodes.includes(l.code));
//   // return languages;
// });

function createSurvey() {
  formInstance.value.validateFields().then((_) => {
    const form = newSurveyModal.value.form;
    form.project_code = appStore.programCode;
    store
      .createSurvey(form)
      .then((resp) => {
        message.success("Survey created successfully!");

        newSurveyModal.value.close();
        router.push({ name: "survey-builder", params: { id: resp.id } });
      })
      .catch((err) => message.error(err.message));
  });
}

function edit(survey: Survey) {
  store.setSurvey(survey);
  router.push({ name: "user_feedback/surveys"});
}

function analyse(survey: Survey) {
  useFeedbackAnalysis().setSurvey(survey);
  router.push({ name: "feedback-analysis", params: { id: survey.id } });
}

onMounted(() => {
  store.download();
});
</script>

<template>
  <PageHeader title="Surveys">
    <template #extra>
      <Button type="primary" @click="newSurveyModal.visible = true"> New Survey</Button>
    </template>
  </PageHeader>

  <Skeleton v-if="store.loading" :loading="store.loading"></Skeleton>

  <Tabs :centered="true" v-model:activeKey="activeTab" v-else>
    <TabPane key="draft" tab="Drafts">
      <Empty v-if="store.drafts.length == 0">
        <template #description>
          <span> You do not have any surveys </span>
        </template>

        <Button type="primary" :ghost="true" @click="newSurveyModal.visible = true">
          Create Survey</Button
        >
      </Empty>

      <div v-else class="grid grid-flow-row-dense grid-cols-4 gap-4">
        <SurveyItemCard
          @click="edit(survey)"
          v-for="survey in store.drafts"
          :survey="survey"
        ></SurveyItemCard>
      </div>
    </TabPane>

    <TabPane key="published" tab="Published">
      <Empty v-if="store.published.length == 0">
        <template #description>
          <span> You do not have any surveys </span>
        </template>

        <Button type="primary" :ghost="true" @click="newSurveyModal.visible = true">
          Create Survey</Button
        >
      </Empty>

      <div v-else class="grid grid-flow-row-dense grid-cols-4 gap-4">
        <SurveyItemCard
          @click="edit(survey)"
          v-for="survey in store.published"
          :survey="survey"
        ></SurveyItemCard>
      </div>
    </TabPane>

    <TabPane key="archived" tab="Archived">
      <Empty v-if="store.archived.length == 0">
        <template #description>
          <span> You do not have any surveys </span>
        </template>

        <Button type="primary" :ghost="true" @click="newSurveyModal.visible = true">
          Create Survey</Button
        >
      </Empty>

      <div v-else class="grid grid-flow-row-dense grid-cols-4 gap-4">
        <SurveyItemCard
          @click="edit(survey)"
          v-for="survey in store.archived"
          :survey="survey"
        ></SurveyItemCard></div
    ></TabPane>
  </Tabs>

  <!-- New Section Modal -->
  <Modal
    title="New Survey"
    v-model:open="newSurveyModal.visible"
    @cancel="newSurveyModal.close()"
    @close="newSurveyModal.close()"
    ok-text="Create Survey"
    @ok="createSurvey()"
  >
    <Spin :spinning="store.loading">
      <Form layout="vertical" :model="newSurveyModal.form" ref="formInstance">
        <FormItem
          label="Survey Name"
          name="name"
          :required="true"
          :rules="[{ required: true, message: 'Please enter survey name!' }]"
        >
          <Input v-model:value="newSurveyModal.form.name" placeholder="" />
        </FormItem>

        <!-- <FormItem
          label="Deployment"
          :required="true"
          name="deployment_id"
          :rules="[{ required: true, message: 'Please select deployment!' }]"
        >
          <Select v-model:value="newSurveyModal.form.deployment_id">
            <SelectOption
              v-for="deployment in deployments"
              :value="deployment"
              :key="deployment"
            >
              {{ deployment }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem
          label="Language"
          :required="true"
          name="language"
          :rules="[{ required: true, message: 'Please select language!' }]"
        >
          <Select v-model:value="newSurveyModal.form.language">
            <SelectOption
              v-for="language in languages"
              :value="language.code"
              :key="language.code"
            >
              {{ language.name }}
            </SelectOption>
          </Select>
        </FormItem> -->

        <FormItem label="Brief Description" name="description" :required="false">
          <Textarea
            v-model:value="newSurveyModal.form.description"
            placeholder=""
          ></Textarea>
        </FormItem>
      </Form>
    </Spin>
  </Modal>
</template>

<style scoped></style>
