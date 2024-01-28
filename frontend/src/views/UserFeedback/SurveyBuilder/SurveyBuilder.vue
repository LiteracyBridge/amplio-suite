<script setup lang="ts">
import {
  Card,
  Button,
  Dropdown,
  Menu,
  PageHeader,
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Space,
  Divider,
  Textarea,
  Modal,
  Collapse,
  CollapsePanel,
  Spin,
  Typography,
  Tabs,
  TabPane,
  Popconfirm,
} from "ant-design-vue";
import { DownOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons-vue";

import { computed, h, onMounted, ref } from "vue";
import { useSurveyBuilder } from "@/store/survey_builder.store";

import QuestionsView from "./QuestionsView.vue";
import {
  Question,
  QuestionSection,
  QuestionType,
  QuestionTypesList,
} from "@/models/question";
import { SurveyStatus } from "@/models/survey";

const store = useSurveyBuilder();

const question = ref<Question>(null),
  selectedType = ref<QuestionType>(null);

const config = ref({
  modalVisible: false,
  activeSection: null,
  sectionModal: {
    visible: false,
    form: new QuestionSection(),
    close: () => {
      config.value.sectionModal.visible = false;
      config.value.sectionModal.form = new QuestionSection();
    },
    save: () => {
      store.activeSurvey.sections.push({
        id: self.crypto.randomUUID(),
        name: config.value.sectionModal.form.name,
        is_new: true,
      });
      config.value.sectionModal.close();
    },
  },
});

function questionTypeChanged(type: QuestionType, sectionId: string) {
  selectedType.value = type;

  question.value = Question.create(type, sectionId);
  question.value.id = self.crypto.randomUUID();
  question.value.section_id = sectionId;
  question.value.question_label = "Untitled question";
  store.addQuestion(question.value);
}

onMounted(() => {
  // Set active section to the first section
  if (store.sections?.length > 0) {
    config.value.activeSection = store.sections[0].id;
  }
});
</script>

<template>
  <PageHeader title="Survey Builder">
    <template #extra>
      <Popconfirm
        title="Publishing this survey will make it available for analysis. Are you sure you want to publish this survey?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="store.updateStatus(SurveyStatus.published)"
      >
        <Button
          type="primary"
          :ghost="true"
          v-if="
            store.activeSurvey.status == SurveyStatus.draft ||
            store.activeSurvey.status == null
          "
        >
          Publish</Button
        >
      </Popconfirm>

      <Popconfirm
        title="Are you sure you want to unpublish this survey?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="store.updateStatus(SurveyStatus.draft)"
      >
        <Button
          type="primary"
          :ghost="true"
          :danger="true"
          v-if="store.activeSurvey.status == SurveyStatus.published"
        >
          Unpublish
        </Button>
      </Popconfirm>

      <Popconfirm
        title="Are you sure you want to archive this survey?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="store.updateStatus(SurveyStatus.archived)"
      >
        <Button type="primary" :danger="true" :ghost="true"> Archive</Button>
      </Popconfirm>
    </template>
  </PageHeader>

  <div class="mt-5 block">
    <Spin :spinning="store.loading">
      <!-- <div class="flex justify-between mx-5 mt-10">
        <Typography.Title :level="5"> Custom Survey Builder</Typography.Title>

        <Space>
          <Button @click="config.sectionModal.visible = true"> Add Section</Button>

          <Button @click="store.saveChanges()"> Save Changes</Button>
        </Space>

        <Space>
        </Space>
      </div> -->
      <Divider></Divider>

      <div class="grid grid-cols-1 gap-4 content-center">
        <Tabs
          v-model:activeKey="config.activeSection"
          :bordered="true"
          class="mx-10"
          tab-position="left"
          v-if="store.sections.length > 0"
        >
          <TabPane :key="section.id" v-for="section in store.sections">
            <template #tab>
              <span>{{ section.name }}</span>
            </template>

            <div class="block float-right mr-24">
              <!-- TODO: add tooltip -->
              <Space v-if="store.sectionHasQuestions(section.id)">
                <Button size="small" @click.prevent="store.duplicateSection(section.id)">
                  <CopyOutlined class="pb-10" />
                  Duplicate
                </Button>

                <Button
                  type="primary"
                  size="small"
                  @click.prevent="store.deleteSection(section.id)"
                  :danger="true"
                  :ghost="true"
                >
                  <template #icon>
                    <DeleteOutlined class="pb-10" />
                  </template>
                  Delete
                </Button>
              </Space>
            </div>

            <div class="flex justify-center items-center">
              <QuestionsView
                :sub-questions="false"
                :section-id="section.id"
              ></QuestionsView>
            </div>

            <!--
        <div
          class="flex justify-center items-center"
          v-if="question != null && question.section_id == section.id"
        >
          <NewQuestion
            :key="`new-question-${section.id}`"
            :question="question"
            @saved="question = null"
            :section-id="section.id"
          ></NewQuestion>
        </div> -->

            <Divider></Divider>
            <div class="flex justify-center items-center my-10 mb-10">
              <Space>
                <span class="font-bold">New Question:</span>
                <Button
                  v-for="(questionType, index) in QuestionTypesList"
                  :key="index"
                  @click="questionTypeChanged(questionType.value, section.id)"
                >
                  {{ questionType.label }}
                </Button>
              </Space>

              <!-- <Dropdown>
            <template #overlay>
              <Menu>
                <MenuItem
                  v-for="(questionType, index) in QuestionTypesList"
                  :key="index"
                  @click="questionTypeChanged(questionType.value, section.id)"
                >
                  {{ questionType.label }}
                </MenuItem>
              </Menu>
            </template>

            <Button type="primary" class="w-22">
              Add Question
              <DownOutlined />
            </Button>
          </Dropdown> -->
            </div>
          </TabPane>
        </Tabs>
      </div>
      <Divider></Divider>
      <div class="flex justify-center items-center mt-10 mb-10">
        <Space>
          <Button size="large" @click="config.sectionModal.visible = true">
            Add Section</Button
          >

          <Button type="primary" :block="true" size="large" @click="store.saveChanges()">
            Save Changes</Button
          >
        </Space>
      </div>
    </Spin>
  </div>

  <!-- New section modal -->
  <Modal
    title="New Section"
    v-model:open="config.sectionModal.visible"
    @cancel="config.sectionModal.close()"
    @close="config.sectionModal.close()"
    ok-text="Add Section"
    @ok="config.sectionModal.save()"
  >
    <Form layout="vertical">
      <FormItem
        label="Section Name"
        :required="true"
        :rules="[{ required: true, message: 'Please enter section name!' }]"
      >
        <Input
          v-model:value="config.sectionModal.form.name"
          placeholder="Section Name"
          :required="true"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped>
body {
  overflow-x: hidden;
}
</style>
