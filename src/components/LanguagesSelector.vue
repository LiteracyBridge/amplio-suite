<template>
  <div>
    <multiselect
      v-if="supportedLanguages.length > 0"
      ref="languages"
      :value="selectedLanguages"
      :options="filterLanguages"
      :multiple="multiple"
      :close-on-select="!multiple"
      :clear-on-select="true"
      :preserve-search="false"
      :internal-search="false"
      :custom-label="({ name, code }) => code"
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

      const langs = Array.isArray(this.languages) ? this.languages : [this.languages]
      return langs.map(langCode => this.supportedLanguages.find(lang => lang.code === langCode))
    }
  },
  mounted() {
    this.fetchLanguages()
  },
  watch: {
    supportedLanguages: {
      immediate: true,
      handler () {
        if (this.autofocus && this.supportedLanguages.length > 0) {
          this.$nextTick(() => {
            this.$refs.languages.$refs.search.focus()
          });
        }

        this.filterLanguages = [...this.supportedLanguages]
      }
    }
  },
  data () {
    return {
      filterLanguages: []
    }
  },
  methods: {
    ...mapActions('languages', [
      'fetchLanguages',
    ]),
    onSearch (query) {
      this.filterLanguages = this.supportedLanguages
        .filter(lang => lang.name.toLowerCase().includes(query))
    }
  },
}
</script>
