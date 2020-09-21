<template>
  <Box
    :step="step"
    :prev="{ name: 'step-feedback' }"
    :next="{ name: 'step-final' }"
    title="You are doing great!"
  >
    <p id="lang" class="text-2xl font-semibold">
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
import { mapState, mapActions } from 'vuex'

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
    ...mapState('programData', [
      'languages',
    ])
  },
  methods: {
    ...mapActions('wizard', [
      'setLanguages',
      'deleteLanguage',
    ]),
    onLanguageSelected(language) {
      let index = this.languages.length
      this.setLanguages({ lang: language.code, index, step: this.step })
    },
    onLanguageDeleted(language) {
      this.deleteLanguage({ lang: language.code, step: this.step })
    }
  }
}
</script>
