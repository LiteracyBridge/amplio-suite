<template>
  <div v-if="message" class="grid grid-cols-content-message row-gap-2 items-center px-8">
    <span>Language</span>
    <languages-selector
      :options="languages"
      :languages="message.languages"
      :onLanguageSelected="({ name, code }) => addMessageLanguage({ playlistIndex, messageIndex, lang: code })"
      :onLanguageDeleted="({ name, code }) => removeMessageLanguage({ playlistIndex, messageIndex, lang: code })"
      :multiple="true"
    />

    <label class="pl-4" for="format">Format</label>
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
      :options="categories"
      :value="selectedCategory"
      :custom-label="(opt) => `${opt.name} - ${opt.full_name}`"
      :max-height="200"
      track-by="code"
      placeholder="Select the default category"
      class="col-span-3"
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
      class="col-span-3"
      :options="goals"
      :value="selectedGoal"
      :custom-label="(opt) => `${opt.section}. ${opt.goal}`"
      :max-height="200"
      track-by="section"
      placeholder="Select the goal"
      @select="(opt) => setMessageSDGGoal({ playlistIndex, messageIndex, goal: opt.section })"
      @remove="(opt) => setMessageSDGGoal({ playlistIndex, messageIndex, goal: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ props.option.section }}. {{ props.option.goal }}</span>
      </template>
    </multiselect>

    <label for="sdgTarget">SDG Target</label>
    <multiselect
      id="sdgTarget"
      class="col-span-3"
      :options="targets"
      :value="selectedTarget"
      :custom-label="(opt) => `${message.sdg_goal}.${opt.subsection} ${opt.label}`"
      :max-height="200"
      track-by="subsection"
      placeholder="Select the target"
      @select="(opt) => setMessageSDGTarget({ playlistIndex, messageIndex, target: opt.subsection })"
      @remove="(opt) => setMessageSDGTarget({ playlistIndex, messageIndex, target: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ message.sdg_goal }}.{{ props.option.subsection }} {{ props.option.label }}</span>
      </template>
    </multiselect>

    <label for="keyPoints">Key Points</label>
    <textarea
      id="keyPoints"
      cols="30"
      rows="3"
      class="col-start-2 col-end-5 p-2 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="message.key_point"
      @input="(event) => setMessageKeyPoints({ playlistIndex, messageIndex, text: event.target.value })"
    >
    </textarea>

    <label for="variant">Variant</label>
    <v-input
      name="variant"
      type="text"
      mx="mx-0 w-full"
      class="col-span-3"
      :value="message.variant"
      @input="(event) => setMessageVariant({ playlistIndex, messageIndex, variant: event.target.value })"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Multiselect from 'vue-multiselect'
import VInput from '@/components/VInput'
import LanguagesSelector from '@/components/LanguagesSelector'

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
    ...mapState('programData', [
      'languages'
    ]),
    ...mapState('sustainableDevelopments', [
      'goals'
    ]),
    categories () {
      return this.$store.state.categories.categories
        .filter(cat => !cat.is_leaf)
    },
    targets () {
      const goal = this.goals
        .find(goal => goal.section === this.message.sdg_goal)

      if (goal) return goal.targets
      else return []
    },
    selectedCategory () {
      return this.categories.find(cat => cat.code === this.message.default_category)
    },
    selectedGoal () {
      return this.goals.find(goal => goal.section === this.message.sdg_goal)
    },
    selectedTarget () {
      return this.targets.find(target => target.subsection === this.message.sdg_target)
    }
  },
  components: {
    Multiselect,
    VInput,
    LanguagesSelector,
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
    }
  },
  created () {
    this.fetchCategories()
    this.fetchSustainableDevelopments()
  },
  methods: {
    ...mapActions('categories', [
      'fetchCategories'
    ]),
    ...mapActions('sustainableDevelopments', [
      'fetchSustainableDevelopments'
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
