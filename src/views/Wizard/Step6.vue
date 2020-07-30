<template>
  <Box
    :prev="{ name: 'Step-5' }"
    :next="{ name: 'Step-7' }"
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
      />
    </div>
  </Box>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Box from '@/components/SetupBox'
import LanguagesSelector from '@/components/LanguagesSelector'

export default {
  components: {
    Box,
    LanguagesSelector,
  },
  computed: {
    ...mapState('programData', [
      'languages',
    ])
  },
  // mounted () {
  //   this.$refs['lang_1'][0].$el.children[0].focus()
  // },
  methods: {
    ...mapActions('wizard', [
      'setLanguages',
      'deleteLanguage',
    ]),
    onLanguageSelected(language) {
      let index = this.languages.length
      this.setLanguages({ lang: language, index })
    },
    onLanguageDeleted(language) {
      this.deleteLanguage(language)
    }
  }
}
</script>
