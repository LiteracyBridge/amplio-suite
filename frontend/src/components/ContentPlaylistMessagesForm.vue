<template>
  <div v-if="message" class="grid grid-cols-form-2 md:grid-cols-form-4 row-gap-2 items-center px-8">
    <span>Language</span>
    <languages-selector
      :options="languages"
      :languages="messageLanguages"
      :onLanguageSelected="(lang) => addMessageLanguage({ playlistIndex, messageIndex, lang })"
      :onLanguageDeleted="(lang) => removeMessageLanguage({ playlistIndex, messageIndex, lang })"
      :multiple="true"
    />

    <label class="md:px-4" for="format">Format</label>
    <multiselect
      id="format"
      :value="message.format"
      :options="formatOptions"
      placeholder="Select a format"
      @select="(format) => setMessageFormat({ playlistIndex, messageIndex, format })"
      @remove="(format) => setMessageFormat({ playlistIndex, messageIndex, format: null })"
    />

    <label for="defaultCat">Default Category</label>
    <multiselect
      id="defaultCat"
      class="md:col-span-3"
      :options="categories"
      :value="selectedCategory"
      :custom-label="(opt) => `${opt.name} - ${opt.full_name}`"
      :max-height="200"
      track-by="code"
      placeholder="Select the default category"
      @select="(opt) => setMessageCategory({ playlistIndex, messageIndex, category: opt.code })"
      @remove="(opt) => setMessageCategory({ playlistIndex, messageIndex, category: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ props.option.name }} - {{ props.option.full_name }}</span>
      </template>
    </multiselect>

    <label for="sdgGoals">SDG Goals</label>
    <multiselect
      id="sdgGoals"
      class="md:col-span-3"
      :options="goals"
      :value="selectedGoal"
      :custom-label="(opt) => `${opt.goalId}. ${opt.label}`"
      :max-height="200"
      track-by="section"
      placeholder="Select the goal"
      @select="(opt) => setMessageSDGGoal({ playlistIndex, messageIndex, goal: opt.goalId })"
      @remove="(opt) => setMessageSDGGoal({ playlistIndex, messageIndex, goal: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ props.option.goalId }}. {{ props.option.label }}</span>
      </template>
    </multiselect>

    <label for="sdgTarget">SDG Target</label>
    <multiselect
      id="sdgTarget"
      class="md:col-span-3"
      :options="targets"
      :value="selectedTarget"
      :custom-label="(opt) => `${message.sdg_goal_id}.${opt.targetId} ${opt.label}`"
      :max-height="200"
      track-by="subsection"
      placeholder="Select the target"
      @select="(opt) => setMessageSDGTarget({ playlistIndex, messageIndex, target: opt.targetId })"
      @remove="(opt) => setMessageSDGTarget({ playlistIndex, messageIndex, target: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ message.sdg_goal_id }}.{{ props.option.targetId }} {{ props.option.label }}</span>
      </template>
    </multiselect>

    <label for="keyPoints">Key Points</label>
    <textarea
      id="keyPoints"
      cols="30"
      rows="3"
      class="md:col-span-3 p-2 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="message.key_points"
      @input="(event) => setMessageKeyPoints({ playlistIndex, messageIndex, text: event.target.value })"
    >
    </textarea>

    <label for="variant">Variant</label>
    <div class="flex md:col-span-3">
      <v-input
        name="variant"
        type="text"
        mx="mx-0"
        :value="message.variant"
        @input="(event) => setMessageVariant({ playlistIndex, messageIndex, variant: event.target.value })"
      />
      <v-tooltip
        v-if="message.variant && message.variant.length > 1"
        text="Please keep variant short and abbreviated. For example, use 'T' instead of Test."
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
import VInput from '@/components/VInput'
import LanguagesSelector from '@/components/LanguagesSelector'
import VTooltip from '@/components/VTooltip'
import sustainableDevelopmentGoals from '@/data/sustainableDevelopmentGoals.json'

export default {
  props: {
    message: {
      type: Object,
      required: true
    },
    playlistIndex: {
      type: Number,
      required: true
    },
    messageIndex: {
      type: Number,
      required: true
    },
  },
  computed: {
    // The program's configured languages.
    ...mapState('programData', [
      'languages'
    ]),
    messageLanguages () {
      return this.message.languages.map(lang => lang.code)
    },
    categories () {
      return this.$store.state.categories.categories
        .filter(cat => !cat.is_leaf)
    },
    targets () {
      const goal = this.goals
        .find(goal => goal.goalId === this.message.sdg_goal_id)

      if (goal) return goal.targets
      else return []
    },
    selectedCategory () {
      return this.categories.find(cat => cat.code === this.message.default_category_id)
    },
    selectedGoal () {
      return this.goals.find(goal => goal.goalId === this.message.sdg_goal_id)
    },
    selectedTarget () {
      return this.targets.find(target => target.targetId === this.message.sdg_target_id)
    }
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
  created () {
    this.fetchCategories()
  },
  methods: {
    ...mapActions('categories', [
      'fetchCategories'
    ]),
    ...mapActions('content', [
      'setMessageVariant',
      'setMessageFormat',
      'addMessageLanguage',
      'removeMessageLanguage',
      'setMessageCategory',
      'setMessageSDGGoal',
      'setMessageSDGTarget',
      'setMessageKeyPoints'
    ]),
  }
}
</script>
