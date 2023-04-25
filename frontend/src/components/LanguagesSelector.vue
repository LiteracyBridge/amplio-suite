<template>
  <div>
    <label class="visually_hidden" for="language_input">
      Select { multiple ? 'multiple' : 'one'} language
    </label>

    <!-- :value = initially selected values
         :options = set of all selectable values -->
    <multiselect
      v-if="this.supportedLanguages.length > 0"
      id="language_input"
      ref="languages"
      :value="selectedLanguages"
      :options="filteredLanguageOptions"
      :multiple="multiple"
      :close-on-select="!multiple"
      :clear-on-select="true"
      :preserve-search="false"
      :internal-search="false"
      :custom-label="(opt) => opt.name||opt.code||opt"
      label="name"
      track-by="code"
      :placeholder="placeholder"
      @select="onLanguageSelected"
      @remove="onLanguageDeleted"
      @search-change="onSearch"
    >
      <template slot="option" slot-scope="props">
        <span>{{ props.option.name }}</span>
      </template>
    </multiselect>

    <font-awesome-icon
      v-else
      icon="spinner"
      size="2x"
      pulse
      class="block w-10 h-10 mt-2 text-left"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'

import Multiselect from 'vue-multiselect'

export default {
  props: {
    options: {
      // A list of language codes: ['en', 'fr'].
      type: Array,
      default: null
    },
    languages: {
      // The initially selected language codes: ['en']
      required: true,
      type: [Array, String],
    },
    onLanguageSelected: {
      required: true,
      type: Function,
    },
    onLanguageDeleted: {
      required: true,
      type: Function,
    },
    labelBy: {
      type: String,
      default: 'code'
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true
    },
    placeholder: {
        type: String,
        default: 'Type a language to add'
    },
  },

  components: {
    Multiselect
  },

  computed: {
    ...mapState('languages', {
      // List of  [{code:'en', comment:'Popular language', name:'English'}, {code:'zed', comment:'End of the line', name:'Zebra'}]
      supportedLanguages: state => state.languages,
    }),

    selectedLanguages() {
      // List of initially selected languages, expanded to 'supportedLanguages' format, [{code:'en', comment:...}]
      if (!this.languages || this.languages === '') {
        return []
      }
      let result = []
      try {
        const languageCodes = Array.isArray(this.languages) ? this.languages : [this.languages]
        // map from codes to full info.
        result = this.mapLanguageCodesToInfo(languageCodes);
        if (result.len === 0) result = []
      } catch (ignored) {
        result = []
      }
      return result;
    },
  },

  watch: {
    supportedLanguages: {
      immediate: true,
      handler() {
        if (this.supportedLanguages.length === 0) return
        if (this.autofocus && this.supportedLanguages.length > 0) {
          this.$nextTick(() => {
            this.$refs.languages.$refs.search.focus()
          });
        }
        // Is there an options property? (list of language codes from which user can select)
        if (this.options) {
          this.allOptions = this.mapLanguageCodesToInfo(this.options);
          this.filteredLanguageOptions = [...this.allOptions]
        } else {
          this.allOptions = [...this.supportedLanguages]
          this.filteredLanguageOptions = [...this.supportedLanguages]
        }
      }
    }
  },

  data() {
    return {
      allOptions: [],
      filteredLanguageOptions: [],
    }
  },

  methods: {
    onSearch(query) {
      query = query.trim().toLowerCase()

      this.filteredLanguageOptions = this.allOptions
        .filter(lang => lang.name.toLowerCase().includes(query))
    },

    /**
     * Map a language code to a dict of {code:language-code, name:language-name, coment:whatever}
     * If a code is not found, return {code:the-code, name:the-code, comment:the-code}
     * @param codes
     * @returns {*}
     */
    mapLanguageCodesToInfo(codes) {
      const infos = codes.map((lc) => {
        let languageInfo = this.supportedLanguages.find(languageInfo => languageInfo.code === lc);
        if (!languageInfo) {
          languageInfo = {code: lc, name: lc, comment: lc}
        }
        return languageInfo
      });
      return infos;
    },

  },
}
</script>
