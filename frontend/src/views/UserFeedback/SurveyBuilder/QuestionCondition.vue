<script setup lang="ts">
import {
  Form,
  Input,
  Select,
  SelectOption,
  Button,
  Modal,
  Row,
  Col,
  FormItem,
  Textarea,
  Drawer,
  Divider,
  List,
  ListItem,
} from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import { Question, QuestionCondition, QuestionType } from "@/models/question";
import { ref, watch } from "vue";
import { useSurveyBuilder } from "@/store/survey_builder.store";

const props = defineProps<{
  question: Question;
  visible: boolean;
}>();

const emit = defineEmits<{
  (event: "closed", question: Question): Question;
}>();

const store = useSurveyBuilder();

const dependentForm = ref<FormInstance>(null);
const selectedQuestion = ref<Question>(null);
// const form = ref<QuestionCondition>(null);

const config = ref<{
  visible: boolean;
  dependent: QuestionCondition;
  modalVisible: boolean;
}>({
  visible: props.visible,
  modalVisible: false,
  dependent: new QuestionCondition(),
});

watch(props, (newProps) => {
  config.value.dependent = newProps.question?.conditions ?? new QuestionCondition();
  config.value.visible = newProps.visible;
});

function close() {
  config.value.visible = false;
  config.value.dependent = new QuestionCondition();
  emit("closed", props.question);
}

function addDependent() {
  dependentForm.value.validateFields().then((_) => {
    props.question.conditions = config.value.dependent;
    close();
  });
}

const onQuestionChanged = (id: any) => {
  selectedQuestion.value = store.questions().find((q) => q.id == id);
};
</script>

<template>
  <Modal
    v-model:open="config.visible"
    title="Add Conditions"
    ok-text="Save"
    @ok="addDependent()"
    @cancel="close()"
  >
    <Form layout="vertical" ref="dependentForm" :model="config.dependent">
      <FormItem label="Question" :required="true" name="question_id">
        <Select
          :show-search="true"
          :allow-clear="true"
          v-model:value="config.dependent.question_id"
          @change="onQuestionChanged($event)"
        >
          <SelectOption v-for="q in store.questions()" :key="q.id" :value="q.id">
            {{ q.question_label }}
          </SelectOption>
        </Select>
      </FormItem>

      <div v-if="selectedQuestion != null">
        <Row
          :gutter="8"
          v-if="
            selectedQuestion.type == QuestionType.multi_choice ||
            selectedQuestion.type == QuestionType.single_choice
          "
        >
          <Col :span="24">
            <FormItem label="Response" :required="true" name="value">
              <Select
                :show-search="true"
                :allow-clear="true"
                v-model:value="config.dependent.value"
              >
                <SelectOption
                  v-for="option in selectedQuestion.choices"
                  :value="option.value"
                  >{{ option.value }}</SelectOption
                >
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="8" v-else>
          <Col :span="12">
            <FormItem label="If response" name="condition" :required="true">
              <Select
                :show-search="true"
                :allow-clear="true"
                v-model:value="config.dependent.condition"
              >
                <!-- TODO: Extract these into enum -->
                <SelectOption value="contains">Has</SelectOption>
                <SelectOption value="equals">Equal To</SelectOption>
                <SelectOption value="not_equals">Not Equal To</SelectOption>
                <SelectOption value="greater_than">Greater Than</SelectOption>
                <SelectOption value="less_than">Less Than</SelectOption>
                <SelectOption value="greater_than_or_equal_to"
                  >Greater Than or Equal To</SelectOption
                >
                <SelectOption value="less_than_or_equal_to"
                  >Less Than or Equal To</SelectOption
                >
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="Value" name="value" :required="true">
              <Textarea type="text" v-model:value="config.dependent.value" />
            </FormItem>
          </Col>
        </Row>

        <FormItem label="Action" name="action" :required="true">
          <Select
            :show-search="true"
            :allow-clear="true"
            v-model:value="config.dependent.action"
          >
            <SelectOption value="show">Show</SelectOption>
            <SelectOption value="hide">Hide</SelectOption>
            <SelectOption value="required">Required</SelectOption>
          </Select>
        </FormItem>
      </div>
    </Form>
  </Modal>
</template>
