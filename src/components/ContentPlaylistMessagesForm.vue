<template>
  <div v-if="message" class="grid grid-cols-content-message row-gap-2 items-center px-8">
    <span>Language</span>
    <languages-selector
      :languages="message.language"
      :onLanguageSelected="({ name, code }) => setMessageLang({ playlistIndex, messageIndex, lang: code })"
      :onLanguageDeleted="({ name, code }) => setMessageLang({ playlistIndex, messageIndex, lang: '' })"
      :multiple="false"
    />

    <span class="pl-4">Format</span>
    <multiselect
      :value="message.format"
      :options="formatOptions"
      placeholder="Select a format"
      @select="(format) => setMessageFormat({ playlistIndex, messageIndex, format })"
      @remove="(format) => setMessageFormat({ playlistIndex, messageIndex, format: null })"
    />

    <span>Default Category</span>
    <multiselect
      :options="categories"
      :value="selectedCategory"
      :custom-label="(opt) => `${opt.name} - ${opt.full_name}`"
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

    <span>SDG Goals</span>
    <multiselect
      class="col-span-3"
      :options="goals"
      :value="selectedGoal"
      :custom-label="(opt) => `${opt.section}. ${opt.goal}`"
      track-by="section"
      placeholder="Select the goal"
      @select="(opt) => setMessageSDGGoal({ playlistIndex, messageIndex, goal: opt.section })"
      @remove="(opt) => setMessageSDGGoal({ playlistIndex, messageIndex, goal: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ props.option.section }}. {{ props.option.goal }}</span>
      </template>
    </multiselect>

    <span>SDG Target</span>
    <multiselect
      class="col-span-3"
      :options="targets"
      :value="selectedTarget"
      :custom-label="(opt) => `${message.sdg_goal}.${opt.subsection} ${opt.label}`"
      track-by="subsection"
      placeholder="Select the target"
      @select="(opt) => setMessageSDGTarget({ playlistIndex, messageIndex, target: opt.subsection })"
      @remove="(opt) => setMessageSDGTarget({ playlistIndex, messageIndex, target: null })"
    >
      <template slot="option" slot-scope="props">
        <span>{{ message.sdg_goal }}.{{ props.option.subsection }} {{ props.option.label }}</span>
      </template>
    </multiselect>

    <span>Key Points</span>
    <textarea
      cols="30"
      rows="3"
      class="col-start-2 col-end-5 p-2 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="message.key_point"
      @input="(event) => setMessageKeyPoints({ playlistIndex, messageIndex, text: event.target.value })"
    >
    </textarea>

    <span>Variant</span>
    <v-input
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
  mounted() {
    this.fetchSustainableDevelopments()
  },
  methods: {
    ...mapActions('sustainableDevelopments', [
      'fetchSustainableDevelopments'
    ]),
    ...mapActions('content', [
      'setMessageVariant',
      'setMessageFormat',
      'setMessageLang',
      'setMessageCategory',
      'setMessageSDGGoal',
      'setMessageSDGTarget',
      'setMessageKeyPoints'
    ]),
  }
}
</script>
