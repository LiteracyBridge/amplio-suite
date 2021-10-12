<template>
  <div>
    <label class="visually_hidden" for="language_input">
      Select { multiple ? 'multiple' : 'one'} language
    </label>

    <multiselect
      v-if="supportedLanguages.length > 0"
      id="language_input"
      ref="languages"
      :value="selectedLanguages"
      :options="filterLanguages"
      :multiple="multiple"
      :close-on-select="!multiple"
      :clear-on-select="true"
      :preserve-search="false"
      :internal-search="false"
      :custom-label="(opt) => opt[labelBy]"
      track-by="code"
      placeholder="Type a language to add"
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
      class="block w-10 h-10 mt-2 text-left" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  props: {
    options: {
      type: Array,
      default: null
    },
    languages: {
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
    }
  },
  computed: {
    ...mapState('languages', {
      supportedLanguages: state => state.languages,
    }),
    selectedLanguages () {
      if (!this.languages || this.languages === '') {
        return []
      }
      let result = []
      try {
        const langs = Array.isArray(this.languages) ? this.languages : [this.languages]
        result = langs.map(langCode => this.supportedLanguages.find(lang => lang.code === langCode))
        if (result.len === 0) result = []
      } catch (ignored) {
        result = []
      }
      return result;
    }
  },
  mounted() {
    this.fetchLanguages()
  },
  watch: {
    supportedLanguages: {
      immediate: true,
      handler () {
        if (this.supportedLanguages.length === 0) return

        if (this.autofocus && this.supportedLanguages.length > 0) {
          this.$nextTick(() => {
            this.$refs.languages.$refs.search.focus()
          });
        }

        if (this.options) {
          this.allOptions = this.options.map(langCode => this.supportedLanguages.find(lang => lang.code === langCode))
          this.filterLanguages = [...this.allOptions]
        }
        else  {
          this.allOptions = [...this.supportedLanguages]
          this.filterLanguages = [...this.supportedLanguages]
        }
      }
    }
  },
  data () {
    return {
      allOptions: [],
      filterLanguages: []
    }
  },
  methods: {
    ...mapActions('languages', [
      'fetchLanguages',
    ]),
    onSearch (query) {
      query = query.trim().toLowerCase()

      this.filterLanguages = this.allOptions
        .filter(lang => lang.name.toLowerCase().includes(query))
    }
  },
}
</script>
