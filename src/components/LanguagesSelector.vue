<template>
  <div v-if="supportedLanguages.length > 0">
    <div
      v-for="language in this.languages"
      :key="language"
      class="flex"
    >
      <span>{{languageName(languageFromCode(language))}}</span>
      <button @click="deleteLanguage(language)" aria-label="Delete language">
        <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
      </button>
    </div>

    <autocomplete
      ref="language_autocomplete"
      :search="searchLanguage"
      placeholder="Type a language to add"
      aria-label="Type a language to add"
      :get-result-value="languageName"
      autofocus="true"
      @submit="this.languageSelected"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Autocomplete from '@trevoreyre/autocomplete-vue'

export default {
  components: {
    Autocomplete,
  },
  props: {
    languages: {
      required: true,
      type: Array,
    },
    onLanguageSelected: {
      required: true,
      type: Function,
    },
    onLanguageDeleted: {
      required: true,
      type: Function,
    }
  },
  computed: {
    ...mapState('languages', {
      supportedLanguages: state => state.languages,
    }),
  },
  mounted() {
    this.fetchLanguages()
  },
  methods: {
    ...mapActions('languages', [
      'fetchLanguages',
    ]),
    languageFromCode(code) {
      return this.supportedLanguages.find(language => { return language.code == code}) || {}
    },
    searchLanguage(input) {
      if (input.length < 1) { return [] }
      let searchKey = input.toLowerCase()
      return this.supportedLanguages.filter(language => {
        return (language.code.toLowerCase().includes(searchKey) || language.name.toLowerCase().includes(searchKey)) && !this.languages.includes(language.code)
      })
    },
    languageName(language) {
      return language.name
    },
    languageSelected(language) {
      const code = language.code
      this.onLanguageSelected(code)
      this.$refs['language_autocomplete'].value = ''
    },
    deleteLanguage(code) {
      this.onLanguageDeleted(code, this.languageFromCode(code))
    },
  },
}
</script>
