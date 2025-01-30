<script setup lang="ts">
import {
  Card,
  Button,
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Space,
  Divider,
  Textarea,
  Switch,
} from "ant-design-vue";
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons-vue";
import { onBeforeUnmount, ref } from "vue";
import { type Question, type QuestionChoice, QuestionType } from "@/models/question";
import OptionIcon from "./OptionIcon.vue";
import QuestionCondition from "./QuestionCondition.vue";
import { useSurveyBuilder } from "@/store/survey_builder.store";
import Modal from "ant-design-vue/es/modal/Modal";

const props = defineProps<{
  question: Question;
  sectionId?: string | number;
  parent?: Question;
  editing?: boolean;
  index: number;
}>();

const emit = defineEmits<{
  (event: "saved", question: Question): Question;
}>();

const store = useSurveyBuilder();
const questionTypes = [
  { value: "open_ended", label: "Open Ended" },
  // { value: "date", label: "Date" },
  { value: "multi_choice", label: "Multiple Choice" },
  // { value: "number", label: "Number" },
  // { value: "scale", label: "Scale" },
  { value: "single_choice", label: "Single Choice" },
  // { value: "text", label: "Text" },
  // { value: "time", label: "Time" },
];
const form = ref(props.question);

const config = ref({
  modalVisible: false,
});

function addOption(isOther: boolean = false, parent_id?: string | number) {
  const parent =
    parent_id == null ? null : form.value.choices.find((x) => x.choice_id == parent_id);

  const _list = parent_id == null ? form.value.choices : parent.sub_options ?? [];

  let maxSequence = Number(Math.max(..._list.map((x) => x.order)));
  if (!maxSequence) {
    maxSequence = _list.length;
  }

  const option: QuestionChoice = {
    choice_id: crypto.randomUUID(),
    question_id: form.value._id,
    value: isOther ? "Other" : null,
    is_other: isOther,
    order: maxSequence + 1,
    is_new: true,
    parent_id: parent_id,
    sub_options: [],
  };

  if (parent_id != null) {
    parent.sub_options ??= [];
    parent.sub_options.push(option);
    const index = form.value.choices.findIndex((f) => f.choice_id == parent_id);
    form.value.choices[index] = parent;
  } else {
    form.value.choices.push(option);
  }
}

function deleteQuestionOptionItem(id: string | number, parent_id?: string | number) {
  let index = -1,
    choice: QuestionChoice = null;

  if (parent_id != null) {
    index = form.value.choices.findIndex((f) => f.choice_id == parent_id);
    choice = form.value.choices[index];

    const subIndex = choice.sub_options.findIndex((f) => f.choice_id == id);
    choice.sub_options[subIndex].is_deleted = true;
  } else {
    index = form.value.choices.findIndex((f) => f.choice_id == id);
    choice = form.value.choices[index];
    choice.is_deleted = true;
  }

  form.value.choices[index] = choice;
}

function saveQuestion(q: Question) {
  q._id = q._id ? q._id : self.crypto.randomUUID();
  q.section_id ??= props.sectionId;
  q.order = props.index;

  // if (props.editing) {
  store.updateQuestion(q);
  // }
  //  else {
  //   q.parent_id = props.parent?.id;
  //   store.addQuestion(q);
  // }
  emit("saved", q);
}

// function cancelQuestion() {
//   console.log("cancelQuestion");
//   form.value = store.findById(props.question.id);
//   emit("saved", null);
// }

function confirmDelete(question: Question) {
  Modal.confirm({
    title: "Are you sure?",
    content: "This action cannot be undone.",
    onOk: () => {

      store.deleteQuestion(question);


    }
  });
}
onBeforeUnmount(() => {
  saveQuestion(form.value);
});

function duplicateQuestion(question: Question) {
  const new_question = store.duplicateQuestion({
    source: question,
    sectionId: question.section_id,
  });
  store.addQuestion(new_question);
}
</script>

<template>
  <Card type="inner" size="small" class="my-6" style="width: 58vw" :hoverable="true">
    <QuestionCondition :question="form" :visible="config.modalVisible" @closed="config.modalVisible = false">
    </QuestionCondition>

    <Form layout="vertical" @blur="saveQuestion(form)">
      <Row :gutter="10">
        <Col :span="19">
        <FormItem label="">
          <Input size="large" type="text" class="w-full" placeholder="Enter question text"
            v-model:value="form.question_label" />
        </FormItem>
        </Col>

        <Col :span="4">
        <Button @click.prevent="config.modalVisible = true"> Condition</Button>
        </Col>
      </Row>

      <div v-if="form.type === QuestionType.open_ended">
        <Textarea class="my-2" placeholder="Open ended response..." :disabled="true"></Textarea>
      </div>

      <div v-if="
        form.type === QuestionType.multi_choice ||
        form.type === QuestionType.single_choice
      ">
        <div v-for="(option, index) in form.choices">
          <!-- <div v-if="!(option.is_deleted || false)" class="flex">
          <div>

          </div>
            <div class="flex" v-for="(option, index) in form.choices"> -->
          <div v-if="!(option.is_deleted || false)">
            <div class="flex">
              <OptionIcon :type="form.type" class="mt-6"></OptionIcon>
              <Input type="text" class="my-2 mx-3 px-5" placeholder="Enter an answer choice"
                v-model:value="option.value" :disabled="option.is_other" />

              <span class="float-right mx-8 my-4 text-center">
                <Button size="small" :ghost="true" :danger="true" @click="deleteQuestionOptionItem(option.choice_id)"
                  v-if="index > 0">
                  <template #icon>
                    <DeleteOutlined class="pb-14"></DeleteOutlined>
                  </template>
                </Button>
              </span>
            </div>

            <!-- Sub Options -->
            <div class="pl-12">
              <!-- TODO: change to option.sub_options -->
              <div v-for="sub in option.sub_options || []">
                <div v-if="!(sub.is_deleted || false)" class="flex">
                  <OptionIcon :type="form.type" class="mt-6"></OptionIcon>
                  <Input type="text" class="my-2 mx-3 px-5" placeholder="Enter an answer choice"
                    v-model:value="sub.value" :disabled="sub.is_other" />

                  <span class="float-right mx-8 my-4 text-center">
                    <Button size="small" :ghost="true" :danger="true"
                      @click="deleteQuestionOptionItem(sub.choice_id, option.choice_id)">
                      <template #icon>
                        <DeleteOutlined class="pb-14"></DeleteOutlined>
                      </template>
                    </Button>
                  </span>
                </div>
              </div>

              <!-- TODO: Implement adding new option -->
              <span class="block">
                <Button type="link" @click="addOption(false, option.choice_id)">
                  add sub option
                </Button>
                <!-- or
                <Button
                  type="link"
                  :ghost="true"
                  @click="addOption(true, option.choice_id)"
                >
                  add "Other"
                </Button> -->
              </span>
            </div>
          </div>

          <!-- TODO: implement adding sub options -->
        </div>

        <span class="mt-5 block">
          <Button type="link" @click="addOption()"> Add option </Button>
          or
          <Button type="link" @click="addOption(true)"> add "Other" </Button>
        </span>
      </div>

      <Divider></Divider>

      <div class="flex justify-between">
        <div>
          <span> Required <Switch v-model:checked="form.required"></Switch> </span>
        </div>

        <div>
          <Space>
            <Button @click="duplicateQuestion(question)">
              <CopyOutlined /> Duplicate
            </Button>
            <Button type="primary" :danger="true" :ghost="true" @click="confirmDelete(question)">
              <template #icon>
                <DeleteOutlined />
              </template>Delete>>
            </Button>
          </Space>
        </div>
      </div>
      <!-- TODO: add delete button -->
      <!-- <button type="button" class="vsb-btn-link mr-10 color-red" @click="deleteQuestion(question)">Delete</button> -->
    </Form>
  </Card>
</template>

<style scoped>
.question-input {
  margin-left: 20px;
  margin-bottom: 12px;
  max-width: 95%;
}
</style>
