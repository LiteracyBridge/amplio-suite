<template>
  <div v-if="selectedMessage" class="grid grid-cols-content-message row-gap-2 items-center px-8">
    <span>Language</span>
    <multiselect
      v-if="supportedLanguages.length > 0"
      :value="selectedMessage.language"
      :options="languages"
      :multiple="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      @input="(lang) => setMessageLang({ playlistIndex, messageIndex, lang})"
      placeholder="Select the languages"
    >
      <template slot="option" slot-scope="props">
        <div class="option__desc">
          <span class="option__title">{{ languageFromCode(props.option) }}</span>
        </div>
      </template>
    </multiselect>
    <font-awesome-icon
      v-else
      icon="spinner"
      size="2x"
      pulse
      class="mx-auto w-20 h-20" />

    <span class="pl-4">Variant</span>
    <v-input
      type="text"
      mx="mx-0 w-full"
      :value="selectedMessage.variant"
      @input="(event) => setMessageVariant({ playlistIndex, messageIndex, variant: event.target.value })"
    />

    <span>Format</span>
    <select
      class="py-2"
      :value="selectedMessage.format"
      @change="(event) => setMessageFormat({ playlistIndex, messageIndex, format: event.target.value })"
    >
      <option
        v-for="opt in formatOptions"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.text }}
      </option>
    </select>

    <span class="pl-4">Default Category</span>
    <select
      class="py-2"
      :value="selectedMessage.default_category"
      @change="setMessageCategory({ playlistIndex, messageIndex, category: $event.target.value })"
    >
      <option value="">Select</option>
      <option
        v-for="cat in categories"
        :key="cat.code"
        :value="cat.code"
      >
        {{ cat.name }} - {{ cat.full_name }}
      </option>
    </select>

    <span>SDG Goals</span>
    <select
      class="py-2 col-start-2 col-end-5"
      :value="selectedMessage.sdg_goal"
      @change="setMessageSDGGoal({ playlistIndex, messageIndex, goal: +$event.target.value })"
    >
      <option value="">Select</option>
      <option
        v-for="goal in goals"
        :key="goal.section"
        :value="goal.section"
      >
        {{ `${goal.section}. ${goal.goal}` }}
      </option>
    </select>

    <span>SDG Target</span>
    <select
      ref="sdg_target"
      class="py-2 col-start-2 col-end-5"
      :value="selectedMessage.sdg_target"
      @change="setMessageSDGTarget({ playlistIndex, messageIndex, target: +$event.target.value })"
    >
      <option value="">Select</option>
      <option
        v-for="target in targets"
        :key="target.subsection"
        :value="target.subsection"
      >
        {{ `${selectedMessage.sdg_goal}.${target.subsection} ${target.label}` }}
      </option>
    </select>

    <span>Key Points</span>
    <textarea
      cols="30"
      rows="3"
      class="col-start-2 col-end-5 p-2 rounded border border-solid border-gray-500 focus:outline-none focus:shadow-outline"
      :value="selectedMessage.key_point"
      @input="(event) => setMessageKeyPoints({ playlistIndex, messageIndex, text: event.target.value })"
    >
    </textarea>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Multiselect from 'vue-multiselect'
import VInput from '@/components/VInput'

export default {
  computed: {
    ...mapState('languages', {
      supportedLanguages: state => state.languages,
    }),
    ...mapState('programData', [
      'languages'
    ]),
    ...mapState('sustainableDevelopments', [
      'goals'
    ]),
    ...mapGetters('uiSettings', [
      'selectedMessage'
    ]),
    ...mapState('uiSettings', {
      playlistIndex: state => state.content.selectedPlaylistIndex,
      messageIndex: state => state.content.selectedMessageIndex
    }),
    categories () {
      return this.$store.state.categories.categories
        .filter(cat => !cat.is_leaf)
    },
    targets () {
      const goal = this.goals
        .find(goal => goal.section === this.selectedMessage.sdg_goal)

      if (goal) return goal.targets
      else return []
    }
  },
  components: {
    Multiselect,
    VInput,
  },
  data () {
    return {
      formatOptions: [
        { value: '', text: 'Select One' },
        { value: 'drama', text: 'Drama' },
        { value: 'endorsement', text: 'Endorsement' },
        { value: 'interview', text: 'Interview' },
        { value: 'message', text: 'Message' },
        { value: 'song', text: 'Song' },
        { value: 'other', text: 'Other' },
      ],
    }
  },
  mounted() {
    this.fetchLanguages()
    this.fetchSustainableDevelopments()
  },
  methods: {
    ...mapActions('languages', [
      'fetchLanguages',
    ]),
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
    languageFromCode (code) {
      return this.supportedLanguages
        .find(language => language.code == code)
        .name
    },
  }
}
</script>
