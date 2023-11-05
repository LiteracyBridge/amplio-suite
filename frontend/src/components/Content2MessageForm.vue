<template>
  <div
    v-if="message"
    class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 items-center px-8 rounded-border"
  >
    <span>Language</span>
    <languages-selector
      class="md:col-span-3"
      :options="store.general.languages"
      :languages="messageLanguages"
      @language-selected="
        (language) =>
          store.addMessageLanguage({
            deployment: props.deployment,
            playlist,
            message,
            language,
          })
      "
      @language-deleted="
        (code) =>
          store.removeMessageLanguage({
            deployment: props.deployment,
            playlist,
            message,
            language: code,
          })
      "
      :multiple="true"
    />

    <label for="defaultCat">Default Category</label>
    <Select
      name="defaultCat"
      class="md:col-span-3"
      :options="categories"
      :value="selectedCategory"
      :field-names="{ label: 'full_name', value: 'code' }"
      placeholder="Select the default category"
      @select="
        (opt:any) =>
          store.setMessageCategory({
            deployment,
            playlist,
            message,
            code: opt.code,
          })
      "
      @deselect="
        (opt:any) =>
          store.setMessageCategory({
            deployment,
            playlist,
            message,
            code: null,
          })
      "
    >
    </Select>

    <label for="sdgGoals">SDG Goals</label>
    <Select
      name="sdgGoals"
      :options="goals"
      :field-names="{ label: 'label', value: 'goalId' }"
      :value="selectedGoal"
      :max-height="200"
      track-by="section"
      placeholder="Select the goal"
      @select="
        (opt:any) =>
          store.setMessageSDGGoal({ deployment, playlist, message, goal: opt.goalId })
      "
      @deselect="
        (opt:any) => store.setMessageSDGGoal({ deployment, playlist, message, goal: null })
      "
    >
    </Select>

    <label for="audience">Audience</label>
    <input
      class="flex-auto mx-2 px-1 -mt-1 border rounded-sm text-xl"
      v-model="audience"
    />

    <label for="sdgTarget">SDG Target</label>
    <multiselect
      name="sdgTarget"
      class="md:col-span-3"
      :options="targets"
      :value="selectedTarget"
      :custom-label="(opt:any) => `${message.sdg_goal}.${opt.targetId} ${opt.label}`"
      :max-height="200"
      track-by="subsection"
      placeholder="Select the target"
      @select="
        (opt:any) =>
          store.setMessageSDGTarget({
            deployment: props.deployment,
            playlist,
            message,
            target: opt.targetId,
          })
      "
      @remove="
        (opt:any) =>
          store.setMessageSDGTarget({
            deployment: props.deployment,
            playlist,
            message,
            target: null,
          })
      "
    >
      <template slot="option" slot-scope="props">
        <span>{{ message.sdg_goal }}</span>
        <!-- <span
          >{{ message.sdg_goal }}.{{ props.option.targetId }}
          {{ props.option.label }}</span
        > -->
      </template>
    </multiselect>

    <label for="keyPoints">Key Points</label>
    <textarea
      name="keyPoints"
      cols="30"
      rows="3"
      class="md:col-span-3 p-2 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="message.key_points"
      @input="
        (event) =>
          store.setMessageKeyPoints({
            deployment,
            playlist,
            message,
            text: (event.target as any).value,
          })
      "
    >
    </textarea>

    <label class="md:px-4" for="format">Format</label>
    <multiselect
      name="format"
      :value="message.format"
      :options="formatOptions"
      placeholder="Select a format"
      @select="
        (format:any) => store.setMessageFormat({ deployment, playlist, message, format })
      "
      @remove="
        (format:any) =>
          store.setMessageFormat({ deployment, playlist, message, format: null })
      "
    />

    <label for="variant" class="px-2">Variant</label>
    <div>
      <v-input
        name="variant"
        type="text"
        mx="mx-0"
        :value="message.variant"
        @input="
          (event) =>
            store.setMessageVariant({
              deployment,
              playlist,
              message,
              variant: event.target.value,
            })
        "
      />
      <v-tooltip
        v-if="message.variant && message.variant.length > 2"
        text="Please keep the variant short and abbreviated. For example, use 'T' instead of Test."
        class="my-auto ml-2"
      >
        <font-awesome-icon class="text-orange-600" icon="exclamation-circle" />
      </v-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import Multiselect from "vue-multiselect";
import VInput from "@/components/VInput.vue";
import LanguagesSelector from "@/components/LanguagesSelector.vue";
import VTooltip from "@/components/VTooltip.vue";
import sustainableDevelopmentGoals from "@/data/sustainableDevelopmentGoals.json";
import { useProgramSpecStore } from "@/store/programspec";
import { Playlist } from "@/models/playlist";
import { Deployment } from "@/models/deployment";
import { Message } from "@/models/message";
import { computed, ref } from "vue";
import { useCategoriesStore } from "@/store/categories";
import { Select } from "ant-design-vue";

const props = defineProps<{
  deployment: Deployment;
  playlist: Playlist;
  message: Message;
}>();

const store = useProgramSpecStore();

const formatOptions = ref([
    "Drama",
    "Endorsement",
    "Interview",
    "Message",
    "Song",
    "Other",
  ]),
  goals = ref(sustainableDevelopmentGoals);

const messageLanguages = computed(() => {
  if (!props.message.languages) return store.general.languages;
  return props.message.languages.split(/[,;]/);
});

const categories = computed(() => {
  return (useCategoriesStore().categories || []).filter((cat) => cat.isleafnode);
});

const audience = computed({
  get() {
    if (!props.message.audience || props.message.audience === "null") return "";
    return props.message.audience;
  },
  set(newValue) {
    store.setMessageAudience({
      deployment: props.deployment,
      playlist: props.playlist,
      message: props.message,
      audience: newValue,
    });
  },
});

const targets = computed(() => {
  // noinspection EqualityComparisonWithCoercionJS
  const goal = goals.value.find((goal) => goal.goalId == props.message.sdg_goal_id);

  if (goal) return goal.targets;
  else return [];
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
  return target;
});

function setSdgGoal(opt: any) {
  console.log(`Set goal: ${opt}`);
}
function setSdgTarget(opt: any) {
  console.log(`Set target: ${opt}`);
}

// export default {
//   props: {
//     deployment: {
//       type: Object,
//       required: true,
//     },
//     playlist: {
//       type: Object,
//       required: true,
//     },
//     message: {
//       type: Object,
//       required: true,
//     },
//   },
// computed: {
// The program's configured languages.
// ...mapState(useProgramSpecStore, {
//   programLanguages: (state) => state.general.languages,
// }),

// messageLanguages() {
//   if (!this.message.languages) return this.programLanguages;
//   return this.message.languages.split(/[,;]/);
// },

// categories() {
//   return (this.categories || []).filter((cat) => cat.is_leaf || cat.isleafnode);
// },

// audience: {
//   get() {
//     if (!this.message.audience || this.message.audience === "null") return "";
//     return this.message.audience;
//   },
//   set(newValue) {
//     this.setMessageAudience({
//       deployment: this.deployment,
//       playlist: this.playlist,
//       message: this.message,
//       audience: newValue,
//     });
//   },
// },

// targets() {
//   // noinspection EqualityComparisonWithCoercionJS
//   const goal = this.goals.find((goal) => goal.goalId == this.message.sdg_goal);

//   if (goal) return goal.targets;
//   else return [];
// },

// selectedCategory() {
//   let cat = this.categories.find(
//     (cat) => cat.full_name === this.message.default_category_code
//   );
//   if (!cat)
//     cat = this.categories.find(
//       (cat) => cat.name === this.message.default_category_code
//     );
//   if (!cat)
//     cat = this.categories.find(
//       (cat) => cat.code === this.message.default_category_code
//     );
//   return cat;
// },

// selectedGoal() {
//   // Goals are like:
//   // {
//   //      "goalId": 1, "sdg_goal": "1",
//   //      "label": "No Poverty",
//   //      "imgUrl": "https://amplio-suite.s3-us-west-2.amazonaws.com/img/goals/Goal-1.png",
//   //      "targets": [
//   //          . . .
//   console.log(`Searching ${this.goals.length} goals for ${this.message.sdg_goal}`);
//   // noinspection EqualityComparisonWithCoercionJS
//   let goal = this.goals.find((g) => g.goalId == this.message.sdg_goal);
//   if (goal)
//     console.log(
//       `message.sdg_goal: ${this.message.sdg_goal}, found ${goal.goalId}, ${goal.label}`
//     );
//   else console.log(`message.sdg_goal: ${this.message.sdg_goal}, found nothing`);
//   return goal;
// },

// selectedTarget() {
//   // Targets are like:
//   // "targets": [
//   //     {
//   //         "goalId": 1, "sdg_goal": "1",
//   //         "targetId": 1,
//   //         "name": 1.1, "sdg_target": "1.1",
//   //         "label": "Eradicate extreme poverty"
//   //     },
//   console.log(
//     `Searching ${this.targets.length} targets for ${this.message.sdg_target}`
//   );
//   // noinspection EqualityComparisonWithCoercionJS
//   let target = this.targets.find((t) => t.sdg_target == this.message.sdg_target);
//   if (!target) {
//     // noinspection EqualityComparisonWithCoercionJS
//     target = this.targets.find((t) => t.targetId == this.message.sdg_target);
//   }
//   if (target)
//     console.log(
//       `message.sdg_target_id: ${this.message.sdg_target}, sdg_target: ${this.message.sdg_target}, found ${target.targetId} (${target.sdg_target}), ${target.label}.`
//     );
//   else
//     console.log(
//       `message.sdg_target_id: ${this.message.sdg_target}, sdg_target: ${this.message.sdg_target}, found nothing`
//     );
//   return target;
// },
// },

// components: {
//   Multiselect,
//   VInput,
//   LanguagesSelector,
//   VTooltip,
// },

// data() {
//   return {
//     formatOptions: ["Drama", "Endorsement", "Interview", "Message", "Song", "Other"],
//     goals: sustainableDevelopmentGoals,
//   };
// },

//   methods: {
//     ...mapActions(useProgramSpecStore, [
//       "setMessageVariant",
//       "setMessageFormat",
//       "addMessageLanguage",
//       "removeMessageLanguage",
//       "setMessageCategory",
//       "setMessageAudience",
//       "setMessageSDGGoal",
//       "setMessageSDGTarget",
//       "setMessageKeyPoints",
//     ]),

//     setSdgGoal(opt) {
//       console.log(`Set goal: ${opt}`);
//     },
//     setSdgTarget(opt) {
//       console.log(`Set target: ${opt}`);
//     },
//   },
// };
</script>
