<script lang="ts" setup>
import {
  Button,
  Card,
  Divider,
  FormItem,
  Radio,
  RadioGroup,
  Space,
  Form,
  Input,
  Empty,
} from "ant-design-vue";
// import { Question, QuestionType } from "./types";
import { computed, markRaw, onMounted, ref, toRaw } from "vue";
import { useSurveyBuilder } from "@/store/survey_builder.store";
import OptionIcon from "./OptionIcon.vue";
import NewQuestion from "./NewQuestion.vue";
import draggable from "vuedraggable";
import { Question, QuestionType } from "@/models/question";

const props = defineProps<{
  sectionId?: string | number;
  parent?: Question;
  subQuestions: boolean;
}>();

const store = useSurveyBuilder();
const drag = ref(false);
const config = ref<{
  showSubQuestions: boolean;
  mode: "edit" | "sub-question";
  selectedQuestion: Question;
}>({
  showSubQuestions: props.subQuestions,
  mode: "edit",
  selectedQuestion: null,
});

function editQuestion(question: Question) {
  config.value.selectedQuestion = Question.fromJson(JSON.parse(JSON.stringify(question)));
  config.value.mode = "edit";
}

const getQuestions = computed({
  get: () => {
    return store.questions({
      sectionId: props.sectionId,
      parentId: props.parent?.id,
      isSubQuestions: props.subQuestions,
    });
  },
  set: (questions) => {
    store.reorderQuestions(questions);
  },
});

function duplicateQuestion(question: Question) {
  const new_question = store.duplicateQuestion({
    source: question,
    sectionId: question.section_id,
  });
  store.addQuestion(new_question);
}

function focusCard(question: Question) {
  editQuestion(question);
}
</script>

<template>
  <div>
    <Empty
      v-if="getQuestions.length == 0"
      description="No questions in this section"
    ></Empty>

    <draggable
      v-else
      v-model="getQuestions"
      group="people"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
    >
      <template #item="{ element: question, index }">
        <div>
          <div v-if="config.selectedQuestion?.id == question.id && config.mode == 'edit'">
            <NewQuestion
              :question="config.selectedQuestion"
              :editing="true"
              :index="index"
              :parent="props.parent"
              @saved="
                config.mode = 'edit';
                config.selectedQuestion = null;
              "
            ></NewQuestion>
          </div>

          <Card
            :bordered="true"
            type="inner"
            size="small"
            class="mb-6"
            style="width: 50vw"
            v-else
            @click.prevent="focusCard(question)"
          >
            <Form layout="vertical" :disabled="true">
              <p class="mb-5">
                <span class="mr-2">{{ index + 1 }}.</span> {{ question.question_label }}
              </p>
              <div v-if="question.type == QuestionType.open_ended" class="ml-6">
                <Input
                  class="my-2 w-4/6"
                  placeholder="Open ended response..."
                  :disabled="true"
                ></Input>
              </div>

              <div
                class="ml-6"
                v-if="
                  question.type === QuestionType.multi_choice ||
                  question.type === QuestionType.single_choice
                "
              >
                <div class="flex" v-for="option in question.choices">
                  <div v-if="!(option.is_deleted || false)">
                    <div class="flex">
                      <OptionIcon :type="question.type" class="mt-1 mr-3"></OptionIcon>
                      <span class="mb-2 block">{{ option.value }}</span>
                    </div>

                    <!-- Sub options -->
                    <div class="flex ml-10" v-for="sub in option.sub_options || []">
                      <div v-if="!(sub.is_deleted || false)" class="flex">
                        <OptionIcon :type="question.type" class="mt-1 mr-3"></OptionIcon>
                        <span class="mb-2 block">{{ sub.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </Card>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped lang="scss"></style>
