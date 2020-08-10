<template>
  <div>
    <div v-if="supportedLanguages.length > 0">
      <div
        v-for="language in this.languages"
        :key="language"
        class="flex my-2 text-left"
      >
        <button @click="deleteLanguage(language)" :aria-label="`Delete ${languageName(languageFromCode(language))} language`">
          <font-awesome-icon icon="trash-alt" class="w-6 h-6 mx-4 text-red-500" />
        </button>
        <span class="w-48 block py-2 px-5 rounded">
          {{languageName(languageFromCode(language))}}
        </span>
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
    <font-awesome-icon
        v-else
        icon="spinner"
        size="4x"
        pulse
        class="mx-auto w-20 h-20" />
  </div>
</template>
<style>
.autocomplete {
  @apply w-64;
}
.autocomplete-input {
  @apply block w-64 py-2 px-5 rounded border border-solid border-gray-500;
}
.autocomplete-input:focus {
  @apply outline-none shadow-outline;
}
.autocomplete-result-list {
  @apply bg-gray-300 rounded mt-1;
}
.autocomplete-result {
  @apply p-2;
}
.autocomplete-result:hover {
  @apply bg-gray-500 cursor-pointer;
}
</style>

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
    },
    autofocus: {
      type: Boolean,
      default: false,
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
  watch: {
    supportedLanguages() {
      if (this.autofocus && this.supportedLanguages.length > 0) {
        this.$nextTick(() => {
          this.$refs.language_autocomplete.$refs.input.focus()
        });
      }
    }
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
