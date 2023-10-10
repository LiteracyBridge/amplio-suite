<template>
  <div v-if="message" class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 items-center px-8 rounded-border">
    <span>Language</span>
    <languages-selector
      class="md:col-span-3"
      :options="programLanguages"
      :languages="messageLanguages"
      :onLanguageSelected="(language) => addMessageLanguage({ deployment, playlist, message, language })"
      :onLanguageDeleted="(language) => removeMessageLanguage({ deployment, playlist, message, language })"
      :multiple="true"
    />

    <label for="defaultCat">Default Category</label>
    <multiselect
      name="defaultCat"
      class="md:col-span-3"
      :options="categories"
      :value="selectedCategory"
      :custom-label="(opt) => `${opt.full_name}`"
      :max-height="200"
      track-by="code"
      placeholder="Select the default category"
      @select="(opt) => setMessageCategory({ deployment, playlist, message, category: opt.full_name, code: opt.code })"
      @remove="(opt) => setMessageCategory({ deployment, playlist, message, category: null, code: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ props.option.name }} - {{ props.option.full_name }}</span>
      </template>
    </multiselect>

    <label for="sdgGoals">SDG Goals</label>
    <multiselect
      name="sdgGoals"
      :options="goals"
      :value="selectedGoal"
      :custom-label="(opt) => `${opt.goalId}. ${opt.label}`"
      :max-height="200"
      track-by="section"
      placeholder="Select the goal"
      @select="(opt) => setMessageSDGGoal({ deployment, playlist, message, goal: opt.goalId })"
      @remove="(opt) => setMessageSDGGoal({ deployment, playlist, message, goal: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ props.option.goalId }}. {{ props.option.label }}</span>
      </template>
    </multiselect>

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
      :custom-label="(opt) => `${message.sdg_goal}.${opt.targetId} ${opt.label}`"
      :max-height="200"
      track-by="subsection"
      placeholder="Select the target"
      @select="(opt) => setMessageSDGTarget({ deployment, playlist, message, target: opt.targetId })"
      @remove="(opt) => setMessageSDGTarget({ deployment, playlist, message, target: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ message.sdg_goal }}.{{ props.option.targetId }} {{ props.option.label }}</span>
      </template>
    </multiselect>

    <label for="keyPoints">Key Points</label>
    <textarea
      name="keyPoints"
      cols="30"
      rows="3"
      class="md:col-span-3 p-2 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="message.key_points"
      @input="(event) => setMessageKeyPoints({ deployment, playlist, message, text: event.target.value })"
    >
    </textarea>

    <label class="md:px-4" for="format">Format</label>
    <multiselect
      name="format"
      :value="message.format"
      :options="formatOptions"
      placeholder="Select a format"
      @select="(format) => setMessageFormat({ deployment, playlist, message, format })"
      @remove="(format) => setMessageFormat({ deployment, playlist, message, format: null })"
    />

    <label for="variant" class="px-2">Variant</label>
    <div >
      <v-input
        name="variant"
        type="text"
        mx="mx-0"
        :value="message.variant"
        @input="(event) => setMessageVariant({ deployment, playlist, message, variant: event.target.value })"
      />
      <v-tooltip
        v-if="message.variant && message.variant.length > 2"
        text="Please keep the variant short and abbreviated. For example, use 'T' instead of Test."
        class="my-auto ml-2"
      >
        <font-awesome-icon
          class="text-orange-600"
          icon="exclamation-circle"
        />
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Multiselect from 'vue-multiselect'
import VInput from '@/components/VInput.vue'
import LanguagesSelector from '@/components/LanguagesSelector'
import VTooltip from '@/components/VTooltip'
import sustainableDevelopmentGoals from '@/data/sustainableDevelopmentGoals.json'

export default {
  props: {
    deployment: {
      type: Object,
      required: true
    },
    playlist: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },

  },
  computed: {
    // The program's configured languages.
    ...mapState('programspec', {
      programLanguages: (state)=>state.general.languages
    }),

    messageLanguages () {
      if (!this.message.languages) return this.programLanguages;
      return this.message.languages.split(/[,;]/);
    },

    categories () {
      return this.$store.state.categories.categories
        .filter(cat => cat.is_leaf || cat.isleafnode)
    },

    audience: {
      get() {
        if (!this.message.audience || this.message.audience === 'null') return '';
        return this.message.audience;
      },
      set(newValue) {
        this.setMessageAudience({deployment: this.deployment, playlist: this.playlist, message: this.message, audience: newValue});
      }
    },


    targets () {
      // noinspection EqualityComparisonWithCoercionJS
      const goal = this.goals
        .find(goal => goal.goalId == this.message.sdg_goal)

      if (goal) return goal.targets
      else return []
    },

    selectedCategory () {
      let cat = this.categories.find(cat => cat.full_name === this.message.default_category_code);
      if (!cat) cat = this.categories.find(cat => cat.name === this.message.default_category_code);
      if (!cat) cat = this.categories.find(cat => cat.code === this.message.default_category_code);
      return cat;
    },

    selectedGoal () {
        // Goals are like:
        // {
        //      "goalId": 1, "sdg_goal": "1",
        //      "label": "No Poverty",
        //      "imgUrl": "https://amplio-suite.s3-us-west-2.amazonaws.com/img/goals/Goal-1.png",
        //      "targets": [
        //          . . .
      console.log(`Searching ${this.goals.length} goals for ${this.message.sdg_goal}`);
      // noinspection EqualityComparisonWithCoercionJS
      let goal = this.goals.find(g => g.goalId == this.message.sdg_goal)
      if (goal)
        console.log(`message.sdg_goal: ${this.message.sdg_goal}, found ${goal.goalId}, ${goal.label}`);
      else
        console.log(`message.sdg_goal: ${this.message.sdg_goal}, found nothing`);
      return goal;
    },

    selectedTarget () {
        // Targets are like:
        // "targets": [
        //     {
        //         "goalId": 1, "sdg_goal": "1",
        //         "targetId": 1,
        //         "name": 1.1, "sdg_target": "1.1",
        //         "label": "Eradicate extreme poverty"
        //     },
      console.log(`Searching ${this.targets.length} targets for ${this.message.sdg_target}`);
      // noinspection EqualityComparisonWithCoercionJS
      let target = this.targets.find(t => t.sdg_target == this.message.sdg_target)
      if (!target) {
        // noinspection EqualityComparisonWithCoercionJS
        target = this.targets.find(t => t.targetId == this.message.sdg_target)
      }
      if (target)
        console.log(`message.sdg_target_id: ${this.message.sdg_target}, sdg_target: ${this.message.sdg_target}, found ${target.targetId} (${target.sdg_target}), ${target.label}.`);
      else
        console.log(`message.sdg_target_id: ${this.message.sdg_target}, sdg_target: ${this.message.sdg_target}, found nothing`);
      return target;
    },
  },

  components: {
    Multiselect,
    VInput,
    LanguagesSelector,
    VTooltip,
  },

  data () {
    return {
      formatOptions: [
        'Drama',
        'Endorsement',
        'Interview',
        'Message',
        'Song',
        'Other',
      ],
      goals: sustainableDevelopmentGoals,
    }
  },

  methods: {
    ...mapActions('programspec', [
      'setMessageVariant',
      'setMessageFormat',
      'addMessageLanguage',
      'removeMessageLanguage',
      'setMessageCategory',
      'setMessageAudience',
      'setMessageSDGGoal',
      'setMessageSDGTarget',
      'setMessageKeyPoints'
    ]),

    setSdgGoal(opt) {
      console.log(`Set goal: ${opt}`);
    },
    setSdgTarget(opt) {
      console.log(`Set target: ${opt}`);
    },
  }
}
</script>
