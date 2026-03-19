<template>
  <Form layout="vertical">
    <Row :gutter="10">
      <Col :span="12">
        <FormItem label="Language">
          <languages-selector
            :options="store.languages"
            :languages="messageLanguages"
            @language-selected="
              (language) =>
                store.addMessageLanguage({
                  message,
                  language,
                })
            "
            @language-deleted="(code) => store.removeMessageLanguage(code, message)"
            :multiple="true"
          />
        </FormItem>
      </Col>

      <Col :span="12">
        <FormItem label="Default Category" required>
          <Select
            name="defaultCat"
            :options="categories"
            :value="selectedCategory"
            :field-names="{ label: 'full_name', value: 'code' }"
            placeholder="Select the default category"
            @select="message.default_category_code = $event.code"
            @deselect="message.default_category_code = null"
          >
          </Select>
        </FormItem>
      </Col>
    </Row>

    <Row :gutter="8">
      <Col :span="12">
        <FormItem label="SDG Goals">
          <Select
            name="sdgGoals"
            :options="goals"
            :field-names="{ label: 'label', value: 'goalId' }"
            :value="selectedGoal"
            :max-height="200"
            track-by="section"
            placeholder="Select the goal"
            @select="
              store.setMessageSDGGoal({
                deployment,
                playlist,
                message,
                goal: $event.goalId,
              })
            "
            @deselect="
              store.setMessageSDGGoal({ deployment, playlist, message, goal: null })
            "
          >
          </Select>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="Audience">
          <Input v-model:value="message.audience" />
        </FormItem>
      </Col>
    </Row>

    <Row :gutter="8">
      <Col :span="12">
        <FormItem label="SDG Target">
          <Select
            name="sdgTarget"
            class="md:col-span-3"
            :value="selectedTarget"
            :field-names="{ label: 'label', value: 'targetId' }"
            :custom-label="(opt:any) => `${message.sdg_goal}.${opt.targetId} ${opt.label}`"
            :max-height="200"
            placeholder="Select the target"
            @select="
              store.setMessageSDGTarget({
                deployment: props.deployment,
                playlist,
                message,
                target: $event.targetId,
              })
            "
            @remove="
              store.setMessageSDGTarget({
                deployment: props.deployment,
                playlist,
                message,
                target: null,
              })
            "
          >
            <SelectOption v-for="target of targets" :value="target.targetId">
              {{ message.sdg_goal }}.{{ target.targetId }} {{ target.label }}
            </SelectOption>
          </Select>
        </FormItem>
      </Col>

      <Col :span="12">
        <FormItem label="Format">
          <Select
            name="format"
            v-model:value="message.format"
            :options="formatOptions"
            placeholder="Select a format"
          />
        </FormItem>
      </Col>
    </Row>

    <Row :gutter="8">
      <Col :span="12">
        <FormItem label="Variant">
          <Input name="variant" type="text" v-model:value="message.variant">
            <template #suffix>
              <Tooltip
                text="Please keep the variant short and abbreviated. For example, use 'T' instead of Test."
              >
                <InfoCircleOutlined />
              </Tooltip>
            </template>
          </Input>
        </FormItem>
      </Col>

      <Col :span="12">
        <FormItem label="Key Points">
          <Textarea
            name="key_points"
            :cols="30"
            :rows="3"
            v-model:value="message.key_points"
          >
          </Textarea>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script setup lang="ts">
import LanguagesSelector from "@/components/LanguagesSelector.vue";
import sustainableDevelopmentGoals from "@/data/sustainableDevelopmentGoals.json";
import { useProgramSpecStore } from "@/store/programspec";
import { Playlist } from "@/models/playlist";
import { Deployment } from "@/models/deployment";
import { Message } from "@/models/message";
import { computed, ref } from "vue";
import { useCategoriesStore } from "@/store/categories";
import {
  Row,
  Col,
  Select,
  Textarea,
  Input,
  SelectOption,
  Form,
  FormItem,
  Tooltip,
} from "ant-design-vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";

const props = defineProps<{
  deployment: Deployment;
  playlist: Playlist;
  message: Message;
}>();

const store = useProgramSpecStore();

const formatOptions = ref([
  { value: "Drama", label: "Drama" },
  { value: "Endorsement", label: "Endorsement" },
  { value: "Interview", label: "Interview" },
  { value: "Message", label: "Message" },
  { value: "Song", label: "Song" },
  { value: "Other", label: "Other" },
]);
const goals = ref(sustainableDevelopmentGoals);

const messageLanguages = computed(() => {
  // if (!props.message.languages) {
    // store.languages.forEach((l) => {
    //   store.addMessageLanguage({
    //     message: props.message,
    //     language: l.code,
    //   });
    // });
    // props.message.languages = (store.general.languages || []).join(",");
    // return store.general.languages;
  // }
  return store.getMessageLanguages(props.message);
});

const categories = computed(() => {
  return (useCategoriesStore().categories || []).filter((cat) => cat.isleafnode);
});

const targets = computed(() => {
  const goal = goals.value.find((goal) => goal.goalId == props.message.sdg_goal_id);

  if (goal) return goal.targets;
  return [];
});

const selectedCategory = computed(() => {
  let cat = categories.value.find(
    (cat) => cat.full_name === props.message.default_category_code
  );
  if (!cat)
    cat = categories.value.find(
      (cat) => cat.name === props.message.default_category_code
    );
  if (!cat)
    cat = categories.value.find(
      (cat) => cat.code === props.message.default_category_code
    );
  return cat?.code;
});

const selectedGoal = computed(() => {
  // Goals are like:
  // {
  //      "goalId": 1, "sdg_goal": "1",
  //      "label": "No Poverty",
  //      "imgUrl": "https://amplio-suite.s3-us-west-2.amazonaws.com/img/goals/Goal-1.png",
  //      "targets": [
  //          . . .
  console.log(`Searching ${goals.value.length} goals for ${props.message.sdg_goal}`);
  // noinspection EqualityComparisonWithCoercionJS
  let goal = goals.value.find((g) => g.goalId == props.message.sdg_goal_id);
  if (goal)
    console.log(
      `message.sdg_goal: ${props.message.sdg_goal}, found ${goal.goalId}, ${goal.label}`
    );
  else console.log(`message.sdg_goal: ${props.message.sdg_goal}, found nothing`);
  return goal?.goalId;
});

const selectedTarget = computed(() => {
  // Targets are like:
  // "targets": [
  //     {
  //         "goalId": 1, "sdg_goal": "1",
  //         "targetId": 1,
  //         "name": 1.1, "sdg_target": "1.1",
  //         "label": "Eradicate extreme poverty"
  //     },
  console.log(
    `Searching ${targets.value.length} targets for ${props.message.sdg_target}`
  );
  // noinspection EqualityComparisonWithCoercionJS
  let target = targets.value.find((t) => t.sdg_target == props.message.sdg_target);
  if (!target) {
    // noinspection EqualityComparisonWithCoercionJS
    target = targets.value.find((t) => t.targetId == props.message.sdg_target_id);
  }
  if (target)
    console.log(
      `message.sdg_target_id: ${props.message.sdg_target}, sdg_target: ${props.message.sdg_target}, found ${target.targetId} (${target.sdg_target}), ${target.label}.`
    );
  else
    console.log(
      `message.sdg_target_id: ${props.message.sdg_target}, sdg_target: ${props.message.sdg_target}, found nothing`
    );
  return target?.goalId;
});
</script>
