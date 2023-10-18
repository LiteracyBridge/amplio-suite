<template>
  <Box
    :step="step"
    :prev="{ name: 'step-feedback' }"
    :next="{ name: 'step-final' }"
    title="You are doing great!"
  >
    <p class="text-2xl font-semibold">
      What languages will you develop your content in?
    </p>

    <div class="flex justify-center">
      <LanguagesSelector
        :languages="this.languages"
        :onLanguageSelected="this.onLanguageSelected"
        :onLanguageDeleted="this.onLanguageDeleted"
        labelBy='name'
        :autofocus="true"
      />
    </div>
  </Box>
</template>

<script>
import { mapState, mapActions } from 'pinia'

import Box from '@/components/SetupBox'
import LanguagesSelector from '@/components/LanguagesSelector'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  components: {
    Box,
    LanguagesSelector,
  },
  computed: {
      ...mapState('programspec', {
          languages: (state) => state.general.languages,
      }),
  },
  async created() {
    await this.fetchLanguages()
  },

  async mounted() {
    console.log('Languages wiz mounted');
    await this.fetchLanguages()
    console.log('Languages wiz called fetchLanguages');
  },
  methods: {
    ...mapActions('wizard', [
      'setLanguages',
      'deleteLanguage',
    ]),
    ...mapActions('languages', [
      'fetchLanguages',
    ]),
    onLanguageSelected(language) {
      let index = this.languages.length
      this.setLanguages({ lang: language.code, index, step: this.step })
    },
    onLanguageDeleted(language) {
      this.deleteLanguage({ lang: language.code, step: this.step })
    },

  }
}
</script>
