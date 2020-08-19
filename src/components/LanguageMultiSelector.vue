<template>
  <multiselect
    v-if="supportedLanguages.length > 0"
    :value="values"
    :options="languages"
    :multiple="true"
    :close-on-select="false"
    :clear-on-select="false"
    :preserve-search="true"
    @input="(langs) => onInput(langs)"
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
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    values: {
      type: [String, Array],
      required: true
    }
  },
  computed: {
    ...mapState('program', [
      'programCode'
    ]),
    ...mapState('programData', [
      'languages'
    ]),
    ...mapState('languages', {
      supportedLanguages: state => state.languages,
    }),
  },
  components: {
    Multiselect,
  },
  mounted () {
    this.fetchLanguages()
  },
  methods: {
    ...mapActions('languages', [
      'fetchLanguages',
    ]),
    languageFromCode (code) {
      return this.supportedLanguages
        .find(language => language.code == code)
        .name
    },
    onInput (langs) {
      this.$emit('on-select', langs)
    }
  }
}
</script>
